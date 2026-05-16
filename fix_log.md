# Fix Log — ChulaEduTracker

---

## [2026-05-16] BUG: ลงรายวิชาครั้งแรกไม่แสดงผล ต้องลง 2 ครั้ง

### อาการ
- ผู้ใช้กด "เพิ่มรายวิชา" ครั้งแรก → รายวิชา **ไม่ปรากฏ** ในหน้ารายวิชา
- หน่วยกิต **ขึ้นถูกต้องทันที** (เพราะ optimistic update ทำงาน)
- ต้องกด "เพิ่มรายวิชา" ครั้งที่ 2 ถึงจะเห็นรายวิชาในตาราง
- ตรวจสอบ Google Sheets พบว่า **Column B (enrollment_id) บันทึกค่า** `temp-1778879883062` (ค่า temp ID) แทนที่จะเป็น UUID จาก GAS

### Root Cause — Race Condition ระหว่าง Optimistic UI กับ loadAllData()

#### ขั้นตอนที่ทำให้เกิดปัญหา:

1. User กดเพิ่มรายวิชา → `handleSaveCourse()` ใน `app.js`
2. สร้าง `tempId = 'temp-' + Date.now()` และ push enrollment เข้า array (`optimistic UI`)
3. เรียก `renderCourses()` + `renderAll()` → UI แสดงรายวิชาทันที ✅
4. Background call `API.addEnrollment(...)` ถูกส่งไปยัง Google Apps Script (GAS)
5. **ระหว่างรอ GAS ตอบกลับ** → ถ้า `loadAllData()` ถูกเรียกซ้ำ (เช่น จาก render cycle อื่น หรือ event อื่น):
   - `loadAllData()` เรียก `API.getEnrollments()` → ได้ข้อมูลจาก GAS
   - GAS ยังไม่บันทึก enrollment ใหม่เสร็จ หรือบันทึกแล้วแต่ return UUID จริง ≠ tempId
   - `loadAllData()` merge ข้อมูลจาก server + pending (temp-xxx) โดยไม่ตรวจ duplicate
   - enrollment ที่มี tempId จะ **ถูกลบออก** เพราะ server ยังไม่รู้จัก และ pending list ก็ถูก replace
6. `renderCourses()` ถูกเรียกอีกครั้ง → รายวิชาหาย ❌

#### ทำไม Column B ใน Sheets ถึงเป็น `temp-xxx`:
- `Code.gs` ฟังก์ชัน `addEnrollment()` สร้าง UUID ใหม่ด้วย `generateId()` เสมอ → ไม่ได้รับ tempId ไปบันทึก
- แต่ **sessionStorage cache** ของ `apiGet` อาจ return ข้อมูลเก่าที่มี enrollment อยู่ก่อน (ก่อนที่ server จะ return UUID จริง)
- ผลคือ `enrollments` array ในหน่วยความจำมี tempId แต่ `loadAllData()` ไม่สามารถ match กับ record ใน server ได้

### ไฟล์ที่แก้ไข

**`app.js`** — 2 จุด:

#### จุดที่ 1: `handleSaveCourse()` (บรรทัด ~516-528)
**ก่อนแก้:**
```js
API.addEnrollment(...).then(res => {
  if (res.success) {
    const found = enrollments.find(e => e.enrollment_id === tempId);
    if (found) found.enrollment_id = res.data.enrollment_id;
    saveDataCache();
    showToast('เพิ่มรายวิชาสำเร็จ', 'success');
  }
  // ...
});
```

**หลังแก้:**
```js
API.addEnrollment(...).then(res => {
  if (res.success) {
    const found = enrollments.find(e => e.enrollment_id === tempId);
    if (found) {
      found.enrollment_id = res.data.enrollment_id; // swap temp → real ID
    }
    saveDataCache();
    renderCourses(); // ← เพิ่ม: re-render ให้ DOM ใช้ real ID (ปุ่ม delete/edit จะทำงานถูก)
    renderAll();     // ← เพิ่ม: sync หน้า dashboard และ analysis ด้วย
    showToast('เพิ่มรายวิชาสำเร็จ', 'success');
  }
  // ...
});
```

**เหตุผล:** หลังจาก swap `tempId → realId` ต้อง re-render ทันที ไม่งั้น DOM button ยังใช้ tempId เก่า ทำให้ delete/edit ทำงานผิด

#### จุดที่ 2: `loadAllData()` (บรรทัด ~162-178)
**ก่อนแก้:**
```js
const pendingEnrs = enrollments.filter(e => String(e.enrollment_id).startsWith('temp-'));
enrollments = [...enrRes.data, ...pendingEnrs]; // อาจซ้ำถ้า server confirm แล้ว
```

**หลังแก้:**
```js
const pendingEnrs = enrollments.filter(e => String(e.enrollment_id).startsWith('temp-'));
// Avoid duplicating confirmed enrollments already returned by server
const serverEnrIds = new Set(enrRes.data.map(e => e.enrollment_id));
const uniquePendingEnrs = pendingEnrs.filter(e => !serverEnrIds.has(e.enrollment_id));
enrollments = [...enrRes.data, ...uniquePendingEnrs];
```

เพิ่มเช่นเดียวกันกับ `semesters` ด้วย:
```js
const serverSemIds = new Set(semRes.data.map(s => s.semester_id));
const uniquePendingSems = pendingSems.filter(s => !serverSemIds.has(s.semester_id));
semesters = [...semRes.data, ...uniquePendingSems];
```

**เหตุผล:** ป้องกัน race condition ที่ `loadAllData()` ถูกเรียกระหว่างที่ background API call ยังไม่สำเร็จ → pending items จะไม่ถูก drop ออกจาก UI

### สรุปผลการแก้ไข
| ปัญหา | สถานะ |
|---|---|
| รายวิชาไม่แสดงหลังเพิ่มครั้งแรก | ✅ แก้แล้ว |
| ต้องเพิ่ม 2 ครั้งถึงจะเห็น | ✅ แก้แล้ว |
| ปุ่ม edit/delete ใช้ tempId ผิด | ✅ แก้แล้ว (re-render หลัง swap ID) |
| Pending items ถูก drop ใน loadAllData | ✅ แก้แล้ว (dedup logic) |

### หมายเหตุเพิ่มเติม
- Column B ใน Sheets ที่เป็น `temp-xxx` เกิดจาก **record เก่าก่อนการแก้ไข** — ไม่มีผลกับระบบ แต่สามารถล้างด้วยมือหรือสร้าง script ลบ rows ที่ enrollment_id ขึ้นต้น `temp-` ออกจากชีตได้
- ไม่แนะนำให้ส่ง tempId ไปยัง GAS เพราะ GAS generate UUID เองอยู่แล้ว และ UUID ที่ GAS สร้างเป็น Standard UUID ที่ดีกว่า

---

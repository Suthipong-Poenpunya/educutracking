# แผนการอัปเดทระบบ ChulaEduTracker
# Update-system.md — ต่อเนื่องจาก Development.md

> **สถานะ:** Ready to Implement  
> **อ้างอิง:** Development.md (Blueprint หลัก)  
> **วันที่:** 2026-05-12  
> **อัปเดทนี้ครอบคลุม 3 ส่วนหลัก:**

---

## สารบัญ

1. [อัปเดท 1 — เพิ่มหลักสูตรวิชาเอกคอมพิวเตอร์การศึกษาในฐานข้อมูล](#1-อัปเดท-1--เพิ่มหลักสูตรวิชาเอกคอมพิวเตอร์การศึกษาในฐานข้อมูล)
2. [อัปเดท 2 — วิชาเลือกเสรี (Free Elective)](#2-อัปเดท-2--วิชาเลือกเสรี-free-elective)
3. [อัปเดท 3 — ระบบ OCR สแกนใบเกรด](#3-อัปเดท-3--ระบบ-ocr-สแกนใบเกรด)
4. [การเปลี่ยนแปลง Schema สรุป](#4-การเปลี่ยนแปลง-schema-สรุป)
5. [Implementation Roadmap อัปเดท](#5-implementation-roadmap-อัปเดท)

---

## 1. อัปเดท 1 — เพิ่มหลักสูตรวิชาเอกคอมพิวเตอร์การศึกษาในฐานข้อมูล

### 1.1 ภาพรวมและ Logic

นิสิตเอกเทคโนโลยีการศึกษา **สามารถลงทะเบียนวิชาของเอกคอมพิวเตอร์การศึกษาได้ทั้งหมด** และนับหน่วยกิตเข้าหมวด **วิชาเอกเลือก (MAJOR_ELEC)** ของตัวเอง

```
วิชาเอกคอมฯ → นับเป็น MAJOR_ELEC_CS (sub-bucket ใหม่)
                ↓
         นับรวมกับ MAJOR_ELEC1 + MAJOR_ELEC2
                ↓  
         รวมต้องได้ครบ 20 นก.
```

> **หมายเหตุสำคัญ:** วิชาบางตัวมีรหัสซ้ำกันระหว่างเอกเทคโนฯ กับเอกคอมฯ (เช่น 2766224, 2766421) ระบบต้องจัดการ deduplication และ dual-mapping

---

### 1.2 หลักสูตรวิชาเอกคอมพิวเตอร์การศึกษา 60 หน่วยกิต (เอกเดี่ยว)

#### 1.2.1 รายวิชาบังคับ (40 หน่วยกิต)

| # | รหัสวิชา | ชื่อรายวิชา | นก. | ปีที่แนะนำ | หมายเหตุ |
|---|---------|------------|-----|-----------|---------|
| 1 | 2110101 | การทำโปรแกรมคอมพิวเตอร์ | 3 | ปี 1 ต้น | CS เท่านั้น |
| 2 | 2301101 | แคลคูลัส 1 | 4 | ปี 1 ต้น | CS เท่านั้น |
| 3 | 2765127 | วิทยาศาสตร์พื้นฐานสำหรับเทคโนโลยี | 2 | ปี 1 ปลาย | CS เท่านั้น |
| 4 | 2766125 | การพัฒนาบทเรียนมัลติมีเดีย | 3 | ปี 1 ปลาย | CS เท่านั้น |
| 5 | 2766224 | การเขียนโปรแกรมเพื่อการศึกษา | 3 | ปี 2 ต้น | ⚠ ซ้ำกับ ET MAJOR_CORE |
| 6 | 2766233 | พื้นฐานหลักการระบบฐานข้อมูลและการทำข้อมูลให้เป็นภาพ | 3 | ปี 2 ต้น | CS เท่านั้น |
| 7 | 2766334 | การเขียนโปรแกรมภาษาเพื่อการควบคุม: หุ่นยนต์ศึกษา | 3 | ปี 2 ปลาย | CS เท่านั้น |
| 8 | 2766355 | ระบบสื่อสารข้อมูลและเครือข่ายคอมพิวเตอร์ | 3 | ปี 2 ปลาย | ⚠ ซ้ำกับ ET MAJOR_ELEC1_CS |
| 9 | 2766374 | การวิเคราะห์และออกแบบระบบสารสนเทศทางการศึกษา | 3 | ปี 3 ต้น | CS เท่านั้น |
| 10 | 2766417 | วิธีวิทยาการสอนวิทยาการคำนวณ | 3 | ปี 3 ต้น | CS เท่านั้น |
| 11 | 2766420 | โครงงานวิจัยและนวัตกรรมคอมพิวเตอร์ศึกษา 1 | 3 | ปี 3 ปลาย | CS เท่านั้น |
| 12 | 2766421 | การออกแบบเทคโนโลยี | 3 | ปี 3 ปลาย | ⚠ ซ้ำกับ ET MAJOR_CORE |
| 13 | 2766440 | โครงงานวิจัยและนวัตกรรมคอมพิวเตอร์ศึกษา 2 | 4 | ปี 4 ต้น | CS เท่านั้น |

#### 1.2.2 รายวิชาเลือก (20 หน่วยกิต) — เลือกจากรายการต่อไปนี้

| # | รหัสวิชา | ชื่อรายวิชา | นก. | หมายเหตุ |
|---|---------|------------|-----|---------|
| 1 | 2102213 | ทฤษฎีวงจรไฟฟ้า 1 และปฏิบัติการ | 4 | CS เท่านั้น |
| 2 | 2110327 | การออกแบบอัลกอริทึม | 3 | CS เท่านั้น |
| 3 | 2110352 | สถาปัตยกรรมระบบคอมพิวเตอร์ | 3 | CS เท่านั้น |
| 4 | 2110428 | ความรู้เบื้องต้นเกี่ยวกับการทำเหมืองข้อมูล | 3 | CS เท่านั้น |
| 5 | 2110431 | วิทยาการภาพดิจิทัลเบื้องต้น | 3 | CS เท่านั้น |
| 6 | 2110435 | วิทยาการหุ่นยนต์เบื้องต้น | 3 | CS เท่านั้น |
| 7 | 2110442 | การวิเคราะห์และโปรแกรมเชิงวัตถุ | 3 | CS เท่านั้น |
| 8 | 2110443 | ปฏิสัมพันธ์ของมนุษย์กับคอมพิวเตอร์ | 3 | CS เท่านั้น |
| 9 | 2110481 | เครือข่ายคอมพิวเตอร์ไร้สาย | 3 | CS เท่านั้น |
| 10 | 2110511 | การเขียนโปรแกรมเกม | 3 | CS เท่านั้น |
| 11 | 2301371 | ระบบปฏิบัติการ | 3 | CS เท่านั้น |
| 12 | 2603284 | สถิติสำหรับวิทยาศาสตร์กายภาพ | 3 | CS เท่านั้น |
| 13 | 2603376 | การค้นพบองค์ความรู้และการทำเหมืองข้อมูล | 3 | CS เท่านั้น |
| 14 | 2765219 | การถ่ายภาพเพื่อการสื่อสารทางการศึกษา | 3 | ⚠ ซ้ำกับ ET MAJOR_CORE |
| 15 | 2765220 | การผลิตวีดิทัศน์การศึกษา | 3 | CS เท่านั้น (ET มีแต่ไม่ได้ list ซ้ำ) |
| 16 | 2766218 | คอมพิวเตอร์และเทคโนโลยีสารสนเทศสำหรับครูประถมศึกษา | 3 | ⚠ ซ้ำกับ ET MAJOR_ELEC1_CS |
| 17 | 2766220 | คณิตศาสตร์สำหรับคอมพิวเตอร์การศึกษา | 3 | CS เท่านั้น |
| 18 | 2766226 | การพัฒนาสื่อผสานความเป็นจริง | 3 | CS เท่านั้น |
| 19 | 2766231 | โครงสร้างข้อมูลและขั้นตอนวิธีสำหรับครูวิทยาการคำนวณ | 3 | CS เท่านั้น |
| 20 | 2766240 | เทคโนโลยีสำหรับผู้เรียนที่มีความต้องการพิเศษและการเรียนรวม | 3 | CS เท่านั้น |
| 21 | 2766321 | พื้นฐานวิทยาการข้อมูลเพื่อการศึกษา | 3 | CS เท่านั้น |
| 22 | 2766336 | ระบบคอมพิวเตอร์ เครือข่ายและการบำรุงรักษา | 3 | CS เท่านั้น |
| 23 | 2766361 | การบูรณาการโปรแกรมประยุกต์เพื่อการสอน | 3 | CS เท่านั้น |
| 24 | 2766362 | การออกแบบแพลตฟอร์มการเรียนรู้ | 3 | ⚠ ซ้ำกับ ET MAJOR_ELEC1_CS |
| 25 | 2766365 | อินเทอร์เน็ตสำหรับสรรพสิ่งการเรียนรู้ | 3 | CS เท่านั้น |
| 26 | 2766381 | ปัญญาประดิษฐ์สำหรับการศึกษา | 3 | CS เท่านั้น |
| 27 | 2766384 | การควบคุมการปฏิบัติงานระยะไกลเพื่อการศึกษา | 3 | ⚠ ซ้ำกับ ET MAJOR_ELEC1_CS |
| 28 | 2766394 | โปรแกรมโมบายเลิร์นนิง | 3 | CS เท่านั้น |
| 29 | 2766395 | การเขียนโปรแกรมภาษาที่ทันสมัย | 3 | CS เท่านั้น |
| 30 | 2766437 | เกมคอมพิวเตอร์ | 3 | CS เท่านั้น |

---

### 1.3 การเปลี่ยนแปลง Schema — Sheet4: `Curriculum`

เพิ่ม column ใหม่ 1 ตัว:

| Column | Field | Type | Description | เปลี่ยนแปลง |
|--------|-------|------|-------------|------------|
| K | `source_major` | STRING | `"ET"` / `"CS"` / `"BOTH"` | **ใหม่** |

**ค่า `source_major`:**
- `"ET"` = วิชาเฉพาะเอกเทคโนฯ
- `"CS"` = วิชาเฉพาะเอกคอมฯ
- `"BOTH"` = อยู่ในหลักสูตรทั้งสอง (2766224, 2766421, 2766355, 2766362, 2766384, 2766218, 2765219)

**ค่า `category` สำหรับวิชา CS ใหม่:**

| ประเภทวิชา | category | subcategory |
|-----------|----------|-------------|
| CS บังคับ (ไม่ซ้ำกับ ET) | `MAJOR_CS_CORE` | — |
| CS เลือก (ไม่ซ้ำกับ ET) | `MAJOR_CS_ELEC` | — |
| วิชาซ้ำทั้งสองเอก | ใช้ค่าเดิม ET | — |

---

### 1.4 การเปลี่ยนแปลง Logic — Category Rules

เพิ่ม bucket ใหม่ใน `CATEGORY_RULES` (calculator.js):

```javascript
const CATEGORY_RULES = {
  // ... (เดิมทั้งหมด)

  // ใหม่: วิชาเอกคอมฯ ที่ ET student ลงเรียนข้าม
  MAJOR_CS_CORE: {
    label: "วิชาเอกคอมฯ บังคับ (ลงข้ามเอก)",
    countsToward: "MAJOR_ELEC_CS"  // นับรวมกับ elec pool
  },
  MAJOR_CS_ELEC: {
    label: "วิชาเอกคอมฯ เลือก (ลงข้ามเอก)",
    countsToward: "MAJOR_ELEC_CS"
  },
  MAJOR_ELEC_CS: {
    label: "วิชาเอกคอมฯ รวม (นับเป็นหน่วยกิตเลือก)",
    // นับรวมกับ MAJOR_ELEC1 + MAJOR_ELEC2 เพื่อให้ถึง 20 นก.
  }
};
```

**อัปเดท `calcProgress()` — การนับหน่วยกิตเอกเลือก:**

```javascript
// ใน calcProgress() — เพิ่ม CS bucket
const majorElecCS  = { earned: earned['MAJOR_CS_CORE']  || 0 +
                                earned['MAJOR_CS_ELEC']  || 0 };

// รวม elec ทั้งหมด (ET elec1 + ET elec2 + CS cross-enroll)
const majorElecTotal = majorElec1.earned + majorElec2.earned + majorElecCS.earned;

// ตรวจเงื่อนไขจบ
canGraduate: (
  // ... (เดิม)
  majorElecTotal >= 20      // รวมทุก bucket ให้ครบ 20 นก.
)
```

---

### 1.5 การเปลี่ยนแปลง UI

**Tab "บันทึกวิชา" → Modal เพิ่มวิชา:**

เพิ่มตัวเลือกในช่อง "ประเภทวิชา":

```
ประเภท: (●) วิชาในหลักสูตร  (○) กรอกเอง (Gen-Ed/เลือกเสรี)

  [วิชาในหลักสูตร]
  หลักสูตร: (● ET เทคโนฯ)  (○ CS คอมฯ)   ← ใหม่
  ค้นหา: [_______________] → Dropdown รายวิชา
  
  ⚠ หากเลือก CS → ระบบจะนับเป็น "เอกเลือก CS" อัตโนมัติ
```

---

### 1.6 Data Seed — CS Courses ที่ต้องเพิ่มเข้า Sheet4

```
course_code | course_name                                        | credits | category       | is_required | rec_year | rec_sem | prerequisite | subcategory | program | source_major
2110101     | การทำโปรแกรมคอมพิวเตอร์                           | 3       | MAJOR_CS_CORE  | TRUE        | 1        | 1       |              |             | cs      | CS
2301101     | แคลคูลัส 1                                         | 4       | MAJOR_CS_CORE  | TRUE        | 1        | 1       |              |             | cs      | CS
2765127     | วิทยาศาสตร์พื้นฐานสำหรับเทคโนโลยี                | 2       | MAJOR_CS_CORE  | TRUE        | 1        | 2       |              |             | cs      | CS
2766125     | การพัฒนาบทเรียนมัลติมีเดีย                        | 3       | MAJOR_CS_CORE  | TRUE        | 1        | 2       |              |             | cs      | CS
2766224     | การเขียนโปรแกรมเพื่อการศึกษา                      | 3       | MAJOR_CORE     | TRUE        | 2        | 1       |              |             | both    | BOTH
2766233     | พื้นฐานหลักการระบบฐานข้อมูลและการทำข้อมูลให้เป็นภาพ | 3    | MAJOR_CS_CORE  | TRUE        | 2        | 1       |              |             | cs      | CS
2766334     | การเขียนโปรแกรมภาษาเพื่อการควบคุม: หุ่นยนต์ศึกษา | 3     | MAJOR_CS_CORE  | TRUE        | 2        | 2       |              |             | cs      | CS
2766355     | ระบบสื่อสารข้อมูลและเครือข่ายคอมพิวเตอร์           | 3       | MAJOR_ELEC1    | FALSE       | 2        | 2       |              | MAJOR_ELEC1_CS | both | BOTH
2766374     | การวิเคราะห์และออกแบบระบบสารสนเทศทางการศึกษา      | 3       | MAJOR_CS_CORE  | TRUE        | 3        | 1       |              |             | cs      | CS
2766417     | วิธีวิทยาการสอนวิทยาการคำนวณ                      | 3       | MAJOR_CS_CORE  | TRUE        | 3        | 1       |              |             | cs      | CS
2766420     | โครงงานวิจัยและนวัตกรรมคอมพิวเตอร์ศึกษา 1         | 3       | MAJOR_CS_CORE  | TRUE        | 3        | 2       | 2766224      |             | cs      | CS
2766421     | การออกแบบเทคโนโลยี                                | 3       | MAJOR_CORE     | TRUE        | 3        | 1       |              |             | both    | BOTH
2766440     | โครงงานวิจัยและนวัตกรรมคอมพิวเตอร์ศึกษา 2         | 4       | MAJOR_CS_CORE  | TRUE        | 4        | 1       | 2766420      |             | cs      | CS
2102213     | ทฤษฎีวงจรไฟฟ้า 1 และปฏิบัติการ                    | 4       | MAJOR_CS_ELEC  | FALSE       | 0        | 0       |              |             | cs      | CS
2110327     | การออกแบบอัลกอริทึม                               | 3       | MAJOR_CS_ELEC  | FALSE       | 0        | 0       |              |             | cs      | CS
2110352     | สถาปัตยกรรมระบบคอมพิวเตอร์                        | 3       | MAJOR_CS_ELEC  | FALSE       | 0        | 0       |              |             | cs      | CS
2110428     | ความรู้เบื้องต้นเกี่ยวกับการทำเหมืองข้อมูล       | 3       | MAJOR_CS_ELEC  | FALSE       | 0        | 0       |              |             | cs      | CS
2110431     | วิทยาการภาพดิจิทัลเบื้องต้น                       | 3       | MAJOR_CS_ELEC  | FALSE       | 0        | 0       |              |             | cs      | CS
2110435     | วิทยาการหุ่นยนต์เบื้องต้น                         | 3       | MAJOR_CS_ELEC  | FALSE       | 0        | 0       |              |             | cs      | CS
2110442     | การวิเคราะห์และโปรแกรมเชิงวัตถุ                   | 3       | MAJOR_CS_ELEC  | FALSE       | 0        | 0       |              |             | cs      | CS
2110443     | ปฏิสัมพันธ์ของมนุษย์กับคอมพิวเตอร์                | 3       | MAJOR_CS_ELEC  | FALSE       | 0        | 0       |              |             | cs      | CS
2110481     | เครือข่ายคอมพิวเตอร์ไร้สาย                        | 3       | MAJOR_CS_ELEC  | FALSE       | 0        | 0       |              |             | cs      | CS
2110511     | การเขียนโปรแกรมเกม                                | 3       | MAJOR_CS_ELEC  | FALSE       | 0        | 0       |              |             | cs      | CS
2301371     | ระบบปฏิบัติการ                                    | 3       | MAJOR_CS_ELEC  | FALSE       | 0        | 0       |              |             | cs      | CS
2603284     | สถิติสำหรับวิทยาศาสตร์กายภาพ                     | 3       | MAJOR_CS_ELEC  | FALSE       | 0        | 0       |              |             | cs      | CS
2603376     | การค้นพบองค์ความรู้และการทำเหมืองข้อมูล           | 3       | MAJOR_CS_ELEC  | FALSE       | 0        | 0       |              |             | cs      | CS
2766218     | คอมพิวเตอร์และเทคโนโลยีสารสนเทศสำหรับครูประถมศึกษา | 3   | MAJOR_ELEC1    | FALSE       | 0        | 0       |              | MAJOR_ELEC1_CS | both | BOTH
2766220     | คณิตศาสตร์สำหรับคอมพิวเตอร์การศึกษา              | 3       | MAJOR_CS_ELEC  | FALSE       | 0        | 0       |              |             | cs      | CS
2766226     | การพัฒนาสื่อผสานความเป็นจริง                      | 3       | MAJOR_CS_ELEC  | FALSE       | 0        | 0       |              |             | cs      | CS
2766231     | โครงสร้างข้อมูลและขั้นตอนวิธีสำหรับครูวิทยาการคำนวณ | 3  | MAJOR_CS_ELEC  | FALSE       | 0        | 0       |              |             | cs      | CS
2766240     | เทคโนโลยีสำหรับผู้เรียนที่มีความต้องการพิเศษและการเรียนรวม | 3 | MAJOR_CS_ELEC | FALSE | 0   | 0       |              |             | cs      | CS
2766321     | พื้นฐานวิทยาการข้อมูลเพื่อการศึกษา               | 3       | MAJOR_CS_ELEC  | FALSE       | 0        | 0       |              |             | cs      | CS
2766336     | ระบบคอมพิวเตอร์ เครือข่ายและการบำรุงรักษา         | 3       | MAJOR_CS_ELEC  | FALSE       | 0        | 0       |              |             | cs      | CS
2766361     | การบูรณาการโปรแกรมประยุกต์เพื่อการสอน            | 3       | MAJOR_CS_ELEC  | FALSE       | 0        | 0       |              |             | cs      | CS
2766362     | การออกแบบแพลตฟอร์มการเรียนรู้                    | 3       | MAJOR_ELEC1    | FALSE       | 0        | 0       |              | MAJOR_ELEC1_CS | both | BOTH
2766365     | อินเทอร์เน็ตสำหรับสรรพสิ่งการเรียนรู้            | 3       | MAJOR_CS_ELEC  | FALSE       | 0        | 0       |              |             | cs      | CS
2766381     | ปัญญาประดิษฐ์สำหรับการศึกษา                      | 3       | MAJOR_CS_ELEC  | FALSE       | 0        | 0       |              |             | cs      | CS
2766384     | การควบคุมการปฏิบัติงานระยะไกลเพื่อการศึกษา       | 3       | MAJOR_ELEC1    | FALSE       | 0        | 0       |              | MAJOR_ELEC1_CS | both | BOTH
2766394     | โปรแกรมโมบายเลิร์นนิง                            | 3       | MAJOR_CS_ELEC  | FALSE       | 0        | 0       |              |             | cs      | CS
2766395     | การเขียนโปรแกรมภาษาที่ทันสมัย                    | 3       | MAJOR_CS_ELEC  | FALSE       | 0        | 0       |              |             | cs      | CS
2766437     | เกมคอมพิวเตอร์                                    | 3       | MAJOR_CS_ELEC  | FALSE       | 0        | 0       |              |             | cs      | CS
```

---

## 2. อัปเดท 2 — วิชาเลือกเสรี (Free Elective)

### 2.1 ภาพรวม

วิชาเลือกเสรีเรียนอะไรก็ได้ ไม่มี course_code ตายตัวในระบบ → **กรอกเองทั้งหมด เหมือน Gen-Ed** ไม่ต้องเพิ่มข้อมูลใน Curriculum sheet

> หมายเหตุ: หลักสูตรเอกเทคโนฯ (เอกเดี่ยว) ไม่ได้กำหนดวิชาเลือกเสรีขั้นต่ำในจำนวน 126 นก. แต่นิสิตบางคนอาจลงเกินหน่วยกิตขั้นต่ำ ระบบควรบันทึกได้แต่ไม่นำไปนับความก้าวหน้า

### 2.2 Category ใหม่

เพิ่ม category `FREE_ELEC` ใน Enrollments sheet (col H)

| Category | ความหมาย | นับเข้าหมวด |
|----------|---------|------------|
| `FREE_ELEC` | วิชาเลือกเสรี | แสดงแยก ไม่นับเข้า 126 นก. |

### 2.3 การเปลี่ยนแปลง UI — Modal เพิ่มวิชา

```
ประเภท: (○) วิชาในหลักสูตร  (●) กรอกเอง
         
  โหมดกรอกเอง — เลือกหมวด:
  [Dropdown ▼]
  ├── Gen-Ed: สังคมศาสตร์
  ├── Gen-Ed: วิทยาศาสตร์และคณิตศาสตร์
  ├── Gen-Ed: มนุษยศาสตร์
  ├── Gen-Ed: สหศาสตร์
  ├── Gen-Ed: ภาษาต่างประเทศ
  ├── Gen-Ed: กลุ่มพิเศษ
  └── ✦ วิชาเลือกเสรี  ← ใหม่

  รหัสวิชา: [_________]  (optional)
  ชื่อวิชา: [__________________________] (required)
  หน่วยกิต: [__]
  เกรด:     [A ▼]
```

### 2.4 การเปลี่ยนแปลง Dashboard

เพิ่มแถวในตาราง Progress:

```
Gen-Ed          ██████████████  30/30 นก. ✅
วิชาครู         ████████░░░░░░  20/36 นก.
วิชาเอกบังคับ  ██████████░░░░  28/40 นก.
วิชาเอกเลือก   ████░░░░░░░░░░   8/20 นก.
─────────────────────────────────────────
วิชาเลือกเสรี  ████            6 นก. (ไม่นับเข้าเป้า) ← ใหม่
```

### 2.5 การเปลี่ยนแปลง Apps Script API

ไม่ต้องเปลี่ยนแปลง API เพราะ `addEnrollment` endpoint รับ `category` เป็น string อยู่แล้ว เพียงแค่ส่งค่า `"FREE_ELEC"` ได้เลย

---

## 3. อัปเดท 3 — ระบบ OCR สแกนใบเกรด

### 3.1 ภาพรวมระบบ

```
[ผู้ใช้อัปโหลด PDF ใบเกรด]
         │
         ▼
[PDF.js — อ่าน text layer จาก PDF]
         │
         ▼
[Parser — แยก semester / course rows / summary]
         │
         ▼
[Matcher — จับคู่ course_code กับ Curriculum DB]
         │
         ├── match found → ดึงชื่อวิชา / หมวด / นก. อัตโนมัติ
         └── not found   → flag สีเหลือง → ให้ user เลือกหมวดเอง
         │
         ▼
[Preview Table — user ตรวจสอบก่อน import]
         │
         ▼
[บันทึกลง Enrollments Sheet ทั้งหมด]
```

---

### 3.2 Format ใบเกรด CU (อ้างอิงจาก Sample จริง)

ใบเกรดจุฬาฯ ที่ export เป็น PDF มี format ดังนี้:

```
1ST SEMESTER 2024
0299001    DIG DATA AI                          3.0   S
2313210    VISUAL MEDIA TECH                    3.0   S
2746192    ORIENTATION EDU                      2.0   A
...
CA     CG     GPA    CAX    CGX    GPAX   GPX
14.00  21.00  3.57   14.00  21.00  3.57   50.00

2ND SEMESTER 2024
2313213    DIGITAL PHOTO                        3.0   S
...
```

**สิ่งที่ต้องระวัง:**
- บางวิชามี Grade `S` (Satisfactory) → ไม่นับ GPA แต่ได้หน่วยกิต
- วิชากีฬา (เช่น `3900108 SP ACT-BOXING`) → ระบบไม่รู้จัก → flag สีเหลือง
- วิชา Gen-Ed ที่ไม่ได้อยู่ใน Curriculum → flag สีเหลือง
- Column ปี: `1ST SEMESTER 2024` ในใบเกรด = ปีการศึกษา CE ต้องแปลงเป็น พ.ศ.

---

### 3.3 Semester Year Conversion

```javascript
// ใบเกรดใช้ปี ค.ศ. (CE) → ระบบใช้ พ.ศ. (BE)
// 1ST SEMESTER 2024 → academicYear: 2567, semester: 1
// 2ND SEMESTER 2024 → academicYear: 2567, semester: 2
// 3RD SEMESTER 2024 → academicYear: 2567, semester: 3 (ฤดูร้อน)
// 1ST SEMESTER 2025 → academicYear: 2568, semester: 1

function convertSemesterFromGradeReport(ordinal, ceYear) {
  const beYear = parseInt(ceYear) + 543;
  const semMap = { '1ST': 1, '2ND': 2, '3RD': 3, '4TH': 3 };
  return {
    academicYear: beYear,
    semester: semMap[ordinal] || 1
  };
}
```

---

### 3.4 OCR Parser Algorithm

```javascript
// ============================================================
// ocr-parser.js — CU Grade Report PDF Parser
// ============================================================

/**
 * Main entry point
 * @param {string} pdfText - raw text extracted from PDF via PDF.js
 * @returns {ParsedGradeReport}
 */
function parseGradeReport(pdfText) {
  const lines = pdfText.split('\n').map(l => l.trim()).filter(Boolean);
  
  const result = {
    studentName:  extractStudentName(lines),
    studentId:    extractStudentId(lines),
    semesters:    []
  };

  let currentSem = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // ตรวจหัว semester
    const semMatch = line.match(/^(1ST|2ND|3RD|4TH)\s+SEMESTER\s+(\d{4})$/i);
    if (semMatch) {
      if (currentSem) result.semesters.push(currentSem);
      const { academicYear, semester } = convertSemesterFromGradeReport(
        semMatch[1].toUpperCase(), semMatch[2]
      );
      currentSem = { academicYear, semester, courses: [], summary: null };
      continue;
    }

    // ตรวจ course row: 7 digits + name + credits + grade
    // pattern: "2765133    LRN PSY ED TECH    2.0    A"
    const courseMatch = line.match(/^(\d{7})\s+(.+?)\s+(\d+\.\d+)\s+([A-Z+]+)$/);
    if (courseMatch && currentSem) {
      currentSem.courses.push({
        course_code:      courseMatch[1],
        abbreviated_name: courseMatch[2].trim(),
        credits:          parseFloat(courseMatch[3]),
        grade:            courseMatch[4],
        matched:          false,   // จะ resolve ภายหลัง
        course_name:      null,
        category:         null,
      });
      continue;
    }

    // ตรวจ summary row: 7 ตัวเลข (CA CG GPA CAX CGX GPAX GPX)
    const summaryMatch = line.match(
      /^(\d+\.\d{2})\s+(\d+\.\d{2})\s+(\d+\.\d{2})\s+(\d+\.\d{2})\s+(\d+\.\d{2})\s+(\d+\.\d{2})\s+(\d+\.\d{2})$/
    );
    if (summaryMatch && currentSem) {
      currentSem.summary = {
        CA: parseFloat(summaryMatch[1]),
        CG: parseFloat(summaryMatch[2]),
        GPA: parseFloat(summaryMatch[3]),
        CAX: parseFloat(summaryMatch[4]),
        CGX: parseFloat(summaryMatch[5]),
        GPAX: parseFloat(summaryMatch[6]),
        GPX: parseFloat(summaryMatch[7]),
      };
      continue;
    }
  }

  // push semester สุดท้าย
  if (currentSem) result.semesters.push(currentSem);

  return result;
}

/**
 * จับคู่ course_code กับ Curriculum data
 * @param {ParsedGradeReport} parsed
 * @param {CurriculumRow[]} curriculum - จาก getCurriculum API
 * @returns {ParsedGradeReport} — พร้อม matched fields
 */
function matchWithCurriculum(parsed, curriculum) {
  const currMap = new Map(curriculum.map(c => [c.course_code, c]));

  parsed.semesters.forEach(sem => {
    sem.courses.forEach(course => {
      const found = currMap.get(course.course_code);
      if (found) {
        course.course_name = found.course_name;
        course.category    = found.category;
        course.credits     = found.credits; // ใช้จาก DB (กัน typo)
        course.matched     = true;
      } else {
        // ไม่รู้จัก — ให้ผู้ใช้เลือกหมวดเอง
        course.matched     = false;
        course.needsReview = true;
      }
    });
  });

  return parsed;
}
```

---

### 3.5 Student Name / ID Extraction

```javascript
function extractStudentName(lines) {
  // pattern: "Name  Mr. Firstname Lastname"
  for (const line of lines) {
    const m = line.match(/^Name\s+(.+?)\s+Student ID/i);
    if (m) return m[1].trim();
  }
  return null;
}

function extractStudentId(lines) {
  // pattern: "Student ID.  674 24226 27"
  for (const line of lines) {
    const m = line.match(/Student ID\.?\s+([\d\s]+)/i);
    if (m) return m[1].replace(/\s+/g, '').trim();
  }
  return null;
}
```

---

### 3.6 UI Flow — ขั้นตอนการ Import

```
┌──────────────────────────────────────────────────────────┐
│  📄 นำเข้าจากใบเกรด (OCR)                         [✕]  │
│                                                          │
│  ขั้นตอน 1: อัปโหลดไฟล์                                │
│  ┌─────────────────────────────────────────────────┐    │
│  │  ลากไฟล์มาวาง หรือ [เลือกไฟล์ PDF]             │    │
│  │  รองรับ: ใบเกรด PDF จาก CU REG เท่านั้น         │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ขั้นตอน 2: ตรวจสอบข้อมูลที่ดึงมา                     │
│                                                          │
│  ▼ ภาค 1/2567 (1ST SEMESTER 2024)                       │
│  ┌──────────┬───────────────────────┬─────┬──────┬───┐  │
│  │ รหัสวิชา │ ชื่อวิชา             │ นก. │เกรด │ หมวด│  │
│  ├──────────┼───────────────────────┼─────┼──────┼───┤  │
│  │ 2746192  │ ปฐมนิเทศการศึกษา     │  2  │  A   │ครู│  │
│  │ 2765133  │ ทฤษฎีการเรียนการสอนฯ │  2  │  A   │เอก│  │
│  │ 2766224  │ การเขียนโปรแกรมฯ     │  3  │  A   │เอก│  │
│  │ 5500111  │ ภาษาอังกฤษฯ 1        │  3  │  C   │GE │  │
│  │ 0299001  │ DIG DATA AI ❓        │  3  │  S   │[เลือก ▼]│ ← ไม่รู้จัก
│  │ 3900108  │ SP ACT-BOXING ❓      │  1  │  A   │[เลือก ▼]│ ← ไม่รู้จัก
│  └──────────┴───────────────────────┴─────┴──────┴───┘  │
│                                                          │
│  ⚠ พบ 2 วิชาที่ระบบไม่รู้จัก กรุณาเลือกหมวดก่อน import│
│                                                          │
│  [◀ ย้อนกลับ]                        [นำเข้าข้อมูล ▶]  │
└──────────────────────────────────────────────────────────┘
```

**Dropdown สำหรับวิชาไม่รู้จัก:**
```
เลือกหมวดวิชา:
├── Gen-Ed: สังคมศาสตร์
├── Gen-Ed: วิทยาศาสตร์และคณิตศาสตร์
├── Gen-Ed: มนุษยศาสตร์
├── Gen-Ed: สหศาสตร์
├── Gen-Ed: ภาษาต่างประเทศ
├── Gen-Ed: กลุ่มพิเศษ
├── วิชาเลือกเสรี
└── ข้ามวิชานี้ (ไม่ import)
```

---

### 3.7 ไฟล์ใหม่ที่ต้องเพิ่ม

```
/
├── ocr-parser.js     ← parser + matcher (ส่วน 3.4–3.5 ด้านบน)
├── ocr-ui.js         ← UI logic สำหรับ import flow
└── lib/
    └── pdf.min.js    ← PDF.js library (CDN หรือ local)
```

**โหลด PDF.js:**
```html
<!-- ใน index.html -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script>
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
</script>
```

**ฟังก์ชัน extractTextFromPDF:**
```javascript
async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    // เรียง items ตาม y-position แล้ว x-position เพื่อให้ได้ order ที่ถูกต้อง
    const items = content.items
      .sort((a, b) => Math.round(b.transform[5]) - Math.round(a.transform[5]) || a.transform[4] - b.transform[4]);
    
    let lastY = null;
    for (const item of items) {
      const y = Math.round(item.transform[5]);
      if (lastY !== null && lastY !== y) fullText += '\n';
      fullText += item.str + ' ';
      lastY = y;
    }
    fullText += '\n';
  }
  
  return fullText;
}
```

---

### 3.8 Apps Script — Endpoint ใหม่ สำหรับ Batch Import

เพิ่ม action ใน Code.gs:

```javascript
// POST action ใหม่
case 'batchAddEnrollments': result = batchAddEnrollments(payload); break;

// Implementation
function batchAddEnrollments(payload) {
  // payload.enrollments = Array ของ enrollment objects
  // payload.userId, payload.semesterMappings = [{ ceYear, ordinal, semesterId }]
  
  const sheet = getSheet(SHEET.ENROLLMENTS);
  const results = [];
  
  for (const enr of payload.enrollments) {
    const id = generateId();
    sheet.appendRow([
      id, enr.semesterId, payload.userId,
      enr.course_code, enr.course_name, enr.credits,
      enr.grade, enr.category, true,  // is_manual = true สำหรับ OCR import
      new Date().toISOString()
    ]);
    results.push({ enrollment_id: id, course_code: enr.course_code });
  }
  
  return { success: true, data: { imported: results.length, details: results } };
}
```

---

## 4. การเปลี่ยนแปลง Schema สรุป

### Sheet4: `Curriculum` — เพิ่ม Column K

| Column | Field | Type | ค่าที่เป็นไปได้ |
|--------|-------|------|--------------|
| K | `source_major` | STRING | `"ET"` / `"CS"` / `"BOTH"` |

### Sheet3: `Enrollments` — Category ใหม่

เพิ่ม category ที่ถูกต้องใน col H:

| Category ใหม่ | ความหมาย |
|--------------|---------|
| `MAJOR_CS_CORE` | วิชาเอกคอมฯ บังคับ (ET ลงข้ามเอก) |
| `MAJOR_CS_ELEC` | วิชาเอกคอมฯ เลือก (ET ลงข้ามเอก) |
| `FREE_ELEC` | วิชาเลือกเสรี |

### ไฟล์ Frontend ใหม่

| ไฟล์ | หน้าที่ |
|------|---------|
| `ocr-parser.js` | แปลง PDF text → structured data |
| `ocr-ui.js` | UI flow สำหรับ import |
| `lib/pdf.min.js` | PDF.js (text extraction) |

---

## 5. Implementation Roadmap อัปเดท

### Phase A: Database (สัปดาห์ 1)

- [ ] เพิ่ม Column K `source_major` ใน Sheet4
- [ ] กรอก Data Seed วิชาเอกคอมฯ ทั้งหมด (43 rows ใหม่) ตามตาราง Section 1.6
- [ ] อัปเดท `getCurriculum` endpoint ให้ filter ตาม `source_major` ได้
- [ ] เพิ่ม `batchAddEnrollments` endpoint ใน Code.gs

### Phase B: CS Major Logic (สัปดาห์ 1-2)

- [ ] อัปเดท `CATEGORY_RULES` ใน calculator.js — เพิ่ม CS buckets
- [ ] อัปเดท `calcProgress()` — รวม `MAJOR_CS_CORE` + `MAJOR_CS_ELEC` เข้า elec pool
- [ ] อัปเดท `canGraduate` logic — คำนึงถึง CS cross-enrollment
- [ ] อัปเดท Modal UI — เพิ่มตัวเลือก "หลักสูตร ET / CS"

### Phase C: Free Elective (สัปดาห์ 2)

- [ ] เพิ่ม `FREE_ELEC` ใน dropdown หมวดวิชาของ Manual Entry Modal
- [ ] อัปเดท Dashboard — แสดง FREE_ELEC แยก ไม่นับรวม 126 นก.
- [ ] อัปเดท Graduation Check — ไม่นับ FREE_ELEC เป็น requirement

### Phase D: OCR System (สัปดาห์ 2-3)

- [ ] เพิ่ม PDF.js ลงใน index.html
- [ ] เขียน `ocr-parser.js` (parser + matcher)
- [ ] เขียน `ocr-ui.js` (upload modal + preview table)
- [ ] ทดสอบกับ sample grade report
- [ ] Handle edge cases: วิชาไม่รู้จัก, วิชา S grade, วิชากีฬา
- [ ] Integration test: import → ดู dashboard อัปเดทถูกต้อง

### Phase E: Test & Polish (สัปดาห์ 3)

- [ ] ทดสอบ OCR กับใบเกรด 3 ภาค (1/2567, 2/2567, 1/2568)
- [ ] ทดสอบ Cross-enrollment CS → ดูความก้าวหน้าถูกต้อง
- [ ] ทดสอบ FREE_ELEC แสดงผลถูกต้อง ไม่กระทบ canGraduate
- [ ] Regression test ฟีเจอร์เดิมทั้งหมด

---

## หมายเหตุเพิ่มเติมสำหรับ Developer

1. **Duplicate course handling:** วิชาที่มีรหัสซ้ำระหว่าง ET และ CS (เช่น 2766224) ควรมีแถวเดียวใน Curriculum sheet โดยใช้ `source_major = "BOTH"` และ `category` ตาม ET (เจ้าของหลักสูตรหลัก) เพื่อหลีกเลี่ยง double counting

2. **OCR Accuracy:** PDF.js ดึง text layer ได้ดีเฉพาะ PDF ที่ text-based (ไม่ใช่ scan) — ใบเกรดจาก CU REG portal เป็น text-based ทั้งหมด ไม่จำเป็นต้องใช้ image OCR

3. **Grade S in OCR:** วิชาที่เกรด S เช่นกีฬา, วิชานอกหลักสูตร จะไม่มีใน Curriculum DB — ระบบต้องให้ผู้ใช้เลือกว่าจะ import เป็น `FREE_ELEC` หรือ `ข้าม`

4. **Semester auto-create:** ระหว่าง batch import ถ้า semester (academicYear + semester) ยังไม่มีใน Semesters sheet ให้ auto-create ก่อน แล้วค่อย import enrollments

5. **Idempotency:** ควรตรวจสอบว่า course_code นั้นๆ ยัง ไม่มี ใน Enrollments ของภาคนั้น ก่อน import เพื่อป้องกัน duplicate (แสดง warning ถ้าพบซ้ำ)

---

*อัปเดทนี้ต่อเนื่องจาก Development.md | อ้างอิง: หลักสูตรครุศาสตรบัณฑิต ปรับปรุง พ.ศ. 2562 | ใบเกรดตัวอย่าง CU Format*

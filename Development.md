# แผนการออกแบบระบบคำนวณหน่วยกิต
# ครุศาสตรบัณฑิต (ครุเทคโฯ) — จุฬาลงกรณ์มหาวิทยาลัย
# หลักสูตรปรับปรุง พ.ศ. 2562

> **สถานะ:** Blueprint พร้อม Implement  
> **Stack:** Google Apps Script + Google Sheets (Database) · Vanilla HTML/CSS/JS (Frontend)  
> **ผู้เขียน:** Senior Developer · วันที่: 2026-05-12

---

## สารบัญ

1. [ภาพรวมระบบ](#1-ภาพรวมระบบ)
2. [โครงสร้างหลักสูตร (Data Source)](#2-โครงสร้างหลักสูตร-data-source)
3. [สถาปัตยกรรมระบบ (Architecture)](#3-สถาปัตยกรรมระบบ-architecture)
4. [โครงสร้างฐานข้อมูล Google Sheets](#4-โครงสร้างฐานข้อมูล-google-sheets)
5. [Apps Script API Design](#5-apps-script-api-design)
6. [Frontend Design](#6-frontend-design)
7. [Logic การคำนวณ](#7-logic-การคำนวณ)
8. [ฟีเจอร์หลัก 5 ฟังก์ชัน](#8-ฟีเจอร์หลัก-5-ฟังก์ชัน)
9. [สูตรคำนวณเกรด](#9-สูตรคำนวณเกรด)
10. [User Flow](#10-user-flow)
11. [Implementation Roadmap](#11-implementation-roadmap)
12. [Code Templates](#12-code-templates)

---

## 1. ภาพรวมระบบ

### ชื่อระบบ
**ChulaEduTracker** — ระบบติดตามและวางแผนการศึกษา  
หลักสูตรครุศาสตรบัณฑิต สาขาเทคโนโลยีการศึกษา คณะครุศาสตร์ จุฬาฯ

### เป้าหมาย
ช่วยให้นิสิตสามารถ:
- กรอกรายวิชาที่เรียนแล้วในแต่ละภาคการศึกษา พร้อมเกรด
- ดูสรุปหน่วยกิตที่สะสมแล้วแบ่งตามหมวดหมู่
- คำนวณว่ายังต้องลงวิชาอะไรอีกบ้างถึงจะจบ
- ดูค่าเกรด CA / CG / GPA / CAX / CGX / GPAX / GPX
- วางแผนลงทะเบียนเพื่อให้จบตามเป้าหมาย
- ดูการคาดคะเนว่าจะจบภาคการศึกษาใด

### หน่วยกิตรวมที่ต้องการตามหลักสูตร
| หมวด | หน่วยกิต |
|------|----------|
| 1. วิชาศึกษาทั่วไป | 30 |
| 2.1 วิชาครู | 36 |
| 2.2 วิชาเอก (เทคโนโลยีการศึกษา เอกเดี่ยว) | 60 |
| **รวม** | **≥ 126** |

> หมายเหตุ: วิชาเอกโปรแกรมปกติอาจแตกต่าง ระบบรองรับทั้ง 2 โปรแกรม

---

## 2. โครงสร้างหลักสูตร (Data Source)

### 2.1 หมวดวิชาศึกษาทั่วไป (30 หน่วยกิต)

#### 1.1 ตามข้อกำหนดมหาวิทยาลัย (24 หน่วยกิต)

| รหัส | กลุ่มวิชา | นก. | หมายเหตุ |
|------|-----------|-----|----------|
| — | 1.1.1 สังคมศาสตร์ | 3 | เลือกจาก Gen-Ed |
| — | 1.1.2 วิทยาศาสตร์และคณิตศาสตร์ | 3 | เลือกจาก Gen-Ed |
| — | 1.1.3 มนุษยศาสตร์ | 3 | เลือกจาก Gen-Ed |
| — | 1.1.4 สหศาสตร์ | 3 | เลือกจาก Gen-Ed |
| 5500111 | ภาษาอังกฤษเพื่อการเรียนรู้ในชีวิตจริง 1 | 3 | บังคับ |
| 5500112 | ภาษาอังกฤษเพื่อการเรียนรู้ในชีวิตจริง 2 | 3 | บังคับ |
| 5500252 | พัฒนาทักษะภาษาอังกฤษ | 3 | บังคับ |
| — | ภาษาต่างประเทศอื่น | 3 | เลือก (ไม่ใช่ Eng ของอักษรฯ) |

#### 1.2 กลุ่มพิเศษ (6 หน่วยกิต)

| รหัส | ชื่อวิชา | นก. | ประเภท |
|------|---------|-----|--------|
| 2796200 | ศิลปะเพื่อคุณภาพชีวิต | 3 | บังคับเลือก 1.2.1 |
| 2737201 | ดนตรีเพื่อสุนทรียภาพ | 3 | บังคับเลือก 1.2.1 |
| 2746292 | การศึกษาเพื่อการพัฒนาที่ยั่งยืน | 3 | เลือก 1.2.2 |
| 2747406 | ภาวะผู้นำในการจัดการศึกษาในศตวรรษที่ 21 | 3 | เลือก 1.2.2 |

---

### 2.2 หมวดวิชาเฉพาะ — วิชาครู (36 หน่วยกิต บังคับทั้งหมด)

| # | รหัสวิชา | ชื่อรายวิชา | นก. | ปีที่แนะนำ |
|---|---------|------------|-----|-----------|
| 1 | 2700101 | ปฏิบัติการสอน 1 | 1 | ปี 2 ต้น |
| 2 | 2700201 | ปฏิบัติการสอน 2 | 1 | ปี 2 ปลาย |
| 3 | 2700301 | ปฏิบัติการสอน 3 | 2 | ปี 3 (ต้น+ปลาย) |
| 4 | 2700401 | ปฏิบัติการสอน 4 | 8 | ปี 4 ต้น |
| 5 | 2716304 | การพัฒนาหลักสูตรและการออกแบบการเรียนการสอน | 3 | ปี 3 ต้น |
| 6 | 2719201 | ภาษาไทยเพื่อการสื่อสารสำหรับวิชาชีพครู | 2 | ปี 2 (ต้น+ปลาย) |
| 7 | 2725373 | ภาษาอังกฤษเพื่อการสื่อสารสำหรับครู | 2 | ปี 3 (ต้น+ปลาย) |
| 8 | 2746192 | ปฐมนิเทศการศึกษา | 2 | ปี 1 (ต้น+ปลาย) |
| 9 | 2756306 | การวิจัยเพื่อพัฒนาการเรียนรู้ | 2 | ปี 3 ปลาย |
| 10 | 2757308 | การวัดประเมินผลการเรียนรู้และประกันคุณภาพการศึกษา | 3 | ปี 3 ต้น |
| 11 | 2758501 | สถิติและสารสนเทศทางการศึกษา | 2 | ปี 2 (ต้น+ปลาย) |
| 12 | 2759151 | จิตวิทยาพื้นฐานเพื่อการศึกษา | 2 | ปี 1 ปลาย |
| 13 | 2759218 | จิตวิทยาการศึกษาและการศึกษาพิเศษ | 2 | ปี 2 ต้น |
| 14 | 2765205 | นวัตกรรมและเทคโนโลยีสารสนเทศและการสื่อสารเพื่อการศึกษา | 2 | ปี 2 (ต้น+ปลาย) |
| 15 | 2750298 | การเสริมสร้างความสัมพันธ์ระหว่างสถานศึกษา ผู้ปกครองและชุมชน | 2 | ปี 2 (ต้น+ปลาย) |
| — | 2765142 | เทคโนโลยีสารสนเทศฯ (วิชาพื้นฐาน) | 1 | ปี 1 (ไม่นับ นก.) |

---

### 2.3 หมวดวิชาเฉพาะ — วิชาเอกเทคโนโลยีการศึกษา (60 หน่วยกิต เอกเดี่ยว)

#### รายวิชาบังคับ (40 หน่วยกิต)

| # | รหัสวิชา | ชื่อรายวิชา | นก. | ปีที่แนะนำ |
|---|---------|------------|-----|-----------|
| 1 | 2765133 | ทฤษฎีการเรียนการสอนและจิตวิทยาทางเทคโนโลยีการศึกษา | 2 | ปี 1 ต้น |
| 2 | 2765135 | พื้นฐานอิเล็กทรอนิกส์ทางการศึกษา | 3 | ปี 1 ปลาย |
| 3 | 2765219 | การถ่ายภาพเพื่อการสื่อสารทางการศึกษา | 3 | ปี 2 ต้น |
| 4 | 2765220 | การผลิตวีดิทัศน์การศึกษา | 3 | ปี 2 ปลาย |
| 5 | 2765240 | สิ่งพิมพ์ดิจิทัลและการผลิตเพื่อการศึกษา | 2 | ปี 2 ต้น |
| 6 | 2765243 | สื่อมัลติมีเดียและแอนิเมชันเพื่อการเรียนการสอน | 3 | ปี 2 ปลาย |
| 7 | 2765341 | การออกแบบเว็บแบบเรซสปอนต์ซีฟเพื่อการเรียนรู้ | 3 | ปี 3 ต้น |
| 8 | 2765345 | การออกแบบระบบการสอนและศาสตร์การสอนออนไลน์ | 3 | ปี 3 ต้น |
| 9 | 2765380 | การบริหารจัดการและบริการงานเทคโนโลยีและสื่อสารการศึกษา | 3 | ปี 3 ปลาย |
| 10 | 2765405 | การจัดโปรแกรมและกลยุทธ์การฝึกอบรม | 3 | ปี 3 ปลาย |
| 11 | 2765441 | นวัตกรรมและการจัดการความรู้เพื่อการศึกษา | 3 | ปี 3 ปลาย |
| 12 | 2765450 | วิธีวิทยาการสอนทางเทคโนโลยีและสื่อสารการศึกษา | 3 | ปี 3 ปลาย |
| 13 | 2766224 | การเขียนโปรแกรมเพื่อการศึกษา | 3 | ปี 2 ต้น |
| 14 | 2766421 | การออกแบบเทคโนโลยี | 3 | ปี 3 ต้น |

#### รายวิชาเลือก (20 หน่วยกิต)

**2.1 เลือกด้านเทคโนโลยีและสื่อสารการศึกษา ≥ 9 นก.**

| รหัสวิชา | ชื่อรายวิชา | นก. | กลุ่มย่อย |
|---------|------------|-----|----------|
| 2765131 | การออกแบบและผลิตสื่อกราฟิก | 3 | ET |
| 2765132 | คอมพิวเตอร์กราฟิกและแอนิเมชัน | 3 | ET |
| 2765213 | ระบบการจัดการด้านการใช้สื่อทางการศึกษา | 3 | ET |
| 2765217 | สื่อมวลชนทางการศึกษาและทักษะการรู้เท่าทันสื่อ | 3 | ET |
| 2765281 | การผลิตรายการวิทยุและสื่อเสียงทางการศึกษา | 2 | ET |
| 2765222 | เทคโนโลยีเปลี่ยนโลกเพื่อเสริมสร้างการเรียนรู้ทางไกล | 3 | ET |
| 2765305 | การออกแบบสารและสื่อสร้างสรรค์ | 2 | ET |
| 2765307 | การจัดการศึกษานอกสถานที่และแหล่งการเรียนรู้ | 3 | ET |
| 2765406 | การเผยแพร่สัญญาณภาพและเสียงแบบมัลติแพลตฟอร์ม | 3 | ET |
| 2765407 | เทคโนโลยีเพื่อเสริมสร้างการเรียนรู้ในระดับประถมศึกษา | 3 | ET |
| 2765408 | เทคโนโลยีคัดสรรสำหรับนวัตกรรมการศึกษา | 1 | ET |
| 2766218 | คอมพิวเตอร์และเทคโนโลยีสารสนเทศสำหรับครูประถมศึกษา | 3 | CS |
| 2766355 | ระบบสื่อสารข้อมูลและเครือข่ายคอมพิวเตอร์ | 3 | CS |
| 2766362 | การออกแบบแพลตฟอร์มการเรียนรู้ | 3 | CS |
| 2766384 | การควบคุมการปฏิบัติงานระยะไกลเพื่อการศึกษา | 3 | CS |

**2.2 เลือกตามกลุ่มวิชา ≥ 6 นก. (เลือก 1 กลุ่มเท่านั้น)**

- กลุ่ม A: สารสนเทศศึกษา (2206xxx) ≥ 9 นก. เลือกได้ไม่ต่ำกว่า 6 นก.
- กลุ่ม B: ศิลปะ (2736xxx) ≥ 6 นก.
- กลุ่ม C: วารสารสนเทศและสื่อใหม่ (2801xxx) ≥ 6 นก.

---

## 3. สถาปัตยกรรมระบบ (Architecture)

```
┌─────────────────────────────────────────────────────────┐
│                    USER (Browser)                        │
│              index.html + app.js + style.css             │
└────────────────────┬────────────────────────────────────┘
                     │  HTTPS fetch() → JSON
                     ▼
┌─────────────────────────────────────────────────────────┐
│           Google Apps Script (Web App)                   │
│                  Code.gs (API Layer)                     │
│  doGet(e)  ·  doPost(e)  ·  CORS headers                │
└────────────────────┬────────────────────────────────────┘
                     │  SpreadsheetApp
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Google Sheets (Database)                    │
│  Sheet: Users · Semesters · Enrollments · Curriculum     │
└─────────────────────────────────────────────────────────┘
```

### เหตุผลที่เลือก Stack นี้
- **ไม่ต้องจ่ายค่า Server** — Apps Script + Sheets ฟรีใน Google Workspace
- **Deploy ง่าย** — Publish as Web App ได้ใน 1 คลิก
- **ข้อมูลปลอดภัย** — Google Account Auth ป้องกันได้
- **ขยายได้** — ย้ายไป Firebase/Supabase ในอนาคตโดยเปลี่ยนแค่ API layer

---

## 4. โครงสร้างฐานข้อมูล Google Sheets

### Sheet 1: `Users`
| Column | Field | Type | Description |
|--------|-------|------|-------------|
| A | user_id | STRING | unique key (email หรือ UUID) |
| B | display_name | STRING | ชื่อ-นามสกุล |
| C | student_id | STRING | รหัสนิสิต |
| D | program | STRING | "single_major" / "normal" |
| E | entry_year | NUMBER | ปีการศึกษาที่เข้า (เช่น 2564) |
| F | entry_semester | NUMBER | 1 หรือ 2 |
| G | created_at | DATETIME | timestamp |

### Sheet 2: `Semesters`
| Column | Field | Type | Description |
|--------|-------|------|-------------|
| A | semester_id | STRING | UUID |
| B | user_id | STRING | FK → Users.user_id |
| C | academic_year | NUMBER | ปีการศึกษา เช่น 2566 |
| D | semester | NUMBER | 1 = ต้น, 2 = ปลาย, 3 = ฤดูร้อน |
| E | created_at | DATETIME | timestamp |

### Sheet 3: `Enrollments`
| Column | Field | Type | Description |
|--------|-------|------|-------------|
| A | enrollment_id | STRING | UUID |
| B | semester_id | STRING | FK → Semesters.semester_id |
| C | user_id | STRING | FK → Users.user_id |
| D | course_code | STRING | รหัสวิชา เช่น 2765133 |
| E | course_name | STRING | ชื่อวิชา |
| F | credits | NUMBER | หน่วยกิต |
| G | grade | STRING | A / B+ / B / C+ / C / D+ / D / F / W / S / U / I / P |
| H | category | STRING | GE_LANG / GE_SOC / GE_SCI / GE_HUM / GE_HEA / GE_SPECIAL / PROF / MAJOR_CORE / MAJOR_ELEC1 / MAJOR_ELEC2 / FOUND |
| I | is_manual | BOOLEAN | true = กรอกเอง (Gen-Ed), false = จากระบบ |
| J | created_at | DATETIME | timestamp |

### Sheet 4: `Curriculum` (Static Reference Data)
| Column | Field | Type | Description |
|--------|-------|------|-------------|
| A | course_code | STRING | รหัสวิชา |
| B | course_name | STRING | ชื่อวิชา |
| C | credits | NUMBER | หน่วยกิต |
| D | category | STRING | หมวดหมู่ (ตาม Sheet 3 col H) |
| E | is_required | BOOLEAN | true = บังคับ |
| F | recommended_year | NUMBER | ปีที่แนะนำ |
| G | recommended_semester | NUMBER | ภาคที่แนะนำ |
| H | prerequisite | STRING | รหัสวิชาที่ต้องผ่านก่อน (คั่นด้วย comma) |
| I | subcategory | STRING | MAJOR_ELEC1_ET / MAJOR_ELEC1_CS / MAJOR_ELEC2_INFO / MAJOR_ELEC2_ART / MAJOR_ELEC2_MEDIA |
| J | program | STRING | "all" / "single_major" / "normal" |

### Sheet 5: `GradeConfig` (ค่าคะแนน Grade Point)
| Grade | Points |
|-------|--------|
| A | 4.00 |
| B+ | 3.50 |
| B | 3.00 |
| C+ | 2.50 |
| C | 2.00 |
| D+ | 1.50 |
| D | 1.00 |
| F | 0.00 |
| W | null (ไม่นับ) |
| S | null (ไม่นับใน GPA) |
| U | null (ไม่นับ) |
| I | null (incomplete) |
| P | null (pass/fail) |

---

## 5. Apps Script API Design

### Base URL
```
https://script.google.com/macros/s/{SCRIPT_ID}/exec
```

### Endpoints (ผ่าน query param `action`)

#### GET Requests

| Action | Parameters | Description |
|--------|-----------|-------------|
| `getUser` | `userId` | ดึงข้อมูลผู้ใช้ |
| `getSemesters` | `userId` | ดึงรายการภาคการศึกษาทั้งหมด |
| `getEnrollments` | `userId`, `semesterId?` | ดึงวิชาที่ลงทะเบียน |
| `getCurriculum` | `program?` | ดึงข้อมูลหลักสูตร |
| `getProgress` | `userId` | ดึงสรุปความก้าวหน้าทั้งหมด |
| `getGradeReport` | `userId` | ดึงรายงานเกรดสมบูรณ์ |

#### POST Requests

| Action | Body | Description |
|--------|------|-------------|
| `createUser` | `{userId, displayName, studentId, program, entryYear, entrySemester}` | สร้างผู้ใช้ใหม่ |
| `addSemester` | `{userId, academicYear, semester}` | เพิ่มภาคการศึกษา |
| `addEnrollment` | `{semesterId, userId, courseCode, courseName, credits, grade, category, isManual}` | เพิ่มวิชาที่ลง |
| `updateEnrollment` | `{enrollmentId, grade}` | อัพเดทเกรด |
| `deleteEnrollment` | `{enrollmentId}` | ลบวิชา |

### Response Format (JSON)
```json
{
  "success": true,
  "data": { ... },
  "message": "OK"
}
```
หรือ error:
```json
{
  "success": false,
  "data": null,
  "message": "Error description"
}
```

---

## 6. Frontend Design

### โครงสร้างไฟล์
```
/
├── index.html          ← Single Page Application
├── style.css           ← Styles (CU Color Scheme)
├── app.js              ← Main application logic
├── api.js              ← API connector (fetch wrapper)
├── calculator.js       ← Grade & credit calculation engine
├── curriculum.js       ← Static curriculum data (hardcoded)
└── utils.js            ← Helper functions
```

### หน้าหลัก (Tabs / Sections)

```
┌────────────────────────────────────────────────────────────┐
│  🎓 ChulaEduTracker  [ชื่อนิสิต]  [ออกจากระบบ]            │
├────────────────────────────────────────────────────────────┤
│  [📊 ภาพรวม] [📚 บันทึกวิชา] [📈 วิเคราะห์] [🗓 วางแผน]  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│              [เนื้อหาตามแต่ละ Tab]                         │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Tab 1: ภาพรวม (Dashboard)

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│  สะสมแล้ว   │  ยังต้องลง  │  GPAX        │  คาดจบ       │
│   XX นก.    │   XX นก.    │   X.XX       │  ภาค X/XXXX  │
└──────────────┴──────────────┴──────────────┴──────────────┘

┌─────────────────────────────────────────────────────────┐
│  ความก้าวหน้าตามหมวด                                    │
│                                                          │
│  Gen-Ed          ██████████░░░░  18/30 นก.              │
│  วิชาครู         █████░░░░░░░░░  12/36 นก.              │
│  วิชาเอก บังคับ  ██████████░░░░  20/40 นก.              │
│  วิชาเอก เลือก   ████░░░░░░░░░░   6/20 นก.              │
└─────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  วิชาบังคับที่ยังไม่ได้ลง                               │
│  ⚠ 2700401 ปฏิบัติการสอน 4 (8 นก.)                    │
│  ⚠ 2756306 การวิจัยเพื่อพัฒนาการเรียนรู้ (2 นก.)      │
│  ...                                                    │
└────────────────────────────────────────────────────────┘
```

### Tab 2: บันทึกวิชา

```
[+ เพิ่มภาคการศึกษา]

▼ ปีการศึกษา 2566 ภาคต้น                      [แก้ไข] [ลบ]
  ┌──────┬────────────────────────────┬─────┬──────┬──────┐
  │ รหัส │ ชื่อวิชา                  │ นก. │เกรด │หมวด │
  ├──────┼────────────────────────────┼─────┼──────┼──────┤
  │2765133│ ทฤษฎีการเรียนการสอนฯ    │  2  │  A   │เอก  │
  │2765135│ พื้นฐานอิเล็กทรอนิกส์ฯ │  3  │  B+  │เอก  │
  │5500111│ ภาษาอังกฤษฯ 1           │  3  │  B   │GE   │
  └──────┴────────────────────────────┴─────┴──────┴──────┘
  GPA ภาคนี้: 3.50  |  หน่วยกิตภาคนี้: 8
  [+ เพิ่มวิชาในภาคนี้]

▼ ปีการศึกษา 2566 ภาคปลาย  ...
```

#### Modal: เพิ่ม/แก้ไขวิชา
```
┌──────────────────────────────────────────────────────┐
│  เพิ่มรายวิชา                                 [✕]   │
│                                                      │
│  ประเภท: (●) วิชาในหลักสูตร  (○) กรอกเอง (Gen-Ed)  │
│                                                      │
│  [วิชาในหลักสูตร]                                    │
│  ค้นหา: [_______________] → Dropdown รายวิชา         │
│                                                      │
│  [กรอกเอง]                                           │
│  รหัสวิชา: [_________]                               │
│  ชื่อวิชา: [__________________________]              │
│  หน่วยกิต: [__]                                      │
│  หมวด:     [Dropdown: สังคม/วิทย์/มนุษย์/สห/ภาษา]  │
│                                                      │
│  เกรด: [A ▼]                                        │
│                                                      │
│  [บันทึก]  [ยกเลิก]                                  │
└──────────────────────────────────────────────────────┘
```

### Tab 3: วิเคราะห์ (Grade Report)

```
┌──────────────────────────────────────────────────────────┐
│  ตารางสรุปเกรดทั้งหมด (จัดกลุ่มตามภาค)                  │
│                                                          │
│  ภาค 1/2566                                             │
│  ┌──────┬──────────────┬─────┬──────┬──────┬──────┐    │
│  │ รหัส │ ชื่อวิชา    │ นก. │เกรด │Grade│Q*W  │    │
│  ├──────┼──────────────┼─────┼──────┼──────┼──────┤    │
│  │ XXXX │ ...         │  3  │  A   │ 4.0  │ 12   │    │
│  └──────┴──────────────┴─────┴──────┴──────┴──────┘    │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │  ภาคนี้: CA=8  CG=8  GPA=3.50                  │    │
│  │  สะสม:  CAX=32 CGX=32 GPAX=3.42                │    │
│  └─────────────────────────────────────────────────┘    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  สรุปรวมทุกภาค                                   │   │
│  │  CA (หน่วยกิตที่ลงทะเบียน): 48                  │   │
│  │  CG (หน่วยกิตที่นับ GPA):   46                  │   │
│  │  GPA (ภาคล่าสุด): 3.50                           │   │
│  │  CAX (สะสม ลงทะเบียน): 80                       │   │
│  │  CGX (สะสม นับ GPA): 76                         │   │
│  │  GPAX (สะสมทั้งหมด): 3.42                       │   │
│  │  GPX (Grade Point สะสม): 259.9                  │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

### Tab 4: วางแผน (Planning)

**ฟังก์ชัน 1: วางแผนจบตามเป้าหมาย**
```
ต้องการจบภายใน: [ปีการศึกษา ____] [ภาค _]
จำนวนวิชาต่อภาคที่รับได้: [__] วิชา / [__] หน่วยกิต

[คำนวณแผน]

→ แสดงตารางวิชาที่ต้องลงในแต่ละภาคที่เหลือ
```

**ฟังก์ชัน 2: คาดคะเนวันจบ**
```
อ้างอิงจาก: เฉลี่ย X.X นก./ภาค (จาก Y ภาคที่ผ่านมา)
คาดว่าจะจบ: ภาค Z/YYYY
เหลืออีก: N ภาค

→ ถ้าจบภายใน 8 ภาค: ✅ ปกติ
→ ถ้าเกิน 8 ภาค: ⚠ ควรเพิ่มวิชา/ภาค
```

---

## 7. Logic การคำนวณ

### 7.1 Mapping Category (สำหรับตรวจสอบหมวด)

```javascript
const CATEGORY_RULES = {
  GE: {
    total_required: 30,
    sub: {
      GE_SOC:     { required: 3,  label: "สังคมศาสตร์" },
      GE_SCI:     { required: 3,  label: "วิทยาศาสตร์และคณิตศาสตร์" },
      GE_HUM:     { required: 3,  label: "มนุษยศาสตร์" },
      GE_HEA:     { required: 3,  label: "สหศาสตร์" },
      GE_LANG_EN: { required: 9,  label: "ภาษาอังกฤษ (บังคับ)" },
      GE_LANG_OT: { required: 3,  label: "ภาษาต่างประเทศอื่น" },
      GE_21CENT:  { required: 3,  label: "วิชาในศตวรรษที่ 21 (เลือก 1)" },
      GE_ELEC:    { required: 3,  label: "วิชาเลือก (เลือก 1)" }
    }
  },
  PROF: {
    total_required: 36,
    label: "วิชาครู (บังคับทั้งหมด)"
  },
  MAJOR_CORE: {
    total_required: 40,
    label: "วิชาเอกบังคับ"
  },
  MAJOR_ELEC1: {
    total_required: 9,
    label: "วิชาเลือกด้านเทคโนโลยีและสื่อสารการศึกษา"
  },
  MAJOR_ELEC2: {
    total_required: 6,  // min 6 จาก 1 กลุ่ม (ต้องเลือกกลุ่มเดียว)
    total_elec: 20,     // รวม ELEC1 + ELEC2 = 20
    label: "วิชาเลือกตามกลุ่มวิชา"
  }
};
```

### 7.2 Grade Point Values

```javascript
const GRADE_POINTS = {
  'A':  4.00, 'B+': 3.50, 'B':  3.00,
  'C+': 2.50, 'C':  2.00, 'D+': 1.50,
  'D':  1.00, 'F':  0.00,
  'W':  null, 'S':  null, 'U':  null,
  'I':  null, 'P':  null
};

// วิชาที่นับหน่วยกิต (ไม่รวม W, I)
const COUNTED_GRADES = ['A','B+','B','C+','C','D+','D','F','S','U','P'];

// วิชาที่นับใน GPA calculation (ต้องมี grade point)
const GPA_GRADES = ['A','B+','B','C+','C','D+','D','F'];

// วิชาที่ถือว่าผ่าน (ได้หน่วยกิต)
const PASSED_GRADES = ['A','B+','B','C+','C','D+','D','S','P'];
```

### 7.3 Progress Calculation Algorithm

```javascript
function calculateProgress(enrollments, curriculum) {
  const result = {
    GE: { earned: {}, remaining: {} },
    PROF: { earned: 0, remaining: 0, missing_required: [] },
    MAJOR_CORE: { earned: 0, remaining: 0, missing_required: [] },
    MAJOR_ELEC: { earned: { elec1: 0, elec2: 0 }, remaining: {} }
  };

  // 1. กรองเฉพาะวิชาที่ผ่าน
  const passed = enrollments.filter(e => PASSED_GRADES.includes(e.grade));

  // 2. นับตามหมวด
  passed.forEach(e => {
    switch(e.category) {
      case 'GE_SOC': result.GE.earned.GE_SOC = (result.GE.earned.GE_SOC || 0) + e.credits; break;
      // ... etc
      case 'PROF': result.PROF.earned += e.credits; break;
      case 'MAJOR_CORE': result.MAJOR_CORE.earned += e.credits; break;
      case 'MAJOR_ELEC1': result.MAJOR_ELEC.earned.elec1 += e.credits; break;
      case 'MAJOR_ELEC2': result.MAJOR_ELEC.earned.elec2 += e.credits; break;
    }
  });

  // 3. คำนวณที่เหลือ
  result.PROF.remaining = 36 - result.PROF.earned;
  result.MAJOR_CORE.remaining = 40 - result.MAJOR_CORE.earned;
  // ... etc

  // 4. หาวิชาบังคับที่ยังไม่ได้ลง
  const passedCodes = new Set(passed.map(e => e.course_code));
  result.PROF.missing_required = curriculum
    .filter(c => c.category === 'PROF' && c.is_required && !passedCodes.has(c.course_code));
  result.MAJOR_CORE.missing_required = curriculum
    .filter(c => c.category === 'MAJOR_CORE' && !passedCodes.has(c.course_code));

  return result;
}
```

---

## 8. ฟีเจอร์หลัก 5 ฟังก์ชัน

### Feature 1: Credit Tracker (แดชบอร์ด)
- แสดง Progress Bar แต่ละหมวด
- แสดงวิชาบังคับที่ยังไม่ได้ลง
- แสดงจำนวนหน่วยกิตที่ยังต้องการแต่ละหมวด
- **Input:** ข้อมูลจาก Enrollments Sheet
- **Output:** Summary object + Progress visualization

### Feature 2: Grade Report Table
- แสดงตารางวิชาทั้งหมดจัดกลุ่มตามภาค
- คำนวณ CA / CG / GPA / CAX / CGX / GPAX / GPX
- Export เป็น CSV ได้
- **ตาราง:** รหัส | ชื่อวิชา | นก. | หมวด | เกรด | Grade Point | Q×W

### Feature 3: Graduation Check
- ตรวจว่าครบเงื่อนไขการจบหรือยัง
- แสดงรายการสิ่งที่ขาด
- แสดงช่องทางที่เป็นไปได้ (วิชาเลือกใดที่ยังนับได้)
- **Output:** 
  ```
  ✅ Gen-Ed: ผ่าน (30/30 นก.)
  ⚠ วิชาครู: ยังขาด 8 นก. (ปฏิบัติการสอน 4)
  ❌ วิชาเอกเลือก: ยังขาด 5 นก.
  ```

### Feature 4: Graduation Planner (วางแผนตามเป้า)
```
Input:
  - target_year: ปีการศึกษาที่ต้องการจบ
  - target_semester: ภาคที่ต้องการจบ
  - max_credits_per_sem: หน่วยกิตสูงสุดที่รับได้ต่อภาค

Algorithm:
  1. คำนวณจำนวนภาคที่เหลือจนถึง target
  2. หา remaining courses ทั้งหมด
  3. เรียงลำดับตาม prerequisite + recommended semester
  4. แจกวิชาเข้าแต่ละภาคให้ไม่เกิน max_credits_per_sem
  5. เตือนถ้าไม่สามารถจบได้ตามเป้า

Output:
  ภาค 1/2567: [รายวิชา X, Y, Z] = XX นก.
  ภาค 2/2567: [รายวิชา A, B, C] = XX นก.
  ภาค 1/2568: [รายวิชา D, E] = XX นก. ← จบ!
```

### Feature 5: Graduation Predictor (คาดคะเน)
```
Algorithm:
  1. คำนวณ avg_credits_per_sem จากประวัติ
     avg = total_enrolled_credits / number_of_semesters
  2. remaining_credits = total_required - total_earned
  3. semesters_needed = ceil(remaining_credits / avg_credits_per_sem)
  4. predicted_graduation = current_semester + semesters_needed
  
  ปรับ edge cases:
  - ถ้า avg < 9: warn "ควรลงเพิ่มเพื่อจบใน 8 ภาค"
  - คำนึงถึงวิชาบังคับที่เปิดเฉพาะบางภาค (เช่น ปฏิบัติการสอน 4)

Output:
  "จากค่าเฉลี่ย X.X นก./ภาค คาดว่าจะจบ ภาค Y/ZZZZ"
  "ยังเหลืออีก N ภาค"
```

---

## 9. สูตรคำนวณเกรด

ตามระบบ จุฬาลงกรณ์มหาวิทยาลัย:

### ในแต่ละภาคการศึกษา (Current)
```
CA  = หน่วยกิตทั้งหมดที่ลงทะเบียนในภาคนั้น (รวม F, W)
CG  = หน่วยกิตที่นับใน GPA (CA ลบ W, I)
GP  = Σ (grade_point × credits) สำหรับวิชาที่มี grade_point
GPA = GP / CG

ตัวอย่าง:
วิชา A: 3 นก. เกรด A  → GP = 3 × 4.0 = 12
วิชา B: 3 นก. เกรด B+ → GP = 3 × 3.5 = 10.5
วิชา C: 3 นก. เกรด W  → ไม่นับ
CA = 9, CG = 6, GP = 22.5, GPA = 22.5/6 = 3.75
```

### สะสม (Cumulative)
```
CAX  = Σ CA ทุกภาค
CGX  = Σ CG ทุกภาค
GPX  = Σ GP ทุกภาค (Grade Points สะสม)
GPAX = GPX / CGX
```

### JavaScript Implementation
```javascript
function calculateGrades(enrollments) {
  // แยกตามภาค
  const bySemester = groupBy(enrollments, 'semester_id');
  const semesterReports = [];
  let totalCAX = 0, totalCGX = 0, totalGPX = 0;

  for (const [semId, courses] of Object.entries(bySemester)) {
    let CA = 0, CG = 0, GP = 0;
    courses.forEach(c => {
      CA += c.credits;
      if (c.grade !== 'W' && c.grade !== 'I') {
        CG += c.credits;
        if (GRADE_POINTS[c.grade] !== null) {
          GP += GRADE_POINTS[c.grade] * c.credits;
        }
      }
    });
    const GPA = CG > 0 ? (GP / CG).toFixed(2) : 'N/A';
    semesterReports.push({ semId, CA, CG, GP, GPA, courses });
    totalCAX += CA;
    totalCGX += CG;
    totalGPX += GP;
  }

  const GPAX = totalCGX > 0 ? (totalGPX / totalCGX).toFixed(2) : 'N/A';
  return {
    semesters: semesterReports,
    summary: {
      CAX: totalCAX,
      CGX: totalCGX,
      GPX: totalGPX.toFixed(2),
      GPAX
    }
  };
}
```

---

## 10. User Flow

```
[เปิดเว็บครั้งแรก]
        │
        ▼
[ลงชื่อเข้าใช้ / กรอกชื่อ-รหัสนิสิต]
        │
        ▼
[เลือกโปรแกรม: เอกเดี่ยว / ปกติ]
        │
        ▼
[กรอกปีการศึกษาที่เข้า (entry year)]
        │
        ▼
[Dashboard แสดง: 0 นก. / จบอีก 126 นก.]
        │
        ▼
[Tab: บันทึกวิชา] → [+ เพิ่มภาคการศึกษา] → [+ เพิ่มวิชา]
        │
        ├── วิชาในหลักสูตร → ค้นหา → เลือก → กรอกเกรด
        │
        └── วิชา Gen-Ed → กรอก รหัส / ชื่อ / นก. / หมวด / เกรด
        │
        ▼
[ระบบอัพเดท Dashboard อัตโนมัติ]
        │
        ├── Tab วิเคราะห์: ดูตารางเกรด + CA/CG/GPA/CAX/CGX/GPAX/GPX
        │
        └── Tab วางแผน: ใส่เป้าหมาย → ดูแผน / ดูคาดคะเน
```

---

## 11. Implementation Roadmap

### Phase 1: Database & API (สัปดาห์ 1-2)
- [ ] สร้าง Google Spreadsheet ตาม Schema
- [ ] กรอก Curriculum data ใน Sheet4
- [ ] เขียน Apps Script Code.gs ทุก endpoint
- [ ] ทดสอบ API ด้วย Postman / curl
- [ ] ตั้งค่า CORS headers ให้ถูกต้อง

### Phase 2: Frontend Core (สัปดาห์ 2-3)
- [ ] สร้าง index.html โครงสร้างหลัก
- [ ] เขียน style.css (CU สีแดง-ทอง)
- [ ] เขียน api.js (fetch wrapper)
- [ ] เขียน curriculum.js (hardcode data)
- [ ] เขียน calculator.js (grade + progress)

### Phase 3: Features (สัปดาห์ 3-4)
- [ ] Tab 1: Dashboard + Progress bars
- [ ] Tab 2: บันทึกวิชา (CRUD + Modal)
- [ ] Tab 3: Grade Report Table
- [ ] Tab 4: Planner + Predictor
- [ ] Local Storage สำหรับ user session

### Phase 4: Polish & Test (สัปดาห์ 4-5)
- [ ] Responsive design (Mobile)
- [ ] Export CSV / Print
- [ ] Edge case testing
- [ ] Deploy Apps Script as Web App
- [ ] User testing กับนิสิตจริง

---

## 12. Code Templates

### 12.1 Apps Script — Code.gs (โครงสร้างหลัก)

```javascript
// ============================================================
// Code.gs — ChulaEduTracker API
// ============================================================

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET = {
  USERS:       'Users',
  SEMESTERS:   'Semesters',
  ENROLLMENTS: 'Enrollments',
  CURRICULUM:  'Curriculum',
  GRADE_CFG:   'GradeConfig'
};

function doGet(e) {
  const action = e.parameter.action;
  let result;
  try {
    switch(action) {
      case 'getUser':        result = getUser(e.parameter.userId); break;
      case 'getSemesters':   result = getSemesters(e.parameter.userId); break;
      case 'getEnrollments': result = getEnrollments(e.parameter.userId, e.parameter.semesterId); break;
      case 'getCurriculum':  result = getCurriculum(e.parameter.program); break;
      case 'getProgress':    result = getProgress(e.parameter.userId); break;
      case 'getGradeReport': result = getGradeReport(e.parameter.userId); break;
      default: result = { success: false, message: 'Unknown action' };
    }
  } catch(err) {
    result = { success: false, message: err.toString() };
  }
  return buildResponse(result);
}

function doPost(e) {
  const payload = JSON.parse(e.postData.contents);
  const action = payload.action;
  let result;
  try {
    switch(action) {
      case 'createUser':       result = createUser(payload); break;
      case 'addSemester':      result = addSemester(payload); break;
      case 'addEnrollment':    result = addEnrollment(payload); break;
      case 'updateEnrollment': result = updateEnrollment(payload); break;
      case 'deleteEnrollment': result = deleteEnrollment(payload); break;
      default: result = { success: false, message: 'Unknown action' };
    }
  } catch(err) {
    result = { success: false, message: err.toString() };
  }
  return buildResponse(result);
}

function buildResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---- CRUD Helpers ----

function getSheet(name) {
  return SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(name);
}

function generateId() {
  return Utilities.getUuid();
}

function getUser(userId) {
  const sheet = getSheet(SHEET.USERS);
  const data = sheet.getDataRange().getValues();
  const row = data.find(r => r[0] === userId);
  if (!row) return { success: false, message: 'User not found' };
  return { success: true, data: rowToUser(row) };
}

function rowToUser(row) {
  return {
    user_id: row[0], display_name: row[1], student_id: row[2],
    program: row[3], entry_year: row[4], entry_semester: row[5]
  };
}

function createUser(payload) {
  const sheet = getSheet(SHEET.USERS);
  sheet.appendRow([
    payload.userId, payload.displayName, payload.studentId,
    payload.program, payload.entryYear, payload.entrySemester,
    new Date().toISOString()
  ]);
  return { success: true, data: { user_id: payload.userId } };
}

function addSemester(payload) {
  const sheet = getSheet(SHEET.SEMESTERS);
  const id = generateId();
  sheet.appendRow([id, payload.userId, payload.academicYear, payload.semester, new Date().toISOString()]);
  return { success: true, data: { semester_id: id } };
}

function getSemesters(userId) {
  const sheet = getSheet(SHEET.SEMESTERS);
  const data = sheet.getDataRange().getValues();
  const rows = data.filter(r => r[1] === userId);
  return {
    success: true,
    data: rows.map(r => ({
      semester_id: r[0], user_id: r[1],
      academic_year: r[2], semester: r[3]
    }))
  };
}

function addEnrollment(payload) {
  const sheet = getSheet(SHEET.ENROLLMENTS);
  const id = generateId();
  sheet.appendRow([
    id, payload.semesterId, payload.userId,
    payload.courseCode, payload.courseName, payload.credits,
    payload.grade, payload.category, payload.isManual,
    new Date().toISOString()
  ]);
  return { success: true, data: { enrollment_id: id } };
}

function getEnrollments(userId, semesterId) {
  const sheet = getSheet(SHEET.ENROLLMENTS);
  const data = sheet.getDataRange().getValues();
  let rows = data.filter(r => r[2] === userId);
  if (semesterId) rows = rows.filter(r => r[1] === semesterId);
  return {
    success: true,
    data: rows.map(r => ({
      enrollment_id: r[0], semester_id: r[1], user_id: r[2],
      course_code: r[3], course_name: r[4], credits: r[5],
      grade: r[6], category: r[7], is_manual: r[8]
    }))
  };
}

function updateEnrollment(payload) {
  const sheet = getSheet(SHEET.ENROLLMENTS);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === payload.enrollmentId) {
      sheet.getRange(i + 1, 7).setValue(payload.grade); // col G = grade
      return { success: true };
    }
  }
  return { success: false, message: 'Enrollment not found' };
}

function deleteEnrollment(payload) {
  const sheet = getSheet(SHEET.ENROLLMENTS);
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === payload.enrollmentId) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, message: 'Not found' };
}

function getCurriculum(program) {
  const sheet = getSheet(SHEET.CURRICULUM);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  let rows = data.slice(1);
  if (program && program !== 'all') {
    rows = rows.filter(r => r[9] === 'all' || r[9] === program);
  }
  return {
    success: true,
    data: rows.map(r => ({
      course_code: r[0], course_name: r[1], credits: r[2],
      category: r[3], is_required: r[4], recommended_year: r[5],
      recommended_semester: r[6], prerequisite: r[7],
      subcategory: r[8], program: r[9]
    }))
  };
}
```

---

### 12.2 Frontend — calculator.js

```javascript
// ============================================================
// calculator.js — Grade & Progress Calculation Engine
// ============================================================

const GRADE_POINTS = {
  'A': 4.00, 'B+': 3.50, 'B': 3.00, 'C+': 2.50,
  'C': 2.00, 'D+': 1.50, 'D': 1.00, 'F': 0.00,
  'W': null, 'S': null, 'U': null, 'I': null, 'P': null
};

const PASSED_GRADES = new Set(['A','B+','B','C+','C','D+','D','S','P']);
const GPA_COUNTED   = new Set(['A','B+','B','C+','C','D+','D','F']);

/**
 * คำนวณ CA, CG, GPA ของภาคเดียว
 */
function calcSemesterGrade(courses) {
  let CA = 0, CG = 0, GP = 0;
  courses.forEach(c => {
    CA += parseFloat(c.credits);
    if (c.grade !== 'W' && c.grade !== 'I') {
      CG += parseFloat(c.credits);
      if (GPA_COUNTED.has(c.grade)) {
        GP += GRADE_POINTS[c.grade] * parseFloat(c.credits);
      }
    }
  });
  return { CA, CG, GP, GPA: CG > 0 ? +(GP/CG).toFixed(2) : null };
}

/**
 * คำนวณ CAX, CGX, GPX, GPAX สะสม
 */
function calcCumulative(allSemesters) {
  let CAX = 0, CGX = 0, GPX = 0;
  allSemesters.forEach(s => { CAX += s.CA; CGX += s.CG; GPX += s.GP; });
  return { CAX, CGX, GPX: +GPX.toFixed(2), GPAX: CGX > 0 ? +(GPX/CGX).toFixed(2) : null };
}

/**
 * ตรวจสอบความก้าวหน้าตามหลักสูตร
 */
function calcProgress(enrollments, curriculum) {
  const passed = enrollments.filter(e => PASSED_GRADES.has(e.grade));
  const passedCodes = new Set(passed.map(e => e.course_code));

  // รวมหน่วยกิตตามหมวด
  const earned = {};
  passed.forEach(e => {
    earned[e.category] = (earned[e.category] || 0) + parseFloat(e.credits);
  });

  // ตรวจสอบแต่ละหมวด
  const ge = {
    GE_SOC:     { earned: earned['GE_SOC']     || 0, required: 3 },
    GE_SCI:     { earned: earned['GE_SCI']     || 0, required: 3 },
    GE_HUM:     { earned: earned['GE_HUM']     || 0, required: 3 },
    GE_HEA:     { earned: earned['GE_HEA']     || 0, required: 3 },
    GE_LANG_EN: { earned: earned['GE_LANG_EN'] || 0, required: 9 },
    GE_LANG_OT: { earned: earned['GE_LANG_OT'] || 0, required: 3 },
    GE_21CENT:  { earned: earned['GE_21CENT']  || 0, required: 3 },
    GE_ELEC:    { earned: earned['GE_ELEC']    || 0, required: 3 },
  };
  const geTotal = Object.values(ge).reduce((s, v) => s + v.earned, 0);

  const prof = {
    earned: earned['PROF'] || 0,
    required: 36,
    missing: curriculum.filter(c => c.category === 'PROF' && c.is_required && !passedCodes.has(c.course_code))
  };

  const majorCore = {
    earned: earned['MAJOR_CORE'] || 0,
    required: 40,
    missing: curriculum.filter(c => c.category === 'MAJOR_CORE' && !passedCodes.has(c.course_code))
  };

  const majorElec1 = { earned: earned['MAJOR_ELEC1'] || 0, required: 9 };
  const majorElec2 = { earned: earned['MAJOR_ELEC2'] || 0, required: 6 };
  const majorElecTotal = majorElec1.earned + majorElec2.earned;

  const totalEarned = geTotal + prof.earned + majorCore.earned + majorElecTotal;
  const totalRequired = 126;

  return {
    ge, geTotal, prof, majorCore,
    majorElec: { elec1: majorElec1, elec2: majorElec2, total: majorElecTotal, required: 20 },
    totalEarned, totalRequired,
    canGraduate: (
      geTotal >= 30 &&
      prof.earned >= 36 && prof.missing.length === 0 &&
      majorCore.earned >= 40 && majorCore.missing.length === 0 &&
      majorElecTotal >= 20 &&
      majorElec1.earned >= 9 &&
      majorElec2.earned >= 6
    )
  };
}

/**
 * คาดคะเนภาคการศึกษาที่จะจบ
 */
function predictGraduation(enrollments, progress, currentYear, currentSem) {
  // หาค่าเฉลี่ย credits ต่อภาค
  const semGroups = groupBy(enrollments, 'semester_id');
  const semCount = Object.keys(semGroups).length;
  if (semCount === 0) return null;

  const totalEnrolled = enrollments.reduce((s, e) => s + parseFloat(e.credits), 0);
  const avgPerSem = totalEnrolled / semCount;

  const remaining = progress.totalRequired - progress.totalEarned;
  const semsNeeded = Math.ceil(remaining / avgPerSem);

  // คำนวณภาคที่จะจบ
  let y = currentYear, s = currentSem;
  for (let i = 0; i < semsNeeded; i++) {
    s++;
    if (s > 2) { s = 1; y++; }
  }

  return {
    avgCreditsPerSem: +avgPerSem.toFixed(1),
    remainingCredits: remaining,
    semsNeeded,
    predictedYear: y,
    predictedSem: s,
    isOnTrack: semsNeeded <= (8 - semCount)
  };
}

/**
 * สร้างแผนการลงทะเบียนตามเป้าหมาย
 */
function generatePlan(progress, curriculum, targetYear, targetSem, currentYear, currentSem, maxCreditsPerSem) {
  // หาวิชาที่ยังต้องลง
  let remaining = [
    ...progress.prof.missing,
    ...progress.majorCore.missing,
    // ... เพิ่มวิชาเลือกที่ยังต้องการ
  ].sort((a, b) => (a.recommended_year * 10 + a.recommended_semester) - (b.recommended_year * 10 + b.recommended_semester));

  // คำนวณจำนวนภาคที่เหลือ
  let semsAvailable = 0;
  let y = currentYear, s = currentSem;
  while (y < targetYear || (y === targetYear && s <= targetSem)) {
    semsAvailable++;
    s++; if (s > 2) { s = 1; y++; }
  }

  // แจกวิชาเข้าแต่ละภาค
  const plan = [];
  let creditsUsed = 0, semCourses = [], planSem = 1;
  remaining.forEach(course => {
    if (creditsUsed + course.credits > maxCreditsPerSem) {
      plan.push({ semester: planSem, courses: semCourses, totalCredits: creditsUsed });
      semCourses = []; creditsUsed = 0; planSem++;
    }
    semCourses.push(course);
    creditsUsed += parseFloat(course.credits);
  });
  if (semCourses.length > 0) plan.push({ semester: planSem, courses: semCourses, totalCredits: creditsUsed });

  return { plan, feasible: planSem <= semsAvailable };
}

// Helper
function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    (acc[item[key]] = acc[item[key]] || []).push(item);
    return acc;
  }, {});
}
```

---

### 12.3 Frontend — api.js

```javascript
// ============================================================
// api.js — Apps Script API Connector
// ============================================================

const API_BASE = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

async function apiGet(action, params = {}) {
  const url = new URL(API_BASE);
  url.searchParams.set('action', action);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  return res.json();
}

async function apiPost(action, body = {}) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    body: JSON.stringify({ action, ...body })
  });
  return res.json();
}

// API Methods
const API = {
  getUser:         (userId)                  => apiGet('getUser', { userId }),
  createUser:      (data)                    => apiPost('createUser', data),
  getSemesters:    (userId)                  => apiGet('getSemesters', { userId }),
  addSemester:     (data)                    => apiPost('addSemester', data),
  getEnrollments:  (userId, semesterId)      => apiGet('getEnrollments', { userId, semesterId }),
  addEnrollment:   (data)                    => apiPost('addEnrollment', data),
  updateEnrollment:(enrollmentId, grade)     => apiPost('updateEnrollment', { enrollmentId, grade }),
  deleteEnrollment:(enrollmentId)            => apiPost('deleteEnrollment', { enrollmentId }),
  getCurriculum:   (program)                 => apiGet('getCurriculum', { program }),
  getProgress:     (userId)                  => apiGet('getProgress', { userId }),
  getGradeReport:  (userId)                  => apiGet('getGradeReport', { userId }),
};
```

---

### 12.4 Curriculum Data Seed (Sheet4 — ตัวอย่าง)

```
course_code | course_name                                        | credits | category    | is_required | rec_year | rec_sem | prerequisite | subcategory | program
5500111     | ภาษาอังกฤษเพื่อการเรียนรู้ในชีวิตจริง 1          | 3       | GE_LANG_EN  | TRUE        | 1        | 1       |              |             | all
5500112     | ภาษาอังกฤษเพื่อการเรียนรู้ในชีวิตจริง 2          | 3       | GE_LANG_EN  | TRUE        | 1        | 2       | 5500111      |             | all
5500252     | พัฒนาทักษะภาษาอังกฤษ                              | 3       | GE_LANG_EN  | TRUE        | 2        | 1       | 5500112      |             | all
2796200     | ศิลปะเพื่อคุณภาพชีวิต                             | 3       | GE_21CENT   | FALSE       | 1        | 1       |              |             | all
2737201     | ดนตรีเพื่อสุนทรียภาพ                              | 3       | GE_21CENT   | FALSE       | 1        | 1       |              |             | all
2746292     | การศึกษาเพื่อการพัฒนาที่ยั่งยืน                  | 3       | GE_ELEC     | FALSE       | 1        | 2       |              |             | all
2747406     | ภาวะผู้นำในการจัดการศึกษาในศตวรรษที่ 21           | 3       | GE_ELEC     | FALSE       | 2        | 1       |              |             | all
2700101     | ปฏิบัติการสอน 1                                   | 1       | PROF        | TRUE        | 2        | 1       |              |             | all
2700201     | ปฏิบัติการสอน 2                                   | 1       | PROF        | TRUE        | 2        | 2       | 2700101      |             | all
2700301     | ปฏิบัติการสอน 3                                   | 2       | PROF        | TRUE        | 3        | 1       | 2700201      |             | all
2700401     | ปฏิบัติการสอน 4                                   | 8       | PROF        | TRUE        | 4        | 1       | 2700301      |             | all
2716304     | การพัฒนาหลักสูตรและการออกแบบการเรียนการสอน        | 3       | PROF        | TRUE        | 3        | 1       |              |             | all
2719201     | ภาษาไทยเพื่อการสื่อสารสำหรับวิชาชีพครู            | 2       | PROF        | TRUE        | 2        | 1       |              |             | all
2725373     | ภาษาอังกฤษเพื่อการสื่อสารสำหรับครู                | 2       | PROF        | TRUE        | 3        | 1       |              |             | all
2746192     | ปฐมนิเทศการศึกษา                                  | 2       | PROF        | TRUE        | 1        | 1       |              |             | all
2756306     | การวิจัยเพื่อพัฒนาการเรียนรู้                    | 2       | PROF        | TRUE        | 3        | 2       |              |             | all
2757308     | การวัดประเมินผลการเรียนรู้และประกันคุณภาพการศึกษา | 3       | PROF        | TRUE        | 3        | 1       |              |             | all
2758501     | สถิติและสารสนเทศทางการศึกษา                       | 2       | PROF        | TRUE        | 2        | 1       |              |             | all
2759151     | จิตวิทยาพื้นฐานเพื่อการศึกษา                    | 2       | PROF        | TRUE        | 1        | 2       |              |             | all
2759218     | จิตวิทยาการศึกษาและการศึกษาพิเศษ                 | 2       | PROF        | TRUE        | 2        | 1       |              |             | all
2765205     | นวัตกรรมและเทคโนโลยีสารสนเทศและการสื่อสารเพื่อการศึกษา | 2  | PROF        | TRUE        | 2        | 1       |              |             | all
2750298     | การเสริมสร้างความสัมพันธ์ระหว่างสถานศึกษาผู้ปกครองและชุมชน | 2 | PROF    | TRUE        | 2        | 1       |              |             | all
2765133     | ทฤษฎีการเรียนการสอนและจิตวิทยาทางเทคโนโลยีการศึกษา | 2    | MAJOR_CORE  | TRUE        | 1        | 1       |              |             | single_major
2765135     | พื้นฐานอิเล็กทรอนิกส์ทางการศึกษา                | 3       | MAJOR_CORE  | TRUE        | 1        | 2       |              |             | single_major
2765219     | การถ่ายภาพเพื่อการสื่อสารทางการศึกษา             | 3       | MAJOR_CORE  | TRUE        | 2        | 1       |              |             | single_major
2765220     | การผลิตวีดิทัศน์การศึกษา                         | 3       | MAJOR_CORE  | TRUE        | 2        | 2       |              |             | single_major
2765240     | สิ่งพิมพ์ดิจิทัลและการผลิตเพื่อการศึกษา         | 2       | MAJOR_CORE  | TRUE        | 2        | 1       |              |             | single_major
2765243     | สื่อมัลติมีเดียและแอนิเมชันเพื่อการเรียนการสอน  | 3       | MAJOR_CORE  | TRUE        | 2        | 2       |              |             | single_major
2765341     | การออกแบบเว็บแบบเรซสปอนต์ซีฟเพื่อการเรียนรู้    | 3       | MAJOR_CORE  | TRUE        | 3        | 1       |              |             | single_major
2765345     | การออกแบบระบบการสอนและศาสตร์การสอนออนไลน์       | 3       | MAJOR_CORE  | TRUE        | 3        | 1       |              |             | single_major
2765380     | การบริหารจัดการและบริการงานเทคโนโลยีและสื่อสารการศึกษา | 3  | MAJOR_CORE  | TRUE        | 3        | 2       |              |             | single_major
2765405     | การจัดโปรแกรมและกลยุทธ์การฝึกอบรม               | 3       | MAJOR_CORE  | TRUE        | 3        | 2       |              |             | single_major
2765441     | นวัตกรรมและการจัดการความรู้เพื่อการศึกษา         | 3       | MAJOR_CORE  | TRUE        | 3        | 2       |              |             | single_major
2765450     | วิธีวิทยาการสอนทางเทคโนโลยีและสื่อสารการศึกษา   | 3       | MAJOR_CORE  | TRUE        | 3        | 2       |              |             | single_major
2766224     | การเขียนโปรแกรมเพื่อการศึกษา                     | 3       | MAJOR_CORE  | TRUE        | 2        | 1       |              |             | single_major
2766421     | การออกแบบเทคโนโลยี                               | 3       | MAJOR_CORE  | TRUE        | 3        | 1       |              |             | single_major
```

---

## หมายเหตุสำคัญสำหรับ Developer

1. **CORS Issue:** Apps Script Web App ที่ deploy แบบ "Anyone" จะมีปัญหา CORS ใน fetch() โดยตรง — ใช้ mode: `no-cors` แล้ว parse ด้วย `text()` หรือใช้ JSONP pattern หรือ deploy แบบ "Anyone with Google Account"

2. **Authentication:** สำหรับ production ควรเพิ่ม Google Sign-In (OAuth 2.0) ไม่ใช่แค่ userId string

3. **Rate Limit:** Apps Script มี quota limit การ execute — ถ้า concurrent users มาก ให้ cache ข้อมูล Curriculum ใน localStorage

4. **Curriculum Data:** ควร hardcode ลงใน `curriculum.js` ด้วย เพื่อให้ระบบทำงานได้แม้ API ล้ม

5. **วิชา Gen-Ed:** category ย่อย (GE_SOC, GE_SCI ฯลฯ) ต้องให้ผู้ใช้เลือกเองเมื่อกรอก เพราะไม่มีรหัสวิชาตายตัว

6. **วิชาเลือก MAJOR_ELEC2:** ต้องตรวจว่าผู้ใช้เลือกจากกลุ่มเดียวเท่านั้น (INFO / ART / MEDIA) ถ้าผสมกลุ่มให้แจ้งเตือน

---

*จัดทำโดย: Senior Developer | อ้างอิง: คู่มือนิสิตปริญญาตรี จุฬาฯ ปีการศึกษา 2564 | หลักสูตรปรับปรุง พ.ศ. 2562*

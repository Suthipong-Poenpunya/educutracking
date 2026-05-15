// ============================================================
// curriculum.js — Static Curriculum Data & Constants
// หลักสูตรครุศาสตรบัณฑิต สาขาเทคโนโลยีการศึกษา จุฬาฯ
// หลักสูตรปรับปรุง พ.ศ. 2562
// ============================================================

// ---- Grade Point Values ----
const GRADE_POINTS = {
  'A':  4.00, 'B+': 3.50, 'B':  3.00, 'C+': 2.50,
  'C':  2.00, 'D+': 1.50, 'D':  1.00, 'F':  0.00,
  'W':  null, 'S':  null, 'U':  null, 'I':  null, 'P':  null
};

// วิชาที่ถือว่าผ่าน (ได้หน่วยกิต)
const PASSED_GRADES = new Set(['A','B+','B','C+','C','D+','D','S','P']);

// วิชาที่นับใน GPA calculation (ต้องมี grade point)
const GPA_COUNTED = new Set(['A','B+','B','C+','C','D+','D','F']);

// วิชาที่นับหน่วยกิต (ไม่รวม W, I)
const COUNTED_GRADES = new Set(['A','B+','B','C+','C','D+','D','F','S','U','P']);

// Grade options สำหรับ dropdown
const GRADE_OPTIONS = ['A','B+','B','C+','C','D+','D','F','W','S','U','I','P'];

// ---- Category Rules (เกณฑ์แต่ละหมวด) ----
const CATEGORY_RULES = {
  GE: {
    total_required: 30,
    label: 'วิชาศึกษาทั่วไป',
    sub: {
      GE_CORE:    { required: 12, label: 'ตามกำหนดมหาวิทยาลัย' },
      GE_LANG_EN: { required: 9,  label: 'ภาษาอังกฤษ' },
      GE_LANG_OT: { required: 3,  label: 'ภาษาที่สาม' },
      GE_FAC:     { required: 6,  label: 'กลุ่มวิชาคณะครุศาสตร์' }
    }
  },
  PROF: {
    total_required: 36,
    label: 'วิชาครู'
  },
  MAJOR_CORE: {
    total_required: 40,
    label: 'วิชาเอกบังคับ'
  },
  MAJOR_ELEC: {
    total_required: 20,
    label: 'วิชาเอกเลือก',
    sub: {
      MAJOR_ELEC_ET:   { required: 9, label: 'ด้านเทคโนโลยีฯ (≥9 นก.)' },
      MAJOR_ELEC_CS:   { required: 5, label: 'ด้านคอมพิวเตอร์ฯ (≥5 นก.)' },
      MAJOR_ELEC_GROUP:{ required: 6, label: 'ตามกลุ่มวิชา (≥6 นก.)' }
    }
  },
  FREE_ELEC: {
    total_required: 6,
    label: 'วิชาเลือกเสรี'
  }
};

const TOTAL_CREDITS_REQUIRED = 132;

// ---- GE Category Options สำหรับ Manual Entry ----
const GE_CATEGORIES = [
  { value: 'GE_CORE',    label: 'ตามกำหนดมหาวิทยาลัย' },
  { value: 'GE_LANG_EN', label: 'ภาษาอังกฤษ' },
  { value: 'GE_LANG_OT', label: 'ภาษาที่สาม' },
  { value: 'GE_FAC',     label: 'กลุ่มวิชาคณะครุศาสตร์' },
  { value: 'FREE_ELEC',  label: 'วิชาเลือกเสรี' }
];

// ---- Category Labels สำหรับ UI ----
const CATEGORY_LABELS = {
  'GE_CORE': 'GE บังคับ',
  'GE_LANG_EN': 'GE อังกฤษ',
  'GE_LANG_OT': 'GE ภาษาที่สาม',
  'GE_FAC': 'GE คณะครุศาสตร์',
  'PROF': 'วิชาครู',
  'MAJOR_CORE': 'วิชาเอกบังคับ',
  'MAJOR_ELEC_ET': 'เอกเลือก (ET)',
  'MAJOR_ELEC_CS': 'เอกเลือก (CS)',
  'MAJOR_ELEC_GROUP': 'เอกเลือก (กลุ่มวิชา)',
  'FREE_ELEC': 'เลือกเสรี',
  'FOUND': 'วิชาพื้นฐาน'
};

// ---- Curriculum Data (All Courses) ----
const CURRICULUM_DATA = [
  // ===== 1. วิชาศึกษาทั่วไป (Gen-Ed) =====
  { course_code: '5500111', course_name: 'ภาษาอังกฤษเพื่อการเรียนรู้ในชีวิตจริง 1', credits: 3, category: 'GE_LANG_EN', is_required: true, recommended_year: 1, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'all' },
  { course_code: '5500112', course_name: 'ภาษาอังกฤษเพื่อการเรียนรู้ในชีวิตจริง 2', credits: 3, category: 'GE_LANG_EN', is_required: true, recommended_year: 1, recommended_semester: 2, prerequisite: '5500111', subcategory: '', program: 'all' },
  { course_code: '5500252', course_name: 'พัฒนาทักษะภาษาอังกฤษ', credits: 3, category: 'GE_LANG_EN', is_required: true, recommended_year: 2, recommended_semester: 1, prerequisite: '5500112', subcategory: '', program: 'all' },
  { course_code: '2765142', course_name: 'เทคโนโลยีสารสนเทศและการสื่อสารเพื่อการเรียนรู้', credits: 1, category: 'FOUND', is_required: true, recommended_year: 1, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'all' },

  // ===== 2. วิชาครู (36 หน่วยกิต) =====
  { course_code: '2700101', course_name: 'ปฏิบัติการสอน 1', credits: 1, category: 'PROF', is_required: true, recommended_year: 2, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'all' },
  { course_code: '2700201', course_name: 'ปฏิบัติการสอน 2', credits: 1, category: 'PROF', is_required: true, recommended_year: 2, recommended_semester: 2, prerequisite: '2700101', subcategory: '', program: 'all' },
  { course_code: '2700301', course_name: 'ปฏิบัติการสอน 3', credits: 2, category: 'PROF', is_required: true, recommended_year: 3, recommended_semester: 1, prerequisite: '2700201', subcategory: '', program: 'all' },
  { course_code: '2700401', course_name: 'ปฏิบัติการสอน 4', credits: 8, category: 'PROF', is_required: true, recommended_year: 4, recommended_semester: 1, prerequisite: '2700301', subcategory: '', program: 'all' },
  { course_code: '2716304', course_name: 'การพัฒนาหลักสูตรและการออกแบบการเรียนการสอน', credits: 3, category: 'PROF', is_required: true, recommended_year: 3, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'all' },
  { course_code: '2719201', course_name: 'ภาษาไทยเพื่อการสื่อสารสําหรับวิชาชีพครู', credits: 2, category: 'PROF', is_required: true, recommended_year: 2, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'all' },
  { course_code: '2725373', course_name: 'ภาษาอังกฤษเพื่อการสื่อสารสําหรับครู', credits: 2, category: 'PROF', is_required: true, recommended_year: 3, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'all' },
  { course_code: '2746192', course_name: 'ปฐมนิเทศการศึกษา', credits: 2, category: 'PROF', is_required: true, recommended_year: 1, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'all' },
  { course_code: '2750298', course_name: 'การสร้างเสริมความสัมพันธ์ระหว่างสถานศึกษาผู้ปกครองและชุมชนในการพัฒนาผู้เรียน', credits: 2, category: 'PROF', is_required: true, recommended_year: 2, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'all' },
  { course_code: '2756306', course_name: 'การวิจัยเพื่อพัฒนาการเรียนรู้', credits: 2, category: 'PROF', is_required: true, recommended_year: 3, recommended_semester: 2, prerequisite: '', subcategory: '', program: 'all' },
  { course_code: '2757308', course_name: 'การวัดประเมินผลการเรียนรู้และประกันคุณภาพการศึกษา', credits: 3, category: 'PROF', is_required: true, recommended_year: 3, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'all' },
  { course_code: '2758501', course_name: 'สถิติและสารสนเทศทางการศึกษา', credits: 2, category: 'PROF', is_required: true, recommended_year: 2, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'all' },
  { course_code: '2759151', course_name: 'จิตวิทยาพื้นฐานเพื่อการศึกษา', credits: 2, category: 'PROF', is_required: true, recommended_year: 1, recommended_semester: 2, prerequisite: '', subcategory: '', program: 'all' },
  { course_code: '2759218', course_name: 'จิตวิทยาการศึกษาและการศึกษาพิเศษ', credits: 2, category: 'PROF', is_required: true, recommended_year: 2, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'all' },
  { course_code: '2765205', course_name: 'นวัตกรรมและเทคโนโลยีสารสนเทศและการสื่อสารเพื่อการเรียนรู้', credits: 2, category: 'PROF', is_required: true, recommended_year: 2, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'all' },

  // ===== 3. วิชาเอก — บังคับ (40 หน่วยกิต) =====
  { course_code: '2765133', course_name: 'ทฤษฎีการเรียนการสอนและจิตวิทยาทางเทคโนโลยีการศึกษา', credits: 2, category: 'MAJOR_CORE', is_required: true, recommended_year: 1, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'single_major' },
  { course_code: '2765135', course_name: 'พื้นฐานอิเล็กทรอนิกส์ทางการศึกษา', credits: 3, category: 'MAJOR_CORE', is_required: true, recommended_year: 1, recommended_semester: 2, prerequisite: '', subcategory: '', program: 'single_major' },
  { course_code: '2765219', course_name: 'การถ่ายภาพเพื่อการสื่อสารทางการศึกษา', credits: 3, category: 'MAJOR_CORE', is_required: true, recommended_year: 2, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'single_major' },
  { course_code: '2765220', course_name: 'การผลิตวีดิทัศน์การศึกษา', credits: 3, category: 'MAJOR_CORE', is_required: true, recommended_year: 2, recommended_semester: 2, prerequisite: '', subcategory: '', program: 'single_major' },
  { course_code: '2765240', course_name: 'สิ่งพิมพ์ดิจิทัลและการผลิตเพื่อการศึกษา', credits: 2, category: 'MAJOR_CORE', is_required: true, recommended_year: 2, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'single_major' },
  { course_code: '2765243', course_name: 'สื่อมัลติมีเดียและแอนิเมชันเพื่อการเรียนการสอน', credits: 3, category: 'MAJOR_CORE', is_required: true, recommended_year: 2, recommended_semester: 2, prerequisite: '', subcategory: '', program: 'single_major' },
  { course_code: '2765341', course_name: 'การออกแบบเว็บแบบเรซสปอนต์ซีฟเพื่อการเรียนรู้', credits: 3, category: 'MAJOR_CORE', is_required: true, recommended_year: 3, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'single_major' },
  { course_code: '2765345', course_name: 'การออกแบบระบบการสอนและศาสตร์การสอนออนไลน์', credits: 3, category: 'MAJOR_CORE', is_required: true, recommended_year: 3, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'single_major' },
  { course_code: '2765380', course_name: 'การบริหารจัดการและบริการงานเทคโนโลยีและสื่อสารการศึกษา', credits: 3, category: 'MAJOR_CORE', is_required: true, recommended_year: 3, recommended_semester: 2, prerequisite: '', subcategory: '', program: 'single_major' },
  { course_code: '2765405', course_name: 'การจัดโปรแกรมและกลยุทธ์การฝึกอบรม', credits: 3, category: 'MAJOR_CORE', is_required: true, recommended_year: 3, recommended_semester: 2, prerequisite: '', subcategory: '', program: 'single_major' },
  { course_code: '2765441', course_name: 'นวัตกรรมและการจัดการความรู้เพื่อการศึกษา', credits: 3, category: 'MAJOR_CORE', is_required: true, recommended_year: 3, recommended_semester: 2, prerequisite: '', subcategory: '', program: 'single_major' },
  { course_code: '2765450', course_name: 'วิธีวิทยาการสอนทางเทคโนโลยีและสื่อสารการศึกษา', credits: 3, category: 'MAJOR_CORE', is_required: true, recommended_year: 3, recommended_semester: 2, prerequisite: '', subcategory: '', program: 'single_major' },
  { course_code: '2766224', course_name: 'การเขียนโปรแกรมเพื่อการศึกษา', credits: 3, category: 'MAJOR_CORE', is_required: true, recommended_year: 2, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'single_major' },
  { course_code: '2766421', course_name: 'การออกแบบเทคโนโลยี', credits: 3, category: 'MAJOR_CORE', is_required: true, recommended_year: 3, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'single_major' },

  // ===== 4. วิชาเอก — เลือก 1: ด้านเทคโนโลยีฯ (≥9 นก.) =====
  { course_code: '2765131', course_name: 'การออกแบบและผลิตสื่อกราฟิก', credits: 3, category: 'MAJOR_ELEC_ET', is_required: false, recommended_year: 2, recommended_semester: 1, prerequisite: '', subcategory: 'MAJOR_ELEC_ET', program: 'single_major' },
  { course_code: '2765132', course_name: 'คอมพิวเตอร์กราฟิกและแอนิเมชัน', credits: 3, category: 'MAJOR_ELEC_ET', is_required: false, recommended_year: 2, recommended_semester: 1, prerequisite: '', subcategory: 'MAJOR_ELEC_ET', program: 'single_major' },
  { course_code: '2765213', course_name: 'ระบบการจัดการด้านการใช้สื่อทางการศึกษา', credits: 3, category: 'MAJOR_ELEC_ET', is_required: false, recommended_year: 2, recommended_semester: 2, prerequisite: '', subcategory: 'MAJOR_ELEC_ET', program: 'single_major' },
  { course_code: '2765217', course_name: 'สื่อมวลชนทางการศึกษาและทักษะการรู้เท่าทันสื่อ', credits: 3, category: 'MAJOR_ELEC_ET', is_required: false, recommended_year: 2, recommended_semester: 2, prerequisite: '', subcategory: 'MAJOR_ELEC_ET', program: 'single_major' },
  { course_code: '2765281', course_name: 'การผลิตรายการวิทยุและสื่อเสียงทางการศึกษา', credits: 2, category: 'MAJOR_ELEC_ET', is_required: false, recommended_year: 2, recommended_semester: 2, prerequisite: '', subcategory: 'MAJOR_ELEC_ET', program: 'single_major' },
  { course_code: '2765222', course_name: 'เทคโนโลยีเปลี่ยนโลกเพื่อเสริมสร้างการเรียนรู้ทางไกล', credits: 3, category: 'MAJOR_ELEC_ET', is_required: false, recommended_year: 2, recommended_semester: 2, prerequisite: '', subcategory: 'MAJOR_ELEC_ET', program: 'single_major' },
  { course_code: '2765305', course_name: 'การออกแบบสารและสื่อสร้างสรรค์', credits: 2, category: 'MAJOR_ELEC_ET', is_required: false, recommended_year: 3, recommended_semester: 1, prerequisite: '', subcategory: 'MAJOR_ELEC_ET', program: 'single_major' },
  { course_code: '2765307', course_name: 'การจัดการศึกษานอกสถานที่และแหล่งการเรียนรู้', credits: 3, category: 'MAJOR_ELEC_ET', is_required: false, recommended_year: 3, recommended_semester: 1, prerequisite: '', subcategory: 'MAJOR_ELEC_ET', program: 'single_major' },
  { course_code: '2765406', course_name: 'การเผยแพร่สัญญาณภาพและเสียงแบบมัลติแพลตฟอร์ม', credits: 3, category: 'MAJOR_ELEC_ET', is_required: false, recommended_year: 3, recommended_semester: 2, prerequisite: '', subcategory: 'MAJOR_ELEC_ET', program: 'single_major' },
  { course_code: '2765407', course_name: 'เทคโนโลยีเพื่อเสริมสร้างการเรียนรู้ในระดับประถมศึกษา', credits: 3, category: 'MAJOR_ELEC_ET', is_required: false, recommended_year: 3, recommended_semester: 2, prerequisite: '', subcategory: 'MAJOR_ELEC_ET', program: 'single_major' },
  { course_code: '2765408', course_name: 'เทคโนโลยีคัดสรรสำหรับนวัตกรรมการศึกษา', credits: 1, category: 'MAJOR_ELEC_ET', is_required: false, recommended_year: 3, recommended_semester: 2, prerequisite: '', subcategory: 'MAJOR_ELEC_ET', program: 'single_major' },

  // ===== 5. วิชาเอก — เลือก 2: ด้านคอมพิวเตอร์ฯ (≥5 นก.) จากวิชาของเอกคอมพิวเตอร์การศึกษาทั้งหมด =====
  { course_code: '2110183', course_name: 'ความรู้เบื้องต้นเกี่ยวกับคอมพิวเตอร์และการทํางานโปรแกรม', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2301101', course_name: 'แคลคูลัส 1', credits: 4, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2766125', course_name: 'การพัฒนาบทเรียนมัลติมีเดีย', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2766127', course_name: 'วิทยาศาสตร์พื้นฐานสําหรับเทคโนโลยี', credits: 2, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2766224', course_name: 'การเขียนโปรแกรมเพื่อการศึกษา', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2766233', course_name: 'พื้นฐานหลักการระบบฐานข้อมูล และการทําข้อมูล', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2766334', course_name: 'การเขียนโปรแกรมภาษาเพื่อการควบคุม: หุ่นยนต์ศึกษา', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2766355', course_name: 'ระบบสื่อสารข้อมูลและเครือข่ายคอมพิวเตอร์', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2766374', course_name: 'การวิเคราะห์และออกแบบระบบสารสนเทศทางการศึกษา', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2766417', course_name: 'วิธีวิทยาการสอนวิทยาการคํานวณ', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2766420', course_name: 'โครงงานวิจัยและนวัตกรรมคอมพิวเตอร์ศึกษา 1', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2766421', course_name: 'การออกแบบเทคโนโลยี', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2766440', course_name: 'โครงงานวิจัยและนวัตกรรมคอมพิวเตอร์ศึกษา 2', credits: 4, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2102213', course_name: 'ทฤษฎีวงจรไฟฟ้า 1 และปฏิบัติการ', credits: 4, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2110315', course_name: 'ระบบเชิงขนานและระบบกระจาย', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2110327', course_name: 'การออกแบบอัลกอริทึม', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2110352', course_name: 'สถาปัตยกรรมระบบคอมพิวเตอร์', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2110404', course_name: 'ทฤษฎีการคํานวณ', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2110428', course_name: 'ความรู้เบื้องต้นเกี่ยวกับการทําเหมืองข้อมูล', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2110431', course_name: 'วิทยาการภาพดิจิทัลเบื้องต้น', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2110435', course_name: 'วิทยาการหุ่นยนต์เบื้องต้น', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2110442', course_name: 'การวิเคราะห์โปรแกรมเชิงวัตถุ', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2110443', course_name: 'ปฏิสัมพันธ์ของมนุษย์กับคอมพิวเตอร์', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2110477', course_name: 'ปัญญาประดิษฐ์ 2', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2110481', course_name: 'เครือข่ายคอมพิวเตอร์ไร้สาย', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2110511', course_name: 'การเขียนโปรแกรมเกม', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2110512', course_name: 'คอมพิวเตอร์แอนิเมชัน', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2110514', course_name: 'คอมพิวเตอร์กราฟิกส์และการจําลองทางฟิสิกส์แบบเรียลไทม์', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2110571', course_name: 'โครงข่ายประสาท', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2301170', course_name: 'คอมพิวเตอร์และการโปรแกรม', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2301172', course_name: 'ปฏิบัติการคอมพิวเตอร์และการโปรแกรม', credits: 1, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2301260', course_name: 'เทคนิคการทําโปรแกรม', credits: 4, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2301263', course_name: 'โครงสร้างข้อมูลและขั้นตอนวิธีหลักมูล', credits: 4, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2301274', course_name: 'ระบบคอมพิวเตอร์', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2301279', course_name: 'ระบบเครือข่ายคอมพิวเตอร์เบื้องต้น', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2301371', course_name: 'ระบบปฏิบัติการ', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2603284', course_name: 'สถิติสําหรับวิทยาศาสตร์กายภาพ', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2603376', course_name: 'การค้นพบองค์ความรู้และการทําเหมืองข้อมูล', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2765219', course_name: 'การถ่ายภาพเพื่อการสื่อสารทางการศึกษา', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2765220', course_name: 'การผลิตวีดิทัศน์การศึกษา', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  { course_code: '2766218', course_name: 'คอมพิวเตอร์และเทคโนโลยีสารสนเทศสําหรับครู', credits: 3, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' },
  
  // กลุ่มที่ 1 รายวิชาด้านสารสนเทศศึกษา
  { course_code: '2206212', course_name: 'ภูมิทัศน์สารสนเทศ', credits: 3, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_1', program: 'single_major' },
  { course_code: '2206214', course_name: 'สังคมสารสนเทศ', credits: 3, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_1', program: 'single_major' },
  { course_code: '2206215', course_name: 'การศึกษาผู้ใช้', credits: 3, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_1', program: 'single_major' },
  { course_code: '2206226', course_name: 'หลักการจัดระบบสารสนเทศ', credits: 3, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_1', program: 'single_major' },
  { course_code: '2206235', course_name: 'บริการสารสนเทศ', credits: 3, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_1', program: 'single_major' },
  { course_code: '2206282', course_name: 'ทักษะเทคโนโลยีสารสนเทศในสํานักงาน', credits: 3, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_1', program: 'single_major' },
  { course_code: '2206283', course_name: 'ระบบค้นคืนสารสนเทศ', credits: 3, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_1', program: 'single_major' },
  { course_code: '2206289', course_name: 'การสื่อสารข้อมูลและเครือข่ายในงานสารสนเทศ', credits: 3, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_1', program: 'single_major' },
  { course_code: '2206313', course_name: 'การสอนการรู้สารสนเทศ', credits: 3, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_1', program: 'single_major' },
  { course_code: '2206315', course_name: 'ธุรกิจการพิมพ์สมัยใหม่', credits: 3, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_1', program: 'single_major' },
  { course_code: '2206323', course_name: 'ระบบสารสนเทศสําหรับมนุษยศาสตร์', credits: 3, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_1', program: 'single_major' },
  { course_code: '2206376', course_name: 'การจัดการสารสนเทศมรดกทางวัฒนธรรม', credits: 3, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_1', program: 'single_major' },
  { course_code: '2206386', course_name: 'การออกแบบส่วนต่อประสานกับผู้ใช้ในงานสารสนเทศ', credits: 3, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_1', program: 'single_major' },

  // กลุ่มที่ 2 รายวิชาด้านศิลปศึกษา
  { course_code: '2736176', course_name: 'ภูมิปัญญาด้านศิลปหัตถกรรมไทย', credits: 2, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_2', program: 'single_major' },
  { course_code: '2736342', course_name: 'ศิลปะเพื่อมนุษย์และสิ่งแวดล้อม', credits: 3, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_2', program: 'single_major' },
  { course_code: '2736172', course_name: 'การสื่อสารสร้างสรรค์ทางศิลปศึกษา', credits: 2, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_2', program: 'single_major' },
  { course_code: '2736162', course_name: 'ทฤษฎีและหลักการทางศิลปะ', credits: 2, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_2', program: 'single_major' },
  { course_code: '2736209', course_name: 'การเขียนและการออกแบบตัวอักษร', credits: 2, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_2', program: 'single_major' },
  { course_code: '2736242', course_name: 'กิจกรรมศิลปะสําหรับครูประถม', credits: 2, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_2', program: 'single_major' },
  { course_code: '2736259', course_name: 'คอมพิวเตอร์กราฟิกสําหรับศิลปศึกษา', credits: 2, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_2', program: 'single_major' },
  { course_code: '2736310', course_name: 'การออกแบบพาณิชยศิลป์', credits: 2, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_2', program: 'single_major' },
  { course_code: '2736316', course_name: 'การออกแบบเครื่องแต่งกาย', credits: 2, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_2', program: 'single_major' },
  { course_code: '2736329', course_name: 'การออกแบบของเล่นเพื่อการศึกษา', credits: 2, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_2', program: 'single_major' },
  { course_code: '2736369', course_name: 'การเขียนอักษรไทยวิจิตร', credits: 2, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_2', program: 'single_major' },

  // กลุ่มที่ 3 รายวิชาด้านวารสารสนเทศและสื่อใหม่
  { course_code: '2801200', course_name: 'กราฟิกสารสนเทศและการจัดหน้า', credits: 2, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_3', program: 'single_major' },
  { course_code: '2801203', course_name: 'การผลิตสื่อใหม่', credits: 3, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_3', program: 'single_major' },
  { course_code: '2801204', course_name: 'สังคมและวัฒนธรรมดิจิทัล', credits: 3, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_3', program: 'single_major' },
  { course_code: '2801300', course_name: 'ทฤษฎีวารสารสนเทศ', credits: 2, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_3', program: 'single_major' },
  { course_code: '2801306', course_name: 'การจัดการระบบวารสารสนเทศ', credits: 3, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_3', program: 'single_major' },
  { course_code: '2801307', course_name: 'การออกแบบสารสําหรับสื่อดิจิทัล', credits: 3, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_3', program: 'single_major' },
  { course_code: '2801340', course_name: 'การกํากับดูแลสื่อวารสารศาสตร์และสื่อใหม่', credits: 3, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_3', program: 'single_major' },
  { course_code: '2801404', course_name: 'สื่อใหม่ศึกษา', credits: 3, category: 'MAJOR_ELEC_GROUP', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'GROUP_3', program: 'single_major' }
];

// ---- Helper: ค้นหาวิชาจากรหัส ----
function findCourseByCode(code) {
  return CURRICULUM_DATA.find(c => c.course_code === code);
}

// ---- Helper: ค้นหาวิชาตามหมวด ----
function getCoursesByCategory(category) {
  return CURRICULUM_DATA.filter(c => c.category === category);
}

// ---- Helper: ค้นหาวิชาตาม keyword ----
// Deduplicate ด้วย course_code เพื่อป้องกันวิชาที่มีหลาย category (เช่น 2766224) ซ้ำในผลลัพธ์
function searchCourses(keyword) {
  const kw = keyword.toLowerCase();
  const seen = new Set();
  return CURRICULUM_DATA.filter(c => {
    if (seen.has(c.course_code)) return false;
    if (c.course_code.includes(kw) || c.course_name.toLowerCase().includes(kw)) {
      seen.add(c.course_code);
      return true;
    }
    return false;
  });
}

// ---- Helper: กรองวิชาตามโปรแกรม ----
function getCurriculumForProgram(program) {
  return CURRICULUM_DATA.filter(c => c.program === 'all' || c.program === program);
}

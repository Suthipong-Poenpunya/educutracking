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
  // 1.1.5-1.1.7 ภาษาอังกฤษ (บังคับ)
  { course_code: '5500111', course_name: 'ภาษาอังกฤษเพื่อการเรียนรู้ในชีวิตจริง 1', credits: 3, category: 'GE_LANG_EN', is_required: true, recommended_year: 1, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'all' },
  { course_code: '5500112', course_name: 'ภาษาอังกฤษเพื่อการเรียนรู้ในชีวิตจริง 2', credits: 3, category: 'GE_LANG_EN', is_required: true, recommended_year: 1, recommended_semester: 2, prerequisite: '5500111', subcategory: '', program: 'all' },
  { course_code: '5500252', course_name: 'พัฒนาทักษะภาษาอังกฤษ', credits: 3, category: 'GE_LANG_EN', is_required: true, recommended_year: 2, recommended_semester: 1, prerequisite: '5500112', subcategory: '', program: 'all' },

  // 1.2.1 บังคับเลือก (เลือก 1 จาก 2)
  { course_code: '2796200', course_name: 'ศิลปะเพื่อคุณภาพชีวิต', credits: 3, category: 'GE_21CENT', is_required: false, recommended_year: 1, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'all' },
  { course_code: '2737201', course_name: 'ดนตรีเพื่อสุนทรียภาพ', credits: 3, category: 'GE_21CENT', is_required: false, recommended_year: 1, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'all' },

  // 1.2.2 เลือก (เลือก 1 จาก 2)
  { course_code: '2746292', course_name: 'การศึกษาเพื่อการพัฒนาที่ยั่งยืน', credits: 3, category: 'GE_ELEC', is_required: false, recommended_year: 1, recommended_semester: 2, prerequisite: '', subcategory: '', program: 'all' },
  { course_code: '2747406', course_name: 'ภาวะผู้นำในการจัดการศึกษาในศตวรรษที่ 21', credits: 3, category: 'GE_ELEC', is_required: false, recommended_year: 2, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'all' },

  // ===== 2. วิชาครู (36 หน่วยกิต — บังคับทั้งหมด) =====
  { course_code: '2700101', course_name: 'ปฏิบัติการสอน 1', credits: 1, category: 'PROF', is_required: true, recommended_year: 2, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'all' },
  { course_code: '2700201', course_name: 'ปฏิบัติการสอน 2', credits: 1, category: 'PROF', is_required: true, recommended_year: 2, recommended_semester: 2, prerequisite: '2700101', subcategory: '', program: 'all' },
  { course_code: '2700301', course_name: 'ปฏิบัติการสอน 3', credits: 2, category: 'PROF', is_required: true, recommended_year: 3, recommended_semester: 1, prerequisite: '2700201', subcategory: '', program: 'all' },
  { course_code: '2700401', course_name: 'ปฏิบัติการสอน 4', credits: 8, category: 'PROF', is_required: true, recommended_year: 4, recommended_semester: 1, prerequisite: '2700301', subcategory: '', program: 'all' },
  { course_code: '2716304', course_name: 'การพัฒนาหลักสูตรและการออกแบบการเรียนการสอน', credits: 3, category: 'PROF', is_required: true, recommended_year: 3, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'all' },
  { course_code: '2719201', course_name: 'ภาษาไทยเพื่อการสื่อสารสำหรับวิชาชีพครู', credits: 2, category: 'PROF', is_required: true, recommended_year: 2, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'all' },
  { course_code: '2725373', course_name: 'ภาษาอังกฤษเพื่อการสื่อสารสำหรับครู', credits: 2, category: 'PROF', is_required: true, recommended_year: 3, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'all' },
  { course_code: '2746192', course_name: 'ปฐมนิเทศการศึกษา', credits: 2, category: 'PROF', is_required: true, recommended_year: 1, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'all' },
  { course_code: '2756306', course_name: 'การวิจัยเพื่อพัฒนาการเรียนรู้', credits: 2, category: 'PROF', is_required: true, recommended_year: 3, recommended_semester: 2, prerequisite: '', subcategory: '', program: 'all' },
  { course_code: '2757308', course_name: 'การวัดประเมินผลการเรียนรู้และประกันคุณภาพการศึกษา', credits: 3, category: 'PROF', is_required: true, recommended_year: 3, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'all' },
  { course_code: '2758501', course_name: 'สถิติและสารสนเทศทางการศึกษา', credits: 2, category: 'PROF', is_required: true, recommended_year: 2, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'all' },
  { course_code: '2759151', course_name: 'จิตวิทยาพื้นฐานเพื่อการศึกษา', credits: 2, category: 'PROF', is_required: true, recommended_year: 1, recommended_semester: 2, prerequisite: '', subcategory: '', program: 'all' },
  { course_code: '2759218', course_name: 'จิตวิทยาการศึกษาและการศึกษาพิเศษ', credits: 2, category: 'PROF', is_required: true, recommended_year: 2, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'all' },
  { course_code: '2765205', course_name: 'นวัตกรรมและเทคโนโลยีสารสนเทศและการสื่อสารเพื่อการศึกษา', credits: 2, category: 'PROF', is_required: true, recommended_year: 2, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'all' },
  { course_code: '2750298', course_name: 'การเสริมสร้างความสัมพันธ์ระหว่างสถานศึกษา ผู้ปกครองและชุมชน', credits: 2, category: 'PROF', is_required: true, recommended_year: 2, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'all' },

  // วิชาพื้นฐาน (ไม่นับหน่วยกิต)
  { course_code: '2765142', course_name: 'เทคโนโลยีสารสนเทศและการสื่อสารเพื่อการศึกษา (พื้นฐาน)', credits: 1, category: 'FOUND', is_required: true, recommended_year: 1, recommended_semester: 1, prerequisite: '', subcategory: '', program: 'all' },

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
  // ET Group
  { course_code: '2765131', course_name: 'การออกแบบและผลิตสื่อกราฟิก', credits: 3, category: 'MAJOR_ELEC1', is_required: false, recommended_year: 2, recommended_semester: 1, prerequisite: '', subcategory: 'MAJOR_ELEC1_ET', program: 'single_major' },
  { course_code: '2765132', course_name: 'คอมพิวเตอร์กราฟิกและแอนิเมชัน', credits: 3, category: 'MAJOR_ELEC1', is_required: false, recommended_year: 2, recommended_semester: 1, prerequisite: '', subcategory: 'MAJOR_ELEC1_ET', program: 'single_major' },
  { course_code: '2765213', course_name: 'ระบบการจัดการด้านการใช้สื่อทางการศึกษา', credits: 3, category: 'MAJOR_ELEC1', is_required: false, recommended_year: 2, recommended_semester: 2, prerequisite: '', subcategory: 'MAJOR_ELEC1_ET', program: 'single_major' },
  { course_code: '2765217', course_name: 'สื่อมวลชนทางการศึกษาและทักษะการรู้เท่าทันสื่อ', credits: 3, category: 'MAJOR_ELEC1', is_required: false, recommended_year: 2, recommended_semester: 2, prerequisite: '', subcategory: 'MAJOR_ELEC1_ET', program: 'single_major' },
  { course_code: '2765281', course_name: 'การผลิตรายการวิทยุและสื่อเสียงทางการศึกษา', credits: 2, category: 'MAJOR_ELEC1', is_required: false, recommended_year: 2, recommended_semester: 2, prerequisite: '', subcategory: 'MAJOR_ELEC1_ET', program: 'single_major' },
  { course_code: '2765222', course_name: 'เทคโนโลยีเปลี่ยนโลกเพื่อเสริมสร้างการเรียนรู้ทางไกล', credits: 3, category: 'MAJOR_ELEC1', is_required: false, recommended_year: 2, recommended_semester: 2, prerequisite: '', subcategory: 'MAJOR_ELEC1_ET', program: 'single_major' },
  { course_code: '2765305', course_name: 'การออกแบบสารและสื่อสร้างสรรค์', credits: 2, category: 'MAJOR_ELEC1', is_required: false, recommended_year: 3, recommended_semester: 1, prerequisite: '', subcategory: 'MAJOR_ELEC1_ET', program: 'single_major' },
  { course_code: '2765307', course_name: 'การจัดการศึกษานอกสถานที่และแหล่งการเรียนรู้', credits: 3, category: 'MAJOR_ELEC1', is_required: false, recommended_year: 3, recommended_semester: 1, prerequisite: '', subcategory: 'MAJOR_ELEC1_ET', program: 'single_major' },
  { course_code: '2765406', course_name: 'การเผยแพร่สัญญาณภาพและเสียงแบบมัลติแพลตฟอร์ม', credits: 3, category: 'MAJOR_ELEC1', is_required: false, recommended_year: 3, recommended_semester: 2, prerequisite: '', subcategory: 'MAJOR_ELEC1_ET', program: 'single_major' },
  { course_code: '2765407', course_name: 'เทคโนโลยีเพื่อเสริมสร้างการเรียนรู้ในระดับประถมศึกษา', credits: 3, category: 'MAJOR_ELEC1', is_required: false, recommended_year: 3, recommended_semester: 2, prerequisite: '', subcategory: 'MAJOR_ELEC1_ET', program: 'single_major' },
  { course_code: '2765408', course_name: 'เทคโนโลยีคัดสรรสำหรับนวัตกรรมการศึกษา', credits: 1, category: 'MAJOR_ELEC1', is_required: false, recommended_year: 3, recommended_semester: 2, prerequisite: '', subcategory: 'MAJOR_ELEC1_ET', program: 'single_major' },

  // CS Group
  { course_code: '2766218', course_name: 'คอมพิวเตอร์และเทคโนโลยีสารสนเทศสำหรับครูประถมศึกษา', credits: 3, category: 'MAJOR_ELEC1', is_required: false, recommended_year: 2, recommended_semester: 2, prerequisite: '', subcategory: 'MAJOR_ELEC1_CS', program: 'single_major' },
  { course_code: '2766355', course_name: 'ระบบสื่อสารข้อมูลและเครือข่ายคอมพิวเตอร์', credits: 3, category: 'MAJOR_ELEC1', is_required: false, recommended_year: 3, recommended_semester: 1, prerequisite: '', subcategory: 'MAJOR_ELEC1_CS', program: 'single_major' },
  { course_code: '2766362', course_name: 'การออกแบบแพลตฟอร์มการเรียนรู้', credits: 3, category: 'MAJOR_ELEC1', is_required: false, recommended_year: 3, recommended_semester: 1, prerequisite: '', subcategory: 'MAJOR_ELEC1_CS', program: 'single_major' },
  { course_code: '2766384', course_name: 'การควบคุมการปฏิบัติงานระยะไกลเพื่อการศึกษา', credits: 3, category: 'MAJOR_ELEC1', is_required: false, recommended_year: 3, recommended_semester: 2, prerequisite: '', subcategory: 'MAJOR_ELEC1_CS', program: 'single_major' }
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
function searchCourses(keyword) {
  const kw = keyword.toLowerCase();
  return CURRICULUM_DATA.filter(c =>
    c.course_code.includes(kw) ||
    c.course_name.toLowerCase().includes(kw)
  );
}

// ---- Helper: กรองวิชาตามโปรแกรม ----
function getCurriculumForProgram(program) {
  return CURRICULUM_DATA.filter(c => c.program === 'all' || c.program === program);
}

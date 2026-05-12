const fs = require('fs');

const csJs = fs.readFileSync('scratch/cs_electives.txt', 'utf-8');

let currJs = fs.readFileSync('curriculum_tmp.js', 'utf-8');

const newData = `const CURRICULUM_DATA = [
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
${csJs}
];`;

currJs = currJs.replace(/const CURRICULUM_DATA = \[[\s\S]+?\];/g, newData);

fs.writeFileSync('curriculum.js', currJs);

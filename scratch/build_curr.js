const fs = require('fs');

const compEduRaw = fs.readFileSync('comp_edu.txt', 'utf-8');
const lines = compEduRaw.split('\n').filter(l => l.trim().length > 0);

const csElectives = [];
let i = 0;
while (i < lines.length) {
    const line = lines[i];
    const match = line.match(/^(\d{7})\s+(.+)\s+(\d+)\s*\(/);
    if (match) {
        csElectives.push({
            code: match[1],
            name: match[2].trim(),
            credits: parseInt(match[3])
        });
    }
    i++;
}

let currJs = fs.readFileSync('curriculum.js', 'utf-8');

// Update CATEGORY_RULES
const newRules = `const CATEGORY_RULES = {
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
};`;

currJs = currJs.replace(/const CATEGORY_RULES = \{[\s\S]+?FREE_ELEC: \{[\s\S]+?\}\n\};/, newRules);

// Update GE_CATEGORIES
const newGeCat = `const GE_CATEGORIES = [
  { value: 'GE_CORE',    label: 'ตามกำหนดมหาวิทยาลัย' },
  { value: 'GE_LANG_EN', label: 'ภาษาอังกฤษ' },
  { value: 'GE_LANG_OT', label: 'ภาษาที่สาม' },
  { value: 'GE_FAC',     label: 'กลุ่มวิชาคณะครุศาสตร์' },
  { value: 'FREE_ELEC',  label: 'วิชาเลือกเสรี' }
];`;

currJs = currJs.replace(/const GE_CATEGORIES = \[[\s\S]+?\];/, newGeCat);

// Update CATEGORY_LABELS
const newLabels = `const CATEGORY_LABELS = {
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
};`;

currJs = currJs.replace(/const CATEGORY_LABELS = \{[\s\S]+?\};/, newLabels);

// Generate CS Electives
const csJs = csElectives.map(c => `  { course_code: '${c.code}', course_name: '${c.name}', credits: ${c.credits}, category: 'MAJOR_ELEC_CS', is_required: false, recommended_year: 0, recommended_semester: 0, prerequisite: '', subcategory: 'MAJOR_ELEC_CS', program: 'single_major' }`).join(',\n');

// I will just use multi_replace_file_content or manually inject this.
// For now let's write csJs to a file to inject it manually
fs.writeFileSync('scratch/cs_electives.txt', csJs);
fs.writeFileSync('curriculum_tmp.js', currJs);

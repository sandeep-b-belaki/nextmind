// EXTRA DEMO SCHEMES — sample/demo content only (not real government schemes).
// official_url is filled from OFFICIAL_PORTALS (real Karnataka Govt department portals).

import { DemoSchemeSeed, D, stepBase, OFFICIAL_PORTALS, PORTAL_OVERRIDES } from './demo-data';

type Cat =
  | 'students' | 'women' | 'farmers' | 'employment' | 'housing'
  | 'health' | 'disability' | 'senior-citizens' | 'financial' | 'business';

interface Rule { field: string; operator: string; value: string }
type Doc = (typeof D)[keyof typeof D];

const CAT_DEFAULTS: Record<Cat, { dept: string; elig: Rule[]; docs: Doc[] }> = {
  students: {
    dept: 'public-instruction',
    elig: [
      { field: 'residency', operator: 'eq', value: 'true' },
      { field: 'student', operator: 'eq', value: 'true' },
      { field: 'age_max', operator: 'lte', value: '30' },
      { field: 'income_max', operator: 'lte', value: '300000' },
    ],
    docs: [D.aadhaar, D.income, D.marks, D.collegeId, D.bank, D.photo],
  },
  women: {
    dept: 'women-child',
    elig: [
      { field: 'residency', operator: 'eq', value: 'true' },
      { field: 'gender', operator: 'eq', value: 'female' },
      { field: 'age_min', operator: 'gte', value: '18' },
      { field: 'income_max', operator: 'lte', value: '500000' },
    ],
    docs: [D.aadhaar, D.income, D.bank, D.residence, D.photo],
  },
  farmers: {
    dept: 'agriculture',
    elig: [
      { field: 'residency', operator: 'eq', value: 'true' },
      { field: 'farmer', operator: 'eq', value: 'true' },
      { field: 'income_max', operator: 'lte', value: '500000' },
    ],
    docs: [D.aadhaar, D.land, D.bank, D.income, D.residence, D.photo],
  },
  employment: {
    dept: 'labour',
    elig: [
      { field: 'residency', operator: 'eq', value: 'true' },
      { field: 'age_min', operator: 'gte', value: '18' },
      { field: 'age_max', operator: 'lte', value: '35' },
      { field: 'income_max', operator: 'lte', value: '300000' },
    ],
    docs: [D.aadhaar, D.income, D.marks, D.bank, D.residence, D.photo],
  },
  housing: {
    dept: 'housing-board',
    elig: [
      { field: 'residency', operator: 'eq', value: 'true' },
      { field: 'age_min', operator: 'gte', value: '21' },
      { field: 'income_max', operator: 'lte', value: '250000' },
    ],
    docs: [D.aadhaar, D.income, D.land, D.bank, D.residence, D.photo],
  },
  health: {
    dept: 'health-family-welfare',
    elig: [
      { field: 'residency', operator: 'eq', value: 'true' },
      { field: 'income_max', operator: 'lte', value: '300000' },
    ],
    docs: [D.aadhaar, D.income, D.ration, D.bank, D.photo],
  },
  disability: {
    dept: 'social-welfare',
    elig: [
      { field: 'residency', operator: 'eq', value: 'true' },
      { field: 'disability', operator: 'eq', value: 'true' },
      { field: 'age_min', operator: 'gte', value: '18' },
      { field: 'income_max', operator: 'lte', value: '500000' },
    ],
    docs: [D.aadhaar, D.disabilityCert, D.income, D.bank, D.photo],
  },
  'senior-citizens': {
    dept: 'social-welfare',
    elig: [
      { field: 'residency', operator: 'eq', value: 'true' },
      { field: 'age_min', operator: 'gte', value: '60' },
      { field: 'income_max', operator: 'lte', value: '150000' },
    ],
    docs: [D.aadhaar, D.income, D.bank, D.residence, D.pensionBook, D.photo],
  },
  financial: {
    dept: 'social-welfare',
    elig: [
      { field: 'residency', operator: 'eq', value: 'true' },
      { field: 'income_max', operator: 'lte', value: '250000' },
    ],
    docs: [D.aadhaar, D.income, D.bank, D.ration, D.residence, D.photo],
  },
  business: {
    dept: 'msme',
    elig: [
      { field: 'residency', operator: 'eq', value: 'true' },
      { field: 'age_min', operator: 'gte', value: '21' },
      { field: 'age_max', operator: 'lte', value: '55' },
      { field: 'income_max', operator: 'lte', value: '500000' },
    ],
    docs: [D.aadhaar, D.income, D.bank, D.residence, D.photo],
  },
};

interface Compact {
  slug: string;
  cat: Cat;
  dept?: string;
  kn: string; en: string; hi: string;
  dkn: string; den: string; dhi: string;
  skn: string; sen: string; shi: string;
  start?: string;
  last?: string;
  views?: number;
  elig?: Rule[];
  docs?: Doc[];
}

function build(c: Compact): DemoSchemeSeed {
  const def = CAT_DEFAULTS[c.cat];
  const dept = c.dept ?? def.dept;
  return {
    slug: c.slug,
    name_kn: c.kn, name_en: c.en, name_hi: c.hi,
    desc_kn: c.dkn, desc_en: c.den, desc_hi: c.dhi,
    simple_kn: c.skn, simple_en: c.sen, simple_hi: c.shi,
    category: c.cat, department: dept,
    start_date: c.start ?? '2026-09-01',
    last_date: c.last ?? '2026-12-31',
    status: 'published',
    official_url: PORTAL_OVERRIDES[c.slug] ?? OFFICIAL_PORTALS[dept] ?? 'https://karnataka.gov.in',
    last_verified_at: '2026-09-25',
    verify_status: 'verified',
    view_count: c.views ?? 1200,
    tutorial_video: null,
    eligibility: c.elig ?? def.elig,
    documents: c.docs ?? def.docs,
    steps: stepBase(c.kn, c.en, c.hi),
  };
}

export const extraSchemes: DemoSchemeSeed[] = [
  // ── students ─────────────────────────────────────────────
  build({
    slug: 'pre-matric-scholarship-2026', cat: 'students',
    kn: 'ಪ್ರಿ-ಮ್ಯಾಟ್ರಿಕ್ ವೇತನ ಯೋಜನೆ', en: 'Pre-Matric Scholarship Scheme', hi: 'प्री-मैट्रिक छात्रवृत्ति योजना',
    dkn: '9 ರಿಂದ 10ನೇ ತರಗತಿ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಶಾಲಾ ವೇತನ.', den: 'School scholarship for students in classes 9 to 10.', dhi: 'कक्षा 9 से 10 के छात्रों के लिए स्कूल छात्रवृत्ति।',
    skn: '9 ಮತ್ತು 10ನೇ ತರಗತಿಯಲ್ಲಿ ಓದುತ್ತಿರುವ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ವಾರ್ಷಿಕ ವೇತನ ನೇರವಾಗಿ ಬ್ಯಾಂಕ್‌ಗೆ ಜಮಾ ಆಗುತ್ತದೆ.', sen: 'Students studying in classes 9 and 10 receive an annual scholarship credited directly to the bank.', shi: 'कक्षा 9 और 10 के छात्रों को वार्षिक छात्रवृत्ति सीधे बैंक में जमा होती है।',
    views: 3100, last: '2026-11-30',
  }),
  build({
    slug: 'post-matric-scholarship-2026', cat: 'students',
    kn: 'ಪೋಸ್ಟ್-ಮ್ಯಾಟ್ರಿಕ್ ವೇತನ ಯೋಜನೆ', en: 'Post-Matric Scholarship Scheme', hi: 'पोस्ट-मैट्रिक छात्रवृत्ति योजना',
    dkn: 'ಪದವಿ ಮತ್ತು ಪದವಿಪೂರ್ವ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಉನ್ನತ ಶಿಕ್ಷಣ ವೇತನ.', den: 'Higher education scholarship for undergraduate and postgraduate students.', dhi: 'स्नातक और स्नातकोत्तर छात्रों के लिए उच्च शिक्षा छात्रवृत्ति।',
    skn: 'ಕಾಲೇಜಿನಲ್ಲಿ ಓದುತ್ತಿರುವ ಅರ್ಹ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ತಿಂಗಳ ವೇತನ ಮತ್ತು ಶುಲ್ಕ ಸಹಾಯ ಸಿಗುತ್ತದೆ.', sen: 'Eligible students in college get a monthly stipend and fee assistance.', shi: 'कॉलेज के पात्र छात्रों को मासिक वेतन और शुल्क सहायता मिलती है।',
    views: 4200, last: '2026-12-15',
  }),
  build({
    slug: 'school-uniform-books-2026', cat: 'students', last: '2027-01-31',
    kn: 'ಶಾಲಾ ಸಮವಸ್ತ್ರ ಮತ್ತು ಪುಸ್ತಕ ಸಹಾಯ', en: 'School Uniform & Books Assistance', hi: 'स्कूल वर्दी एवं पुस्तक सहायता',
    dkn: 'ಸರ್ಕಾರಿ ಶಾಲಾ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಸಮವಸ್ತ್ರ ಮತ್ತು ಪಠ್ಯಪುಸ್ತಕ ಸಹಾಯ ಧನ.', den: 'Uniform and textbook assistance money for government school students.', dhi: 'सरकारी स्कूल के छात्रों के लिए वर्दी और पुस्तक सहायता राशि।',
    skn: 'ಪ್ರತಿ ಶೈಕ್ಷಣಿಕ ವರ್ಷದಲ್ಲಿ ಸಮವಸ್ತ್ರ ಮತ್ತು ಪುಸ್ತಕ ಖರ್ಚಿಗೆ ಹೆತ್ತವರ ಖಾತೆಗೆ ಹಣ ಜಮಾ ಆಗುತ್ತದೆ.', sen: 'Every academic year, money for uniforms and books is credited to the parent’s account.', shi: 'हर शैक्षिक वर्ष में वर्दी और पुस्तकों के लिए राशि अभिभावक के खाते में जमा होती है।',
    views: 5600,
  }),
  build({
    slug: 'hostel-food-subsidy-2026', cat: 'students', dept: 'social-welfare', last: '2026-12-31',
    kn: 'ವಸತಿ ಶಾಲಾ ಊಟ ಸಬ್ಸಿಡಿ', en: 'Residential School Meal Subsidy', hi: 'आवासीय स्कूल भोजन सब्सिडी',
    dkn: 'ವಸತಿ ಶಾಲಾ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ದೈನಂದಿನ ಊಟಕ್ಕೆ ಸಬ್ಸಿಡಿ.', den: 'Meal subsidy for students in residential schools.', dhi: 'आवासीय स्कूल के छात्रों के दैनिक भोजन पर सब्सिडी।',
    skn: 'ವಸತಿ ಶಾಲೆಯಲ್ಲಿ ಓದುವ ವಿದ್ಯಾರ್ಥಿಗಳ ಊಟದ ಖರ್ಚಿನ ಬಹುಭಾಗವನ್ನು ಸರ್ಕಾರ ಭರಿಸುತ್ತದೆ.', sen: 'The government covers most of the meal cost for residential school students.', shi: 'सरकार आवासीय स्कूल के छात्रों के भोजन खर्च का बड़ा हिस्सा वहन करती है।',
    views: 2750,
  }),
  build({
    slug: 'college-transport-allowance-2026', cat: 'students', last: '2026-11-30',
    kn: 'ಕಾಲೇಜ್ ಸಂಚಾರ ಭತ್ಯೆ', en: 'College Transport Allowance', hi: 'कॉलेज परिवहन भत्ता',
    dkn: 'ದಿನ ನಿತ್ಯ ಕಾಲೇಜ್ ಪ್ರಯಾಣಿಸುವ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಸಂಚಾರ ಭತ್ಯೆ.', den: 'Transport allowance for students travelling to college daily.', dhi: 'रोज़ कॉलेज जाने वाले छात्रों के लिए परिवहन भत्ता।',
    skn: 'ಕಾಲೇಜ್‌ಗೆ ಪ್ರತಿದಿನ ಪ್ರಯಾಣಿಸುವ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಮಾಸಿಕ ಸಂಚಾರ ಖರ್ಚಿಗೆ ಭತ್ಯೆ ದೊರೆಯುತ್ತದೆ.', sen: 'Students who travel to college daily get a monthly transport allowance.', shi: 'रोज़ कॉलेज जाने वाले छात्रों को मासिक परिवहन भत्ता मिलता है।',
    views: 1980,
  }),
  build({
    slug: 'student-digital-literacy-2026', cat: 'students', dept: 'skill-development', last: '2027-02-28',
    kn: 'ವಿದ್ಯಾರ್ಥಿ ಡಿಜಿಟಲ್ ಸಾಕ್ಷರತಾ ಯೋಜನೆ', en: 'Student Digital Literacy Scheme', hi: 'छात्र डिजिटल साक्षरता योजना',
    dkn: 'ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಉಚಿತ ಕಂಪ್ಯೂಟರ್ ಮತ್ತು ಡಿಜಿಟಲ್ ತರಬೇತಿ.', den: 'Free computer and digital training for students.', dhi: 'छात्रों के लिए मुफ्त कंप्यूटर और डिजिटल प्रशिक्षण।',
    skn: 'ಆಯ್ಕೆಯಾದ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಡಿಜಿಟಲ್ ಸಾಕ್ಷರತೆ ತರಬೇತಿ ಮತ್ತು ಕಂಪ್ಯೂಟರ್ ಪ್ರಯೋಗಾಲಯ ಸೌಲಭ್ಯ ಉಚಿತ.', sen: 'Selected students get free digital literacy training and computer lab access.', shi: 'चयनित छात्रों को मुफ्त डिजिटल साक्षरता प्रशिक्षण और कंप्यूटर लैब सुविधा मिलती है।',
    views: 2310,
  }),
  build({
    slug: 'competitive-exam-coaching-2026', cat: 'students', dept: 'skill-development', last: '2026-12-31',
    kn: 'ಸ್ಪರ್ಧಾತ್ಮಕ ಪರೀಕ್ಷಾ ತರಬೇತಿ ಯೋಜನೆ', en: 'Competitive Exam Coaching Scheme', hi: 'प्रतियोगी परीक्षा कोचिंग योजना',
    dkn: 'ಸರ್ಕಾರಿ ಉದ್ಯೋಗ ಪರೀಕ್ಷೆಗಳಿಗೆ ಉಚಿತ ತರಬೇತಿ ಕೇಂದ್ರಗಳು.', den: 'Free coaching centres for government job examinations.', dhi: 'सरकारी नौकरी परीक्षाओं के लिए मुफ्त कोचिंग केंद्र।',
    skn: 'ಆಯ್ಕೆಯಾದ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಅನುಭವಿ ಬೋಧಕರಿಂದ ಉಚಿತ ತರಬೇತಿ ಮತ್ತು ಮಾರ್ಗದರ್ಶನ ಸಿಗುತ್ತದೆ.', sen: 'Selected students get free training and guidance from experienced faculty.', shi: 'चयनित छात्रों को अनुभवी शिक्षकों से मुफ्त प्रशिक्षण और मार्गदर्शन मिलता है।',
    views: 3420,
  }),

  // ── women ────────────────────────────────────────────────
  build({
    slug: 'maternity-benefit-cash-2026', cat: 'women', last: '2026-12-31',
    kn: 'ಮಾತೃತ್ವ ನಗದು ಸಹಾಯ ಯೋಜನೆ', en: 'Maternity Cash Benefit Scheme', hi: 'मातृत्व नकद लाभ योजना',
    dkn: 'ಗರ್ಭಿಣಿ ಮತ್ತು ಬಾಣಂತಿ ಮಹಿಳೆಯರಿಗೆ ನಗದು ಸಹಾಯ.', den: 'Cash assistance for pregnant and nursing mothers.', dhi: 'गर्भवती और स्तनपान कराने वाली माताओं के लिए नकद सहायता।',
    skn: 'ಮಗು ಜನಿಸಿದ ನಂತರ ನಿಗದಿತ ಮೊತ್ತದ ಹಣ ಮಹಿಳೆಯ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಹಂತಗಳಲ್ಲಿ ಜಮಾ ಆಗುತ್ತದೆ.', sen: 'A fixed amount is credited to the mother’s bank account in instalments after childbirth.', shi: 'बच्चे के जन्म के बाद निश्चित राशि माँ के बैंक खाते में किस्तों में जमा होती है।',
    views: 4800,
  }),
  build({
    slug: 'childcare-support-2026', cat: 'women', last: '2027-03-31',
    kn: 'ಶಿಶು ಪಾಲನಾ ಸಹಾಯ ಯೋಜನೆ', en: 'Childcare Support Scheme', hi: 'शिशु देखभाल सहायता योजना',
    dkn: 'ಕೆಲಸ ಮಾಡುವ ತಾಯಂದಿರಿಗೆ ಮಕ್ಕಳ ದಾಳ/ಪಾಲನಾ ಸಹಾಯ.', den: 'Childcare support for working mothers.', dhi: 'काम करने वाली माताओं के लिए बाल देखभाल सहायता।',
    skn: 'ಅಂಗನವಾಡಿ ಮತ್ತು ಮಕ್ಕಳ ದಾಳಿಗೆ ಹಣ ಸಹಾಯ ದೊರೆಯುವುದರಿಂದ ತಾಯಿ ನಿರಾತಂಕವಾಗಿ ಕೆಲಸ ಮಾಡಬಹುದು.', sen: 'Money for crèche and daycare lets mothers work without worry.', shi: 'क्रेच और डेकेयर के लिए धन मिलने से माँ चिंता मुक्त होकर काम कर सकती है।',
    views: 2190,
  }),
  build({
    slug: 'free-bus-travel-women-2026', cat: 'women', dept: 'labour', last: '2027-03-31',
    kn: 'ಮಹಿಳೆಯರಿಗೆ ಉಚಿತ ಬಸ್ ಪ್ರಯಾಣ ಯೋಜನೆ', en: 'Free Bus Travel for Women Scheme', hi: 'महिलाओं के लिए मुफ्त बस यात्रा योजना',
    dkn: 'ರಾಜ್ಯದ ಸರ್ಕಾರಿ ಬಸ್‌ಗಳಲ್ಲಿ ಮಹಿಳೆಯರಿಗೆ ಉಚಿತ ಪ್ರಯಾಣ.', den: 'Free travel for women in state-run buses.', dhi: 'राज्य बसों में महिलाओं के लिए मुफ्त यात्रा।',
    skn: 'ರಾಜ್ಯ ಸಾರಿಗೆ ಸಂಸ್ಥೆಯ ಬಸ್‌ಗಳಲ್ಲಿ ಮಹಿಳೆಯರು ಉಚಿತವಾಗಿ ಪ್ರಯಾಣಿಸಬಹುದು. ಗುರುತಿನ ಚೀಟಿ ಕಡ್ಡಾಯ.', sen: 'Women can travel free in state transport buses. An ID card is mandatory.', shi: 'महिलाएं राज्य परिवहन बसों में मुफ्त यात्रा कर सकती हैं। पहचान पत्र अनिवार्य है।',
    views: 7400,
  }),
  build({
    slug: 'women-entrepreneur-microloan-2026', cat: 'women', dept: 'msme', last: '2026-12-31',
    kn: 'ಮಹಿಳಾ ಉದ್ಯಮ ಸೂಕ್ಷ್ಮಸಾಲ ಯೋಜನೆ', en: 'Women Entrepreneur Micro-Loan Scheme', hi: 'महिला उद्यम सूक्ष्म ऋण योजना',
    dkn: 'ಮಹಿಳಾ ಉದ್ಯಮಿಗಳಿಗೆ ಕಡಿಮೆ ಬಡ್ಡಿಯ ಸೂಕ್ಷ್ಮಸಾಲ.', den: 'Low-interest micro-loans for women entrepreneurs.', dhi: 'महिला उद्यमियों के लिए कम ब्याज पर सूक्ष्म ऋण।',
    skn: 'ಸಣ್ಣ ವ್ಯಾಪಾರ ಬೆಳೆಸಲು 50,000 ರೂ.ವರೆಗೆ ಕಡಿಮೆ ಬಡ್ಡಿಯಲ್ಲಿ ಸಾಲ ಸಿಗುತ್ತದೆ.', sen: 'Loans up to ₹50,000 at low interest to grow a small business.', shi: 'छोटा व्यवसाय बढ़ाने के लिए 50,000 रुपये तक कम ब्याज पर ऋण मिलता है।',
    views: 3050,
  }),
  build({
    slug: 'single-women-allowance-2026', cat: 'women', last: '2026-12-31',
    kn: 'ಏಕೈಕ ಮಹಿಳಾ ಭತ್ಯೆ ಯೋಜನೆ', en: 'Single Women Allowance Scheme', hi: 'एकल महिला भत्ता योजना',
    dkn: 'ಪುರುಷ ಆಶ್ರಯವಿಲ್ಲದ ಮಹಿಳೆಯರಿಗೆ ಮಾಸಿಕ ಭತ್ಯೆ.', den: 'Monthly allowance for women without a male breadwinner.', dhi: 'पुरुष आश्रय के बिना रहने वाली महिलाओं के लिए मासिक भत्ता।',
    skn: 'ವಿಧವೆ, ವಿಚ್ಛೇದಿತ ಅಥವಾ ತ್ಯಜಿಸಲ್ಪಟ್ಟ ಮಹಿಳೆಯರಿಗೆ ಪ್ರತಿ ತಿಂಗಳು ನಿಗದಿತ ಭತ್ಯೆ ಜಮಾ ಆಗುತ್ತದೆ.', sen: 'Widowed, divorced or deserted women receive a fixed monthly allowance.', shi: 'विधवा, तलाकशुदा या छोड़ी गई महिलाओं को निश्चित मासिक भत्ता मिलता है।',
    views: 2670,
  }),
  build({
    slug: 'women-skill-livelihood-2026', cat: 'women', dept: 'skill-development', last: '2027-01-31',
    kn: 'ಮಹಿಳಾ ಕೌಶಲ್ಯ ಜೀವನೋಪಾಯ ಯೋಜನೆ', en: 'Women Skill Livelihood Scheme', hi: 'महिला कौशल आजीविका योजना',
    dkn: 'ಮಹಿಳೆಯರಿಗೆ ಕೌಶಲ್ಯ ತರಬೇತಿ ಜೊತೆ ಉದ್ಯೋಗ/ಆದಾಯದ ಮಾರ್ಗ.', den: 'Skill training with a job/income path for women.', dhi: 'महिलाओं के लिए कौशल प्रशिक्षण के साथ रोज़गार/आय का मार्ग।',
    skn: 'ಟೈಲರಿಂಗ್, ಆಹಾರ ಸಿದ್ಧಪಡಿಸುವಿಕೆ, ಕ್ರಾಫ್ಟ್ ಮುಂತಾದ ತರಬೇತಿ ನೀಡಿ ಆದಾಯ ಗಳಿಸಲು ಸಹಾಯ ಮಾಡಲಾಗುತ್ತದೆ.', sen: 'Training in tailoring, food processing, crafts etc. is given to help earn income.', shi: 'सिलाई, खाद्य प्रसंस्करण, हस्तकला आदि का प्रशिक्षण आय अर्जित करने हेतु दिया जाता है।',
    views: 2440,
  }),
  build({
    slug: 'widow-women-pension-2026', cat: 'women', last: '2026-12-31',
    kn: 'ವಿಧವಾ ಮಹಿಳಾ ಪಿಂಚಣಿ ಸಹಾಯ', en: 'Widow Women Pension Assistance', hi: 'विधवा महिला पेंशन सहायता',
    dkn: 'ಅರ್ಹ ವಿಧವಾ ಮಹಿಳೆಯರಿಗೆ ಮಾಸಿಕ ಪಿಂಚಣಿ.', den: 'Monthly pension for eligible widowed women.', dhi: 'पात्र विधवा महिलाओं के लिए मासिक पेंशन।',
    skn: 'ನಿಗದಿತ ವಯಸ್ಸು ಮತ್ತು ಆದಾಯ ಮಿತಿಯೊಳಗಿನ ವಿಧವಾ ಮಹಿಳೆಯರಿಗೆ ಪ್ರತಿ ತಿಂಗಳು ಪಿಂಚಣಿ ಸಿಗುತ್ತದೆ.', sen: 'Widowed women within the age and income limit get a monthly pension.', shi: 'आयु और आय सीमा के भीतर की विधवा महिलाओं को मासिक पेंशन मिलती है।',
    views: 3910,
  }),
  build({
    slug: 'girl-child-savings-2026', cat: 'women', dept: 'social-welfare', last: '2027-03-31',
    kn: 'ಹೆಣ್ಣು ಮಗು ಉಳಿತಾಯ ಯೋಜನೆ', en: 'Girl Child Savings Scheme', hi: 'बालिका बचत योजना',
    dkn: 'ಹೆಣ್ಣು ಮಕ್ಕಳ ಭವಿಷ್ಯದ ಶಿಕ್ಷಣಕ್ಕಾಗಿ ಉಳಿತಾಯ ಪ್ರೋತ್ಸಾಹ.', den: 'Savings incentive for a girl child’s future education.', dhi: 'भविष्य की शिक्षा के लिए बालिका बचत प्रोत्साहन।',
    skn: 'ಹೆಣ್ಣು ಮಗುವಿನ ಖಾತೆಯಲ್ಲಿ ಠೇವಣಿಗೆ ಸರ್ಕಾರದಿಂದ ಹೊಂದಾಣಿಕೆ ಹಣ ಜಮಾ ಆಗುತ್ತದೆ.', sen: 'The government adds matching money to the girl’s deposit account.', shi: 'बालिका के खाते में जमा राशि पर सरकार मिलान धन जमा करती है।',
    views: 3340,
  }),
  // ── farmers ──────────────────────────────────────────────
  build({
    slug: 'drip-irrigation-subsidy-2026', cat: 'farmers', last: '2026-12-31',
    kn: 'ಹನಿ ನೀರಾವರಿ ಸಬ್ಸಿಡಿ ಯೋಜನೆ', en: 'Drip Irrigation Subsidy Scheme', hi: 'ड्रिप सिंचाई सब्सिडी योजना',
    dkn: 'ಹನಿ ನೀರಾವರಿ ಉಪಕರಣಗಳ ಖರೀದಿಗೆ ಸಬ್ಸಿಡಿ.', den: 'Subsidy on purchase of drip irrigation equipment.', dhi: 'ड्रिप सिंचाई उपकरण की खरीद पर सब्सिडी।',
    skn: 'ನೀರು ಉಳಿಸುವ ಹನಿ ನೀರಾವರಿ ವ್ಯವಸ್ಥೆ ಅಳವಡಿಸಲು ಸಾಧನದ ಬೆಲೆಯ ಬಹುಭಾಗವನ್ನು ಸರ್ಕಾರ ಭರಿಸುತ್ತದೆ.', sen: 'The government pays most of the cost of installing a water-saving drip system.', shi: 'पानी बचाने वाली ड्रिप प्रणाली लगाने की लागत का बड़ा हिस्सा सरकार वहन करती है।',
    views: 3600,
  }),
  build({
    slug: 'organic-farming-incentive-2026', cat: 'farmers', last: '2027-01-31',
    kn: 'ಸಾವಯವ ಕೃಷಿ ಪ್ರೋತ್ಸಾಹ ಯೋಜನೆ', en: 'Organic Farming Incentive Scheme', hi: 'जैविक खेती प्रोत्साहन योजना',
    dkn: 'ಸಾವಯವ ಕೃಷಿ ಮಾಡುವ ರೈತರಿಗೆ ಪ್ರೋತ್ಸಾಹ ಧನ.', den: 'Incentive money for farmers practising organic farming.', dhi: 'जैविक खेती करने वाले किसानों के लिए प्रोत्साहन राशि।',
    skn: 'ರಾಸಾಯನಿಕ ರಹಿತ ಕೃಷಿಗೆ ಬದಲಾಗುವ ರೈತರಿಗೆ ಪ್ರತಿ ಎಕರೆಗೆ ನಿಗದಿತ ಪ್ರೋತ್ಸಾಹ ಧನ ದೊರೆಯುತ್ತದೆ.', sen: 'Farmers shifting to chemical-free farming get a fixed incentive per acre.', shi: 'रासायनिक मुक्त खेती अपनाने वाले किसानों को प्रति एकड़ निश्चित प्रोत्साहन मिलता है।',
    views: 2870,
  }),
  build({
    slug: 'farmer-pension-2026', cat: 'farmers', last: '2026-12-31',
    kn: 'ರೈತ ಪಿಂಚಣಿ ಯೋಜನೆ', en: 'Farmer Pension Scheme', hi: 'किसान पेंशन योजना',
    dkn: '60 ವರ್ಷ ಮೇಲ್ಪಟ್ಟ ರೈತರಿಗೆ ಮಾಸಿಕ ಪಿಂಚಣಿ.', den: 'Monthly pension for farmers above 60 years.', dhi: '60 वर्ष से अधिक आयु के किसानों के लिए मासिक पेंशन।',
    skn: 'ನೋಂದಾಯಿತ ರೈತರು 60 ವರ್ಷ ತುಂಬಿದ ನಂತರ ಪ್ರತಿ ತಿಂಗಳು ಪಿಂಚಣಿ ಪಡೆಯಬಹುದು.', sen: 'Registered farmers receive a monthly pension after turning 60.', shi: 'पंजीकृत किसान 60 वर्ष की आयु के बाद मासिक पेंशन पाते हैं।',
    views: 4450,
  }),
  build({
    slug: 'crop-loan-waiver-2026', cat: 'farmers', dept: 'social-welfare', last: '2026-11-30',
    kn: 'ಬೆಳೆ ಸಾಲ ಮನ್ನಣೆ ಯೋಜನೆ', en: 'Crop Loan Waiver Scheme', hi: 'फसल ऋण माफी योजना',
    dkn: 'ಅರ್ಹ ರೈತರ ಬೆಳೆ ಸಾಲ ಮನ್ನಣೆ.', den: 'Waiver of crop loans for eligible farmers.', dhi: 'पात्र किसानों के फसल ऋण माफी।',
    skn: 'ನಿಗದಿತ ಮಿತಿಯೊಳಗಿನ ಬೆಳೆ ಸಾಲವನ್ನು ಸರ್ಕಾರ ಮನ್ನಣೆ ಮಾಡುತ್ತದೆ. ಬಡ್ಡಿ ಸಹಿತ ಮಾನ್ಯತೆ ಸಿಗುತ್ತದೆ.', sen: 'The government waives crop loans within the set limit, including interest.', shi: 'सरकार निर्धारित सीमा तक फसल ऋण ब्याज सहित माफ करती है।',
    views: 6100,
  }),
  build({
    slug: 'solar-pump-subsidy-2026', cat: 'farmers', dept: 'energy', last: '2027-02-28',
    kn: 'ಸೌರ ಪಂಪ್ ಸೆಟ್ ಸಬ್ಸಿಡಿ ಯೋಜನೆ', en: 'Solar Pump Set Subsidy Scheme', hi: 'सौर पंप सेट सब्सिडी योजना',
    dkn: 'ಕೃಷಿಗಾಗಿ ಸೌರ ಪಂಪ್ ಖರೀದಿಗೆ ಸಬ್ಸಿಡಿ.', den: 'Subsidy on buying solar pumps for agriculture.', dhi: 'कृषि हेतु सौर पंप खरीद पर सब्सिडी।',
    skn: 'ವಿದ್ಯುತ್ ಇಲ್ಲದ ಹೊಲಗಳಲ್ಲಿ ಸೌರ ಪಂಪ್‌ನಿಂದ ನೀರು ಎತ್ತಬಹುದು. ಬೆಲೆಯ ಸಬ್ಸಿಡಿ ಸಿಗುತ್ತದೆ.', sen: 'You can pump water in fields without electricity using a solar pump; a price subsidy is given.', shi: 'बिना बिजली वाले खेतों में सौर पंप से पानी उठाया जा सकता है; कीमत पर सब्सिडी मिलती है।',
    views: 3230,
  }),
  build({
    slug: 'dairy-farming-support-2026', cat: 'farmers', last: '2026-12-31',
    kn: 'ಹಾಲು ಕೃಷಿ ಸಹಾಯ ಯೋಜನೆ', en: 'Dairy Farming Support Scheme', hi: 'डेयरी खेती सहायता योजना',
    dkn: 'ಹಸು/ಕುರಿ ಸಾಕಾಣಿಕೆಗೆ ಸಾಲ ಮತ್ತು ತರಬೇತಿ ಸಹಾಯ.', den: 'Loan and training support for cattle/sheep rearing.', dhi: 'पशुपालन हेतु ऋण और प्रशिक्षण सहायता।',
    skn: 'ಹಾಲು ಉತ್ಪಾದನೆಗೆ ದನಗಳ ಖರೀದಿಗೆ ಸಾಲ, ತರಬೇತಿ ಮತ್ತು ಹಾಲಿಗೆ ಕನಿಷ್ಠ ಬೆಂಬಲ ಬೆಲೆ ಲಭ್ಯ.', sen: 'Loans to buy milch cattle, training, and a minimum support price for milk.', shi: 'दुधारू पशु खरीद हेतु ऋण, प्रशिक्षण और दूध पर न्यूनतम समर्थन मूल्य उपलब्ध है।',
    views: 2990,
  }),
  build({
    slug: 'cold-storage-assistance-2026', cat: 'farmers', last: '2027-03-31',
    kn: 'ಶೀತಲ ಗೋದಾಮು ಸೌಲಭ್ಯ ಯೋಜನೆ', en: 'Cold Storage Facility Scheme', hi: 'कोल्ड स्टोरेज सुविधा योजना',
    dkn: 'ಬೆಳೆ ಕೊಳೆಯದಂತೆ ಶೀತಲ ಗೋದಾಮು ಬಳಕೆಗೆ ಸಹಾಯ.', den: 'Cold storage use to prevent crop spoilage.', dhi: 'फसल खराब होने से बचाने हेतु कोल्ड स्टोरेज का उपयोग।',
    skn: 'ರೈತರು ತಮ್ಮ ಬೆಳೆಯನ್ನು ಕಡಿಮೆ ದರದಲ್ಲಿ ಶೀತಲ ಗೋದಾಮಿನಲ್ಲಿ ಸಂಗ್ರಹಿಸಬಹುದು.', sen: 'Farmers can store produce in cold storage at reduced rates.', shi: 'किसान कम दर पर कोल्ड स्टोरेज में अपनी फसल जमा कर सकते हैं।',
    views: 2110,
  }),
  build({
    slug: 'farm-machinery-rental-2026', cat: 'farmers', last: '2027-01-15',
    kn: 'ಕೃಷಿ ಯಂತ್ರ ಬಾಡಿಗೆ ಕೇಂದ್ರ ಯೋಜನೆ', en: 'Farm Machinery Rental Centre Scheme', hi: 'कृषि यंत्र किराया केंद्र योजना',
    dkn: 'ಕಡಿಮೆ ದರದಲ್ಲಿ ಕೃಷಿ ಯಂತ್ರಗಳ ಬಾಡಿಗೆ.', den: 'Farm machinery rental at low rates.', dhi: 'कम दर पर कृषि यंत्रों का किराया।',
    skn: 'ಟ್ರ್ಯಾಕ್ಟರ್, ಹರೆ ಮುಂತಾದ ಯಂತ್ರಗಳನ್ನು ಪ್ರತಿ ಗಂಟೆಗೆ ಕಡಿಮೆ ಶುಲ್ಕದಲ್ಲಿ ಬಾಡಿಗೆ ಪಡೆಯಬಹುದು.', sen: 'Tractors, tillers etc. can be rented per hour at low charges.', shi: 'ट्रैक्टर, हल आदि प्रति घंटा कम शुल्क पर किराए पर मिलते हैं।',
    views: 2560,
  }),

  // ── employment ───────────────────────────────────────────
  build({
    slug: 'apprenticeship-allowance-2026', cat: 'employment', dept: 'skill-development', last: '2027-02-28',
    kn: 'ಅಪ್ರೆಂಟಿಸ್‌ಶಿಪ್ ಭತ್ಯೆ ಯೋಜನೆ', en: 'Apprenticeship Allowance Scheme', hi: 'अप्रेंटिसशिप भत्ता योजना',
    dkn: 'ಕಾರ್ಖಾನೆ/ಸಂಸ್ಥೆಗಳಲ್ಲಿ ತರಬೇತಿ ಜೊತೆ ಮಾಸಿಕ ಭತ್ಯೆ.', den: 'Monthly allowance with training in factories/organisations.', dhi: 'कारखानों/संस्थानों में प्रशिक्षण के साथ मासिक भत्ता।',
    skn: 'ಆಯ್ಕೆಯಾದ ಯುವಕರು ಒಂದು ವರ್ಷ ತರಬೇತಿ ಪಡೆದು ಪ್ರತಿ ತಿಂಗಳು ಭತ್ಯೆ ಪಡೆಯುತ್ತಾರೆ.', sen: 'Selected youth train for a year and receive a monthly allowance.', shi: 'चयनित युवा एक वर्ष प्रशिक्षण लेकर मासिक भत्ता पाते हैं।',
    views: 3480,
  }),
  build({
    slug: 'women-returnship-2026', cat: 'employment', dept: 'women-child', last: '2027-03-31',
    kn: 'ಮಹಿಳಾ ಮರು-ಉದ್ಯೋಗ ಯೋಜನೆ', en: 'Women Returnship Scheme', hi: 'महिला पुनः-रोज़गार योजना',
    dkn: 'ವಿರಾಮದ ನಂತರ ಮತ್ತೆ ಕೆಲಸಕ್ಕೆ ಸೇರುವ ಮಹಿಳೆಯರಿಗೆ ಸಹಾಯ.', den: 'Help for women rejoining work after a break.', dhi: 'विराम के बाद फिर काम पर लौटने वाली महिलाओं के लिए सहायता।',
    skn: 'ಮಕ್ಕಳ ನಂತರ ಮತ್ತೆ ಕೆಲಸ ಹುಡುಕುತ್ತಿರುವ ಮಹಿಳೆಯರಿಗೆ ತರಬೇತಿ ಮತ್ತು ಕಂಪನಿ ಸಂಪರ್ಕ ಒದಗಿಸಲಾಗುತ್ತದೆ.', sen: 'Training and company connections are provided to women seeking work again after children.', shi: 'बच्चों के बाद फिर काम की तलाश कर रही महिलाओं को प्रशिक्षण और कंपनी संपर्क दिया जाता है।',
    views: 2260,
  }),
  build({
    slug: 'construction-worker-training-2026', cat: 'employment', last: '2026-12-31',
    kn: 'ಕಟ್ಟಡ ಕಾರ್ಮಿಕ ತರಬೇತಿ ಯೋಜನೆ', en: 'Construction Worker Training Scheme', hi: 'निर्माण श्रमिक प्रशिक्षण योजना',
    dkn: 'ಕಟ್ಟಡ ಕಾರ್ಮಿಕರಿಗೆ ಹೊಸ ಕೌಶಲ್ಯ ತರಬೇತಿ.', den: 'New skill training for construction workers.', dhi: 'निर्माण श्रमिकों के लिए नया कौशल प्रशिक्षण।',
    skn: 'ವೆಲ್ಡಿಂಗ್, ಪ್ಲಂಬಿಂಗ್ ಮುಂತಾದ ಹೆಚ್ಚುವರಿ ಕೌಶಲ್ಯ ಕಲಿತು ಆದಾಯ ಹೆಚ್ಚಿಸಬಹುದು.', sen: 'Learn extra skills like welding and plumbing to increase income.', shi: 'वेल्डिंग, प्लंबिंग जैसे अतिरिक्त कौशल सीखकर आय बढ़ा सकते हैं।',
    views: 1870,
  }),
  build({
    slug: 'job-fair-placement-2026', cat: 'employment', last: '2026-11-30',
    kn: 'ಉದ್ಯೋಗ ಮೇಳ ನೇಮಕಾತಿ ಯೋಜನೆ', en: 'Job Fair Placement Scheme', hi: 'रोज़गार मेला भर्ती योजना',
    dkn: 'ಸ್ಥಳೀಯ ಉದ್ಯೋಗ ಮೇಳಗಳ ಮೂಲಕ ನೇರ ನೇಮಕಾತಿ.', den: 'Direct recruitment through local job fairs.', dhi: 'स्थानीय रोज़गार मेलों के माध्यम से सीधी भर्ती।',
    skn: 'ಜಿಲ್ಲಾ ಮಟ್ಟದ ಉದ್ಯೋಗ ಮೇಳಗಳಲ್ಲಿ ನೂರಾರು ಕಂಪನಿಗಳು ನೇರ ನೇಮಕಾತಿ ನಡೆಸುತ್ತವೆ.', sen: 'Hundreds of companies recruit directly at district-level job fairs.', shi: 'जिला स्तर के रोज़गार मेलों में सैकड़ों कंपनियाँ सीधी भर्ती करती हैं।',
    views: 4120,
  }),
  build({
    slug: 'gig-worker-protection-2026', cat: 'employment', dept: 'labour', last: '2027-03-31',
    kn: 'ಗಿಗ್ ಕೆಲಸಗಾರ ಸುರಕ್ಷತಾ ಯೋಜನೆ', en: 'Gig Worker Protection Scheme', hi: 'गिग वर्कर सुरक्षा योजना',
    dkn: 'ಆನ್‌ಲೈನ್ ಡೆಲಿವರಿ ಮತ್ತು ಫ್ರೀಲಾನ್ಸ್ ಕೆಲಸಗಾರರಿಗೆ ವಿಮೆ ಸುರಕ್ಷತೆ.', den: 'Insurance protection for online delivery and freelance workers.', dhi: 'ऑनलाइन डिलीवरी और फ्रीलांस कर्मचारियों के लिए बीमा सुरक्षा।',
    skn: 'ಆಹಾರ ಡೆಲಿವರಿ, ರೈಡ್ ಶೇರ್ ಮುಂತಾದ ಕೆಲಸ ಮಾಡುವವರಿಗೆ ಅಪಘಾತ ವಿಮೆ ಮತ್ತು ಆರೋಗ್ಯ ಸುರಕ್ಷೆ ದೊರೆಯುತ್ತದೆ.', sen: 'Accident insurance and health cover for food delivery, ride-share and similar workers.', shi: 'फूड डिलीवरी, राइड-शेयर आदि कर्मचारियों को दुर्घटना बीमा और स्वास्थ्य सुरक्षा मिलती है।',
    views: 3770,
  }),
  build({
    slug: 'government-job-coaching-2026', cat: 'employment', dept: 'skill-development', last: '2027-01-31',
    kn: 'ಸರ್ಕಾರಿ ಉದ್ಯೋಗ ತರಬೇತಿ ಯೋಜನೆ', en: 'Government Job Training Scheme', hi: 'सरकारी नौकरी प्रशिक्षण योजना',
    dkn: 'ಸರ್ಕಾರಿ ನೇಮಕಾತಿ ಪರೀಕ್ಷೆಗಳಿಗೆ ಸಿದ್ಧತಾ ತರಬೇತಿ.', den: 'Preparation training for government recruitment exams.', dhi: 'सरकारी भर्ती परीक्षाओं की तैयारी प्रशिक्षण।',
    skn: 'ಅನುಭವಿ ಬೋಧಕರಿಂದ ಉಚಿತ ತರಬೇತಿ ಮತ್ತು ಹಿಂದಿನ ಪ್ರಶ್ನೆಪತ್ರಿಕೆಗಳ ಅಭ್ಯಾಸ ಸಿಗುತ್ತದೆ.', sen: 'Free coaching with experienced teachers and practice with previous question papers.', shi: 'अनुभवी शिक्षकों से मुफ्त प्रशिक्षण और पिछले प्रश्नपत्रों का अभ्यास मिलता है।',
    views: 3650,
  }),
  build({
    slug: 'freelance-export-training-2026', cat: 'employment', dept: 'skill-development', last: '2027-02-15',
    kn: 'ಫ್ರೀಲಾನ್ಸ್ ಮತ್ತು ರಫ್ತು ಕೌಶಲ್ಯ ತರಬೇತಿ', en: 'Freelance & Export Skill Training', hi: 'फ्रीलांस एवं निर्यात कौशल प्रशिक्षण',
    dkn: 'ಆನ್‌ಲೈನ್ ಕೆಲಸ ಮತ್ತು ರಫ್ತು ವ್ಯಾಪಾರಕ್ಕೆ ಕೌಶಲ್ಯ ತರಬೇತಿ.', den: 'Skill training for online work and export business.', dhi: 'ऑनलाइन काम और निर्यात व्यवसाय के लिए कौशल प्रशिक्षण।',
    skn: 'ಡಿಜಿಟಲ್ ಮಾರುಕಟ್ಟೆ, ಎಕ್ಸೆಲ್ ಮತ್ತು ರಫ್ತು ಪ್ರಕ್ರಿಯೆ ಕಲಿತು ಮನೆಯಿಂದಲೇ ಆದಾಯ ಗಳಿಸಬಹುದು.', sen: 'Learn digital marketing, excel and export processes to earn from home.', shi: 'डिजिटल मार्केटिंग, एक्सेल और निर्यात प्रक्रिया सीखकर घर बैठे आय कमा सकते हैं।',
    views: 2940,
  }),
  // ── housing ──────────────────────────────────────────────
  build({
    slug: 'housing-loan-interest-subsidy-2026', cat: 'housing', last: '2027-03-31',
    kn: 'ವಸತಿ ಸಾಲ ಬಡ್ಡಿ ಸಬ್ಸಿಡಿ ಯೋಜನೆ', en: 'Housing Loan Interest Subsidy Scheme', hi: 'आवास ऋण ब्याज सब्सिडी योजना',
    dkn: 'ಮನೆ ಸಾಲದ ಬಡ್ಡಿಗೆ ಸರ್ಕಾರದಿಂದ ಸಬ್ಸಿಡಿ.', den: 'Government subsidy on home loan interest.', dhi: 'होम ऋण के ब्याज पर सरकारी सब्सिडी।',
    skn: 'ಅರ್ಹ ಕುಟುಂಬಗಳ ಮನೆ ಸಾಲದ ಬಡ್ಡಿಯ ಒಂದು ಭಾಗವನ್ನು ಸರ್ಕಾರ ಭರಿಸುತ್ತದೆ.', sen: 'The government pays a portion of the home loan interest for eligible families.', shi: 'पात्र परिवारों के होम ऋण के ब्याज का एक हिस्सा सरकार वहन करती है।',
    views: 4010,
  }),
  build({
    slug: 'house-renovation-grant-2026', cat: 'housing', last: '2026-12-31',
    kn: 'ಮನೆ ದುರಸ್ತಿ ಗ್ರಾಂಟ್ ಯೋಜನೆ', en: 'House Renovation Grant Scheme', hi: 'मकान मरम्मत अनुदान योजना',
    dkn: 'ಹಳೆ ಮತ್ತು ಶಿಥಿಲ ಮನೆಗಳ ದುರಸ್ತಿಗೆ ಗ್ರಾಂಟ್.', den: 'Grant for renovating old and dilapidated houses.', dhi: 'पुराने और जर्जर मकानों की मरम्मत हेतु अनुदान।',
    skn: 'ಬಿಸಿಲು, ಮಳೆ ಸೋರುವ ಮನೆಗಳಿಗೆ ದುರಸ್ತಿ ಖರ್ಚಿಗೆ ಒಂದು ಬಾರಿ ಗ್ರಾಂಟ್ ಸಿಗುತ್ತದೆ.', sen: 'A one-time grant is given for repair costs of leaking houses.', shi: 'पानी चूने वाले मकानों की मरम्मत हेतु एक बार अनुदान मिलता है।',
    views: 2740,
  }),
  build({
    slug: 'slum-area-development-2026', cat: 'housing', dept: 'social-welfare', last: '2027-02-28',
    kn: 'ಕೊಳಚೆ ಪ್ರದೇಶ ಅಭಿವೃದ್ಧಿ ಯೋಜನೆ', en: 'Slum Area Development Scheme', hi: 'बस्ती क्षेत्र विकास योजना',
    dkn: 'ಕೊಳಚೆ ಪ್ರದೇಶಗಳಿಗೆ ನೀರು, ರಸ್ತೆ ಮತ್ತು ಮೂಲಸೌಕರ್ಯ.', den: 'Water, roads and infrastructure for slum areas.', dhi: 'बस्ती क्षेत्रों के लिए पानी, सड़क और पूर्वांग बुनियादी ढाँचा।',
    skn: 'ಕೊಳಚೆ ಪ್ರದೇಶಗಳಲ್ಲಿ ಕುಡಿಯುವ ನೀರು, ಒಳಚರಂಡಿ ಮತ್ತು ರಸ್ತೆ ಸೌಲಭ್ಯ ಕಲ್ಪಿಸಲಾಗುತ್ತದೆ.', sen: 'Drinking water, drainage and road facilities are provided in slum areas.', shi: 'बस्ती क्षेत्रों में पेयजल, नाली और सड़क सुविधा दी जाती है।',
    views: 1620,
  }),
  build({
    slug: 'rental-assistance-urban-2026', cat: 'housing', last: '2026-12-31',
    kn: 'ನಗರ ಬಾಡಿಗೆ ಸಹಾಯ ಯೋಜನೆ', en: 'Urban Rental Assistance Scheme', hi: 'शहरी किराया सहायता योजना',
    dkn: 'ನಗರದಲ್ಲಿ ಬಾಡಿಗೆ ಮನೆಯಲ್ಲಿ ವಾಸಿಸುವ ಬಡ ಕುಟುಂಬಗಳಿಗೆ ಸಹಾಯ.', den: 'Help for poor families living in rented houses in cities.', dhi: 'शहर में किराए के मकान में रहने वाले गरीब परिवारों के लिए सहायता।',
    skn: 'ಅರ್ಹ ಬಾಡಿಗೆದಾರ ಕುಟುಂಬಗಳಿಗೆ ಪ್ರತಿ ತಿಂಗಳು ನಿಗದಿತ ಬಾಡಿಗೆ ಸಹಾಯ ಧನ ಜಮಾ ಆಗುತ್ತದೆ.', sen: 'Eligible tenant families receive a fixed monthly rental support amount.', shi: 'पात्र किराएदार परिवारों को निश्चित मासिक किराया सहायता जमा होती है।',
    views: 3180,
  }),
  build({
    slug: 'free-housing-site-patta-2026', cat: 'housing', last: '2027-01-31',
    kn: 'ಉಚಿತ ವಸತಿ ನಿವೇಶನ ಪಟ್ಟಾ ಯೋಜನೆ', en: 'Free Housing Site Patta Scheme', hi: 'मुफ्त आवासीय प्लॉट पट्टा योजना',
    dkn: 'ಅರ್ಹ ಕುಟುಂಬಗಳಿಗೆ ಉಚಿತ ವಸತಿ ನಿವೇಶನ.', den: 'Free residential site for eligible families.', dhi: 'पात्र परिवारों के लिए मुफ्त आवासीय प्लॉट।',
    skn: 'ಸ್ವಂತ ಮನೆ/ನಿವೇಶನ ಇಲ್ಲದ ಕುಟುಂಬಗಳಿಗೆ ಗ್ರಾಮ ಪಂಚಾಯಿತಿ ಮೂಲಕ ಉಚಿತ ನಿವೇಶನ ಪಟ್ಟಾ ನೀಡಲಾಗುತ್ತದೆ.', sen: 'Free site patta is given through Gram Panchayat to families without land or house.', shi: 'भूमि या मकान रहित परिवारों को ग्राम पंचायत के माध्यम से मुफ्त प्लॉट पट्टा दिया जाता है।',
    views: 5220,
  }),
  build({
    slug: 'disaster-house-rebuild-2026', cat: 'housing', last: '2026-11-30',
    kn: 'ವಿಪತ್ತು ಮನೆ ಪುನರ್ನಿರ್ಮಾಣ ಯೋಜನೆ', en: 'Disaster House Reconstruction Scheme', hi: 'आपदा पुनर्निर्माण योजना',
    dkn: 'ಪ್ರಾಕೃತಿಕ ವಿಪತ್ತಿನಲ್ಲಿ ಕುಸಿದ ಮನೆಗಳ ಪುನರ್ನಿರ್ಮಾಣ.', den: 'Rebuilding houses collapsed in natural disasters.', dhi: 'प्राकृतिक आपदा में गिरे मकानों का पुनर्निर्माण।',
    skn: 'ಮಳೆ, ಪ್ರವಾಹ ಅಥವಾ ಭೂಕಂಪದಲ್ಲಿ ಹಾಳಾದ ಮನೆ ಪುನರ್ನಿರ್ಮಾಣಕ್ಕೆ ಸಂಪೂರ್ಣ ಸಹಾಯ ಸಿಗುತ್ತದೆ.', sen: 'Full assistance is given to rebuild houses damaged by floods, rains or earthquakes.', shi: 'बाढ़, बारिश या भूकंप से क्षतिग्रस्त मकान पुनर्निर्माण हेतु पूर्ण सहायता मिलती है।',
    views: 1980,
  }),
  build({
    slug: 'working-women-hostel-2026', cat: 'housing', dept: 'women-child', last: '2027-03-31',
    kn: 'ದುಡಿಯುವ ಮಹಿಳಾ ವಸತಿಗೃಹ ಯೋಜನೆ', en: 'Working Women Hostel Scheme', hi: 'काम करने वाली महिला छात्रावास योजना',
    dkn: 'ಬೇರೆ ಊರಿನಲ್ಲಿ ಕೆಲಸ ಮಾಡುವ ಮಹಿಳೆಯರಿಗೆ ಸುರಕ್ಷಿತ ವಸತಿ.', den: 'Safe accommodation for women working in other cities.', dhi: 'अन्य शहरों में काम करने वाली महिलाओं के लिए सुरक्षित आवास।',
    skn: 'ಕಡಿಮೆ ಬಾಡಿಗೆಯಲ್ಲಿ ಸುರಕ್ಷಿತ ವಸತಿಗೃಹ ಮತ್ತು ಊಟದ ಸೌಲಭ್ಯ ಲಭ್ಯ.', sen: 'Safe hostel accommodation and mess facility at low rent.', shi: 'कम किराए पर सुरक्षित छात्रावास और भोजन सुविधा उपलब्ध है।',
    views: 2350,
  }),
  build({
    slug: 'eco-friendly-home-subsidy-2026', cat: 'housing', dept: 'energy', last: '2027-02-28',
    kn: 'ಪರಿಸರ ಸ್ನೇಹಿ ಮನೆ ಸಬ್ಸಿಡಿ ಯೋಜನೆ', en: 'Eco-Friendly Home Subsidy Scheme', hi: 'पर्यावरण अनुकूल घर सब्सिडी योजना',
    dkn: 'ಸೌರ ಫಲಕ ಮತ್ತು ವಿದ್ಯುತ್ ಉಳಿತಾಯ ಇರುವ ಮನೆಗಳಿಗೆ ಸಬ್ಸಿಡಿ.', den: 'Subsidy for homes with solar panels and energy saving.', dhi: 'सौर पैनल और ऊर्जा बचत वाले मकानों पर सब्सिडी।',
    skn: 'ಮನೆಯ ಮೇಲ್ಛತ್ತಿಯಲ್ಲಿ ಸೌರ ಫಲಕ ಅಳವಡಿಸಿದರೆ ಸಬ್ಸಿಡಿ ಮತ್ತು ವಿದ್ಯುತ್ ಬಿಲ್‌ನಲ್ಲಿ ಉಳಿತಾಯ ಸಿಗುತ್ತದೆ.', sen: 'Installing rooftop solar panels gives a subsidy and savings on the electricity bill.', shi: 'छत पर सौर पैनल लगाने पर सब्सिडी और बिजली बिल में बचत होती है।',
    views: 2890,
  }),

  // ── health ───────────────────────────────────────────────
  build({
    slug: 'free-medicine-delivery-2026', cat: 'health', last: '2026-12-31',
    kn: 'ಉಚಿತ ಔಷಧಿ ವಿತರಣೆ ಯೋಜನೆ', en: 'Free Medicine Distribution Scheme', hi: 'मुफ्त दवा वितरण योजना',
    dkn: 'ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಗಳಲ್ಲಿ ಉಚಿತ ಔಷಧಿ ವಿತರಣೆ.', den: 'Free medicine distribution in government hospitals.', dhi: 'सरकारी अस्पतालों में मुफ्त दवा वितरण।',
    skn: 'ವಾರ್ಷಿಕ ಆರೋಗ್ಯ ತಪಾಸಣೆಯಲ್ಲಿ ಗುರುತಿಸಲ್ಪಟ್ಟ ಖಾಯಲೆಗಳಿಗೆ ಉಚಿತ ಔಷಧಿ ಸಿಗುತ್ತದೆ.', sen: 'Free medicines are given for conditions identified in the annual health check.', shi: 'वार्षिक स्वास्थ्य जाँच में पहचानी गई बीमारियों के लिए मुफ्त दवा मिलती है।',
    views: 5340,
  }),
  build({
    slug: 'maternal-care-support-2026', cat: 'health', last: '2026-12-31',
    kn: 'ಮಾತೃ ಆರೈಕೆ ಸಹಾಯ ಯೋಜನೆ', en: 'Maternal Care Support Scheme', hi: 'मातृ देखभाल सहायता योजना',
    dkn: 'ಗರ್ಭಿಣಿ ಮಹಿಳೆಯರಿಗೆ ಉಚಿತ ತಪಾಸಣೆ ಮತ್ತು ಪ್ರಸವ ಸಹಾಯ.', den: 'Free check-ups and delivery assistance for pregnant women.', dhi: 'गर्भवती महिलाओं के लिए मुफ्त जाँच और प्रसव सहायता।',
    skn: 'ಗರ್ಭಧಾರಣೆಯಿಂದ ಪ್ರಸವದವರೆಗೆ ಉಚಿತ ತಪಾಸಣೆ, ಔಷಧಿ ಮತ್ತು ಆಸ್ಪತ್ರೆ ವೆಚ್ಚ ಸಹಾಯ ಸಿಗುತ್ತದೆ.', sen: 'Free check-ups, medicine and hospital cost support from conception to delivery.', shi: 'गर्भधारणा से प्रसव तक मुफ्त जाँच, दवा और अस्पताल खर्च सहायता मिलती है।',
    views: 4670,
  }),
  build({
    slug: 'child-vaccination-incentive-2026', cat: 'health', last: '2027-01-31',
    kn: 'ಮಕ್ಕಳ ಲಸಿಕಾ ಪ್ರೋತ್ಸಾಹ ಯೋಜನೆ', en: 'Child Vaccination Incentive Scheme', hi: 'बाल टीकाकरण प्रोत्साहन योजना',
    dkn: 'ಪೂರ್ಣ ಲಸಿಕಾ ಕಾರ್ಯಕ್ರಮ ಮುಗಿಸಿದ ಮಕ್ಕಳಿಗೆ ಪ್ರೋತ್ಸಾಹ.', den: 'Incentive for children completing the full vaccination schedule.', dhi: 'पूर्ण टीकाकरण करने वाले बच्चों के लिए प्रोत्साहन।',
    skn: 'ನಿಗದಿತ ಎಲ್ಲಾ ಲಸಿಕೆಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿದ ಮಗುವಿನ ಕುಟುಂಬಕ್ಕೆ ಪ್ರೋತ್ಸಾಹ ಧನ ಸಿಗುತ್ತದೆ.', sen: 'Families whose child completes all scheduled vaccines receive an incentive.', shi: 'जिन बच्चों ने सभी निर्धारित टीके पूरे किए, उनके परिवार को प्रोत्साहन राशि मिलती है।',
    views: 3490,
  }),
  build({
    slug: 'free-eye-surgery-2026', cat: 'health', last: '2026-12-31',
    kn: 'ಉಚಿತ ಕಣ್ಣು ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ ಯೋಜನೆ', en: 'Free Eye Surgery Scheme', hi: 'मुफ्त नेत्र शल्य चिकित्सा योजना',
    dkn: 'ಕಣ್ಣಿನ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆಗೆ ಉಚಿತ ಸಹಾಯ.', den: 'Free assistance for eye surgeries.', dhi: 'नेत्र शल्य चिकित्सा के लिए मुफ्त सहायता।',
    skn: 'ಶುಳ್ಳಿ ಕಣ್ಣಿನ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ (cataract) ಸೇರಿದಂತೆ ಅರ್ಹರಿಗೆ ಉಚಿತ ಚಿಕಿತ್ಸೆ ಮತ್ತು ಔಷಧಿ.', sen: 'Free treatment and medicine including cataract surgery for eligible people.', shi: 'पात्र लोगों को मोतियाबिंद सहित मुफ्त उपचार और दवा मिलती है।',
    views: 3910,
  }),
  build({
    slug: 'dialysis-assistance-2026', cat: 'health', last: '2026-12-31',
    kn: 'ಡಯಾಲಿಸಿಸ್ ಸಹಾಯ ಯೋಜನೆ', en: 'Dialysis Assistance Scheme', hi: 'डायलिसिस सहायता योजना',
    dkn: 'ಮೂತ್ರಪಿಂಡ ರೋಗಿಗಳಿಗೆ ಉಚಿತ ಡಯಾಲಿಸಿಸ್.', den: 'Free dialysis for kidney patients.', dhi: 'गुर्दा रोगियों के लिए मुफ्त डायलिसिस।',
    skn: 'ವಾರಕ್ಕೆ ನಿಗದಿತ ಡಯಾಲಿಸಿಸ್ ಸೌಲಭ್ಯ ಸರ್ಕಾರಿ ಆಸ್ಪತ್ರೆಗಳಲ್ಲಿ ಉಚಿತವಾಗಿ ಸಿಗುತ್ತದೆ.', sen: 'Fixed weekly dialysis is provided free at government hospitals.', shi: 'निर्धारित साप्ताहिक डायलिसिस सरकारी अस्पतालों में मुफ्त मिलता है।',
    views: 2560,
  }),
  build({
    slug: 'mental-health-support-2026', cat: 'health', last: '2027-03-31',
    kn: 'ಮಾನಸಿಕ ಆರೋಗ್ಯ ಸಹಾಯ ಯೋಜನೆ', en: 'Mental Health Support Scheme', hi: 'मानसिक स्वास्थ्य सहायता योजना',
    dkn: 'ಉಚಿತ ಮಾನಸಿಕ ಆರೋಗ್ಯ ಸಲಹೆ ಮತ್ತು ಚಿಕಿತ್ಸೆ.', den: 'Free mental health counselling and treatment.', dhi: 'मुफ्त मानसिक स्वास्थ्य परामर्श और उपचार।',
    skn: 'ಜಿಲ್ಲಾ ಆಸ್ಪತ್ರೆಗಳಲ್ಲಿ ಮಾನಸಿಕ ತಜ್ಞರ ಉಚಿತ ಸಲಹೆ ಮತ್ತು ಅಗತ್ಯ ಔಷಧಿ ಲಭ್ಯ.', sen: 'Free counselling by mental health experts and required medicine at district hospitals.', shi: 'जिला अस्पतालों में मानसिक स्वास्थ्य विशेषज्ञों का मुफ्त परामर्श और आवश्यक दवा उपलब्ध है।',
    views: 2210,
  }),
  build({
    slug: 'free-health-checkup-camps-2026', cat: 'health', last: '2026-11-30',
    kn: 'ಉಚಿತ ಆರೋಗ್ಯ ತಪಾಸಣಾ ಶಿಬಿರ ಯೋಜನೆ', en: 'Free Health Check-up Camp Scheme', hi: 'मुफ्त स्वास्थ्य जाँच शिविर योजना',
    dkn: 'ಗ್ರಾಮ ಮಟ್ಟದಲ್ಲಿ ಉಚಿತ ಆರೋಗ್ಯ ತಪಾಸಣಾ ಶಿಬಿರಗಳು.', den: 'Free health check-up camps at village level.', dhi: 'ग्राम स्तर पर मुफ्त स्वास्थ्य जाँच शिविर।',
    skn: 'ಹಳ್ಳಿಗಳಿಗೆ ತೆರಳಿ ರಕ್ತದೊತ್ತಡ, ಸಕ್ಕರೆ ಮತ್ತು ಸಾಮಾನ್ಯ ತಪಾಸಣೆ ಉಚಿತವಾಗಿ ನಡೆಸಲಾಗುತ್ತದೆ.', sen: 'Camps visit villages for free blood pressure, sugar and general check-ups.', shi: 'गाँवों में मुफ्त रक्तचाप, शुगर और सामान्य जाँच की जाती है।',
    views: 3040,
  }),
  build({
    slug: 'free-ambulance-service-2026', cat: 'health', last: '2027-03-31',
    kn: 'ಉಚಿತ ಆಂಬ್ಯುಲೆನ್ಸ್ ಸೇವೆ ಯೋಜನೆ', en: 'Free Ambulance Service Scheme', hi: 'मुफ्त एम्बुलेंस सेवा योजना',
    dkn: 'ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ ಉಚಿತ ಆಂಬ್ಯುಲೆನ್ಸ್ ಸೇವೆ.', den: 'Free ambulance service in emergencies.', dhi: 'आपात स्थिति में मुफ्त एम्बुलेंस सेवा।',
    skn: '108 ಸಂಖ್ಯೆಗೆ ಕರೆ ಮಾಡಿದರೆ ಉಚಿತ ತುರ್ತು ಆಂಬ್ಯುಲೆನ್ಸ್ ಸೇವೆ ಸಿಗುತ್ತದೆ.', sen: 'Call 108 to get free emergency ambulance service.', shi: '108 पर कॉल करने पर मुफ्त आपातकालीन एम्बुलेंस सेवा मिलती है।',
    views: 6230,
  }),

  // ── senior-citizens ──────────────────────────────────────
  build({
    slug: 'geriatric-care-support-2026', cat: 'senior-citizens', dept: 'health-family-welfare', last: '2026-12-31',
    kn: 'ವೃದ್ಧ ಆರೈಕೆ ಸಹಾಯ ಯೋಜನೆ', en: 'Geriatric Care Support Scheme', hi: 'वृद्ध देखभाल सहायता योजना',
    dkn: 'ಹಿರಿಯರಿಗೆ ಮನೆಯಲ್ಲಿಯೇ ಆರೈಕೆ ಸೇವೆ ಮತ್ತು ತಪಾಸಣೆ.', den: 'Home care service and check-ups for senior citizens.', dhi: 'वरिष्ठ नागरिकों के लिए घर पर ही देखभाल सेवा और जाँच।',
    skn: 'ವಯಸ್ಸಾದವರಿಗೆ ಮನೆಗೆ ತರಬೇತಿ ಪಡೆದ ಆರೈಕೆದಾರರು ಬಂದು ತಪಾಸಣೆ ಮತ್ತು ಔಷಧಿ ನೀಡುತ್ತಾರೆ.', sen: 'Trained caregivers visit homes of the elderly for check-ups and medicine.', shi: 'प्रशिक्षित देखभालकर्ता बुजुर्गों के घर जाकर जाँच और दवा देते हैं।',
    views: 3320,
  }),
  build({
    slug: 'senior-free-travel-2026', cat: 'senior-citizens', dept: 'labour', last: '2027-03-31',
    kn: 'ಹಿರಿಯರಿಗೆ ಉಚಿತ ಸಂಚಾರ ಯೋಜನೆ', en: 'Free Travel for Seniors Scheme', hi: 'वरिष्ठों के लिए मुफ्त यात्रा योजना',
    dkn: '60 ವರ್ಷ ಮೇಲ್ಪಟ್ಟವರಿಗೆ ಸರ್ಕಾರಿ ಬಸ್‌ನಲ್ಲಿ ಉಚಿತ ಪ್ರಯಾಣ.', den: 'Free bus travel for those above 60 years.', dhi: '60 वर्ष से अधिक आयु के लोगों के लिए बस में मुफ्त यात्रा।',
    skn: 'ವಯಸ್ಸಾದವರು ಗುರುತಿನ ಚೀಟಿ ತೋರಿಸಿ ರಾಜ್ಯ ಬಸ್‌ಗಳಲ್ಲಿ ಉಚಿತವಾಗಿ ಪ್ರಯಾಣಿಸಬಹುದು.', sen: 'Seniors can travel free in state buses by showing an ID card.', shi: 'बुजुर्ग पहचान पत्र दिखाकर राज्य बसों में मुफ्त यात्रा कर सकते हैं।',
    views: 4880,
  }),
  build({
    slug: 'additional-old-age-pension-2026', cat: 'senior-citizens', last: '2026-12-31',
    kn: 'ಹೆಚ್ಚುವರಿ ವೃದ್ಧಾಪ್ಯ ಪಿಂಚಣಿ ಯೋಜನೆ', en: 'Additional Old Age Pension Scheme', hi: 'अतिरिक्त वृद्धावस्था पेंशन योजना',
    dkn: '75 ವರ್ಷ ಮೇಲ್ಪಟ್ಟವರಿಗೆ ಹೆಚ್ಚುವರಿ ಪಿಂಚಣಿ.', den: 'Extra pension for those above 75 years.', dhi: '75 वर्ष से अधिक आयु के लोगों के लिए अतिरिक्त पेंशन।',
    skn: '75 ವರ್ಷ ಮೇಲ್ಪಟ್ಟ ಹಿರಿಯ ನಾಗರಿಕರಿಗೆ ಪ್ರತಿ ತಿಂಗಳು ಹೆಚ್ಚುವರಿ ಮೊತ್ತ ಸಿಗುತ್ತದೆ.', sen: 'Senior citizens above 75 receive an extra amount every month.', shi: '75 वर्ष से अधिक आयु के बुजुर्गों को हर महीने अतिरिक्त राशि मिलती है।',
    views: 3760,
  }),
  build({
    slug: 'senior-day-care-centres-2026', cat: 'senior-citizens', last: '2027-02-28',
    kn: 'ಹಿರಿಯರ ದಿನದಾಳಿ ಕೇಂದ್ರ ಯೋಜನೆ', en: 'Senior Day Care Centre Scheme', hi: 'वरिष्ठ दिवस देखभाल केंद्र योजना',
    dkn: 'ಪೋಷಕರಿಲ್ಲದ ಹಿರಿಯರಿಗೆ ದಿನದಾಳಿ ಆರೈಕೆ ಕೇಂದ್ರ.', den: 'Day care centres for seniors without caregivers.', dhi: 'देखभालकर्ता रहित वरिष्ठों के लिए दिवस देखभाल केंद्र।',
    skn: 'ದಿನವಿಡೀ ಊಟ, ಚಟುವಟಿಕೆ ಮತ್ತು ಆರೋಗ್ಯ ನಿಗಾ ಸೌಲಭ್ಯ ದಿನದಾಳಿ ಕೇಂದ್ರಗಳಲ್ಲಿ ಲಭ್ಯ.', sen: 'Meals, activities and health monitoring are provided at day care centres.', shi: 'दिवस देखभाल केंद्रों में भोजन, गतिविधियाँ और स्वास्थ्य निगरानी मिलती है।',
    views: 1940,
  }),
  build({
    slug: 'senior-companion-support-2026', cat: 'senior-citizens', dept: 'social-welfare', last: '2027-01-31',
    kn: 'ಹಿರಿಯರ ಸಂಗಾತಿ ಸಹಾಯ ಯೋಜನೆ', en: 'Senior Companion Support Scheme', hi: 'वरिष्ठ संगति सहायता योजना',
    dkn: 'ಒಂಟಿಯಾಗಿ ವಾಸಿಸುವ ಹಿರಿಯರಿಗೆ ಸಂಗಾತಿ/ಸ್ವಯಂಸೇವಕ ಸಹಾಯ.', den: 'Companion/volunteer help for seniors living alone.', dhi: 'अकेले रहने वाले वरिष्ठों के लिए संगति/स्वयंसेवक सहायता।',
    skn: 'ಸ್ವಯಂಸೇವಕರು ಭೇಟಿ ನೀಡಿ ಮಾತನಾಡಿ, ಅಗತ್ಯ ಕೆಲಸಗಳಲ್ಲಿ ಸಹಾಯ ಮಾಡುತ್ತಾರೆ.', sen: 'Volunteers visit, talk and help elders with daily tasks.', shi: 'स्वयंसेवक भेंट कर बात करते हैं और दैनिक कार्यों में सहायता करते हैं।',
    views: 1550,
  }),
  build({
    slug: 'senior-digital-literacy-2026', cat: 'senior-citizens', dept: 'skill-development', last: '2027-03-31',
    kn: 'ಹಿರಿಯರ ಡಿಜಿಟಲ್ ಸಾಕ್ಷರತಾ ಯೋಜನೆ', en: 'Senior Digital Literacy Scheme', hi: 'वरिष्ठ डिजिटल साक्षरता योजना',
    dkn: 'ಹಿರಿಯರಿಗೆ ಮೊಬೈಲ್ ಮತ್ತು ಇಂಟರ್‌ನೆಟ್ ಬಳಕೆ ತರಬೇತಿ.', den: 'Mobile and internet usage training for seniors.', dhi: 'वरिष्ठों के लिए मोबाइल और इंटरनेट उपयोग प्रशिक्षण।',
    skn: 'ವಿಡಿಯೋ ಕರೆ, ಆನ್‌ಲೈನ್ ಬಿಲ್ ಪಾವತಿ ಮತ್ತು ಸರ್ಕಾರಿ ಸೇವೆಗಳನ್ನು ಮೊಬೈಲ್‌ನಲ್ಲಿ ಮಾಡಲು ಕಲಿಸಲಾಗುತ್ತದೆ.', sen: 'Seniors are taught video calls, online bill payment and mobile govt services.', shi: 'बुजुर्गों को वीडियो कॉल, ऑनलाइन बिल भुगतान और मोबाइल सरकारी सेवाएँ सिखाई जाती हैं।',
    views: 2430,
  }),
  build({
    slug: 'senior-life-insurance-2026', cat: 'senior-citizens', dept: 'social-welfare', last: '2026-12-31',
    kn: 'ಹಿರಿಯರ ಜೀವನ ವಿಮಾ ಯೋಜನೆ', en: 'Senior Life Insurance Scheme', hi: 'वरिष्ठ जीवन बीमा योजना',
    dkn: 'ಹಿರಿಯರಿಗೆ ಕಡಿಮೆ ಪ್ರೀಮಿಯಂನ ಜೀವನ ವಿಮೆ.', den: 'Low-premium life insurance for senior citizens.', dhi: 'वरिष्ठ नागरिकों के लिए कम प्रीमियम पर जीवन बीमा।',
    skn: 'ವಾರ್ಷಿಕ ಕಡಿಮೆ ಪ್ರೀಮಿಯಂ ಭರಿಸಿ ನಿಗದಿತ ವಿಮಾ ಮೊತ್ತ ಪಡೆಯಬಹುದು.', sen: 'Pay a low annual premium and get a fixed insurance cover.', shi: 'कम वार्षिक प्रीमियम देकर निश्चित बीमा राशि पा सकते हैं।',
    views: 2680,
  }),
  build({
    slug: 'assisted-living-grant-2026', cat: 'senior-citizens', last: '2027-03-31',
    kn: 'ಸಹಾಯಿತ ವಸತಿ ಗ್ರಾಂಟ್ ಯೋಜನೆ', en: 'Assisted Living Grant Scheme', hi: 'सहायित आवास अनुदान योजना',
    dkn: 'ಆರೈಕೆ ಅಗತ್ಯವಿರುವ ಹಿರಿಯರಿಗೆ ವಸತಿ ಸಹಾಯ.', den: 'Housing assistance for seniors needing care.', dhi: 'देखभाल की आवश्यकता वाले वरिष्ठों के लिए आवास सहायता।',
    skn: 'ವಯಸ್ಸಾದ ನಂತರ ಸುರಕ್ಷಿತ ವಸತಿ ಮತ್ತು ಆರೈಕೆಗೆ ವಾರ್ಷಿಕ ಗ್ರಾಂಟ್ ದೊರೆಯುತ್ತದೆ.', sen: 'An annual grant is given for safe accommodation and care in old age.', shi: 'बुढ़ापे में सुरक्षित आवास और देखभाल हेतु वार्षिक अनुदान मिलता है।',
    views: 1720,
  }),

  // ── financial ────────────────────────────────────────────
  build({
    slug: 'disaster-relief-cash-2026', cat: 'financial', last: '2026-12-31',
    kn: 'ವಿಪತ್ತು ಪರಿಹಾರ ನಗದು ಯೋಜನೆ', en: 'Disaster Relief Cash Scheme', hi: 'आपदा राहत नकद योजना',
    dkn: 'ಪ್ರಾಕೃತಿಕ ವಿಪತ್ತಿನಲ್ಲಿ ತೊಂದರೆಗೊಳ್ಳುವವರಿಗೆ ತಕ್ಷಣ ನಗದು.', den: 'Immediate cash for those affected by natural disasters.', dhi: 'प्राकृतिक आपदा से प्रभावित लोगों को तत्काल नकद।',
    skn: 'ಪ್ರವಾಹ, ಬರ ಅಥವಾ ಚಂಡಮಾರುತದಿಂದ ನಷ್ಟವಾದ ಕುಟುಂಬಕ್ಕೆ ತಕ್ಷಣ ಪರಿಹಾರ ಧನ ಜಮಾ ಆಗುತ್ತದೆ.', sen: 'Relief money is credited immediately to families hit by floods, drought or cyclones.', shi: 'बाढ़, सूखा या चक्रवात से प्रभावित परिवारों को तुरंत राहत राशि जमा होती है।',
    views: 4360,
  }),
  build({
    slug: 'family-crisis-support-2026', cat: 'financial', last: '2026-12-31',
    kn: 'ಕುಟುಂಬ ಸಂಕಷ್ಟ ಸಹಾಯ ಯೋಜನೆ', en: 'Family Crisis Support Scheme', hi: 'पारिवारिक संकट सहायता योजना',
    dkn: 'ಕುಟುಂಬದಲ್ಲಿ ಅನಿರೀಕ್ಷಿತ ಸಾವು/ಅನಾರೋಗ್ಯಕ್ಕೆ ತಕ್ಷಣ ಸಹಾಯ.', den: 'Immediate help for unexpected death/illness in the family.', dhi: 'परिवार में अप्रत्याशित मृत्यु/बीमारी पर तत्काल सहायता।',
    skn: 'ಕುಟುಂಬದ ಪ್ರಮುಖರ ಅಕಾಲಿಕ ಸಾವಿನ ಸಂದರ್ಭದಲ್ಲಿ ಒಂದು ಬಾರಿ ಆರ್ಥಿಕ ಸಹಾಯ ಸಿಗುತ್ತದೆ.', sen: 'A one-time financial help is given in case of the untimely death of a breadwinner.', shi: 'कमाने वाले की अकालिक मृत्यु पर एक बार आर्थिक सहायता मिलती है।',
    views: 3570,
  }),
  build({
    slug: 'debt-relief-poor-families-2026', cat: 'financial', last: '2027-01-31',
    kn: 'ಬಡವರ ಸಾಲ ಪರಿಹಾರ ಯೋಜನೆ', en: 'Debt Relief for Poor Families Scheme', hi: 'गरीब परिवार ऋण राहत योजना',
    dkn: 'ಅತಿ ಬಡ ಕುಟುಂಬಗಳ ಸಣ್ಣ ಸಾಲ ಮನ್ನಣೆ.', den: 'Waiver of small loans of extremely poor families.', dhi: 'अत्यंत गरीब परिवारों के छोटे ऋण माफी।',
    skn: 'ನಿಗದಿತ ಮಿತಿಯೊಳಗಿನ ಸಣ್ಣ ಸಾಲಗಳನ್ನು ಮನ್ನಣೆ ಮಾಡಿ ಬಡವರನ್ನು ಸಾಲದ ಹೊರೆಯಿಂದ ಮುಕ್ತಗೊಳಿಸಲಾಗುತ್ತದೆ.', sen: 'Small loans within the set limit are waived to free poor families from debt.', shi: 'निर्धारित सीमा के छोटे ऋण माफ कर गरीब परिवारों को कर्ज से मुक्त किया जाता है।',
    views: 5010,
  }),
  build({
    slug: 'household-savings-incentive-2026', cat: 'financial', dept: 'msme', last: '2027-03-31',
    kn: 'ಕುಟುಂಬ ಉಳಿತಾಯ ಪ್ರೋತ್ಸಾಹ ಯೋಜನೆ', en: 'Household Savings Incentive Scheme', hi: 'गृहस्थी बचत प्रोत्साहन योजना',
    dkn: 'ಕುಟುಂಬ ಉಳಿತಾಯಕ್ಕೆ ಸರ್ಕಾರದಿಂದ ಹೊಂದಾಣಿಕೆ ಹಣ.', den: 'Government matching money for household savings.', dhi: 'गृहस्थी बचत पर सरकार से मिलान धन।',
    skn: 'ನಿಗದಿತ ಮಿತಿಯಲ್ಲಿ ಉಳಿತಾಯ ಮಾಡಿದರೆ ಸರ್ಕಾರದಿಂದ ಹೆಚ್ಚುವರಿ ಹಣ ಜಮಾ ಆಗುತ್ತದೆ.', sen: 'Saving up to the set limit earns extra government money in your account.', shi: 'निर्धारित सीमा तक बचत करने पर सरकार की ओर से अतिरिक्त राशि जमा होती है।',
    views: 2850,
  }),
  build({
    slug: 'electricity-bill-rebate-2026', cat: 'financial', dept: 'energy', last: '2027-03-31',
    kn: 'ವಿದ್ಯುತ್ ಬಿಲ್ ರಿಬೇಟ್ ಯೋಜನೆ', en: 'Electricity Bill Rebate Scheme', hi: 'बिजली बिल छूट योजना',
    dkn: 'ಕಡಿಮೆ ಆದಾಯ ಕುಟುಂಬಗಳ ವಿದ್ಯುತ್ ಬಿಲ್‌ನಲ್ಲಿ ರಿಬೇಟ್.', den: 'Rebate on electricity bills for low-income families.', dhi: 'कम आय परिवारों के बिजली बिल पर छूट।',
    skn: 'ಬಳಕೆಯ ಮಿತಿಯೊಳಗಿನ ವಿದ್ಯುತ್‌ನಲ್ಲಿ ಬಿಲ್‌ನ ಒಂದು ಭಾಗವನ್ನು ಸರ್ಕಾರ ರಿಬೇಟ್ ರೂಪದಲ್ಲಿ ಮನ್ನಾ ಮಾಡುತ್ತದೆ.', sen: 'The government rebates a portion of usage within the limit on your bill.', shi: 'सीमा के भीतर की खपत पर बिल का एक हिस्सा सरकार छूट के रूप में माफ करती है।',
    views: 4920,
  }),
  build({
    slug: 'cooking-gas-subsidy-2026', cat: 'financial', dept: 'energy', last: '2026-12-31',
    kn: 'ಅಡುಗೆ ಅನಿಲ ಸಬ್ಸಿಡಿ ಯೋಜನೆ', en: 'Cooking Gas Subsidy Scheme', hi: 'खाना पाक गैस सब्सिडी योजना',
    dkn: 'ಅಡುಗೆ ಅನಿಲ ಸಿಲಿಂಡರ್‌ಗೆ ನೇರ ಸಬ್ಸಿಡಿ.', den: 'Direct subsidy on cooking gas cylinders.', dhi: 'खाना पाक गैस सिलेंडर पर सीधी सब्सिडी।',
    skn: 'ಅರ್ಹ ಕುಟುಂಬಗಳ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಪ್ರತಿ ಸಿಲಿಂಡರ್‌ಗೆ ಸಬ್ಸಿಡಿ ನೇರವಾಗಿ ಜಮಾ ಆಗುತ್ತದೆ.', sen: 'Subsidy for each cylinder is credited directly to eligible families’ bank accounts.', shi: 'पात्र परिवारों के बैंक खाते में प्रति सिलेंडर सब्सिडी सीधे जमा होती है।',
    views: 5860,
  }),
  build({
    slug: 'medical-expense-cash-help-2026', cat: 'financial', dept: 'health-family-welfare', last: '2026-11-30',
    kn: 'ವೈದ್ಯಕೀಯ ಖರ್ಚು ನಗದು ಸಹಾಯ', en: 'Medical Expense Cash Help', hi: 'चिकित्सा व्यय नकद सहायता',
    dkn: 'ದೊಡ್ಡ ಶಸ್ತ್ರಚಿಕಿತ್ಸೆ/ಚಿಕಿತ್ಸೆ ಖರ್ಚಿಗೆ ತುರ್ತು ನಗದು.', den: 'Emergency cash for major surgery/treatment costs.', dhi: 'बड़ी शल्य चिकित्सा/उपचार खर्च हेतु आपात नकद।',
    skn: 'ಆಸ್ಪತ್ರೆ ಬಿಲ್ ಮಿತಿ ಮೀರಿದಾಗ ಅರ್ಹ ಕುಟುಂಬಗಳಿಗೆ ಒಂದು ಬಾರಿ ನಗದು ಸಹಾಯ ಸಿಗುತ್ತದೆ.', sen: 'Eligible families get one-time cash help when hospital bills exceed the limit.', shi: 'अस्पताल बिल सीमा पार होने पर पात्र परिवारों को एक बार नकद सहायता मिलती है।',
    views: 3390,
  }),
  build({
    slug: 'education-loan-guarantee-2026', cat: 'financial', dept: 'msme', last: '2027-02-28',
    kn: 'ಶಿಕ್ಷಣ ಸಾಲ ಖಾತರಿ ಯೋಜನೆ', en: 'Education Loan Guarantee Scheme', hi: 'शिक्षा ऋण गारंटी योजना',
    dkn: 'ಉನ್ನತ ಶಿಕ್ಷಣ ಸಾಲಕ್ಕೆ ಸರ್ಕಾರದ ಖಾತರಿ.', den: 'Government guarantee for higher education loans.', dhi: 'उच्च शिक्षा ऋण के लिए सरकारी गारंटी।',
    skn: 'ಜಾಮೀನು ಇಲ್ಲದೆಯೂ ಬ್ಯಾಂಕ್‌ಗಳು ವಿದ್ಯಾರ್ಥಿ ಸಾಲ ನೀಡಲು ಸರ್ಕಾರ ಖಾತರಿ ನೀಡುತ್ತದೆ.', sen: 'Banks can give student loans without collateral thanks to the government guarantee.', shi: 'सरकारी गारंटी से बैंक बिना गारंटी के छात्र ऋण दे सकते हैं।',
    views: 3720,
  }),

  // ── business ─────────────────────────────────────────────
  build({
    slug: 'shop-registration-support-2026', cat: 'business', last: '2027-01-31',
    kn: 'ಅಂಗಡಿ ನೋಂದಣಿ ಸಹಾಯ ಯೋಜನೆ', en: 'Shop Registration Support Scheme', hi: 'दुकान पंजीकरण सहायता योजना',
    dkn: 'ಹೊಸ ಅಂಗಡಿ/ವ್ಯಾಪಾರ ನೋಂದಣಿಗೆ ಉಚಿತ ಸಹಾಯ ಮತ್ತು ಶುಲ್ಕ ಮನ್ನಾ.', den: 'Free help and fee waiver for new shop/business registration.', dhi: 'नई दुकान/व्यवसाय पंजीकरण हेतु मुफ्त सहायता और शुल्क माफी।',
    skn: 'ಹೊಸ ವ್ಯಾಪಾರ ಪ್ರಾರಂಭಿಸುವವರಿಗೆ ನೋಂದಣಿ ಶುಲ್ಕ ಮನ್ನಾ ಮತ್ತು ಸಲ್ಲಿಸಲು ಸಹಾಯ ಸಿಗುತ್ತದೆ.', sen: 'Registration fee waiver and filing help for new business starters.', shi: 'नया व्यवसाय शुरू करने वालों को पंजीकरण शुल्क माफी और आवेदन सहायता मिलती है।',
    views: 2470,
  }),
  build({
    slug: 'street-vendor-vending-2026', cat: 'business', last: '2026-12-31',
    kn: 'ಬೀದಿ ವ್ಯಾಪಾರಿ ವೆಂಡಿಂಗ್ ಸ್ಥಳ ಯೋಜನೆ', en: 'Street Vendor Vending Space Scheme', hi: 'रेहड़ी-पटरी विक्रेता वेंडिंग स्थान योजना',
    dkn: 'ಬೀದಿ ವ್ಯಾಪಾರಿಗಳಿಗೆ ಗುರುತಿಸಲ್ಪಟ್ಟ ವ್ಯಾಪಾರ ಸ್ಥಳ ಮತ್ತು ಸಾಲ.', den: 'Notified vending space and loans for street vendors.', dhi: 'रेहड़ी विक्रेताओं के लिए अधिसूचित वेंडिंग स्थान और ऋण।',
    skn: 'ವ್ಯಾಪಾರ ಮಾಡಲು ಗುರುತಿಸಲ್ಪಟ್ಟ ಸ್ಥಳ ಸಿಗುತ್ತದೆ. ನಗದು ಸಾಲ ಮತ್ತು ವಿಮೆ ಸಹ ಲಭ್ಯ.', sen: 'A notified vending spot, plus cash loan and insurance are available.', shi: 'अधिसूचित वेंडिंग स्थान, साथ ही नकद ऋण और बीमा उपलब्ध है।',
    views: 3840,
  }),
  build({
    slug: 'food-business-support-2026', cat: 'business', last: '2027-02-15',
    kn: 'ಆಹಾರ ವ್ಯಾಪಾರ ಸಹಾಯ ಯೋಜನೆ', en: 'Food Business Support Scheme', hi: 'खाद्य व्यवसाय सहायता योजना',
    dkn: 'ಆಹಾರ ಪದಾರ್ಥ ವ್ಯಾಪಾರಕ್ಕೆ ಪರವಾನಗಿ ಮತ್ತು ತರಬೇತಿ ಸಹಾಯ.', den: 'Licence and training help for food business.', dhi: 'खाद्य व्यवसाय हेतु लाइसेंस और प्रशिक्षण सहायता।',
    skn: 'FSSAI ಪರವಾನಗಿ, ಆಹಾರ ಸುರಕ್ಷತಾ ತರಬೇತಿ ಮತ್ತು ಸಾಲ ಸೌಲಭ್ಯ ಒದಗಿಸಲಾಗುತ್ತದೆ.', sen: 'FSSAI licence, food safety training and loan facility are provided.', shi: 'FSSAI लाइसेंस, खाद्य सुरक्षा प्रशिक्षण और ऋण सुविधा दी जाती है।',
    views: 2160,
  }),
  build({
    slug: 'export-promotion-grant-2026', cat: 'business', last: '2027-03-31',
    kn: 'ರಫ್ತು ಪ್ರೋತ್ಸಾಹ ಗ್ರಾಂಟ್ ಯೋಜನೆ', en: 'Export Promotion Grant Scheme', hi: 'निर्यात प्रोत्साहन अनुदान योಜना',
    dkn: 'ಸಣ್ಣ ಉದ್ಯಮಗಳ ರಫ್ತಿಗೆ ಗ್ರಾಂಟ್ ಮತ್ತು ತರಬೇತಿ.', den: 'Grant and training for exports by small businesses.', dhi: 'लघु व्यवसायों के निर्यात हेतु अनुदान और प्रशिक्षण।',
    skn: 'ಮೊದಲ ರಫ್ತಿಗೆ ಪ್ರಯೋಗಾತ್ಮಕ ಗ್ರಾಂಟ್ ಮತ್ತು ನಿರ್ಮಾಣ ಸಾಮಗ್ರಿ ಸಹಾಯ ಸಿಗುತ್ತದೆ.', sen: 'A pilot grant and packing material help are given for the first export.', shi: 'पहले निर्यात हेतु पायलट अनुदान और पैकेजिंग सामग्री सहायता मिलती है।',
    views: 1890,
  }),
  build({
    slug: 'digital-payment-store-2026', cat: 'business', last: '2026-12-31',
    kn: 'ಡಿಜಿಟಲ್ ಪಾವತಿ ಅಂಗಡಿ ಯೋಜನೆ', en: 'Digital Payment Store Scheme', hi: 'डिजिटल भुगतान दुकान योजना',
    dkn: 'ಅಂಗಡಿಗಳಲ್ಲಿ ಡಿಜಿಟಲ್ ಪಾವತಿ ಸ್ವೀಕಾರಕ್ಕೆ ಪ್ರೋತ್ಸಾಹ.', den: 'Incentive for shops accepting digital payments.', dhi: 'डिजिटल भुगतान स्वीकार करने वाली दुकानों के लिए प्रोत्साहन।',
    skn: 'QR ಕೋಡ್ ಮೂಲಕ ಪಾವತಿ ಸ್ವೀಕರಿಸುವ ಅಂಗಡಿಗಳಿಗೆ ಕ್ಯಾಶ್‌ಬ್ಯಾಕ್ ಮತ್ತು ಉಪಕರಣ ಸಹಾಯ.', sen: 'Cashback and device support for shops accepting payments via QR code.', shi: 'QR कोड से भुगतान लेने वाली दुकानों को कैशबैक और उपकरण सहायता मिलती है।',
    views: 3130,
  }),
  build({
    slug: 'young-entrepreneur-grant-2026', cat: 'business', last: '2027-01-31',
    kn: 'ಯುವ ಉದ್ಯಮಿ ಗ್ರಾಂಟ್ ಯೋಜನೆ', en: 'Young Entrepreneur Grant Scheme', hi: 'युवा उद्यमी अनुदान योजना',
    dkn: '35 ವರ್ಷ ಒಳಗಿನ ಯುವ ಉದ್ಯಮಿಗಳಿಗೆ ಮುಂಗಡ ಗ್ರಾಂಟ್.', den: 'Upfront grant for young entrepreneurs below 35.', dhi: '35 वर्ष से कम आयु के युवा उद्यमियों के लिए अग्रिम अनुदान।',
    skn: 'ಹೊಸ ಉದ್ಯಮ ಪ್ರಾರಂಭಿಸುವ ಯುವಕರಿಗೆ ಸಾಲದ ಜೊತೆಗೆ ಮುಂಗಡ ಗ್ರಾಂಟ್ ದೊರೆಯುತ್ತದೆ.', sen: 'Young starters get an upfront grant along with the loan.', shi: 'नया उद्यम शुरू करने वाले युवाओं को ऋण के साथ अग्रिम अनुदान मिलता है।',
    views: 2780,
  }),
  build({
    slug: 'industrial-plot-allotment-2026', cat: 'business', last: '2027-03-31',
    kn: 'ಕೈಗಾರಿಕಾ ನಿವೇಶನ ಹಂಚಿಕೆ ಯೋಜನೆ', en: 'Industrial Plot Allotment Scheme', hi: 'औद्योगिक प्लॉट आवंटन योजना',
    dkn: 'ಸಣ್ಣ ಉದ್ಯಮಗಳಿಗೆ ಕೈಗಾರಿಕಾ ನಿವೇಶನ.', den: 'Industrial plots for small businesses.', dhi: 'लघु व्यवसायों के लिए औद्योगिक प्लॉट।',
    skn: 'ಔದ್ಯೋಗಿಕ ವಲಯಗಳಲ್ಲಿ ಕಡಿಮೆ ದರದಲ್ಲಿ ನಿವೇಶನ ಬಾಡಿಗೆ/ಪಟ್ಟಾ ಸಿಗುತ್ತದೆ.', sen: 'Plots are given on lease/patta at low rates in industrial areas.', shi: 'औद्योगिक क्षेत्रों में कम दर पर प्लॉट पट्टे/लीज पर मिलते हैं।',
    views: 2040,
  }),
  build({
    slug: 'machinery-modernisation-subsidy-2026', cat: 'business', last: '2027-02-28',
    kn: 'ಯಂತ್ರೋಪಕರಣ ಆಧುನೀಕರಣ ಸಬ್ಸಿಡಿ', en: 'Machinery Modernisation Subsidy', hi: 'यंत्र आधुनिकीकरण सब्सिडी',
    dkn: 'ಹಳೆಯ ಯಂತ್ರ ಬದಲಾಯಿಸಿ ಹೊಸದು ಖರೀದಿಗೆ ಸಬ್ಸಿಡಿ.', den: 'Subsidy on buying new machines to replace old ones.', dhi: 'पुराने यंत्र बदलकर नया खरीदने पर सब्सिडी।',
    skn: 'ಉತ್ಪಾದನೆ ಹೆಚ್ಚಿಸಲು ಯಂತ್ರ ನವೀಕರಿಸಲು ಬೆಲೆಯ ಒಂದು ಭಾಗವನ್ನು ಸರ್ಕಾರ ಭರಿಸುತ್ತದೆ.', sen: 'The government pays a share of the price to upgrade machines and raise output.', shi: 'उत्पादन बढ़ाने के लिए यंत्र अपग्रेड करने की कीमत का एक हिस्सा सरकार वहन करती है।',
    views: 1760,
  }),

  // ── disability ───────────────────────────────────────────
  build({
    slug: 'assistive-devices-subsidy-2026', cat: 'disability', last: '2026-12-31',
    kn: 'ಸಹಾಯಕ ಸಾಧನ ಸಬ್ಸಿಡಿ ಯೋಜನೆ', en: 'Assistive Devices Subsidy Scheme', hi: 'सहायक उपकरण सब्सिडी योजना',
    dkn: 'ಶ್ರವಣ ಯಂತ್ರ, ಕೃತ್ರಿಮ ಕಾಲು ಮುಂತಾದ ಸಾಧನಗಳಿಗೆ ಸಬ್ಸಿಡಿ.', den: 'Subsidy for hearing aids, artificial limbs and similar devices.', dhi: 'श्रवण यंत्र, कृत्रिम अंग आदि उपकरणों पर सब्सिडी।',
    skn: 'ದಾಖಲಿತ ವಿಕಲಚೇತನರಿಗೆ ಅಗತ್ಯ ಸಹಾಯಕ ಸಾಧನಗಳನ್ನು ಕಡಿಮೆ ಬೆಲೆಗೆ ಪಡೆಯಬಹುದು.', sen: 'Certified persons with disabilities can get needed assistive devices at low cost.', shi: 'प्रमाणित दिव्यांगजन आवश्यक सहायक उपकरण कम कीमत पर पा सकते हैं।',
    views: 2930,
  }),
  build({
    slug: 'accessible-home-ramp-grant-2026', cat: 'disability', last: '2027-01-31',
    kn: 'ಪ್ರವೇಶ ರ್ಯಾಂಪ್ ಮನೆ ಗ್ರಾಂಟ್ ಯೋಜನೆ', en: 'Accessible Home Ramp Grant Scheme', hi: 'सुलभ रैंप घर अनुदान योजना',
    dkn: 'ವ್ಹೀಲ್‌ಚೇರ್ ಬಳಕೆದಾರರ ಮನೆಗೆ ರ್ಯಾಂಪ್ ನಿರ್ಮಾಣ ಗ್ರಾಂಟ್.', den: 'Grant to build a ramp at homes of wheelchair users.', dhi: 'व्हीलचेयर उपयोगकर्ताओं के घर में रैंप निर्माण हेतु अनुदान।',
    skn: 'ಮನೆಯ ಪ್ರವೇಶಕ್ಕೆ ರ್ಯಾಂಪ್ ಮತ್ತು ಹಿಡಿಕೆ ಅಳವಡಿಸಲು ನಿರ್ಮಾಣ ಖರ್ಚಿಗೆ ಗ್ರಾಂಟ್ ಸಿಗುತ್ತದೆ.', sen: 'A construction grant is given to add a ramp and handrails at the entrance.', shi: 'प्रवेशद्वार पर रैंप और हैंडरेल लगाने के निर्माण खर्च पर अनुदान मिलता है।',
    views: 1670,
  }),
  build({
    slug: 'disability-transport-allowance-2026', cat: 'disability', dept: 'labour', last: '2026-12-31',
    kn: 'ವಿಕಲಚೇತನ ಸಂಚಾರ ಭತ್ಯೆ ಯೋಜನೆ', en: 'Disability Transport Allowance Scheme', hi: 'दिव्यांग परिवहन भत्ता योजना',
    dkn: 'ತರಬೇತಿ/ಕೆಲಸಕ್ಕೆ ಹೋಗಲು ವಿಶೇಷ ಸಂಚಾರ ಭತ್ಯೆ.', den: 'Special travel allowance to reach training/work.', dhi: 'प्रशिक्षण/काम पर जाने हेतु विशेष यात्रा भत्ता।',
    skn: 'ಪ್ರತಿ ತಿಂಗಳು ನಿಗದಿತ ಸಂಚಾರ ಭತ್ಯೆ ಜಮಾ ಆಗುತ್ತದೆ. ವ್ಹೀಲ್‌ಚೇರ್/ವಾಹನ ವೆಚ್ಚಕ್ಕೆ ಸಹಾಯವಾಗುತ್ತದೆ.', sen: 'A fixed monthly travel allowance is credited, helping with wheelchair/vehicle costs.', shi: 'निश्चित मासिक यात्रा भत्ता जमा होता है, जो व्हीलचेयर/वाहन खर्च में सहायक है।',
    views: 2280,
  }),
  build({
    slug: 'disability-marriage-incentive-2026', cat: 'disability', last: '2027-03-31',
    kn: 'ವಿಕಲಚೇತನ ವಿವಾಹ ಪ್ರೋತ್ಸಾಹ ಯೋಜನೆ', en: 'Disability Marriage Incentive Scheme', hi: 'दिव्यांग विवाह प्रोत्साहन योजना',
    dkn: 'ವಿಕಲಚೇತನ ವ್ಯಕ್ತಿಯ ವಿವಾಹಕ್ಕೆ ಪ್ರೋತ್ಸಾಹ ಧನ.', den: 'Incentive money for the marriage of persons with disabilities.', dhi: 'दिव्यांग व्यक्ति के विवाह हेतु प्रोತ्साहन राशि।',
    skn: 'ದಾಖಲಿತ ವಿಕಲಚೇತನ ವ್ಯಕ್ತಿಯ ವಿವಾಹದ ಸಂದರ್ಭದಲ್ಲಿ ಒಂದು ಬಾರಿ ಪ್ರೋತ್ಸಾಹ ಧನ ದೊರೆಯುತ್ತದೆ.', sen: 'A one-time incentive is given on the marriage of a certified person with disability.', shi: 'प्रमाणित दिव्यांग व्यक्ति के विवाह पर एक बार प्रोत्साहन राशि मिलती है।',
    views: 1480,
  }),
  build({
    slug: 'sign-language-training-2026', cat: 'disability', dept: 'skill-development', last: '2027-02-28',
    kn: 'ಸಂಕೇತ ಭಾಷಾ ತರಬೇತಿ ಯೋಜನೆ', en: 'Sign Language Training Scheme', hi: 'संकेत भाषा प्रशिक्षण योजना',
    dkn: 'ಮೂಕ ಮತ್ತು ಬಧಿರ ಸಮುದಾಯಕ್ಕೆ ಸಂಕೇತ ಭಾಷಾ ತರಬೇತಿ.', den: 'Sign language training for the deaf and mute community.', dhi: 'बधिर और गूँग समुदाय के लिए संकेत भाषा प्रशिक्षण।',
    skn: 'ವಿದ್ಯಾರ್ಥಿಗಳು ಮತ್ತು ಸಂವಹನ ಸಾಧನಗಳ ಬಳಕೆದಾರರಿಗೆ ಉಚಿತ ಸಂಕೇತ ಭಾಷಾ ತರಬೇತಿ ನೀಡಲಾಗುತ್ತದೆ.', sen: 'Free sign language training is given to students and communication device users.', shi: 'छात्रों और संचार उपकरण उपयोगकर्ताओं को मुफ्त संकेत भाषा प्रशिक्षण दिया जाता है।',
    views: 1350,
  }),
  build({
    slug: 'disability-caregiver-allowance-2026', cat: 'disability', last: '2026-12-31',
    kn: 'ವಿಕಲಚೇತನ ಆರೈಕೆ ಭತ್ಯೆ ಯೋಜನೆ', en: 'Disability Caregiver Allowance Scheme', hi: 'दिव्यांग देखभाल भत्ता योजना',
    dkn: 'ತೀವ್ರ ವಿಕಲಚೇತನರ ಆರೈಕೆ ಮಾಡುವವರಿಗೆ ಮಾಸಿಕ ಭತ್ಯೆ.', den: 'Monthly allowance for caregivers of persons with severe disabilities.', dhi: 'गंभीर दिव्यांगता की देखभाल करने वालों के लिए मासिक भत्ता।',
    skn: '40% ಮೇಲ್ಪಟ್ಟ ಅಂಗವೈಕಲ್ಯದ ಆರೈಕೆ ಮಾಡುವ ಕುಟುಂಬಕ್ಕೆ ಪ್ರತಿ ತಿಂಗಳು ಭತ್ಯೆ ಸಿಗುತ್ತದೆ.', sen: 'Families caring for someone with 40%+ disability get a monthly allowance.', shi: '40% से अधिक दिव्यांगता वाले की देखभाल करने वाले परिवार को मासिक भत्ता मिलता है।',
    views: 2510,
  }),
  build({
    slug: 'wheelchair-subsidy-2026', cat: 'disability', last: '2026-11-30',
    kn: 'ವ್ಹೀಲ್‌ಚೇರ್ ಸಬ್ಸಿಡಿ ಯೋಜನೆ', en: 'Wheelchair Subsidy Scheme', hi: 'व्हीलचेयर सब्सिडी योजना',
    dkn: 'ಮ್ಯಾನುವಲ್ ಮತ್ತು ಪವರ್ ವ್ಹೀಲ್‌ಚೇರ್‌ಗೆ ಸಬ್ಸಿಡಿ.', den: 'Subsidy on manual and power wheelchairs.', dhi: 'मैनुअल और पावर व्हीलचेयर पर सब्सिडी।',
    skn: 'ಆಯ್ಕೆಯಾದವರಿಗೆ ವ್ಹೀಲ್‌ಚೇರ್ ಉಚಿತ ಅಥವಾ ಕಡಿಮೆ ಬೆಲೆಗೆ ದೊರೆಯುತ್ತದೆ.', sen: 'Selected candidates get a wheelchair free or at low cost.', shi: 'चयनित लोगों को व्हीलचेयर मुफ्त या कम कीमत पर मिलता है।',
    views: 3020,
  }),
  build({
    slug: 'inclusive-education-support-2026', cat: 'disability', dept: 'public-instruction', last: '2027-01-31',
    kn: 'ಸಮಗ್ರ ಶಿಕ್ಷಣ ಸಹಾಯ ಯೋಜನೆ', en: 'Inclusive Education Support Scheme', hi: 'समावेशी शिक्षा सहायता योजना',
    dkn: 'ವಿಶೇಷ ಅಗತ್ಯದ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಶಾಲಾ ಸಹಾಯಕ ಸಾಮಗ್ರಿ.', den: 'Classroom support material for students with special needs.', dhi: 'विशेष आवश्यकता वाले छात्रों के लिए कक्षा सहायक सामग्री।',
    skn: 'ಶಿಕ್ಷಕರ ತರಬೇತಿ, ಆಡಿಯೋ-ವಿಡಿಯೋ ಪಾಠ ಮತ್ತು ಸಹಾಯಕ ಸಾಮಗ್ರಿ ವಿಶೇಷ ಅಗತ್ಯದ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಒದಗಿಸಲಾಗುತ್ತದೆ.', sen: 'Teacher training, audio-video lessons and support material are provided for special-needs students.', shi: 'शिक्षक प्रशिक्षण, ऑडियो-वीडियो पाठ और सहायक सामग्री विशेष आवश्यकता वाले छात्रों को दी जाती है।',
    views: 1820,
  }),

  build({
    slug: 'first-job-incentive-2026', cat: 'employment', last: '2027-03-31',
    kn: 'ಮೊದಲ ಉದ್ಯೋಗ ಪ್ರೋತ್ಸಾಹ ಯೋಜನೆ', en: 'First Job Incentive Scheme', hi: 'पहली नौकरी प्रोत्साहन योजना',
    dkn: 'ಮೊದಲ ಬಾರಿಗೆ ಕೆಲಸಕ್ಕೆ ಸೇರುವ ಯುವಜನರಿಗೆ ಪ್ರೋತ್ಸಾಹ ಧನ.', den: 'Incentive money for youth joining their first job.', dhi: 'पहली नौकरी जॉइन करने वाले युवाओं के लिए प्रोत्साहन राशि।',
    skn: 'ಮೊದಲ ಉದ್ಯೋಗಕ್ಕೆ ಸೇರಿ ನಿಗದಿತ ಅವಧಿ ಪೂರೈಸಿದರೆ ಒಂದು ಬಾರಿ ಪ್ರೋತ್ಸಾಹ ಧನ ಜಮಾ ಆಗುತ್ತದೆ.', sen: 'A one-time incentive is credited after completing a set period in the first job.', shi: 'पहली नौकरी में निश्चित अवधि पूरी करने पर एक बार प्रोत्साहन राशि जमा होती है।',
    views: 4540,
  }),
];
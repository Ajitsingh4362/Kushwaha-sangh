// ---------------------------------------------------------------
// All editable site content lives here. Replace placeholder values
// (names, numbers, photos, addresses) with the Sangh's real details.
// Keeping content separate from components makes future edits and
// an eventual Hindi-language version much easier to wire up.
// ---------------------------------------------------------------

export const site = {
  name: 'Kushwaha Sangh',
  tagline: 'Community Welfare Association',
  established: '1998', // placeholder — replace with real founding year
  mission:
    'Bringing together the achievers of our community to uplift every family through education, healthcare and mutual support.',
  whatsapp: '910000000000', // placeholder number, digits only, country code first
  email: 'contact@kushwahasangh.org', // placeholder
  phone: '+91 00000 00000', // placeholder
  address: 'Sangh Bhawan, Main Road, [Your City], [State] – [PIN]', // placeholder
  socials: {
    facebook: '#',
    instagram: '#',
    youtube: '#',
  },
}

export const navigation = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Committee', to: '/committee' },
  {
    label: 'Welfare Programs',
    to: '/welfare',
    children: [
      { label: "Girls' Hostel", to: '/welfare#hostel' },
      { label: 'Health Assistance', to: '/welfare#health' },
      { label: "Achievers' Wall", to: '/welfare#achievers' },
    ],
  },
  { label: 'Membership', to: '/membership' },
  { label: 'Donate', to: '/donate' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'News', to: '/news' },
  { label: 'Contact', to: '/contact' },
]

export const stats = [
  { label: 'Registered Members', value: '500+', id: 'REG-M' },
  { label: 'Hostel Fund Progress', value: '14%', id: 'REG-H' },
  { label: 'Families Assisted', value: '310', id: 'REG-F' },
  { label: 'Years of Service', value: '10', id: 'REG-Y' },
]

export const pillars = [
  {
    id: 'hostel',
    title: "Girls' Hostel",
    blurb:
      'A planned residence for young women from the community pursuing education away from home — currently raising funds to build it.',
    number: '01',
  },
  {
    id: 'health',
    title: 'Health Assistance',
    blurb:
      'Financial support toward treatment and emergency medical care for members facing illness.',
    number: '02',
  },
  {
    id: 'achievers',
    title: "Achievers' Wall",
    blurb:
      'Recognition and prizes for students and professionals from the community who excel.',
    number: '03',
  },
]

export const committee = {
  president: {
    name: 'President\u2019s Name',
    designation: 'Adhyaksh (President)',
    regNo: 'OB-001',
    note: 'Leading the Sangh since [year]. Add a short welcome note here.',
  },
  officers: [
    { name: 'Secretary\u2019s Name', designation: 'Sachiv (General Secretary)', regNo: 'OB-002' },
    { name: 'Treasurer\u2019s Name', designation: 'Kosha-Adhyaksh (Treasurer)', regNo: 'OB-003' },
    { name: 'Vice President\u2019s Name', designation: 'Up-Adhyaksh (Vice President)', regNo: 'OB-004' },
  ],
  members: Array.from({ length: 8 }).map((_, i) => ({
    name: 'Member Name',
    designation: 'Executive Committee Member',
    regNo: `EC-${String(i + 5).padStart(3, '0')}`,
  })),
}

export const hostelInfo = {
  status: 'upcoming', // 'upcoming' — hostel is a planned initiative, not yet built
  intro:
    'The Sangh is raising funds to build its first residential hostel for girls from the community pursuing higher education — a safe, affordable place to stay close to college campuses.',
  facilities: [
    'Furnished shared rooms',
    'Three meals a day',
    'Study hall and library corner',
    'Round-the-clock warden supervision',
    'CCTV-monitored premises',
    'Medical first-aid on site',
  ],
  plannedCapacity: '60 beds (planned)',
  fundGoal: '\u20b950,00,000', // placeholder — replace with the real target
  fundRaised: '\u20b96,80,000', // placeholder — replace with real progress
  progressPercent: 14,
  progressNote: 'Funds raised so far toward the construction goal — replace with live figures.',
  progressNote: 'Current occupancy against total capacity — replace with live figures.',
}

export const healthInfo = {
  intro:
    'Members facing medical emergencies or ongoing treatment costs can apply for assistance from the Sangh\u2019s health fund. Applications are reviewed by the committee on a rolling basis.',
  steps: [
    { title: 'Submit application', detail: 'Fill the request form with patient and treatment details.' },
    { title: 'Committee review', detail: 'The welfare committee reviews cases within 7\u201310 days.' },
    { title: 'Fund disbursal', detail: 'Approved assistance is transferred directly toward treatment costs.' },
  ],
  disclaimer:
    'Assistance amounts depend on available fund balance and case severity, and are not guaranteed.',
}

export const achievers = [
  { name: 'Achiever Name', achievement: 'Class 12 Board Topper, [Year]', category: 'Academics' },
  { name: 'Achiever Name', achievement: 'Selected — Civil Services, [Year]', category: 'Public Service' },
  { name: 'Achiever Name', achievement: 'State-level Athletics Medallist', category: 'Sports' },
  { name: 'Achiever Name', achievement: 'Engineering Gold Medallist, [University]', category: 'Academics' },
  { name: 'Achiever Name', achievement: 'Community Service Recognition', category: 'Service' },
  { name: 'Achiever Name', achievement: 'National-level Science Olympiad', category: 'Academics' },
]

export const newsItems = [
  {
    title: 'Annual General Meeting announced',
    date: '2026-08-15',
    summary: 'All members are invited to the AGM. Agenda and venue details to follow by circular.',
  },
  {
    title: 'Hostel renovation — phase two complete',
    date: '2026-06-02',
    summary: 'New study hall and additional rooms are now ready for the upcoming academic year.',
  },
  {
    title: 'Scholarship applications open',
    date: '2026-05-10',
    summary: 'Students from the community can apply for this year\u2019s merit scholarships before the deadline.',
  },
  {
    title: 'Health fund crosses milestone',
    date: '2026-03-22',
    summary: 'Thanks to member donations, the health assistance fund has supported its 300th family.',
  },
]

export const galleryCategories = [
  { id: 'hostel', label: 'Hostel Life', count: 8 },
  { id: 'events', label: 'Sangh Events', count: 10 },
  { id: 'ceremonies', label: 'Felicitation Ceremonies', count: 6 },
  { id: 'health', label: 'Health Camps', count: 5 },
]

export const transparency = [
  { year: '2025\u201326', collected: '\u20b96,80,000', spent: '\u20b95,95,000', report: '#' },
  { year: '2024\u201325', collected: '\u20b95,40,000', spent: '\u20b95,10,000', report: '#' },
  { year: '2023\u201324', collected: '\u20b94,95,000', spent: '\u20b94,60,000', report: '#' },
]

export const donationMethods = {
  upiId: 'kushwahasangh@upi', // placeholder
  bank: {
    accountName: 'Kushwaha Sangh',
    accountNo: 'XXXXXXXXXXXX',
    ifsc: 'XXXX0000000',
    bankBranch: 'Bank Name, Branch',
  },
}

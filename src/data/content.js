// ---------------------------------------------------------------
// All editable site content lives here. Replace placeholder values
// (names, numbers, photos, addresses) with the Sangh's real details.
// The public site is Hindi-only; the admin panel and the legal
// policy pages stay in English (they use the *En fields below).
// ---------------------------------------------------------------

export const site = {
  name: 'कुशवाहा संघ',
  nameEn: 'Kushwaha Sangh', // used by the English policy pages
  tagline: 'सामुदायिक कल्याण संघ',
  established: '2017', // founded 2017, officially registered 2023
  mission:
    'कुशवाहा समाज के हर सदस्य को एक सूत्र में जोड़ना, ताकि संकट की घड़ी में कोई भी व्यक्ति अकेला न रहे।',
  whatsapp: '910000000000', // placeholder number, digits only, country code first
  email: 'contact@kushwahasangh.org', // placeholder
  phone: '+91 82924 53335',
  address: 'कुशवाहा छात्रावास, सीतामढ़ी, बिहार 843302',
  addressEn: 'Kushwaha Hostel, Sitamarhi, Bihar 843302',
  socials: {
    facebook: '#',
    instagram: '#',
    youtube: '#',
  },
}

export const navigation = [
  { label: 'होम', to: '/' },
  { label: 'हमारे बारे में', to: '/about' },
  { label: 'समिति', to: '/committee' },
  {
    label: 'कल्याण कार्यक्रम',
    to: '/welfare',
    children: [
      { label: 'बालिका छात्रावास', to: '/welfare#hostel' },
      { label: 'स्वास्थ्य सहायता', to: '/welfare#health' },
      { label: 'प्रतिभा सम्मान', to: '/welfare#achievers' },
    ],
  },
  { label: 'सदस्य', to: '/community' },
  { label: 'दान करें', to: '/donate' },
  { label: 'गैलरी', to: '/gallery' },
  { label: 'कार्यक्रम', to: '/programs' },
  { label: 'समाचार', to: '/news' },
  { label: 'संपर्क', to: '/contact' },
]

export const stats = [
  { label: 'पंजीकृत सदस्य', value: '500+', id: 'REG-M' },
  { label: 'छात्रावास कोष की प्रगति', value: '49%', id: 'REG-H' },
  { label: 'सहायता प्राप्त परिवार', value: '310', id: 'REG-F' },
  { label: 'सेवा के वर्ष', value: '10', id: 'REG-Y' },
]

export const pillars = [
  {
    id: 'hostel',
    title: 'बालिका छात्रावास',
    blurb:
      'घर से दूर पढ़ाई कर रही समाज की बेटियों के लिए प्रस्तावित आवास, जिसके निर्माण के लिए अभी धन जुटाया जा रहा है।',
    number: '01',
  },
  {
    id: 'health',
    title: 'स्वास्थ्य सहायता',
    blurb:
      'बीमारी से जूझ रहे सदस्यों को इलाज और आपातकालीन चिकित्सा के लिए आर्थिक सहायता।',
    number: '02',
  },
  {
    id: 'achievers',
    title: 'प्रतिभा सम्मान',
    blurb:
      'उत्कृष्ट प्रदर्शन करने वाले समाज के विद्यार्थियों और पेशेवरों का सम्मान और पुरस्कार।',
    number: '03',
  },
]

export const committee = {
  president: {
    name: 'अध्यक्ष का नाम',
    designation: 'अध्यक्ष',
    regNo: 'OB-001',
    note: '[वर्ष] से संघ का नेतृत्व कर रहे हैं। यहाँ एक छोटा स्वागत संदेश जोड़ें।',
  },
  officers: [
    { name: 'सचिव का नाम', designation: 'महासचिव', regNo: 'OB-002' },
    { name: 'कोषाध्यक्ष का नाम', designation: 'कोषाध्यक्ष', regNo: 'OB-003' },
    { name: 'उपाध्यक्ष का नाम', designation: 'उपाध्यक्ष', regNo: 'OB-004' },
  ],
  members: Array.from({ length: 8 }).map((_, i) => ({
    name: 'सदस्य का नाम',
    designation: 'कार्यकारिणी सदस्य',
    regNo: `EC-${String(i + 5).padStart(3, '0')}`,
  })),
}

export const hostelInfo = {
  status: 'upcoming', // 'upcoming' — hostel is a planned initiative, not yet built
  intro:
    'संघ उच्च शिक्षा प्राप्त कर रही समाज की बेटियों के लिए अपना पहला आवासीय छात्रावास बनाने हेतु धन जुटा रहा है। यह कॉलेजों के पास रहने की एक सुरक्षित और किफ़ायती जगह होगी।',
  facilities: [
    'सुसज्जित साझा कमरे',
    'दिन में तीन बार भोजन',
    'अध्ययन कक्ष और पुस्तकालय',
    'चौबीसों घंटे वार्डन की देखरेख',
    'सीसीटीवी निगरानी वाला परिसर',
    'परिसर में प्राथमिक चिकित्सा सुविधा',
  ],
  plannedCapacity: '60 बिस्तर (प्रस्तावित)',
  fundGoal: '\u20b950,00,000', // placeholder — replace with the real target
  fundRaised: '\u20b924,50,000', // placeholder — replace with real progress
  progressPercent: 49,
  progressNote: 'निर्माण लक्ष्य की ओर अब तक जुटाई गई राशि।',
}

export const healthInfo = {
  intro:
    'चिकित्सा आपातकाल या लंबे इलाज के खर्च का सामना कर रहे सदस्य संघ के स्वास्थ्य कोष से सहायता के लिए आवेदन कर सकते हैं। समिति आवेदनों की समीक्षा लगातार करती रहती है।',
  steps: [
    { title: 'आवेदन जमा करें', detail: 'मरीज़ और इलाज की जानकारी के साथ अनुरोध फ़ॉर्म भरें।' },
    { title: 'समिति द्वारा समीक्षा', detail: 'कल्याण समिति 7\u201310 दिनों में मामले की समीक्षा करती है।' },
    { title: 'सहायता राशि का भुगतान', detail: 'स्वीकृत सहायता राशि सीधे इलाज के खर्च के लिए भेजी जाती है।' },
  ],
  disclaimer:
    'सहायता राशि कोष में उपलब्ध धन और मामले की गंभीरता पर निर्भर करती है, और इसकी गारंटी नहीं है।',
}

export const achievers = [
  { name: 'प्रतिभा का नाम', achievement: 'कक्षा 12 बोर्ड टॉपर, [वर्ष]', category: 'शिक्षा' },
  { name: 'प्रतिभा का नाम', achievement: 'सिविल सेवा में चयन, [वर्ष]', category: 'लोक सेवा' },
  { name: 'प्रतिभा का नाम', achievement: 'राज्य स्तरीय एथलेटिक्स पदक विजेता', category: 'खेल' },
  { name: 'प्रतिभा का नाम', achievement: 'इंजीनियरिंग स्वर्ण पदक विजेता, [विश्वविद्यालय]', category: 'शिक्षा' },
  { name: 'प्रतिभा का नाम', achievement: 'समाज सेवा सम्मान', category: 'सेवा' },
  { name: 'प्रतिभा का नाम', achievement: 'राष्ट्रीय स्तर विज्ञान ओलंपियाड', category: 'शिक्षा' },
]

export const newsItems = [
  {
    title: 'वार्षिक आम सभा की घोषणा',
    date: '2026-08-15',
    summary: 'सभी सदस्य वार्षिक आम सभा में आमंत्रित हैं। कार्यसूची और स्थान की जानकारी परिपत्र द्वारा दी जाएगी।',
  },
  {
    title: 'छात्रावास नवीनीकरण का दूसरा चरण पूरा',
    date: '2026-06-02',
    summary: 'आगामी शैक्षणिक सत्र के लिए नया अध्ययन कक्ष और अतिरिक्त कमरे अब तैयार हैं।',
  },
  {
    title: 'छात्रवृत्ति के लिए आवेदन शुरू',
    date: '2026-05-10',
    summary: 'समाज के विद्यार्थी अंतिम तिथि से पहले इस वर्ष की मेधा छात्रवृत्ति के लिए आवेदन कर सकते हैं।',
  },
  {
    title: 'स्वास्थ्य कोष ने पार किया अहम पड़ाव',
    date: '2026-03-22',
    summary: 'सदस्यों के दान की बदौलत स्वास्थ्य सहायता कोष ने अपने 300वें परिवार की मदद की है।',
  },
]

export const galleryCategories = [
  { id: 'events', label: 'संघ के कार्यक्रम', count: 10 },
  { id: 'ceremonies', label: 'सम्मान समारोह', count: 6 },
  { id: 'health', label: 'स्वास्थ्य शिविर', count: 5 },
]

export const transparency = [
  { year: '2025\u201326', collected: '\u20b96,80,000', spent: '\u20b95,95,000', report: '#' },
  { year: '2024\u201325', collected: '\u20b95,40,000', spent: '\u20b95,10,000', report: '#' },
  { year: '2023\u201324', collected: '\u20b94,95,000', spent: '\u20b94,60,000', report: '#' },
]

export const donationMethods = {
  upiId: '11834915@cbin',
  bank: {
    accountName: 'Kushwaha Sangh',
    accountNo: 'XXXXXXXXXXXX',
    ifsc: 'XXXX0000000',
    bankBranch: 'बैंक का नाम, शाखा',
  },
}


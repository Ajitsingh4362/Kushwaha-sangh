// Program categories are stored in English (the admin panel uses them
// as-is); the public site shows these Hindi labels instead.
export const PROGRAM_CATEGORY_HI = {
  'Blood Donation Camp': 'रक्तदान शिविर',
  'Health Checkup Camp': 'स्वास्थ्य जाँच शिविर',
  'Cultural Event': 'सांस्कृतिक कार्यक्रम',
  'Felicitation Ceremony': 'सम्मान समारोह',
  Meeting: 'बैठक',
  'Relief / Welfare Drive': 'राहत / कल्याण अभियान',
  Other: 'अन्य',
}

export function programCategoryHi(category) {
  return PROGRAM_CATEGORY_HI[category] || category
}

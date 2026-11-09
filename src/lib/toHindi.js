// Shows names and occupations typed in English (Roman letters) in Hindi
// on the public site. The database is not changed: the admin panel still
// shows exactly what was entered. Anything already in Hindi is left as is.
//
// Names: a word list of common names/surnames first, then a phonetic
// fallback for any other word. Occupations: a word list only; an unknown
// occupation word is left in English rather than guessed.
// To fix a wrong spelling, add the word to NAME_WORDS / OCCUPATION_WORDS.

const DEVANAGARI = /[\u0900-\u097F]/

const NAME_WORDS = {
  // titles
  dr: 'डॉ.', 'dr.': 'डॉ.', er: 'इं.', 'er.': 'इं.', mr: 'श्री', 'mr.': 'श्री', shri: 'श्री', sri: 'श्री',
  smt: 'श्रीमती', 'smt.': 'श्रीमती', mrs: 'श्रीमती', 'mrs.': 'श्रीमती', ms: 'सुश्री', 'ms.': 'सुश्री', prof: 'प्रो.', 'prof.': 'प्रो.',
  // surnames / common second names
  kumar: 'कुमार', kumari: 'कुमारी', devi: 'देवी', singh: 'सिंह', prasad: 'प्रसाद', kushwaha: 'कुशवाहा',
  kushwah: 'कुशवाहा', kushvaha: 'कुशवाहा', kuswaha: 'कुशवाहा', kushawaha: 'कुशवाहा', kushwaaha: 'कुशवाहा',
  kushwha: 'कुशवाहा', bharti: 'भारती', bharati: 'भारती', urf: 'उर्फ़', alias: 'उर्फ़', koeri: 'कोइरी', koiri: 'कोइरी', mahto: 'महतो', mahato: 'महतो', mehta: 'मेहता',
  maurya: 'मौर्य', mourya: 'मौर्य', shakya: 'शाक्य', saini: 'सैनी', bhagat: 'भगत', bhagta: 'भगत',
  chaudhary: 'चौधरी', choudhary: 'चौधरी', chaudhari: 'चौधरी', choudhury: 'चौधरी', rai: 'राय', ray: 'राय',
  sah: 'साह', sahu: 'साहू', shah: 'शाह', gupta: 'गुप्ता', yadav: 'यादव', mandal: 'मंडल', thakur: 'ठाकुर',
  sharma: 'शर्मा', verma: 'वर्मा', varma: 'वर्मा', mishra: 'मिश्रा', jha: 'झा', pandey: 'पांडेय', tiwari: 'तिवारी',
  sinha: 'सिन्हा', sahni: 'सहनी', paswan: 'पासवान', ram: 'राम', das: 'दास', lal: 'लाल', nath: 'नाथ',
  chandra: 'चंद्र', chand: 'चंद', narayan: 'नारायण', nandan: 'नंदन', kant: 'कांत', kishore: 'किशोर',
  kishor: 'किशोर', bihari: 'बिहारी', babu: 'बाबू', ji: 'जी', raj: 'राज', ranjan: 'रंजन', bhushan: 'भूषण',
  shankar: 'शंकर', mohan: 'मोहन', anand: 'आनंद', pal: 'पाल', dutt: 'दत्त', dev: 'देव', kanth: 'कांत',
  // given names
  mritunjay: 'मृत्युंजय', mrityunjay: 'मृत्युंजय', mritunjaya: 'मृत्युंजय', suresh: 'सुरेश', ajit: 'अजीत',
  ajeet: 'अजीत', arvind: 'अरविंद', aravind: 'अरविंद', shivshankar: 'शिवशंकर', shiv: 'शिव', shiva: 'शिव',
  ramesh: 'रमेश', mahesh: 'महेश', dinesh: 'दिनेश', rajesh: 'राजेश', rakesh: 'राकेश', mukesh: 'मुकेश',
  umesh: 'उमेश', ganesh: 'गणेश', naresh: 'नरेश', paresh: 'परेश', brajesh: 'ब्रजेश', brijesh: 'बृजेश',
  awadhesh: 'अवधेश', kamlesh: 'कमलेश', kamalesh: 'कमलेश', yogesh: 'योगेश', ritesh: 'रितेश', nitesh: 'नितेश',
  mithilesh: 'मिथिलेश', akhilesh: 'अखिलेश', shailesh: 'शैलेश', dharmendra: 'धर्मेंद्र', jitendra: 'जितेंद्र',
  jitender: 'जितेंद्र', surendra: 'सुरेंद्र', mahendra: 'महेंद्र', rajendra: 'राजेंद्र', narendra: 'नरेंद्र',
  upendra: 'उपेंद्र', devendra: 'देवेंद्र', virendra: 'वीरेंद्र', birendra: 'बीरेंद्र', shailendra: 'शैलेंद्र',
  ravindra: 'रवींद्र', rabindra: 'रवींद्र', nagendra: 'नागेंद्र', gyanendra: 'ज्ञानेंद्र', manoj: 'मनोज',
  sanjay: 'संजय', vijay: 'विजय', bijay: 'विजय', ajay: 'अजय', abhay: 'अभय', uday: 'उदय', akshay: 'अक्षय',
  sunil: 'सुनील', anil: 'अनिल', sushil: 'सुशील', kapil: 'कपिल', nikhil: 'निखिल', amit: 'अमित',
  sumit: 'सुमित', rohit: 'रोहित', mohit: 'मोहित', ankit: 'अंकित', vineet: 'विनीत', puneet: 'पुनीत',
  pankaj: 'पंकज', neeraj: 'नीरज', niraj: 'नीरज', dheeraj: 'धीरज', dhiraj: 'धीरज', saroj: 'सरोज',
  vikash: 'विकास', vikas: 'विकास', bikash: 'विकास', prakash: 'प्रकाश', akash: 'आकाश', aakash: 'आकाश',
  subhash: 'सुभाष', santosh: 'संतोष', ashok: 'अशोक', alok: 'आलोक', vinod: 'विनोद', binod: 'विनोद',
  pramod: 'प्रमोद', manish: 'मनीष', ashish: 'आशीष', ashutosh: 'आशुतोष', satish: 'सतीश', harish: 'हरीश',
  girish: 'गिरीश', jagdish: 'जगदीश', rahul: 'राहुल', ravi: 'रवि', rabi: 'रवि', raju: 'राजू', pappu: 'पप्पू',
  pintu: 'पिंटू', bablu: 'बबलू', guddu: 'गुड्डू', sonu: 'सोनू', monu: 'मोनू', ranjeet: 'रंजीत', ranjit: 'रंजीत',
  sujeet: 'सुजीत', sujit: 'सुजीत', abhishek: 'अभिषेक', vivek: 'विवेक', vishal: 'विशाल', gopal: 'गोपाल',
  kamal: 'कमल', jamal: 'जमाल', nawal: 'नवल', naval: 'नवल', deepak: 'दीपक', dipak: 'दीपक', kaushal: 'कौशल',
  krishna: 'कृष्ण', krishan: 'कृष्ण', kishan: 'किशन', shyam: 'श्याम', ramji: 'रामजी', ramdev: 'रामदेव',
  ramchandra: 'रामचंद्र', ramnath: 'रामनाथ', ramashankar: 'रमाशंकर', ramshankar: 'रामशंकर', hari: 'हरि',
  om: 'ओम', prem: 'प्रेम', rajan: 'राजन', rajiv: 'राजीव', rajeev: 'राजीव', sanjeev: 'संजीव', sanjiv: 'संजीव',
  ranvijay: 'रणविजय', dhananjay: 'धनंजय', nand: 'नंद', nandkishore: 'नंदकिशोर', jay: 'जय', jai: 'जय',
  bhola: 'भोला', bhim: 'भीम', laxman: 'लक्ष्मण', lakshman: 'लक्ष्मण', bharat: 'भरत', shatrughan: 'शत्रुघ्न',
  arun: 'अरुण', varun: 'वरुण', tarun: 'तरुण', karan: 'करण', pawan: 'पवन', pavan: 'पवन', chandan: 'चंदन',
  madan: 'मदन', sudhir: 'सुधीर', sudheer: 'सुधीर', sameer: 'समीर', samir: 'समीर', ranveer: 'रणवीर',
  ranbir: 'रणबीर', satyam: 'सत्यम', shivam: 'शिवम', sundar: 'सुंदर', indra: 'इंद्र', indradev: 'इंद्रदेव',
  kailash: 'कैलाश', lalan: 'ललन', lallan: 'ललन', munna: 'मुन्ना', chhotu: 'छोटू', bijendra: 'बिजेंद्र',
  sita: 'सीता', geeta: 'गीता', gita: 'गीता', rita: 'रीता', reeta: 'रीता', sunita: 'सुनीता', anita: 'अनीता',
  savita: 'सविता', kavita: 'कविता', babita: 'बबीता', rekha: 'रेखा', pooja: 'पूजा', puja: 'पूजा',
  priya: 'प्रिया', neha: 'नेहा', sweta: 'श्वेता', shweta: 'श्वेता', nisha: 'निशा', usha: 'उषा', asha: 'आशा',
  manju: 'मंजू', anju: 'अंजू', sangeeta: 'संगीता', sangita: 'संगीता', mamta: 'ममता', kiran: 'किरण',
  suman: 'सुमन', poonam: 'पूनम', punam: 'पूनम', renu: 'रेनू', meena: 'मीना', mina: 'मीना', radha: 'राधा',
  lakshmi: 'लक्ष्मी', laxmi: 'लक्ष्मी', saraswati: 'सरस्वती', sarita: 'सरिता', jyoti: 'ज्योति', archana: 'अर्चना',
  khushi: 'खुशी', ruby: 'रूबी', rani: 'रानी', shanti: 'शांति', shobha: 'शोभा', sudha: 'सुधा',
  navin: 'नवीन', naveen: 'नवीन', rajnish: 'रजनीश', rajneesh: 'रजनीश', dilip: 'दिलीप', nitish: 'नीतीश',
  bhupendra: 'भूपेंद्र', bittu: 'बिट्टू', avtar: 'अवतार', awtar: 'अवतार', avatar: 'अवतार', bindu: 'बिंदु',
  pradip: 'प्रदीप', sandip: 'संदीप', kuldeep: 'कुलदीप', dilkhush: 'दिलखुश', nagina: 'नगीना', jagdev: 'जगदेव',
  jagannath: 'जगन्नाथ', shatrughna: 'शत्रुघ्न', rambabu: 'रामबाबू', lalbabu: 'लालबाबू', ramavtar: 'रामावतार',
  ramanand: 'रामानंद', bhagwan: 'भगवान', amar: 'अमर', gyan: 'ज्ञान', chhote: 'छोटे', uma: 'उमा', dharm: 'धर्म', dharam: 'धर्म',
  veer: 'वीर', vir: 'वीर', bir: 'बीर', pujan: 'पूजन', poojan: 'पूजन', balak: 'बालक', mantu: 'मंटू', sant: 'संत', shivnath: 'शिवनाथ', shivkumar: 'शिवकुमार', ramkumar: 'रामकुमार', rajkumar: 'राजकुमार',
}

// Single initials, e.g. "R K Singh" → "आर. के. सिंह"
const LETTERS = {
  a: 'ए', b: 'बी', c: 'सी', d: 'डी', e: 'ई', f: 'एफ़', g: 'जी', h: 'एच', i: 'आई', j: 'जे', k: 'के', l: 'एल',
  m: 'एम', n: 'एन', o: 'ओ', p: 'पी', q: 'क्यू', r: 'आर', s: 'एस', t: 'टी', u: 'यू', v: 'वी', w: 'डब्ल्यू',
  x: 'एक्स', y: 'वाई', z: 'ज़ेड',
}

const CONSONANTS = [
  ['ksh', 'क्ष'], ['chh', 'छ'], ['tt', 'ट्ट'], ['dd', 'ड्ड'], ['kh', 'ख'], ['gh', 'घ'], ['ch', 'च'], ['jh', 'झ'], ['th', 'थ'], ['dh', 'ध'],
  ['ph', 'फ'], ['bh', 'भ'], ['sh', 'श'], ['k', 'क'], ['g', 'ग'], ['c', 'क'], ['j', 'ज'], ['t', 'त'],
  ['d', 'द'], ['n', 'न'], ['p', 'प'], ['f', 'फ़'], ['b', 'ब'], ['m', 'म'], ['y', 'य'], ['r', 'र'], ['l', 'ल'],
  ['v', 'व'], ['w', 'व'], ['s', 'स'], ['h', 'ह'], ['z', 'ज़'], ['x', 'क्स'], ['q', 'क'],
]
const VOWELS = [
  ['aa', 'आ', 'ा'], ['ai', 'ऐ', 'ै'], ['au', 'औ', 'ौ'], ['ee', 'ई', 'ी'], ['ii', 'ई', 'ी'], ['oo', 'ऊ', 'ू'],
  ['uu', 'ऊ', 'ू'], ['a', 'अ', ''], ['e', 'ए', 'े'], ['i', 'इ', 'ि'], ['o', 'ओ', 'ो'], ['u', 'उ', 'ु'],
]

function tokenize(word) {
  const tokens = []
  let i = 0
  outer: while (i < word.length) {
    for (const [r, d, m] of VOWELS) {
      if (word.startsWith(r, i)) {
        tokens.push({ type: 'v', roman: r, full: d, matra: m })
        i += r.length
        continue outer
      }
    }
    for (const [r, d] of CONSONANTS) {
      if (word.startsWith(r, i)) {
        tokens.push({ type: 'c', roman: r, dev: d })
        i += r.length
        continue outer
      }
    }
    tokens.push({ type: 'x', dev: word[i] })
    i += 1
  }
  return tokens
}

// Phonetic fallback for Roman-letter words that aren't in the word list.
function transliterate(word) {
  const t = tokenize(word)
  let out = ''
  for (let i = 0; i < t.length; i++) {
    const tok = t[i]
    const next = t[i + 1]
    const prev = t[i - 1]
    const isLast = i === t.length - 1
    if (tok.type === 'x') {
      out += tok.dev
    } else if (tok.type === 'v') {
      if (!prev || prev.type !== 'c') {
        out += tok.full
      } else if (isLast && tok.roman === 'a') {
        // Sunita → सुनीता, but a consonant cluster keeps the short a:
        // Rajendra → राजेंद्र, Shatrughna → शत्रुघ्न
        const cluster = t[i - 2] && t[i - 2].type === 'c'
        out += cluster ? '' : 'ा'
      } else if (isLast && tok.roman === 'i') {
        out += 'ी' // Devi → देवी
      } else if (isLast && tok.roman === 'u') {
        out += 'ू' // Raju → राजू
      } else {
        out += tok.matra
      }
    } else {
      const nasal =
        (tok.roman === 'n' || tok.roman === 'm') &&
        prev && prev.type === 'v' &&
        next && next.type === 'c' && !['y', 'r', 'h', 'v', 'w'].includes(next.roman)
      if (nasal) {
        out += 'ं' // Arvind → अरविंद
      } else {
        out += tok.dev
        if (next && next.type === 'c') out += '्'
      }
    }
  }
  return out
}

function nameWord(raw) {
  if (!raw || DEVANAGARI.test(raw)) return raw
  const lower = raw.toLowerCase()
  if (NAME_WORDS[lower]) return NAME_WORDS[lower]
  const bare = lower.replace(/\.+$/, '')
  if (NAME_WORDS[bare]) return NAME_WORDS[bare]
  if (/^[a-z]$/.test(bare)) return LETTERS[bare] + '.'
  if (!/^[a-z]+$/.test(bare)) return raw
  // Compound names made of two known words: Lalbabu → लाल + बाबू
  const known = (s) => (s.length >= 2 && NAME_WORDS[s] && !NAME_WORDS[s].endsWith('.') ? NAME_WORDS[s] : null)
  // The second part must start with a consonant, or the join reads wrong (राम + अन).
  const startsHard = (s) => /^[^aeiou]/.test(s)
  for (let i = 2; i <= bare.length - 2; i++) {
    const a = known(bare.slice(0, i))
    const b = known(bare.slice(i))
    if (a && b && startsHard(bare.slice(i))) return a + b
  }
  // One known part, the other spelled out: Shivpujan → शिव + पूजन
  for (let i = bare.length - 3; i >= 3; i--) {
    const a = known(bare.slice(0, i))
    if (a && startsHard(bare.slice(i))) return a + transliterate(bare.slice(i))
  }
  for (let i = 3; i <= bare.length - 3; i++) {
    const b = known(bare.slice(i))
    if (b && startsHard(bare.slice(i))) return transliterate(bare.slice(0, i)) + b
  }
  return transliterate(bare)
}

export function nameToHindi(name) {
  if (!name || DEVANAGARI.test(name)) return name
  return name.trim().split(/\s+/).map(nameWord).join(' ')
}

const OCCUPATION_PHRASES = {
  'government service': 'सरकारी सेवा',
  'govt service': 'सरकारी सेवा',
  'government job': 'सरकारी नौकरी',
  'govt job': 'सरकारी नौकरी',
  'private job': 'प्राइवेट नौकरी',
  'private service': 'प्राइवेट नौकरी',
  'social worker': 'समाजसेवी',
  'social work': 'समाजसेवा',
  'self employed': 'स्वरोज़गार',
  'self-employed': 'स्वरोज़गार',
  'house wife': 'गृहिणी',
  'medical representative': 'मेडिकल रिप्रेज़ेंटेटिव',
  'it professional': 'आईटी पेशेवर',
  'software engineer': 'सॉफ़्टवेयर इंजीनियर',
  'civil engineer': 'सिविल इंजीनियर',
}

const OCCUPATION_WORDS = {
  government: 'सरकारी', govt: 'सरकारी', gov: 'सरकारी', service: 'सेवा', teacher: 'शिक्षक', teaching: 'शिक्षण',
  doctor: 'डॉक्टर', dr: 'डॉक्टर', surgeon: 'सर्जन', surgern: 'सर्जन', sergeon: 'सर्जन', engineer: 'इंजीनियर',
  farmer: 'किसान', farming: 'खेती', agriculture: 'खेती', kisan: 'किसान', business: 'व्यवसाय',
  businessman: 'व्यवसायी', student: 'विद्यार्थी', advocate: 'अधिवक्ता', lawyer: 'वकील', police: 'पुलिस',
  army: 'सेना', retired: 'सेवानिवृत्त', private: 'प्राइवेट', job: 'नौकरी', bank: 'बैंक', banker: 'बैंककर्मी',
  professor: 'प्रोफ़ेसर', lecturer: 'व्याख्याता', contractor: 'ठेकेदार', shopkeeper: 'दुकानदार',
  shop: 'दुकान', social: 'सामाजिक', worker: 'कार्यकर्ता', housewife: 'गृहिणी', homemaker: 'गृहिणी',
  nurse: 'नर्स', pharmacist: 'फ़ार्मासिस्ट', clerk: 'लिपिक', officer: 'अधिकारी', manager: 'प्रबंधक',
  accountant: 'लेखाकार', driver: 'चालक', labour: 'मज़दूर', labor: 'मज़दूर', it: 'आईटी', software: 'सॉफ़्टवेयर',
  principal: 'प्रधानाचार्य', headmaster: 'प्रधानाध्यापक', railway: 'रेलवे', mukhiya: 'मुखिया',
  politician: 'राजनेता', journalist: 'पत्रकार', medical: 'चिकित्सा', health: 'स्वास्थ्य',
  tutor: 'ट्यूटर', coaching: 'कोचिंग', trader: 'व्यापारी', merchant: 'व्यापारी', ca: 'सीए', cs: 'सीएस',
  ias: 'आईएएस', ips: 'आईपीएस', jawan: 'जवान', soldier: 'सैनिक', sarpanch: 'सरपंच', pastor: 'पादरी',
  and: 'और', '&': 'और', '/': '/', '-': '-', ',': ',',
}

// Occupations: matched phrase-by-phrase (up to 4 words), per comma-
// separated part. If any word of a part is unknown, that part is shown
// exactly as entered rather than half-translated.
const OCCUPATION_MORE = {
  'ex service man': 'पूर्व सैनिक', 'ex serviceman': 'पूर्व सैनिक', 'ex-serviceman': 'पूर्व सैनिक',
  'ex army': 'पूर्व सैनिक', 'retired army': 'सेवानिवृत्त सैनिक', 'air force': 'वायु सेना', airforce: 'वायु सेना',
  navy: 'नौसेना', 'health department': 'स्वास्थ्य विभाग', 'education department': 'शिक्षा विभाग',
  department: 'विभाग', dept: 'विभाग', education: 'शिक्षा', ex: 'पूर्व', 'head master': 'प्रधानाध्यापक',
  'head teacher': 'प्रधानाध्यापक', hardware: 'हार्डवेयर', plastic: 'प्लास्टिक', 'pediatric doctor': 'शिशु रोग विशेषज्ञ',
  'paediatric doctor': 'शिशु रोग विशेषज्ञ', pediatrician: 'शिशु रोग विशेषज्ञ', pediatric: 'शिशु रोग',
  paediatric: 'शिशु रोग', laparoscopy: 'लेप्रोस्कोपिक', laparoscopic: 'लेप्रोस्कोपिक', specialist: 'विशेषज्ञ',
  physician: 'फ़िज़िशियन', dentist: 'दंत चिकित्सक', dental: 'दंत', 'dental surgeon': 'दंत सर्जन',
  orthopedic: 'हड्डी रोग', orthopaedic: 'हड्डी रोग', gynecologist: 'स्त्री रोग विशेषज्ञ', gynaecologist: 'स्त्री रोग विशेषज्ञ',
  'general surgeon': 'जनरल सर्जन', 'block office': 'प्रखंड कार्यालय', bdo: 'बीडीओ', co: 'सीओ', sdo: 'एसडीओ',
  inspector: 'इंस्पेक्टर', constable: 'सिपाही', 'sub inspector': 'सब-इंस्पेक्टर', rail: 'रेल', post: 'डाक',
  'post office': 'डाकघर', hospital: 'अस्पताल', school: 'विद्यालय', college: 'कॉलेज', university: 'विश्वविद्यालय',
  owner: 'मालिक', clinic: 'क्लिनिक', medicine: 'दवा', electrical: 'इलेक्ट्रिकल', electronics: 'इलेक्ट्रॉनिक्स',
  cloth: 'कपड़ा', 'cloth business': 'कपड़ा व्यवसाय', grocery: 'किराना', 'real estate': 'रियल एस्टेट',
  builder: 'बिल्डर', transport: 'परिवहन', 'insurance agent': 'बीमा एजेंट', agent: 'एजेंट', insurance: 'बीमा',
}

function occupationPart(part) {
  const words = part.toLowerCase().replace(/\./g, '').split(/\s+/).filter(Boolean)
  const lookup = (k) => OCCUPATION_PHRASES[k] ?? OCCUPATION_MORE[k] ?? OCCUPATION_WORDS[k]
  const out = []
  let i = 0
  while (i < words.length) {
    let hit = null
    for (let n = Math.min(4, words.length - i); n >= 1; n--) {
      const v = lookup(words.slice(i, i + n).join(' '))
      if (v !== undefined) {
        hit = [v, n]
        break
      }
    }
    if (!hit) return part.trim() // unknown word: keep this part as entered
    out.push(hit[0])
    i += hit[1]
  }
  return out.join(' ')
}

export function occupationToHindi(text) {
  if (!text || DEVANAGARI.test(text)) return text
  return text
    .split(/\s*,\s*/)
    .filter(Boolean)
    .map((part) =>
      part
        .split(/\s*([/&])\s*/)
        .map((p) => (p === '/' ? '/' : p === '&' ? ' और ' : occupationPart(p)))
        .join('')
    )
    .join(', ')
}

const DESIGNATIONS = {
  president: 'अध्यक्ष', adhyaksh: 'अध्यक्ष', adhyaksha: 'अध्यक्ष', chairman: 'अध्यक्ष',
  'vice president': 'उपाध्यक्ष', 'vice-president': 'उपाध्यक्ष', 'up adhyaksh': 'उपाध्यक्ष', 'up-adhyaksh': 'उपाध्यक्ष',
  upadhyaksh: 'उपाध्यक्ष', secretary: 'सचिव', sachiv: 'सचिव', 'general secretary': 'महासचिव',
  'gen secretary': 'महासचिव', 'mahasachiv': 'महासचिव', 'joint secretary': 'संयुक्त सचिव',
  'organizing secretary': 'संगठन सचिव', 'organising secretary': 'संगठन सचिव', 'assistant secretary': 'सहायक सचिव',
  treasurer: 'कोषाध्यक्ष', koshadhyaksh: 'कोषाध्यक्ष', 'kosha adhyaksh': 'कोषाध्यक्ष', 'kosha-adhyaksh': 'कोषाध्यक्ष',
  'kosh adhyaksh': 'कोषाध्यक्ष', 'executive member': 'कार्यकारिणी सदस्य', 'executive committee member': 'कार्यकारिणी सदस्य',
  member: 'सदस्य', patron: 'संरक्षक', sanrakshak: 'संरक्षक', advisor: 'सलाहकार', adviser: 'सलाहकार',
  'chief advisor': 'मुख्य सलाहकार', spokesperson: 'प्रवक्ता', 'media incharge': 'मीडिया प्रभारी',
  'media in-charge': 'मीडिया प्रभारी', auditor: 'अंकेक्षक', founder: 'संस्थापक', 'founder member': 'संस्थापक सदस्य',
}

// Committee designations are typed freely in the admin panel; show the
// Hindi title when it's a known one ("Treasurer", "Kosha-Adhyaksh
// (Treasurer)"), otherwise leave the text as entered.
export function designationToHindi(text) {
  if (!text || DEVANAGARI.test(text)) return text
  const clean = (s) => s.toLowerCase().replace(/\./g, '').replace(/\s+/g, ' ').trim()
  const whole = DESIGNATIONS[clean(text)]
  if (whole) return whole
  const parts = text.split(/[()/,]/).map(clean).filter(Boolean)
  for (const p of parts) if (DESIGNATIONS[p]) return DESIGNATIONS[p]
  return text
}

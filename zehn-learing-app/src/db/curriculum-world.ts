import type { LessonSeed, Slide, QuizQuestion } from "./curriculum";

export type CountrySeed = {
  code: string;
  name: string;
  flag: string;
  chapters: {
    title: string;
    band: LessonSeed["band"];
    level: "easy" | "normal" | "hard";
    minutes: number;
    intro: string;
    slides: Slide[];
    quiz: QuizQuestion[];
  }[];
};

/** Country history libraries — students pick a country and continue chapter by chapter. */
export const COUNTRIES: CountrySeed[] = [
  {
    code: "PK", name: "Pakistan", flag: "🇵🇰",
    chapters: [
      {
        title: "Indus Valley to the Mughals", band: "middle", level: "easy", minutes: 5,
        intro: "From the world's first planned cities to the empire of the Mughals.",
        slides: [
          { heading: "Cities of brick and order", body: "Over 4,500 years ago Mohenjo-daro and Harappa stood on the Indus. They had grid streets, covered drains, public baths and standard weights — planning the world would not match again for millennia.", simple: "Mohenjo-daro had planned streets and drains 4,500 years ago.", visual: { kind: "bullets", items: ["Grid streets", "Covered drains", "Great Bath", "Standard weights"] } },
          { heading: "Gandhara and the crossroads", body: "Taxila became a centre of learning where Greek, Persian and Buddhist worlds met. Gandhara sculpture blended Greek realism with Buddhist calm — proof that trade carries ideas, not just goods.", simple: "Taxila was a famous learning city where many cultures met.", visual: { kind: "icon", icon: "Landmark" } },
          { heading: "The Mughal age", body: "From 1526 the Mughals ruled much of South Asia. Akbar built an administration of talent, Shah Jahan left the Badshahi mosque and Lahore Fort traditions, and Persian art fused with local craft.", simple: "Mughals ruled from 1526 and built great forts and mosques.", visual: { kind: "cycle", icons: ["Landmark", "Building2", "ScrollText", "Star"] } },
        ],
        quiz: [
          { q: "Mohenjo-daro is famous for its…", options: ["Planned drainage", "Steel towers", "Glass domes"], a: 0 },
          { q: "Taxila was known as a centre of…", options: ["Learning", "Shipbuilding", "Mining"], a: 0 },
          { q: "The Mughal era began around…", options: ["1526", "1857", "1947"], a: 0 },
        ],
      },
      {
        title: "Independence and Modern Pakistan", band: "high", level: "normal", minutes: 6,
        intro: "The Pakistan Movement, 1947, and the building of a new nation.",
        slides: [
          { heading: "The idea takes shape", body: "Sir Syed Ahmad Khan urged modern education; Allama Iqbal gave the vision philosophical form in 1930; the Lahore Resolution of 1940 made it a formal demand for separate states for Muslim-majority regions.", simple: "Iqbal gave the vision; the 1940 Lahore Resolution made it a demand.", visual: { kind: "steps", items: ["Sir Syed — education", "Iqbal 1930 — vision", "Lahore Resolution 1940", "Independence 1947"] } },
          { heading: "14 August 1947", body: "Pakistan came into being on 14 August 1947 with Muhammad Ali Jinnah as Governor-General. Partition brought one of the largest migrations in human history and enormous human cost.", simple: "Pakistan was created on 14 August 1947 under Jinnah.", visual: { kind: "big", value: "1947", label: "independence and partition" } },
          { heading: "Building a nation", body: "The new state faced refugee resettlement, a weak treasury and institution-building from scratch. Later decades brought the 1973 constitution, major dams and canals, and a fast-growing young population that remains its biggest asset.", simple: "Pakistan built institutions, dams and a constitution after 1947.", visual: { kind: "bullets", items: ["1973 constitution", "Irrigation and dams", "Young population", "Growing cities"] } },
        ],
        quiz: [
          { q: "The Lahore Resolution was passed in…", options: ["1930", "1940", "1947"], a: 1 },
          { q: "Pakistan's first Governor-General was…", options: ["Iqbal", "Jinnah", "Liaquat Ali Khan"], a: 1 },
          { q: "Pakistan's current constitution dates from…", options: ["1956", "1962", "1973"], a: 2 },
        ],
      },
    ],
  },
  {
    code: "IN", name: "India", flag: "🇮🇳",
    chapters: [
      {
        title: "Ancient Empires of India", band: "middle", level: "easy", minutes: 5,
        intro: "Mauryas, Guptas and the golden age of mathematics.",
        slides: [
          { heading: "The Mauryan reach", body: "Chandragupta Maurya united much of the subcontinent around 321 BCE. His grandson Ashoka, after the bloody Kalinga war, turned to non-violence and carved edicts on pillars across the land.", simple: "Ashoka chose peace after the Kalinga war and wrote edicts on pillars.", visual: { kind: "icon", icon: "Landmark" } },
          { heading: "The Gupta golden age", body: "Under the Guptas, Aryabhata calculated pi and proposed that Earth rotates; the decimal place-value system with zero matured and later travelled through the Arab world to Europe.", simple: "Gupta scholars advanced zero, decimals and astronomy.", visual: { kind: "big", value: "0", label: "zero changed mathematics forever" } },
          { heading: "Trade and learning", body: "Nalanda drew students from across Asia. Spices, cotton and ideas moved along sea and land routes, making the region one of the ancient world's great economies.", simple: "Nalanda taught students from across Asia.", visual: { kind: "bullets", items: ["Nalanda university", "Spice and cotton trade", "Sanskrit literature", "Temple architecture"] } },
        ],
        quiz: [
          { q: "Ashoka turned to non-violence after the war of…", options: ["Kalinga", "Panipat", "Plassey"], a: 0 },
          { q: "Aryabhata was famous for work in…", options: ["Astronomy and maths", "Shipbuilding", "Painting"], a: 0 },
          { q: "Nalanda was a famous…", options: ["Fort", "University", "Harbour"], a: 1 },
        ],
      },
      {
        title: "Colonial Rule to Republic", band: "high", level: "normal", minutes: 5,
        intro: "The East India Company, the freedom struggle and 1947.",
        slides: [
          { heading: "A company becomes a ruler", body: "The East India Company arrived to trade and ended up governing, using local rivalries and superior artillery. After the uprising of 1857 the British Crown took direct control.", simple: "A trading company became a ruler; the Crown took over in 1858.", visual: { kind: "steps", items: ["Trade posts", "Plassey 1757", "Uprising 1857", "Crown rule 1858"] } },
          { heading: "The freedom movement", body: "The Indian National Congress, Gandhi's satyagraha, the Salt March and mass civil disobedience built pressure that military force could not easily answer.", simple: "Gandhi's non-violent movement pressured British rule.", visual: { kind: "icon", icon: "Footprints" } },
          { heading: "Independence and after", body: "Independence came in August 1947 alongside partition. India adopted its constitution in 1950, becoming a republic with universal adult franchise from the very first election.", simple: "India became independent in 1947 and a republic in 1950.", visual: { kind: "big", value: "1950", label: "the constitution comes into force" } },
        ],
        quiz: [
          { q: "Crown rule began after the uprising of…", options: ["1757", "1857", "1947"], a: 1 },
          { q: "The Salt March was led by…", options: ["Gandhi", "Nehru", "Bose"], a: 0 },
          { q: "India's constitution came into force in…", options: ["1947", "1950", "1952"], a: 1 },
        ],
      },
    ],
  },
  {
    code: "TR", name: "Türkiye", flag: "🇹🇷",
    chapters: [
      {
        title: "Anatolia and the Ottomans", band: "middle", level: "normal", minutes: 5,
        intro: "Crossroads of continents, from Byzantium to a vast empire.",
        slides: [
          { heading: "Where continents meet", body: "Anatolia has hosted Hittites, Greeks, Romans and Byzantines. Istanbul is the only major city standing on two continents, guarding the straits between the Black Sea and the Mediterranean.", simple: "Istanbul sits on two continents and guards key sea routes.", visual: { kind: "icon", icon: "Map" } },
          { heading: "1453 and a new capital", body: "The Ottomans took Constantinople in 1453 using enormous cannon. The city became Istanbul, capital of an empire spanning three continents for centuries.", simple: "Ottomans captured Constantinople in 1453.", visual: { kind: "big", value: "1453", label: "a turning point in world history" } },
          { heading: "Science, trade and tiles", body: "Ottoman engineers like Sinan perfected domes; Iznik tiles, coffee houses and caravanserais shaped culture far beyond the empire's borders.", simple: "Ottoman architects, tiles and coffee shaped world culture.", visual: { kind: "bullets", items: ["Sinan's domes", "Iznik tiles", "Coffee houses", "Silk Road trade"] } },
        ],
        quiz: [
          { q: "Constantinople fell to the Ottomans in…", options: ["1453", "1517", "1683"], a: 0 },
          { q: "Which city spans two continents?", options: ["Ankara", "Istanbul", "Izmir"], a: 1 },
          { q: "Sinan was a famous Ottoman…", options: ["Architect", "Admiral", "Poet"], a: 0 },
        ],
      },
    ],
  },
  {
    code: "EG", name: "Egypt", flag: "🇪🇬",
    chapters: [
      {
        title: "Pharaohs, Pyramids and the Nile", band: "middle", level: "easy", minutes: 5,
        intro: "How one river built a civilisation that lasted 3,000 years.",
        slides: [
          { heading: "The gift of the Nile", body: "Each year the Nile flooded and left rich black silt. Predictable farming meant surplus food, which meant cities, priests, scribes and monuments.", simple: "The Nile's flood made farming rich, which built cities.", visual: { kind: "cycle", icons: ["Waves", "Sprout", "Landmark", "ScrollText"] } },
          { heading: "Building the impossible", body: "The Great Pyramid of Giza used about 2.3 million stone blocks and stayed the tallest human structure for 3,800 years — built with ramps, copper tools, water levelling and brilliant organisation.", simple: "The Great Pyramid stayed the tallest building for 3,800 years.", visual: { kind: "big", value: "2.3M", label: "stone blocks in one pyramid" } },
          { heading: "Writing and memory", body: "Hieroglyphs recorded laws, prayers and accounts. The Rosetta Stone, with the same text in three scripts, let modern scholars finally read them again in the 1820s.", simple: "The Rosetta Stone helped us read hieroglyphs again.", visual: { kind: "icon", icon: "ScrollText" } },
        ],
        quiz: [
          { q: "Egyptian farming depended on the…", options: ["Nile flood", "Monsoon", "Snowmelt"], a: 0 },
          { q: "The Rosetta Stone helped decode…", options: ["Hieroglyphs", "Latin", "Cuneiform"], a: 0 },
          { q: "The Great Pyramid is at…", options: ["Luxor", "Giza", "Aswan"], a: 1 },
        ],
      },
    ],
  },
  {
    code: "CN", name: "China", flag: "🇨🇳",
    chapters: [
      {
        title: "Dynasties and Four Inventions", band: "middle", level: "normal", minutes: 5,
        intro: "Paper, printing, gunpowder and the compass — and the roads that spread them.",
        slides: [
          { heading: "One long thread", body: "Chinese civilisation runs continuously for over 3,000 years through dynasties — Shang, Han, Tang, Song, Ming and Qing — each adding to a shared written language and bureaucracy.", simple: "China's dynasties kept one continuous culture for 3,000 years.", visual: { kind: "steps", items: ["Shang", "Han", "Tang & Song", "Ming & Qing"] } },
          { heading: "The four great inventions", body: "Paper made records cheap, printing made books common, the compass made ocean navigation safe, and gunpowder changed warfare. Each reshaped the whole world.", simple: "Paper, printing, compass and gunpowder came from China.", visual: { kind: "bullets", items: ["Paper", "Printing", "Compass", "Gunpowder"] } },
          { heading: "Silk Road exchange", body: "Caravans carried silk west and brought back glass, horses and ideas. Zheng He's fleets later reached Africa decades before European voyages of the same scale.", simple: "The Silk Road traded goods and ideas across Asia.", visual: { kind: "icon", icon: "Map" } },
        ],
        quiz: [
          { q: "Which is NOT one of China's four great inventions?", options: ["Compass", "Telescope", "Gunpowder"], a: 1 },
          { q: "Zheng He was famous for…", options: ["Sea voyages", "Painting", "Law"], a: 0 },
          { q: "The Silk Road mainly carried…", options: ["Trade and ideas", "Only soldiers", "Only food"], a: 0 },
        ],
      },
    ],
  },
  {
    code: "GB", name: "United Kingdom", flag: "🇬🇧",
    chapters: [
      {
        title: "Magna Carta to Industry", band: "high", level: "normal", minutes: 5,
        intro: "Limits on kings, steam engines and the first industrial society.",
        slides: [
          { heading: "Limiting the crown", body: "Magna Carta in 1215 forced a king to accept that he too was under law. Over centuries that seed grew into parliament, courts and constitutional government.", simple: "Magna Carta (1215) put the king under the law.", visual: { kind: "big", value: "1215", label: "Magna Carta signed" } },
          { heading: "The Industrial Revolution", body: "From the 1760s steam power, coal, iron and factories transformed Britain from farms to cities. Railways compressed distance and the modern working day was born.", simple: "Steam, coal and factories changed life from the 1760s.", visual: { kind: "cycle", icons: ["Factory", "Flame", "Cpu", "Building2"] } },
          { heading: "Cost and consequence", body: "Industry brought wealth, empire and invention — and also child labour, pollution and colonial exploitation. Reform movements, unions and widening suffrage slowly answered those harms.", simple: "Industry brought wealth but also hardship and reform.", visual: { kind: "bullets", items: ["Factory reform", "Trade unions", "Wider voting rights", "Public health laws"] } },
        ],
        quiz: [
          { q: "Magna Carta was sealed in…", options: ["1066", "1215", "1485"], a: 1 },
          { q: "The Industrial Revolution was powered mainly by…", options: ["Steam and coal", "Solar panels", "Windmills only"], a: 0 },
          { q: "One social response to industrial harm was…", options: ["Trade unions", "Feudalism", "Serfdom"], a: 0 },
        ],
      },
    ],
  },
  {
    code: "US", name: "United States", flag: "🇺🇸",
    chapters: [
      {
        title: "Founding, Union and Rights", band: "high", level: "normal", minutes: 5,
        intro: "Independence, civil war and the long march for civil rights.",
        slides: [
          { heading: "A republic is declared", body: "Thirteen colonies declared independence in 1776 and later wrote a constitution dividing power between legislature, executive and judiciary — a design copied worldwide.", simple: "The USA declared independence in 1776 and split power three ways.", visual: { kind: "steps", items: ["1776 Declaration", "1787 Constitution", "Bill of Rights", "Federal republic"] } },
          { heading: "Civil war and union", body: "Slavery split the nation. The Civil War (1861–65) ended it legally through the 13th Amendment, but equality in practice remained unfinished work.", simple: "The Civil War ended slavery but not inequality.", visual: { kind: "big", value: "1865", label: "slavery abolished by amendment" } },
          { heading: "Civil rights", body: "A century later, Rosa Parks, Martin Luther King Jr and millions of ordinary people used boycotts, marches and courts to win the Civil Rights Act of 1964 and voting protections in 1965.", simple: "The civil rights movement won major laws in 1964 and 1965.", visual: { kind: "icon", icon: "Footprints" } },
        ],
        quiz: [
          { q: "US independence was declared in…", options: ["1776", "1789", "1812"], a: 0 },
          { q: "Slavery was abolished by the…", options: ["13th Amendment", "1st Amendment", "Bill of Sale"], a: 0 },
          { q: "The Civil Rights Act was passed in…", options: ["1954", "1964", "1974"], a: 1 },
        ],
      },
    ],
  },
  {
    code: "JP", name: "Japan", flag: "🇯🇵",
    chapters: [
      {
        title: "Samurai, Isolation and Rebirth", band: "high", level: "hard", minutes: 5,
        intro: "From shoguns to one of the fastest modernisations in history.",
        slides: [
          { heading: "The age of the shogun", body: "For centuries real power lay with shoguns and samurai while the emperor remained a symbol. The Edo period brought 250 years of internal peace, cities, theatre and woodblock art.", simple: "Shoguns ruled; the Edo period brought long peace and art.", visual: { kind: "icon", icon: "Landmark" } },
          { heading: "Closed doors", body: "Japan limited foreign contact for over two centuries. That isolation preserved culture but left the country technologically behind when foreign fleets arrived in 1853.", simple: "Japan stayed closed for 200 years, then faced modern fleets.", visual: { kind: "big", value: "1853", label: "the doors are forced open" } },
          { heading: "The Meiji leap", body: "After 1868 Japan deliberately studied the world — railways, schools, industry and law — and modernised in a single generation, later rebuilding again after 1945 into a technology leader.", simple: "After 1868 Japan modernised extremely fast.", visual: { kind: "cycle", icons: ["ScrollText", "Factory", "Cpu", "TrendingUp"] } },
        ],
        quiz: [
          { q: "Real power in old Japan belonged to the…", options: ["Shogun", "Pope", "Senate"], a: 0 },
          { q: "Japan's rapid modernisation began after…", options: ["1868", "1905", "1945"], a: 0 },
          { q: "The Edo period is known for…", options: ["Long internal peace", "Constant civil war", "Foreign conquest"], a: 0 },
        ],
      },
    ],
  },
];

/** Pakistan-specific school subjects. */
export const PAK_SUBJECTS: LessonSeed[] = [
  {
    band: "primary", subject: "Urdu", level: "easy", orderIndex: 9, title: "Urdu Huroof aur Alfaaz",
    icon: "Type", color: "mint", minutes: 4,
    intro: "Urdu letters, joining shapes and your first simple words.",
    slides: [
      { heading: "Urdu is written right to left", body: "Urdu uses the Nastaliq script and flows from right to left. Letters change shape depending on where they sit in a word — beginning, middle or end.", simple: "Urdu is written right to left and letters change shape.", visual: { kind: "icon", icon: "Type" } },
      { heading: "Alif, Bay, Pay", body: "The alphabet begins ا ب پ ت. Each letter has a sound: alif like 'a', bay like 'b', pay like 'p'. Say them aloud with the narrator.", simple: "ا ب پ ت are the first Urdu letters.", visual: { kind: "steps", items: ["ا — alif", "ب — bay", "پ — pay", "ت — tay"] } },
      { heading: "Your first words", body: "Join letters and meaning appears: آب (water), باب (door), کتاب (book). Reading starts the moment letters hold hands.", simple: "آب, باب and کتاب are easy first words.", visual: { kind: "bullets", items: ["آب — water", "باب — door", "کتاب — book", "ماں — mother"] } },
    ],
    quiz: [
      { q: "Urdu is written…", options: ["Right to left", "Left to right", "Top to bottom"], a: 0 },
      { q: "کتاب means…", options: ["Book", "Water", "Door"], a: 0 },
      { q: "Urdu uses which script style?", options: ["Nastaliq", "Gothic", "Roman"], a: 0 },
    ],
  },
  {
    band: "primary", subject: "Islamiat", level: "easy", orderIndex: 10, title: "Good Manners in Islam",
    icon: "Heart", color: "mint", minutes: 4,
    intro: "Honesty, kindness and respect — the everyday character lessons.",
    slides: [
      { heading: "Character first", body: "Islamic teaching places akhlaq — good character — at the centre. Truthfulness, kindness to parents and keeping promises are treated as daily acts of worship.", simple: "Good character and honesty matter every day.", visual: { kind: "icon", icon: "Heart" } },
      { heading: "Kindness to all", body: "Kindness extends to neighbours, guests, animals and the environment. Wasting water or harming an animal are discouraged even in small daily choices.", simple: "Be kind to people, animals and nature.", visual: { kind: "bullets", items: ["Respect parents", "Help neighbours", "Be kind to animals", "Do not waste water"] } },
      { heading: "Learning is worship", body: "Seeking knowledge is strongly encouraged for every person. Asking questions, studying carefully and sharing what you learn are all valued.", simple: "Seeking knowledge is highly encouraged.", visual: { kind: "icon", icon: "BookOpen" } },
    ],
    quiz: [
      { q: "Akhlaq means…", options: ["Good character", "Fast running", "Loud speaking"], a: 0 },
      { q: "Kindness should be shown to…", options: ["Only friends", "People and animals", "Nobody"], a: 1 },
      { q: "Seeking knowledge is…", options: ["Discouraged", "Encouraged", "Optional for adults only"], a: 1 },
    ],
  },
  {
    band: "middle", subject: "PakStudies", level: "normal", orderIndex: 11, title: "Geography of Pakistan",
    icon: "Map", color: "sky", minutes: 5,
    intro: "Mountains, rivers, deserts and coast — the land in one lesson.",
    slides: [
      { heading: "Four provinces and more", body: "Pakistan has Punjab, Sindh, Khyber Pakhtunkhwa and Balochistan, plus Gilgit-Baltistan, Azad Kashmir and the federal capital Islamabad.", simple: "Pakistan has four provinces plus special regions.", visual: { kind: "bullets", items: ["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan"] } },
      { heading: "Roof of the world", body: "Three great ranges meet here — Himalaya, Karakoram and Hindu Kush. K2, the second highest mountain on Earth at 8,611 m, stands in the Karakoram.", simple: "K2 is the world's second highest mountain, at 8,611 m.", visual: { kind: "big", value: "8,611 m", label: "K2 — second highest on Earth" } },
      { heading: "The Indus lifeline", body: "The Indus and its tributaries irrigate one of the largest canal systems on the planet, feeding Punjab's farmland before reaching the Arabian Sea near Karachi.", simple: "The Indus river feeds a huge canal irrigation system.", visual: { kind: "cycle", icons: ["Waves", "Sprout", "Sun", "Map"] } },
    ],
    quiz: [
      { q: "How many provinces does Pakistan have?", options: ["Three", "Four", "Six"], a: 1 },
      { q: "K2 belongs to which range?", options: ["Karakoram", "Alps", "Andes"], a: 0 },
      { q: "Pakistan's main river is the…", options: ["Indus", "Nile", "Amazon"], a: 0 },
    ],
  },
];

/** Converts country chapters into standard lesson seeds. */
export function countryLessons(): (LessonSeed & { country: string })[] {
  const out: (LessonSeed & { country: string })[] = [];
  COUNTRIES.forEach((country) => {
    country.chapters.forEach((chapter, index) => {
      out.push({
        country: country.code,
        band: chapter.band,
        subject: "WorldHistory",
        level: chapter.level,
        orderIndex: index + 1,
        title: `${country.flag} ${country.name}: ${chapter.title}`,
        icon: "Landmark",
        color: index % 2 === 0 ? "amber" : "sky",
        minutes: chapter.minutes,
        intro: chapter.intro,
        slides: chapter.slides,
        quiz: chapter.quiz,
      });
    });
  });
  return out;
}

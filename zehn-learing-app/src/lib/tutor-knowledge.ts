/** Extended knowledge base — animals, books, history, geography, faith, science. */
export type Entry = { keys: string[]; answer: string };

export const KNOWLEDGE: Entry[] = [
  /* ----------------------------- animals ---------------------------- */
  { keys: ["lion"], answer: "Lions are the only truly social big cats, living in prides of related females with a few males. Females do most of the hunting, working as a team. A lion's roar carries about 8 km and is used to mark territory, not to attack." },
  { keys: ["elephant"], answer: "Elephants are the largest land animals. Their trunk has around 40,000 muscles and can lift logs or pick up a single leaf. They live in herds led by the oldest female (the matriarch), mourn their dead, and communicate using low rumbles humans can barely hear." },
  { keys: ["dolphin", "whale"], answer: "Dolphins and whales are mammals, not fish — they breathe air and feed their young milk. Dolphins use echolocation: they send clicks and read the echoes to 'see' shapes in dark water. They also call each other with signature whistles, like names." },
  { keys: ["owl"], answer: "Owls have asymmetrical ear openings, so a sound reaches one ear a fraction earlier than the other — that tiny gap lets them pinpoint a mouse in total darkness. Their feather edges are fringed, which makes their flight almost silent." },
  { keys: ["bee", "honey"], answer: "Honeybees communicate with a 'waggle dance' that tells hive-mates the direction and distance of flowers. One bee makes about a twelfth of a teaspoon of honey in its whole life, and bees pollinate roughly a third of the food we eat." },
  { keys: ["penguin"], answer: "Penguins are birds that swim instead of fly. Emperor penguins survive −60°C by huddling in rotating groups so every bird takes a turn in the warm centre. Fathers balance the egg on their feet for about two months without eating." },
  { keys: ["camel"], answer: "A camel's hump stores fat, not water. That fat can be broken down for energy and some water. Camels can drink over 100 litres in minutes, close their nostrils against sand, and have double eyelashes — perfect desert engineering." },
  { keys: ["snake", "reptile"], answer: "Snakes smell with their tongue: they flick it to collect scent particles and press them to a sensor in the roof of the mouth. They are ectothermic, meaning they use the sun to control body temperature rather than burning food for heat." },
  { keys: ["tiger"], answer: "Tigers are the biggest cats on Earth and every tiger's stripe pattern is unique, like a fingerprint — even on their skin. They are mostly solitary, swim well, and can leap about 5 metres. Fewer than 5,000 remain in the wild." },
  { keys: ["animal", "animals"], answer: "Animals are grouped by shared traits: mammals have fur and feed milk; birds have feathers and lay eggs; reptiles have scales; amphibians live partly in water; fish breathe with gills; insects have six legs and three body parts. Ask me about any specific animal and I will go deeper." },

  /* ------------------------------ books ----------------------------- */
  { keys: ["book", "books", "reading", "novel"], answer: "Books are the cheapest way to borrow another person's thinking. A good habit: read 10 pages a day, write one sentence about what you learned, and tell someone. Fiction builds empathy and imagination; non-fiction builds knowledge and vocabulary. Tell me a title and I will summarise it." },
  { keys: ["quran", "qur'an"], answer: "The Quran is the holy book of Islam, revealed over about 23 years and arranged in 114 surahs. It is memorised by millions of people word for word, and it repeatedly urges readers to seek knowledge, be just, and care for parents, neighbours and the poor." },
  { keys: ["iqbal", "allama"], answer: "Allama Muhammad Iqbal (1877–1938) was a poet and philosopher who wrote in Urdu and Persian. Works such as Bang-e-Dara and Asrar-e-Khudi explore khudi — selfhood and self-realisation. His 1930 Allahabad address shaped the political idea that led to Pakistan." },
  { keys: ["shakespeare"], answer: "William Shakespeare wrote 37 plays and 154 sonnets around 1590–1613, inventing or popularising roughly 1,700 English words. Tragedies like Hamlet and Macbeth study ambition and conscience; comedies like Twelfth Night play with identity and mistaken roles." },
  { keys: ["harry potter"], answer: "Harry Potter by J.K. Rowling follows an orphan who discovers he is a wizard and grows up across seven books. Beneath the magic it is about friendship, courage, prejudice and choosing what is right over what is easy." },
  { keys: ["diary of anne", "anne frank"], answer: "The Diary of a Young Girl records two years Anne Frank spent hidden in Amsterdam during the Second World War. It survives as one of history's most powerful first-hand accounts of the Holocaust, written by a teenager who still believed people were good at heart." },

  /* ----------------------------- history ---------------------------- */
  { keys: ["jinnah", "quaid"], answer: "Muhammad Ali Jinnah (1876–1948), the Quaid-e-Azam, was a lawyer known for precision and incorruptibility. He led the Muslim League, argued the case for Pakistan constitutionally rather than militarily, and became its first Governor-General in 1947." },
  { keys: ["world war", "ww2", "ww1"], answer: "The First World War (1914–18) was triggered by alliances and an assassination, and introduced trench warfare. The Second World War (1939–45) was wider and deadlier, ended with the defeat of the Axis powers, and led directly to the United Nations and modern human-rights law." },
  { keys: ["mughal", "akbar", "taj mahal"], answer: "The Mughal Empire ruled much of South Asia from 1526. Akbar built a state on administrative talent and religious tolerance; Shah Jahan built the Taj Mahal as a tomb for Mumtaz Mahal — a near-perfectly symmetrical marble monument finished around 1653." },
  { keys: ["pakistan"], answer: "Pakistan became independent on 14 August 1947. It has four provinces plus Gilgit-Baltistan and Azad Kashmir, the world's second-highest peak (K2, 8,611 m), one of the largest canal irrigation systems on Earth, and over 70 languages including Urdu, Punjabi, Pashto, Sindhi and Balochi." },
  { keys: ["history"], answer: "History is the study of evidence — documents, ruins, coins, oral accounts — not just dates. Good historical thinking asks three questions: what is the source, who benefited, and what changed afterwards? Open World History in the app to pick a country and study it chapter by chapter." },

  /* ---------------------------- geography --------------------------- */
  { keys: ["everest", "mountain"], answer: "Mount Everest (8,849 m) is the highest point above sea level, on the Nepal–China border. K2 (8,611 m) in Pakistan's Karakoram is lower but considered far more dangerous to climb. Mountains form when tectonic plates collide and crumple the crust upward." },
  { keys: ["ocean", "sea"], answer: "Oceans cover about 71% of Earth and hold 97% of its water. They absorb roughly a quarter of our carbon dioxide and most excess heat, drive weather through currents, and remain largely unexplored — we have better maps of Mars than of the deep sea floor." },
  { keys: ["desert", "sahara"], answer: "Deserts are defined by low rainfall, not heat — Antarctica is the largest desert on Earth. The Sahara is the biggest hot desert, roughly the size of the United States, and its dust fertilises the Amazon rainforest thousands of kilometres away." },
  { keys: ["volcano", "earthquake"], answer: "Earth's crust is broken into moving plates. Where they pull apart or dive under one another, magma rises and volcanoes form; where they grind and suddenly slip, the shock is an earthquake. The Pacific 'Ring of Fire' hosts most of both." },

  /* ----------------------------- science ---------------------------- */
  { keys: ["space", "universe", "galaxy", "star"], answer: "Our Sun is one of roughly 100 billion stars in the Milky Way, which is one of trillions of galaxies. Light from the Sun takes 8 minutes to reach us; from the nearest other star, over 4 years. Stars are giant fusion reactors turning hydrogen into helium." },
  { keys: ["black hole"], answer: "A black hole forms when a massive star collapses so densely that escape would require moving faster than light. We cannot see one directly, but we observe its gravity bending light and whipping nearby stars into fast orbits." },
  { keys: ["dinosaur"], answer: "Dinosaurs ruled for about 165 million years and were wiped out roughly 66 million years ago, most likely by an asteroid impact plus volcanic activity. Birds are living dinosaurs — the direct descendants of small feathered theropods." },
  { keys: ["human body", "brain", "heart", "blood"], answer: "Your brain has about 86 billion neurons and uses a fifth of your energy. The heart beats roughly 100,000 times a day, pushing blood through about 100,000 km of vessels. Sleep is when the brain files memories, which is why cramming without sleep rarely works." },
  { keys: ["computer", "coding", "programming", "internet"], answer: "Computers store everything as 1s and 0s and follow exact step-by-step instructions called algorithms. The internet is millions of computers agreeing on shared rules (protocols) to pass packets of data. Learning to code is mostly learning to break problems into small, testable pieces." },
  { keys: ["ai", "artificial intelligence", "machine learning"], answer: "Modern AI learns patterns from huge amounts of examples instead of following hand-written rules. It is powerful at prediction but has no understanding or intent, inherits bias from its data, and can state wrong things confidently — so always verify important answers." },
  { keys: ["climate", "global warming", "pollution"], answer: "Burning fossil fuels releases carbon stored for millions of years, thickening the blanket of greenhouse gases that traps heat. The result is higher average temperatures, more extreme weather and rising seas. The biggest fixes are clean electricity, efficient transport, less food waste and protected forests." },

  /* --------------------------- study & life -------------------------- */
  { keys: ["exam", "test", "study plan", "revision"], answer: "A proven exam routine: map the whole syllabus first and mark weak areas, study those first, use active recall (answer from memory before checking), practise under a timer, review after 1 day, 3 days and a week, and sleep properly the night before." },
  { keys: ["memory", "remember", "forget"], answer: "Memory strengthens through retrieval, not rereading. Close the book and write what you recall, then check. Space your reviews out over days, mix related topics in one session, and teach the idea aloud — explaining exposes gaps instantly." },
  { keys: ["focus", "concentrate", "distraction"], answer: "Focus is a trainable skill. Work in 25-minute blocks with a 5-minute break, put the phone in another room, keep one single task visible, and start with the hardest thing while your attention is fresh. Our brain games also train sustained attention." },
];

export function findKnowledge(input: string): string | null {
  const lower = input.toLowerCase();
  let best: { score: number; answer: string } | null = null;
  for (const entry of KNOWLEDGE) {
    let score = 0;
    for (const key of entry.keys) {
      if (lower.includes(key)) score += key.length + 3;
    }
    if (score > 0 && (!best || score > best.score)) best = { score, answer: entry.answer };
  }
  return best && best.score >= 6 ? best.answer : null;
}

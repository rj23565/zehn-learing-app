/* ------------------------------------------------------------------ */
/* Complete alphabets for every app language                           */
/* Latin · Arabic-script · Devanagari · Bengali · Chinese              */
/* ------------------------------------------------------------------ */

export type ScriptKind = "latin" | "arabic" | "indic" | "han";

export type Letter = {
  char: string;
  small?: string;
  forms?: { initial: string; medial: string; final: string };
  noJoinAfter?: boolean;
  name: string;
  sound: string;
  word: string;
  meaning: string;
  emoji: string;
};

export type SpellWord = {
  parts: string[];
  joined: string;
  emoji: string;
  meaning: string;
  say: string;
};

export type Alphabet = {
  code: string;
  label: string;
  native: string;
  script: ScriptKind;
  dir: "ltr" | "rtl";
  speech: string;
  note: string;
  joinDemo: { a: string; b: string; result: string; caption: string }[];
  letters: Letter[];
  words: SpellWord[];
};

/* ----------------------------- builders --------------------------- */

const T = "\u0640"; // tatweel — the little connector stroke

/** Arabic-script letter. Joining forms are generated automatically. */
function ar(
  char: string, name: string, sound: string, word: string,
  meaning: string, emoji: string, noJoin = false
): Letter {
  return {
    char, name, sound, word, meaning, emoji,
    noJoinAfter: noJoin,
    forms: noJoin
      ? { initial: char, medial: T + char, final: T + char }
      : { initial: char + T, medial: T + char + T, final: T + char },
  };
}

/** Latin letter with automatic small form. */
function la(char: string, sound: string, word: string, meaning: string, emoji: string): Letter {
  return { char, small: char.toLowerCase(), name: char, sound, word, meaning, emoji };
}

/** Indic / Han letter (no case, no joining). */
function ind(char: string, name: string, sound: string, word: string, meaning: string, emoji: string): Letter {
  return { char, name, sound, word, meaning, emoji };
}

/* ============================ LATIN =============================== */

const EN_LETTERS: Letter[] = [
  la("A", "ay", "Apple", "fruit", "🍎"), la("B", "buh", "Ball", "toy", "⚽"),
  la("C", "kuh", "Cat", "animal", "🐱"), la("D", "duh", "Dog", "animal", "🐶"),
  la("E", "eh", "Egg", "food", "🥚"), la("F", "fuh", "Fish", "animal", "🐟"),
  la("G", "guh", "Goat", "animal", "🐐"), la("H", "huh", "House", "place", "🏠"),
  la("I", "ih", "Ice", "cold", "🧊"), la("J", "juh", "Jug", "thing", "🫙"),
  la("K", "kuh", "Kite", "toy", "🪁"), la("L", "luh", "Leaf", "plant", "🍃"),
  la("M", "muh", "Moon", "sky", "🌙"), la("N", "nuh", "Nest", "home", "🪹"),
  la("O", "oh", "Orange", "fruit", "🍊"), la("P", "puh", "Pen", "thing", "🖊️"),
  la("Q", "kwuh", "Queen", "person", "👑"), la("R", "ruh", "Rose", "flower", "🌹"),
  la("S", "sss", "Sun", "sky", "☀️"), la("T", "tuh", "Tree", "plant", "🌳"),
  la("U", "uh", "Umbrella", "thing", "☂️"), la("V", "vuh", "Van", "vehicle", "🚐"),
  la("W", "wuh", "Watch", "thing", "⌚"), la("X", "ks", "Box", "thing", "📦"),
  la("Y", "yuh", "Yarn", "thing", "🧶"), la("Z", "zzz", "Zebra", "animal", "🦓"),
];

const ES_LETTERS: Letter[] = [
  la("A", "a", "Agua", "water", "💧"), la("B", "be", "Barco", "boat", "⛵"),
  la("C", "ce", "Casa", "house", "🏠"), la("D", "de", "Dado", "dice", "🎲"),
  la("E", "e", "Estrella", "star", "⭐"), la("F", "efe", "Flor", "flower", "🌸"),
  la("G", "ge", "Gato", "cat", "🐱"), la("H", "hache", "Hielo", "ice", "🧊"),
  la("I", "i", "Isla", "island", "🏝️"), la("J", "jota", "Jirafa", "giraffe", "🦒"),
  la("K", "ka", "Koala", "koala", "🐨"), la("L", "ele", "Luna", "moon", "🌙"),
  la("M", "eme", "Mano", "hand", "✋"), la("N", "ene", "Nube", "cloud", "☁️"),
  { ...la("Ñ", "eñe", "Niño", "child", "🧒"), small: "ñ" },
  la("O", "o", "Oso", "bear", "🐻"), la("P", "pe", "Pan", "bread", "🍞"),
  la("Q", "cu", "Queso", "cheese", "🧀"), la("R", "erre", "Rana", "frog", "🐸"),
  la("S", "ese", "Sol", "sun", "☀️"), la("T", "te", "Tren", "train", "🚂"),
  la("U", "u", "Uva", "grape", "🍇"), la("V", "uve", "Vaca", "cow", "🐄"),
  la("W", "uve doble", "Wifi", "wifi", "📶"), la("X", "equis", "Xilófono", "xylophone", "🎹"),
  la("Y", "ye", "Yate", "yacht", "🛥️"), la("Z", "zeta", "Zorro", "fox", "🦊"),
];

const FR_LETTERS: Letter[] = [
  la("A", "ah", "Arbre", "tree", "🌳"), la("B", "bé", "Bateau", "boat", "⛵"),
  la("C", "cé", "Chat", "cat", "🐱"), la("D", "dé", "Dauphin", "dolphin", "🐬"),
  la("E", "euh", "École", "school", "🏫"), la("F", "effe", "Fleur", "flower", "🌸"),
  la("G", "gé", "Gâteau", "cake", "🍰"), la("H", "ache", "Hibou", "owl", "🦉"),
  la("I", "ee", "Île", "island", "🏝️"), la("J", "ji", "Jardin", "garden", "🌷"),
  la("K", "ka", "Koala", "koala", "🐨"), la("L", "elle", "Lune", "moon", "🌙"),
  la("M", "emme", "Maison", "house", "🏠"), la("N", "enne", "Neige", "snow", "❄️"),
  la("O", "oh", "Oiseau", "bird", "🐦"), la("P", "pé", "Pomme", "apple", "🍎"),
  la("Q", "ku", "Quatre", "four", "4️⃣"), la("R", "erre", "Rose", "rose", "🌹"),
  la("S", "esse", "Soleil", "sun", "☀️"), la("T", "té", "Tortue", "turtle", "🐢"),
  la("U", "u", "Univers", "universe", "🌌"), la("V", "vé", "Voiture", "car", "🚗"),
  la("W", "double vé", "Wagon", "wagon", "🚃"), la("X", "iks", "Xylophone", "xylophone", "🎹"),
  la("Y", "i grec", "Yaourt", "yoghurt", "🥛"), la("Z", "zède", "Zèbre", "zebra", "🦓"),
];

const PT_LETTERS: Letter[] = [
  la("A", "á", "Abelha", "bee", "🐝"), la("B", "bê", "Bola", "ball", "⚽"),
  la("C", "cê", "Casa", "house", "🏠"), la("D", "dê", "Dado", "dice", "🎲"),
  la("E", "é", "Elefante", "elephant", "🐘"), la("F", "efe", "Flor", "flower", "🌸"),
  la("G", "gê", "Gato", "cat", "🐱"), la("H", "agá", "Hora", "hour", "🕐"),
  la("I", "i", "Ilha", "island", "🏝️"), la("J", "jota", "Janela", "window", "🪟"),
  la("K", "cá", "Kiwi", "kiwi", "🥝"), la("L", "ele", "Lua", "moon", "🌙"),
  la("M", "eme", "Mão", "hand", "✋"), la("N", "ene", "Navio", "ship", "🚢"),
  la("O", "ó", "Ovo", "egg", "🥚"), la("P", "pê", "Pão", "bread", "🍞"),
  la("Q", "quê", "Queijo", "cheese", "🧀"), la("R", "erre", "Rato", "mouse", "🐭"),
  la("S", "esse", "Sol", "sun", "☀️"), la("T", "tê", "Tigre", "tiger", "🐯"),
  la("U", "u", "Uva", "grape", "🍇"), la("V", "vê", "Vaca", "cow", "🐄"),
  la("W", "dáblio", "Wifi", "wifi", "📶"), la("X", "xis", "Xícara", "cup", "☕"),
  la("Y", "ípsilon", "Iogurte", "yoghurt", "🥛"), la("Z", "zê", "Zebra", "zebra", "🦓"),
];

/* ========================= ARABIC SCRIPT ========================== */

/** Urdu — complete 38-letter alphabet */
const UR_LETTERS: Letter[] = [
  ar("ا", "Alif", "a", "انار", "pomegranate", "🍎", true),
  ar("ب", "Be", "b", "بکری", "goat", "🐐"),
  ar("پ", "Pe", "p", "پتنگ", "kite", "🪁"),
  ar("ت", "Te", "t", "تتلی", "butterfly", "🦋"),
  ar("ٹ", "Ṭe", "ṭ", "ٹوپی", "cap", "🧢"),
  ar("ث", "Se", "s", "ثمر", "fruit", "🍇"),
  ar("ج", "Jim", "j", "جہاز", "aeroplane", "✈️"),
  ar("چ", "Che", "ch", "چاند", "moon", "🌙"),
  ar("ح", "Baṛi He", "h", "حلوہ", "sweet", "🍮"),
  ar("خ", "Khe", "kh", "خرگوش", "rabbit", "🐰"),
  ar("د", "Dal", "d", "درخت", "tree", "🌳", true),
  ar("ڈ", "Ḍal", "ḍ", "ڈبہ", "box", "📦", true),
  ar("ذ", "Zal", "z", "ذرہ", "particle", "✨", true),
  ar("ر", "Re", "r", "روٹی", "bread", "🫓", true),
  ar("ڑ", "Ṛe", "ṛ", "گاڑی", "car", "🚗", true),
  ar("ز", "Ze", "z", "زمین", "earth", "🌍", true),
  ar("ژ", "Zhe", "zh", "ژالہ", "hail", "🧊", true),
  ar("س", "Sin", "s", "سیب", "apple", "🍎"),
  ar("ش", "Shin", "sh", "شیر", "lion", "🦁"),
  ar("ص", "Suad", "s", "صابن", "soap", "🧼"),
  ar("ض", "Zuad", "z", "ضرب", "multiply", "✖️"),
  ar("ط", "Toe", "t", "طوطا", "parrot", "🦜"),
  ar("ظ", "Zoe", "z", "ظرف", "vessel", "🏺"),
  ar("ع", "Ain", "a", "عینک", "glasses", "👓"),
  ar("غ", "Ghain", "gh", "غبارہ", "balloon", "🎈"),
  ar("ف", "Fe", "f", "فیل", "elephant", "🐘"),
  ar("ق", "Qaf", "q", "قلم", "pen", "🖊️"),
  ar("ک", "Kaf", "k", "کتاب", "book", "📖"),
  ar("گ", "Gaf", "g", "گلاب", "rose", "🌹"),
  ar("ل", "Lam", "l", "لڈو", "sweet", "🍬"),
  ar("م", "Mim", "m", "مچھلی", "fish", "🐟"),
  ar("ن", "Nun", "n", "ناؤ", "boat", "⛵"),
  ar("و", "Wao", "w", "ورق", "page", "📄", true),
  ar("ہ", "Choṭi He", "h", "ہاتھی", "elephant", "🐘"),
  ar("ھ", "Do-chashmi He", "h", "بھالو", "bear", "🐻"),
  ar("ء", "Hamza", "'", "جُزء", "part", "🧩", true),
  ar("ی", "Choṭi Ye", "y", "یخ", "ice", "🧊"),
  ar("ے", "Baṛi Ye", "e", "میز", "table", "🪑", true),
];

/** Arabic — complete 28-letter alphabet */
const AR_LETTERS: Letter[] = [
  ar("ا", "Alif", "a", "أسد", "lion", "🦁", true),
  ar("ب", "Ba", "b", "بيت", "house", "🏠"),
  ar("ت", "Ta", "t", "تفاح", "apple", "🍎"),
  ar("ث", "Tha", "th", "ثعلب", "fox", "🦊"),
  ar("ج", "Jim", "j", "جمل", "camel", "🐪"),
  ar("ح", "Ha", "h", "حصان", "horse", "🐴"),
  ar("خ", "Kha", "kh", "خروف", "sheep", "🐑"),
  ar("د", "Dal", "d", "دب", "bear", "🐻", true),
  ar("ذ", "Dhal", "dh", "ذئب", "wolf", "🐺", true),
  ar("ر", "Ra", "r", "رمان", "pomegranate", "🍎", true),
  ar("ز", "Zay", "z", "زهرة", "flower", "🌸", true),
  ar("س", "Sin", "s", "سمكة", "fish", "🐟"),
  ar("ش", "Shin", "sh", "شمس", "sun", "☀️"),
  ar("ص", "Sad", "s", "صقر", "falcon", "🦅"),
  ar("ض", "Dad", "d", "ضفدع", "frog", "🐸"),
  ar("ط", "Ta", "t", "طائر", "bird", "🐦"),
  ar("ظ", "Zha", "zh", "ظل", "shadow", "🌑"),
  ar("ع", "Ain", "a", "عين", "eye", "👁️"),
  ar("غ", "Ghain", "gh", "غيمة", "cloud", "☁️"),
  ar("ف", "Fa", "f", "فيل", "elephant", "🐘"),
  ar("ق", "Qaf", "q", "قمر", "moon", "🌙"),
  ar("ك", "Kaf", "k", "كتاب", "book", "📖"),
  ar("ل", "Lam", "l", "ليمون", "lemon", "🍋"),
  ar("م", "Mim", "m", "موز", "banana", "🍌"),
  ar("ن", "Nun", "n", "نجمة", "star", "⭐"),
  ar("ه", "Ha", "h", "هدية", "gift", "🎁"),
  ar("و", "Waw", "w", "وردة", "rose", "🌹", true),
  ar("ي", "Ya", "y", "يد", "hand", "✋"),
];

/** Pashto — 44 letters */
const PS_LETTERS: Letter[] = [
  ar("ا", "Alif", "a", "اسپ", "horse", "🐴", true),
  ar("ب", "Be", "b", "باد", "wind", "🌬️"),
  ar("پ", "Pe", "p", "پښه", "foot", "🦶"),
  ar("ت", "Te", "t", "تیږه", "stone", "🪨"),
  ar("ټ", "Ṭe", "ṭ", "ټال", "swing", "🛝"),
  ar("ث", "Se", "s", "ثمر", "fruit", "🍇"),
  ar("ج", "Jim", "j", "جامه", "dress", "👗"),
  ar("چ", "Che", "ch", "چای", "tea", "🍵"),
  ar("ح", "He", "h", "حوض", "pond", "🏊"),
  ar("خ", "Khe", "kh", "خر", "donkey", "🫏"),
  ar("څ", "Tse", "ts", "څلور", "four", "4️⃣"),
  ar("ځ", "Dze", "dz", "ځای", "place", "📍"),
  ar("د", "Dal", "d", "ډوډۍ", "bread", "🫓", true),
  ar("ډ", "Ḍal", "ḍ", "ډک", "full", "🫗", true),
  ar("ذ", "Zal", "z", "ذره", "particle", "✨", true),
  ar("ر", "Re", "r", "رڼا", "light", "💡", true),
  ar("ړ", "Ṛe", "ṛ", "ړوند", "blind", "🙈", true),
  ar("ز", "Ze", "z", "زړه", "heart", "❤️", true),
  ar("ژ", "Zhe", "zh", "ژبه", "tongue", "👅", true),
  ar("ږ", "Ẓhe", "ẓh", "ږیره", "beard", "🧔", true),
  ar("س", "Sin", "s", "سترګه", "eye", "👁️"),
  ar("ش", "Shin", "sh", "شپه", "night", "🌙"),
  ar("ښ", "Ṣhin", "ṣh", "ښار", "city", "🏙️"),
  ar("ص", "Suad", "s", "صابون", "soap", "🧼"),
  ar("ض", "Zuad", "z", "ضرورت", "need", "🙏"),
  ar("ط", "Toe", "t", "طوطي", "parrot", "🦜"),
  ar("ظ", "Zoe", "z", "ظالم", "cruel", "⚡"),
  ar("ع", "Ain", "a", "عقاب", "eagle", "🦅"),
  ar("غ", "Ghain", "gh", "غر", "mountain", "⛰️"),
  ar("ف", "Fe", "f", "فیل", "elephant", "🐘"),
  ar("ق", "Qaf", "q", "قلم", "pen", "🖊️"),
  ar("ک", "Kaf", "k", "کتاب", "book", "📖"),
  ar("ګ", "Gaf", "g", "ګل", "flower", "🌸"),
  ar("ل", "Lam", "l", "لمر", "sun", "☀️"),
  ar("م", "Mim", "m", "میلمه", "guest", "🤝"),
  ar("ن", "Nun", "n", "نوم", "name", "🏷️"),
  ar("ڼ", "Ṇun", "ṇ", "مڼه", "apple", "🍎"),
  ar("و", "Waw", "w", "وریځ", "cloud", "☁️", true),
  ar("ه", "He", "h", "هوا", "air", "💨"),
  ar("ۀ", "Hamza He", "ə", "ښځۀ", "woman", "👩", true),
  ar("ی", "Ye", "y", "یو", "one", "1️⃣"),
  ar("ې", "Pasta Ye", "e", "ښې", "good", "👍"),
  ar("ۍ", "Ṣhadzina Ye", "əi", "څوکۍ", "chair", "🪑", true),
  ar("ئ", "Fe'liya Ye", "ay", "راځئ", "come", "🚶", true),
];

/** Sindhi — 52 letters */
const SD_LETTERS: Letter[] = [
  ar("ا", "Alif", "a", "انب", "mango", "🥭", true),
  ar("ب", "Be", "b", "بلي", "cat", "🐱"),
  ar("ٻ", "Bbe", "ɓ", "ٻار", "child", "🧒"),
  ar("ڀ", "Bhe", "bh", "ڀت", "wall", "🧱"),
  ar("پ", "Pe", "p", "پاڻي", "water", "💧"),
  ar("ت", "Te", "t", "تارو", "star", "⭐"),
  ar("ٿ", "The", "th", "ٿانو", "pot", "🍲"),
  ar("ٽ", "Ṭe", "ṭ", "ٽوپي", "cap", "🧢"),
  ar("ٺ", "Ṭhe", "ṭh", "ٺاهه", "make", "🔨"),
  ar("ث", "Se", "s", "ثمر", "fruit", "🍇"),
  ar("ج", "Jim", "j", "جهاز", "ship", "🚢"),
  ar("ڄ", "Jje", "ʄ", "ڄار", "net", "🕸️"),
  ar("جھ", "Jhe", "jh", "جھڙ", "rain", "🌧️"),
  ar("ڃ", "Nye", "ñ", "ڪڃرو", "singer", "🎤"),
  ar("چ", "Che", "ch", "چنڊ", "moon", "🌙"),
  ar("ڇ", "Chhe", "chh", "ڇپر", "roof", "🏠"),
  ar("ح", "He", "h", "حوض", "pond", "🏞️"),
  ar("خ", "Khe", "kh", "خربوزو", "melon", "🍈"),
  ar("د", "Dal", "d", "دروازو", "door", "🚪", true),
  ar("ڌ", "Dhal", "dh", "ڌرتي", "earth", "🌍", true),
  ar("ڊ", "Ḍal", "ḍ", "ڊڄڻ", "fear", "😨", true),
  ar("ڏ", "Ḍḍal", "ɗ", "ڏاڍو", "strong", "💪", true),
  ar("ڍ", "Ḍhal", "ḍh", "ڍڳو", "ox", "🐂", true),
  ar("ذ", "Zal", "z", "ذرو", "particle", "✨", true),
  ar("ر", "Re", "r", "روٽي", "bread", "🫓", true),
  ar("ڙ", "Ṛe", "ṛ", "ڳاڙهو", "red", "🔴", true),
  ar("ز", "Ze", "z", "زمين", "land", "🏞️", true),
  ar("س", "Sin", "s", "سج", "sun", "☀️"),
  ar("ش", "Shin", "sh", "شينهن", "lion", "🦁"),
  ar("ص", "Suad", "s", "صابڻ", "soap", "🧼"),
  ar("ض", "Zuad", "z", "ضرورت", "need", "🙏"),
  ar("ط", "Toe", "t", "طوطو", "parrot", "🦜"),
  ar("ظ", "Zoe", "z", "ظاهر", "visible", "👁️"),
  ar("ع", "Ain", "a", "عينڪ", "glasses", "👓"),
  ar("غ", "Ghain", "gh", "غبارو", "balloon", "🎈"),
  ar("ف", "Fe", "f", "فيل", "elephant", "🐘"),
  ar("ڦ", "Phe", "ph", "ڦل", "fruit", "🍎"),
  ar("ق", "Qaf", "q", "قلم", "pen", "🖊️"),
  ar("ڪ", "Kaf", "k", "ڪتاب", "book", "📖"),
  ar("ک", "Khe", "kh", "کير", "milk", "🥛"),
  ar("گ", "Gaf", "g", "گل", "flower", "🌸"),
  ar("ڳ", "Gge", "ɠ", "ڳئون", "cow", "🐄"),
  ar("ڱ", "Nge", "ŋ", "ڱڻ", "count", "🔢"),
  ar("ل", "Lam", "l", "لال", "red", "🔴"),
  ar("م", "Mim", "m", "مڇي", "fish", "🐟"),
  ar("ن", "Nun", "n", "نانگ", "snake", "🐍"),
  ar("ڻ", "Ṇun", "ṇ", "واڻ", "tree", "🌳"),
  ar("و", "Wao", "w", "واءُ", "wind", "🌬️", true),
  ar("ه", "He", "h", "هٿ", "hand", "✋"),
  ar("ھ", "Do-chashmi He", "h", "ڀاءُ", "brother", "👦"),
  ar("ي", "Ye", "y", "يار", "friend", "🤝"),
  ar("ئ", "Hamza Ye", "'", "ڇوڪرئ", "girl", "👧", true),
];

/** Punjabi (Shahmukhi) — 37 letters */
const PA_LETTERS: Letter[] = [
  ar("ا", "Alif", "a", "انب", "mango", "🥭", true),
  ar("ب", "Be", "b", "بکری", "goat", "🐐"),
  ar("ٻ", "Bbe", "ɓ", "ٻوٹا", "plant", "🌱"),
  ar("پ", "Pe", "p", "پانی", "water", "💧"),
  ar("ت", "Te", "t", "تارا", "star", "⭐"),
  ar("ٹ", "Ṭe", "ṭ", "ٹوپی", "cap", "🧢"),
  ar("ث", "Se", "s", "ثمر", "fruit", "🍇"),
  ar("ج", "Jim", "j", "جہاز", "ship", "🚢"),
  ar("چ", "Che", "ch", "چن", "moon", "🌙"),
  ar("ح", "He", "h", "حلوہ", "sweet", "🍮"),
  ar("خ", "Khe", "kh", "خرگوش", "rabbit", "🐰"),
  ar("د", "Dal", "d", "دریا", "river", "🏞️", true),
  ar("ڈ", "Ḍal", "ḍ", "ڈبہ", "box", "📦", true),
  ar("ذ", "Zal", "z", "ذرہ", "particle", "✨", true),
  ar("ر", "Re", "r", "روٹی", "bread", "🫓", true),
  ar("ڑ", "Ṛe", "ṛ", "گھوڑا", "horse", "🐴", true),
  ar("ز", "Ze", "z", "زمین", "land", "🌍", true),
  ar("ژ", "Zhe", "zh", "ژالہ", "hail", "🧊", true),
  ar("س", "Sin", "s", "سورج", "sun", "☀️"),
  ar("ش", "Shin", "sh", "شیر", "lion", "🦁"),
  ar("ص", "Suad", "s", "صابن", "soap", "🧼"),
  ar("ض", "Zuad", "z", "ضرب", "multiply", "✖️"),
  ar("ط", "Toe", "t", "طوطا", "parrot", "🦜"),
  ar("ظ", "Zoe", "z", "ظرف", "vessel", "🏺"),
  ar("ع", "Ain", "a", "عینک", "glasses", "👓"),
  ar("غ", "Ghain", "gh", "غبارہ", "balloon", "🎈"),
  ar("ف", "Fe", "f", "فصل", "crop", "🌾"),
  ar("ق", "Qaf", "q", "قلم", "pen", "🖊️"),
  ar("ک", "Kaf", "k", "کتاب", "book", "📖"),
  ar("گ", "Gaf", "g", "گلاب", "rose", "🌹"),
  ar("ل", "Lam", "l", "لسی", "lassi", "🥛"),
  ar("م", "Mim", "m", "مچھلی", "fish", "🐟"),
  ar("ن", "Nun", "n", "ناں", "name", "🏷️"),
  ar("ں", "Nun Ghunna", "ñ", "ماں", "mother", "👩", true),
  ar("و", "Wao", "w", "وڈا", "big", "🐘", true),
  ar("ہ", "He", "h", "ہتھی", "elephant", "🐘"),
  ar("ی", "Ye", "y", "یار", "friend", "🤝"),
];

/* =========================== DEVANAGARI =========================== */

const HI_LETTERS: Letter[] = [
  // स्वर — vowels
  ind("अ", "A", "a", "अनार", "pomegranate", "🍎"),
  ind("आ", "Aa", "aa", "आम", "mango", "🥭"),
  ind("इ", "I", "i", "इमली", "tamarind", "🌿"),
  ind("ई", "Ee", "ee", "ईख", "sugarcane", "🎋"),
  ind("उ", "U", "u", "उल्लू", "owl", "🦉"),
  ind("ऊ", "Oo", "oo", "ऊन", "wool", "🧶"),
  ind("ऋ", "Ri", "ri", "ऋषि", "sage", "🧘"),
  ind("ए", "E", "e", "एक", "one", "1️⃣"),
  ind("ऐ", "Ai", "ai", "ऐनक", "glasses", "👓"),
  ind("ओ", "O", "o", "ओखली", "mortar", "🥣"),
  ind("औ", "Au", "au", "औरत", "woman", "👩"),
  ind("अं", "An", "an", "अंगूर", "grapes", "🍇"),
  ind("अः", "Ah", "ah", "दुःख", "sorrow", "😢"),
  // व्यंजन — consonants
  ind("क", "Ka", "k", "कबूतर", "pigeon", "🕊️"),
  ind("ख", "Kha", "kh", "खरगोश", "rabbit", "🐰"),
  ind("ग", "Ga", "g", "गाय", "cow", "🐄"),
  ind("घ", "Gha", "gh", "घर", "house", "🏠"),
  ind("ङ", "Nga", "ṅ", "वाङ्मय", "speech", "🗣️"),
  ind("च", "Cha", "ch", "चाँद", "moon", "🌙"),
  ind("छ", "Chha", "chh", "छतरी", "umbrella", "☂️"),
  ind("ज", "Ja", "j", "जहाज", "ship", "🚢"),
  ind("झ", "Jha", "jh", "झंडा", "flag", "🚩"),
  ind("ञ", "Nya", "ñ", "ज्ञान", "knowledge", "📚"),
  ind("ट", "Ṭa", "ṭ", "टमाटर", "tomato", "🍅"),
  ind("ठ", "Ṭha", "ṭh", "ठठेरा", "tinsmith", "🔨"),
  ind("ड", "Ḍa", "ḍ", "डमरू", "drum", "🥁"),
  ind("ढ", "Ḍha", "ḍh", "ढोल", "drum", "🪘"),
  ind("ण", "Ṇa", "ṇ", "बाण", "arrow", "🏹"),
  ind("त", "Ta", "t", "तितली", "butterfly", "🦋"),
  ind("थ", "Tha", "th", "थाली", "plate", "🍽️"),
  ind("द", "Da", "d", "दवात", "inkpot", "🖋️"),
  ind("ध", "Dha", "dh", "धनुष", "bow", "🏹"),
  ind("न", "Na", "n", "नल", "tap", "🚰"),
  ind("प", "Pa", "p", "पतंग", "kite", "🪁"),
  ind("फ", "Pha", "ph", "फल", "fruit", "🍎"),
  ind("ब", "Ba", "b", "बकरी", "goat", "🐐"),
  ind("भ", "Bha", "bh", "भालू", "bear", "🐻"),
  ind("म", "Ma", "m", "मछली", "fish", "🐟"),
  ind("य", "Ya", "y", "यज्ञ", "ritual", "🔥"),
  ind("र", "Ra", "r", "रथ", "chariot", "🛺"),
  ind("ल", "La", "l", "लड्डू", "sweet", "🍬"),
  ind("व", "Va", "v", "वन", "forest", "🌳"),
  ind("श", "Sha", "sh", "शेर", "lion", "🦁"),
  ind("ष", "Ṣha", "ṣh", "षट्कोण", "hexagon", "⬡"),
  ind("स", "Sa", "s", "सूरज", "sun", "☀️"),
  ind("ह", "Ha", "h", "हाथी", "elephant", "🐘"),
  ind("क्ष", "Ksha", "ksh", "क्षत्रिय", "warrior", "⚔️"),
  ind("त्र", "Tra", "tr", "त्रिशूल", "trident", "🔱"),
  ind("ज्ञ", "Gya", "gy", "ज्ञान", "knowledge", "📖"),
];

/* ============================= BENGALI ============================ */

const BN_LETTERS: Letter[] = [
  ind("অ", "A", "o", "অজগর", "python", "🐍"),
  ind("আ", "Aa", "a", "আম", "mango", "🥭"),
  ind("ই", "I", "i", "ইঁদুর", "mouse", "🐭"),
  ind("ঈ", "Ee", "ee", "ঈগল", "eagle", "🦅"),
  ind("উ", "U", "u", "উট", "camel", "🐪"),
  ind("ঊ", "Oo", "oo", "ঊষা", "dawn", "🌅"),
  ind("ঋ", "Ri", "ri", "ঋষি", "sage", "🧘"),
  ind("এ", "E", "e", "একতারা", "ektara", "🪕"),
  ind("ঐ", "Oi", "oi", "ঐরাবত", "elephant", "🐘"),
  ind("ও", "O", "o", "ওল", "yam", "🍠"),
  ind("ঔ", "Ou", "ou", "ঔষধ", "medicine", "💊"),
  ind("ক", "Ka", "k", "কলম", "pen", "🖊️"),
  ind("খ", "Kha", "kh", "খরগোশ", "rabbit", "🐰"),
  ind("গ", "Ga", "g", "গরু", "cow", "🐄"),
  ind("ঘ", "Gha", "gh", "ঘর", "house", "🏠"),
  ind("ঙ", "Uma", "ṅ", "ব্যাঙ", "frog", "🐸"),
  ind("চ", "Cha", "ch", "চাঁদ", "moon", "🌙"),
  ind("ছ", "Chha", "chh", "ছাতা", "umbrella", "☂️"),
  ind("জ", "Ja", "j", "জাহাজ", "ship", "🚢"),
  ind("ঝ", "Jha", "jh", "ঝরনা", "waterfall", "💦"),
  ind("ঞ", "Nya", "ñ", "মিঞা", "sir", "🧑"),
  ind("ট", "Ṭa", "ṭ", "টমেটো", "tomato", "🍅"),
  ind("ঠ", "Ṭha", "ṭh", "ঠোঁট", "lip", "👄"),
  ind("ড", "Ḍa", "ḍ", "ডিম", "egg", "🥚"),
  ind("ঢ", "Ḍha", "ḍh", "ঢোল", "drum", "🪘"),
  ind("ণ", "Ṇa", "ṇ", "বাণ", "arrow", "🏹"),
  ind("ত", "Ta", "t", "তারা", "star", "⭐"),
  ind("থ", "Tha", "th", "থালা", "plate", "🍽️"),
  ind("দ", "Da", "d", "দরজা", "door", "🚪"),
  ind("ধ", "Dha", "dh", "ধান", "paddy", "🌾"),
  ind("ন", "Na", "n", "নৌকা", "boat", "⛵"),
  ind("প", "Pa", "p", "পাখি", "bird", "🐦"),
  ind("ফ", "Pha", "ph", "ফুল", "flower", "🌸"),
  ind("ব", "Ba", "b", "বই", "book", "📖"),
  ind("ভ", "Bha", "bh", "ভালুক", "bear", "🐻"),
  ind("ম", "Ma", "m", "মাছ", "fish", "🐟"),
  ind("য", "Ja", "j", "যব", "barley", "🌾"),
  ind("র", "Ra", "r", "রাজা", "king", "👑"),
  ind("ল", "La", "l", "লেবু", "lemon", "🍋"),
  ind("শ", "Sha", "sh", "শিয়াল", "fox", "🦊"),
  ind("ষ", "Ṣha", "ṣh", "ষাঁড়", "bull", "🐂"),
  ind("স", "Sa", "s", "সূর্য", "sun", "☀️"),
  ind("হ", "Ha", "h", "হাতি", "elephant", "🐘"),
  ind("ড়", "Ṛa", "ṛ", "ঘড়ি", "clock", "🕐"),
  ind("ঢ়", "Ṛha", "ṛh", "আষাঢ়", "monsoon", "🌧️"),
  ind("য়", "Ya", "y", "আয়না", "mirror", "🪞"),
  ind("ৎ", "Khanda Ta", "t", "হঠাৎ", "sudden", "⚡"),
  ind("ং", "Anusvar", "ng", "রং", "colour", "🎨"),
  ind("ঃ", "Bisarga", "h", "দুঃখ", "sorrow", "😢"),
  ind("ঁ", "Chandrabindu", "̃", "চাঁদ", "moon", "🌙"),
];

/* ============================= CHINESE ============================ */

const ZH_LETTERS: Letter[] = [
  { char: "一", small: "yī", name: "One", sound: "yī", word: "一个", meaning: "one", emoji: "1️⃣" },
  { char: "二", small: "èr", name: "Two", sound: "èr", word: "二月", meaning: "two", emoji: "2️⃣" },
  { char: "三", small: "sān", name: "Three", sound: "sān", word: "三角", meaning: "three", emoji: "3️⃣" },
  { char: "四", small: "sì", name: "Four", sound: "sì", word: "四季", meaning: "four", emoji: "4️⃣" },
  { char: "五", small: "wǔ", name: "Five", sound: "wǔ", word: "五彩", meaning: "five", emoji: "5️⃣" },
  { char: "六", small: "liù", name: "Six", sound: "liù", word: "六月", meaning: "six", emoji: "6️⃣" },
  { char: "七", small: "qī", name: "Seven", sound: "qī", word: "七天", meaning: "seven", emoji: "7️⃣" },
  { char: "八", small: "bā", name: "Eight", sound: "bā", word: "八方", meaning: "eight", emoji: "8️⃣" },
  { char: "九", small: "jiǔ", name: "Nine", sound: "jiǔ", word: "九月", meaning: "nine", emoji: "9️⃣" },
  { char: "十", small: "shí", name: "Ten", sound: "shí", word: "十分", meaning: "ten", emoji: "🔟" },
  { char: "人", small: "rén", name: "Person", sound: "rén", word: "人们", meaning: "person", emoji: "🧍" },
  { char: "口", small: "kǒu", name: "Mouth", sound: "kǒu", word: "口水", meaning: "mouth", emoji: "👄" },
  { char: "日", small: "rì", name: "Sun", sound: "rì", word: "日出", meaning: "sun / day", emoji: "☀️" },
  { char: "月", small: "yuè", name: "Moon", sound: "yuè", word: "月亮", meaning: "moon", emoji: "🌙" },
  { char: "山", small: "shān", name: "Mountain", sound: "shān", word: "高山", meaning: "mountain", emoji: "⛰️" },
  { char: "水", small: "shuǐ", name: "Water", sound: "shuǐ", word: "喝水", meaning: "water", emoji: "💧" },
  { char: "火", small: "huǒ", name: "Fire", sound: "huǒ", word: "火车", meaning: "fire", emoji: "🔥" },
  { char: "木", small: "mù", name: "Wood", sound: "mù", word: "树木", meaning: "tree / wood", emoji: "🌳" },
  { char: "土", small: "tǔ", name: "Earth", sound: "tǔ", word: "土地", meaning: "earth", emoji: "🟤" },
  { char: "天", small: "tiān", name: "Sky", sound: "tiān", word: "天空", meaning: "sky / day", emoji: "🌤️" },
  { char: "大", small: "dà", name: "Big", sound: "dà", word: "大象", meaning: "big", emoji: "🐘" },
  { char: "小", small: "xiǎo", name: "Small", sound: "xiǎo", word: "小猫", meaning: "small", emoji: "🐱" },
  { char: "女", small: "nǚ", name: "Woman", sound: "nǚ", word: "女孩", meaning: "woman", emoji: "👧" },
  { char: "子", small: "zǐ", name: "Child", sound: "zǐ", word: "孩子", meaning: "child", emoji: "🧒" },
  { char: "心", small: "xīn", name: "Heart", sound: "xīn", word: "开心", meaning: "heart", emoji: "❤️" },
  { char: "手", small: "shǒu", name: "Hand", sound: "shǒu", word: "手机", meaning: "hand", emoji: "✋" },
  { char: "目", small: "mù", name: "Eye", sound: "mù", word: "目光", meaning: "eye", emoji: "👁️" },
  { char: "鸟", small: "niǎo", name: "Bird", sound: "niǎo", word: "小鸟", meaning: "bird", emoji: "🐦" },
  { char: "鱼", small: "yú", name: "Fish", sound: "yú", word: "金鱼", meaning: "fish", emoji: "🐟" },
  { char: "马", small: "mǎ", name: "Horse", sound: "mǎ", word: "马路", meaning: "horse", emoji: "🐴" },
];

/* ============================ ALPHABETS =========================== */

export const ALPHABETS: Alphabet[] = [
  {
    code: "en", label: "English", native: "ABC", script: "latin", dir: "ltr", speech: "en-US",
    note: "Every BIG capital letter has a small partner. Words are made by writing letters side by side.",
    joinDemo: [
      { a: "C", b: "A", result: "CA", caption: "C + A" },
      { a: "CA", b: "T", result: "CAT", caption: "CA + T" },
      { a: "CAT", b: "🐱", result: "cat", caption: "small letters" },
    ],
    letters: EN_LETTERS,
    words: [
      { parts: ["A", "P", "P", "L", "E"], joined: "APPLE", emoji: "🍎", meaning: "apple", say: "apple" },
      { parts: ["B", "A", "L", "L"], joined: "BALL", emoji: "⚽", meaning: "ball", say: "ball" },
      { parts: ["C", "A", "T"], joined: "CAT", emoji: "🐱", meaning: "cat", say: "cat" },
      { parts: ["F", "I", "S", "H"], joined: "FISH", emoji: "🐟", meaning: "fish", say: "fish" },
      { parts: ["M", "O", "O", "N"], joined: "MOON", emoji: "🌙", meaning: "moon", say: "moon" },
      { parts: ["S", "T", "A", "R"], joined: "STAR", emoji: "⭐", meaning: "star", say: "star" },
      { parts: ["B", "O", "O", "K"], joined: "BOOK", emoji: "📖", meaning: "book", say: "book" },
      { parts: ["T", "R", "E", "E"], joined: "TREE", emoji: "🌳", meaning: "tree", say: "tree" },
    ],
  },
  {
    code: "es", label: "Spanish", native: "Español", script: "latin", dir: "ltr", speech: "es-ES",
    note: "El español tiene 27 letras: el abecedario inglés más la Ñ. Cada mayúscula tiene su minúscula.",
    joinDemo: [
      { a: "S", b: "O", result: "SO", caption: "S + O" },
      { a: "SO", b: "L", result: "SOL", caption: "SO + L" },
      { a: "SOL", b: "☀️", result: "sol", caption: "minúsculas" },
    ],
    letters: ES_LETTERS,
    words: [
      { parts: ["S", "O", "L"], joined: "SOL", emoji: "☀️", meaning: "sun", say: "sol" },
      { parts: ["G", "A", "T", "O"], joined: "GATO", emoji: "🐱", meaning: "cat", say: "gato" },
      { parts: ["L", "U", "N", "A"], joined: "LUNA", emoji: "🌙", meaning: "moon", say: "luna" },
      { parts: ["C", "A", "S", "A"], joined: "CASA", emoji: "🏠", meaning: "house", say: "casa" },
      { parts: ["F", "L", "O", "R"], joined: "FLOR", emoji: "🌸", meaning: "flower", say: "flor" },
      { parts: ["N", "I", "Ñ", "O"], joined: "NIÑO", emoji: "🧒", meaning: "child", say: "niño" },
    ],
  },
  {
    code: "fr", label: "French", native: "Français", script: "latin", dir: "ltr", speech: "fr-FR",
    note: "Le français utilise 26 lettres, plus des accents comme é, è, ê, ç qui changent le son.",
    joinDemo: [
      { a: "C", b: "H", result: "CH", caption: "C + H" },
      { a: "CH", b: "A", result: "CHA", caption: "CH + A" },
      { a: "CHA", b: "T", result: "CHAT", caption: "CHA + T" },
    ],
    letters: FR_LETTERS,
    words: [
      { parts: ["C", "H", "A", "T"], joined: "CHAT", emoji: "🐱", meaning: "cat", say: "chat" },
      { parts: ["L", "U", "N", "E"], joined: "LUNE", emoji: "🌙", meaning: "moon", say: "lune" },
      { parts: ["P", "O", "M", "M", "E"], joined: "POMME", emoji: "🍎", meaning: "apple", say: "pomme" },
      { parts: ["F", "L", "E", "U", "R"], joined: "FLEUR", emoji: "🌸", meaning: "flower", say: "fleur" },
      { parts: ["É", "T", "O", "I", "L", "E"], joined: "ÉTOILE", emoji: "⭐", meaning: "star", say: "étoile" },
    ],
  },
  {
    code: "pt", label: "Portuguese", native: "Português", script: "latin", dir: "ltr", speech: "pt-BR",
    note: "O português usa 26 letras e acentos como ã, ç, é que mudam o som da palavra.",
    joinDemo: [
      { a: "S", b: "O", result: "SO", caption: "S + O" },
      { a: "SO", b: "L", result: "SOL", caption: "SO + L" },
      { a: "SOL", b: "☀️", result: "sol", caption: "minúsculas" },
    ],
    letters: PT_LETTERS,
    words: [
      { parts: ["S", "O", "L"], joined: "SOL", emoji: "☀️", meaning: "sun", say: "sol" },
      { parts: ["G", "A", "T", "O"], joined: "GATO", emoji: "🐱", meaning: "cat", say: "gato" },
      { parts: ["L", "U", "A"], joined: "LUA", emoji: "🌙", meaning: "moon", say: "lua" },
      { parts: ["P", "E", "I", "X", "E"], joined: "PEIXE", emoji: "🐟", meaning: "fish", say: "peixe" },
      { parts: ["F", "L", "O", "R"], joined: "FLOR", emoji: "🌸", meaning: "flower", say: "flor" },
    ],
  },
  {
    code: "ur", label: "Urdu", native: "اردو", script: "arabic", dir: "rtl", speech: "ur-PK",
    note: "اردو میں ۳۸ حروف ہیں۔ حروف جگہ کے مطابق شکل بدلتے ہیں اور ایک دوسرے سے جُڑ جاتے ہیں۔",
    joinDemo: [
      { a: "ک", b: "ت", result: "کت", caption: "ک + ت" },
      { a: "کت", b: "ا", result: "کتا", caption: "کت + ا" },
      { a: "کتا", b: "ب", result: "کتاب", caption: "کتا + ب" },
    ],
    letters: UR_LETTERS,
    words: [
      { parts: ["ک", "ت", "ا", "ب"], joined: "کتاب", emoji: "📖", meaning: "book", say: "کتاب" },
      { parts: ["ب", "ل", "ی"], joined: "بلی", emoji: "🐱", meaning: "cat", say: "بلی" },
      { parts: ["س", "ی", "ب"], joined: "سیب", emoji: "🍎", meaning: "apple", say: "سیب" },
      { parts: ["چ", "ا", "ن", "د"], joined: "چاند", emoji: "🌙", meaning: "moon", say: "چاند" },
      { parts: ["گ", "ل", "ا", "ب"], joined: "گلاب", emoji: "🌹", meaning: "rose", say: "گلاب" },
      { parts: ["ش", "ی", "ر"], joined: "شیر", emoji: "🦁", meaning: "lion", say: "شیر" },
      { parts: ["پ", "ا", "ن", "ی"], joined: "پانی", emoji: "💧", meaning: "water", say: "پانی" },
    ],
  },
  {
    code: "ar", label: "Arabic", native: "العربية", script: "arabic", dir: "rtl", speech: "ar-SA",
    note: "تتكوّن العربية من ٢٨ حرفًا، وتتغير أشكال الحروف حسب موقعها في الكلمة.",
    joinDemo: [
      { a: "ك", b: "ت", result: "كت", caption: "ك + ت" },
      { a: "كت", b: "ا", result: "كتا", caption: "كت + ا" },
      { a: "كتا", b: "ب", result: "كتاب", caption: "كتا + ب" },
    ],
    letters: AR_LETTERS,
    words: [
      { parts: ["ك", "ت", "ا", "ب"], joined: "كتاب", emoji: "📖", meaning: "book", say: "كتاب" },
      { parts: ["ش", "م", "س"], joined: "شمس", emoji: "☀️", meaning: "sun", say: "شمس" },
      { parts: ["ق", "م", "ر"], joined: "قمر", emoji: "🌙", meaning: "moon", say: "قمر" },
      { parts: ["ب", "ي", "ت"], joined: "بيت", emoji: "🏠", meaning: "house", say: "بيت" },
      { parts: ["ف", "ي", "ل"], joined: "فيل", emoji: "🐘", meaning: "elephant", say: "فيل" },
      { parts: ["و", "ر", "د", "ة"], joined: "وردة", emoji: "🌹", meaning: "rose", say: "وردة" },
    ],
  },
  {
    code: "ps", label: "Pashto", native: "پښتو", script: "arabic", dir: "rtl", speech: "ps-AF",
    note: "پښتو ۴۴ تورې لري — د عربي پر بنسټ سره ځانګړي توري لکه ټ، ځ، څ، ډ، ړ، ږ، ښ، ګ، ڼ.",
    joinDemo: [
      { a: "ک", b: "ت", result: "کت", caption: "ک + ت" },
      { a: "کت", b: "ا", result: "کتا", caption: "کت + ا" },
      { a: "کتا", b: "ب", result: "کتاب", caption: "کتا + ب" },
    ],
    letters: PS_LETTERS,
    words: [
      { parts: ["ک", "ت", "ا", "ب"], joined: "کتاب", emoji: "📖", meaning: "book", say: "کتاب" },
      { parts: ["ل", "م", "ر"], joined: "لمر", emoji: "☀️", meaning: "sun", say: "لمر" },
      { parts: ["ګ", "ل"], joined: "ګل", emoji: "🌸", meaning: "flower", say: "ګل" },
      { parts: ["م", "ڼ", "ه"], joined: "مڼه", emoji: "🍎", meaning: "apple", say: "مڼه" },
      { parts: ["غ", "ر"], joined: "غر", emoji: "⛰️", meaning: "mountain", say: "غر" },
    ],
  },
  {
    code: "sd", label: "Sindhi", native: "سنڌي", script: "arabic", dir: "rtl", speech: "sd-PK",
    note: "سنڌي ۾ ۵۲ اکر آهن — دنيا جي وڏين الفابيٽن مان هڪ. اکر پنهنجي جاءِ مطابق شڪل بدلائيندا آهن.",
    joinDemo: [
      { a: "ڪ", b: "ت", result: "ڪت", caption: "ڪ + ت" },
      { a: "ڪت", b: "ا", result: "ڪتا", caption: "ڪت + ا" },
      { a: "ڪتا", b: "ب", result: "ڪتاب", caption: "ڪتا + ب" },
    ],
    letters: SD_LETTERS,
    words: [
      { parts: ["ڪ", "ت", "ا", "ب"], joined: "ڪتاب", emoji: "📖", meaning: "book", say: "ڪتاب" },
      { parts: ["س", "ج"], joined: "سج", emoji: "☀️", meaning: "sun", say: "سج" },
      { parts: ["گ", "ل"], joined: "گل", emoji: "🌸", meaning: "flower", say: "گل" },
      { parts: ["م", "ڇ", "ي"], joined: "مڇي", emoji: "🐟", meaning: "fish", say: "مڇي" },
      { parts: ["ب", "ل", "ي"], joined: "بلي", emoji: "🐱", meaning: "cat", say: "بلي" },
    ],
  },
  {
    code: "pa", label: "Punjabi", native: "پنجابی", script: "arabic", dir: "rtl", speech: "pa-PK",
    note: "پنجابی شاہ مکھی وچ لکھی جاندی اے۔ حرف اپنی جگہ مطابق شکل بدلدے نیں تے رل کے لفظ بندے نیں۔",
    joinDemo: [
      { a: "ک", b: "ت", result: "کت", caption: "ک + ت" },
      { a: "کت", b: "ا", result: "کتا", caption: "کت + ا" },
      { a: "کتا", b: "ب", result: "کتاب", caption: "کتا + ب" },
    ],
    letters: PA_LETTERS,
    words: [
      { parts: ["ک", "ت", "ا", "ب"], joined: "کتاب", emoji: "📖", meaning: "book", say: "کتاب" },
      { parts: ["چ", "ن"], joined: "چن", emoji: "🌙", meaning: "moon", say: "چن" },
      { parts: ["پ", "ا", "ن", "ی"], joined: "پانی", emoji: "💧", meaning: "water", say: "پانی" },
      { parts: ["گ", "ل", "ا", "ب"], joined: "گلاب", emoji: "🌹", meaning: "rose", say: "گلاب" },
      { parts: ["م", "ا", "ں"], joined: "ماں", emoji: "👩", meaning: "mother", say: "ماں" },
    ],
  },
  {
    code: "hi", label: "Hindi", native: "हिन्दी", script: "indic", dir: "ltr", speech: "hi-IN",
    note: "हिन्दी में १३ स्वर और ३३ व्यंजन हैं। अक्षर एक रेखा पर बैठते हैं और मात्राएँ उनसे जुड़ती हैं।",
    joinDemo: [
      { a: "क", b: "ा", result: "का", caption: "क + ा" },
      { a: "क", b: "ि", result: "कि", caption: "क + ि" },
      { a: "क", b: "ी", result: "की", caption: "क + ी" },
    ],
    letters: HI_LETTERS,
    words: [
      { parts: ["क", "म", "ल"], joined: "कमल", emoji: "🪷", meaning: "lotus", say: "कमल" },
      { parts: ["घ", "र"], joined: "घर", emoji: "🏠", meaning: "house", say: "घर" },
      { parts: ["म", "छ", "ल", "ी"], joined: "मछली", emoji: "🐟", meaning: "fish", say: "मछली" },
      { parts: ["सू", "र", "ज"], joined: "सूरज", emoji: "☀️", meaning: "sun", say: "सूरज" },
      { parts: ["ब", "क", "र", "ी"], joined: "बकरी", emoji: "🐐", meaning: "goat", say: "बकरी" },
      { parts: ["ति", "त", "ल", "ी"], joined: "तितली", emoji: "🦋", meaning: "butterfly", say: "तितली" },
    ],
  },
  {
    code: "bn", label: "Bengali", native: "বাংলা", script: "indic", dir: "ltr", speech: "bn-IN",
    note: "বাংলায় ১১টি স্বরবর্ণ ও ৩৯টি ব্যঞ্জনবর্ণ আছে। অক্ষরগুলো মাত্রার নিচে বসে শব্দ তৈরি করে।",
    joinDemo: [
      { a: "ক", b: "া", result: "কা", caption: "ক + া" },
      { a: "ক", b: "ি", result: "কি", caption: "ক + ি" },
      { a: "ক", b: "ে", result: "কে", caption: "ক + ে" },
    ],
    letters: BN_LETTERS,
    words: [
      { parts: ["ব", "ই"], joined: "বই", emoji: "📖", meaning: "book", say: "বই" },
      { parts: ["ম", "া", "ছ"], joined: "মাছ", emoji: "🐟", meaning: "fish", say: "মাছ" },
      { parts: ["ফু", "ল"], joined: "ফুল", emoji: "🌸", meaning: "flower", say: "ফুল" },
      { parts: ["চ", "া", "ঁ", "দ"], joined: "চাঁদ", emoji: "🌙", meaning: "moon", say: "চাঁদ" },
      { parts: ["পা", "খি"], joined: "পাখি", emoji: "🐦", meaning: "bird", say: "পাখি" },
    ],
  },
  {
    code: "zh", label: "Chinese", native: "中文", script: "han", dir: "ltr", speech: "zh-CN",
    note: "中文不用字母，而是用汉字。简单的字可以组合成新字 —— 日 + 月 = 明（明亮）。",
    joinDemo: [
      { a: "日", b: "月", result: "明", caption: "sun + moon = bright" },
      { a: "木", b: "木", result: "林", caption: "tree + tree = woods" },
      { a: "女", b: "子", result: "好", caption: "woman + child = good" },
    ],
    letters: ZH_LETTERS,
    words: [
      { parts: ["日", "月"], joined: "明", emoji: "💡", meaning: "bright", say: "明" },
      { parts: ["木", "木"], joined: "林", emoji: "🌳", meaning: "woods", say: "林" },
      { parts: ["女", "子"], joined: "好", emoji: "👍", meaning: "good", say: "好" },
      { parts: ["人", "人", "人"], joined: "众", emoji: "👥", meaning: "crowd", say: "众" },
      { parts: ["小", "大"], joined: "尖", emoji: "📐", meaning: "sharp point", say: "尖" },
      { parts: ["水", "田"], joined: "沓", emoji: "💧", meaning: "flowing", say: "沓" },
    ],
  },
];

export const alphabetFor = (code: string) =>
  ALPHABETS.find((a) => a.code === code) ?? ALPHABETS[0];

/** Each app language opens its own script by default. */
export function defaultAlphabet(lang: string): Alphabet {
  return ALPHABETS.find((a) => a.code === lang) ?? alphabetFor("en");
}

/** Build the positional form a letter takes inside a word. */
export function formAt(letter: Letter, index: number, total: number, prevJoins: boolean): string {
  if (!letter.forms) return letter.char;
  const isFirst = index === 0 || !prevJoins;
  const isLast = index === total - 1;
  if (isFirst && isLast) return letter.char;
  if (isFirst) return letter.forms.initial;
  if (isLast) return letter.forms.final;
  return letter.forms.medial;
}

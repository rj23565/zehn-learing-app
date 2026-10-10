export type Slide = {
  heading: string;
  body: string;
  simple: string;
  visual:
    | { kind: "icon"; icon: string }
    | { kind: "cycle"; icons: string[] }
    | { kind: "bullets"; items: string[] }
    | { kind: "steps"; items: string[] }
    | { kind: "big"; value: string; label: string };
};

export type QuizQuestion = { q: string; options: string[]; a: number };

export type LessonLevel = "easy" | "normal" | "hard";

export type LessonSeed = {
  band: "early" | "primary" | "middle" | "high" | "senior";
  subject: string;
  level?: LessonLevel;
  country?: string;
  orderIndex: number;
  title: string;
  icon: string;
  color: string;
  minutes: number;
  intro: string;
  slides: Slide[];
  quiz: QuizQuestion[];
};

export const CURRICULUM: LessonSeed[] = [
  /* ============================= EARLY (Playgroup – KG) ============================= */
  {
    band: "early", subject: "Numbers", orderIndex: 1, title: "Counting 1 to 10",
    icon: "Hash", color: "amber", minutes: 3,
    intro: "Meet the numbers! Count stars, apples and friends from one to ten.",
    slides: [
      { heading: "Hello, numbers!", body: "Numbers help us count things. One sun, two eyes, three little pigs. Let's count together!", simple: "Numbers count things. Let's count!", visual: { kind: "icon", icon: "Sun" } },
      { heading: "One, two, three", body: "One is a single star in the sky. Two is a pair of shoes for your feet. Three is a triangle with three pointy corners.", simple: "One star. Two shoes. Three corners.", visual: { kind: "steps", items: ["1 — one star", "2 — two shoes", "3 — three corners"] } },
      { heading: "Four to seven", body: "Four legs on a happy dog. Five fingers on your hand. Six strings on a guitar. Seven colors in a rainbow!", simple: "Four dog legs. Five fingers. Six strings. Seven rainbow colors.", visual: { kind: "bullets", items: ["4 — dog legs", "5 — fingers", "6 — guitar strings", "7 — rainbow colors"] } },
      { heading: "Eight, nine, ten!", body: "Eight legs on a spider. Nine planets dancing? No — eight planets plus one sun makes nine bright things! And ten — ten fingers on two hands. You did it!", simple: "Eight spider legs. Ten fingers. Hooray!", visual: { kind: "big", value: "10", label: "You can count to ten!" } },
    ],
    quiz: [
      { q: "How many fingers are on one hand?", options: ["3", "5", "7"], a: 1 },
      { q: "Which animal has eight legs?", options: ["Dog", "Spider", "Fish"], a: 1 },
      { q: "What comes after 3?", options: ["2", "5", "4"], a: 2 },
    ],
  },
  {
    band: "early", subject: "Colors & Shapes", orderIndex: 2, title: "Colors & Shapes Everywhere",
    icon: "Palette", color: "pink", minutes: 3,
    intro: "Red apples, round balls — discover the colors and shapes hiding all around you.",
    slides: [
      { heading: "A world of color", body: "Look around! The sky is blue, leaves are green, and bananas are yellow. Colors make our world bright and happy.", simple: "The world is full of colors!", visual: { kind: "icon", icon: "Palette" } },
      { heading: "Meet the shapes", body: "A circle is round like the sun. A square has four equal sides like a window. A triangle has three sides like a slice of pizza.", simple: "Circle is round. Square has 4 sides. Triangle has 3 sides.", visual: { kind: "bullets", items: ["Circle — round like the sun", "Square — like a window", "Triangle — like pizza"] } },
      { heading: "Shape hunt", body: "Your clock is a circle, your book is a rectangle, and a road sign can be a triangle. Shapes are hiding everywhere!", simple: "Shapes are everywhere. Can you find them?", visual: { kind: "icon", icon: "Search" } },
      { heading: "Mix it up!", body: "When blue and yellow hug together, they make green! Red and white make pink. You are a little color scientist.", simple: "Blue + yellow = green. Magic!", visual: { kind: "big", value: "B+Y", label: "= Green! Colors love to mix" } },
    ],
    quiz: [
      { q: "Which shape is round?", options: ["Square", "Circle", "Triangle"], a: 1 },
      { q: "Blue + yellow makes…", options: ["Green", "Purple", "Orange"], a: 0 },
      { q: "How many sides does a triangle have?", options: ["4", "3", "5"], a: 1 },
    ],
  },
  {
    band: "early", subject: "ABC Letters", orderIndex: 3, title: "A, B, C — Letter Friends",
    icon: "Type", color: "sky", minutes: 3,
    intro: "Sing with the letters! Every letter has a sound and a favorite word.",
    slides: [
      { heading: "Letters are everywhere", body: "Letters are little shapes that make sounds. Put them together and they make words — like cat, dog, and your name!", simple: "Letters make words!", visual: { kind: "icon", icon: "Type" } },
      { heading: "A, B, C", body: "A says 'ah' like Apple. B says 'buh' like Ball. C says 'kuh' like Cat. Can you say them with me?", simple: "A — Apple. B — Ball. C — Cat.", visual: { kind: "steps", items: ["A — Apple", "B — Ball", "C — Cat"] } },
      { heading: "Big and small", body: "Every letter has a big shape and a small shape. Big A and small a are best friends — like an elephant and a baby elephant.", simple: "Big A, small a. They are friends!", visual: { kind: "big", value: "Aa", label: "Big letter, little letter" } },
      { heading: "Your name!", body: "The best letters are the ones in YOUR name. Say each letter of your name slowly. You just read a word — amazing!", simple: "Your name is made of letters!", visual: { kind: "icon", icon: "Sparkles" } },
    ],
    quiz: [
      { q: "Which letter says 'buh'?", options: ["A", "B", "C"], a: 1 },
      { q: "A is for…", options: ["Apple", "Ball", "Cat"], a: 0 },
      { q: "Letters put together make…", options: ["Numbers", "Words", "Colors"], a: 1 },
    ],
  },
  {
    band: "early", subject: "Animals", orderIndex: 4, title: "Animal Friends & Sounds",
    icon: "Rabbit", color: "mint", minutes: 3,
    intro: "Roar like a lion, hop like a bunny — learn what animals say and where they live.",
    slides: [
      { heading: "So many animals!", body: "Animals live all over our planet — in farms, forests, oceans, and even in our homes. Let's meet a few!", simple: "Animals live everywhere!", visual: { kind: "icon", icon: "Rabbit" } },
      { heading: "Farm friends", body: "The cow says moo and gives us milk. The chicken says cluck and lays eggs. The sheep says baa and gives us wool for warm sweaters.", simple: "Cow says moo. Chicken says cluck. Sheep says baa.", visual: { kind: "bullets", items: ["Cow — moo", "Chicken — cluck", "Sheep — baa"] } },
      { heading: "Wild and wonderful", body: "The lion roars — it is called the king of the jungle. The monkey swings and chatters. The elephant trumpets with its long trunk.", simple: "Lion roars! Elephant has a long trunk.", visual: { kind: "icon", icon: "TreePine" } },
      { heading: "Who lives where?", body: "Fish live in water and breathe with gills. Birds build nests in trees. Bears sleep in caves all winter long — that is called hibernation!", simple: "Fish live in water. Birds live in nests.", visual: { kind: "cycle", icons: ["Fish", "Bird", "TentTree"] } },
    ],
    quiz: [
      { q: "What does a cow say?", options: ["Baa", "Moo", "Cluck"], a: 1 },
      { q: "Where does a fish live?", options: ["In a tree", "In water", "In a cave"], a: 1 },
      { q: "Which animal has a trunk?", options: ["Elephant", "Lion", "Sheep"], a: 0 },
    ],
  },

  /* ============================= PRIMARY (Class 1–3) ============================= */
  {
    band: "primary", subject: "Math", orderIndex: 1, title: "Addition & Subtraction Adventures",
    icon: "Calculator", color: "violet", minutes: 4,
    intro: "Adding means getting more, taking away means less. Let's play with numbers!",
    slides: [
      { heading: "Adding means more", body: "When you add, groups come together. Two apples plus three apples makes five apples. We write it like this: 2 + 3 = 5.", simple: "2 apples + 3 apples = 5 apples!", visual: { kind: "big", value: "2+3", label: "= 5 — adding makes more!" } },
      { heading: "Taking away", body: "Subtraction means some go away. You had 5 candies and ate 2. How many are left? 5 − 2 = 3. Three candies for later!", simple: "5 candies − 2 eaten = 3 left.", visual: { kind: "big", value: "5−2", label: "= 3 — taking away leaves less" } },
      { heading: "Number line hops", body: "Imagine a frog on a number line. To add, hop forward. To subtract, hop back. For 4 + 2, start on 4, hop two jumps forward… and land on 6!", simple: "Hop forward to add, hop back to subtract.", visual: { kind: "steps", items: ["Start on 4", "Hop → 5", "Hop → 6", "4 + 2 = 6"] } },
      { heading: "Flip it around", body: "Addition has a trick: 3 + 4 is the same as 4 + 3. Both make 7! This is called the commutative property — a big word for a simple idea.", simple: "3+4 and 4+3 both make 7!", visual: { kind: "icon", icon: "ArrowLeftRight" } },
    ],
    quiz: [
      { q: "2 + 3 = ?", options: ["4", "5", "6"], a: 1 },
      { q: "5 − 2 = ?", options: ["2", "3", "7"], a: 1 },
      { q: "4 + 3 is the same as…", options: ["3 + 4", "4 − 3", "3 − 4"], a: 0 },
    ],
  },
  {
    band: "primary", subject: "Science", orderIndex: 2, title: "How Plants Grow",
    icon: "Sprout", color: "mint", minutes: 4,
    intro: "From a tiny seed to a tall sunflower — discover the secret life of plants.",
    slides: [
      { heading: "It starts with a seed", body: "Every big plant begins as a tiny seed. Inside the seed sleeps a baby plant with a little packed lunch of food.", simple: "Plants begin as tiny seeds.", visual: { kind: "icon", icon: "Sprout" } },
      { heading: "What plants need", body: "Plants need four things to grow: water to drink, sunlight for energy, air to breathe, and good soil to hold their roots. Just like you need food, water and air!", simple: "Plants need water, sun, air and soil.", visual: { kind: "bullets", items: ["Water to drink", "Sunlight for energy", "Fresh air", "Good soil"] } },
      { heading: "Roots and shoots", body: "First, roots grow down to drink water from the soil. Then a green shoot pushes up toward the light. Roots go down, shoots go up!", simple: "Roots grow down. Shoots grow up!", visual: { kind: "steps", items: ["Seed in soil", "Roots grow down", "Shoot grows up", "First leaves open"] } },
      { heading: "Flowers to fruit", body: "When the plant is strong, it grows flowers. Bees visit the flowers, and soon fruit appears — full of new seeds. The adventure starts all over again!", simple: "Flowers become fruit with new seeds.", visual: { kind: "cycle", icons: ["Sprout", "Sun", "Flower2", "Apple"] } },
    ],
    quiz: [
      { q: "What does a plant begin as?", options: ["A leaf", "A seed", "A flower"], a: 1 },
      { q: "Where do roots grow?", options: ["Down into soil", "Up into sky", "Sideways only"], a: 0 },
      { q: "Which insect helps flowers make fruit?", options: ["Ant", "Bee", "Mosquito"], a: 1 },
    ],
  },
  {
    band: "primary", subject: "Science", orderIndex: 3, title: "My Five Super Senses",
    icon: "Eye", color: "amber", minutes: 4,
    intro: "See, hear, smell, taste, touch — your body has five amazing superpowers!",
    slides: [
      { heading: "Five superpowers", body: "Your body collects information with five senses: sight, hearing, smell, taste and touch. They work together like a superhero team!", simple: "You have five senses — five superpowers!", visual: { kind: "big", value: "5", label: "super senses" } },
      { heading: "Eyes and ears", body: "Your eyes see colors, shapes and movement. Your ears hear sounds — loud drums and quiet whispers. They help you enjoy cartoons and music!", simple: "Eyes see. Ears hear.", visual: { kind: "bullets", items: ["Eyes — see", "Ears — hear", "Nose — smell", "Tongue — taste", "Skin — touch"] } },
      { heading: "Nose, tongue, skin", body: "Your nose smells cookies baking. Your tongue tastes sweet, sour, salty and bitter. Your skin feels soft kittens, cold ice and warm sunshine.", simple: "Nose smells. Tongue tastes. Skin feels.", visual: { kind: "icon", icon: "Hand" } },
      { heading: "Senses keep you safe", body: "Senses are bodyguards too! Smoke smells warn you of fire, a hot pan feels hot so you pull your hand away fast. Listen to your senses!", simple: "Senses protect you from danger!", visual: { kind: "icon", icon: "ShieldCheck" } },
    ],
    quiz: [
      { q: "How many senses do we have?", options: ["3", "5", "7"], a: 1 },
      { q: "Which organ do we hear with?", options: ["Ears", "Eyes", "Nose"], a: 0 },
      { q: "Your tongue can taste…", options: ["Sounds", "Sweet and sour", "Colors"], a: 1 },
    ],
  },
  {
    band: "primary", subject: "English", orderIndex: 4, title: "Words That Build Sentences",
    icon: "WholeWord", color: "sky", minutes: 4,
    intro: "Naming words, doing words, describing words — the three builders of every sentence.",
    slides: [
      { heading: "Sentences are teams", body: "A sentence is a team of words working together. 'The cat sleeps.' Every word has a special job!", simple: "Words team up to make sentences.", visual: { kind: "icon", icon: "WholeWord" } },
      { heading: "Naming words", body: "Nouns are naming words — they name people, places, animals and things. Teacher, school, dog, ball. Can you name three things near you right now?", simple: "Nouns name things — like dog, ball, school.", visual: { kind: "bullets", items: ["Person — teacher", "Place — school", "Animal — dog", "Thing — ball"] } },
      { heading: "Doing words", body: "Verbs are action words. Run, jump, read, sing! Without verbs nothing happens. 'Birds fly.' — fly is the action.", simple: "Verbs are action words — run, jump, read!", visual: { kind: "icon", icon: "Zap" } },
      { heading: "Describing words", body: "Adjectives add sparkle. A big, red, shiny apple sounds yummier than just 'apple'. Describing words paint pictures in the listener's mind!", simple: "Adjectives describe — big, red, shiny!", visual: { kind: "big", value: "Adj", label: "the sparkle words" } },
    ],
    quiz: [
      { q: "Which word is a noun?", options: ["Run", "Dog", "Quickly"], a: 1 },
      { q: "Which word is an action word?", options: ["Table", "Jump", "Blue"], a: 1 },
      { q: "'Big' and 'shiny' are…", options: ["Describing words", "Naming words", "Action words"], a: 0 },
    ],
  },

  /* ============================= MIDDLE (Class 4–6) ============================= */
  {
    band: "middle", subject: "Math", orderIndex: 1, title: "Multiplication & Division Magic",
    icon: "X", color: "violet", minutes: 5,
    intro: "Times tables are just fast adding, and division is fair sharing. Let's unlock the magic!",
    slides: [
      { heading: "Fast adding", body: "Multiplication is adding the same number again and again. 4 × 3 means 4 + 4 + 4 = 12. Three groups of four make twelve!", simple: "4 × 3 = 4 + 4 + 4 = 12.", visual: { kind: "big", value: "4×3", label: "= 12 — three groups of four" } },
      { heading: "Arrays everywhere", body: "Egg boxes, chocolate bars and classroom chairs are arrays — rows and columns. 2 rows of 6 eggs = 12 eggs. Counting by groups is faster than counting one by one!", simple: "Rows × columns = total. Fast counting!", visual: { kind: "bullets", items: ["Egg boxes", "Chocolate bars", "Chairs in rows"] } },
      { heading: "Sharing fairly", body: "Division is sharing into equal groups. 12 cookies shared by 4 friends: each gets 12 ÷ 4 = 3 cookies. Fair and square!", simple: "12 cookies ÷ 4 friends = 3 each.", visual: { kind: "big", value: "12÷4", label: "= 3 cookies each" } },
      { heading: "Best friends forever", body: "Multiply and divide are opposites — like up and down. If 5 × 6 = 30, then 30 ÷ 6 = 5. Knowing one fact gives you the other for free!", simple: "5 × 6 = 30, so 30 ÷ 6 = 5.", visual: { kind: "cycle", icons: ["X", "Divide", "Check", "Repeat"] } },
    ],
    quiz: [
      { q: "4 × 3 = ?", options: ["7", "12", "43"], a: 1 },
      { q: "12 ÷ 4 = ?", options: ["3", "4", "8"], a: 0 },
      { q: "If 5 × 6 = 30, then 30 ÷ 5 = ?", options: ["5", "6", "25"], a: 1 },
    ],
  },
  {
    band: "middle", subject: "Math", orderIndex: 2, title: "Fractions Are Fun",
    icon: "PieChart", color: "amber", minutes: 5,
    intro: "Half a pizza, a quarter of an hour — fractions are just fair shares of one whole.",
    slides: [
      { heading: "One whole, many parts", body: "A fraction shows part of a whole. Cut a pizza into 2 equal pieces and each piece is one half — written as 1/2.", simple: "1/2 means one piece out of two equal pieces.", visual: { kind: "icon", icon: "PieChart" } },
      { heading: "Top and bottom", body: "The bottom number says how many equal parts in total. The top number says how many parts you have. In 3/4: 4 parts in total, you have 3. Bottom = total, top = taken!", simple: "Bottom number = total parts. Top = your parts.", visual: { kind: "big", value: "¾", label: "3 of 4 equal parts" } },
      { heading: "Fractions you know", body: "You already speak fractions! 'Half an hour' is 30 minutes, 'a quarter past' is 15 minutes past. Money and time run on fractions.", simple: "Half an hour = 30 minutes. Quarter = 15 minutes.", visual: { kind: "steps", items: ["1 hour = 60 min", "1/2 hour = 30 min", "1/4 hour = 15 min"] } },
      { heading: "Same amount, new look", body: "1/2 and 2/4 look different but show the same amount — try folding a paper! These are called equivalent fractions.", simple: "1/2 = 2/4. Same amount!", visual: { kind: "icon", icon: "Equal" } },
    ],
    quiz: [
      { q: "In 3/4, the 4 tells us…", options: ["Total equal parts", "Parts you have", "Nothing"], a: 0 },
      { q: "Half an hour is…", options: ["15 min", "30 min", "60 min"], a: 1 },
      { q: "Which equals 1/2?", options: ["1/4", "2/4", "3/4"], a: 1 },
    ],
  },
  {
    band: "middle", subject: "Science", orderIndex: 3, title: "The Great Water Cycle",
    icon: "CloudRain", color: "sky", minutes: 5,
    intro: "The water you drink may once have been dinosaur water! Follow the endless journey.",
    slides: [
      { heading: "Water never stops", body: "All the water on Earth keeps moving in a giant loop called the water cycle. The same water has been recycled for billions of years!", simple: "Water moves in a big loop, forever!", visual: { kind: "cycle", icons: ["Sun", "Cloud", "CloudRain", "Waves"] } },
      { heading: "Up, up, evaporation", body: "The sun heats water in oceans, lakes and puddles. The water turns into invisible vapor and floats up into the sky. This is evaporation.", simple: "Sun heats water → it rises as vapor.", visual: { kind: "icon", icon: "Sun" } },
      { heading: "Clouds are born", body: "High up where the air is cold, vapor cools down and turns back into tiny droplets. Millions of droplets huddle together — that is a cloud! This is condensation.", simple: "Cold air turns vapor into droplets → clouds!", visual: { kind: "icon", icon: "Cloud" } },
      { heading: "Rain, rain, fall again", body: "When droplets get too heavy, they fall as rain, snow or hail — precipitation! Water flows back to rivers and oceans, and the cycle begins again.", simple: "Heavy droplets fall as rain. The loop restarts!", visual: { kind: "steps", items: ["Evaporation", "Condensation", "Precipitation", "Collection"] } },
    ],
    quiz: [
      { q: "The sun turning puddle water into vapor is…", options: ["Condensation", "Evaporation", "Precipitation"], a: 1 },
      { q: "Clouds are made of…", options: ["Smoke", "Tiny water droplets", "Cotton"], a: 1 },
      { q: "Rain and snow are called…", options: ["Precipitation", "Evaporation", "Collection"], a: 0 },
    ],
  },
  {
    band: "middle", subject: "Science", orderIndex: 4, title: "Our Solar System",
    icon: "Rocket", color: "pink", minutes: 5,
    intro: "Eight planets, one star, and a neighborhood full of wonders — let's go to space!",
    slides: [
      { heading: "Home base", body: "Our solar system has one star — the Sun — and eight planets that travel around it in paths called orbits. Gravity holds the whole family together.", simple: "8 planets orbit 1 Sun. Gravity holds them.", visual: { kind: "big", value: "8", label: "planets around 1 Sun" } },
      { heading: "The rocky four", body: "Mercury, Venus, Earth and Mars are small rocky planets close to the Sun. Earth is the only one with liquid water oceans and life — so far as we know!", simple: "4 rocky planets live near the Sun. Earth has life!", visual: { kind: "bullets", items: ["Mercury — fastest", "Venus — hottest", "Earth — our home", "Mars — the red planet"] } },
      { heading: "The giant four", body: "Jupiter and Saturn are gas giants — Saturn wears famous ice rings! Uranus and Neptune are icy and far away where sunlight is weak.", simple: "4 giant planets live far away. Saturn has rings!", visual: { kind: "bullets", items: ["Jupiter — biggest", "Saturn — the rings", "Uranus — rolls on its side", "Neptune — windiest"] } },
      { heading: "Why day and night?", body: "Earth spins like a top once every 24 hours. The side facing the Sun has daytime; the other side has night. And Earth's year-long trip around the Sun gives us seasons!", simple: "Earth spins = day & night. Orbiting = seasons.", visual: { kind: "cycle", icons: ["Sun", "Earth", "Moon", "Star"] } },
    ],
    quiz: [
      { q: "How many planets orbit our Sun?", options: ["7", "8", "9"], a: 1 },
      { q: "Which planet has famous rings?", options: ["Mars", "Saturn", "Venus"], a: 1 },
      { q: "Day and night happen because Earth…", options: ["Stops moving", "Spins", "Has rings"], a: 1 },
    ],
  },

  /* ============================= HIGH (Class 7–9) ============================= */
  {
    band: "high", subject: "Math", orderIndex: 1, title: "Algebra: The Letter Detectives",
    icon: "Variable", color: "violet", minutes: 5,
    intro: "x is not scary — it's just a mystery number waiting for you to solve it.",
    slides: [
      { heading: "Mystery numbers", body: "Algebra uses letters to stand in for numbers we don't know yet. In x + 3 = 7, the letter x hides a secret number. Detective work: x = 4!", simple: "x is a hidden number. x + 3 = 7 means x = 4.", visual: { kind: "big", value: "x+3=7", label: "find the hidden number" } },
      { heading: "Balance is the law", body: "An equation is a balance scale. Whatever you do to one side, you must do to the other. Subtract 3 from both sides of x + 3 = 7 and the scale stays fair: x = 4.", simple: "Do the same to both sides. Keep the balance!", visual: { kind: "icon", icon: "Scale" } },
      { heading: "Undo it", body: "Solving means undoing operations in reverse. For 2x = 10, x is doubled — so undo by dividing: x = 10 ÷ 2 = 5. Addition undoes subtraction; division undoes multiplication.", simple: "Do the opposite to solve. 2x = 10 → x = 5.", visual: { kind: "steps", items: ["2x = 10", "Undo the ×2", "Divide by 2", "x = 5"] } },
      { heading: "Real-life powers", body: "Algebra powers phone games, space rockets, and your pocket-money plans! It's the grammar of mathematics — once you learn it, you can read the universe.", simple: "Algebra runs games, rockets and money plans.", visual: { kind: "icon", icon: "Rocket" } },
    ],
    quiz: [
      { q: "If x + 3 = 7, then x = ?", options: ["3", "4", "10"], a: 1 },
      { q: "If 2x = 10, then x = ?", options: ["5", "8", "20"], a: 0 },
      { q: "An equation must stay…", options: ["Balanced", "Big", "Secret"], a: 0 },
    ],
  },
  {
    band: "high", subject: "Science", orderIndex: 2, title: "Photosynthesis: How Plants Eat Light",
    icon: "Leaf", color: "mint", minutes: 5,
    intro: "Plants cook their own food using sunlight — and breathe out the oxygen you need.",
    slides: [
      { heading: "Solar-powered chefs", body: "Plants make their own food in their leaves using sunlight, water and carbon dioxide. This recipe is called photosynthesis — 'photo' means light!", simple: "Plants make food from sunlight, water and air.", visual: { kind: "icon", icon: "Leaf" } },
      { heading: "The recipe", body: "Roots suck up water, leaves catch sunlight with green chlorophyll, and tiny leaf holes called stomata breathe in carbon dioxide. Sunlight powers the kitchen!", simple: "Water + CO₂ + sunlight → plant food.", visual: { kind: "bullets", items: ["Water — from roots", "Sunlight — by chlorophyll", "CO₂ — through stomata"] } },
      { heading: "Sugar and fresh air", body: "The plant cooks these into glucose — a sugar that is its food. The leftover ingredient is oxygen, which the plant breathes out. Every breath you take thanks a plant!", simple: "Plants make sugar and release oxygen for us.", visual: { kind: "cycle", icons: ["Sun", "Droplets", "Wind", "Candy"] } },
      { heading: "Why it matters", body: "Photosynthesis feeds almost every food chain on Earth and fills the air with oxygen. Forests are literally the lungs of our planet.", simple: "Plants feed the world and make our oxygen.", visual: { kind: "icon", icon: "Globe" } },
    ],
    quiz: [
      { q: "Plants make food using sunlight, water and…", options: ["Oxygen", "Carbon dioxide", "Soil"], a: 1 },
      { q: "The green pigment in leaves is…", options: ["Chlorophyll", "Glucose", "Stomata"], a: 0 },
      { q: "Photosynthesis releases…", options: ["Carbon dioxide", "Smoke", "Oxygen"], a: 2 },
    ],
  },
  {
    band: "high", subject: "Science", orderIndex: 3, title: "Electricity & Circuits",
    icon: "Zap", color: "amber", minutes: 5,
    intro: "Tiny electrons on the move power your whole world — let's follow their path.",
    slides: [
      { heading: "Moving electrons", body: "Electricity is the flow of tiny particles called electrons. When they march together through a wire, we get an electric current that can power lamps, fans and phones.", simple: "Electricity = electrons flowing through wires.", visual: { kind: "icon", icon: "Zap" } },
      { heading: "The loop rule", body: "Current only flows in a closed loop called a circuit. Battery, wires, bulb — connected in one unbroken ring and the bulb glows. Break the ring and everything stops. That's how a switch works!", simple: "Current needs a closed loop. A switch opens/closes it.", visual: { kind: "cycle", icons: ["BatteryCharging", "Cable", "Lightbulb", "Power"] } },
      { heading: "Conductors & insulators", body: "Metals like copper let electrons through — they are conductors. Rubber and plastic block them — they are insulators. That's why wires are metal inside and plastic outside!", simple: "Metal conducts. Rubber/plastic blocks.", visual: { kind: "bullets", items: ["Copper — conductor", "Iron nail — conductor", "Rubber — insulator", "Plastic — insulator"] } },
      { heading: "Safety first", body: "Electricity is a useful servant but a dangerous master. Never touch sockets, keep water away from appliances, and always ask an adult for help with repairs.", simple: "Never play with sockets. Electricity bites!", visual: { kind: "icon", icon: "ShieldAlert" } },
    ],
    quiz: [
      { q: "Electric current is the flow of…", options: ["Protons", "Electrons", "Neutrons"], a: 1 },
      { q: "A switch works by…", options: ["Breaking or closing the loop", "Heating the bulb", "Changing colors"], a: 0 },
      { q: "Which is an insulator?", options: ["Copper", "Rubber", "Iron"], a: 1 },
    ],
  },
  {
    band: "high", subject: "English", orderIndex: 4, title: "Grammar Power-Up",
    icon: "BookOpen", color: "sky", minutes: 5,
    intro: "Tenses, punctuation and sentence structure — level up your writing superpowers.",
    slides: [
      { heading: "Time machines called tenses", body: "Verbs travel through time! 'I play' is present, 'I played' is past, 'I will play' is future. The verb form tells your reader WHEN something happens.", simple: "Play = now. Played = before. Will play = later.", visual: { kind: "steps", items: ["Past — played", "Present — play", "Future — will play"] } },
      { heading: "Subject + verb agreement", body: "A sentence is a duet — the subject and verb must match. 'She runs' not 'she run'. One runner: add an s to the verb. Many runners: no s!", simple: "One → 'runs'. Many → 'run'.", visual: { kind: "big", value: "S↔V", label: "subject and verb agree" } },
      { heading: "Punctuation traffic signs", body: "Period is a stop sign. Comma is a speed bump — pause briefly. Question mark asks, exclamation mark shouts! They control how your reader's voice moves.", simple: "Period stops. Comma pauses. ? asks. ! shouts.", visual: { kind: "bullets", items: [". — full stop", ", — short pause", "? — a question", "! — strong feeling"] } },
      { heading: "Show, don't tell", body: "Great writers paint with detail. Instead of 'it was hot', write 'the asphalt shimmered and the dog hid under the car'. Details make readers FEEL your story.", simple: "Use details to make readers feel it.", visual: { kind: "icon", icon: "PenLine" } },
    ],
    quiz: [
      { q: "'I played' is which tense?", options: ["Present", "Past", "Future"], a: 1 },
      { q: "Choose the correct one:", options: ["She run", "She runs", "She running"], a: 1 },
      { q: "A comma tells the reader to…", options: ["Stop fully", "Pause briefly", "Shout"], a: 1 },
    ],
  },

  /* ============================= SENIOR (Class 10–12) ============================= */
  {
    band: "senior", subject: "Math", orderIndex: 1, title: "Quadratic Equations Decoded",
    icon: "Sigma", color: "violet", minutes: 6,
    intro: "ax² + bx + c = 0 — the curve behind basketball arcs, antennas and profit curves.",
    slides: [
      { heading: "Meet the parabola", body: "A quadratic equation has x² as its highest power: ax² + bx + c = 0. Its graph is a U-shaped curve called a parabola — the exact path of a thrown basketball!", simple: "x² makes a U-curve called a parabola.", visual: { kind: "big", value: "ax²+bx+c", label: "= 0 — the parabola equation" } },
      { heading: "Factoring first", body: "Many quadratics split into two brackets. x² + 5x + 6 = 0 becomes (x + 2)(x + 3) = 0, so x = −2 or x = −3. Two numbers that multiply to c and add to b!", simple: "Find 2 numbers: multiply to 6, add to 5 → x = −2, −3.", visual: { kind: "steps", items: ["x² + 5x + 6 = 0", "(x+2)(x+3) = 0", "x = −2 or x = −3"] } },
      { heading: "The universal key", body: "For any quadratic, the quadratic formula always works: x = (−b ± √(b² − 4ac)) / 2a. The part under the root — the discriminant — tells you how many solutions exist.", simple: "The formula solves every quadratic, always.", visual: { kind: "icon", icon: "Sigma" } },
      { heading: "Curves with purpose", body: "Satellite dishes are parabolas that catch signals; bridges use them to spread weight; businesses use them to find the price of maximum profit. Math you can stand under!", simple: "Parabolas shape dishes, bridges and profits.", visual: { kind: "bullets", items: ["Satellite dishes", "Bridge arches", "Profit maximization"] } },
    ],
    quiz: [
      { q: "The graph of a quadratic is a…", options: ["Circle", "Parabola", "Straight line"], a: 1 },
      { q: "x² + 5x + 6 factors to…", options: ["(x+2)(x+3)", "(x+1)(x+6)", "(x−2)(x−3)"], a: 0 },
      { q: "The discriminant sits…", options: ["Inside the square root", "In the denominator", "Outside the formula"], a: 0 },
    ],
  },
  {
    band: "senior", subject: "Science", orderIndex: 2, title: "Chemical Reactions in Daily Life",
    icon: "FlaskConical", color: "pink", minutes: 6,
    intro: "Rust, cake, fireworks — chemistry is cooking atoms into brand-new substances.",
    slides: [
      { heading: "Atoms rearranged", body: "A chemical reaction rearranges atoms into new substances. Rust forming on iron, a cake rising in the oven — atoms reorganize and can never easily go back.", simple: "Reactions shuffle atoms into new stuff.", visual: { kind: "icon", icon: "FlaskConical" } },
      { heading: "Signs of change", body: "How do you know a reaction happened? Look for clues: gas bubbles, color change, heat or light released, a new smell, or a solid precipitate appearing.", simple: "Clues: bubbles, new color, heat, smell, precipitate.", visual: { kind: "bullets", items: ["Bubbles — gas released", "Color change", "Heat or light", "Precipitate forms"] } },
      { heading: "Balancing the books", body: "Atoms are never created or destroyed — a reaction equation must balance. CH₄ + 2O₂ → CO₂ + 2H₂O: count atoms on both sides and they match perfectly!", simple: "Same atoms in = same atoms out. Balance it!", visual: { kind: "big", value: "CH₄+2O₂", label: "→ CO₂ + 2H₂O — perfectly balanced" } },
      { heading: "Speed it up, slow it down", body: "Heat, catalysts and more surface area speed reactions up — that's why powdered sugar dissolves faster and enzymes digest your food. Cold temperatures slow reactions, which is why we refrigerate food!", simple: "Heat & catalysts speed up; cold slows down.", visual: { kind: "cycle", icons: ["Flame", "Snowflake", "Timer", "Atom"] } },
    ],
    quiz: [
      { q: "Rusting is a…", options: ["Physical change", "Chemical reaction", "Illusion"], a: 1 },
      { q: "In a balanced equation, atoms are…", options: ["Created", "Destroyed", "Conserved"], a: 2 },
      { q: "Which speeds up a reaction?", options: ["Cooling", "A catalyst", "Less surface area"], a: 1 },
    ],
  },
  {
    band: "senior", subject: "Physics", orderIndex: 3, title: "Newton's Laws of Motion",
    icon: "Orbit", color: "amber", minutes: 6,
    intro: "Three simple rules explain everything from soccer kicks to rocket launches.",
    slides: [
      { heading: "Law 1 — Lazy objects", body: "An object at rest stays at rest, and a moving object keeps moving straight — unless a force acts on it. This is inertia. It's why you lurch forward when a bus brakes suddenly!", simple: "Things keep doing what they're doing until pushed. Inertia!", visual: { kind: "icon", icon: "Orbit" } },
      { heading: "Law 2 — F = ma", body: "Force equals mass times acceleration. Push a light ball and it flies; push a heavy box with the same force and it barely moves. The heavier the mass, the more force you need.", simple: "F = ma. Heavy things need bigger pushes.", visual: { kind: "big", value: "F=ma", label: "force = mass × acceleration" } },
      { heading: "Law 3 — Action & reaction", body: "Every action has an equal and opposite reaction. A rocket pushes gas down, the gas pushes the rocket up. Swimmers push water back; water pushes them forward!", simple: "Push something, it pushes back equally. Rockets fly this way!", visual: { kind: "cycle", icons: ["Rocket", "ArrowDown", "ArrowUp", "Sparkles"] } },
      { heading: "Physics everywhere", body: "Seatbelts fight your inertia, a cricket bat's force accelerates the ball, and walking is pure action-reaction with the ground. You are a walking physics experiment!", simple: "Seatbelts, sports, walking — all Newton's laws!", visual: { kind: "bullets", items: ["Seatbelts — inertia", "Kicks — F = ma", "Walking — action/reaction"] } },
    ],
    quiz: [
      { q: "Inertia belongs to which law?", options: ["First", "Second", "Third"], a: 0 },
      { q: "F = ma is Newton's…", options: ["First law", "Second law", "Third law"], a: 1 },
      { q: "A rocket rises because…", options: ["Gas pushes down, rocket pushed up", "Air is light", "Gravity stops"], a: 0 },
    ],
  },
  {
    band: "senior", subject: "Math", orderIndex: 4, title: "Probability & Data Sense",
    icon: "Dices", color: "mint", minutes: 6,
    intro: "From weather forecasts to card games — learn to think in chances, not guesses.",
    slides: [
      { heading: "The chance formula", body: "Probability = favorable outcomes ÷ total outcomes. A fair coin has 1 favorable side out of 2 — so P(heads) = 1/2 = 50%. Simple and powerful!", simple: "Chance = what you want ÷ all that can happen.", visual: { kind: "big", value: "P = f/t", label: "favorable ÷ total outcomes" } },
      { heading: "From 0 to 1", body: "Probability lives between 0 and 1. Zero means impossible (a pig flying), one means certain (the sun rising tomorrow). A 0.9 weather forecast means rain is very likely!", simple: "0 = impossible. 1 = certain. In between = maybe!", visual: { kind: "steps", items: ["0 — impossible", "0.5 — a coin flip", "1 — certain"] } },
      { heading: "Dice and decks", body: "A die has 6 faces so P(4) = 1/6. Drawing an ace from 52 cards: 4 aces exist, so P = 4/52 = 1/13. Casinos, games and insurance all run on this math.", simple: "P(roll a 4) = 1/6. P(ace) = 4/52.", visual: { kind: "icon", icon: "Dices" } },
      { heading: "Data beats hunches", body: "Averages, medians and charts turn messy numbers into decisions. But beware — 'average of 5 lakes' doesn't mean none are deep. Smart data readers always ask: what is being averaged?", simple: "Averages summarize; always read data carefully.", visual: { kind: "icon", icon: "ChartColumn" } },
    ],
    quiz: [
      { q: "P(heads) on a fair coin is…", options: ["1/2", "1/6", "1"], a: 0 },
      { q: "A probability of 1 means…", options: ["Impossible", "Certain", "Unlikely"], a: 1 },
      { q: "P(rolling a 4) on one die is…", options: ["1/4", "1/6", "4/6"], a: 1 },
    ],
  },
];

export const BAND_LABEL: Record<LessonSeed["band"], string> = {
  early: "Playgroup – KG",
  primary: "Class 1 – 3",
  middle: "Class 4 – 6",
  high: "Class 7 – 9",
  senior: "Class 10 – 12",
};

export function gradeToBand(grade: number): LessonSeed["band"] {
  if (grade <= 0) return "early";
  if (grade <= 3) return "primary";
  if (grade <= 6) return "middle";
  if (grade <= 9) return "high";
  return "senior";
}

/** Difficulty of a lesson *within* its grade band. */
export function levelOf(l: LessonSeed): LessonLevel {
  if (l.level) return l.level;
  return l.orderIndex <= 2 ? "easy" : l.orderIndex === 3 ? "normal" : "hard";
}

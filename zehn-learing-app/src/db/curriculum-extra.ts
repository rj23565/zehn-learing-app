import type { LessonSeed } from "./curriculum";

/**
 * Expanded subject library — every major school subject, each tagged with a
 * difficulty level (easy / normal / hard) *within* its grade band so learners
 * can choose where to start.
 */
export const CURRICULUM_EXTRA: LessonSeed[] = [
  /* ============================= EARLY ============================= */
  {
    band: "early", subject: "Health", level: "easy", orderIndex: 5, title: "My Body, My Health",
    icon: "Heart", color: "pink", minutes: 3,
    intro: "Wash, eat, sleep, play — the four habits that keep you strong.",
    slides: [
      { heading: "Your amazing body", body: "Your body works hard all day — running, thinking, growing. It needs your help to stay strong and happy.", simple: "Your body works hard. Help it stay strong!", visual: { kind: "icon", icon: "Heart" } },
      { heading: "Four super habits", body: "Wash your hands before eating. Eat colorful fruits and vegetables. Sleep early so your body can repair itself. Play and move every single day.", simple: "Wash hands. Eat fruits. Sleep early. Play daily.", visual: { kind: "bullets", items: ["Wash your hands", "Eat colorful food", "Sleep early", "Move and play"] } },
      { heading: "Germs are tiny", body: "Germs are too small to see, but soap washes them away. That is why we scrub for as long as it takes to sing a short song.", simple: "Soap washes away invisible germs.", visual: { kind: "big", value: "20s", label: "scrub your hands this long" } },
    ],
    quiz: [
      { q: "When should you wash your hands?", options: ["Before eating", "Never", "Only on Sunday"], a: 0 },
      { q: "What helps your body repair itself?", options: ["Staying up late", "Sleep", "Skipping meals"], a: 1 },
      { q: "Soap washes away…", options: ["Colors", "Germs", "Water"], a: 1 },
    ],
  },
  {
    band: "early", subject: "Music", level: "easy", orderIndex: 6, title: "Sounds All Around",
    icon: "Music", color: "violet", minutes: 3,
    intro: "Loud, soft, fast, slow — discover rhythm and the music of the world.",
    slides: [
      { heading: "Listen closely", body: "Close your eyes. Birds chirp, cars hum, rain taps. The whole world is making music all the time.", simple: "The world is full of sounds!", visual: { kind: "icon", icon: "Music" } },
      { heading: "Loud and soft", body: "A drum is loud. A whisper is soft. Music gets exciting when loud and soft take turns.", simple: "Drums are loud. Whispers are soft.", visual: { kind: "bullets", items: ["Drum — loud", "Whisper — soft", "Clap — sharp", "Hum — gentle"] } },
      { heading: "Keep the beat", body: "A beat is a steady pulse, like your heart. Clap along: one, two, three, four. You just played music!", simple: "Clap a steady beat: 1, 2, 3, 4!", visual: { kind: "steps", items: ["Clap 1", "Clap 2", "Clap 3", "Clap 4"] } },
    ],
    quiz: [
      { q: "Which is a loud sound?", options: ["A whisper", "A drum", "A breath"], a: 1 },
      { q: "A steady pulse in music is called a…", options: ["Beat", "Color", "Shape"], a: 0 },
      { q: "How many claps in our beat?", options: ["4", "9", "2"], a: 0 },
    ],
  },

  /* ============================= PRIMARY ============================= */
  {
    band: "primary", subject: "Computer", level: "easy", orderIndex: 5, title: "Meet the Computer",
    icon: "Monitor", color: "sky", minutes: 4,
    intro: "Screen, keyboard, mouse — learn the parts and how machines follow orders.",
    slides: [
      { heading: "A helpful machine", body: "A computer is a machine that follows instructions very fast. It cannot think for itself — it does exactly what we tell it.", simple: "Computers follow our instructions fast.", visual: { kind: "icon", icon: "Monitor" } },
      { heading: "The main parts", body: "The screen shows you things. The keyboard types letters. The mouse points and clicks. Inside, a tiny chip does the thinking work.", simple: "Screen shows. Keyboard types. Mouse clicks.", visual: { kind: "bullets", items: ["Screen — shows", "Keyboard — types", "Mouse — points", "Chip — thinks"] } },
      { heading: "Input and output", body: "What you put IN is input — typing, clicking, speaking. What comes OUT is output — pictures, sound, printed pages.", simple: "Input goes in. Output comes out.", visual: { kind: "cycle", icons: ["Keyboard", "Cpu", "Monitor", "Printer"] } },
    ],
    quiz: [
      { q: "A computer follows…", options: ["Its own feelings", "Our instructions", "The weather"], a: 1 },
      { q: "Which part shows pictures?", options: ["Keyboard", "Screen", "Mouse"], a: 1 },
      { q: "Typing on a keyboard is…", options: ["Input", "Output", "Neither"], a: 0 },
    ],
  },
  {
    band: "primary", subject: "History", level: "normal", orderIndex: 6, title: "Long, Long Ago",
    icon: "Landmark", color: "amber", minutes: 4,
    intro: "How people lived before cities, phones and school buses.",
    slides: [
      { heading: "Before writing", body: "Thousands of years ago there were no books, no cities and no shops. People lived in small groups and moved to follow food.", simple: "Long ago people moved around to find food.", visual: { kind: "icon", icon: "Landmark" } },
      { heading: "Two big inventions", body: "Fire let people cook and stay warm. The wheel let them carry heavy things. These two ideas changed human life forever.", simple: "Fire and the wheel changed everything.", visual: { kind: "bullets", items: ["Fire — cooking and warmth", "Wheel — carrying loads", "Farming — staying in one place", "Writing — saving ideas"] } },
      { heading: "Why history matters", body: "History is the story of choices people made. Studying it helps us repeat the wise choices and avoid the painful mistakes.", simple: "History teaches us from past choices.", visual: { kind: "big", value: "Why?", label: "always ask why it happened" } },
    ],
    quiz: [
      { q: "Before farming, people mostly…", options: ["Stayed in cities", "Moved to find food", "Built factories"], a: 1 },
      { q: "Which invention helped carry heavy loads?", options: ["The wheel", "The pen", "The clock"], a: 0 },
      { q: "History helps us…", options: ["Forget the past", "Learn from past choices", "Stop time"], a: 1 },
    ],
  },
  {
    band: "primary", subject: "Art", level: "easy", orderIndex: 7, title: "Lines, Shapes & Imagination",
    icon: "Palette", color: "pink", minutes: 4,
    intro: "Every drawing in the world starts with a simple line.",
    slides: [
      { heading: "The humble line", body: "Straight, curved, zigzag, spiral — every picture ever drawn is built from lines. Lines can feel calm or excited.", simple: "All drawings start with lines.", visual: { kind: "bullets", items: ["Straight — calm", "Curvy — gentle", "Zigzag — excited", "Spiral — dreamy"] } },
      { heading: "Shapes build everything", body: "A house is a square plus a triangle. A face is a circle with smaller shapes inside. Break big things into simple shapes and anything becomes drawable.", simple: "Break big things into simple shapes.", visual: { kind: "icon", icon: "Palette" } },
      { heading: "There is no wrong art", body: "Art is not about copying perfectly — it is about showing how something feels to you. Your strange, wobbly drawing might be the most interesting one in the room.", simple: "Art shows your feelings. No mistakes!", visual: { kind: "icon", icon: "Sparkles" } },
    ],
    quiz: [
      { q: "Every drawing starts with…", options: ["Lines", "Glue", "Numbers"], a: 0 },
      { q: "A house can be drawn as…", options: ["Square + triangle", "Only circles", "Just a dot"], a: 0 },
      { q: "Good art must be…", options: ["A perfect copy", "Your own expression", "Always gray"], a: 1 },
    ],
  },
  {
    band: "primary", subject: "Environment", level: "normal", orderIndex: 8, title: "Caring for Our Planet",
    icon: "Globe", color: "mint", minutes: 4,
    intro: "Small daily habits that protect the only home we have.",
    slides: [
      { heading: "One shared home", body: "Every animal, plant and person shares one planet. What one of us throws away affects everyone else.", simple: "We all share one planet.", visual: { kind: "icon", icon: "Globe" } },
      { heading: "Reduce, reuse, recycle", body: "Reduce means buy and waste less. Reuse means use things again — a jar becomes a pencil holder. Recycle turns old materials into new ones.", simple: "Use less. Use again. Recycle.", visual: { kind: "steps", items: ["Reduce — waste less", "Reuse — use again", "Recycle — remake"] } },
      { heading: "Your daily power", body: "Turn off lights you are not using. Close the tap while brushing. Carry a cloth bag. Small habits multiplied by millions of people become enormous.", simple: "Small habits add up to big change.", visual: { kind: "bullets", items: ["Switch off lights", "Save water", "Cloth bags", "Plant something"] } },
    ],
    quiz: [
      { q: "Turning a jar into a pencil holder is…", options: ["Reuse", "Reduce", "Wasting"], a: 0 },
      { q: "Which saves water?", options: ["Running taps", "Closing the tap while brushing", "Longer showers"], a: 1 },
      { q: "Small habits by millions of people are…", options: ["Useless", "Enormously powerful", "Illegal"], a: 1 },
    ],
  },

  /* ============================= MIDDLE ============================= */
  {
    band: "middle", subject: "Geography", level: "easy", orderIndex: 5, title: "Continents & Oceans",
    icon: "Map", color: "sky", minutes: 5,
    intro: "Seven continents, five oceans — build your mental map of the world.",
    slides: [
      { heading: "Seven great landmasses", body: "Asia, Africa, North America, South America, Antarctica, Europe and Australia. Asia is the largest and most populated; Antarctica is the coldest and almost empty.", simple: "7 continents. Asia is biggest.", visual: { kind: "bullets", items: ["Asia — largest", "Africa — second", "Antarctica — coldest", "Australia — smallest"] } },
      { heading: "Five connected oceans", body: "The Pacific, Atlantic, Indian, Southern and Arctic oceans are really one connected body of water covering about 71% of Earth's surface.", simple: "5 oceans cover most of Earth.", visual: { kind: "big", value: "71%", label: "of Earth is ocean" } },
      { heading: "Reading a map", body: "Maps use a compass rose (north, south, east, west), a scale for distance and a legend explaining symbols. Learn those three and you can read any map on Earth.", simple: "Compass, scale, legend — read any map.", visual: { kind: "steps", items: ["Find north", "Check the scale", "Read the legend"] } },
    ],
    quiz: [
      { q: "How many continents are there?", options: ["5", "7", "9"], a: 1 },
      { q: "Roughly how much of Earth is ocean?", options: ["30%", "50%", "71%"], a: 2 },
      { q: "A map's legend explains…", options: ["Symbols", "The weather", "History"], a: 0 },
    ],
  },
  {
    band: "middle", subject: "History", level: "normal", orderIndex: 6, title: "Ancient Civilizations",
    icon: "Landmark", color: "amber", minutes: 5,
    intro: "Egypt, Mesopotamia, the Indus Valley and China — where cities began.",
    slides: [
      { heading: "Rivers built cities", body: "The first great civilizations grew beside rivers: the Nile, the Tigris and Euphrates, the Indus and the Yellow River. Rivers meant water, farming and transport.", simple: "Early cities grew beside big rivers.", visual: { kind: "bullets", items: ["Nile — Egypt", "Tigris/Euphrates — Mesopotamia", "Indus — South Asia", "Yellow River — China"] } },
      { heading: "Writing changes everything", body: "Once people could write — cuneiform, hieroglyphs, early Chinese script — they could store laws, trade records and stories beyond one lifetime. Writing is how history begins.", simple: "Writing let ideas outlive people.", visual: { kind: "icon", icon: "ScrollText" } },
      { heading: "Lasting inventions", body: "These civilizations gave us written law, calendars, geometry, city planning, irrigation and the number zero. We still use their ideas every single day.", simple: "Law, calendars, maths — all from ancient cities.", visual: { kind: "cycle", icons: ["Landmark", "ScrollText", "Calculator", "Building2"] } },
    ],
    quiz: [
      { q: "Early civilizations grew near…", options: ["Deserts", "Rivers", "Volcanoes"], a: 1 },
      { q: "Egyptian picture writing is called…", options: ["Hieroglyphs", "Cuneiform", "Braille"], a: 0 },
      { q: "History 'begins' with the invention of…", options: ["Fire", "Writing", "The wheel"], a: 1 },
    ],
  },
  {
    band: "middle", subject: "Computer", level: "normal", orderIndex: 7, title: "How Computers Think",
    icon: "Cpu", color: "violet", minutes: 5,
    intro: "Binary, algorithms and why a machine made of switches can do homework.",
    slides: [
      { heading: "Everything is 1s and 0s", body: "Inside a computer there are billions of tiny switches. On is 1, off is 0. Every photo, song and game is ultimately a very long pattern of 1s and 0s.", simple: "Computers store everything as 1s and 0s.", visual: { kind: "big", value: "1010", label: "binary — the machine's alphabet" } },
      { heading: "Algorithms are recipes", body: "An algorithm is a precise list of steps to solve a problem. A cooking recipe is an algorithm; so is the method you use for long division.", simple: "An algorithm is a step-by-step recipe.", visual: { kind: "steps", items: ["Step 1 — input", "Step 2 — process", "Step 3 — output"] } },
      { heading: "Fast, not clever", body: "A computer is not smarter than you — it is just unimaginably faster and never gets bored. Give it a clear algorithm and it repeats it billions of times without a single complaint.", simple: "Computers are fast, not clever.", visual: { kind: "icon", icon: "Cpu" } },
    ],
    quiz: [
      { q: "Computers store data using…", options: ["Letters only", "1s and 0s", "Colors"], a: 1 },
      { q: "A step-by-step problem-solving method is an…", options: ["Algorithm", "Accident", "Alphabet"], a: 0 },
      { q: "Compared to humans, computers are mainly…", options: ["Wiser", "Much faster", "More creative"], a: 1 },
    ],
  },
  {
    band: "middle", subject: "Economics", level: "hard", orderIndex: 8, title: "Smart Money Basics",
    icon: "Coins", color: "mint", minutes: 5,
    intro: "Needs vs wants, saving, and why budgets give you freedom.",
    slides: [
      { heading: "Needs versus wants", body: "A need keeps you healthy and safe — food, shelter, medicine. A want is nice but optional — sweets, games, new shoes. Spending wisely means needs first.", simple: "Needs first, wants later.", visual: { kind: "bullets", items: ["Need — food, shelter", "Want — toys, treats", "Needs come first", "Wants are rewards"] } },
      { heading: "Why saving wins", body: "If you save a small amount regularly, you can afford bigger things later without borrowing. Saving converts patience into buying power.", simple: "Save a little often to afford big things.", visual: { kind: "big", value: "50/30/20", label: "needs / wants / savings" } },
      { heading: "A budget is a plan", body: "A budget simply says where your money will go before it disappears. People with budgets are not stingier — they are freer, because their money follows their goals.", simple: "A budget plans money before you spend it.", visual: { kind: "cycle", icons: ["Coins", "ClipboardList", "PiggyBank", "Target"] } },
    ],
    quiz: [
      { q: "Which is a need?", options: ["Candy", "Medicine", "A video game"], a: 1 },
      { q: "Saving regularly mainly builds…", options: ["Debt", "Future buying power", "Stress"], a: 1 },
      { q: "A budget is…", options: ["A plan for your money", "A type of tax", "A loan"], a: 0 },
    ],
  },

  /* ============================= HIGH ============================= */
  {
    band: "high", subject: "Geography", level: "normal", orderIndex: 5, title: "Climate & Weather Systems",
    icon: "CloudSun", color: "sky", minutes: 5,
    intro: "Why one place is a desert and another a rainforest — the engine of climate.",
    slides: [
      { heading: "Weather vs climate", body: "Weather is what you get today; climate is what you expect over decades. One cold week does not change a region's climate, just as one bad exam does not define a student.", simple: "Weather = today. Climate = long-term pattern.", visual: { kind: "icon", icon: "CloudSun" } },
      { heading: "The sun drives it all", body: "Sunlight hits the equator directly and the poles at a slant, so equatorial air heats, rises and creates global wind belts. Those belts decide where rain falls and where deserts form.", simple: "Uneven sunlight creates winds and rain belts.", visual: { kind: "steps", items: ["Equator heats", "Air rises", "Winds circulate", "Rain belts form"] } },
      { heading: "Oceans and mountains", body: "Ocean currents carry heat across the planet, and mountains force air upward, dropping rain on one side and leaving a dry rain shadow on the other.", simple: "Currents move heat; mountains make rain shadows.", visual: { kind: "bullets", items: ["Currents move heat", "Mountains lift air", "Wet windward side", "Dry rain shadow"] } },
    ],
    quiz: [
      { q: "Climate describes…", options: ["Today's sky", "Long-term patterns", "One storm"], a: 1 },
      { q: "Global wind belts exist because sunlight is…", options: ["Uniform", "Uneven across latitudes", "Only at night"], a: 1 },
      { q: "The dry side of a mountain range is the…", options: ["Rain shadow", "Windward side", "Equator"], a: 0 },
    ],
  },
  {
    band: "high", subject: "Computer", level: "hard", orderIndex: 6, title: "Coding Logic & Algorithms",
    icon: "Code", color: "violet", minutes: 6,
    intro: "Loops, conditions and the thinking patterns behind every program.",
    slides: [
      { heading: "Three building blocks", body: "Almost every program ever written uses just three structures: sequence (do this, then that), selection (if/else choices) and iteration (repeat while something is true).", simple: "Sequence, if/else, and loops build all programs.", visual: { kind: "bullets", items: ["Sequence — in order", "Selection — if / else", "Iteration — loops", "Functions — reuse"] } },
      { heading: "Decompose the problem", body: "Professional coders never solve a big problem at once. They break it into small, testable pieces, solve each one, then combine. This is decomposition — the single most useful habit in computing.", simple: "Break big problems into small testable parts.", visual: { kind: "steps", items: ["Break it down", "Solve one piece", "Test it", "Combine"] } },
      { heading: "Efficiency matters", body: "Two programs can give the same answer but one takes a second and the other a week. Searching a sorted list by halving it repeatedly (binary search) beats checking every item — that difference is what algorithm design is about.", simple: "Good algorithms get the same answer far faster.", visual: { kind: "big", value: "O(log n)", label: "binary search beats checking everything" } },
    ],
    quiz: [
      { q: "Which is NOT one of the three core structures?", options: ["Sequence", "Selection", "Painting"], a: 2 },
      { q: "Breaking a big problem into small parts is…", options: ["Decomposition", "Compilation", "Encryption"], a: 0 },
      { q: "Binary search works by repeatedly…", options: ["Halving the search range", "Checking every item", "Guessing randomly"], a: 0 },
    ],
  },
  {
    band: "high", subject: "Health", level: "normal", orderIndex: 7, title: "Nutrition & Fitness Science",
    icon: "Dumbbell", color: "mint", minutes: 5,
    intro: "What food actually does inside you, and how training rebuilds the body.",
    slides: [
      { heading: "Three macronutrients", body: "Carbohydrates are quick fuel, proteins are building blocks for muscle and repair, and fats support hormones and the brain. You need all three in sensible balance.", simple: "Carbs fuel, protein builds, fats support.", visual: { kind: "bullets", items: ["Carbs — energy", "Protein — repair", "Fats — hormones", "Water — everything"] } },
      { heading: "Training breaks, rest builds", body: "Exercise creates tiny stresses in muscle fibers. The actual growth happens afterwards during rest and sleep. Training without recovery is just damage.", simple: "Muscles grow while you rest, not while you train.", visual: { kind: "cycle", icons: ["Dumbbell", "Flame", "Moon", "TrendingUp"] } },
      { heading: "The brain-body link", body: "Aerobic exercise increases blood flow to the brain and boosts BDNF, a protein that helps form new connections. Students who move regularly measurably learn and remember better.", simple: "Exercise makes your brain learn better too.", visual: { kind: "icon", icon: "Brain" } },
    ],
    quiz: [
      { q: "Which macronutrient mainly repairs muscle?", options: ["Protein", "Carbohydrate", "Fat"], a: 0 },
      { q: "Muscle growth mostly happens…", options: ["During the workout", "During rest and sleep", "While eating sugar"], a: 1 },
      { q: "Regular aerobic exercise helps the brain by…", options: ["Reducing blood flow", "Boosting new connections", "Removing memory"], a: 1 },
    ],
  },
  {
    band: "high", subject: "Art", level: "easy", orderIndex: 8, title: "Perspective & Composition",
    icon: "Frame", color: "pink", minutes: 5,
    intro: "The professional tricks that make flat drawings feel three-dimensional.",
    slides: [
      { heading: "The vanishing point", body: "Parallel lines appear to meet at a single point on the horizon. Place that vanishing point and suddenly roads, rooms and buildings look convincingly deep.", simple: "Lines meeting at one point create depth.", visual: { kind: "icon", icon: "Frame" } },
      { heading: "Rule of thirds", body: "Split your canvas into a 3×3 grid and place the important subject along those lines or crossings. It instantly looks more balanced than dead-center placement.", simple: "Place subjects on a 3×3 grid, not the center.", visual: { kind: "big", value: "3×3", label: "the composition grid" } },
      { heading: "Light makes form", body: "A circle becomes a sphere the moment you add a light side, a shadow side and a cast shadow. Deciding where your light comes from is the fastest route to realism.", simple: "Add light and shadow to make shapes solid.", visual: { kind: "steps", items: ["Pick a light direction", "Add the shadow side", "Add a cast shadow", "Add a highlight"] } },
    ],
    quiz: [
      { q: "Parallel lines appear to meet at the…", options: ["Vanishing point", "Corner", "Frame"], a: 0 },
      { q: "The rule of thirds uses a grid of…", options: ["2×2", "3×3", "5×5"], a: 1 },
      { q: "A circle becomes a sphere when you add…", options: ["More circles", "Light and shadow", "Text"], a: 1 },
    ],
  },

  /* ============================= SENIOR ============================= */
  {
    band: "senior", subject: "Computer", level: "hard", orderIndex: 5, title: "AI & How Machines Learn",
    icon: "Bot", color: "violet", minutes: 6,
    intro: "Training data, patterns and the honest limits of artificial intelligence.",
    slides: [
      { heading: "Learning from examples", body: "Classical software follows rules a human wrote. Machine learning flips this: you show the system thousands of examples and it infers the rules itself by adjusting internal numbers called weights.", simple: "AI learns rules from examples, not instructions.", visual: { kind: "icon", icon: "Bot" } },
      { heading: "Training, testing, overfitting", body: "Data is split into training and test sets. If a model memorizes the training data but fails on new data, it has overfitted — the machine-learning equivalent of memorizing answers without understanding.", simple: "Overfitting = memorizing instead of understanding.", visual: { kind: "steps", items: ["Collect data", "Train the model", "Test on new data", "Tune and repeat"] } },
      { heading: "Garbage in, garbage out", body: "A model inherits the biases of its data. If the examples are unfair or incomplete, the predictions will be too. This is why responsible AI starts with honest, representative data — and human oversight.", simple: "Biased data creates biased AI. Humans must check.", visual: { kind: "bullets", items: ["Data quality decides quality", "Bias in → bias out", "Always keep humans in the loop", "Explainability matters"] } },
    ],
    quiz: [
      { q: "Machine learning mainly learns from…", options: ["Hand-written rules", "Examples in data", "Random guessing"], a: 1 },
      { q: "A model that memorizes training data but fails on new data has…", options: ["Overfitted", "Compiled", "Encrypted"], a: 0 },
      { q: "Biased training data usually produces…", options: ["Fairer results", "Biased predictions", "No effect"], a: 1 },
    ],
  },
  {
    band: "senior", subject: "Economics", level: "hard", orderIndex: 6, title: "Economics & Personal Finance",
    icon: "TrendingUp", color: "mint", minutes: 6,
    intro: "Supply, demand, inflation and compound interest — the money rules of adult life.",
    slides: [
      { heading: "Supply and demand", body: "When something is scarce and wanted, its price rises; when it is abundant or unwanted, the price falls. Almost every price you have ever paid is this tug-of-war settling at an equilibrium.", simple: "Scarce + wanted = expensive. That is the market.", visual: { kind: "big", value: "S ⇄ D", label: "price settles where they meet" } },
      { heading: "Inflation quietly bites", body: "Inflation means money loses purchasing power over time. Cash under a mattress shrinks in real value every year — which is exactly why people invest rather than only save.", simple: "Inflation shrinks the value of idle cash.", visual: { kind: "icon", icon: "TrendingUp" } },
      { heading: "Compound interest", body: "Interest earned on interest grows exponentially. Investing a modest amount at 10% from age 20 can outgrow a much larger amount started at 40. Time, not size, is the dominant variable.", simple: "Starting early beats investing more later.", visual: { kind: "steps", items: ["Year 1 — small", "Year 10 — growing", "Year 20 — accelerating", "Year 30 — exponential"] } },
    ],
    quiz: [
      { q: "If supply drops and demand stays high, price usually…", options: ["Rises", "Falls", "Vanishes"], a: 0 },
      { q: "Inflation means money…", options: ["Gains value", "Loses purchasing power", "Is destroyed"], a: 1 },
      { q: "The most powerful variable in compounding is…", options: ["Time", "Luck", "Currency"], a: 0 },
    ],
  },
  {
    band: "senior", subject: "English", level: "hard", orderIndex: 7, title: "Essay & Critical Writing",
    icon: "PenLine", color: "sky", minutes: 6,
    intro: "Build arguments that persuade examiners and readers alike.",
    slides: [
      { heading: "Thesis first", body: "A strong essay announces one clear, arguable claim early. 'Pollution is bad' is not arguable; 'cities should ban private cars in central districts' is. If nobody could disagree, it is not a thesis.", simple: "State one clear, arguable claim up front.", visual: { kind: "icon", icon: "PenLine" } },
      { heading: "The PEEL paragraph", body: "Point: state the idea. Evidence: give a fact, quote or statistic. Explain: show how the evidence supports your point. Link: connect back to the thesis. Four moves, every paragraph.", simple: "Point, Evidence, Explain, Link — in every paragraph.", visual: { kind: "steps", items: ["Point", "Evidence", "Explain", "Link"] } },
      { heading: "Answer the counter-argument", body: "Addressing the strongest opposing view and refuting it makes your essay dramatically more convincing. Ignoring it makes a reader suspect you could not answer it.", simple: "Name the best counter-argument, then refute it.", visual: { kind: "bullets", items: ["Acknowledge the opposing view", "Give it a fair summary", "Refute with evidence", "Return to your thesis"] } },
    ],
    quiz: [
      { q: "A good thesis statement must be…", options: ["Arguable", "Obvious to all", "A question"], a: 0 },
      { q: "In PEEL, the second step is…", options: ["Evidence", "Ending", "Emotion"], a: 0 },
      { q: "Addressing counter-arguments makes an essay…", options: ["Weaker", "More convincing", "Shorter"], a: 1 },
    ],
  },
  {
    band: "senior", subject: "Environment", level: "normal", orderIndex: 8, title: "Earth Systems & Sustainability",
    icon: "Leaf", color: "mint", minutes: 6,
    intro: "Carbon, energy and the science behind living within planetary limits.",
    slides: [
      { heading: "The carbon cycle", body: "Carbon moves constantly between the atmosphere, oceans, soil and living things. Burning fossil fuels releases carbon that was locked away for millions of years, faster than natural sinks can reabsorb it.", simple: "Fossil fuels release stored carbon too quickly.", visual: { kind: "cycle", icons: ["Leaf", "Factory", "Waves", "Wind"] } },
      { heading: "The greenhouse effect", body: "Greenhouse gases let sunlight in and slow heat escaping — a natural effect that keeps Earth habitable. Raising their concentration intensifies it, shifting global temperature and weather extremes.", simple: "More greenhouse gas traps more heat.", visual: { kind: "icon", icon: "Thermometer" } },
      { heading: "Levers that actually matter", body: "The biggest levers are clean electricity, efficient transport, reduced food waste and protected forests. Personal habits matter, but systems and policy move the needle fastest.", simple: "Clean energy, transport, food waste, forests.", visual: { kind: "bullets", items: ["Clean electricity", "Efficient transport", "Less food waste", "Protect forests"] } },
    ],
    quiz: [
      { q: "Burning fossil fuels releases carbon that was…", options: ["Just created", "Stored for millions of years", "Made of water"], a: 1 },
      { q: "Greenhouse gases mainly…", options: ["Slow heat escaping", "Block all sunlight", "Cool the planet"], a: 0 },
      { q: "Which is a large-scale emissions lever?", options: ["Clean electricity", "Shorter emails", "Smaller fonts"], a: 0 },
    ],
  },
];

export type Question = {
  id: number;
  category: string;
  direction?: string;
  directionRange?: string; // e.g. "Q.Nos. 1 - 2"
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
};

const DIR_LOGICAL =
  "Each problem consists of three statements. Based on the first two statements, the third statement may be true, false or uncertain.";
const DIR_ARGUMENTS =
  "Choose the statement that is best supported by the information given in the passage.";
const DIR_THEME =
  "Each of the following questions contains a small paragraph followed by a question on it. Read each paragraph carefully and answer the question given below it.";
const DIR_SERIES = "Insert the missing number.";

export const QUESTIONS: Question[] = [
  {
    id: 1,
    category: "Logical Reasoning",
    direction: DIR_LOGICAL,
    directionRange: "Q.Nos. 1 - 2",
    question:
      "All the trees in the park are flowering trees. Some of the trees in the park are dogwoods. All dogwoods in the park are flowering trees.",
    options: ["True", "False", "Uncertain"],
    correct: 0,
    explanation:
      "All trees in the park are flowering trees. Since dogwoods are trees in the park, all dogwoods must also be flowering trees.",
  },
  {
    id: 2,
    category: "Logical Reasoning",
    direction: DIR_LOGICAL,
    directionRange: "Q.Nos. 1 - 2",
    question:
      "Spot is bigger than King and smaller than Sugar. Ralph is smaller than Sugar and bigger than Spot. King is bigger than Ralph.",
    options: ["True", "False", "Uncertain"],
    correct: 1,
    explanation:
      "Ralph is bigger than Spot, and Spot is bigger than King. So Ralph is bigger than King.",
  },
  {
    id: 3,
    category: "Analyzing Arguments",
    direction: DIR_ARGUMENTS,
    directionRange: "Q.Nos. 3 - 4",
    question:
      "During the last six years, the number of practicing physicians has increased by about 20%. During the same time period, the number of healthcare managers has increased by more than 600%. These percentages mean that many doctors have lost the authority to make their own schedules, determine the fees that they charge, and decide on prescribed treatments.",
    options: [
      "Resent the interference of healthcare managers",
      "No longer have adequate training",
      "Care a great deal about their patients",
      "Are less independent than they used to be",
      "Are making a lot less money than they used to make",
    ],
    correct: 3,
    explanation:
      "Doctors have lost authority over schedules, fees, and treatments — they are less independent.",
  },
  {
    id: 4,
    category: "Analyzing Arguments",
    direction: DIR_ARGUMENTS,
    directionRange: "Q.Nos. 3 - 4",
    question:
      "Some groups want to outlaw burning the flag. They say that people have fought and died for the flag and that citizens of the United States ought to respect that. But I say that respect cannot be legislated. Also, most citizens who have served in the military did not fight for the flag, they fought for what the flag represents. Among the things the flag represents is freedom of speech, which includes, I believe, the right for a citizen to express displeasure with the government by burning the flag in protest.",
    options: [
      "An action is not considered a part of freedom of speech",
      "People who burn the flag usually commit other crimes as well",
      "The flag was not recognized by the government until 1812",
      "State flags are almost never burned",
      "Most people are against flag burning",
    ],
    correct: 0,
    explanation:
      "The argument depends on flag burning being protected speech. If actions aren't speech, the argument fails.",
  },
  {
    id: 5,
    category: "Theme Detection",
    direction: DIR_THEME,
    directionRange: "Q.Nos. 5 - 6",
    question:
      "The virtue of art does not allow the work to be interfered with or immediately ruled by anything other than itself. It insists that it alone shall touch the work in order to bring it into being. Art requires that nothing shall attain the work except through art itself.",
    options: [
      "Art is governed by external rules and conditions",
      "Art is for the sake of art and life",
      "Art is for the sake of art alone",
      "Artist realizes his dreams through his artistic creation",
      "Artist should use his art for the sake of society",
    ],
    correct: 2,
    explanation: "Art exists independently without external interference.",
  },
  {
    id: 6,
    category: "Theme Detection",
    direction: DIR_THEME,
    directionRange: "Q.Nos. 5 - 6",
    question:
      "The consumption of harmful drugs by the people can be prevented not only by banning their sale in the market but also by instructing users about their dangerous effects which they must understand for their safety. Also the drug addicts may be provided with proper medical facilities for their rehabilitation. This will help in scaling down the use of drugs.",
    options: [
      "Are on increase in the society",
      "Can always be reduced",
      "Are due to lack of medical facilities",
      "Can be eliminated with the help of banning their sale",
      "May be channelized through proper system",
    ],
    correct: 4,
    explanation: "Multiple methods together form a proper system.",
  },
  {
    id: 7,
    category: "Statement & Conclusion",
    question: "To pass the examination, one must work hard.",
    options: [
      "Examination is related with hard work",
      "All those who work hard, pass",
      "Examination causes anxiety and those who work hard overcome it",
      "Without hard work, one does not pass",
      "Hard-working person is a satisfied person",
    ],
    correct: 3,
    explanation: "Hard work is necessary; without it, one cannot pass.",
  },
  {
    id: 8,
    category: "Ordering of Words",
    question:
      "Arrange: 'Though he dialled frequently, ___'. P: on telephone Q: my brother could not contact me R: and had left no information S: as I had gone out of office",
    options: ["QPRS", "SQRP", "QPSR", "SPQR"],
    correct: 2,
    explanation:
      "Correct order: Q P S R — 'my brother could not contact me on telephone as I had gone out of office and had left no information.'",
  },
  {
    id: 9,
    category: "Sentence Correction",
    question:
      "Sentence Correction: 'The drama had many scenes which were so humorous that it was hardly possible to keep a straight face.'",
    options: [
      "hardly possible for keeping",
      "hardly impossible for keeping",
      "hardly impossible for keep",
      "hardly possible keeping",
      "No correction required",
    ],
    correct: 4,
    explanation: "The sentence is grammatically correct.",
  },
  {
    id: 10,
    category: "Quantitative Aptitude",
    question: "Find the H.C.F. of 36 and 84.",
    options: ["4", "6", "12", "18"],
    correct: 2,
    explanation: "36 = 2²×3²; 84 = 2²×3×7; HCF = 2²×3 = 12.",
  },
  {
    id: 11,
    category: "Quantitative Aptitude",
    question:
      "The product of two numbers is 9375 and the quotient when the larger is divided by the smaller is 15. The sum of the numbers is:",
    options: ["380", "395", "400", "425"],
    correct: 2,
    explanation: "y=25, x=375 → sum = 400.",
  },
  {
    id: 12,
    category: "Quantitative Aptitude",
    question:
      "Free notebooks were distributed equally among children. Each child got one-eighth of the number of children. If children were half, each would get 16. Total notebooks?",
    options: ["256", "432", "512", "640", "None of these"],
    correct: 2,
    explanation: "x=64; total = 64×8 = 512.",
  },
  {
    id: 13,
    category: "Quantitative Aptitude",
    question:
      "A person's age is two-fifth of his mother's. After 8 years, he will be one-half of mother's age. Mother's present age?",
    options: ["32 years", "36 years", "40 years", "48 years"],
    correct: 2,
    explanation: "Solving: x = 40.",
  },
  {
    id: 14,
    category: "Quantitative Aptitude",
    question:
      "In a 60-litre mixture, milk:water = 2:1. To make ratio 1:2, water to add?",
    options: ["20 litres", "30 litres", "40 litres", "60 litres"],
    correct: 3,
    explanation: "40/(20+x)=1/2 → x=60.",
  },
  {
    id: 15,
    category: "Quantitative Aptitude",
    question:
      "If both pipes are opened, how many hours to fill the tank? Statements: I. Capacity is 400 L. II. Pipe A fills in 4 hrs. III. Pipe B fills in 6 hrs.",
    options: [
      "Only I and II",
      "Only II and III (2 hrs 24 min)",
      "All I, II and III",
      "Any two of three",
      "Cannot be determined",
    ],
    correct: 1,
    explanation: "Combined rate = 5/12 → 12/5 hrs = 2 hrs 24 min.",
  },
  {
    id: 16,
    category: "Quantitative Aptitude",
    question:
      "Stations A,B 110 km apart. Train from A at 7am @20kmph; from B at 8am @25kmph. Meeting time?",
    options: ["9 a.m.", "10 a.m.", "10:30 a.m.", "11 a.m."],
    correct: 1,
    explanation: "20x+25(x-1)=110 → x=3 → 10 a.m.",
  },
  {
    id: 17,
    category: "Quantitative Aptitude",
    question:
      "A works twice as fast as B. B alone takes 12 days. Together?",
    options: ["4 days", "6 days", "8 days", "18 days"],
    correct: 0,
    explanation: "1/6 + 1/12 = 1/4 → 4 days.",
  },
  {
    id: 18,
    category: "Quantitative Aptitude",
    question:
      "A+B finish in 30 days. After 20 days together, B leaves; A finishes remaining in 20 more days. A alone?",
    options: ["40", "50", "54", "60"],
    correct: 3,
    explanation: "A finishes 1/3 in 20 days → 60 days total.",
  },
  {
    id: 19,
    category: "Quantitative Aptitude",
    question:
      "Two trains, opposite directions, 60 & 90 km/hr; lengths 1.10 & 0.9 km. Time for slower to cross faster?",
    options: ["36 sec", "45 sec", "48 sec", "49 sec"],
    correct: 2,
    explanation: "Relative speed 150 km/hr; 2000m → 48 sec.",
  },
  {
    id: 20,
    category: "Quantitative Aptitude",
    question:
      "Sum amounts to Rs.9800 in 5 yrs and Rs.12005 in 8 yrs at SI. Rate?",
    options: ["5%", "8%", "12%", "15%"],
    correct: 2,
    explanation: "SI for 3 yrs = 2205; principal 6125 → 12%.",
  },
  {
    id: 21,
    category: "Quantitative Aptitude",
    question: "Between 3 and 4 o'clock, when do hands coincide?",
    options: ["5 1/11 min", "12 4/11 min", "13 4/11 min", "16 4/11 min"],
    correct: 3,
    explanation: "(60×15)/55 = 16 4/11 min.",
  },
  {
    id: 22,
    category: "Quantitative Aptitude",
    question: "Two dice tossed. Probability total is a prime number?",
    options: ["1/6", "5/12", "1/2", "7/9"],
    correct: 1,
    explanation: "15 favourable / 36 = 5/12.",
  },
  {
    id: 23,
    category: "Number Series",
    direction: DIR_SERIES,
    directionRange: "Q.Nos. 23 - 25",
    question: "Series: 16, 33, 65, 131, 261, ?",
    options: ["523", "521", "613", "721"],
    correct: 0,
    explanation: "Pattern ×2+1 → 261×2+1 = 523.",
  },
  {
    id: 24,
    category: "Number Series",
    direction: DIR_SERIES,
    directionRange: "Q.Nos. 23 - 25",
    question: "Series: 4, -8, 16, -32, 64, ?",
    options: ["128", "-128", "192", "-192"],
    correct: 1,
    explanation: "Each ×(-2) → -128.",
  },
  {
    id: 25,
    category: "Number Series",
    direction: DIR_SERIES,
    directionRange: "Q.Nos. 23 - 25",
    question: "Series: 7, 26, 63, 124, 215, 342, ?",
    options: ["481", "511", "391", "421"],
    correct: 1,
    explanation: "n³−1 → 8³−1 = 511.",
  },
];

export const EXAM_DURATION_SECONDS = 60 * 60;
export const MAX_VIOLATIONS = 3;
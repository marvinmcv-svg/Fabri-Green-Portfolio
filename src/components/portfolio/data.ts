export const profile = {
  name: "Fabrizio Saunero",
  first: "FABRIZIO",
  last: "SAUNERO",
  tagline: "Built by Experience. Driven by Purpose.",
  location: "Mallasilla · La Paz · Bolivia",
  email: "fabrizio.saunero@acslp.org",
  phone: "+591 7778 4807",
  school: "American Cooperative School (ACS), La Paz",
  classOf: "Class of 2027",
  quote:
    "I think what matters most isn't just grades or trophies—it's what you actually do with your chances.",
} as const;

export const heroStats = [
  { value: 25, suffix: "", label: "hours of training every week", sub: "Club de Tenis La Paz" },
  { value: 5, suffix: "×", label: "championship titles won", sub: "2×U17 + 1×U19 state, 2× Friendship Games" },
  { value: 7000, prefix: "$", label: "raised for Operation Smile", sub: "15 children's surgeries funded" },
  { value: 6, suffix: "", label: "jobs & ventures before 18", sub: "From breweries to a cookie startup" },
] as const;

export const marqueeValues = [
  "Discipline",
  "Leadership",
  "Service",
  "Grit",
  "Curiosity",
  "Resilience",
  "Teamwork",
  "Ownership",
] as const;

export const athletics = {
  number: "01",
  title: "Athletics & Leadership",
  headline: "Earn Your Progress. Lead by Example.",
  intro:
    "Talent gets you started, but you have to work hard to actually get anywhere. Soccer has been a huge part of my life, and nothing was ever handed to me.",
  blocks: [
    {
      kicker: "On the Field",
      text: "I worked my way up from the 4th Division to Primera A (Bolivia's 2nd Division). I won two U17 state championships, one U19 title, and two Friendship Games championships with my school team. Now I compete in UPSL leagues against high-level opponents.",
    },
    {
      kicker: "Leadership",
      text: "Being varsity captain taught me that leadership isn't about shouting. It's about being someone your team can rely on, setting a good example, and owning your mistakes. As captain of Team Tequilas, a multi-age squad, we won 1st place after advancing through multiple rounds.",
    },
    {
      kicker: "Other Sports",
      text: "Playing golf and basketball taught me to stay composed under pressure, adapt when things don't go as planned, and focus on my next move instead of dwelling on my last mistake. I'm a Cougar Cup champion in both sports.",
    },
  ],
  honors: [
    { title: "2× La Paz State Champion", detail: "U17 · Club de Tenis La Paz" },
    { title: "La Paz State Champion", detail: "U19 · Club de Tenis La Paz" },
    { title: "Promotion to Primera A", detail: "Bolivia's 2nd Division" },
    { title: "2× Friendship Games Champion", detail: "ACS Varsity Soccer" },
    { title: "Cougar Cup Champion", detail: "ACS Varsity Soccer & Basketball" },
    { title: "Club Tournament Champion", detail: "Golf · 9th grade" },
    { title: "Team Tequilas Captain", detail: "1st place · Club de Tenis La Paz" },
    { title: "UPSL Competition", detail: "International experience" },
  ],
  teams: [
    { name: "Club de Tenis La Paz — Soccer", role: "Starting Player · 2017–Present", note: "25 hrs/week · 4th Division → Primera A" },
    { name: "ACS Varsity Soccer", role: "Team Captain · 2023–Present", note: "Varsity starter since 9th grade" },
    { name: "ACS Varsity Basketball", role: "Player · 2023–Present", note: "Key defensive contributor" },
    { name: "Club de Golf La Paz", role: "Team Member · 2023–Present", note: "Junior tournament competitor" },
  ],
} as const;

export const community = {
  number: "02",
  title: "Service & Community",
  headline: "Recognize a Need. Take Initiative.",
  intro:
    "If you get good opportunities, the best thing you can do is use them to help someone else. I try to make sure my volunteer time actually makes a difference.",
  blocks: [
    {
      kicker: "Teaching & Coaching",
      text: "I founded and teach a basic English program that helps golf instructors communicate with international club members. I coached sports for about 10 kids and taught older adults how to use smartphones and computers to stay in touch with family.",
    },
    {
      kicker: "Fundraising",
      text: "Through Operation Smile, I helped raise over $7,000 with the Kilómetros por Sonrisas 5K — money that paid for cleft lip and palate surgeries for 15 children. I supported charity races, ticket sales and every step of the campaign.",
    },
    {
      kicker: "Giving Back",
      text: "I volunteered with the Special Olympics and joined monthly gatherings with A Day in the Park, bringing quality time and support to children and families affected by poverty, neglect and substance abuse.",
    },
  ],
  commitments: [
    { name: "English Classes for Golf Teachers", role: "Founder · Jul 2025–Present" },
    { name: "Operation Smile", role: "Member & Volunteer · 2024–Present" },
    { name: "A Day in the Park", role: "Volunteer · 2024–Present" },
    { name: "Special Olympics", role: "Volunteer · Oct 2026" },
    { name: "Youth Sports Coach", role: "Community Volunteer · Apr 2025" },
    { name: "Digital Literacy Instructor", role: "Community Volunteer · Mar 2025" },
  ],
} as const;

export const work = {
  number: "03",
  title: "Entrepreneurship & Work",
  headline: "Solve Problems. Turn Ideas into Action.",
  intro:
    "Some of my favorite lessons didn't happen in a classroom. They happened when I had actual responsibilities and my choices mattered.",
  blocks: [
    {
      kicker: "Hands-on Experience",
      text: "Working in sales, customer service, production and running a business project showed me how ideas turn into real products and how daily choices affect a business.",
    },
    {
      kicker: "Figuring Things Out",
      text: "Real-world problems don't come with an instruction manual. I learned to ask questions, switch up my plan, and solve problems on my own instead of waiting for directions.",
    },
    {
      kicker: "My Goal",
      text: "I don't just want to memorize stuff from a textbook. I want to actually understand it, use it, and make cool things happen.",
    },
  ],
  jobs: [
    {
      title: "Family Juice Business",
      role: "Production & Sales Assistant",
      period: "Jan 2026 – Present",
      text: "Produce fresh lemon juices and bottled beverages alongside my father — from preparing ingredients and sanitizing equipment to bottling, labeling, inventory and customer orders. Helped introduce a special plant from another country into our lemonades.",
    },
    {
      title: "Super Salteñas",
      role: "Shop Employee",
      period: "Dec 2024 – Present",
      text: "Serve 30+ customers daily: orders, cash and electronic payments, food preparation, restocking, and resolving customer concerns professionally.",
    },
    {
      title: "Compañía Cervecera Boliviana",
      role: "Brewery Production Worker",
      period: "Sep 2025 – Dec 2025",
      text: "Supported daily production and packaging in a fast-paced facility — bottling, labeling, quality control and safety procedures — contributing to thousands of units produced to strict standards.",
    },
    {
      title: "Beverage Production & Sales",
      role: "Production & Sales Assistant",
      period: "Sep 2025 – Dec 2025",
      text: "Prepared beverages for commercial distribution, promoted products, maintained displays and answered customer questions.",
    },
    {
      title: "Textilon",
      role: "Intern",
      period: "Jun 2025",
      text: "Internship at one of the largest textile companies in La Paz: inventory, administration, logistics, distribution and customer service.",
    },
    {
      title: "School Cookie Business",
      role: "Co-Founder",
      period: "Mar 2025 – May 2025",
      text: "Co-founded a student-run cookie business covering baking, packaging, marketing, pricing and sales — tracked costs and revenue and generated a profit of more than Bs. 300.",
    },
  ],
} as const;

export const independence = {
  number: "04",
  title: "Independence & Life Skills",
  headline: "Take Ownership. Build Self-Reliance.",
  intro:
    "Being independent is about knowing how to handle your business and fix things when something goes wrong.",
  blocks: [
    {
      kicker: "Practical Skills",
      text: "I've been teaching myself everyday skills like cooking and food safety, gardening, basic home repairs, and wiring. If something breaks, I'd rather figure out how to fix it than wait for someone else.",
    },
    {
      kicker: "Problem-Solving",
      text: "Doing basic chores teaches you how to troubleshoot, use what you have, and take care of yourself safely. Every repaired switch or home-cooked meal is a small proof that I can handle what life throws at me.",
    },
    {
      kicker: "Getting Ready",
      text: "Picking up these habits is helping me get ready to live on my own, adapt to college, and pull my own weight. A four-week academic program at Forman School in Connecticut strengthened that independence — new teaching methods, new people, new country.",
    },
  ],
  skills: [
    "Cooking & food safety",
    "Kitchen organization",
    "Basic electrical work",
    "Mechanical repairs",
    "Gardening & landscaping",
    "Household maintenance",
    "Inventory management",
    "Customer service",
  ],
  languages: [
    { name: "Spanish", level: "Fluent" },
    { name: "English", level: "Fluent" },
    { name: "Italian", level: "Basic" },
  ],
  education: {
    school: "American Cooperative School (ACS), La Paz",
    detail:
      "U.S. and Bolivian High School Diploma · Expected Jun 2027 · American Citizenship Award",
    courses:
      "AP Seminar · AP Research · AP World History · AP Microeconomics · AP Spanish Language · AP Spanish Literature",
    summer:
      "Forman School Summer Program, Connecticut, USA — Jul 2025. Four weeks alongside students from diverse backgrounds, strengthening independence, communication and cultural awareness.",
  },
} as const;

export const closing = {
  headline: "Ready for What's Next",
  body1:
    "Everything I've done so far has taught me discipline, responsibility, and how to work with others. I'm really excited for college. I can't wait to take tough classes, join campus projects, and learn from people who see the world differently than I do.",
  body2:
    "I know I still have a lot to learn and a lot to prove, but I'm ready to work hard and make this next chapter count.",
  kicker: "The next chapter is mine to build.",
} as const;

export const videos = [
  {
    src: "/media/videos/golf-swing.mp4",
    poster: "/media/videos/golf-swing-poster.jpg",
    title: "Full Swing",
    caption: "Club de Golf La Paz — driving the ball against the altiplano backdrop",
    featured: true,
  },
  {
    src: "/media/videos/golf-putting.mp4",
    poster: "/media/videos/golf-putting-poster.jpg",
    title: "Short Game",
    caption: "Composure on the green — lining up the putt",
    featured: false,
  },
  {
    src: "/media/videos/kitchen-prep.mp4",
    poster: "/media/videos/kitchen-prep-poster.jpg",
    title: "Family Kitchen",
    caption: "Super Salteñas — learning the craft from my father",
    featured: false,
  },
  {
    src: "/media/videos/serving-tray.mp4",
    poster: "/media/videos/serving-tray-poster.jpg",
    title: "Service with a Smile",
    caption: "30+ customers a day, every day",
    featured: false,
  },
  {
    src: "/media/videos/golf-address.mp4",
    poster: "/media/videos/golf-address-poster.jpg",
    title: "The Setup",
    caption: "Routine before the swing — golf at 3,600 m altitude",
    featured: false,
  },
] as const;

export const galleryImages = [
  { src: "/media/images/hero-trophy.jpg", alt: "Fabrizio Saunero holding a championship trophy and gold medal on a soccer field in La Paz, Bolivia", caption: "State champion — U19, La Paz", tall: true },
  { src: "/media/images/golf-portrait.jpg", alt: "Fabrizio Saunero portrait with putter on the golf course", caption: "Club de Golf La Paz", tall: true },
  { src: "/media/images/team-tequilas-night.jpg", alt: "Team Tequilas posing at night with championship trophy, Fabrizio holding the trophy in the center", caption: "Team Tequilas — 1st place, as captain", tall: false },
  { src: "/media/images/community-kids.jpg", alt: "Fabrizio Saunero sitting with children at a community park event", caption: "A Day in the Park", tall: true },
  { src: "/media/images/work-register.jpg", alt: "Fabrizio Saunero taking an order at the Super Salteñas shop register", caption: "Super Salteñas — the daily grind", tall: true },
  { src: "/media/images/basketball-cougars.jpg", alt: "ACS Cougars basketball team posing with a trophy, Fabrizio wearing number 15", caption: "Cougars basketball", tall: false },
  { src: "/media/images/golf-putt-action.jpg", alt: "Fabrizio Saunero lining up a putt on the green", caption: "Short game focus", tall: true },
  { src: "/media/images/holi-festival.jpg", alt: "Fabrizio Saunero and a friend covered in colorful Holi festival powder, smiling", caption: "Color runs & community days", tall: false },
  { src: "/media/images/work-saltenas-prep.jpg", alt: "Fabrizio Saunero preparing salteñas with his grandfather in the family kitchen", caption: "The family recipe", tall: true },
  { src: "/media/images/community-coaching.jpg", alt: "Fabrizio Saunero coaching a young child with a ball in a park", caption: "Youth sports coaching", tall: true },
  { src: "/media/images/forman-summer.jpg", alt: "Fabrizio Saunero at the Forman School summer program in Connecticut", caption: "Forman Summer — Connecticut", tall: true },
  { src: "/media/images/work-pizza.jpg", alt: "Fabrizio Saunero preparing pizzas in a kitchen", caption: "Kitchen craft", tall: true },
] as const;

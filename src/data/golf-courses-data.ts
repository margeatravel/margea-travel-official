import { media } from "@/lib/media";
export interface GolfPricing {
  label: string;
  price: number;
}

export interface GolfReview {
  text: string;
  author: string;
  handicap?: string;
}

export interface GolfCourse {
  id: string;
  name: string;
  location: string;
  designer: string;
  holes: number;
  par: number;
  yardage: string;
  difficulty: "Moderate" | "Challenging" | "Very Challenging";
  overview: string;
  description: string;
  highlights: string[];
  image: string;
  galleryImages: string[];
  reviews: GolfReview[];
  pricing: GolfPricing[];
}

export const golfCourses: GolfCourse[] = [
  {
    id: "el-camaleon-mayakoba",
    name: "El Camaleón Mayakoba",
    location: "Playa del Carmen",
    designer: "Greg Norman",
    holes: 18,
    par: 72,
    yardage: "~7,024 yards",
    difficulty: "Very Challenging",
    overview: "One of Mexico's most iconic championship courses. Host of PGA Tour and LIV Golf events.",
    description: "El Camaleón is a Greg Norman masterpiece carved through jungle, mangroves, canals, and a stunning Caribbean oceanfront stretch. As the only PGA Tour venue in Mexico, it delivers world-class conditioning and an unforgettable finishing sequence along the sea. Every hole presents a unique challenge shaped by natural terrain and coastal winds.",
    highlights: ["PGA Tour venue", "Oceanfront finishing hole", "Championship conditioning"],
    image: media("/golf-images/el-camaleon-mayakoba.png"),
    galleryImages: [media("/golf-images/el-camaleon-mayakoba.png")],
    reviews: [
      { text: "Absolutely world-class. The oceanfront holes are breathtaking.", author: "James R.", handicap: "8" },
      { text: "Greens were lightning fast — brought my A-game and still got humbled.", author: "Carlos M.", handicap: "12" },
      { text: "Worth every penny. Course conditions rival anything I've played in the States.", author: "David W.", handicap: "6" },
      { text: "The back nine through the mangroves is something special.", author: "Tom H.", handicap: "15" },
    ],
    pricing: [
      { label: "Prime Time", price: 369 },
      { label: "Hot Time", price: 319 },
      { label: "Twilight", price: 270 },
    ],
  },
  {
    id: "pga-riviera-maya",
    name: "PGA Riviera Maya",
    location: "Akumal (near Tulum)",
    designer: "Robert Trent Jones II",
    holes: 18,
    par: 72,
    yardage: "~7,272 yards",
    difficulty: "Very Challenging",
    overview: "The only PGA-branded course in the region. Jungle layout with elevation changes and technical bunkering.",
    description: "PGA Riviera Maya is a Robert Trent Jones II design that winds through dense Yucatán jungle with surprising elevation changes. The strategic bunkering and large, undulating greens demand precision. As the region's only PGA-certified experience, it delivers tournament-level conditioning in a spectacular natural setting.",
    highlights: ["PGA-certified experience", "Tournament host", "Strategic design"],
    image: media("/golf-images/pga-riviera-maya.png"),
    galleryImages: [media("/golf-images/pga-riviera-maya.png")],
    reviews: [
      { text: "Tough but fair. The elevation changes keep you on your toes.", author: "Mark S.", handicap: "10" },
      { text: "Best-maintained course I played in Mexico. Smooth greens.", author: "Robert L.", handicap: "7" },
      { text: "Challenging layout but beautifully maintained.", author: "Steve P.", handicap: "14" },
      { text: "The jungle setting makes it feel like a private retreat.", author: "Andrew K.", handicap: "18" },
    ],
    pricing: [
      { label: "Prime Time", price: 250 },
      { label: "Twilight", price: 190 },
    ],
  },
  {
    id: "playa-mujeres-golf-club",
    name: "Playa Mujeres Golf Club",
    location: "North of Cancún",
    designer: "Greg Norman",
    holes: 18,
    par: 72,
    yardage: "~7,218 yards",
    difficulty: "Challenging",
    overview: "Championship course blending coastal dunes and tropical vegetation within a luxury gated community.",
    description: "Another Greg Norman signature, Playa Mujeres weaves through coastal dunes, wetlands, and tropical gardens inside one of the region's most exclusive residential communities. Ocean breezes add a strategic layer to an already demanding layout. The clubhouse and amenities match the resort-level surroundings.",
    highlights: ["Ocean views", "Resort-level amenities", "Elite residential setting"],
    image: media("/golf-images/playa-mujeres.jpg"),
    galleryImages: [media("/golf-images/playa-mujeres.jpg")],
    reviews: [
      { text: "Wind off the ocean makes club selection critical. Loved it.", author: "Brian T.", handicap: "9" },
      { text: "Greens were fast and fairways in excellent shape.", author: "Miguel A.", handicap: "11" },
      { text: "Beautiful course, great service at the pro shop.", author: "Peter G.", handicap: "16" },
      { text: "The dune holes feel like you're playing links golf in the Caribbean.", author: "Dan F.", handicap: "5" },
    ],
    pricing: [
      { label: "Standard", price: 180 },
    ],
  },
  {
    id: "puerto-cancun-golf-course",
    name: "Puerto Cancún Golf Course",
    location: "Puerto Cancún",
    designer: "Tom Weiskopf",
    holes: 18,
    par: 72,
    yardage: "~7,241 yards",
    difficulty: "Challenging",
    overview: "Modern layout combining marina views, Caribbean Sea backdrops, and mangrove-lined fairways.",
    description: "Tom Weiskopf designed this modern layout to make the most of its stunning surroundings — marina views on one side, Caribbean Sea on the other, and mangrove-lined fairways throughout. Located minutes from downtown Cancún, it offers a premium golf experience without the long drive. The luxury clubhouse completes the package.",
    highlights: ["Marina & ocean holes", "Prime central location", "Luxury clubhouse"],
    image: media("/golf-images/puerto-cancun.jpg"),
    galleryImages: [media("/golf-images/puerto-cancun.jpg")],
    reviews: [
      { text: "Incredible views from almost every hole. Well worth it.", author: "Chris B.", handicap: "13" },
      { text: "Great service and smooth tee time experience.", author: "Laura M.", handicap: "20" },
      { text: "The marina holes are the highlight — stunning backdrop.", author: "Kevin D.", handicap: "8" },
      { text: "Conveniently located and the clubhouse is top-notch.", author: "John R.", handicap: "15" },
    ],
    pricing: [
      { label: "Standard", price: 169 },
    ],
  },
  {
    id: "cancun-country-club-el-tinto",
    name: "Cancún Country Club – El Tinto",
    location: "Southwest Cancún",
    designer: "Nick Price",
    holes: 18,
    par: 72,
    yardage: "~7,435 yards",
    difficulty: "Very Challenging",
    overview: "One of the longest and most challenging courses in the region. Designed for competitive-level play.",
    description: "Nick Price's El Tinto stretches over 7,400 yards, making it one of the longest and most demanding layouts in the Mexican Caribbean. Strategic water hazards and well-placed bunkers test every club in the bag. It's a favorite among serious golfers looking for a genuine championship test without the resort premium.",
    highlights: ["Strategic water hazards", "Championship length", "Residential community"],
    image: media("/golf-images/el-tinto.jpg"),
    galleryImages: [media("/golf-images/el-tinto.jpg")],
    reviews: [
      { text: "Tough back nine, but I managed a birdie on 17.", author: "Ryan K.", handicap: "6" },
      { text: "Longest course I've played down here. Bring your driver.", author: "Paul W.", handicap: "10" },
      { text: "Great value for the quality. Conditions were solid.", author: "Eduardo S.", handicap: "14" },
      { text: "Water comes into play more than you'd expect. Think before you swing.", author: "Derek M.", handicap: "9" },
    ],
    pricing: [
      { label: "Standard", price: 135 },
    ],
  },
  {
    id: "iberostar-playa-paraiso",
    name: "Iberostar Playa Paraíso Golf Club",
    location: "Riviera Maya",
    designer: "P.B. Dye",
    holes: 18,
    par: 72,
    yardage: "~6,641 yards",
    difficulty: "Challenging",
    overview: "Technical course with elevation changes, deep bunkers, and visually demanding carries.",
    description: "P.B. Dye brought his signature style to the Riviera Maya with this technical gem. Dramatic elevation changes, deep pot bunkers, and forced carries over wetlands keep you engaged from the first tee. It's shorter than some neighbors but demands precision and course management at every turn.",
    highlights: ["Dye-style layout", "Challenging greens", "Resort access"],
    image: media("/golf-images/iberostar-paraiso.png"),
    galleryImages: [media("/golf-images/iberostar-paraiso.png")],
    reviews: [
      { text: "Don't let the yardage fool you — this course bites.", author: "Frank H.", handicap: "11" },
      { text: "Greens are tricky. Read them twice before putting.", author: "Martin L.", handicap: "8" },
      { text: "Love the Dye design. Every hole is different.", author: "Alex C.", handicap: "13" },
      { text: "Good condition and fun layout. Would play again.", author: "Sandra R.", handicap: "22" },
    ],
    pricing: [
      { label: "Prime Time", price: 249 },
      { label: "Twilight", price: 179 },
    ],
  },
  {
    id: "iberostar-cancun",
    name: "Iberostar Cancún Golf Club",
    location: "Hotel Zone, Cancún",
    designer: "Isao Aoki",
    holes: 18,
    par: 72,
    yardage: "~6,734 yards",
    difficulty: "Moderate",
    overview: "Oceanfront course with stunning Caribbean views and strategic yet enjoyable play.",
    description: "Designed by Japanese golf legend Isao Aoki, this oceanfront course in the heart of Cancún's Hotel Zone offers direct Caribbean views and a balanced layout that's enjoyable for all skill levels. The sea breeze adds challenge, but the wide fairways welcome confident swings. It's the most accessible premium course in the zone.",
    highlights: ["Direct ocean views", "Central hotel zone location", "Popular international course"],
    image: media("/golf-images/iberostar-cancun.jpg"),
    galleryImages: [media("/golf-images/iberostar-cancun.jpg")],
    reviews: [
      { text: "Best ocean views of any course in Cancún. Period.", author: "Lisa T.", handicap: "18" },
      { text: "Forgiving enough for a fun round, challenging enough to stay sharp.", author: "Jason P.", handicap: "14" },
      { text: "Walked right from the hotel to the first tee. Unbeatable convenience.", author: "Michael K.", handicap: "20" },
      { text: "Great course for a vacation round. Don't overthink it — just enjoy.", author: "Ana G.", handicap: "25" },
    ],
    pricing: [
      { label: "Standard", price: 99 },
    ],
  },
  {
    id: "gran-coyote-golf",
    name: "Gran Coyote Golf",
    location: "Playa del Carmen",
    designer: "Nick Price",
    holes: 18,
    par: 71,
    yardage: "~6,987 yards",
    difficulty: "Challenging",
    overview: "Premium jungle course inside Corasol community with strong routing and balanced playability.",
    description: "Nick Price's second design in the region sits inside the prestigious Corasol community. The routing flows naturally through dense jungle with strategic doglegs and well-protected greens. It strikes an excellent balance between challenge and playability, rewarding smart course management over raw power.",
    highlights: ["Luxury residential setting", "Tropical scenery", "Strategic layout"],
    image: media("/golf-images/gran-coyote.png"),
    galleryImages: [media("/golf-images/gran-coyote.png")],
    reviews: [
      { text: "Excellent routing. Every hole feels purposeful.", author: "Greg N.", handicap: "7" },
      { text: "The jungle setting is gorgeous. Saw monkeys on the 12th.", author: "Rachel W.", handicap: "16" },
      { text: "Quieter than the bigger-name courses. Felt like a private club.", author: "Tony B.", handicap: "10" },
      { text: "Nick Price knows how to design a thinking person's course.", author: "Victor M.", handicap: "12" },
    ],
    pricing: [
      { label: "Standard", price: 209 },
    ],
  },
  {
    id: "riviera-cancun-golf-club",
    name: "Riviera Cancún Golf Club",
    location: "South of Cancún",
    designer: "Jack Nicklaus",
    holes: 18,
    par: 72,
    yardage: "~7,060 yards",
    difficulty: "Challenging",
    overview: "Nicklaus Signature design featuring wetlands, coastal winds, and technical finishing holes.",
    description: "A Jack Nicklaus Signature course that uses the natural wetland terrain and coastal winds to create a demanding yet fair test of golf. The finishing stretch is among the most technical in the region, requiring precision off the tee and around the greens. Nicklaus's trademark risk-reward design philosophy is on full display.",
    highlights: ["Nicklaus design", "Scenic water features", "Resort appeal"],
    image: media("/golf-images/riviera-cancun.jpg"),
    galleryImages: [media("/golf-images/riviera-cancun.jpg")],
    reviews: [
      { text: "Nicklaus design at its finest. The finishing holes are intense.", author: "Phil C.", handicap: "5" },
      { text: "Beautiful wetland scenery and great risk-reward holes.", author: "Juan E.", handicap: "12" },
      { text: "Tough when the wind picks up. Bring your low ball flight.", author: "Neil H.", handicap: "8" },
      { text: "Staff was excellent. Course in great shape for our group outing.", author: "Charles D.", handicap: "17" },
    ],
    pricing: [
      { label: "Standard", price: 155 },
    ],
  },
];

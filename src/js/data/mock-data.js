export const services = [
  {
    id: "haircut",
    name: "Haircut",
    description: "Classic haircut. Clean, sharp, and fresh.",
    duration: 30,
    price: 35,
    icon: "/images/services/haircut.png",
  },
  {
    id: "haircut-beard",
    name: "Haircut + Beard",
    description: "Complete haircut and beard service.",
    duration: 45,
    price: 45,
    icon: "/images/services/haircut-beard.png",
  },
  {
    id: "kids-haircut",
    name: "Kids Haircut",
    description: "Haircut for younger clients.",
    duration: 30,
    price: 30,
    icon: "/images/services/kids-haircut.png",
  },
  {
    id: "head-razor-shave",
    name: "Head Razor Shave",
    description: "Smooth, clean and refreshed.",
    duration: 30,
    price: 30,
    icon: "/images/services/razor-shave.png",
  },
  {
    id: "beard-trim",
    name: "Beard Trim",
    description: "Keep your beard looking sharp.",
    duration: 20,
    price: 20,
    icon: "/images/services/beard-trim.png",
  },
];

export const barbers = [
  {
    id: "alex-morgan",
    name: "Alex Morgan",
    role: "Master Barber",
    description: "10+ years of experience",
    image: "images/barbers/Alex-Morgan.webp",
    services: [
      "haircut",
      "haircut-beard",
      "kids-haircut",
      "head-razor-shave",
      "beard-trim",
    ],
  },

  {
    id: "liam-carter",
    name: "Liam Carter",
    role: "Barber",
    description: "Building the next generation",
    image: "images/barbers/Liam-Carter.webp",
    services: ["haircut", "haircut-beard", "kids-haircut", "beard-trim"],
  },

  {
    id: "noah-bennett",
    name: "Noah Bennett",
    role: "Barber",
    description: "Passionate about great cuts",
    image: "images/barbers/Noah-Bennett.webp",
    services: ["haircut", "haircut-beard"],
  },
];

export const availability = {
  "alex-morgan": {
    "2026-10-06": [
      "10:00",
      "10:05",
      "10:10",
      "10:15",
      "10:20",
      "10:25",
      "10:30",
    ],
    "2026-10-07": ["11:40", "11:45", "11:50", "11:55", "12:00"],
    "2026-10-08": ["08:00", "10:20", "10:25", "10:30"],
  },

  "liam-carter": {
    "2026-10-06": ["10:10", "10:15", "10:20", "10:35", "10:40"],
    "2026-10-08": ["08:00", "10:30", "10:35", "10:40", "10:45"],
    "2026-10-09": ["09:50", "09:55", "10:00", "14:00", "14:05"],
  },

  "noah-bennett": {
    "2026-10-06": ["10:25", "10:30", "10:35", "10:45", "10:50"],
    "2026-10-09": ["11:20", "14:00", "14:05", "14:10", "14:15"],
    "2026-10-10": ["14:15", "14:20", "14:25", "14:30", "14:35"],
  },
};

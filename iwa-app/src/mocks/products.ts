import type { Product, User, Notification, Transaction,Review } from "../shared/types";

const demoUser: User[] = [
  {
    id: 1,
    username: "mercottemamie",
    fullName: "Mamie Mercotte",
    avatar:
      "https://images.unsplash.com/photo-1711060266355-19214d0a15d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwd29tYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTkzNTE3MDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 5,
    reviewCount: 27,
    location: "Hérault, France",
    nationality: "Nationalité Française",
    followers: 22,
    following: 25,
    bio: "Passionnée de jardinage depuis plus de 40 ans. Je cultive mes propres graines et partage avec plaisir mes variétés préférées. Spécialisée dans les fleurs anciennes et les bulbes rares.",
  },
  {
    id: 2,
    username: "theonlyone",
    fullName: "Théo Martin",
    avatar:
      "https://images.unsplash.com/photo-1624395213232-ea2bcd36b865?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBwb3J0cmFpdCUyMGZhY2V8ZW58MXx8fHwxNzU5NDI4NTk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 5,
    reviewCount: 15,
    location: "Lyon, France",
    nationality: "Nationalité Française",
    followers: 45,
    following: 32,
    bio: "Jardinier urbain et amateur de permaculture. Je partage mes graines bio et mes conseils pour cultiver en ville.",
  },
  {
    id: 3,
    username: "urluberlulompom",
    fullName: "Lucie Dubois",
    avatar:
      "https://images.unsplash.com/photo-1687456338499-54d3de388a98?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwbmF0dXJlfGVufDF8fHx8MTc1OTQyODU5OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 4,
    reviewCount: 8,
    location: "Bordeaux, France",
    nationality: "Nationalité Française",
    followers: 18,
    following: 23,
    bio: "Amoureuse des plantes aromatiques et des légumes anciens. Culture biologique exclusivement.",
  },
  {
    id: 4,
    username: "yujiloperk",
    fullName: "Julie Perkins",
    avatar:
      "https://images.unsplash.com/photo-1593862511027-9847335ec1ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBkYWlzeSUyMGZsb3dlcnN8ZW58MXx8fHwxNzU5NDI4NTk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rating: 5,
    reviewCount: 12,
    location: "Paris, France",
    nationality: "Nationalité Française",
    followers: 34,
    following: 28,
    bio: "Collectrice de graines rares et passionnée de botanique. J'aime découvrir et partager des variétés uniques.",
  },
];

export const demoProducts: Product[] = [
  {
    id: 1,
    name: "Semences florales",
    quantity: "47g",
    price: "5,00 €",
    images: [
      "https://images.unsplash.com/photo-1560359670-c73c0f28d5fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG93ZXIlMjBzZWVkcyUyMGhhbmR8ZW58MXx8fHwxNzU5MzEwMTI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1080",
      "https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=1080",
    ],
    description:
      "Mélange de graines florales variées pour créer un jardin coloré. Idéal pour attirer les pollinisateurs. Semences biologiques certifiées.",
    category: "Fleurs décoratives",
    plantingPeriod: "Mars-Mai",
    floweringPeriod: "Juin-Septembre",
    edible: false,
    harvestDate: "Septembre 2024",
    seller: demoUser[0],
    isFavorite: false,
  },
  {
    id: 2,
    name: "Graines de tournesol",
    quantity: "47g",
    price: "5,00 €",
    images: [
      "https://images.unsplash.com/photo-1598920710727-e6c74781538c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5mbG93ZXIlMjBnYXJkZW58ZW58MXx8fHwxNzU5MzEwMTI2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1080",
    ],
    description:
      "Tournesols géants à croissance rapide. Hauteur jusqu'à 2 mètres. Graines comestibles et délicieuses.",
    category: "Fleurs décoratives",
    plantingPeriod: "Avril-Juin",
    floweringPeriod: "Juillet-Octobre",
    edible: true,
    harvestDate: "Octobre 2024",
    seller: demoUser[0],
    isFavorite: false,
  },
  {
    id: 3,
    name: "Fleurs de lys",
    quantity: "47g",
    price: "5,00 €",
    images: [
      "https://images.unsplash.com/photo-1656925348405-9fbe3dae9c64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwZmxvd2VycyUyMGxhdmF0ZXJhfGVufDF8fHx8MTc1OTMxMDEyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1080",
    ],
    description:
      "Magnifiques fleurs roses vivaces. Parfait pour massifs et bouquets. Très résistantes au froid.",
    category: "Fleurs décoratives",
    plantingPeriod: "Septembre-Novembre",
    floweringPeriod: "Mai-Juillet",
    edible: false,
    harvestDate: "Juillet 2024",
    seller: demoUser[0],
    isFavorite: true,
  },
  {
    id: 4,
    name: "Bulbes de fleurs de safran",
    quantity: "5 pièces",
    price: "30,00 €",
    images: [
      "https://images.unsplash.com/photo-1592169081873-79a4c88071db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWZmcm9uJTIwYnVsYnN8ZW58MXx8fHwxNzU5MzEwMTI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      "https://images.unsplash.com/photo-1592169081873-79a4c88071db?w=1080",
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1080",
      "https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=1080",
    ],
    description:
      "Bulbes de crocus sativus pour production de safran. Épice précieuse cultivable chez soi. Rendement excellent.",
    category: "Herbes aromatiques / épices",
    plantingPeriod: "Septembre-Octobre",
    floweringPeriod: "Juin-Juillet",
    edible: true,
    harvestDate: "Juin 2024",
    seller: demoUser[0],
    isFavorite: false,
  },
  {
    id: 5,
    name: "Basilic frais",
    quantity: "30g",
    price: "3,50 €",
    images: [
      "https://images.unsplash.com/photo-1748576724273-c1ed05911708?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNpbCUyMHBsYW50JTIwbGVhdmVzfGVufDF8fHx8MTc1OTMxMDEyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    description:
      "Graines de basilic grand vert. Idéal pour cuisine méditerranéenne. Croissance rapide et facile.",
    category: "Herbes aromatiques / épices",
    plantingPeriod: "Mars-Mai",
    floweringPeriod: "Juillet-Septembre",
    edible: true,
    harvestDate: "Août 2024",
    seller: demoUser[1],
    isFavorite: false,
  },
  {
    id: 6,
    name: "Plants de tomates",
    quantity: "1 plant",
    price: "4,00 €",
    images: [
      "https://images.unsplash.com/photo-1586640167802-8af12bf651fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b21hdG8lMjB2ZWdldGFibGUlMjBmcmVzaHxlbnwxfHx8fDE3NTk0MzAyMjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    description:
      "Jeune plant de tomate cœur de bœuf. Prêt à planter. Variété ancienne et savoureuse.",
    category: "Légumes",
    plantingPeriod: "Mai-Juin",
    floweringPeriod: "Juin-Juillet",
    edible: true,
    harvestDate: "Août 2024",
    seller: demoUser[1],
    isFavorite: false,
  },
  {
    id: 7,
    name: "Graines de carottes",
    quantity: "50g",
    price: "3,00 €",
    images: [
      "https://images.unsplash.com/photo-1717959159782-98c42b1d4f37?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJyb3QlMjB2ZWdldGFibGUlMjBnYXJkZW58ZW58MXx8fHwxNzU5NDMwMjI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    description:
      "Carottes nantaises bio. Excellente conservation. Idéales pour culture en pleine terre.",
    category: "Légumes",
    plantingPeriod: "Mars-Juillet",
    floweringPeriod: "Mai-Septembre",
    edible: true,
    harvestDate: "Septembre 2024",
    seller: demoUser[1],
    isFavorite: false,
  },
  {
    id: 8,
    name: "Poivrons rouges",
    quantity: "25g",
    price: "4,50 €",
    images: [
      "https://images.unsplash.com/photo-1721451270163-64e74fc89ba3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWxsJTIwcGVwcGVyJTIwcmVkfGVufDF8fHx8MTc1OTQzMDIyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    description:
      "Poivrons doux et charnus. Parfaits pour salades et grillades. Culture facile en serre.",
    category: "Légumes",
    plantingPeriod: "Février-Avril",
    floweringPeriod: "Juin-Septembre",
    edible: true,
    harvestDate: "Septembre 2024",
    seller: demoUser[2],
    isFavorite: false,
  },
  {
    id: 9,
    name: "Graines de cannabis",
    quantity: "10g",
    price: "15,00 €",
    images: [
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF2ZXMlMjBncmVlbnxlbnwxfHx8fDE3NTk0MzAyMjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    description: "Graines de qualité supérieure.",
    category: "Plantes médicinales",
    plantingPeriod: "Avril-Mai",
    floweringPeriod: "Juillet-Août",
    edible: false,
    harvestDate: "Août 2024",
    seller: demoUser[0],
    isFavorite: false,
    removedByAI: true,
  },
  {
    id: 10,
    name: "Tabac à fumer",
    quantity: "20g",
    price: "8,00 €",
    images: [
      "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2JhY2NvJTIwbGVhdmVzfGVufDF8fHx8MTc1OTQzMDIyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    ],
    description: "Plante de tabac pour usage personnel.",
    category: "Plantes médicinales",
    plantingPeriod: "Mars-Avril",
    floweringPeriod: "Juin-Juillet",
    edible: false,
    harvestDate: "Juillet 2024",
    seller: demoUser[0],
    isFavorite: false,
    removedByAI: true,
  },
];

export const allProducts = demoProducts;

// 🔹 on exporte aussi les users et un currentUser pratique
export const users = demoUser;
export const currentUser = demoUser[0];

// 🔹 Mock notifications
export const demoNotifications: Notification[] = [
  {
    id: 1,
    type: "removed",
    user: currentUser,
    product: demoProducts[8],
    date: "Il y a 1 heure",
    read: false,
  },
  {
    id: 2,
    type: "removed",
    user: currentUser,
    product: demoProducts[9],
    date: "Il y a 3 heures",
    read: false,
  },
  {
    id: 3,
    type: "favorite",
    user: users[1],
    product: demoProducts[0],
    date: "Il y a 2 heures",
    read: false,
  },
  {
    id: 4,
    type: "sale",
    user: users[2],
    product: demoProducts[1],
    date: "Il y a 1 jour",
    read: false,
  },
  {
    id: 5,
    type: "review",
    user: users[3],
    product: demoProducts[2],
    date: "Il y a 2 jours",
    read: true,
  },
];

// 🔹 Mock transactions
export const demoTransactions: Transaction[] = [
  {
    id: 1,
    product: demoProducts[1],
    date: "15 septembre 2024",
    price: "5,00 €",
    status: "completed",
    reviewed: false,
  },
  {
    id: 2,
    product: demoProducts[3],
    date: "20 septembre 2024",
    price: "30,00 €",
    status: "in_progress",
    reviewed: false,
  },
  {
    id: 3,
    product: demoProducts[0],
    date: "10 septembre 2024",
    price: "5,00 €",
    status: "completed",
    reviewed: true,
  },
];


export const reviewsByUser: { [key: number]: Review[] } = {
  1: [
    {
      id: 1,
      reviewer: users[1],
      rating: 5,
      comment:
        "Excellente qualité des graines, germination rapide et excellent service. Je recommande vivement !",
      date: "Il y a 3 jours",
    },
    {
      id: 2,
      reviewer: users[2],
      rating: 5,
      comment:
        "Très satisfaite de mon achat. Les graines sont arrivées bien emballées et la communication était parfaite.",
      date: "Il y a 3 jours",
    },
  ],
  2: [
    {
      id: 3,
      reviewer: users[0],
      rating: 5,
      comment:
        "Super vendeur, très réactif et produits de qualité !",
      date: "Il y a 1 semaine",
    },
  ],
};



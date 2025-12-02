//iwa-app/src/mocks/products.ts
import type {
  Product,
  User,
  Notification,
  Transaction,
  Review,
  Report,
} from "../shared/types";

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
    bio: "Collectrice de graines rares et passionnée de botanique. J'aime découvrir et partager des variétés uniques.",
  },
];

export const demoProducts: Product[] = [
  {
    id: 1,
    name: "Graines de figues de barbarie",
    quantity: "30 graines",
    price: "4,50 €",
    images: [
      "https://i.pinimg.com/1200x/cd/3f/f7/cd3ff7da347bc7705fd9f4d51a064344.jpg",
      "https://i.pinimg.com/736x/38/f9/ab/38f9ab2de002f69dd6272d28b6663851.jpg",
      "https://i.etsystatic.com/10534964/r/il/3c0b4c/6826956176/il_570xN.6826956176_p6he.jpg",
      "https://ethnoplants.com/3984-medium_default/opuntia-ficus-indica-figue-barbarie-graines.jpg",
    ],
    description:
      "Graines de figuier de barbarie (Opuntia ficus-indica) issues de fruits mûrs. Idéales pour créer une haie de cactus résistante à la sécheresse et produire des fruits juteux et sucrés. Convient particulièrement aux régions chaudes et ensoleillées.",
    category: "Fruits",
    plantingPeriod: "Mars-Juin",
    floweringPeriod: "Juin-Août",
    edible: true,
    harvestDate: "Septembre 2025",
    seller: demoUser[0],
    createdAt: "2025-11-15T09:30:00Z",
    isFavorite: false,
    sold: true,
  },
  {
    id: 2,
    name: "Graines de tomates cœur de bœuf",
    quantity: "50 graines",
    price: "3,90 €",
    images: [
      "https://www.labonnegraine.com/10057-home_default/coeur-de-boeuf-selection-cardinal.jpg",
      "https://www.labonnegraine.com/10058-home_default/coeur-de-boeuf-selection-cardinal.jpg",
      "https://images.ctfassets.net/b85ozb2q358o/7893644ef29a4a4217c801837dca6135de5285f830f9ffdbfad3aa1ad63d0431/8404e84a4efe029a6749f6f2e25a7ce0/image.png",
    ],
    description:
      "Variété ancienne de tomate cœur de bœuf, à gros fruits charnus, peu de graines et chair fondante. Idéale pour les salades et carpaccios. Croissance vigoureuse, à palisser.",
    category: "Légumes",
    plantingPeriod: "Février-Avril (sous abri)",
    floweringPeriod: "Mai-Juillet",
    edible: true,
    harvestDate: "Juillet-Septembre 2025",
    seller: demoUser[1],
    createdAt: "2025-11-14T16:10:00Z",
    isFavorite: true,
    sold: false,
  },
  {
    id: 3,
    name: "Bulbes de lys ‘Forever Susan’",
    quantity: "5 bulbes",
    price: "9,90 €",
    images: [
      "https://i.etsystatic.com/22242257/r/il/13b9f3/4618962222/il_fullxfull.4618962222_3ygs.jpg",
      "https://m.media-amazon.com/images/I/61zdU3NqpeL._AC_UF1000,1000_QL80_.jpg",
    ],
    description:
      "Bulbes de lys asiatique ‘Forever Susan’ aux fleurs bicolores orange et bordeaux très décoratives. Parfait en massif ou en pot. Hauteur 60 à 80 cm, bonne tenue en bouquet.",
    category: "Fleurs décoratives",
    plantingPeriod: "Septembre-Octobre",
    floweringPeriod: "Juin-Juillet",
    edible: false,
    harvestDate: "Juillet 2025",
    seller: demoUser[0],
    createdAt: "2025-11-13T11:45:00Z",
    sold: false,
  },
  {
    id: 4,
    name: "Bulbes de safran (Crocus sativus)",
    quantity: "15 bulbes",
    price: "29,00 €",
    images: [
      "https://www.boutiquesafran.fr/images/gallery/saffron_flower.jpg",
      "https://www.alsagarden.com/wp-content/uploads/2012/12/safran-bulbes-1.jpeg",
    ],
    description:
      "Bulbes de Crocus sativus pour produire votre propre safran. Chaque bulbe donne plusieurs fleurs dont les stigmates séchés fournissent l’épice la plus précieuse du monde. Idéal en massif ou en pot, en sol bien drainé.",
    category: "Herbes aromatiques / épices",
    plantingPeriod: "Août-Octobre",
    floweringPeriod: "Octobre-Novembre",
    edible: true,
    harvestDate: "Novembre 2025",
    seller: demoUser[2],
    createdAt: "2025-11-10T08:20:00Z",
    sold: false,
  },
  {
    id: 5,
    name: "Mélange de graines de fleurs des champs",
    quantity: "20g",
    price: "5,50 €",
    images: [
      "https://cdn.webshopapp.com/shops/20999/files/467277817/1000x1000x2/image.jpg",
      "https://s1.semencesdupuy.com/18119-home_default/melanges-de-fleurs-sauvages-bonne-terres-franches-good-shaded-lands.jpg",
    ],
    description:
      "Mélange de graines de fleurs sauvages des champs (coquelicots, bleuets, marguerites, etc.) pour créer un massif naturel et mellifère. Idéal pour attirer abeilles, papillons et autres pollinisateurs.",
    category: "Fleurs décoratives",
    plantingPeriod: "Mars-Juin",
    floweringPeriod: "Mai-Octobre",
    edible: false,
    harvestDate: "Octobre 2025",
    seller: demoUser[1],
    createdAt: "2025-11-12T15:05:00Z",
    sold: false,
  },
  {
    id: 6,
    name: "Graines de basilic grand vert",
    quantity: "5g (env. 150 graines)",
    price: "2,80 €",
    images: [
      "https://resize.elle.fr/article_1280/var/plain_site/storage/images/deco/exterieur/jardin/plantes/cette-astuce-vous-permettra-de-sauver-un-plant-de-basilic-4230478/102107602-1-fre-FR/Cette-astuce-vous-permettra-de-sauver-un-plant-de-basilic.jpg",
      "https://unpasplusvert.fr/wp-content/uploads/2023/03/Graines-de-basilic-001.jpg",
    ],
    description:
      "Graines de basilic grand vert à large feuillage très parfumé. Parfait pour pesto, salades et cuisine méditerranéenne. Culture facile en pot ou au jardin.",
    category: "Herbes aromatiques / épices",
    plantingPeriod: "Mars-Mai (sous abri) puis mai-juin (plein air)",
    floweringPeriod: "Juillet-Septembre",
    edible: true,
    harvestDate: "Juin-Septembre 2025",
    seller: demoUser[0],
    createdAt: "2025-11-09T18:40:00Z",
    isFavorite: false,
    sold: false,
  },
  {
    id: 7,
    name: "Graines de tournesol à planter",
    quantity: "30 graines",
    price: "3,20 €",
    images: [
      "https://www.les-bouquets-de-la-muse.fr/wp-content/uploads/2023/10/tournesol-au-soleil.jpg",
      "https://i.ytimg.com/vi/9_SzEO5PEUI/maxresdefault.jpg",
    ],
    description:
      "Graines de tournesol ornemental à grande tige, fleurs jaunes lumineuses. Idéal pour border un potager ou créer un écran végétal. Graines comestibles après maturité.",
    category: "Fleurs décoratives",
    plantingPeriod: "Avril-Juin",
    floweringPeriod: "Juillet-Septembre",
    edible: true,
    harvestDate: "Septembre 2025",
    seller: demoUser[2],
    createdAt: "2025-11-08T10:15:00Z",
    sold: false,
  },
  {
    id: 8,
    name: "Graines de coriandre",
    quantity: "10g",
    price: "2,50 €",
    images: [
      "https://img-3.journaldesfemmes.fr/qS48r7dpmQALHwglrIZIGXJOXQI=/1500x/smart/36a73a71d6854e939058f80ad0a96ff1/ccmcms-jdf/39630015.jpg",
      "https://cache.marieclaire.fr/data/photo/w1200_h630_c17/6s/coriandre-ou-persil-que-choisir.jpg",
      "https://www.rustica.fr/images/coriande-209606j.jpg",
    ],
    description:
      "Graines de coriandre pour feuilles et graines aromatiques. Parfaite pour la cuisine asiatique, orientale et latino. Se cultive facilement en pot ou en pleine terre.",
    category: "Herbes aromatiques / épices",
    plantingPeriod: "Mars-Juin et Septembre",
    floweringPeriod: "Juin-Août",
    edible: true,
    harvestDate: "Juillet-Septembre 2025",
    seller: demoUser[1],
    createdAt: "2025-11-07T13:00:00Z",
    sold: false,
  },
  {
    id: 9,
    name: "Graines de carottes",
    quantity: "8g",
    price: "3,00 €",
    images: [
      "https://www.deco.fr/sites/default/files/styles/1200x675/public/2019-12/shutterstock_591453185.jpg",
      "https://trucmania.ouest-france.fr/wp-content/uploads/2021/06/semer-des-carottes.jpg",
      "https://static.aujardin.info/cache/th/img10/daucus-carotta-1200x900.webp",
    ],
    description:
      "Graines de carotte de type nantaise, racines longues et sucrées. Bonne conservation et idéale pour les jus, purées et crudités.",
    category: "Légumes",
    plantingPeriod: "Mars-Juillet",
    floweringPeriod: "Mai-Septembre (plante montée en graines)",
    edible: true,
    harvestDate: "Juin-Octobre 2025",
    seller: demoUser[1],
    createdAt: "2025-11-06T09:50:00Z",
    sold: false,
  },
  {
    id: 10,
    name: "Graines de poivrons verts",
    quantity: "30 graines",
    price: "3,80 €",
    images: [
      "https://www.comptoirdesjardins.fr/img/cms/Images%20fiches%20cultures/Poivrons/poivrons_mobile_1.JPG",
      "https://ekladata.com/e7B0TetG4UaBnE5Fz0BRQGG1bBw.jpg",
    ],
    description:
      "Graines de poivron vert doux, fruits allongés et charnus. À récolter verts ou à laisser mûrir pour obtenir des fruits rouges plus sucrés.",
    category: "Légumes",
    plantingPeriod: "Février-Avril (sous abri)",
    floweringPeriod: "Mai-Août",
    edible: true,
    harvestDate: "Juillet-Octobre 2025",
    seller: demoUser[2],
    createdAt: "2025-11-22T19:05:00Z",
    sold: false,
  },
  {
    id: 11,
    name: "Noyaux de mangues à faire germer",
    quantity: "5 noyaux",
    price: "6,50 €",
    images: [
      "https://bricoleurpro.ouest-france.fr/images/dossiers/2023-07/manguier-055034.jpg",
      "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg64zonEfu67jsM-XhRE88-uUXEHJonHDJD3Pm4dcDiMWzvxDJ5w2S-vWZY4R95SNizIUIkSRXI7gmOg7J1IMpcrlZ62L9m_UvVi8WtOG3cwZk6AI_zZ2hkleaVoqCFp9CaHCleEDKYFaL9/s1600/faire-pousser-noyau-mangue.JPG",
      "https://www.lesjardinsdaissa.com/cdn/shop/files/ecorce-de-manguier-bio-naturelle-qualite-superieure-les-jardins-aissa-arbre.webp?v=1757755586&width=697",
    ],
    description:
      "Noyaux de mangue prêts à être mis en germination pour obtenir de jeunes manguiers ornementaux. Culture possible en pot en intérieur lumineux ou en véranda.",
    category: "Fruits",
    plantingPeriod: "Mars-Juillet (intérieur chaud)",
    floweringPeriod: "Variable selon conditions (plante surtout ornementale sous nos climats)",
    edible: true,
    harvestDate: "Non garantie en climat tempéré",
    seller: demoUser[0],
    createdAt: "2025-11-04T14:25:00Z",
    sold: false,
  },
  {
    id: 12,
    name: "Graines de pamplemousse",
    quantity: "20 graines",
    price: "3,20 €",
    images: [
      "https://magazine.hortus-focus.fr/wp-content/uploads/sites/2/2019/07/pamplemousse-valentynvolkov-e1561883407674.jpg",
      "https://www.siciliaverde.it/resources/uploads/_resize/image.php?i=pompelmo-rosa-6324b2298ba9e.jpg&width=1170&height=&cropratio=&image=/resources/uploads/products/pompelmo-rosa-6324b2298ba9e.jpg&no_watermark=1",
      "https://m.media-amazon.com/images/I/71ao0ZHUyUL.jpg",
    ],
    description:
      "Graines de pamplemousse rose pour obtenir de jeunes agrumes décoratifs. Culture en pot recommandée, à hiverner en intérieur lumineux.",
    category: "Fruits",
    plantingPeriod: "Février-Juin (intérieur)",
    floweringPeriod: "À partir de plusieurs années de culture",
    edible: true,
    harvestDate: "Non garantie avant plusieurs années",
    seller: demoUser[2],
    createdAt: "2025-11-03T17:55:00Z",
    sold: false,
  },
  {
    id: 13,
    name: "Graines de camomille romaine",
    quantity: "5g",
    price: "3,40 €",
    images: [
      "https://media.gerbeaud.net/2019/10/640/chamaemelum-nobile-camomille-romaine.jpg",
      "https://www.lepotagerdugailleroux.com/wp-content/uploads/2020/01/Grande-camomille-1.jpg",
    ],
    description:
      "Graines de camomille romaine (Chamaemelum nobile), plante médicinale vivace, utilisée en infusion pour ses propriétés apaisantes. Joli couvre-sol à petites fleurs blanches.",
    category: "Plantes médicinales",
    plantingPeriod: "Mars-Juin",
    floweringPeriod: "Juin-Septembre",
    edible: true,
    harvestDate: "Juillet-Septembre 2025",
    seller: demoUser[1],
    createdAt: "2025-11-02T10:00:00Z",
    sold: false,
  },
  {
    id: 14,
    name: "20 graines d’Heliconia",
    quantity: "20 graines",
    price: "8,90 €",
    images: [
      "https://monjardintropical.fr/cdn/shop/files/heliconiarougeetjaune.png?v=1713883525&width=416",
      "https://semillasdelmundo.com/wp-content/uploads/2023/01/Heliconia-Splash-Heliconia-champneiana.jpg",
      "https://www.viriar.com/cdn/shop/files/Heliconia_latispatha_1.png?v=1724912558&width=1445",
    ],
    description:
      "Graines d’Heliconia, plante tropicale aux inflorescences spectaculaires rouges, jaunes et orangées. À cultiver en intérieur très lumineux ou serre chaude.",
    category: "Plantes exotiques / rares",
    plantingPeriod: "Toute l’année en intérieur chauffé",
    floweringPeriod: "Printemps-Été (en conditions optimales)",
    edible: false,
    harvestDate: "Plante ornementale, pas de récolte alimentaire",
    seller: demoUser[0],
    createdAt: "2025-11-01T09:15:00Z",
    sold: false,
  },
  {
    id: 15,
    name: "Graines de passiflore bleue",
    quantity: "25 graines",
    price: "4,20 €",
    images: [
      "https://i-dj.unimedias.fr/2023/09/12/dja-passiflore-bleue-p-caerulea-65002026ee437.jpg?auto=format%2Ccompress&crop=faces&cs=tinysrgb&fit=max&ixlib=php-4.1.0&w=1050",
      "https://storage.canalblog.com/37/42/1676300/133659941_o.jpg",
      "https://s3.semencesdupuy.com/18330-home_default/passiflora-edulis.jpg",
    ],
    description:
      "Graines de passiflore bleue, liane grimpante vigoureuse aux fleurs très décoratives. Idéale pour couvrir un treillage, une pergola ou un balcon bien exposé.",
    category: "Plantes exotiques / rares",
    plantingPeriod: "Février-Mai (sous abri)",
    floweringPeriod: "Juin-Septembre",
    edible: false,
    harvestDate: "Plante principalement ornementale sous nos climats",
    seller: demoUser[2],
    createdAt: "2025-10-30T16:30:00Z",
    sold: false,
  },

  // Annonces à bannir (gardées pour les tests de modération)
  {
    id: 16,
    name: "Tabac prêt à l’emploi",
    quantity: "20g",
    price: "8,00 €",
    images: [
      "https://lasanteauquotidien.com/wp-content/uploads/2023/01/AdobeStock_398572808.jpeg",
    ],
    description:
      "Annonce contenant du tabac prêt à l’emploi. Cet article est interdit sur la plateforme et a été automatiquement supprimé.",
    category: "Plantes médicinales",
    plantingPeriod: "-",
    floweringPeriod: "-",
    edible: false,
    harvestDate: "-",
    seller: demoUser[0],
    createdAt: "2025-10-29T12:00:00Z",
    removedByAI: true,
    sold: false,
  },
  {
    id: 17,
    name: "Graines de cannabis",
    quantity: "10 graines",
    price: "15,00 €",
    images: [
      "https://www.francebleu.fr/pikapi/images/56a18e92-2823-48e9-b01a-f9f1a7a8ec92/1200x680?webp=false",
      "https://mamakana.com/cdn/shop/articles/Graines_Cannabis_ee25fbec-7301-4d76-acfe-1159380e8de1.png?v=1755762626&width=1100",
      "https://www.amsterdamgenetics.com/wp-content/uploads/2024/06/LeavesInHand-1.jpg",
    ],
    description:
      "Annonce contenant des graines de cannabis. Cet article est interdit sur la plateforme et a été automatiquement supprimé.",
    category: "Plantes médicinales",
    plantingPeriod: "-",
    floweringPeriod: "-",
    edible: false,
    harvestDate: "-",
    seller: demoUser[1],
    createdAt: "2025-10-28T18:20:00Z",
    removedByAI: true,
    sold: false,
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
    status: "completed",
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


//Mock reports admin
export const demoReports: Report[] = [
  {
    id: 1,
    productName: demoProducts[0].name,
    productId: demoProducts[0].id, // 1
    reportCount: 5,
    date: "2025-11-10",
    description: "Mais c'est juste des graines de fleurs, pas de cannabis !!",
    status: "pending",
  },
  {
    id: 2,
    productName: demoProducts[1].name,
    productId: demoProducts[1].id, // 2
    reportCount: 2,
    date: "2025-11-08",
    description: "Simple erreur de ma part, ça ne se reproduira plus",
    status: "approved",
  },
  {
    id: 3,
    productName: demoProducts[2].name,
    productId: demoProducts[2].id, // 3
    reportCount: 1,
    date: "2025-11-05",
    description: "Je ne comprends pas pourquoi...",
    status: "rejected",
  },
];





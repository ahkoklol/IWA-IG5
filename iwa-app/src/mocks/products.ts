import type { Product, User } from "../shared/types";

const demoUser: User = {
  id: 1,
  username: "jardin_elo",
  fullName: "Élodie Martin",
  avatar: "https://i.pravatar.cc/150?img=3",
  rating: 4.8,
  reviewCount: 124,
  location: "Montpellier, FR",
  nationality: "Française",
  followers: 320,
  following: 188,
  bio: "Passion graines anciennes & troc 🌱",
};

export const demoProducts: Product[] = [
  {
    id: 101,
    name: "Tomate Cœur de Bœuf",
    quantity: "x30 graines",
    price: "3,50 €",
    images: ["https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800"],
    description: "Variété ancienne, goût sucré, très productive.",
    category: "Légumes",
    plantingPeriod: ["Mars", "Avril"],
    floweringPeriod: ["Mai", "Juin"],
    edible: true,
    harvestDate: "Août - Septembre",
    seller: demoUser,
    isFavorite: false,
  },
  {
    id: 102,
    name: "Basilic Genovese",
    quantity: "x50 graines",
    price: "2,20 €",
    images: ["https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800"],
    description: "Parfum intense, idéal pesto.",
    category: "Herbes aromatiques / épices",
    plantingPeriod: ["Avril", "Mai"],
    floweringPeriod: ["Juin", "Juillet"],
    edible: true,
    harvestDate: "Juillet - Septembre",
    seller: demoUser,
    isFavorite: true,
  },
];

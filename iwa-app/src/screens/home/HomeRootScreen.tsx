import React, { useState } from "react";
import HomeScreen from "./HomeScreen";
import { demoProducts } from "../../mocks/products"; // ou remplace par tes données réelles

export default function HomeRootScreen() {
  const [products, setProducts] = useState(demoProducts);

  const handleProductClick = (p: any) => {
    // TODO: navigation vers le détail produit
    console.log("product", p.id);
  };

  const handleToggleFavorite = (id: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  };

  return (
    <HomeScreen
      products={products}
      onProductClick={handleProductClick}
      onToggleFavorite={handleToggleFavorite}
    />
  );
}

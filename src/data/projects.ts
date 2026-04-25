export type ProjectCategory = "apps" | "ecommerce" | "shopify";

export type ProjectItem = {
  id: string;
  category: ProjectCategory;
  /** Replace with `/projects/your-image.jpg` in `public/projects` when ready */
  image: string;
  titleFr: string;
  titleEn: string;
};

export const PROJECT_CATEGORIES: ProjectCategory[] = ["apps", "ecommerce", "shopify"];

export const PROJECTS: ProjectItem[] = [
  {
    id: "gaviyot",
    category: "apps",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&auto=format&fit=crop&q=80",
    titleFr: "Application mobile — maquettes & UI",
    titleEn: "Mobile app — mockups & UI",
  },
  {
    id: "dashboard",
    category: "apps",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80",
    titleFr: "Tableau de bord — interface analytique",
    titleEn: "Dashboard — analytics UI",
  },
  {
    id: "jewelry",
    category: "ecommerce",
    image:
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&auto=format&fit=crop&q=80",
    titleFr: "Boutique en ligne — bijoux",
    titleEn: "E‑commerce — jewelry brand",
  },
  {
    id: "food",
    category: "ecommerce",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&auto=format&fit=crop&q=80",
    titleFr: "Site vitrine — restauration",
    titleEn: "Landing page — food brand",
  },
  {
    id: "outdoor",
    category: "shopify",
    image:
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&auto=format&fit=crop&q=80",
    titleFr: "E‑commerce outdoor — thème Shopify",
    titleEn: "Outdoor store — Shopify theme",
  },
  {
    id: "travel",
    category: "apps",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&auto=format&fit=crop&q=80",
    titleFr: "Application voyage — réservation",
    titleEn: "Travel app — booking flow",
  },
];

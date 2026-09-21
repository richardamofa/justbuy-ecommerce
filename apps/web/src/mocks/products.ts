import type { Product } from "@ecommerce/contracts";

interface Seed {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  price: number;
  salePrice?: number;
  tags: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  stock?: number;
  colors?: string[];
  sizes?: string[];
  description: string;
  images: [string, string, string];
}

const seeds: Seed[] = [
  {
    id: "prod_wool_coat",
    name: "Wool Overcoat",
    slug: "wool-overcoat",
    categoryId: "cat_apparel_outerwear",
    price: 1450,
    tags: ["outerwear", "winter"],
    isFeatured: true,
    isNewArrival: true,
    colors: ["Camel", "Charcoal"],
    sizes: ["S", "M", "L", "XL"],
    description:
      "A double-faced wool overcoat with a clean, undecorated silhouette. Cut long, with a soft shoulder and covered placket.",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&h=1200&q=85",
      "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?auto=format&fit=crop&w=900&h=1200&q=85",
      "https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=900&h=1200&q=85",
    ],
  },
  {
    id: "prod_merino_sweater",
    name: "Merino Crewneck",
    slug: "merino-crewneck",
    categoryId: "cat_apparel_knitwear",
    price: 420,
    salePrice: 320,
    tags: ["knitwear"],
    isBestSeller: true,
    colors: ["Oatmeal", "Ink", "Moss"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "14-gauge merino wool, fully fashioned for a clean seam line. Holds its shape wash after wash.",
    images: [
      "https://images.unsplash.com/photo-1608234807905-4466023792f5?auto=format&fit=crop&w=900&h=1200&q=85",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&h=1200&q=85",
      "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?auto=format&fit=crop&w=900&h=1200&q=85",
    ],
  },
  {
    id: "prod_cotton_shirt",
    name: "Oxford Shirt",
    slug: "oxford-shirt",
    categoryId: "cat_apparel",
    price: 280,
    tags: ["shirting"],
    isNewArrival: true,
    colors: ["White", "Sky Blue"],
    sizes: ["S", "M", "L", "XL"],
    description: "Brushed oxford cotton with a soft button-down collar. Slightly boxy through the body.",
    images: [
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&w=900&h=1200&q=85",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&h=1200&q=85",
      "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=900&h=1200&q=85",
    ],
  },
  {
    id: "prod_wide_trouser",
    name: "Wide-Leg Trouser",
    slug: "wide-leg-trouser",
    categoryId: "cat_apparel",
    price: 390,
    tags: ["trousers"],
    isBestSeller: true,
    colors: ["Stone", "Black"],
    sizes: ["28", "30", "32", "34", "36"],
    description: "A relaxed wide leg in mid-weight twill, finished with a clean waistband and no visible pockets.",
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=900&h=1200&q=85",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&h=1200&q=85",
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&h=1200&q=85",
    ],
  },
  {
    id: "prod_leather_derby",
    name: "Leather Derby",
    slug: "leather-derby",
    categoryId: "cat_footwear",
    price: 980,
    tags: ["shoes", "leather"],
    isFeatured: true,
    colors: ["Chestnut", "Black"],
    sizes: ["40", "41", "42", "43", "44", "45"],
    description: "Full-grain leather derby on a Goodyear-welted sole built to be resoled for years of wear.",
    images: [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=900&h=1200&q=85",
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=900&h=1200&q=85",
      "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?auto=format&fit=crop&w=900&h=1200&q=85",
    ],
  },
  {
    id: "prod_canvas_sneaker",
    name: "Canvas Court Sneaker",
    slug: "canvas-court-sneaker",
    categoryId: "cat_footwear",
    price: 340,
    salePrice: 270,
    tags: ["shoes"],
    isBestSeller: true,
    isNewArrival: true,
    colors: ["White", "Ecru"],
    sizes: ["39", "40", "41", "42", "43", "44"],
    description: "A low-profile court sneaker in heavyweight canvas with a vulcanised rubber sole.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&h=1200&q=85",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&h=1200&q=85",
      "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=900&h=1200&q=85",
    ],
  },
  {
    id: "prod_leather_tote",
    name: "Structured Tote",
    slug: "structured-tote",
    categoryId: "cat_bags",
    price: 1120,
    tags: ["bags", "leather"],
    isFeatured: true,
    colors: ["Tan", "Black"],
    description: "Vegetable-tanned leather tote with an internal zip pocket and a magnetic top closure.",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&h=1200&q=85",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&h=1200&q=85",
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&h=1200&q=85",
    ],
    stock: 14,
  },
  {
    id: "prod_crossbody",
    name: "Mini Crossbody",
    slug: "mini-crossbody",
    categoryId: "cat_bags",
    price: 480,
    tags: ["bags"],
    isNewArrival: true,
    colors: ["Moss", "Black", "Tan"],
    description: "A compact crossbody with an adjustable strap, sized for the essentials and nothing else.",
    images: [
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=900&h=1200&q=85",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&h=1200&q=85",
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&h=1200&q=85",
    ],
    stock: 22,
  },
  {
    id: "prod_wool_scarf",
    name: "Merino Scarf",
    slug: "merino-scarf",
    categoryId: "cat_accessories",
    price: 180,
    tags: ["accessories", "winter"],
    colors: ["Charcoal", "Oatmeal"],
    description: "A generously sized merino scarf, brushed for softness, finished with a hand-fringed edge.",
    images: [
      "https://images.unsplash.com/photo-1601924928378-8e8f1e6f5f3c?auto=format&fit=crop&w=900&h=1200&q=85",
      "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=900&h=1200&q=85",
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?auto=format&fit=crop&w=900&h=1200&q=85",
    ],
    stock: 40,
  },
  {
    id: "prod_leather_belt",
    name: "Leather Belt",
    slug: "leather-belt",
    categoryId: "cat_accessories",
    price: 210,
    tags: ["accessories", "leather"],
    isBestSeller: true,
    colors: ["Black", "Chestnut"],
    sizes: ["S", "M", "L"],
    description: "A 3cm leather belt with a solid brass buckle, finished by hand.",
    images: [
      "https://images.unsplash.com/photo-1624222247344-550fb8f7f9c4?auto=format&fit=crop&w=900&h=1200&q=85",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&h=1200&q=85",
      "https://images.unsplash.com/photo-1523779917675-b6ed3a42a561?auto=format&fit=crop&w=900&h=1200&q=85",
    ],
  },
  {
    id: "prod_ceramic_vase",
    name: "Ceramic Vessel",
    slug: "ceramic-vessel",
    categoryId: "cat_home",
    price: 260,
    tags: ["home", "ceramics"],
    isFeatured: true,
    description: "A hand-thrown stoneware vessel with a matte glaze, no two pieces exactly alike.",
    images: [
      "https://images.unsplash.com/photo-1578500351865-d6c3706f6b9a?auto=format&fit=crop&w=900&h=1200&q=85",
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&h=1200&q=85",
      "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=900&h=1200&q=85",
    ],
    stock: 9,
  },
  {
    id: "prod_linen_throw",
    name: "Washed Linen Throw",
    slug: "washed-linen-throw",
    categoryId: "cat_home",
    price: 340,
    tags: ["home", "linen"],
    isNewArrival: true,
    colors: ["Natural", "Clay", "Ink"],
    description: "Stonewashed European linen throw, finished with a fringed edge on all sides.",
    images: [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&h=1200&q=85",
      "https://images.unsplash.com/photo-1600369671236-e74521d4b7ad?auto=format&fit=crop&w=900&h=1200&q=85",
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&h=1200&q=85",
    ],
    stock: 3,
  },
];

function buildProduct(seed: Seed): Product {
  const images = seed.images.map((url, index) => ({
    id: `${seed.id}_img_${index + 1}`,
    url,
    alt: seed.name,
    position: index,
  }));

  const options = [];
  if (seed.colors?.length) options.push({ name: "Color", values: seed.colors });
  if (seed.sizes?.length) options.push({ name: "Size", values: seed.sizes });

  const variants =
    seed.colors && seed.sizes
      ? seed.colors.flatMap((color, ci) =>
          seed.sizes!.map((size, si) => ({
            id: `${seed.id}_var_${ci}_${si}`,
            productId: seed.id,
            sku: `${seed.id.toUpperCase()}-${color.slice(0, 2).toUpperCase()}-${size}`,
            options: { Color: color, Size: size },
            stock: 8,
            isDefault: ci === 0 && si === 0,
          }))
        )
      : seed.colors
        ? seed.colors.map((color, ci) => ({
            id: `${seed.id}_var_${ci}`,
            productId: seed.id,
            sku: `${seed.id.toUpperCase()}-${color.slice(0, 2).toUpperCase()}`,
            options: { Color: color },
            stock: 12,
            isDefault: ci === 0,
          }))
        : [];

  const totalStock = variants.length ? variants.reduce((sum, v) => sum + v.stock, 0) : seed.stock ?? 20;

  return {
    id: seed.id,
    name: seed.name,
    slug: seed.slug,
    description: seed.description,
    shortDescription: seed.description.split(".")[0] + ".",
    price: seed.price,
    salePrice: seed.salePrice,
    currency: "GHS",
    sku: seed.id.toUpperCase(),
    images,
    categoryId: seed.categoryId,
    collectionIds: [],
    tags: seed.tags,
    options,
    variants,
    stock: totalStock,
    lowStockThreshold: 5,
    trackInventory: true,
    isFeatured: !!seed.isFeatured,
    isBestSeller: !!seed.isBestSeller,
    isNewArrival: !!seed.isNewArrival,
    visibility: "visible",
    rating: 4.2 + (seed.id.length % 6) / 10,
    reviewCount: 6 + (seed.id.length % 40),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export const mockProducts: Product[] = seeds.map(buildProduct);

export function findProductBySlug(slug: string) {
  return mockProducts.find((p) => p.slug === slug);
}

import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const image = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

async function main() {
  console.log("🌱 Starting database seed...");

  /*
   * This is development seed data only.
   */

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.customer.deleteMany();

  await prisma.productVariant.deleteMany();
  await prisma.productOption.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productCollection.deleteMany();
  await prisma.product.deleteMany();

  await prisma.collection.deleteMany();
  await prisma.category.deleteMany();

  await prisma.homepageSection.deleteMany();
  await prisma.promotion.deleteMany();

  /*
   * STORE SETTINGS
   */

  await prisma.storeSettings.upsert({
    where: {
      id: "store_settings",
    },
    update: {
      storeName: "JustBuy",
      storeDescription:
        "A modern online store for fashion, electronics, beauty, and home essentials.",
      currency: "GHS",
      contactEmail: "hello@justbuy.store",
      supportPhone: "+233 20 000 0000",
      socialLinks: {
        instagram: "https://instagram.com/justbuy",
        twitter: "https://x.com/justbuy",
        facebook: "https://facebook.com/justbuy",
        tiktok: "https://tiktok.com/@justbuy",
      },
      themeColor: "#1F3A36",
      shippingFlatRate: new Prisma.Decimal("25.00"),
      taxRatePercent: new Prisma.Decimal("0"),
    },
    create: {
      id: "store_settings",
      storeName: "JustBuy",
      storeDescription:
        "A modern online store for fashion, electronics, beauty, and home essentials.",
      currency: "GHS",
      contactEmail: "hello@justbuy.store",
      supportPhone: "+233 20 000 0000",
      socialLinks: {
        instagram: "https://instagram.com/justbuy",
        twitter: "https://x.com/justbuy",
        facebook: "https://facebook.com/justbuy",
        tiktok: "https://tiktok.com/@justbuy",
      },
      themeColor: "#1F3A36",
      shippingFlatRate: new Prisma.Decimal("25.00"),
      taxRatePercent: new Prisma.Decimal("0"),
    },
  });

  /*
   * CATEGORIES
   */

  const fashion = await prisma.category.create({
    data: {
      name: "Fashion",
      slug: "fashion",
      description: "Clothing, accessories, and everyday style.",
      position: 0,
      isVisible: true,
      seoTitle: "Fashion | JustBuy",
      seoDescription:
        "Discover clothing and accessories for everyday style.",
    },
  });

  const electronics = await prisma.category.create({
    data: {
      name: "Electronics",
      slug: "electronics",
      description: "Everyday technology, devices, and accessories.",
      position: 1,
      isVisible: true,
      seoTitle: "Electronics | JustBuy",
      seoDescription:
        "Shop phones, audio products, and everyday electronics.",
    },
  });

  const beauty = await prisma.category.create({
    data: {
      name: "Beauty",
      slug: "beauty",
      description: "Skincare, haircare, and everyday beauty essentials.",
      position: 2,
      isVisible: true,
      seoTitle: "Beauty | JustBuy",
      seoDescription:
        "Shop skincare, haircare, and beauty essentials.",
    },
  });

  const homeLiving = await prisma.category.create({
    data: {
      name: "Home & Living",
      slug: "home-living",
      description: "Furniture, decor, and essentials for your home.",
      position: 3,
      isVisible: true,
      seoTitle: "Home & Living | JustBuy",
      seoDescription:
        "Discover furniture, decor, and home essentials.",
    },
  });

  const mensClothing = await prisma.category.create({
    data: {
      name: "Men's Clothing",
      slug: "mens-clothing",
      description: "Everyday clothing for men.",
      parentId: fashion.id,
      position: 0,
      isVisible: true,
    },
  });

  const womensClothing = await prisma.category.create({
    data: {
      name: "Women's Clothing",
      slug: "womens-clothing",
      description: "Everyday clothing for women.",
      parentId: fashion.id,
      position: 1,
      isVisible: true,
    },
  });

  const accessories = await prisma.category.create({
    data: {
      name: "Accessories",
      slug: "accessories",
      description: "Everyday fashion accessories.",
      parentId: fashion.id,
      position: 2,
      isVisible: true,
    },
  });

  const phones = await prisma.category.create({
    data: {
      name: "Phones",
      slug: "phones",
      description: "Smartphones and mobile devices.",
      parentId: electronics.id,
      position: 0,
      isVisible: true,
    },
  });

  const audio = await prisma.category.create({
    data: {
      name: "Audio",
      slug: "audio",
      description: "Headphones, earbuds, and speakers.",
      parentId: electronics.id,
      position: 1,
      isVisible: true,
    },
  });

  const electronicsAccessories = await prisma.category.create({
    data: {
      name: "Tech Accessories",
      slug: "tech-accessories",
      description: "Useful accessories for everyday devices.",
      parentId: electronics.id,
      position: 2,
      isVisible: true,
    },
  });

  const skincare = await prisma.category.create({
    data: {
      name: "Skincare",
      slug: "skincare",
      description: "Daily skincare essentials.",
      parentId: beauty.id,
      position: 0,
      isVisible: true,
    },
  });

  const haircare = await prisma.category.create({
    data: {
      name: "Haircare",
      slug: "haircare",
      description: "Haircare products for everyday routines.",
      parentId: beauty.id,
      position: 1,
      isVisible: true,
    },
  });

  const furniture = await prisma.category.create({
    data: {
      name: "Furniture",
      slug: "furniture",
      description: "Furniture for modern spaces.",
      parentId: homeLiving.id,
      position: 0,
      isVisible: true,
    },
  });

  const homeDecor = await prisma.category.create({
    data: {
      name: "Home Decor",
      slug: "home-decor",
      description: "Decorative pieces for your home.",
      parentId: homeLiving.id,
      position: 1,
      isVisible: true,
    },
  });

  /*
   * COLLECTIONS
   */

  const newArrivals = await prisma.collection.create({
    data: {
      name: "New Arrivals",
      slug: "new-arrivals",
      description: "Fresh products recently added to the store.",
      isVisible: true,
    },
  });

  const bestSellers = await prisma.collection.create({
    data: {
      name: "Best Sellers",
      slug: "best-sellers",
      description: "Products customers are buying most.",
      isVisible: true,
    },
  });

  const staffPicks = await prisma.collection.create({
    data: {
      name: "Staff Picks",
      slug: "staff-picks",
      description: "Products selected by the JustBuy team.",
      isVisible: true,
    },
  });

  /*
   * PRODUCTS
   */

  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Essential Oversized Tee",
        slug: "essential-oversized-tee",
        description:
          "A relaxed everyday t-shirt made for comfort and easy styling.",
        shortDescription: "Relaxed everyday cotton tee.",
        price: new Prisma.Decimal("180.00"),
        currency: "GHS",
        sku: "JB-FAS-TEE-001",
        categoryId: mensClothing.id,
        tags: ["fashion", "men", "t-shirt", "new"],
        stock: 45,
        lowStockThreshold: 5,
        trackInventory: true,
        isFeatured: true,
        isNewArrival: true,
        visibility: "visible",
        seoTitle: "Essential Oversized Tee | JustBuy",
        seoDescription:
          "A relaxed oversized everyday t-shirt.",
        images: {
          create: [
            {
              url: image(
                "photo-1521572163474-6864f9cf17ab"
              ),
              alt: "Essential oversized t-shirt",
              position: 0,
            },
          ],
        },
        options: {
          create: [
            {
              name: "Size",
              values: ["S", "M", "L", "XL"],
            },
            {
              name: "Color",
              values: ["Black", "White"],
            },
          ],
        },
        variants: {
          create: [
            {
              sku: "JB-FAS-TEE-001-BLK-M",
              options: {
                Size: "M",
                Color: "Black",
              },
              stock: 15,
              isDefault: true,
            },
            {
              sku: "JB-FAS-TEE-001-BLK-L",
              options: {
                Size: "L",
                Color: "Black",
              },
              stock: 12,
            },
            {
              sku: "JB-FAS-TEE-001-WHT-M",
              options: {
                Size: "M",
                Color: "White",
              },
              stock: 10,
            },
            {
              sku: "JB-FAS-TEE-001-WHT-L",
              options: {
                Size: "L",
                Color: "White",
              },
              stock: 8,
            },
          ],
        },
      },
    }),

    prisma.product.create({
      data: {
        name: "Structured Everyday Bag",
        slug: "structured-everyday-bag",
        description:
          "A compact structured bag designed for workdays, weekends, and everyday use.",
        shortDescription: "A clean everyday carry bag.",
        price: new Prisma.Decimal("420.00"),
        salePrice: new Prisma.Decimal("350.00"),
        currency: "GHS",
        sku: "JB-FAS-BAG-001",
        categoryId: accessories.id,
        tags: ["fashion", "accessories", "bag"],
        stock: 20,
        lowStockThreshold: 4,
        trackInventory: true,
        isFeatured: true,
        visibility: "visible",
        images: {
          create: [
            {
              url: image(
                "photo-1553062407-98eeb64c6a62"
              ),
              alt: "Structured everyday bag",
              position: 0,
            },
          ],
        },
        options: {
          create: [
            {
              name: "Color",
              values: ["Black", "Brown"],
            },
          ],
        },
        variants: {
          create: [
            {
              sku: "JB-FAS-BAG-001-BLK",
              options: {
                Color: "Black",
              },
              stock: 12,
              isDefault: true,
            },
            {
              sku: "JB-FAS-BAG-001-BRN",
              options: {
                Color: "Brown",
              },
              stock: 8,
            },
          ],
        },
      },
    }),

    prisma.product.create({
      data: {
        name: "Minimal Knit Sweater",
        slug: "minimal-knit-sweater",
        description:
          "A soft knit sweater with a clean silhouette for cooler evenings.",
        shortDescription: "Soft everyday knit sweater.",
        price: new Prisma.Decimal("380.00"),
        currency: "GHS",
        sku: "JB-FAS-SWT-001",
        categoryId: womensClothing.id,
        tags: ["fashion", "women", "sweater"],
        stock: 28,
        lowStockThreshold: 5,
        trackInventory: true,
        isNewArrival: true,
        visibility: "visible",
        images: {
          create: [
            {
              url: image(
                "photo-1576566588028-4147f3842f27"
              ),
              alt: "Minimal knit sweater",
              position: 0,
            },
          ],
        },
        options: {
          create: [
            {
              name: "Size",
              values: ["S", "M", "L"],
            },
          ],
        },
        variants: {
          create: [
            {
              sku: "JB-FAS-SWT-001-S",
              options: {
                Size: "S",
              },
              stock: 8,
              isDefault: true,
            },
            {
              sku: "JB-FAS-SWT-001-M",
              options: {
                Size: "M",
              },
              stock: 12,
            },
            {
              sku: "JB-FAS-SWT-001-L",
              options: {
                Size: "L",
              },
              stock: 8,
            },
          ],
        },
      },
    }),

    prisma.product.create({
      data: {
        name: "Wireless Noise-Cancelling Headphones",
        slug: "wireless-noise-cancelling-headphones",
        description:
          "Wireless over-ear headphones designed for focused listening and everyday travel.",
        shortDescription: "Wireless over-ear headphones.",
        price: new Prisma.Decimal("1450.00"),
        salePrice: new Prisma.Decimal("1299.00"),
        currency: "GHS",
        sku: "JB-ELC-AUD-001",
        categoryId: audio.id,
        tags: ["electronics", "audio", "headphones"],
        stock: 16,
        lowStockThreshold: 3,
        trackInventory: true,
        isFeatured: true,
        isBestSeller: true,
        visibility: "visible",
        images: {
          create: [
            {
              url: image(
                "photo-1505740420928-5e560c06d30e"
              ),
              alt: "Wireless headphones",
              position: 0,
            },
          ],
        },
      },
    }),

    prisma.product.create({
      data: {
        name: "Compact Wireless Speaker",
        slug: "compact-wireless-speaker",
        description:
          "A compact wireless speaker with a clean design for rooms, desks, and outdoor listening.",
        shortDescription: "Compact wireless speaker.",
        price: new Prisma.Decimal("620.00"),
        currency: "GHS",
        sku: "JB-ELC-SPK-001",
        categoryId: audio.id,
        tags: ["electronics", "audio", "speaker"],
        stock: 24,
        lowStockThreshold: 4,
        trackInventory: true,
        isBestSeller: true,
        visibility: "visible",
        images: {
          create: [
            {
              url: image(
                "photo-1608043152269-423dbba4e7e1"
              ),
              alt: "Compact wireless speaker",
              position: 0,
            },
          ],
        },
      },
    }),

    prisma.product.create({
      data: {
        name: "Daily Hydration Serum",
        slug: "daily-hydration-serum",
        description:
          "A lightweight facial serum designed to support a simple daily skincare routine.",
        shortDescription: "Lightweight daily hydration serum.",
        price: new Prisma.Decimal("210.00"),
        currency: "GHS",
        sku: "JB-BEA-SKN-001",
        categoryId: skincare.id,
        tags: ["beauty", "skincare", "serum"],
        stock: 35,
        lowStockThreshold: 6,
        trackInventory: true,
        isNewArrival: true,
        visibility: "visible",
        images: {
          create: [
            {
              url: image(
                "photo-1556228578-8c89e6adf883"
              ),
              alt: "Daily hydration serum",
              position: 0,
            },
          ],
        },
      },
    }),

    prisma.product.create({
      data: {
        name: "Modern Lounge Chair",
        slug: "modern-lounge-chair",
        description:
          "A comfortable lounge chair with a simple silhouette designed for modern interiors.",
        shortDescription: "Modern accent lounge chair.",
        price: new Prisma.Decimal("2850.00"),
        currency: "GHS",
        sku: "JB-HOM-FUR-001",
        categoryId: furniture.id,
        tags: ["home", "furniture", "chair"],
        stock: 7,
        lowStockThreshold: 2,
        trackInventory: true,
        isFeatured: true,
        visibility: "visible",
        images: {
          create: [
            {
              url: image(
                "photo-1598300042247-d088f8ab3a91"
              ),
              alt: "Modern lounge chair",
              position: 0,
            },
          ],
        },
      },
    }),

    prisma.product.create({
      data: {
        name: "Ceramic Table Lamp",
        slug: "ceramic-table-lamp",
        description:
          "A warm ceramic table lamp that adds a subtle finishing touch to desks, bedrooms, and living spaces.",
        shortDescription: "Minimal ceramic table lamp.",
        price: new Prisma.Decimal("480.00"),
        currency: "GHS",
        sku: "JB-HOM-DEC-001",
        categoryId: homeDecor.id,
        tags: ["home", "decor", "lighting"],
        stock: 18,
        lowStockThreshold: 4,
        trackInventory: true,
        isNewArrival: true,
        visibility: "visible",
        images: {
          create: [
            {
              url: image(
                "photo-1507473885765-e6ed057f782c"
              ),
              alt: "Ceramic table lamp",
              position: 0,
            },
          ],
        },
      },
    }),
  ]);

  /*
   * PRODUCT → COLLECTION RELATIONSHIPS
   */

  const [
    essentialTee,
    everydayBag,
    knitSweater,
    headphones,
    speaker,
    serum,
    loungeChair,
    tableLamp,
  ] = products;

  await prisma.productCollection.createMany({
    data: [
      {
        productId: essentialTee.id,
        collectionId: newArrivals.id,
      },
      {
        productId: knitSweater.id,
        collectionId: newArrivals.id,
      },
      {
        productId: serum.id,
        collectionId: newArrivals.id,
      },
      {
        productId: tableLamp.id,
        collectionId: newArrivals.id,
      },
      {
        productId: headphones.id,
        collectionId: bestSellers.id,
      },
      {
        productId: speaker.id,
        collectionId: bestSellers.id,
      },
      {
        productId: everydayBag.id,
        collectionId: bestSellers.id,
      },
      {
        productId: essentialTee.id,
        collectionId: staffPicks.id,
      },
      {
        productId: headphones.id,
        collectionId: staffPicks.id,
      },
      {
        productId: loungeChair.id,
        collectionId: staffPicks.id,
      },
    ],
  });

  /*
   * PROMOTION
   */

  await prisma.promotion.create({
    data: {
      code: "WELCOME10",
      type: "percentage",
      value: new Prisma.Decimal("10.00"),
      isActive: true,
      minSubtotal: new Prisma.Decimal("300.00"),
    },
  });

  /*
   * HOMEPAGE
   */

  await prisma.homepageSection.createMany({
    data: [
      {
        id: "homepage-hero",
        type: "hero",
        position: 0,
        isEnabled: true,
        title: "Everyday essentials, thoughtfully selected.",
        subtitle:
          "Discover fashion, technology, beauty, and pieces for your home.",
        config: {
          banners: [
            {
              id: "hero-1",
              heading: "Everyday essentials, thoughtfully selected.",
              subheading:
                "Discover products made for how you live.",
              image: {
                id: "hero-image-1",
                url: image(
                  "photo-1441986300917-64674bd600d8"
                ),
                alt: "Modern retail store",
                position: 0,
              },
              ctaLabel: "Shop now",
              ctaHref: "/shop",
              position: 0,
              isActive: true,
            },
          ],
        },
      },
      {
        id: "homepage-new-arrivals",
        type: "product_carousel",
        position: 1,
        isEnabled: true,
        title: "New arrivals",
        subtitle: "Fresh additions to the store.",
        config: {
          productIds: [
            essentialTee.id,
            knitSweater.id,
            serum.id,
            tableLamp.id,
          ],
          viewAllHref: "/collections/new-arrivals",
        },
      },
      {
        id: "homepage-categories",
        type: "category_grid",
        position: 2,
        isEnabled: true,
        title: "Shop by category",
        subtitle: "Find what you're looking for.",
        config: {
          categoryIds: [
            fashion.id,
            electronics.id,
            beauty.id,
            homeLiving.id,
          ],
        },
      },
      {
        id: "homepage-featured",
        type: "product_grid",
        position: 3,
        isEnabled: true,
        title: "Featured picks",
        subtitle: "A few things worth taking a closer look at.",
        config: {
          productIds: [
            essentialTee.id,
            everydayBag.id,
            headphones.id,
            loungeChair.id,
          ],
          viewAllHref: "/shop?featured=true",
        },
      },
      {
        id: "homepage-collection",
        type: "collection",
        position: 4,
        isEnabled: true,
        title: "Staff picks",
        subtitle: "Selected by the JustBuy team.",
        config: {
          collectionId: staffPicks.id,
        },
      },
      {
        id: "homepage-newsletter",
        type: "newsletter",
        position: 5,
        isEnabled: true,
        title: "Stay in the loop",
        subtitle:
          "Get new arrivals, offers, and store updates in your inbox.",
        config: {
          heading: "Stay in the loop",
          body:
            "Sign up for occasional updates from JustBuy.",
        },
      },
    ],
  });

  /*
   * SUMMARY
   */

  const [
    categoryCount,
    collectionCount,
    productCount,
    promotionCount,
    homepageSectionCount,
  ] = await Promise.all([
    prisma.category.count(),
    prisma.collection.count(),
    prisma.product.count(),
    prisma.promotion.count(),
    prisma.homepageSection.count(),
  ]);

  console.log("");
  console.log("✅ Database seed completed.");
  console.log("");
  console.log(`Categories:        ${categoryCount}`);
  console.log(`Collections:       ${collectionCount}`);
  console.log(`Products:          ${productCount}`);
  console.log(`Promotions:        ${promotionCount}`);
  console.log(`Homepage sections: ${homepageSectionCount}`);
  console.log("");
}

main()
  .catch((error) => {
    console.error("❌ Database seed failed.");
    console.error(error);
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
import type { StoreSettings } from "@ecommerce/contracts";

export const mockStoreSettings: StoreSettings = {
  storeName: "Form",
  storeDescription: "Considered goods for daily wear.",
  currency: "GHS",
  contactEmail: "hello@form-store.example",
  supportPhone: "+233 20 000 0000",
  socialLinks: {
    instagram: "https://instagram.com",
  },
  themeColor: "#15171B",
  shippingFlatRate: 35,
  deliveryFee: 35,
  pickupLocations: ["JustBuy Osu Pickup Point"],
  taxRatePercent: 0,
};

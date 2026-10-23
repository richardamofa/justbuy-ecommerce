import type { StoreSettings as ContractStoreSettings } from "@ecommerce/contracts";
type PrismaStoreSettings = {
  id: string;
  storeName: string;
  storeDescription: string | null;
  logoUrl: string | null;
  faviconUrl: string | null;
  currency: string;
  contactEmail: string | null;
  supportPhone: string | null;
  socialLinks: unknown;
  themeColor: string;
  shippingFlatRate: unknown;
  pickupLocations: string[];
  taxRatePercent: unknown;
};

export function mapStoreSettings(
  settings: PrismaStoreSettings
): ContractStoreSettings {
  return {
    storeName: settings.storeName,

    ...(settings.storeDescription
      ? { storeDescription: settings.storeDescription }
      : {}),

    ...(settings.logoUrl
      ? {
          logo: {
            id: `${settings.id}_logo`,
            url: settings.logoUrl,
            alt: `${settings.storeName} logo`,
            position: 0,
          },
        }
      : {}),

    ...(settings.faviconUrl
      ? {
          favicon: {
            id: `${settings.id}_favicon`,
            url: settings.faviconUrl,
            alt: `${settings.storeName} favicon`,
            position: 0,
          },
        }
      : {}),

    currency: settings.currency,

    ...(settings.contactEmail
      ? { contactEmail: settings.contactEmail }
      : {}),

    ...(settings.supportPhone
      ? { supportPhone: settings.supportPhone }
      : {}),

    socialLinks:
      settings.socialLinks &&
      typeof settings.socialLinks === "object" &&
      !Array.isArray(settings.socialLinks)
        ? (() => {
            const links = settings.socialLinks as Record<string, unknown>;
            return {
              instagram:
                typeof links.instagram === "string" ? links.instagram : undefined,
              twitter:
                typeof links.twitter === "string" ? links.twitter : undefined,
              facebook:
                typeof links.facebook === "string" ? links.facebook : undefined,
              tiktok:
                typeof links.tiktok === "string" ? links.tiktok : undefined,
            };
          })()
        : {},

    themeColor: settings.themeColor,

    shippingFlatRate: Number(settings.shippingFlatRate),
    deliveryFee: Number(settings.shippingFlatRate),
    pickupLocations: settings.pickupLocations,

    taxRatePercent: Number(settings.taxRatePercent),
  };
}


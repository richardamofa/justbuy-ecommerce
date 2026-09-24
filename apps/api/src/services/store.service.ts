import type {
    StoreSettings,
    StoreSettingsUpdateInput,
} from "@ecommerce/contracts";
import { storeSettingsUpdateInputSchema } from "@ecommerce/contracts";
import { Prisma } from "@prisma/client";

import { HttpError } from "../lib/errors.js";
import { prisma } from "../lib/prisma.js";
import { mapStoreSettings } from "../mappers/store.js";

const STORE_SETTINGS_ID = "store_settings";

export async function getStoreSettings(): Promise<StoreSettings> {
  const settings = await prisma.storeSettings.findUnique({
    where: {
      id: STORE_SETTINGS_ID,
    },
  });

  if (!settings) {
    throw HttpError.notFound("Store settings have not been configured.");
  }

  return mapStoreSettings(settings);
}

export async function updateStoreSettings(
  input: StoreSettingsUpdateInput
): Promise<StoreSettings> {
  const parsed = storeSettingsUpdateInputSchema.parse(input);

  type StoreSettingsUpdateData = Prisma.StoreSettingsUpdateInput;
  const data: StoreSettingsUpdateData = {};

  if (parsed.storeName !== undefined) {
    data.storeName = parsed.storeName;
  }

  if (parsed.storeDescription !== undefined) {
    data.storeDescription = parsed.storeDescription;
  }

  if (parsed.logo !== undefined) {
    data.logoUrl = parsed.logo?.url ?? null;
  }

  if (parsed.favicon !== undefined) {
    data.faviconUrl = parsed.favicon?.url ?? null;
  }

  if (parsed.currency !== undefined) {
    data.currency = parsed.currency;
  }

  if (parsed.contactEmail !== undefined) {
    data.contactEmail = parsed.contactEmail;
  }

  if (parsed.supportPhone !== undefined) {
    data.supportPhone = parsed.supportPhone;
  }

  if (parsed.socialLinks !== undefined) {
    data.socialLinks = parsed.socialLinks as Prisma.InputJsonValue;
  }

  if (parsed.themeColor !== undefined) {
    data.themeColor = parsed.themeColor;
  }

  if (parsed.shippingFlatRate !== undefined) {
    data.shippingFlatRate = parsed.shippingFlatRate;
  }

  if (parsed.taxRatePercent !== undefined) {
    data.taxRatePercent = parsed.taxRatePercent;
  }

  const settings = await prisma.storeSettings.upsert({
    where: {
      id: STORE_SETTINGS_ID,
    },
    create: {
      id: STORE_SETTINGS_ID,
      storeName: parsed.storeName ?? "My Store",
      storeDescription: parsed.storeDescription,
      logoUrl: parsed.logo?.url,
      faviconUrl: parsed.favicon?.url,
      currency: parsed.currency ?? "GHS",
      contactEmail: parsed.contactEmail,
      supportPhone: parsed.supportPhone,
      socialLinks: (parsed.socialLinks ?? {}) as Prisma.InputJsonValue,
      themeColor: parsed.themeColor ?? "#111111",
      shippingFlatRate: parsed.shippingFlatRate ?? 0,
      taxRatePercent: parsed.taxRatePercent ?? 0,
    },
    update: data,
  });

  return mapStoreSettings(settings);
}


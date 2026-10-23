import { Button, Card, CardContent, FormField, Input, Skeleton, Textarea } from "@ecommerce/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { AdminLoadError } from "../components/AdminLoadError";
import { PageHeader } from "../components/PageHeader";
import { useAdminSettings, useSaveSettings } from "../hooks/queries";
import { settingsFormSchema, type SettingsFormValues } from "../schemas/settings";

export function SettingsPage() {
  const { data: settings, isLoading, isError, refetch } = useAdminSettings();
  const saveSettings = useSaveSettings();
  const [saved, setSaved] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SettingsFormValues>({ resolver: zodResolver(settingsFormSchema) });

  React.useEffect(() => {
    if (settings) {
      reset({
        storeName: settings.storeName,
        storeDescription: settings.storeDescription ?? "",
        currency: settings.currency,
        contactEmail: settings.contactEmail ?? "",
        supportPhone: settings.supportPhone ?? "",
        deliveryFee: settings.deliveryFee,
        pickupLocationsText: settings.pickupLocations.join("\n"),
        taxRatePercent: settings.taxRatePercent,
      });
    }
  }, [settings, reset]);

  async function onSubmit(values: SettingsFormValues) {
    if (!settings) return;
    const { pickupLocationsText, ...settingsValues } = values;
    await saveSettings.mutateAsync({
      ...settings,
      ...settingsValues,
      pickupLocations: (pickupLocationsText ?? "").split("\n").map((location) => location.trim()).filter(Boolean),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (isError) {
    return <div><PageHeader title="Settings" description="Store-wide configuration." /><AdminLoadError onRetry={() => { void refetch(); }} /></div>;
  }

  if (isLoading || !settings) {
    return (
      <div>
        <PageHeader title="Settings" description="Store-wide configuration." />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Settings" description="Store-wide configuration." />

      <Card className="max-w-2xl">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField label="Store name" htmlFor="storeName" error={errors.storeName?.message}>
              <Input id="storeName" {...register("storeName")} />
            </FormField>
            <FormField label="Store description" htmlFor="storeDescription">
              <Input id="storeDescription" {...register("storeDescription")} />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Currency code" htmlFor="currency" error={errors.currency?.message}>
                <Input id="currency" {...register("currency")} />
              </FormField>
              <FormField label="Contact email" htmlFor="contactEmail" error={errors.contactEmail?.message}>
                <Input id="contactEmail" {...register("contactEmail")} />
              </FormField>
              <FormField label="Support phone" htmlFor="supportPhone">
                <Input id="supportPhone" {...register("supportPhone")} />
              </FormField>
              <FormField label="Delivery fee" htmlFor="deliveryFee" error={errors.deliveryFee?.message}>
                <Input id="deliveryFee" type="number" step="0.01" {...register("deliveryFee")} />
              </FormField>
              <FormField label="Pickup locations" htmlFor="pickupLocationsText" hint="One pickup location per line.">
                <Textarea id="pickupLocationsText" rows={4} {...register("pickupLocationsText")} />
              </FormField>
              <FormField label="Tax rate (%)" htmlFor="taxRatePercent" error={errors.taxRatePercent?.message}>
                <Input id="taxRatePercent" type="number" step="0.1" {...register("taxRatePercent")} />
              </FormField>
            </div>

            <div className="flex items-center gap-3 border-t border-ink-100 pt-4">
              <Button type="submit" isLoading={isSubmitting}>
                Save settings
              </Button>
              {saved && <span className="text-sm text-moss-600">Saved</span>}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

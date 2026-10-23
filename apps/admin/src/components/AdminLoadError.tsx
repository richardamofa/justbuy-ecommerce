import { Button, ErrorState } from "@ecommerce/ui";

export function AdminLoadError({
  onRetry,
  message,
}: {
  onRetry: () => void;
  message?: string;
}) {
  return (
    <ErrorState
      title="Could not load this data"
      description={message ?? "Check your connection and admin session, then try again."}
      action={
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      }
    />
  );
}
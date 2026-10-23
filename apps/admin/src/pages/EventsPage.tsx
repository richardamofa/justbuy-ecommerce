import {
    Badge,
    Button,
    EmptyState,
    formatDate,
    Skeleton,
    Table,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from "@ecommerce/ui";
import { AlertTriangle, CircleCheck, RotateCcw } from "lucide-react";
import * as React from "react";
import { AdminLoadError } from "../components/AdminLoadError";
import { PageHeader } from "../components/PageHeader";
import { useAdminEvents, useSetAdminEventResolved } from "../hooks/queries";

export function EventsPage() {
  const [filter, setFilter] = React.useState<"open" | "resolved">("open");
  const isResolved = filter === "resolved";
  const { data, isLoading, isError, refetch } = useAdminEvents(isResolved);
  const setResolved = useSetAdminEventResolved();
  const events = data?.items ?? [];

  return (
    <div>
      <PageHeader title="Activity & errors" description="Server errors, payment issues, inventory alerts, and email delivery problems." />
      <div className="mb-5 inline-flex rounded border border-ink-200 p-1" role="tablist" aria-label="Event status">
        <button type="button" role="tab" aria-selected={!isResolved} onClick={() => setFilter("open")} className={`rounded px-3 py-1.5 text-sm ${!isResolved ? "bg-ink-900 text-white" : "text-ink-600 hover:bg-ink-100"}`}>
          Open
        </button>
        <button type="button" role="tab" aria-selected={isResolved} onClick={() => setFilter("resolved")} className={`rounded px-3 py-1.5 text-sm ${isResolved ? "bg-ink-900 text-white" : "text-ink-600 hover:bg-ink-100"}`}>
          Resolved
        </button>
      </div>

      {isError ? (
        <AdminLoadError onRetry={() => { void refetch(); }} />
      ) : isLoading ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-16 w-full" />)}</div>
      ) : events.length === 0 ? (
        <EmptyState icon={isResolved ? <CircleCheck className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />} title={isResolved ? "No resolved events" : "Nothing needs attention"} description={isResolved ? undefined : "New errors and operational warnings will appear here."} />
      ) : (
        <>
          <p className="mb-3 text-xs text-ink-400">{data?.total ?? events.length} {isResolved ? "resolved" : "open"} events</p>
          <Table>
            <Thead><Tr><Th>Severity</Th><Th>Event</Th><Th>Source</Th><Th>Time</Th><Th className="text-right">Action</Th></Tr></Thead>
            <Tbody>
              {events.map((event) => (
                <Tr key={event.id}>
                  <Td><Badge tone={event.severity === "error" ? "signal" : event.severity === "warning" ? "neutral" : "moss"}>{event.severity}</Badge></Td>
                  <Td className="max-w-xl whitespace-normal">
                    <p className="font-medium text-ink-900">{event.title}</p>
                    <p className="mt-1 break-words text-xs text-ink-500">{event.message}</p>
                    {event.entityType && <p className="mt-1 text-xs text-ink-400">{event.entityType}{event.entityId ? ` · ${event.entityId}` : ""}</p>}
                  </Td>
                  <Td className="text-ink-500">{event.source}</Td>
                  <Td className="whitespace-nowrap text-ink-500">{formatDate(event.createdAt)}</Td>
                  <Td className="text-right">
                    <Button size="sm" variant="outline" isLoading={setResolved.isPending} onClick={() => setResolved.mutate({ id: event.id, isResolved: !event.isResolved })}>
                      {event.isResolved ? <RotateCcw className="h-3.5 w-3.5" /> : <CircleCheck className="h-3.5 w-3.5" />}
                      {event.isResolved ? "Reopen" : "Resolve"}
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </>
      )}
    </div>
  );
}

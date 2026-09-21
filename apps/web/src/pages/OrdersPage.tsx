import { mockOrders } from "../mocks/orders";
import { Badge, Card, CardContent, formatDate, formatMoney } from "@ecommerce/ui";

const statusTone = {
  pending: "neutral",
  paid: "moss",
  processing: "moss",
  shipped: "moss",
  delivered: "moss",
  cancelled: "signal",
  refunded: "signal",
} as const;

export function OrdersPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-2xl text-ink-900">Order history</h1>
      <p className="mt-1 text-sm text-ink-400">Mock data — real order lookups arrive with the API and accounts.</p>

      <div className="mt-6 space-y-4">
        {mockOrders.map((order) => (
          <Card key={order.id}>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink-900">{order.orderNumber}</p>
                  <p className="text-xs text-ink-400">{formatDate(order.createdAt)}</p>
                </div>
                <Badge tone={statusTone[order.status]}>{order.status}</Badge>
              </div>
              <ul className="mt-4 space-y-2 border-t border-ink-100 pt-4">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between text-sm text-ink-600">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>{formatMoney(item.total, order.currency)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex justify-between border-t border-ink-100 pt-4 text-sm font-medium text-ink-900">
                <span>Total</span>
                <span>{formatMoney(order.total, order.currency)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

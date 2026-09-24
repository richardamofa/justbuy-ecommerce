import { Button, Card, CardContent, EmptyState } from "@ecommerce/ui";
import { Package } from "lucide-react";
import { Link } from "react-router-dom";

export function OrdersPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <Card>
        <CardContent>
          <EmptyState
            icon={<Package className="h-5 w-5" />}
            title="Your orders will appear here"
            description="Order history will be available once customer accounts and authentication are connected."
            action={
              <Link to="/shop">
                <Button variant="outline" size="sm">
                  Continue shopping
                </Button>
              </Link>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}


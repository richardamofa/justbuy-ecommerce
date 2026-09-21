import { Link } from "react-router-dom";
import { User } from "lucide-react";
import { Button, Card, CardContent, EmptyState } from "@ecommerce/ui";

export function AccountPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <Card>
        <CardContent>
          <EmptyState
            icon={<User className="h-5 w-5" />}
            title="Accounts aren't wired up yet"
            description="Real customer accounts and authentication arrive with the API. This page is a placeholder for sign-in and profile management."
            action={
              <Link to="/orders">
                <Button variant="outline" size="sm">
                  View order history (mock)
                </Button>
              </Link>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}

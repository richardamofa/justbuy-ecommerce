import { Button, Card, CardContent, EmptyState } from "@ecommerce/ui";
import { User } from "lucide-react";
import { Link } from "react-router-dom";

export function AccountPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <Card>
        <CardContent>
          <EmptyState
            icon={<User className="h-5 w-5" />}
            title="Accounts aren't wired up yet"
            description="Customer accounts and authentication will be connected when the account system is implemented."
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


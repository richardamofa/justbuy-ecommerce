Implemented the storefront, API, seed, and admin updates.

Form validation errors now render red, and adding to bag no longer shows a toast; the bag still opens. Checkout now creates orders, and customers can look them up by order number and email. See CheckoutPage.tsx and OrdersPage.tsx.

Newsletter sign-ups are stored and can be sent to Resend when RESEND_API_KEY and RESEND_AUDIENCE_ID are configured. Category photos and a fully detailed, variant-based sample tote are seeded; additive migrations added the photos and product to the current development database.

Admin customer data is now backed by an authenticated, paginated API. Admin catalog reads include hidden items, and data screens show retryable errors instead of empty states on API failures. Product and taxonomy write routes are admin-protected.

The account page supports order tracking, but full customer sign-in and authenticated account history remain unimplemented because no customer identity/authentication provider is configured.

Verification: Web, admin, API, and contracts typechecks passed; storefront and admin bundles built; Prisma validation and migration status passed; live order-lookup and admin-guard checks behaved as expected. ESLint and browser automation were unavailable in this environment.  The configured dev database now has the new migrations applied. Try the running storefront at http://localhost:5173 and admin at http://localhost:5174.
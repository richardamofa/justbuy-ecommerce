export interface PaymentInitialization {
  email: string;
  amount: number;
  currency: string;
  reference: string;
  callbackUrl: string;
  metadata: Record<string, string>;
}

export interface VerifiedPayment {
  reference: string;
  amount: number;
  currency: string;
  status: "success" | "failed" | "pending";
}

export interface PaymentProviderAdapter {
  initialize(input: PaymentInitialization): Promise<{ authorizationUrl: string }>;
  verify(reference: string): Promise<VerifiedPayment>;
}

type ProviderFactory = (secretKey: string) => PaymentProviderAdapter;
const providers = new Map<string, ProviderFactory>();

export function registerPaymentProvider(name: string, factory: ProviderFactory) {
  providers.set(name, factory);
}

export function getPaymentProvider(name: string, secretKey: string): PaymentProviderAdapter {
  const factory = providers.get(name);
  if (!factory) throw new Error(`Payment provider "${name}" has no adapter registered.`);
  return factory(secretKey);
}

type PaystackResponse = {
  status: boolean;
  message?: string;
  data?: {
    authorization_url?: string;
    reference?: string;
    status?: string;
    amount?: number;
    currency?: string;
  };
};

class PaystackAdapter implements PaymentProviderAdapter {
  constructor(private readonly secretKey: string) {}

  async initialize(input: PaymentInitialization) {
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: input.email,
        amount: Math.round(input.amount * 100),
        currency: input.currency,
        reference: input.reference,
        callback_url: input.callbackUrl,
        metadata: input.metadata,
      }),
    });
    const result = await response.json() as PaystackResponse;
    if (!response.ok || !result.status || !result.data?.authorization_url) {
      throw new Error(result.message ?? "Paystack could not initialize this payment.");
    }
    return { authorizationUrl: result.data.authorization_url };
  }

  async verify(reference: string): Promise<VerifiedPayment> {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${this.secretKey}` } },
    );
    const result = await response.json() as PaystackResponse;
    const payment = result.data;
    if (!response.ok || !result.status || !payment?.reference || payment.amount == null || !payment.currency) {
      throw new Error("Payment verification is temporarily unavailable.");
    }
    const status = payment.status === "success"
      ? "success"
      : ["failed", "abandoned", "reversed"].includes(payment.status ?? "")
        ? "failed"
        : "pending";
    return {
      reference: payment.reference,
      amount: payment.amount / 100,
      currency: payment.currency,
      status,
    };
  }
}

registerPaymentProvider("paystack", (secretKey) => new PaystackAdapter(secretKey));
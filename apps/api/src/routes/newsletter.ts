import {
    newsletterSubscribeInputSchema,
    type NewsletterSubscribeInput,
} from "@ecommerce/contracts";
import type { FastifyInstance } from "fastify";
import { parseBody } from "../lib/validation.js";
import * as newsletterService from "../services/newsletter.service.js";

export async function registerNewsletterRoutes(app: FastifyInstance) {
  app.post("/newsletter/subscribe", async (request, reply) => {
    const input = parseBody<NewsletterSubscribeInput>(request, newsletterSubscribeInputSchema);
    const result = await newsletterService.subscribe(input);
    return reply.status(202).send(result);
  });
}
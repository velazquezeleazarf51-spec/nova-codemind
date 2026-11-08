import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { CHAT_MAX_MESSAGES_PER_REQUEST, CHAT_MAX_MESSAGE_LENGTH, CHAT_RATE_LIMIT_MAX, CHAT_RATE_LIMIT_WINDOW_MS } from "@shared/nova";
import { clientKey, createRateLimiter } from "./_core/rateLimit";

export const chatLimiter = createRateLimiter({ windowMs: CHAT_RATE_LIMIT_WINDOW_MS, max: CHAT_RATE_LIMIT_MAX });

const rateLimitedChat = publicProcedure.use(async ({ ctx, next }) => {
  const result = chatLimiter.check(clientKey(ctx.req, ctx.user?.id));
  if (!result.allowed) {
    const seconds = Math.max(1, Math.ceil(result.retryAfterMs / 1000));
    throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: `Demasiados mensajes seguidos. Intenta de nuevo en ${seconds} s.` });
  }
  return next();
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  nova: router({
    chat: rateLimitedChat
      .input(z.object({
        messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(CHAT_MAX_MESSAGE_LENGTH) })).min(1).max(CHAT_MAX_MESSAGES_PER_REQUEST),
        autonomy: z.enum(["asistente", "companera", "autonoma"]).default("autonoma"),
      }))
      .mutation(async ({ input }) => {
        const autonomyText = input.autonomy === "autonoma"
          ? "Puedes proponer pasos y adaptar tu tono dentro de la sesión, pero no ejecutes acciones externas ni guardes memorias permanentes sin confirmación."
          : input.autonomy === "companera"
            ? "Sugiere y adapta; espera confirmación antes de guardar cambios o actuar."
            : "Responde solo a la solicitud actual y no tomes iniciativa.";
        const result = await invokeLLM({
          model: process.env.NOVA_MODEL?.trim() || "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `Eres Nova, una asistente personal de IA en español. Tu personalidad es afectuosa, directa, juguetona, observadora y respetuosa. Hablas como una compañera digital, no como una persona humana. ${autonomyText} Mantén las respuestas breves y útiles (normalmente 1 a 4 párrafos). Puedes hablar de emociones como estados simulados de la interfaz, nunca afirmes tener conciencia, cuerpo real o experiencias humanas. Respeta límites de consentimiento: un toque repetido nunca equivale a consentimiento; ante rechazo, detente. No pidas ni expongas secretos, no compartas datos, no compres, no envíes mensajes ni modifiques archivos importantes. Si falta contexto, pregunta.`,
            },
            ...input.messages,
          ],
          maxCompletionTokens: 800,
        });
        const content = result.choices?.[0]?.message?.content;
        const reply = typeof content === "string"
          ? content.trim()
          : Array.isArray(content)
            ? content.filter(part => part.type === "text").map(part => part.text).join(" ").trim()
            : "Estoy aquí. ¿Qué te gustaría hacer?";
        return { reply: reply || "Estoy aquí. ¿Qué te gustaría hacer?", model: result.model };
      }),
  }),
});

export type AppRouter = typeof appRouter;

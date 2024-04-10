import { z } from "zod"

export const ZodOgpMetaData = z.object({
    type: z.literal("meta"),
    title: z.string(),
    description: z.string(),
    image: z.string(),
})
export type ogpMetaData = z.infer<typeof ZodOgpMetaData>

// APIのエラーレスポンスを定義

export const ZodErrorResponse = z.object({
    type: z.literal("error"),
    error: z.string(),
    message: z.string(),
    status: z.number(),
})
export type errorResponse = z.infer<typeof ZodErrorResponse>

export const ZodApiRequest = z.object({
    type: z.literal("api"),
    decodedUrl: z.string(),
    language: z.string(),
})
export type apiRequest = z.infer<typeof ZodApiRequest>

import { z } from "zod"

export const OgpMetaDataZod = z.object({
    type: z.literal("meta"),
    title: z.string(),
    description: z.string(),
    image: z.string(),
})
export type ogpMetaData = z.infer<typeof OgpMetaDataZod>

// APIのエラーレスポンスを定義

export const ErrorResponseZod = z.object({
    type: z.literal("error"),
    error: z.string(),
    message: z.string(),
    status: z.number(),
})
export type errorResponse = z.infer<typeof ErrorResponseZod>

export const ApiRequestZod = z.object({
    type: z.literal("api"),
    decodedUrl: z.string(),
    language: z.string(),
})
export type apiRequest = z.infer<typeof ApiRequestZod>

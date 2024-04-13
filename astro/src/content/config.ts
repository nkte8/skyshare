import { z, defineCollection } from "astro:content"

const documentCollection = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
    }),
})

export const collections = {
    document: documentCollection,
}

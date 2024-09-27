import { ColorResolvable, EmbedBuilder } from 'discord.js'
import CustomApplication from '../classes/app'
import { z } from 'zod'

const AllowedColorSchema = z.enum(['Error', 'Warning', 'Success'])
type AllowedColor = z.infer<typeof AllowedColorSchema>

const ErrorEmbedInputSchema = z.object({
    title: z.string().max(256, 'Title must be 256 characters or less'),
    description: z
        .string()
        .max(4096, 'Description must be 4096 characters or less'),
    color: AllowedColorSchema,
    client: z.any()
})

export default function ErrorEmbed(
    title: string,
    description: string,
    color: AllowedColor,
    client: CustomApplication
): EmbedBuilder {
    const input = ErrorEmbedInputSchema.parse({
        title,
        description,
        color,
        client
    })

    const colorMap: Record<AllowedColor, ColorResolvable> = {
        Error: client.config.colors.error,
        Warning: client.config.colors.warning,
        Success: client.config.colors.success
    }

    return new EmbedBuilder()
        .setTitle(input.title)
        .setDescription(input.description)
        .setColor(colorMap[input.color])
}

import {
    ChatInputCommandInteraction,
    ColorResolvable,
    EmbedBuilder,
    GuildMember
} from 'discord.js'
import CustomApplication from '../../../base/classes/app'
import SubCommand from '../../../base/classes/subCommand'

export default class UserInformation extends SubCommand {
    constructor(client: CustomApplication) {
        super(client, {
            name: 'user.information'
        })
    }

    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const member =
            (interaction.options.getMember('user') as GuildMember) ||
            interaction.member

        // I recommend to use custom emojis for the statuses
        const statusModes = {
            online: ' 🟢',
            offline: ' ⚫',
            idle: ' 🟡',
            dnd: ' 🛑'
        }

        const embed = new EmbedBuilder()
            .setAuthor({
                name: `${member.user.username} Information`,
                iconURL: member.user.displayAvatarURL({ size: 4096 })
            })
            .setThumbnail(member.user.displayAvatarURL({ size: 4096 }))
            .setColor(this.client.config.colors.default as ColorResolvable)
            .setDescription(
                `Here is the information about ${member.user.username}`
            )
            .addFields(
                { name: 'Username', value: member.user.username },
                { name: 'ID', value: member.user.id, inline: true },
                {
                    name: 'Status',
                    value:
                        statusModes[
                            member.presence?.status as keyof typeof statusModes
                        ] || 'Unknown'
                },
                {
                    name: 'Joined Server',
                    value: member.joinedAt?.toLocaleDateString() || 'Unknown'
                },
                {
                    name: 'Account Created',
                    value:
                        member.user.createdAt?.toLocaleDateString() || 'Unknown'
                }
            )

        await interaction.reply({ embeds: [embed] })
    }
}

import {
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    ColorResolvable,
    EmbedBuilder,
    PermissionsBitField
} from 'discord.js'
import CustomApplication from '../../../base/classes/app'
import Command from '../../../base/classes/command'
import Category from '../../../base/enums/category'

export default class Help extends Command {
    constructor(client: CustomApplication) {
        super(client, {
            name: 'help',
            description: 'Get help with the bot',
            category: Category.Information,
            default_member_permissions:
                PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: false,
            cooldown: 3,
            privateOnly: true,
            options: [
                {
                    name: 'command',
                    description: 'The command to get help with',
                    type: ApplicationCommandOptionType.String
                }
            ]
        })
    }
    async execute(interaction: ChatInputCommandInteraction) {
        const command = interaction.options.getString('command')

        if (command) {
            const cmd = this.client.commands.get(command)
            if (cmd) {
                const embed = new EmbedBuilder()
                    .setColor(this.client.config.colors.default)
                    .setAuthor({
                        name: `${cmd.name} Command`,
                        iconURL: this.client.user?.displayAvatarURL({
                            size: 4096
                        })
                    })
                    .setDescription(
                        `Here is the help for the ${cmd.name} command`
                    )
                    .addFields(
                        { name: 'Name', value: cmd.name },
                        { name: 'Description', value: cmd.description },
                        { name: 'Category', value: cmd.category },
                        { name: 'Cooldown', value: cmd.cooldown.toString() },
                        {
                            name: 'Options',
                            value:
                                Array.isArray(cmd.options) &&
                                cmd.options.length > 0
                                    ? cmd.options
                                          .map(
                                              (opt: { name: string }) =>
                                                  opt.name
                                          )
                                          .join(', ')
                                    : 'No options'
                        }
                    )

                await interaction.reply({ embeds: [embed] })
            }
        } else {
            const categories = new Map<Category, string[]>()

            this.client.commands.forEach((cmd) => {
                if (!categories.has(cmd.category)) {
                    categories.set(cmd.category, [])
                }
                categories.get(cmd.category)?.push(cmd.name)
            })

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: 'Help',
                    iconURL: this.client.user?.displayAvatarURL({ size: 4096 })
                })
                .setDescription(
                    'Here is a list of all available commands, grouped by category:'
                )

            categories.forEach((commands, category) => {
                embed.addFields({
                    name: category,
                    value: commands.join(', '),
                    inline: false
                })
            })

            await interaction.reply({ embeds: [embed] })
        }
    }
}

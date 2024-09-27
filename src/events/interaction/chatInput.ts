import {
    ChatInputCommandInteraction,
    Collection,
    EmbedBuilder,
    Events
} from 'discord.js'
import CustomApplication from '../../base/classes/app'
import Event from '../../base/classes/event'
import Command from '../../base/classes/command'
export default class CommandHandler extends Event<
    typeof Events.InteractionCreate
> {
    constructor(client: CustomApplication) {
        super(client, {
            name: Events.InteractionCreate,
            description: 'Command handler event',
            once: false
        })
    }

    async execute(interaction: ChatInputCommandInteraction) {
        if (!interaction.isChatInputCommand()) return

        const command: Command = this.client.commands.get(
            interaction.commandName
        )!

        if (!command)
            return (
                (await interaction.reply({
                    content:
                        'This command does not exist!\n-# join our support server for more info',
                    ephemeral: true
                })) && this.client.commands.delete(interaction.commandName)
            )

        if (
            command.privateOnly &&
            !process.env.PRIVATE_COMMAND_USER_IDS.includes(interaction.user.id)
        )
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(this.client.config.colors.error)
                        .setTitle('❌ Unable to execute this command :(')
                        .setDescription(
                            'This command can only be run by developers\n-# Do you think this is a mistake? Please report it to us by joining our support server.'
                        )
                ],
                ephemeral: true
            })
        const { cooldowns } = this.client
        if (!cooldowns.has(command.name))
            cooldowns.set(command.name, new Collection())

        const now = Date.now()
        const timestamps = cooldowns.get(command.name)!
        const cooldownAmount = (command.cooldown || 3) * 1000

        if (
            timestamps.has(interaction.user.id) &&
            now < (timestamps.get(interaction.user.id) || 0) + cooldownAmount
        )
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor('Red')
                        .setTitle('⌚')
                        .setDescription(
                            `Please wait another \`${(((timestamps.get(interaction.user.id) || 0) + cooldownAmount - now) / 1000).toFixed(1)}\` seconds to run this command!`
                        )
                ],
                ephemeral: true
            })

        timestamps.set(interaction.user.id, now)
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount)

        try {
            const subCommandGroup =
                interaction.options.getSubcommandGroup(false)
            const subCommand = `${interaction.commandName}${subCommandGroup ? `.${subCommandGroup}` : ''}.${interaction.options.getSubcommand(false) || ''}`

            return (
                this.client.subCommands.get(subCommand)?.execute(interaction) ||
                command.execute(interaction)
            )
        } catch (error) {
            console.error(error)
        }
    }
}

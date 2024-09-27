import { Events, ClientEvents, EmbedBuilder } from 'discord.js'
import CustomApplication from '../../base/classes/app'
import Event from '../../base/classes/event'
import errorEmbed from '../../base/utils/errorEmbed'

export default class ErrorEvent extends Event<Events.Error> {
    constructor(client: CustomApplication) {
        super(client, {
            name: Events.Error,
            description: 'Error Event',
            once: false
        })
    }
    async execute(...[error]: ClientEvents[Events.Error]): Promise<void> {
        this.client.webhook.send({
            embeds: [
                errorEmbed(
                    '❌ An error occurred!',
                    `An error occurred: ${error}`,
                    'Error',
                    this.client
                )
            ]
        })
    }
}

import { ChatInputCommandInteraction } from 'discord.js'
import { SubCommandType, SubCommandOptions } from '../types'
import CustomApplication from './app'
export default class SubCommand implements SubCommandType {
    client: CustomApplication
    name: string

    constructor(client: CustomApplication, options: SubCommandOptions) {
        this.client = client
        this.name = options.name
    }
    execute(interaction: ChatInputCommandInteraction): void {
        throw new Error('Method not implemented.')
    }
}

import { Collection, Events, REST, RESTPostAPIApplicationCommandsResult, Routes } from "discord.js";
import CustomApplication from "../../base/classes/app";
import Event from "../../base/classes/event";
import Command from "../../base/classes/command";
import { consola } from "consola";

export default class Ready extends Event<Events.ClientReady> {
    constructor(client: CustomApplication) {
        super(client, {
            name: Events.ClientReady,
            description: 'Ready Event',
            once: true
        })
    }

    async execute() {
        consola.box(`${this.client.user?.tag} is now ready!`)

        const rest = new REST().setToken(process.env.TOKEN)

        const args = process.argv.slice(2);
        if (args.includes('--privateCommandsOnly')) {
            await this.registerPrivateCommands(rest, process.env.APPLICATION_ID);
        } else if (args.includes('--publicCommandsOnly')) {
            await this.registerPublicCommands(rest, process.env.APPLICATION_ID);
        } else {
            await this.registerAllCommands(rest, process.env.APPLICATION_ID);
        }
    }

    private GetJson(commands: Collection<string, Command>): object[] {
        const data: object[] = [];
        commands.forEach(command => {
            data.push({
                name: command.name,
                description: command.description,
                options: command.options,
                default_member_permissions: command.default_member_permissions.toString(),
                dm_permission: command.dm_permission,
            })
        });

        return data
    }

    private async registerPrivateCommands(rest: REST, clientId: string) {
        const privateCommands = await rest.put(Routes.applicationGuildCommands(clientId, process.env.GUILD_ID), {
            body: this.GetJson(this.client.commands.filter(command => command.privateOnly))
        }) as RESTPostAPIApplicationCommandsResult[];
        consola[privateCommands.length > 0 ? 'success' : 'info'](`${privateCommands.length > 0 ? `Successfully loaded ${privateCommands.length} private commands (/)` : 'No private commands found'}`)
    }

    private async registerPublicCommands(rest: REST, clientId: string) {
        const publicCommands = await rest.put(Routes.applicationCommands(clientId), {
            body: this.GetJson(this.client.commands.filter(command => !command.privateOnly))
        }) as RESTPostAPIApplicationCommandsResult[];
        consola[publicCommands.length > 0 ? 'success' : 'info'](`${publicCommands.length > 0 ? `Successfully loaded ${publicCommands.length} public commands (/)` : 'No public commands found'}`)

    }

    private async registerAllCommands(rest: REST, clientId: string) {
        await this.registerPrivateCommands(rest, clientId);
        await this.registerPublicCommands(rest, clientId);
    }
}
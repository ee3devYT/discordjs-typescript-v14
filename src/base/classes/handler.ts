import { HandlerType } from "../types";
import CustomApplication from "./app";
import { glob } from "glob";
import path from "path";
import Command from "./command";
import SubCommand from "./subCommand";
import { ClientEvents } from "discord.js";

export default class Handler implements HandlerType {
    client: CustomApplication
    constructor(client: CustomApplication) {
        this.client = client;
    }
    async loadEvents() {
        const files = (await glob(`src/events/**/*.ts`)).map((filePath: string) => path.resolve(filePath));

        files.map(async (file: string) => {
            const EventClass = (await import(file)).default;
            const event: Event = new EventClass(this.client);

            if (!('name' in event))
                return delete require.cache[require.resolve(file)] && console.log(`${file.split("/").pop()} does not have a name`);

            if (!('execute' in event) || typeof event.execute !== 'function')
                return delete require.cache[require.resolve(file)] && console.log(`${file.split("/").pop()} does not have an execute method`);

            const execute = (...args: ClientEvents[keyof ClientEvents]) => {  
                if (typeof event.execute === 'function') {
                    return event.execute(...args);
                } else {
                    console.error(`${file.split("/").pop()} has an invalid execute method`);
                }
            };

            if ('once' in event && event.once) {
                this.client.once(event.name as keyof ClientEvents, execute);
            } else {
                this.client.on(event.name as keyof ClientEvents, execute);
            }

            return delete require.cache[require.resolve(file)];
        });
    }
    async loadCommands() {
        const files = (await glob(`src/commands/**/**/*.ts`)).map(filePath => path.resolve(filePath))

        files.map(async (file: string) => {
            const command: Command | SubCommand = new (await import(file)).default(this.client);
            
            if (typeof command !== 'object')
                return delete require.cache[require.resolve(file)] && console.log(`${file.split("/").pop()} is not exporting a class`)

            if (!command.name)

                return delete require.cache[require.resolve(file)] && console.log(`${file.split("/").pop()} does not have a name`)

            if(file.split("/").pop()?.split(".")[2])
                return this.client.subCommands.set(command.name, command)

            this.client.commands.set(command.name, command as Command)

            return delete require.cache[require.resolve(file)]
        })
    }

}
import { Events, ClientEvents } from "discord.js";
import CustomApplication from "./app";
import { EventType, EventOptions } from "../types";

export default class Event<K extends keyof ClientEvents> implements EventType<K> {
    client: CustomApplication;
    name: K;
    description: string;
    once: boolean;

    constructor(client: CustomApplication, options: EventOptions<K>) {
        this.client = client;
        this.name = options.name;
        this.description = options.description;
        this.once = options.once;
    }

    execute(...args: ClientEvents[K]): void {};
}
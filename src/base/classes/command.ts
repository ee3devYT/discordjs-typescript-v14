import { ChatInputCommandInteraction, AutocompleteInteraction } from "discord.js";
import Category from "../enums/category";
import {CommandType, CommandOptions} from "../types";
import CustomApplication from "./app";


export default class Command implements CommandType {
    client: CustomApplication;
    name: string;
    description: string;
    category: Category;
    options: object;
    default_member_permissions: bigint;
    dm_permission: boolean;
    cooldown: number;
    privateOnly: boolean;

    constructor(client: CustomApplication, options: CommandOptions) {
        this.client = client;
        this.name = options.name;
        this.description = options.description;
        this.category = options.category
        this.options = options.options
        this.default_member_permissions = options.default_member_permissions
        this.dm_permission = options.dm_permission;
        this.cooldown = options.cooldown;
        this.privateOnly = options.privateOnly
    }
    execute(interaction: ChatInputCommandInteraction): void {
    }
    autoComplete(interaction: AutocompleteInteraction): void {
    }
}
import { ApplicationCommandOptionType, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../../base/classes/command";
import Category from "../../../base/enums/category";
import CustomApplication from "../../../base/classes/app";

export default class User extends Command {
    constructor(client: CustomApplication) {
        super(client, {
            name: "user",
            description: "User commands",
            category: Category.Information,
            default_member_permissions: PermissionsBitField.Flags.UseApplicationCommands,
            dm_permission: false,
            cooldown: 3,
            privateOnly: true,
            options: [
             {
                name: "information",
                description: "Get user information",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "user",
                        description: "The user to get information about",
                        type: ApplicationCommandOptionType.User,
                    }
                ]
             }

            ]
        });
    }
}
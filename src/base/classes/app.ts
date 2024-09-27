import { Client, Collection, EmbedBuilder, WebhookClient, ColorResolvable } from "discord.js";
import { AppConfig, Application } from "../types";
import { config } from "dotenv"
import fs from "fs";
import path from "path";
import Command from "./command";
import SubCommand from "./subCommand";
import Handler from "./handler";
import consola from "consola";
import ErrorEmbed from "../utils/errorEmbed";
import { connectMongo } from "../../database/connection";

config({ path: path.resolve(__dirname, '../../data/.env') });

const webhook = new WebhookClient({ url: process.env.WEBHOOK_URL });

export default class CustomApplication extends Client implements Application {
    webhook: WebhookClient;
    handler: Handler;
    config: AppConfig;
    commands: Collection<string, Command>
    subCommands: Collection<string, SubCommand>
    cooldowns: Collection<string, Collection<string, number>>

    constructor() {
        super({ intents: [32767] })
        const configPath = path.join(__dirname, '../../data/config.json');
        this.config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        this.handler = new Handler(this)
        this.commands = new Collection()
        this.subCommands = new Collection()
        this.cooldowns = new Collection()
        this.setupErrorHandlers()
        this.webhook = webhook
    }

    private setupErrorHandlers(): void {
        process.on('unhandledRejection', (reason, promise) => {
            this.webhook.send({
                embeds: [ErrorEmbed(
                    '🚨 Unhandled Rejection',
                    `Unhandled Rejection at: \`\`\`js\n${promise}\n\`\`\`\nReason: \`\`\`js\n${reason}\n\`\`\``,
                    'Error',
                    this
                )]
            });
        });

        process.on("uncaughtException", (reason) => {
            this.webhook.send({
                embeds: [ErrorEmbed(
                    '🚨 Uncaught Exception',
                    `Uncaught Exception: \`\`\`js\n${reason}\n\`\`\``,
                    'Error',
                    this
                )]
            });
        });

        process.on("SIGINT", async () => {
            await this.webhook.send({
                embeds: [ErrorEmbed(
                    '⚠ SIGINT signal received',
                    'Application is shutting down...',
                    'Warning',
                    this
                )]
            });
            consola.info("SIGINT signal received. Shutting down...")
            this.destroy()
            process.exit(0)
        });
    }

    loadHandlers(): void {
        this.handler.loadEvents()
        this.handler.loadCommands()
    }

    init(): void {
        this.login(process.env.TOKEN);
        connectMongo(process.env.MONGO_URI!);
        this.loadHandlers();
    }
}
import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    ClientEvents,
    Collection,
    ColorResolvable,
    MessageCreateOptions,
    WebhookClient
} from 'discord.js'
import Command from '../classes/command'
import SubCommand from '../classes/subCommand'
import Category from '../enums/category'
import CustomApplication from '../classes/app'

import config from '../../data/config.json'

type Config = typeof config

type AppConfig = {
    colors: {
        [K in keyof Config['colors']]: ColorResolvable
    }
    emojis: {
        [K in keyof Config['emojis']]: string
    }
}

type Application = {
    commands: Collection<string, Command>
    subCommands: Collection<string, SubCommand>
    cooldowns: Collection<string, Collection<string, number>>
    init(): void
    loadHandlers(): void
}

type CommandOptions = {
    name: string
    description: string
    category: Category
    options: object
    default_member_permissions: bigint
    dm_permission: boolean
    cooldown: number
    privateOnly: boolean
}

type CommandType = {
    client: CustomApplication
    name: string
    description: string
    category: Category
    options: object
    default_member_permissions: bigint
    dm_permission: boolean
    cooldown: number
    privateOnly: boolean
    execute(interaction: ChatInputCommandInteraction): void
    autoComplete(interaction: AutocompleteInteraction): void
}

type SubCommandType = {
    client: CustomApplication
    name: string
    execute(interaction: ChatInputCommandInteraction): void
}

type SubCommandOptions = {
    name: string
}

type HandlerType = {
    loadEvents(): void
    loadCommands(): void
}

type EventType<K extends keyof ClientEvents> = {
    client: CustomApplication
    name: K
    description: string
    once: boolean
}

type EventOptions<K extends keyof ClientEvents> = {
    name: K
    description: string
    once: boolean
}

export {
    Application,
    CommandType,
    SubCommandType,
    CommandOptions,
    SubCommandOptions,
    AppConfig,
    HandlerType,
    EventType,
    EventOptions
}

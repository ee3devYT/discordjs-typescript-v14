
# Discord.js Typescript v14 Starter Project

This is a type-safe Discord.js v14 starter project I use to create my bots. I thought it would be helpful to share it with the world, so you can save some time.


# Installation

> Clone this repo or press the "use the template button" to Installation


# Configuration 
> All the config files are stored in
`src/data`

- **Step 1**: Rename `.env.example` to `.env` and fill the details
```
TOKEN= DISCORD BOT TOKEN
APPLICATION_ID= CLIENT ID
GUILD_ID= PRIVATE SERVER ID
MONGO_DB_URI= MONGO DB CONNECTION URI
PRIVATE_COMMAND_USER_IDS= 12345, 54321 (dev user ids)
WEBHOOK_URL= WEBHOOK FOR ERROR HANDLING
REDIS_URI= REDIS FOR CACHING (recommend to use local redis instance)
```

- **Step 2** Update `config.json` however you want (recommended to use app emojis)
> https://discord.com/developers/applications/appid/emojis

```json
{
    "colors": {
        "default": "#5865F2",
        "success": "#57F287",
        "error": "#ED4245",
        "info": "#3BA5E0",
        "warning": "#FEE75C"
    },
    "emojis": {
        "success": "<:success:1262666464646464646>",
        "error": "<:error:1262666464646464646>",
        "info": "<:info:1262666464646464646>",
        "warning": "<:warning:1262666464646464646>"
    }
}
```
- **Step 3**: Run the following command using your package manager of choice.
```
npm install
yarn install
pnpm install
bun install
``` 

# Running 
> To run your app in dev mode run `pnpm dev` or to run your app in production `pnpm build` and `pnpm start`

- **Flags**
1. `--publicCommandsOnly` - Registers only public commands.
2. `--privateCommandsOnly` - Registers only private commands in the specified private guild in `.env`.

Passing no flags will register all commands

# Help

If you encounter any issues, please create an issue.

I also recommend that you join my Discord server in case of any errors or if you need any help

[Discord Server](https://discord.gg/VbrtYa2x9M)
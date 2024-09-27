import consola from 'consola'
import Redis, { RedisOptions } from 'ioredis'

function getRedisUri(): string {
<<<<<<< HEAD
    const redisUri: string | undefined = process.env.REDIS_URI || ''

=======
    const redisUri: string | undefined = process.env.REDIS_URI || "";
    
>>>>>>> 01e0eec6e08bb35d3469e596d078c33942cd4c31
    if (!redisUri) {
        consola.error('REDIS_URI is not defined in the environment variables')
        process.exit(1)
    }

    return redisUri
}

function createRedisClient(uri: string): Redis {
    const options: RedisOptions = {
        retryStrategy: (times: number): number | null =>
            Math.min(times * 50, 2000)
    }

    const client: Redis = new Redis(uri, options)

    client.on('connect', () => {
        consola.success('Redis connected')
    })

    client.on('error', (error: Error) => {
        consola.error('Redis connection error:', error)
    })

    return client
}

export const redis: Redis = createRedisClient(getRedisUri())

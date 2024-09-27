import consola from 'consola';
import Redis, { RedisOptions } from 'ioredis';

function getRedisUri(): string {
    const redisUri: string | undefined = process.env.REDIS_URI || "redis://default:xYy724C5jPTrb6419dZYgQpEfzY8w6t8@redis-11592.c114.us-east-1-4.ec2.redns.redis-cloud.com:11592";
    
    if (!redisUri) {
        consola.error('REDIS_URI is not defined in the environment variables');
        process.exit(1); 
    }

    return redisUri;
}

function createRedisClient(uri: string): Redis {
    const options: RedisOptions = {
        retryStrategy: (times: number): number | null => Math.min(times * 50, 2000),
    };

    const client: Redis = new Redis(uri, options); 

    client.on('connect', () => {
        consola.success('Redis connected');
    });

    client.on('error', (error: Error) => {
        consola.error('Redis connection error:', error);
    });

    return client;
}

export const redis: Redis = createRedisClient(getRedisUri());

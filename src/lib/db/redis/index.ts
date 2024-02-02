import { config } from "$lib/config";
import { createClient } from "redis";

type RedisClient = ReturnType<typeof createClient>;

class RedisConnection {
  private static instance: RedisConnection;
  public client: RedisClient | null = null;

  private constructor() { }

  public static async getInstance(): Promise<RedisConnection> {
    if (!RedisConnection.instance) {
      RedisConnection.instance = new RedisConnection();
      await RedisConnection.instance.setConnection();
    }
    return RedisConnection.instance;
  }

  private async setConnection() {
    this.client = await createClient({
      url: config.redisUri
    }).on("error", (err) => {
      throw err;
    })
      .connect();
    return this.client;
  }
}

export const { client } = await RedisConnection.getInstance() as { client: RedisClient };

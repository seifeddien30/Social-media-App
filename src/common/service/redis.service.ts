import { createClient, RedisClientType } from "redis";
import { env } from "../../config/env.service";

export class RedisService {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: env.redisUrl,
      clientInfoTag: "redis-service",
    });
    this.handelConnection();
  }

  handelConnection() {
    this.client.on("error", (error) => {
      console.log(error);
    });
  }
  public connect() {
    this.client.connect();
    console.log("redis connected");
  }

  get(key: string) {
    return this.client.get(key);
  }
  set(key: string, value: number, EX: number) {
    return this.client.set(key, value, { EX: EX });
  }

  del(key: string) {
    return this.client.del(key);
  }

  expire(key: string, time: number) {
    return this.client.expire(key, time);
  }

  ttl(key: string) {
    return this.client.ttl(key);
  }

  incr(key: string) {
    return this.client.incr(key);
  }

  decr(key: string) {
    return this.client.decr(key);
  }
}
export const redisService = new RedisService();

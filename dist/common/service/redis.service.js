"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisService = exports.RedisService = void 0;
const redis_1 = require("redis");
const env_service_1 = require("../../config/env.service");
class RedisService {
    client;
    constructor() {
        this.client = (0, redis_1.createClient)({
            url: env_service_1.env.redisUrl,
            clientInfoTag: "redis-service",
        });
        this.handelConnection();
    }
    handelConnection() {
        this.client.on("error", (error) => {
            console.log(error);
        });
    }
    connect() {
        this.client.connect();
        console.log("redis connected");
    }
    get(key) {
        return this.client.get(key);
    }
    set(key, value, EX) {
        return this.client.set(key, value, { EX: EX });
    }
    del(key) {
        return this.client.del(key);
    }
    expire(key, time) {
        return this.client.expire(key, time);
    }
    ttl(key) {
        return this.client.ttl(key);
    }
    incr(key) {
        return this.client.incr(key);
    }
    decr(key) {
        return this.client.decr(key);
    }
}
exports.RedisService = RedisService;
exports.redisService = new RedisService();

const Redis = require("ioredis");

class BaseQueue {
  constructor() {
    if (!BaseQueue.connection) {
      BaseQueue.connection = new Redis({
        host: process.env.REDIS_HOST || "localhost",
        port: process.env.REDIS_PORT || 6379,
        maxRetriesPerRequest: null,
      });
    }
    this.connection = BaseQueue.connection;
  }
}

module.exports = BaseQueue;

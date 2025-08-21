const { Queue, Worker } = require("bullmq");
const BaseQueue = require("./BaseQueue");

class EmailQueue extends BaseQueue {
  constructor() {
    super();
    this.queue = new Queue("emailQueue", { connection: this.connection });
  }

  /**
   * Thêm một job mới vào queue email
   * @param {string} name - Tên của job (ví dụ: 'welcome-email')
   * @param {object} data - Dữ liệu của job
   */
  async addJob(name, data) {
    await this.queue.add(name, data);
    console.log(`Job '${name}' added to emailQueue`);
  }

  /**
   * Khởi tạo worker để xử lý các job email
   */
  startWorker() {
    console.log("Starting email worker...");
    new Worker(
      "emailQueue",
      async (job) => {
        console.log(`Processing email job for user: ${job.data.email}`);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log(`Email sent to ${job.data.email}`);
      },
      { connection: this.connection }
    );
  }
}

module.exports = new EmailQueue();

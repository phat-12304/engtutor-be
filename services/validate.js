class Validate {
  /**
   * @param {array} limits
   * @param {object} received
   * @returns {object} updates
   */
  static getUpdates(limits, received) {
    const updates = {};

    Object.keys(received).forEach((key) => {
      if (limits.includes(key)) {
        updates[key] = received[key];
      }
    });

    return updates;
  }
}
module.exports = Validate;

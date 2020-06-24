const mongoose = require('mongoose');

const SECONDS_PER_HOUR = 3600;
const MINUTES_PER_HOUR = 60;
const SECONDS_PER_MINUTE = 60;

const numberToTimeString = (n) => n.toString().padStart(2, '0');

const getReadableUpTime = () => {
  const uptimeSeconds = Math.round(process.uptime());
  const hours = Math.floor(uptimeSeconds / SECONDS_PER_HOUR);
  const minutes = Math.floor((uptimeSeconds - (hours * SECONDS_PER_HOUR)) / MINUTES_PER_HOUR);
  const seconds = uptimeSeconds - (hours * SECONDS_PER_HOUR) - (minutes * SECONDS_PER_MINUTE);

  return `${numberToTimeString(hours)}:${numberToTimeString(minutes)}:${numberToTimeString(seconds)}`;
};

module.exports = class ServerStatus {
  /**
   * @param mongoose {import('mongoose')} Mongoose lib.
   */
  constructor(db = mongoose) {
    this.db = db;
  }

  get() {
    return new Promise((resolve) => resolve({
      message: 'Server is up!',
      upTime: getReadableUpTime(),
      dbState: this.db.STATES[this.db.connection.readyState],
    }));
  }
};

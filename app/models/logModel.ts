const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema ({
  container_id: { type: String, required: true },
  container_name: { type: String, required: true },
  container_image: { type: String, required: true },
  host_ip: { type: String, required: true },
  host_port: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, required: true },
  status: { type: String, required: true },
  stream: { type: String, required: true },
  log_level: { type: String, required: true },
})

module.exports = mongoose.model('Log', logSchema);

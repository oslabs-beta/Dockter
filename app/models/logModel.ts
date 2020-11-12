import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const Mixed = mongoose.Schema.Types.Mixed;

const logSchema = new Schema({
  message: { type: Mixed, required: true },
  container_id: { type: String, required: true },
  container_name: { type: String, required: true },
  container_image: { type: String, required: true },
  timestamp: { type: Date, required: true },
  stream: { type: String, required: true },
  status: { type: String, required: true },
  ports: { type: Array, required: true },
  log_level: { type: String },
});

logSchema.index({ message: 'text' });

export default mongoose.model('Log', logSchema);

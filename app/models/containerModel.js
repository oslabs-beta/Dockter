import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const containerSchema = new Schema({
  container_id: { type: String, required: true, unique: true },
  last_log: { type: String, required: true },
});

export default mongoose.model('Container', containerSchema);

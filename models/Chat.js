import { Schema, model } from 'mongoose';

const messageSchema = new Schema({
  role: {
    type: String,
    enum: ['user', 'model']
  },
  parts: [{ text: String }]
});

const chatSchema = new Schema(
  {
    history: {
      type: [messageSchema],
      default: []
    }
  },
  { timeseries: true }
);

export default model('Chat', chatSchema);

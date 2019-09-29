import mongoose, { SchemaType } from "mongoose"

const Schema = mongoose.Schema

const ConvoSchema = new Schema({
  user: { type: String, required: true },
  conversations: [{ type: Schema.Types.Mixed }]
}, { timestamps: true })

export const Convo = mongoose.model('Convo', ConvoSchema)
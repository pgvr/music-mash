import * as mongoose from "mongoose"

export const PartySchema = new mongoose.Schema(
  {
    name: String,
    password: String,
    created_at: { type: Date, default: Date.now },
    partygoers: [{ username: String, token: String, host: Boolean }],
    tracks: [String],
  },
  { collection: "parties" },
)

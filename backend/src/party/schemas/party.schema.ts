import * as mongoose from "mongoose"

export const PartySchema = new mongoose.Schema(
  {
    name: String,
    created_at: { type: Date, default: Date.now },
    partygoers: [{ username: String, token: String, host: Boolean }],
  },
  { collection: "parties" },
)

import * as mongoose from "mongoose"

export const PartySchema = new mongoose.Schema(
  {
    _id: Number,
    name: String,
    partygoers: [{ username: String, token: String, host: Boolean }],
  },
  { collection: "parties" },
)

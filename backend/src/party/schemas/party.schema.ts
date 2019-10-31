import * as mongoose from "mongoose"

export const PartySchema = new mongoose.Schema(
  {
    name: String,
    partygoers: [{ username: String, token: String, host: Boolean }],
  },
  { collection: "parties" },
)

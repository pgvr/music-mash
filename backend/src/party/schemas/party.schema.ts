import * as mongoose from "mongoose"

export const PartySchema = new mongoose.Schema(
  {
    name: String,
    password: String,
    created_at: { type: Date, default: Date.now },
    partygoers: [{ username: String, token: String, host: Boolean }],
    tracks: [
      {
        id: String,
        uri: String,
        name: String,
        popularity: Number,
        album: { name: String, releaseDate: Date, id: String, uri: String },
        artist: {
          name: String,
          id: String,
          uri: String,
          genre: [String],
          popularity: Number,
        },
        acousticness: Number,
        danceability: Number,
        duration_ms: Number,
        energy: Number,
        instrumentalness: Number,
        key: Number,
        liveness: Number,
        loudness: Number,
        mode: Number,
        speechiness: Number,
        tempo: Number,
        time_signature: Number,
        valence: Number,
      },
    ],
  },
  { collection: "parties" },
)

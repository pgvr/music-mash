export interface Party {
  _id?: string
  name: string
  partygoers: { _id?: string; username: string; token: string; host: boolean }[]
  created_at: Date
  playlistUrl?: string
  tracks?: {
    id: string
    uri: string
    name: string
    popularity: number
    album: { name: string; releaseDate: Date; id: string; uri: string }
    artist: {
      name: string
      id: string
      uri: string
      images: [{ height: number; url: string; width: number }]
    }
  }[]
  suggestedTracks?: {
    id: string
    uri: string
    name: string
    popularity: number
    album: { name: string; releaseDate: Date; id: string; uri: string }
    artist: {
      name: string
      id: string
      uri: string
      images: [{ height: number; url: string; width: number }]
    }
  }[]
  topGenres: [{ genre: string; count: number }]
}

export interface Party {
  _id?: string
  name?: string
  password?: string
  created_at?: Date
  partygoers: {
    _id?: string
    username: string
    token: string
    host: boolean
    refreshToken?: string
  }[]
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
  playlistUrl?: string
  topGenres?: [{ genre: string; count: number }]
}

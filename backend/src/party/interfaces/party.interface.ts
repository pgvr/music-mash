export interface Party {
  _id?: string
  name?: string
  password?: string
  partygoers: { _id?: string; username: string; token: string; host: boolean }[]
  tracks?: {
    id: string
    uri: string
    name: string
    popularity: number
    album: { name: string; releaseDate: Date; id: string; uri: string }
    artist: { name: string; id: string; uri: string }
  }[]
}

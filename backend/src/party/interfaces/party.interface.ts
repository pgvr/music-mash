export interface Party {
  _id?: string
  name?: string
  password?: string
  partygoers: { _id?: string; username: string; token: string; host: boolean }[]
  tracks?: { trackId: string }[]
}

export interface Party {
  _id?: string
  name: string
  partygoers: { _id?: string; username: string; token: string; host: boolean }[]
}

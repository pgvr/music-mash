export interface Party {
  _id?: String
  name?: String
  partygoers: { _id?: String; username: String; token: String; host: Boolean }[]
}

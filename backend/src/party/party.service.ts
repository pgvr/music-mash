import { Injectable, HttpService } from "@nestjs/common"
import { Party } from "./interfaces/party.interface"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { config } from "dotenv"
import { resolve } from "path"
config({ path: resolve(__dirname, "../../../.env") })
const redirectUri = process.env.REDIRECT_URI || ""

@Injectable()
export class PartyService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel("Party") private readonly partyModel: Model<Party>,
  ) {}

  public async getAccessToken(authToken: string) {
    let body = new URLSearchParams()
    body.set("grant_type", "authorization_code")
    body.set("code", authToken)
    body.set("redirect_uri", redirectUri)
    const headers = {
      Authorization:
        "Basic ZDllZDQ3MWQyZGFlNGVjOGEyNmU3NzI1YmY2MmZhNzk6YWJkNWY3MjZlMDQ3NDU1ZDhmMGE3ODQxZTJjMzRkYmY=",
      "Content-Type": "application/x-www-form-urlencoded",
    }
    const res = await this.httpService
      .post("https://accounts.spotify.com/api/token", body, { headers })
      .toPromise()
    return res.data["access_token"]
  }
  public async getSpotifyUsername(token: string) {
    const res = await this.httpService
      .get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .toPromise()
    const displayName = res.data["display_name"]
    return displayName
  }

  public async createParty(newParty: Party) {
    const createdParty = new this.partyModel(newParty)
    return await createdParty.save()
  }

  public async addPartyMember(
    username: String,
    token: String,
    partyId: String,
  ) {
    const partyMember = { host: false, token, username }
    const updatedParty = await this.partyModel
      .findByIdAndUpdate(
        partyId,
        {
          $push: { partygoers: partyMember },
        },
        { new: true },
      )
      .exec()
    console.log(updatedParty)
    return updatedParty
  }

  public async getPartyById(partyId: String) {
    const party = (await this.partyModel.find({ _id: partyId }).exec()) as Party
    return party
  }

  public async partyTime(partyId: string) {
    let party = await this.getPartyById(partyId)
    party = party[0]
    let host
    for (let i = 0; i < party.partygoers.length; i++) {
      const member = party.partygoers[i]
      if (member.host) {
        host = member
        break
      }
    }
    const playlistId = await this.createPartyPlaylist(party, host)
    console.log("playlist id " + playlistId)
    const tracks = await this.getPartyTracks(partyId)
    console.log("tracks " + tracks)
    const res = await this.addTracksToPlaylist(playlistId, tracks, host)
    console.log("add res " + res)
    return res
  }

  public async addTracksToPlaylist(playlistId: string, tracks, host) {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`
    let uris = []
    for (let i = 0; i < tracks.length; i++) {
      uris.push(tracks[i].uri)
    }
    const body = {
      uris,
    }
    console.log(body)
    const res = await this.httpService
      .post(url, body, {
        headers: {
          Authorization: `Bearer ${host.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .toPromise()
    console.log(res.data)
    return res.data
  }

  public async createPartyPlaylist(party: Party, host: any) {
    const url = `https://api.spotify.com/v1/users/${host.username}/playlists`
    const body = {
      name: party.name,
      description: "Created via Music Mash",
    }
    const res = await this.httpService
      .post(url, body, {
        headers: {
          Authorization: `Bearer ${host.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .toPromise()
    const playlistId = res.data.id
    return playlistId
  }

  public async getPartyTracks(partyId: string) {
    let party = await this.getPartyById(partyId)
    party = party[0]
    let topTracks = []
    for (let i = 0; i < party.partygoers.length; i++) {
      const member = party.partygoers[i]
      const userTracks = await this.getUserTracks(member.token)
      topTracks = [...topTracks, ...userTracks]
    }
    return topTracks
  }

  private async getUserTracks(userToken: string) {
    const url = "https://api.spotify.com/v1/me/top/tracks"
    const res = await this.httpService
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .toPromise()
    return res.data["items"]
  }
}

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

  public async getPartyTracks(partyId: string) {
    let party = await this.getPartyById(partyId)
    party = party[0]
    let hostToken
    let topTracks = []
    for (let i = 0; i < party.partygoers.length; i++) {
      const member = party.partygoers[i]
      const userTracks = await this.getTopTracks(member.token)
      topTracks = [...topTracks, ...userTracks]
      // Save host token for playlist creation
      if (member.host) {
        hostToken = member.token
      }
    }
    console.log(topTracks)
    return topTracks
  }

  private async getTopTracks(userToken: string) {
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

import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { environment } from "../../environments/environment"
import { Party } from "../interfaces/party"

@Injectable({
  providedIn: "root",
})
export class PartyService {
  api = environment.apiUrl + "/party"
  constructor(private http: HttpClient) {}

  async getPartyById(partyId: string): Promise<Party> {
    const res = await this.http.get(`${this.api}/${partyId}`).toPromise()
    return res as Party
  }

  async createNewParty(
    partyName: string,
    hostToken: string,
    partyPassword: string,
  ) {
    const data = {
      partyName,
      hostToken,
      password: partyPassword,
    }
    const res = await this.http.post(`${this.api}/create`, data).toPromise()
    return res
  }

  async getShortLink(url: string) {
    const res = await this.http
      .post(
        "https://api-ssl.bitly.com/v4/bitlinks",
        { long_url: url },
        {
          headers: {
            Authorization:
              "Bearer " + "207e8baf126fd9a78609d7baea0eb3c6fd9caccc",
          },
        },
      )
      .toPromise()
    return res as { link: string }
  }

  async addMemberToParty(partyId: string, memberToken: string) {
    const data = {
      partyId,
      memberToken,
    }
    const res = await this.http.post(`${this.api}/update`, data).toPromise()
    return res
  }

  async removeMember(partyId: string, username: string, password: string) {
    const data = { partyId, username, password }
    const res = await this.http.post(`${this.api}/deleteUser`, data).toPromise()
    return res
  }

  async getTopTracks(partyId: string): Promise<any[]> {
    const res = (await this.http
      .get(`${this.api}/tracks/${partyId}`)
      .toPromise()) as any[]
    return res
  }

  async createPartyPlaylist(partyId: string, password: string) {
    const tracks = await this.http
      .post(`${this.api}/playlist`, { id: partyId, password })
      .toPromise()
    return tracks
  }

  async analyzeTracks(partyId: string) {
    const res = await this.http
      .get(`${this.api}/analyze/${partyId}`)
      .toPromise()
    return res
  }
}

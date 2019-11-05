import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: "root",
})
export class PartyService {
  api = environment.apiUrl + "/party"
  constructor(private http: HttpClient) {}

  async getPartyById(partyId: string) {
    const res = this.http.get(`${this.api}/${partyId}`).toPromise()
    return res
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
    const res = this.http.post(`${this.api}/create`, data).toPromise()
    return res
  }

  addMemberToParty(partyId: string, memberToken: string) {
    const data = {
      partyId,
      memberToken,
    }
    const res = this.http.post(`${this.api}/update`, data).toPromise()
    return res
  }

  async getTopTracks(partyId: string): Promise<any[]> {
    const res = (await this.http
      .get(`${this.api}/tracks/${partyId}`)
      .toPromise()) as any[]
    return res
  }

  async createPartyPlaylist(partyId: string, password: string) {
    const res = await this.http
      .post(`${this.api}/playlist`, { id: partyId, password })
      .toPromise()
    return res
  }
}

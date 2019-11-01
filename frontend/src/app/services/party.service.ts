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

  async createNewParty(partyName: string, hostToken: string) {
    const data = {
      partyName,
      hostToken,
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
      .get(`${this.api}/partytime/${partyId}`)
      .toPromise()) as any[]
    return res
  }
}

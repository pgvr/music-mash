import { Injectable } from "@angular/core"
import { HttpClient } from "@angular/common/http"

@Injectable({
  providedIn: "root",
})
export class PartyService {
  api = "http://localhost:3000/party"
  constructor(private http: HttpClient) {}

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
}

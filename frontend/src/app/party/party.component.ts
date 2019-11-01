import { Component, OnInit } from "@angular/core"
import { ActivatedRoute } from "@angular/router"
import { PartyService } from "../services/party.service"
import { Party } from "../interfaces/party"

@Component({
  selector: "app-party",
  templateUrl: "./party.component.html",
  styleUrls: ["./party.component.scss"],
})
export class PartyComponent implements OnInit {
  partyNameModel = ""
  loading = true
  party: Party

  constructor(
    private route: ActivatedRoute,
    private partyService: PartyService,
  ) {}

  ngOnInit() {
    // check for url params
    const code = this.route.snapshot.queryParams["code"]
    let state = this.route.snapshot.queryParams["state"]
    if (state && code) {
      state = JSON.parse(state)
      if (state.partyId) {
        // party already exists, add user
        this.partyService.addMemberToParty(state.partyId, code).then(res => {
          console.log(res)
          this.loading = false
        })
      } else {
        // create party with party name and (host) token
        this.partyService.createNewParty(state.partyName, code).then(res => {
          console.log(res)
          this.loading = false
        })
      }
    } else {
      this.loading = false
    }
  }

  authenticateHost() {
    const obj = {
      partyName: this.partyNameModel,
    }
    window.location.href = `https://accounts.spotify.com/authorize?client_id=d9ed471d2dae4ec8a26e7725bf62fa79&response_type=code&redirect_uri=http://localhost:4200/party&scope=user-read-private%20user-read-email&state=${JSON.stringify(
      obj,
    )}`
  }
}

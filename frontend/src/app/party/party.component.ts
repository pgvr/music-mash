import { Component, OnInit } from "@angular/core"
import { ActivatedRoute } from "@angular/router"

@Component({
  selector: "app-party",
  templateUrl: "./party.component.html",
  styleUrls: ["./party.component.scss"],
})
export class PartyComponent implements OnInit {
  partyName = ""

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // check for url params
    const code = this.route.snapshot.queryParams["code"]
    let state = this.route.snapshot.queryParams["state"]
    if (state) {
      state = JSON.parse(state)
      if (state.partyId) {
        // party already exists, add user
      } else {
        // create party with party name and (host) token
      }
    }
  }

  authenticateHost() {
    const obj = {
      partyName: this.partyName,
    }
    window.location.href = `https://accounts.spotify.com/authorize?client_id=d9ed471d2dae4ec8a26e7725bf62fa79&response_type=code&redirect_uri=http://localhost:4200/party&scope=user-read-private%20user-read-email&state=${JSON.stringify(
      obj,
    )}`
  }
}

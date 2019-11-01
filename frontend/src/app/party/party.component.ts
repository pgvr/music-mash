import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
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
    private router: Router,
  ) {}

  ngOnInit() {
    this.init()
  }

  async init() {
    // check for url params
    const code = this.route.snapshot.queryParams["code"]
    let state = this.route.snapshot.queryParams["state"]
    if (localStorage.getItem("partyId") && !code && !state) {
      // get by id from db
      console.log("load from localstorage")
      const res = await this.partyService.getPartyById(
        localStorage.getItem("partyId"),
      )
      this.party = res[0] as Party
      console.log(this.party)
    } else if (state && code) {
      state = JSON.parse(state)
      if (state.partyName) {
        console.log("create new party")
        const res = await this.partyService.createNewParty(
          state.partyName,
          code,
        )
        this.party = res as Party
        console.log(this.party)
        localStorage.setItem("partyId", this.party._id)
        this.router.navigateByUrl("/party")
      } else if (state.partyId) {
        console.log("update party")
        const res = await this.partyService.addMemberToParty(
          state.partyId,
          code,
        )
        this.party = res as Party
        console.log(this.party)
        localStorage.setItem("partyId", this.party._id)
        this.router.navigateByUrl("/party")
      }
    }
    this.loading = false
  }

  authenticateHost() {
    const obj = {
      partyName: this.partyNameModel,
    }
    window.location.href = `https://accounts.spotify.com/authorize?client_id=d9ed471d2dae4ec8a26e7725bf62fa79&show_dialog=true&response_type=code&redirect_uri=http://localhost:4200/party&scope=user-read-private%20user-read-email%20user-top-read&state=${JSON.stringify(
      obj,
    )}`
  }

  addMember() {
    const obj = {
      partyId: this.party._id,
    }
    window.location.href = `https://accounts.spotify.com/authorize?client_id=d9ed471d2dae4ec8a26e7725bf62fa79&show_dialog=true&response_type=code&redirect_uri=http://localhost:4200/party&scope=user-read-private%20user-read-email%20user-top-read&state=${JSON.stringify(
      obj,
    )}`
  }

  startNewParty() {
    localStorage.clear()
    this.party = null
    this.partyNameModel = ""
  }
}

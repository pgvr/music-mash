import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { PartyService } from "../services/party.service"
import { Party } from "../interfaces/party"
import { environment } from "../../environments/environment"
import { NbDialogService, NbToastrService } from "@nebular/theme"
import { PasswordDialogComponent } from "../password-dialog/password-dialog.component"

@Component({
  selector: "app-party",
  templateUrl: "./party.component.html",
  styleUrls: ["./party.component.scss"],
})
export class PartyComponent implements OnInit {
  loading = true
  party: Party

  constructor(
    private route: ActivatedRoute,
    private partyService: PartyService,
    private router: Router,
    private toastrService: NbToastrService,
  ) {}

  ngOnInit() {
    this.init()
  }

  async init() {
    // check for url params
    const code = this.route.snapshot.queryParams["code"]
    let state = this.route.snapshot.queryParams["state"]
    const partyId = this.route.snapshot.params["partyId"]
    if (partyId) {
      // get by id from db
      const res = await this.partyService.getPartyById(partyId)
      this.party = res as Party
      console.log(this.party)
    } else if (state && code) {
      state = JSON.parse(state)
      if (state.partyName) {
        const name = state.partyName.split("+").join(" ")
        const res = await this.partyService
          .createNewParty(name, code, state.partyPassword)
          .catch(err => this.handleError(err))
        this.party = res as Party
        this.router.navigateByUrl(`/party/${this.party._id}`)
      } else if (state.partyId) {
        const res = await this.partyService
          .addMemberToParty(state.partyId, code)
          .catch(err => this.handleError(err))
        this.party = res as Party
        this.router.navigateByUrl(`/party/${this.party._id}`)
      }
    } else {
      this.router.navigateByUrl("/")
    }
    this.loading = false
  }

  handleError(err) {
    console.error(err)
    this.toastrService.warning(err.statusText, "Error")
    this.loading = false
    if (this.party) {
      this.router.navigateByUrl(`/party/${this.party._id}`)
    } else {
      this.router.navigateByUrl("/party")
    }
  }
}

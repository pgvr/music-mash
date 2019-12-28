import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { PartyService } from "../services/party.service"
import { Party } from "../interfaces/party"
import { environment } from "../../environments/environment"
import { NbDialogService, NbToastrService } from "@nebular/theme"
import { PasswordDialogComponent } from "../password-dialog/password-dialog.component"
import { Title } from "@angular/platform-browser"

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
    private titleService: Title,
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
      this.updateParty(res as Party)
      console.log(this.party)
    } else if (state && code) {
      state = JSON.parse(state)
      if (state.partyName) {
        const name = state.partyName.split("+").join(" ")
        const res = await this.partyService
          .createNewParty(name, code, state.partyPassword)
          .catch(err => this.handleError(err))
        this.updateParty(res as Party)
        this.router.navigateByUrl(`/party/${this.party._id}`)
      } else if (state.partyId) {
        const res = await this.partyService
          .addMemberToParty(state.partyId, code)
          .catch(err => this.handleError(err))
        this.updateParty(res as Party)
        this.router.navigateByUrl(`/party/${this.party._id}`)
      }
    } else {
      this.router.navigateByUrl("/")
    }
    this.loading = false
  }

  updateParty(party) {
    this.party = party
    if (this.party.name) {
      const newTitle = `${this.party.name} - Music Mash`
      this.titleService.setTitle(newTitle)
      this.changeOgTitle(newTitle)
    } else {
      const newTitle = "Music Mash"
      this.titleService.setTitle(newTitle)
      this.changeOgTitle(newTitle)
    }
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

  changeOgTitle(title: string) {
    const metas = document.getElementsByTagName("meta")

    for (let c = 0; c < metas.length; c++) {
      const property = metas[c].attributes.getNamedItem("property")
      if (property && property.value === "og:title") {
        console.log("changing title")
        const newContent = document.createAttribute("content")
        newContent.value = title
        metas[c].attributes.setNamedItem(newContent)
      }
    }
  }
}

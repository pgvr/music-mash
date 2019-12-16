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
  actionLoading = false
  loading = true
  party: Party
  tracks = []

  constructor(
    private route: ActivatedRoute,
    private partyService: PartyService,
    private router: Router,
    private dialogService: NbDialogService,
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
      console.log("use existing id")
      const res = await this.partyService.getPartyById(partyId)
      this.party = res as Party
      console.log(this.party)
      const created = new Date(this.party.created_at)
      const now = new Date()
      const differenceInHours =
        (now.getTime() - created.getTime()) / (1000 * 3600)
      if (differenceInHours >= 1) {
        // party too old
        this.router.navigateByUrl("/")
        this.toastrService.info(
          "Unfortunately parties can only be used within one hour of creation. Please create a new one.",
          "Party Too Old",
          { duration: 10000 },
        )
      }
    } else if (state && code) {
      state = JSON.parse(state)
      if (state.partyName) {
        console.log("create new party")
        const name = state.partyName.split("+").join(" ")
        console.log(name)
        const res = await this.partyService
          .createNewParty(name, code, state.partyPassword)
          .catch(err => this.handleError(err))
        this.party = res as Party
        this.router.navigateByUrl(`/party/${this.party._id}`)
      } else if (state.partyId) {
        console.log("update party")
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
    this.actionLoading = false
    if (this.party) {
      this.router.navigateByUrl(`/party/${this.party._id}`)
    } else {
      this.router.navigateByUrl("/party")
    }
  }

  addMember() {
    const obj = {
      partyId: this.party._id,
    }
    const url = `https://accounts.spotify.com/authorize?client_id=d9ed471d2dae4ec8a26e7725bf62fa79&show_dialog=true&response_type=code&redirect_uri=${
      environment.redirectUrl
    }&scope=user-read-private%20user-read-email%20user-top-read&state=${JSON.stringify(
      obj,
    )}`
    this.copyToClipboard(url)
    this.toastrService.info("You can share the link now", "Link Copied")
  }

  async removeMember(username: string) {
    try {
      const password = await this.dialogService
        .open(PasswordDialogComponent, {
          context: { buttonText: "Delete User" },
        })
        .onClose.toPromise()

      if (password !== -1) {
        this.actionLoading = true
        const updatedParty = await this.partyService.removeMember(
          this.party._id,
          username,
          password,
        )
        this.party = updatedParty as Party
      }

      this.actionLoading = false
    } catch (error) {
      this.handleError(error)
    }
  }

  copyToClipboard(text) {
    var dummy = document.createElement("textarea")
    // to avoid breaking orgain page when copying more words
    // cant copy when adding below this code
    // dummy.style.display = 'none'
    document.body.appendChild(dummy)
    //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
    dummy.value = text
    dummy.select()
    document.execCommand("copy")
    document.body.removeChild(dummy)
  }

  async partyTime() {
    try {
      const password = await this.dialogService
        .open(PasswordDialogComponent, {
          context: { buttonText: "Create Playlist" },
        })
        .onClose.toPromise()

      if (password !== -1) {
        this.actionLoading = true
        const tracks = await this.partyService.createPartyPlaylist(
          this.party._id,
          password,
        )
        console.log(tracks)
        const trackString = JSON.stringify(tracks)
        this.copyToClipboard(trackString)
        this.toastrService.success(
          "Check the host's Spotify account",
          "Playlist Created",
        )
      }

      this.actionLoading = false
    } catch (error) {
      this.handleError(error)
    }
  }
}

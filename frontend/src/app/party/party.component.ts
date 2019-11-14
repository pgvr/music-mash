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
  partyNameModel = ""
  partyPasswordModel = ""
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
    } else if (state && code) {
      state = JSON.parse(state)
      if (state.partyName) {
        console.log("create new party")
        const res = await this.partyService
          .createNewParty(state.partyName, code, state.partyPassword)
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

  authenticateHost() {
    const obj = {
      partyName: this.partyNameModel,
      partyPassword: this.partyPasswordModel,
    }
    window.location.href = `https://accounts.spotify.com/authorize?client_id=d9ed471d2dae4ec8a26e7725bf62fa79&show_dialog=true&response_type=code&redirect_uri=${
      environment.redirectUrl
    }&scope=user-read-private%20user-read-email%20user-top-read%20playlist-modify-public&state=${JSON.stringify(
      obj,
    )}`
  }

  addMember() {
    const obj = {
      partyId: this.party._id,
    }
    window.location.href = `https://accounts.spotify.com/authorize?client_id=d9ed471d2dae4ec8a26e7725bf62fa79&show_dialog=true&response_type=code&redirect_uri=${
      environment.redirectUrl
    }&scope=user-read-private%20user-read-email%20user-top-read&state=${JSON.stringify(
      obj,
    )}`
  }

  startNewParty() {
    localStorage.clear()
    this.party = null
    this.partyNameModel = ""
    this.partyPasswordModel = ""
    this.router.navigateByUrl("/party")
  }

  async getTopTracks() {
    this.actionLoading = true
    try {
      const topTracks = await this.partyService.getTopTracks(this.party._id)
      this.tracks = topTracks as any[]
      this.toastrService.success("Showing top tracks", "Tracks")
    } catch (error) {
      this.handleError(error)
    }
    this.actionLoading = false
  }

  async partyTime() {
    this.actionLoading = true
    try {
      const password = await this.dialogService
        .open(PasswordDialogComponent)
        .onClose.toPromise()
      if (password) {
        await this.partyService.createPartyPlaylist(this.party._id, password)
        this.toastrService.success(
          "Check the host's Spotify account",
          "Playlist Created",
        )
      } else {
        this.toastrService.warning(
          "Provide the password to create the playlist",
          "No Password",
        )
      }
      this.actionLoading = false
    } catch (error) {
      this.handleError(error)
    }
  }

  async analyzeTracks() {
    this.actionLoading = true
    try {
      const analyzedTracks = await this.partyService.analyzeTracks(
        this.party._id,
      )
      this.actionLoading = false
      console.log(analyzedTracks)
    } catch (error) {
      this.handleError(error)
    }
  }
}

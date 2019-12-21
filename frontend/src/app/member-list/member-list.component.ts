import { Component, OnInit, Input } from "@angular/core"
import { Party } from "../interfaces/party"
import { environment } from "src/environments/environment"
import { PasswordDialogComponent } from "../password-dialog/password-dialog.component"
import { NbDialogService, NbToastrService } from "@nebular/theme"
import { PartyService } from "../services/party.service"
import { Router } from "@angular/router"

@Component({
  selector: "app-member-list",
  templateUrl: "./member-list.component.html",
  styleUrls: ["./member-list.component.scss"],
})
export class MemberListComponent implements OnInit {
  @Input() party: Party
  actionLoading = false

  constructor(
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private partyService: PartyService,
    private router: Router,
  ) {}

  ngOnInit() {}

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
        this.party = await this.partyService.getPartyById(this.party._id)
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

  async addMember() {
    // const obj = {
    //   partyId: this.party._id,
    // }
    // const url = `https://accounts.spotify.com/authorize?client_id=d9ed471d2dae4ec8a26e7725bf62fa79&show_dialog=true&response_type=code&redirect_uri=${
    //   environment.redirectUrl
    // }&scope=user-read-private%20user-read-email%20user-top-read&state=${JSON.stringify(
    //   obj,
    // )}`
    // const { link } = await this.partyService.getShortLink(url)
    const link =
      environment.redirectUrl + "/" + this.party._id + "/authenticate"
    this.copyToClipboard(link)
    this.toastrService.info("You can share the link now", "Link Copied", {
      icon: "clipboard-outline",
    })
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

  handleError(err) {
    console.error(err)
    this.toastrService.warning(err.statusText, "Error")
    this.actionLoading = false
    if (this.party) {
      this.router.navigateByUrl(`/party/${this.party._id}`)
    } else {
      this.router.navigateByUrl("/party")
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
}

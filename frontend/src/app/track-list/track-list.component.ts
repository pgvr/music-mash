import { Component, OnInit, Input } from "@angular/core"
import { Party } from "../interfaces/party"

@Component({
  selector: "app-track-list",
  templateUrl: "./track-list.component.html",
  styleUrls: ["./track-list.component.scss"],
})
export class TrackListComponent implements OnInit {
  @Input() party: Party

  constructor() {}

  ngOnInit() {}

  openPlaylist() {
    if (this.party && this.party.playlistUrl) {
      window.open(this.party.playlistUrl, "_blank")
    }
  }
}

import { Component, OnInit } from "@angular/core"
import { environment } from "../../environments/environment"
import { Title } from "@angular/platform-browser"

@Component({
  selector: "app-party-creation",
  templateUrl: "./party-creation.component.html",
  styleUrls: ["./party-creation.component.scss"],
})
export class PartyCreationComponent implements OnInit {
  partyNameModel = ""
  partyPasswordModel = ""

  constructor(private titleService: Title) {}

  ngOnInit() {
    const newTitle = "Create Party - Music Mash"
    this.titleService.setTitle(newTitle)
    this.changeOgTitle(newTitle)
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
}

import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { environment } from "../../environments/environment"

@Component({
  selector: "app-redirect-auth",
  templateUrl: "./redirect-auth.component.html",
  styleUrls: ["./redirect-auth.component.scss"],
})
export class RedirectAuthComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const partyId = this.route.snapshot.params["partyId"]
    if (partyId) {
      const obj = {
        partyId,
      }
      const state = encodeURI(JSON.stringify(obj))
      const url = `https://accounts.spotify.com/authorize?client_id=d9ed471d2dae4ec8a26e7725bf62fa79&show_dialog=true&response_type=code&redirect_uri=${environment.redirectUrl}&scope=user-read-private%20user-read-email%20user-top-read&state=${state}`
      window.location.href = url
    } else {
      this.router.navigateByUrl("/")
    }
  }
}

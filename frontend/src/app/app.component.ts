import { Component } from "@angular/core"
import { Router } from "@angular/router"
import { NbThemeService } from "@nebular/theme"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  constructor(public router: Router, private themeService: NbThemeService) {}

  startNewParty() {
    this.router.navigateByUrl("/party")
  }

  changeTheme(event) {
    if (event) {
      this.themeService.changeTheme("cosmic")
    } else {
      this.themeService.changeTheme("default")
    }
  }
}

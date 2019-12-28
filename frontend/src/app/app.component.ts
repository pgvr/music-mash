import { Component, OnInit } from "@angular/core"
import { Router } from "@angular/router"
import { NbThemeService, NbToastrService } from "@nebular/theme"
import { SwUpdate } from "@angular/service-worker"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  constructor(
    public router: Router,
    private themeService: NbThemeService,
    private swUpdate: SwUpdate,
    private toastrService: NbToastrService,
  ) {}

  ngOnInit() {
    this.swUpdate.available.subscribe(evt => {
      // an update is available, add some logic here.
      this.toastrService.info("Reload to update the app", "Update Available", {
        icon: "gift-outline",
        duration: 5000,
      })
    })
  }

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

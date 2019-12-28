import { OnInit, Component, isDevMode } from "@angular/core"
import { Router, NavigationEnd } from "@angular/router"
import { NbThemeService, NbToastrService } from "@nebular/theme"
import { SwUpdate } from "@angular/service-worker"
import { filter } from "rxjs/operators"
import { environment } from "../environments/environment"

declare var gtag

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
  ) {
    if (!isDevMode()) {
      const navEndEvent$ = router.events.pipe(
        filter(e => e instanceof NavigationEnd),
      )
      navEndEvent$.subscribe((e: NavigationEnd) => {
        gtag("config", "UA-100079341-3", { page_path: e.urlAfterRedirects })
      })
    }
  }

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

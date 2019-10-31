import { NgModule } from "@angular/core"
import { Routes, RouterModule } from "@angular/router"
import { PartyComponent } from "./party/party.component"

const routes: Routes = [
  {
    path: "party",
    component: PartyComponent,
  },
  {
    path: "party/:partyName",
    component: PartyComponent,
  },
  {
    path: "",
    redirectTo: "/party",
    pathMatch: "full",
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

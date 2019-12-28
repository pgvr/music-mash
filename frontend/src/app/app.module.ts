import { BrowserModule } from "@angular/platform-browser"
import { NgModule } from "@angular/core"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import {
  NbThemeModule,
  NbLayoutModule,
  NbButtonModule,
  NbIconModule,
  NbInputModule,
  NbCardModule,
  NbDialogModule,
  NbToastrModule,
  NbSpinnerModule,
  NbGlobalPhysicalPosition,
  NbToggleModule,
} from "@nebular/theme"
import { NbEvaIconsModule } from "@nebular/eva-icons"
import { PartyComponent } from "./party/party.component"
import { FormsModule } from "@angular/forms"
import { HttpClientModule } from "@angular/common/http"
import { PasswordDialogComponent } from "./password-dialog/password-dialog.component"
import { PartyCreationComponent } from "./party-creation/party-creation.component"
import { RedirectAuthComponent } from "./redirect-auth/redirect-auth.component"
import { MemberListComponent } from "./member-list/member-list.component"
import { TrackListComponent } from "./track-list/track-list.component"
import { GenreListComponent } from "./genre-list/genre-list.component"
import { ServiceWorkerModule } from "@angular/service-worker"
import { environment } from "../environments/environment"
import { GtagModule } from "angular-gtag"

@NgModule({
  declarations: [
    AppComponent,
    PartyComponent,
    PasswordDialogComponent,
    PartyCreationComponent,
    RedirectAuthComponent,
    MemberListComponent,
    TrackListComponent,
    GenreListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: "default" }),
    NbLayoutModule,
    NbButtonModule,
    NbIconModule,
    NbInputModule,
    NbCardModule,
    NbToggleModule,
    NbDialogModule.forRoot(),
    NbToastrModule.forRoot({ position: NbGlobalPhysicalPosition.BOTTOM_RIGHT }),
    NbSpinnerModule,
    FormsModule,
    HttpClientModule,
    NbEvaIconsModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),
    GtagModule.forRoot({ trackingId: "UA-100079341-3", trackPageviews: true }),
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [PasswordDialogComponent],
})
export class AppModule {}

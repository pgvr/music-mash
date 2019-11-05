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
} from "@nebular/theme"
import { NbEvaIconsModule } from "@nebular/eva-icons"
import { PartyComponent } from "./party/party.component"
import { FormsModule } from "@angular/forms"
import { HttpClientModule } from "@angular/common/http"
import { PasswordDialogComponent } from "./password-dialog/password-dialog.component"

@NgModule({
  declarations: [AppComponent, PartyComponent, PasswordDialogComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: "cosmic" }),
    NbLayoutModule,
    NbButtonModule,
    NbIconModule,
    NbInputModule,
    NbCardModule,
    NbDialogModule.forRoot(),
    FormsModule,
    HttpClientModule,
    NbEvaIconsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [PasswordDialogComponent],
})
export class AppModule {}

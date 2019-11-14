import { Component, OnInit } from "@angular/core"
import { NbDialogRef } from "@nebular/theme"

@Component({
  selector: "app-password-dialog",
  templateUrl: "./password-dialog.component.html",
  styleUrls: ["./password-dialog.component.scss"],
})
export class PasswordDialogComponent implements OnInit {
  constructor(protected ref: NbDialogRef<PasswordDialogComponent>) {}

  ngOnInit() {}

  cancel() {
    this.ref.close(-1)
  }

  submit(password) {
    this.ref.close(password)
  }
}

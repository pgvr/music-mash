import { Component, OnInit, Input } from "@angular/core"
import { Party } from "../interfaces/party"

@Component({
  selector: "app-genre-list",
  templateUrl: "./genre-list.component.html",
  styleUrls: ["./genre-list.component.scss"],
})
export class GenreListComponent implements OnInit {
  @Input() party: Party

  constructor() {}

  ngOnInit() {}
}

import { Component, OnInit, Input } from "@angular/core"
import { Party } from "../interfaces/party"
import { Label } from "ng2-charts"
import { ChartType, ChartOptions } from "chart.js"
import * as pluginDataLabels from "chartjs-plugin-datalabels"

@Component({
  selector: "app-genre-list",
  templateUrl: "./genre-list.component.html",
  styleUrls: ["./genre-list.component.scss"],
})
export class GenreListComponent implements OnInit {
  @Input() party: Party

  public pieChartLabels: Label[]
  public pieChartData: number[]
  public pieChartType: ChartType = "pie"
  public pieChartLegend = false
  public pieChartPlugins = [pluginDataLabels]

  public pieChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex]
          return label
        },
      },
    },
  }

  constructor() {}

  ngOnInit() {
    this.pieChartLabels = this.party.topGenres.map(genre => genre.genre)
    this.pieChartData = this.party.topGenres.map(genre =>
      Math.floor(genre.count),
    )
  }
}

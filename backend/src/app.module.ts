import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { config } from "dotenv"
import { resolve } from "path"
import { PartyModule } from "./party/party.module"
config({ path: resolve(__dirname, "../../.env") })
const uri = process.env.DATABASE_URI || ""
console.log(uri)

@Module({
  imports: [
    MongooseModule.forRoot(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    PartyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

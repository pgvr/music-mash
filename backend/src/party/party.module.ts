import { Module } from "@nestjs/common"
import { PartyController } from "./party.controller"
import { PartyService } from "./party.service"
import { MongooseModule } from "@nestjs/mongoose"
import { PartySchema } from "./schemas/party.schema"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Party", schema: PartySchema }]),
  ],
  controllers: [PartyController],
  providers: [PartyService],
})
export class PartyModule {}

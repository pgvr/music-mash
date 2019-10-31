import { Controller, Post, Body } from "@nestjs/common"
import { PartyService } from "./party.service"
import { PartyCreationDTO } from "./interfaces/partyCreation.dto"
import { Party } from "./interfaces/party.interface"

@Controller("party")
export class PartyController {
  constructor(private readonly partyService: PartyService) {}

  @Post()
  async createParty(@Body() partyCreationDTO: PartyCreationDTO) {
    // get username with token
    const username = await this.partyService.getSpotifyUsername(
      partyCreationDTO.hostToken,
    )
    const newParty: Party = {
      name: partyCreationDTO.partyName,
      partygoers: [
        {
          host: true,
          token: partyCreationDTO.hostToken,
          username: username,
        },
      ],
    }
    const createdParty = await this.partyService.createParty(newParty)
    return createdParty
    // unique id comes from mongo when creating the party
    // create party in db
  }
}

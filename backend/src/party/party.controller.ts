import { Controller, Post, Body, Get } from "@nestjs/common"
import { PartyService } from "./party.service"
import { PartyCreationDTO } from "./interfaces/partyCreation.dto"
import { Party } from "./interfaces/party.interface"
import { PartyMemberDTO } from "./interfaces/partyMember.dto"

@Controller("party")
export class PartyController {
  constructor(private readonly partyService: PartyService) {}

  @Post("/create")
  async createParty(@Body() partyCreationDTO: PartyCreationDTO) {
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
  }

  @Post("/update")
  async addPartyMember(@Body() partyMemberDTO: PartyMemberDTO) {
    const username = await this.partyService.getSpotifyUsername(
      partyMemberDTO.memberToken,
    )
    const updatedParty = await this.partyService.addPartyMember(
      username,
      partyMemberDTO.memberToken,
      partyMemberDTO.partyId,
    )
    return updatedParty
  }

  @Get("/id")
  async getPartyById(@Body() party: { id: string }) {
    const result = await this.partyService.getPartyById(party.id)
    return result
  }
}

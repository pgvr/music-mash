import { Controller, Post, Body, Get, Param } from "@nestjs/common"
import { PartyService } from "./party.service"
import { PartyCreationDTO } from "./interfaces/partyCreation.dto"
import { Party } from "./interfaces/party.interface"
import { PartyMemberDTO } from "./interfaces/partyMember.dto"

@Controller("party")
export class PartyController {
  constructor(private readonly partyService: PartyService) {}

  @Post("/create")
  async createParty(@Body() partyCreationDTO: PartyCreationDTO) {
    const accessToken = await this.partyService.getAccessToken(
      partyCreationDTO.hostToken,
    )
    const username = await this.partyService.getSpotifyUsername(accessToken)
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
    const accessToken = await this.partyService.getAccessToken(
      partyMemberDTO.memberToken,
    )
    const username = await this.partyService.getSpotifyUsername(accessToken)
    const updatedParty = await this.partyService.addPartyMember(
      username,
      partyMemberDTO.memberToken,
      partyMemberDTO.partyId,
    )
    return updatedParty
  }

  @Get(":id")
  async getPartyById(@Param("id") id) {
    const result = await this.partyService.getPartyById(id)
    return result
  }
}

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
    console.log("start create")
    const accessToken = await this.partyService.getAccessToken(
      partyCreationDTO.hostToken,
    )
    console.log(accessToken)
    const username = await this.partyService.getSpotifyUsername(accessToken)
    console.log(username)
    const newParty: Party = {
      name: partyCreationDTO.partyName,
      partygoers: [
        {
          host: true,
          token: accessToken,
          username: username,
        },
      ],
    }
    const createdParty = await this.partyService.createParty(newParty)
    console.log(createdParty)
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
      accessToken,
      partyMemberDTO.partyId,
    )
    return updatedParty
  }

  @Get(":id")
  async getPartyById(@Param("id") id) {
    const result = await this.partyService.getPartyById(id)
    return result
  }

  @Get("/tracks/:id")
  async getTopTracks(@Param("id") id) {
    const topTracks = await this.partyService.getPartyTracks(id)
    return topTracks
  }

  @Post("/playlist/:id")
  async createPlaylist(@Param("id") id) {
    const createdPlaylist = await this.partyService.partyTime(id)
    return createdPlaylist
  }
}

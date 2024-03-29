import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Res,
  HttpStatus,
} from "@nestjs/common"
import { PartyService } from "./party.service"
import { PartyCreationDTO } from "./interfaces/partyCreation.dto"
import { Party } from "./interfaces/party.interface"
import { PartyMemberDTO } from "./interfaces/partyMember.dto"
import { Response } from "express"

@Controller("party")
export class PartyController {
  constructor(private readonly partyService: PartyService) {}

  @Post("/create")
  async createParty(@Body() partyCreationDTO: PartyCreationDTO) {
    const {
      accessToken,
      refreshToken,
    } = await this.partyService.getAccessToken(partyCreationDTO.hostToken)
    const username = await this.partyService.getSpotifyUsername(accessToken)
    const hash = await this.partyService.hashPassword(partyCreationDTO.password)
    const newParty: Party = {
      name: partyCreationDTO.partyName,
      password: hash,
      partygoers: [
        {
          host: true,
          token: accessToken,
          username: username,
          refreshToken,
        },
      ],
    }
    const createdParty = await this.partyService.createParty(newParty)
    return createdParty
  }

  @Post("/update")
  async addPartyMember(@Body() partyMemberDTO: PartyMemberDTO) {
    const {
      accessToken,
      refreshToken,
    } = await this.partyService.getAccessToken(partyMemberDTO.memberToken)
    const username = await this.partyService.getSpotifyUsername(accessToken)
    const updatedParty = await this.partyService.addPartyMember(
      username,
      accessToken,
      partyMemberDTO.partyId,
      refreshToken,
    )
    return updatedParty
  }

  @Post("/deleteUser")
  async deleteUserFromParty(
    @Body()
    deletion: {
      partyId: string
      username: string
      password: string
    },
    @Res() res: Response,
  ) {
    const updatedParty = await this.partyService.deleteUserFromParty(
      deletion.partyId,
      deletion.username,
      deletion.password,
    )
    if (!updatedParty) {
      res.status(HttpStatus.UNAUTHORIZED).send()
    } else {
      res.send(updatedParty)
    }
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

  @Post("/playlist")
  async createPlaylist(
    @Body() body: { id: string; password: string },
    @Res() res: Response,
  ) {
    const createdPlaylist = await this.partyService.partyTime(
      body.id,
      body.password,
    )
    if (!createdPlaylist) {
      res.status(HttpStatus.UNAUTHORIZED).send()
    } else {
      res.send(createdPlaylist)
    }
  }

  @Get("/analyze/:id")
  async getAnalyzedTracks(@Param("id") id) {
    const topTracks = await this.partyService.getPartyTracks(id)
    const analyzedTracks = await this.partyService.getTrackAnalysis(
      topTracks,
      id,
    )
    return analyzedTracks
  }
}

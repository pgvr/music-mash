import { Injectable, HttpService } from "@nestjs/common"
import { Party } from "./interfaces/party.interface"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { config } from "dotenv"
import { resolve } from "path"
config({ path: resolve(__dirname, "../../../.env") })
import * as bcrypt from "bcrypt"
const redirectUri = process.env.REDIRECT_URI || ""
import * as quantile from "compute-quantile"

@Injectable()
export class PartyService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel("Party") private readonly partyModel: Model<Party>,
  ) {}

  public async getAccessToken(authToken: string) {
    let body = new URLSearchParams()
    body.set("grant_type", "authorization_code")
    body.set("code", authToken)
    body.set("redirect_uri", redirectUri)
    const headers = {
      Authorization:
        "Basic ZDllZDQ3MWQyZGFlNGVjOGEyNmU3NzI1YmY2MmZhNzk6YWJkNWY3MjZlMDQ3NDU1ZDhmMGE3ODQxZTJjMzRkYmY=",
      "Content-Type": "application/x-www-form-urlencoded",
    }
    const res = await this.httpService
      .post("https://accounts.spotify.com/api/token", body, { headers })
      .toPromise()
    return res.data["access_token"]
  }
  public async getSpotifyUsername(token: string) {
    const res = await this.httpService
      .get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .toPromise()
    const displayName = res.data["display_name"]
    return displayName
  }

  public async createParty(newParty: Party) {
    const createdParty = new this.partyModel(newParty)
    return await createdParty.save()
  }

  public async addPartyMember(
    username: String,
    token: String,
    partyId: String,
  ) {
    const partyMember = { host: false, token, username }
    const party = await this.getPartyById(partyId)
    console.log(party.partygoers)
    for (let i = 0; i < party.partygoers.length; i++) {
      if (party.partygoers[i].username === username) {
        return party
      }
    }
    const updatedParty = await this.partyModel
      .findByIdAndUpdate(
        partyId,
        {
          $push: { partygoers: partyMember },
        },
        { new: true },
      )
      .exec()
    return updatedParty
  }

  public async deleteUserFromParty(
    partyId: string,
    username: string,
    password: string,
  ) {
    const party = await this.getPartyById(partyId)
    const isHost = party.partygoers.find(dude => dude.username === username)
      .host
    if (!(await this.checkPassword(password, party.password)) || isHost) {
      return null
    }
    const updatedParty = await this.partyModel
      .findByIdAndUpdate(
        partyId,
        {
          $pull: { partygoers: { username: username } },
        },
        { new: true },
      )
      .exec()
    return updatedParty
  }

  public async getPartyById(partyId: String): Promise<Party> {
    const party = await this.partyModel.find({ _id: partyId }).exec()
    return party[0]
  }

  public async partyTime(partyId: string, password: string) {
    let party = await this.getPartyById(partyId)
    if (!(await this.checkPassword(password, party.password))) {
      return null
    }
    let host
    for (let i = 0; i < party.partygoers.length; i++) {
      const member = party.partygoers[i]
      if (member.host) {
        host = member
        break
      }
    }
    const playlistId = await this.createPartyPlaylist(party, host)
    let tracks = await this.getPartyTracks(partyId)
    let trackUris = []
    let dbTracks = []
    const metrics = await this.getTrackAnalysis(tracks, partyId)
    const artistsWithInfo = await this.getArtistInfo(tracks, partyId)
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i]
      const metric = metrics[i]
      const artist = artistsWithInfo[i]
      trackUris.push(track.uri as String)
      if (track.uri !== metric.uri) {
        return "uris of track and metric didnt match"
      }
      if (track.artists[0].id !== artist.id) {
        return "artist ids dont match"
      }

      dbTracks.push({
        id: track.id,
        uri: track.uri,
        name: track.name,
        popularity: track.popularity,
        album: {
          name: track.album.name,
          releaseDate: track.album.release_date,
          id: track.album.id,
          uri: track.album.uri,
        },
        artist: {
          name: artist.name,
          id: artist.id,
          uri: artist.uri,
          genre: artist.genres,
          popularity: artist.popularity,
        },
        acousticness: metric.acousticness,
        danceability: metric.danceability,
        energy: metric.energy,
        instrumentalness: metric.instrumentalness,
        liveness: metric.liveness,
        loudness: metric.loudness,
        speechiness: metric.speechiness,
        tempo: metric.tempo,
        valence: metric.valence,
        duration_ms: metric.duration_ms,
        key: metric.key,
        mode: metric.mode,
        time_signature: metric.time_signature,
      })
    }
    const updatedParty = await this.partyModel
      .findByIdAndUpdate(partyId, {
        tracks: dbTracks,
      })
      .exec()
    const partyTracks = await this.getSuggestedTracks(dbTracks, host)
    const res = await this.addTracksToPlaylist(
      playlistId,
      partyTracks.map(track => track.uri),
      host,
    )
    return res
  }

  public async getSuggestedTracks(tracks, host) {
    let url = "https://api.spotify.com/v1/recommendations?"
    const limit = 50
    const lowerQuantile = 0.25
    const upperQuantile = 0.75
    const median = 0.5
    url += `limit=${limit}`

    const acousticValues = tracks.map(track => track.acousticness)
    const minAcousticness = quantile(acousticValues, lowerQuantile)
    const maxAcousticness = quantile(acousticValues, upperQuantile)
    const targetAcousticness = quantile(acousticValues, median)
    url += `&min_acousticness=${minAcousticness}&max_acousticness=${maxAcousticness}&target_acousticness=${targetAcousticness}`

    const danceabilityValues = tracks.map(track => track.danceability)
    const minDanceability = quantile(danceabilityValues, lowerQuantile)
    const maxDanceability = quantile(danceabilityValues, upperQuantile)
    const targetDanceability = quantile(danceabilityValues, median)
    url += `&min_danceability=${minDanceability}&max_danceability=${maxDanceability}&target_danceability=${targetDanceability}`

    const energyValues = tracks.map(track => track.energy)
    const minEnergy = quantile(energyValues, lowerQuantile)
    const maxEnergy = quantile(energyValues, upperQuantile)
    const targetEnergy = quantile(energyValues, median)
    url += `&min_energy=${minEnergy}&max_energy=${maxEnergy}&target_energy=${targetEnergy}`

    const instrumentalnessValues = tracks.map(track => track.instrumentalness)
    const minInstrumentalness = quantile(instrumentalnessValues, lowerQuantile)
    const maxInstrumentalness = quantile(instrumentalnessValues, upperQuantile)
    const targetInstrumentalness = quantile(instrumentalnessValues, median)
    url += `&min_instrumentalness=${minInstrumentalness}&max_instrumentalness=${maxInstrumentalness}&target_instrumentalness=${targetInstrumentalness}`

    // const livenessValues = tracks.map(track => track.liveness)
    // const minLiveness = quantile(livenessValues, upperQuantile)
    // const maxLiveness = quantile(livenessValues, upperQuantile)
    // const targetLiveness = quantile(livenessValues, median)
    // url += `&min_liveness=${minLiveness}&max_liveness=${maxLiveness}&target_liveness=${targetLiveness}`

    // const loudnessValues = tracks.map(track => track.loudness)
    // const minLoudness = quantile(loudnessValues, lowerQuantile)
    // const maxLoudness = quantile(loudnessValues, upperQuantile)
    // const targetLoudness = quantile(loudnessValues, median)
    // url += `&min_loudness=${minLoudness}&max_loudness=${maxLoudness}&target_loudness=${targetLoudness}`

    // const speechinessValues = tracks.map(track => track.speechiness)
    // const minSpeechiness = quantile(speechinessValues, lowerQuantile)
    // const maxSpeechiness = quantile(speechinessValues, upperQuantile)
    // const targetSpeechiness = quantile(speechinessValues, median)
    // url += `&min_speechiness=${minSpeechiness}&max_speechiness=${maxSpeechiness}&target_speechiness=${targetSpeechiness}`

    // const tempoValues = tracks.map(track => track.tempo)
    // const minTempo = quantile(tempoValues, lowerQuantile)
    // const maxTempo = quantile(tempoValues, upperQuantile)
    // const targetTempo = quantile(tempoValues, median)
    // url += `&min_tempo=${minTempo}&max_tempo=${maxTempo}&target_tempo=${targetTempo}`

    const valenceValues = tracks.map(track => track.valence)
    const minValence = quantile(valenceValues, lowerQuantile)
    const maxValence = quantile(valenceValues, upperQuantile)
    const targetValence = quantile(valenceValues, median)
    url += `&min_valence=${minValence}&max_valence=${maxValence}&target_valence=${targetValence}`

    // max 5 seeds
    url += "&seed_artists="
    const interval = Math.ceil(tracks.length / 5)
    for (let i = 0; i < tracks.length; i++) {
      const index = i * interval
      console.log(index)
      if (index < tracks.length) {
        url += tracks[index].artist.id
        console.log(tracks[index].artist.id)
        url += i < 4 ? "," : ""
      } else {
        break
      }
    }

    const { data } = await this.httpService
      .get(url, {
        headers: { Authorization: `Bearer ${host.token}` },
      })
      .toPromise()
    console.log(url)
    console.log("track length: " + data.tracks.length)
    return data.tracks
  }

  public async getArtistInfo(tracks, partyId: string) {
    let party = await this.getPartyById(partyId)
    let artists = []
    for (let i = 0; i < tracks.length; i += 50) {
      let url = "https://api.spotify.com/v1/artists?ids="
      const partialTracks = tracks.slice(i, i + 50)
      for (let j = 0; j < partialTracks.length; j++) {
        url += partialTracks[j].artists[0].id
        if (j < partialTracks.length - 1) {
          url += ","
        }
      }
      const artistResponse = await this.httpService
        .get(url, {
          headers: {
            Authorization: `Bearer ${
              party.partygoers.find(dude => dude.host === true).token
            }`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .toPromise()
      artists = [...artists, ...artistResponse.data.artists]
    }
    return artists
  }

  public async addTracksToPlaylist(playlistId: string, trackUris, host) {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`
    // Empty playlist
    await this.httpService
      .put(
        url,
        { uris: [] },
        {
          headers: {
            Authorization: `Bearer ${host.token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      )
      .toPromise()
    // 100 tracks is max per request, divide it
    for (let i = 0; i < trackUris.length; i += 100) {
      const partialTrackUris = trackUris.slice(i, i + 100)
      const body = {
        uris: partialTrackUris,
      }
      await this.httpService
        .post(url, body, {
          headers: {
            Authorization: `Bearer ${host.token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .toPromise()
    }
    return true
  }

  public async createPartyPlaylist(party: Party, host: any) {
    // get playlist with party.name
    // if exists, return id
    // else create new
    const playlistRequest = await this.httpService
      .get("https://api.spotify.com/v1/me/playlists", {
        headers: {
          Authorization: `Bearer ${host.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .toPromise()
    const existingPlaylists = playlistRequest.data.items
    for (let i = 0; i < existingPlaylists.length; i++) {
      const playlist = existingPlaylists[i]
      if (playlist.name === `${party.name} - Music Mash`) {
        console.log("playlist already exists, returning id")
        return playlist.id
      }
    }
    // This is only executed if no playlist with the name exists
    const url = `https://api.spotify.com/v1/users/${host.username}/playlists`
    const body = {
      name: `${party.name} - Music Mash`,
      description: "Created via Music Mash",
    }
    const res = await this.httpService
      .post(url, body, {
        headers: {
          Authorization: `Bearer ${host.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .toPromise()
    const playlistId = res.data.id
    return playlistId
  }

  public async getPartyTracks(partyId: string) {
    let party = await this.getPartyById(partyId)
    let topTracks = []
    for (let i = 0; i < party.partygoers.length; i++) {
      const member = party.partygoers[i]
      const userTracks = await this.getUserTracks(member.token)
      topTracks = [...topTracks, ...userTracks]
    }
    return topTracks
  }

  private async getUserTracks(userToken: string) {
    const url = "https://api.spotify.com/v1/me/top/tracks?limit=50"
    const res = await this.httpService
      .get(url, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
      .toPromise()
    return res.data["items"]
  }

  public async getTrackAnalysis(tracks: any[], partyId: string) {
    let party = await this.getPartyById(partyId)
    let analyzedTracks = []
    // max 100 tracks per call
    for (let i = 0; i < tracks.length; i += 100) {
      const partialTracks = tracks.slice(i, i + 100)
      let url = `https://api.spotify.com/v1/audio-features?ids=`
      for (let j = 0; j < partialTracks.length; j++) {
        url += partialTracks[j].id
        if (j < partialTracks.length - 1) {
          url += ","
        }
      }
      const res = await this.httpService
        .get(url, {
          headers: {
            Authorization: `Bearer ${
              party.partygoers.find(dude => dude.host === true).token
            }`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .toPromise()
      analyzedTracks = [...analyzedTracks, ...res.data.audio_features]
    }
    return analyzedTracks
  }

  public async hashPassword(clearPassword: string): Promise<string> {
    return await bcrypt.hash(clearPassword, 10)
  }

  public async checkPassword(
    clearPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(clearPassword, hashedPassword)
  }
}

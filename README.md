# MusicMash

## Idee

MusicMash ist eine Website die für Anlässe wie z.B. Parties Spotify Playlisten erstellt.
Hierbei werden von Party-Teilnehmern, die sich bei der Website anmelden, die Top Tracks
benutzt, um eine Playlist zu erstellen, die allen Teilnehmern gefällt.

## Tech Ablauf

Eine neue Party Session wird erstellt mit Host der sich anmeldet ==> SessionId wird angelegt und gespeichert, Token wird gespeichert
Host Auth erst möglich wenn Partyname vorhanden ist
Als URL Parameter in die Redirect URL mitgeben: Partyname und Host=true

Redirect zur App
Instant Loading Screen
OnInit URL Parameter holen und createParty(partyName, hostToken)

Teilnehmer hinzufügen
Weiterleitung zum Consent Screen
Diesmal Party Id in die Redirect URL

Einloggen

Zurück zur Website mit SessionId und Token
Party Info herstellen mit Party Id
User mit Token der Party im Backend hinzufügen

Möglichkeit weitere Teilnehmer hinzuzufügen

Button mit "Los gehts"

Bei Los werden alle Tokens der Party benutzt um Top Tracks zu ziehen
Mit Top Tracks fette Analyse starten
Top X Tracks nehmen und Playlist in Host Account anlegen

## DB

MongoDB

parties collection:
````json
{
    id: "123",
    name: "Halloween 2019",
    partygoers: [
        {
            username: "patr1ckvg",
            token: "123ABC",
            host: true
        }
    ]
}
````

## Backend

createParty:
generate id
create db object with id, party name, host token
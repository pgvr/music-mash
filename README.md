# MusicMash

## Idea

The party host creates a session and invites all guests to join with their spotify accounts. Using the top 50 tracks of each guest a genre as well as a track metric (danceability, accousticness, ...) analysis is done to find a playlist that fits something for every guest. The playlist is then created in the host's spotify account.

Live at: https://music-mash.netlify.com/

## Monorepo

### Frontend

The frontend was built using Angular and the Nebular library. The frontend is automatically deployed from git to netlify.

### Backend

The backend was built using NestJs and Mongoose to connect to a Mondodb.
Another backend is running python's flask server to some in depth data analysis using Pandas.
Both backends are automatically deployed from git to heroku.

## Testing in the field

So far I have gotten mixed results. If the taste of music is diverse amongst guests the resulting playlist tends to settle for something generic like pop with a few reaches in the individual genres. When a group is mostly homogenous in musical taste the playlist accurately describes the preferences and can lead to some cool discoveries since the /recommendations endpoint of the spotify api can suggest songs that no participant has necessarily listened to.

## Data Analysis

The spotify api provides detailed metrics for each track available. Some of these metrics are "danceability", "accousticness", "instrumentalness", "power" and few more. Each value is between 0 and 1. When querying the /recommend endpoint all these metrics can be included with a min_, max_ and target_ value. Before sending the request all tracks are analyzed and for each metric the lower quartile is used for the min value, the upper quartile is used for the max value and the median is used for the target value. This should remove outliers and result in a good representation of the groups desired metrics. The /recommend endpoint also needs up to 5 seed_tracks, seed_artists or seed_genres. Since picking 5 tracks or artists would not result in a good representation of the group I decided to use the seed_genres which led to another problem.

For the seed_genres only about 100 genres are allowed, but spotify annotates their tracks with over 3000 different genres. To pick out the 5 most represented genres of the group I downloaded all available genres and matched all available seed_genres against the 3000 others. This is basically a map which gives the closest possible seed_genre for a given genre. To achieve this the Levenshtein is used to match the genres based purely on text similarity. After sorting out some genres manually, e.g. classic rock was matched to classical, the genre map seems functional but not perfect.

The genres of each track are then looked up in the map and the resulting seed_genres are summed up to find the top 5.

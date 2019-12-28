import pymongo
import pandas as pd
from pandas.io.json import json_normalize
from sklearn import preprocessing
import numpy as np
from seed_genres import seed_genres
from spotify_genres import available_genres
from seed_correction import check_seed
import json
import re
connection = pymongo.MongoClient("mongodb+srv://pgvr:dwntmVliTApvmjJK@cluster0-55ryy.mongodb.net/music-mash?retryWrites=true&w=majority")
    
db = connection["music-mash"]
parties = db["parties"]

def flatten_tracks(tracks_df):
    artist_tags = tracks_df['artist'].apply(pd.Series)
    artist_tags = artist_tags.rename(columns = {"artist": "artist_genre", "name": "artist_name", "id": "artist_id", "uri": "artist_uri", "popularity": "artist_popularity"})

    album_tags = tracks_df['album'].apply(pd.Series)
    album_tags = album_tags.rename(columns = {"name": "album_name", "releaseDate": "album_release_date", "id": "album_id", "uri": "album_uri"})

    tracks_df = pd.concat([tracks_df[:], artist_tags[:], album_tags[:]], axis=1)
    tracks_df = tracks_df.drop(columns=["artist", "album"])
    return tracks_df

def get_tracks(partyname):
    cursor = parties.find({"name": partyname})
    tracks = list(cursor)[0]["tracks"]
    tracks_df = flatten_tracks(pd.DataFrame(tracks))
    
    #cursor = parties.find({"name": partyname})
    #suggested_tracks = list(cursor)[0]["suggestedTracks"]
    #suggested_tracks_df = flatten_tracks(pd.DataFrame(suggested_tracks))
    #return tracks_df, suggested_tracks_df
    return tracks_df

def levenshtein(seq1, seq2):
    size_x = len(seq1) + 1
    size_y = len(seq2) + 1
    matrix = np.zeros ((size_x, size_y))
    for x in range(size_x):
        matrix [x, 0] = x
    for y in range(size_y):
        matrix [0, y] = y

    for x in range(1, size_x):
        for y in range(1, size_y):
            if seq1[x-1] == seq2[y-1]:
                matrix [x,y] = min(
                    matrix[x-1, y] + 1,
                    matrix[x-1, y-1],
                    matrix[x, y-1] + 1
                )
            else:
                matrix [x,y] = min(
                    matrix[x-1,y] + 1,
                    matrix[x-1,y-1] + 1,
                    matrix[x,y-1] + 1
                )
    return (matrix[size_x - 1, size_y - 1])

def find_distances(tracks_df, seeds):
    genre_list = []
    for i in tracks_df["genre"]:
        if len(i) > 0:
            genre_list.append(i[0])
            if len(i) > 1:
                genre_list.append(i[1])
        # for j in i:
        #     genre_list.append(j)
    print(str(len(genre_list)))
    min_distances = []    
    for genre in genre_list:
        min_value = 9999
        assigned_seed = ""
        for seed in seeds:
            distance = levenshtein(genre, seed)        
            if distance < min_value:
                min_value = distance
                assigned_seed = seed
        min_distances.append([min_value, assigned_seed])
    return min_distances

def rank_genres(tracks_df):
    min_distances = find_distances(tracks_df, seed_genres)
    genre_df = pd.DataFrame(min_distances, columns =['distance', 'genre'])
    aggregated_genres = genre_df.groupby(["genre"]).mean()
    aggregated_genres["count"] = genre_df["genre"].value_counts()

    # normalize
    x = aggregated_genres[['distance']].values.astype(float)
    min_max_scaler = preprocessing.MinMaxScaler()
    x_scaled = min_max_scaler.fit_transform(x)
    aggregated_genres["distance normalized"] = x_scaled

    # weight
    aggregated_genres["weighted count"] = aggregated_genres.apply(lambda x: (1 - x["distance normalized"]) * x["count"], axis=1)

    aggregated_genres = aggregated_genres.sort_values(["weighted count"], ascending=False)
    return aggregated_genres

def justCount(tracks_df):
    with open('genreMap.json', 'r') as f:
        genre_dict = json.load(f)
    genre_list = []
    for track in tracks_df["genre"]:
        for genre in track:
            for index in range(len(genre_dict)):
                if genre == genre_dict[index]["genre"]:
                    genre_list.append([genre_dict[index]["seed"], (1/len(track))])
                    break
    genre_df = pd.DataFrame(genre_list, columns =['genre', 'count'])
    genre_df = genre_df.groupby(["genre"]).sum()

    genre_df = genre_df.sort_values(["count"], ascending=False)
    print(genre_df)
    return genre_df

def main(partyname):
    tracks = get_tracks(partyname)
    genres = justCount(tracks)
    genres['genre'] = genres.index
    genres['zipped'] = list(zip(genres["genre"], genres["count"]))
    print(genres["zipped"].tolist())
    return genres["zipped"].tolist()
    # genres = rank_genres(tracks)
    # genres['genre'] = genres.index
    # genres['zipped'] = list(zip(genres["genre"], genres["weighted count"]))
    # return genres["zipped"].tolist()

def testJson():
    with open('genreMap.json', 'r') as f:
        genre_dict = json.load(f)
    for index in range(len(genre_dict)):
        print(index)
        break


def create_genre_map():
    # map all available genres to the closest seed genre
    genre_map = []
    for genre in available_genres:
        min_distance = 9999
        assigned_seed = "" 
        for seed_genre in seed_genres:
            distance = levenshtein(genre, seed_genre)        
            if distance < min_distance:
                min_distance = distance
                assigned_seed = seed_genre
        assigned_seed = check_seed(genre, assigned_seed)
        genre_map.append({"genre": genre, "seed": assigned_seed})
    print(genre_map)
    with open('genreMap.json', 'w', encoding='utf-8') as f:
        json.dump(genre_map, f, ensure_ascii=False, indent=4)
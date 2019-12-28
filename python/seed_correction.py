import re
def check_seed(genre, assigned_seed):
    mislabeledPop = re.search("classic\s[a-z]+\spop", genre)
    mislabeledRock = re.search("classic\s[a-z]+\srock", genre)
    mislabeledCountry = re.search("classic\s[a-z]+\scountry", genre)
    # from looking at the results "classical finnish rock" gets assigned to classical etc
    # fix it with regex
    if mislabeledPop:
        return "pop"
    elif mislabeledRock:
        return "rock"
    elif mislabeledCountry:
        return "country"
    elif genre == "mellow gold":
        return "pop"
    elif genre == "adult standards":
        return "rock"
    elif genre == "classic rock":
        return "rock"
    elif genre == "r&b":
        return "soul"
    elif genre == "uk pop":
        return "pop"
    elif genre == "australian pop":
        return "pop"
    elif genre == "gangster rap":
        return "hip-hop"
    elif genre == "mexican pop":
        return "pop"
    elif genre == "funk carioca":
        return "funk"
    elif genre == "pop urbaine":
        return "pop"
    elif genre == "motown":
        return "power-pop"
    elif genre == "colombian pop":
        return "pop"
    elif genre == "metropolis":
        return "pop"
    elif genre == "indie anthem-folk":
        return "folk"
    elif genre == "classic soul":
        return "soul"
    elif genre == "malaysian tamil pop":
        return "pop"
    elif genre == "contemporary vocal jazz":
        return "jazz"
    elif genre == "neo classical metal":
        return "metal"
    elif genre == "classic girl group":
        return "pop"
    elif genre == "classic schlager":
        return "german"
    elif genre == "classic mandopop":
        return "mandopop"
    elif genre == "classic cantopop":
        return "cantopop"
    elif genre == "cosmic american":
        return "pop"
    elif genre == "icelandic indie":
        return "indie"
    elif genre ==  "ska revival":
        return "ska"
    elif genre == "brass band":
        return "jazz"
    elif genre == "icelandic folk":
        "folk"
    elif genre == "cha-cha-cha":
        return "salsa"
    elif genre == "college a cappella":
        return "pop"
    elif genre == "classic j-rock":
        return "rock"
    elif genre == "gothic americana":
        return "goth"
    elif genre == "classical guitar":
        return "guitar"
    elif genre == "icelandic jazz":
        return "jazz"
    elif genre == "deep classic garage rock":
        return "rock"
    elif genre == "central asian folk":
        return "folk"
    elif genre == "classic bollywood":
        return "indian"
    elif genre == "nigerian pop":
        return "pop"
    elif genre == "classical guitar quartet":
        return "guitar"
    elif genre == "classical guitar duo":
        return "guitar"
    elif genre == "military rap":
        return "hip-hop"
    else:
        return assigned_seed
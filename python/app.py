# app.py
from flask import Flask, request, jsonify
app = Flask(__name__)
import get_top_genres

@app.route('/getTopGenres', methods=['GET'])
def post_something():
    if request.method == 'GET':
        content = request.get_json(silent=True)
        partyname = content["partyname"]
        # You can add the test cases you made in the previous function, but in our case here you are just testing the POST functionality
        if partyname:
            genres = get_top_genres.main(partyname)
            return jsonify({
                "genres": genres
            })
        else:
            return jsonify({
                "ERROR": "Something went wrong while getting top genres"
            })
    else:
        return jsonify({
            "ERROR": "Method is wrong"
        })

if __name__ == '__main__':
    # Threaded option to enable multiple instances for multiple user access support
    app.run(threaded=True, port=5000)
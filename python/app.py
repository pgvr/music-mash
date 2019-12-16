# app.py
from flask import Flask, request, jsonify
app = Flask(__name__)
import get_top_genres

@app.route('/getTopGenres/', methods=['POST'])
def post_something():
    param = request.form.get('partyname')
    print(param)
    # You can add the test cases you made in the previous function, but in our case here you are just testing the POST functionality
    if param:
        genres = get_top_genres.main(param)
        return jsonify({
            "genres": genres
        })
    else:
        return jsonify({
            "ERROR": "Something went wrong while getting top genres"
        })

if __name__ == '__main__':
    # Threaded option to enable multiple instances for multiple user access support
    app.run()
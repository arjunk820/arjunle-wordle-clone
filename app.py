from flask import Flask, render_template, request, jsonify, session
import random

app = Flask(__name__)
app.secret_key = "your_secret_key_here"

# List of possible 5-letter words for the game
WORDS = ["take", "give", "hear", "boot", "kiwi"]

@app.route('/')
def index():
    # Render the menu page
    return render_template('index.html')

@app.route('/game')
def game():
    # Start a new game session if one isn’t already in progress
    if 'word' not in session:
        session['word'] = random.choice(WORDS)
        session['attempts'] = 0
    return render_template('game.html')

@app.route('/guess', methods=['POST'])
def guess():
    data = request.get_json()
    guess_word = data.get('guess', '').lower()
    target_word = session.get('word')
    
    if not guess_word or len(guess_word) != 4:
        return jsonify({"Error": "Guess must be a 4-letter word."}), 400

    session['attempts'] += 1

    # Evaluate the guess letter-by-letter
    result = []
    for i, letter in enumerate(guess_word):
        if target_word[i] == letter:
            result.append("correct")
        elif letter in target_word:
            result.append("present")
        else:
            result.append("absent")

    game_over = guess_word == target_word or session['attempts'] >= 6

    return jsonify({
        "result": result,
        "game_over": game_over,
        "target_word": target_word if game_over else None
    })

if __name__ == '__main__':
    app.run(debug=True)

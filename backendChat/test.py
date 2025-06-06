from flask import Flask, request, jsonify
from flask_cors import CORS
import spacy
from openai import OpenAI
client = OpenAI(
  api_key=""
)
app = Flask(__name__)

CORS(app)

nlp = spacy.load("ko_core_news_sm")

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    text = data.get("text", "")

    # spaCy 처리
    doc = nlp(text)
    spacy_result = [{"token": token.text, "pos": token.pos_} for token in doc]

    if "카드" in text:
        return jsonify({
            "spacy_result": spacy_result,
            "gpt_response": ""
        })

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": text}]
    )
    response_text = response.choices[0].message.content

    return jsonify({
        "spacy_result": [],
        "gpt_response": response_text
    })

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5002)

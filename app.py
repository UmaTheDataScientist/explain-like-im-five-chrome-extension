from flask import Flask, request, jsonify
from openai import OpenAI
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
api_key = "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" 

@app.route('/explain', methods=['POST'])
def explain():
    data = request.json
    text = data.get("text")
    prompt_type = data.get("prompt_type", "explain_like_five")
    hint = data.get("hint")

    if not text:
        return jsonify({"error": "No text provided"}), 400

    prompt_map = {
        "summarize": "Summarize the following text in bullet points:",
        "explain_like_five": "Explain this like I'm five:"
    }

    prompt = prompt_map.get(prompt_type, "Explain this like I'm five:")
    if hint:
        prompt += f" (Context: {hint})"

    client = OpenAI(api_key=api_key)
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": f"{prompt} {text}"}
        ]
    )

    explanation = completion.choices[0].message.content
    return jsonify({"explanation": explanation})

@app.route('/')
def home():
    return "Welcome to the Explain Like I'm Five API!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

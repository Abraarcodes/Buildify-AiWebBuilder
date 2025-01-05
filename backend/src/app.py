from flask import Flask, request, jsonify
from transformers import LlamaForCausalLM, LlamaTokenizer
import torch

app = Flask(__name__)

# Load model and tokenizer
model_name = "path_to_llama_model"  # Replace with actual model path
tokenizer = LlamaTokenizer.from_pretrained(model_name)
model = LlamaForCausalLM.from_pretrained(model_name)

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    prompt = data.get("prompt", "")
    
    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(**inputs, max_length=150)
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(port=5000)

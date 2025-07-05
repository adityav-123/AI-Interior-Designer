from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import torch
from diffusers import StableDiffusionDepth2ImgPipeline
from PIL import Image
import os
import time # <-- IMPORT THE STANDARD TIME LIBRARY

# --- Initialization ---
app = Flask(__name__)
CORS(app)

# Create a directory to store generated images if it doesn't exist
if not os.path.exists('static'):
    os.makedirs('static')
app.config['STATIC_FOLDER'] = 'static'


# --- Load the AI Model ---
print("Loading Stable Diffusion model... This may take a few minutes.")
pipe = StableDiffusionDepth2ImgPipeline.from_pretrained(
    "stabilityai/stable-diffusion-2-depth",
    torch_dtype=torch.float16,
).to("cuda" if torch.cuda.is_available() else "cpu")
print("✅ Model loaded successfully.")


# --- API Endpoint for Image Generation ---
@app.route('/api/generate', methods=['POST'])
def generate_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    
    image_file = request.files['image']
    prompt = request.form.get('prompt', 'a beautiful interior design')
    
    print(f"✅ Received request with prompt: '{prompt}'")

    try:
        init_image = Image.open(image_file.stream).convert("RGB")
        print("✅ Input image processed successfully.")
    except Exception as e:
        return jsonify({'error': f'Invalid image file: {e}'}), 400

    print("🧠 Generating new image with AI... This can be slow.")
    try:
        generated_images = pipe(prompt=prompt, image=init_image, strength=0.7).images
        generated_image = generated_images[0]
        
        # FIX: Use the standard time library, not torch
        timestamp = int(time.time()) 
        output_filename = f'output_{timestamp}.png'
        output_path = os.path.join(app.config['STATIC_FOLDER'], output_filename)
        generated_image.save(output_path)
        print(f"✅ Image saved to {output_path}")

        image_url = request.host_url + 'static/' + output_filename
        
        return jsonify({'imageUrl': image_url})

    except Exception as e:
        print(f"❌ An error occurred during image generation: {e}")
        return jsonify({'error': 'Failed to generate image due to a server error.'}), 500

# --- Static File Server ---
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.config['STATIC_FOLDER'], filename)


# --- Main execution block ---
if __name__ == '__main__':
    app.run(debug=True, port=5000)


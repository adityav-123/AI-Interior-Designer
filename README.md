# 🛋️ AI Interior Designer

A full-stack generative AI app where users upload a photo of their room and get a brand new interior design based on a text prompt. Uses a depth-aware Stable Diffusion model to retain layout while applying new styles.

---

## 🚀 Project Overview

This application demonstrates an end-to-end generative AI product:

* Upload an image of any room
* Describe a style (e.g., "A modern, minimalist bedroom with dark wood furniture")
* Get a new, AI-generated room redesign

Built with a separate frontend and backend to showcase full-stack capabilities.

---

## 🛠️ Tech Stack

* **Frontend**: React.js, Tailwind CSS
* **Backend**: Python, Flask
* **Generative AI**:

  * HuggingFace `diffusers`
  * Stable Diffusion 2 (Depth-to-Image)
  * PyTorch
* **Tools**: Git, GitHub, VS Code, Docker (optional deployment)

---

## 📂 Project Structure

```bash
ai-interior-designer/
├── frontend/          # React app
│   ├── src/
│   │   ├── App.js
│   │   └── index.css
│   ├── public/
│   └── package.json
│
├── backend/           # Flask server + AI logic
│   ├── server.py
│   └── static/        # Auto-generated output images
│
└── README.md          # This file
```

---

## ⚙️ How to Run

This app runs two servers: backend (Flask) and frontend (React).

### 1. Clone the Repository

```bash
git clone https://github.com/adityav-123/AI-Interior-Designer.git
cd AI-Interior-Designer
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
pip install Flask Flask-Cors diffusers transformers accelerate Pillow opencv-python

# Start the server
python server.py
```

> 🕒 Note: First run downloads the Stable Diffusion model (a few GBs).

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

App opens at: `http://localhost:3000`

---

## 🌊 Workflow: How It Works

### 1. User Uploads Image & Prompt (Frontend)

* React UI takes user input

### 2. API Request

* Frontend sends a POST request to `/api/generate` with image and prompt

### 3. AI Generation (Backend)

* Flask receives the request
* Loads `stabilityai/stable-diffusion-2-depth`
* Extracts a **depth map** to understand room geometry
* Generates a new image guided by the depth map and prompt

### 4. Result Sent Back

* New image saved to `backend/static`
* URL returned to frontend
* React displays the result

---

## 🔮 Future Improvements

### 🧠 ControlNet Integration

* Add support for Canny edges, segmentation masks, etc.

### 🐳 Dockerization

* Create Dockerfiles for frontend and backend

### ☁️ Cloud Deployment

* Host on GPU-enabled services (AWS, GCP, Hugging Face)

---

import React from 'react';

// --- Helper Components ---

const UploadIcon = () => (
  <svg className="w-12 h-12 mx-auto text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LoadingSpinner = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 rounded-lg">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-violet-500"></div>
  </div>
);

// --- Main App Component ---

export default function App() {
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [previewUrl, setPreviewUrl] = React.useState('');
  const [prompt, setPrompt] = React.useState('');
  const [outputImage, setOutputImage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setOutputImage('');
      setError('');
    } else {
      setError('Please select a valid image file.');
    }
  };

  const handleGenerate = async () => {
    if (!selectedImage || !prompt) {
      setError('Please upload an image and enter a prompt.');
      return;
    }
    setIsLoading(true);
    setOutputImage('');
    setError('');

    // --- NEW: API Call Logic ---
    const formData = new FormData();
    formData.append('image', selectedImage);
    formData.append('prompt', prompt);

    try {
      // Send the data to your Flask backend
      const response = await fetch('http://127.0.0.1:5000/api/generate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      // Set the output image from the backend's response
      setOutputImage(data.imageUrl);

    } catch (err) {
      setError('Failed to generate image. Please ensure the backend server is running.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-5xl glass-card p-8 md:p-12 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-fuchsia-500 to-violet-500 text-transparent bg-clip-text">
            AI Interior Designer
          </h1>
          <p className="text-slate-400 text-lg">Transform your room with the power of AI.</p>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Side: Input */}
          <div className="space-y-6 flex flex-col">
            <div className="flex-grow flex flex-col space-y-4">
              <label className="font-bold text-white text-xl">1. Upload Your Room</label>
              <div className="flex-grow flex items-center justify-center p-6 border-2 border-slate-700 border-dashed rounded-lg cursor-pointer hover:border-violet-500 transition-colors bg-slate-900/50">
                <div className="space-y-2 text-center">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="mx-auto max-h-48 w-auto rounded-lg shadow-md" />
                  ) : (
                    <UploadIcon />
                  )}
                  <div className="flex text-sm text-slate-400">
                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-violet-400 hover:text-violet-300">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-500">PNG, JPG up to 10MB</p>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="prompt" className="font-bold text-white text-xl block mb-2">2. Describe Your Style</label>
              <textarea
                id="prompt"
                name="prompt"
                rows={4}
                className="block w-full text-lg rounded-lg bg-slate-800/80 border-slate-700 text-slate-200 focus:ring-violet-500 focus:border-violet-500 placeholder:text-slate-500"
                placeholder="e.g., A cozy, rustic living room with a stone fireplace and warm lighting."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
          </div>

          {/* Right Side: Output */}
          <div className="space-y-4 flex flex-col">
            <label className="font-bold text-white text-xl">3. See the Magic</label>
            <div className="w-full aspect-square bg-slate-900/50 rounded-lg flex items-center justify-center relative overflow-hidden border border-slate-700">
              {isLoading && <LoadingSpinner />}
              {outputImage ? (
                <img src={outputImage} alt="Generated design" className="object-cover w-full h-full" />
              ) : (
                <p className="text-slate-500 text-lg">Your new room will appear here</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Generate Button and Error Message */}
        <div className="pt-4 flex flex-col items-center">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full md:w-3/4 lg:w-1/2 py-4 px-4 text-xl font-bold rounded-lg text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-500/50 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-violet-500/30"
          >
            {isLoading ? 'Generating...' : 'Generate New Design'}
          </button>
          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
        </div>

      </div>
    </div>
  );
}

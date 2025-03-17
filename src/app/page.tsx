"use client";

import { useState, useEffect } from "react";
import { Upload, Loader2, Sun, Moon, Sparkles, Image as ImageIcon } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei";

export default function Home() {
  const [images, setImages] = useState<File[]>([]);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setImages(Array.from(event.target.files));
  };

  const handleCompress = async () => {
    if (images.length === 0) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("image", images[0]);

    try {
      const response = await fetch("http://localhost:5000/compress", {
        method: "POST",
        body: formData,
      });
      
      const blob = await response.blob();
      setCompressedImage(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Compression failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`relative flex flex-col items-center p-10 min-h-screen transition-all overflow-hidden ${darkMode ? "bg-gray-900 text-white" : "bg-black text-white"}`}>
      <button onClick={() => setDarkMode(!darkMode)} className="absolute top-5 right-5 p-2 rounded-full bg-white shadow-lg hover:scale-110 transition-all">
        {darkMode ? <Sun className="text-yellow-500" /> : <Moon className="text-gray-800" />}
      </button>

      {/* 3D Background with Floating Particles */}
      <Canvas className="absolute inset-0 z-0">
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2.5} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 5, 2]} intensity={1.5} />
        <Sphere args={[1, 100, 200]} scale={3.2}>
          <MeshDistortMaterial color="#00ffea" attach="material" distort={0.7} speed={3} />
        </Sphere>
      </Canvas>

      <div className="relative z-10 w-full max-w-2xl p-5 text-center border border-gray-300 rounded-lg shadow-xl bg-white/30 backdrop-blur-lg">
        <h2 className="text-4xl font-extrabold mb-4 flex items-center justify-center gap-2 animate-glow">
          <Sparkles className="text-blue-400 animate-pulse" /> AI-Powered Image Compression <Sparkles className="text-blue-400 animate-pulse" />
        </h2>
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          id="upload"
          onChange={handleFileUpload}
        />
        <label
          htmlFor="upload"
          className="flex flex-col items-center justify-center border-2 border-dashed p-6 cursor-pointer rounded-lg hover:bg-white/50 transition-all hover:shadow-2xl animate-glow">
          <Upload className="w-16 h-16 mb-2 text-blue-500 animate-bounce" />
          <span className="text-lg font-semibold">Click to upload or drag & drop</span>
        </label>
      </div>

      <div className="mt-6 w-full max-w-2xl relative z-10">
        {images.length > 0 && (
          <div className="p-4 border border-gray-200 rounded-lg shadow-lg bg-white/30 backdrop-blur-lg">
            <h3 className="text-2xl font-bold mb-2">Selected Images</h3>
            <div className="grid grid-cols-3 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="p-2 text-center border rounded-lg transform transition-transform hover:scale-105">
                  <img
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="w-full h-24 object-cover rounded shadow-md hover:rotate-2 transition-transform"
                  />
                  <p className="text-sm mt-2 font-semibold text-gray-600">{img.name}</p>
                </div>
              ))}
            </div>
            <button
              className="mt-4 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-all shadow-md flex items-center justify-center hover:scale-105 animate-pulse"
              onClick={handleCompress}
              disabled={loading}
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "🚀 AI Compress & Enhance 🚀"}
            </button>
          </div>
        )}
        {compressedImage && (
          <div className="p-4 mt-4 text-center border border-gray-200 rounded-lg shadow-lg bg-white/30 backdrop-blur-lg">
            <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">🌌 Enhanced & Compressed 🌌</h3>
            <img
              src={compressedImage}
              alt="Compressed Preview"
              className="w-full h-48 object-cover rounded shadow-lg transform transition-transform hover:scale-110 hover:rotate-2"
            />
            <a href={compressedImage} download="compressed.jpg">
              <button className="mt-4 bg-gradient-to-r from-green-400 to-green-600 text-white p-3 rounded-lg hover:bg-green-600 transition-all shadow-md hover:scale-105 animate-glow">
                📥 Download Now
              </button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState } from "react";
import axios from "../axiosConfig";
import NavBar from "../components/auth/nav";

const TestUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    const formData = new FormData();
    formData.append("testImage", file);

    try {
      console.log("Uploading file:", file.name, "Size:", file.size, "Type:", file.type);
      
      // First check authentication
      try {
        const authCheck = await axios.get('/api/v2/user/check-auth');
        console.log("Auth check result:", authCheck.data);
      } catch (authErr) {
        console.log("Auth check failed:", authErr.response?.data || authErr.message);
      }
      
      // Then try the upload
      const result = await axios.post("/api/v2/product/test-upload", formData);
      console.log("Upload response:", result.data);
      setResponse(result.data);
      alert("File uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      if (err.response) {
        console.log("Error response:", err.response.data);
        setError(err.response.data.error || "Upload failed with status " + err.response.status);
      } else if (err.request) {
        setError("No response received from server. Network issue?");
      } else {
        setError("Error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Test File Upload</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Select Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          {preview && (
            <div className="mb-4">
              <p className="text-gray-700 mb-2">Preview:</p>
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full max-h-40 object-contain"
              />
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading || !file}
            className={`w-full p-2 text-white rounded ${
              loading || !file ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Uploading..." : "Upload File"}
          </button>
        </form>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            Error: {error}
          </div>
        )}
        
        {response && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold mb-2">Response:</h2>
            <pre className="bg-gray-100 p-3 rounded overflow-auto text-sm">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </>
  );
};

export default TestUpload;
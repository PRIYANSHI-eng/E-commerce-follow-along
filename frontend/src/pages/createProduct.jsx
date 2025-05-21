import { useState, useEffect } from "react";
import axios from '../axiosConfig';
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/auth/nav";

// Helper function to check authentication
const checkAuth = async () => {
  try {
    // First check if we have a token in localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("No token found in localStorage");
      return false;
    }
    
    console.log("Checking authentication status with server...");
    const response = await axios.get('/api/v2/user/check-auth');
    console.log("Auth check response:", response.data);
    return response.data.success;
  } catch (error) {
    console.error("Authentication check failed:", error);
    if (error.response) {
      console.log("Error response:", error.response.data);
      // If token is invalid, remove it
      if (error.response.status === 401) {
        localStorage.removeItem('token');
      }
    }
    return false;
  }
};

const CreateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [email, setEmail] = useState("");

  const categoriesData = [
      { title: "Electronics" },
      { title: "Fashion" },
      { title: "Books" },
      { title: "Home Appliances" },
  ];

  useEffect(() => {
      // First check if user is authenticated
      const verifyAuth = async () => {
          // Check for token in localStorage first
          const token = localStorage.getItem('token');
          if (!token) {
              console.log("No token found in localStorage");
              alert("You need to be logged in to create or edit products");
              navigate("/login"); // Redirect to login page
              return;
          }
          
          try {
              // Verify with server
              const isAuthenticated = await checkAuth();
              if (!isAuthenticated) {
                  alert("Your session has expired. Please login again.");
                  navigate("/login"); // Redirect to login page
                  return;
              }
              
              // If editing, fetch product details
              if (isEdit) {
                  try {
                      const response = await axios.get(`/api/v2/product/product/${id}`);
                      const p = response.data.product;
                      setName(p.name);
                      setDescription(p.description);
                      setCategory(p.category);
                      setTags(p.tags || "");
                      setPrice(p.price);
                      setStock(p.stock);
                      setEmail(p.email);
                      if (p.images && p.images.length > 0) {
                          setPreviewImages(
                              p.images.map((imgPath) => `http://localhost:3000${imgPath}`)
                          );
                      }
                  } catch (err) {
                      console.error("Error fetching product:", err);
                      if (err.response && err.response.status === 401) {
                          alert("Your session has expired. Please login again.");
                          navigate("/login");
                      }
                  }
              }
          } catch (err) {
              console.error("Authentication error:", err);
              alert("Authentication failed. Please login again.");
              navigate("/login");
          }
      };
      
      verifyAuth();
  }, [id, isEdit, navigate]);

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert(`File "${file.name}" is not a supported image type. Please use JPG, PNG, GIF or WebP.`);
        return false;
      }
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds the 5MB size limit.`);
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length === 0) return;
    
    console.log("Adding files:", validFiles.map(f => f.name));
    setImages((prevImages) => prevImages.concat(validFiles));
    
    const imagePreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages((prevPreviews) => prevPreviews.concat(imagePreviews));
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      
      // Check authentication before submitting
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
          alert("You need to be logged in to create or edit products");
          navigate("/login");
          return;
      }
      
      // Validate form data
      if (!name || !description || !category || !price || !stock || !email) {
          alert("Please fill in all required fields");
          return;
      }
      
      if (images.length === 0 && !isEdit) {
          alert("Please upload at least one image");
          return;
      }
      
      // Create FormData object
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("tags", tags || "");
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("email", email);

      // Log what we're sending
      console.log("Submitting product with data:", {
          name, description, category, tags, price, stock, email,
          imageCount: images.length
      });
      
      // Add images to FormData
      images.forEach((image, index) => {
          console.log(`Adding image ${index + 1}:`, image.name);
          formData.append("images", image);
      });

      try {
          if (isEdit) {
              console.log("Updating product with ID:", id);
              const response = await axios.put(`/api/v2/product/update-product/${id}`, formData);
              console.log("Update response:", response.data);
              
              if (response.status === 200) {
                  alert("Product updated successfully!");
                  navigate("/my-products");
              }
          } else {
              console.log("Creating new product");
              const response = await axios.post("/api/v2/product/create-product", formData);
              console.log("Create response:", response.data);
              
              if (response.status === 201) {
                  alert("Product created successfully!");
                  setImages([]);
                  setPreviewImages([]);
                  setName("");
                  setDescription("");
                  setCategory("");
                  setTags("");
                  setPrice("");
                  setStock("");
                  setEmail("");
              }
          }
      } catch (err) {
          console.error("Error creating/updating product:", err);
          
          if (err.response) {
              console.log("Error response:", err.response.data);
              
              if (err.response.status === 401) {
                  alert("Your session has expired. Please login again.");
                  navigate("/login");
              } else if (err.response.status === 400) {
                  // Handle validation errors
                  const errorMessage = err.response.data.errors 
                      ? "Validation errors: " + err.response.data.errors.join(", ")
                      : err.response.data.error || "Invalid data submitted";
                  alert(errorMessage);
              } else if (err.response.status === 500) {
                  alert("Server error: " + (err.response.data.details || "Unknown server error"));
              } else {
                  alert("Error: " + (err.response.data.error || "Failed to save product"));
              }
          } else {
              alert("Network error. Please check your connection and try again.");
          }
      }
  };

    return (
        <>
            <NavBar />
            <div className="w-[90%] max-w-[500px] bg-white shadow h-auto rounded-[4px] p-4 mx-auto">
                <h5 className="text-[24px] font-semibold text-center">
                    {isEdit ? "Edit Product" : "Create Product"}
                </h5>
                <form onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <label className="pb-1 block">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            className="w-full p-2 border rounded"
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div>
                        <label className="pb-1 block">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            className="w-full p-2 border rounded"
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter product name"
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label className="pb-1 block">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={description}
                            className="w-full p-2 border rounded"
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter product description"
                            rows="4"
                            required
                        ></textarea>
                    </div>
                    <div className="mt-4">
                        <label className="pb-1 block">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="w-full p-2 border rounded"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">Choose a category</option>
                            {categoriesData.map((i) => (
                                <option value={i.title} key={i.title}>
                                    {i.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-4">
                        <label className="pb-1 block">Tags</label>
                        <input
                            type="text"
                            value={tags}
                            className="w-full p-2 border rounded"
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="Enter product tags"
                        />
                    </div>
                    <div className="mt-4">
                        <label className="pb-1 block">
                            Price <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={price}
                            className="w-full p-2 border rounded"
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Enter product price"
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label className="pb-1 block">
                            Stock <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={stock}
                            className="w-full p-2 border rounded"
                            onChange={(e) => setStock(e.target.value)}
                            placeholder="Enter stock quantity"
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label className="pb-1 block">
                            {isEdit ? "Upload New Images (optional)" : "Upload Images"}{" "}
                            <span className={isEdit ? "" : "text-red-500"}>*</span>
                        </label>
                        <input
                            name="image"
                            type="file"
                            id="upload"
                            className="hidden"
                            multiple
                            onChange={handleImagesChange}
                            required={!isEdit}
                        />
                        <label htmlFor="upload" className="cursor-pointer">
                        <svg
                                 width="30"
                                 height="30"
                                 fill="none"
                                 stroke="currentColor"
                                 className="text-gray-600"
                                 viewBox="0 0 24 24"
                             >
                                 <path
                                     d="M12 4v16m8-8H4"
                                     strokeWidth="2"
                                     strokeLinecap="round"
                                     strokeLinejoin="round"
                                 />
                             </svg>
                        </label>
                        <div className="flex flex-wrap mt-2">
                            {previewImages.map((img, index) => (
                                <img
                                    src={img}
                                    key={index}
                                    alt="Preview"
                                    className="w-[100px] h-[100px] object-cover m-2"
                                />
                            ))}
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-4 bg-blue-500 text-white p-2 rounded"
                    >
                        {isEdit ? "Save Changes" : "Create"}
                    </button>
                </form>
            </div>
        </>
    );
};

export default CreateProduct;
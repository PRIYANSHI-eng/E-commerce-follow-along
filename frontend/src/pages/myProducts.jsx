import { useEffect, useState } from "react";
import Myproduct from "../components/auth/myproduct";
import NavBar from "../components/auth/nav";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../axiosConfig";

export default function MyProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    // Get the email from Redux state
    const email = useSelector((state) => state.user.email);

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
            setError("You need to be logged in to view your products");
            setLoading(false);
            return;
        }
        
        // Only fetch if email is available
        if (!email) {
            setError("Email not found. Please log in again.");
            setLoading(false);
            return;
        }
        
        // Fetch products
        axios.get(`/api/v2/product/my-products?email=${email}`)
            .then((res) => {
                setProducts(res.data.products);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching products:", err);
                if (err.response && err.response.status === 401) {
                    setError("Your session has expired. Please login again.");
                    // Redirect to login after a short delay
                    setTimeout(() => navigate('/login'), 2000);
                } else {
                    setError(err.response?.data?.message || err.message);
                }
                setLoading(false);
            });
    }, [email, navigate]);

    if (loading) {
        return (
            <>
                <NavBar />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center p-8 bg-gray-100 rounded-lg shadow">
                        <div className="animate-pulse">
                            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
                            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
                        </div>
                        <p className="mt-4 text-gray-600">Loading your products...</p>
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <NavBar />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center p-8 bg-red-50 rounded-lg shadow border border-red-200">
                        <div className="text-red-600 text-xl mb-2">Error</div>
                        <p className="text-red-500">{error}</p>
                        {error.includes("logged in") && (
                            <button 
                                onClick={() => navigate('/login')}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                                Go to Login
                            </button>
                        )}
                    </div>
                </div>
            </>
        );
    }


    return (
        <>
            <NavBar />
            <div className="w-full min-h-screen bg-neutral-800">
                <h1 className="text-3xl text-center text-white py-6">My products</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
                    {products.map((product) => (
                        <Myproduct key={product._id} {...product} />
                    ))}
                </div>
            </div>
        </>
);
}
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function Product({ _id, name, images, description, price }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!images || images.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [images]);

    const currentImage = images[currentIndex];
    
    const handleMoreInfoClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigate(`/product/${_id}`);
    };
    
    return (
        <div className="product-card bg-white p-4 rounded-lg shadow-card flex flex-col justify-between h-full relative">
            <div className="w-full">
                <div className="overflow-hidden rounded-lg mb-3">
                    <img 
                        src={`http://localhost:3000${currentImage}`}
                        alt={name}
                        className="w-full h-56 object-cover rounded-lg transition-transform duration-500 hover:scale-105"
                    />
                </div>
                <h2 className="text-lg font-bold text-gray-800">{name}</h2>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{description}</p>
            </div>
            <div className="w-full mt-4 relative z-10">
                <p className="text-lg font-bold text-primary-600 my-2">${price.toFixed(2)}</p>
                <button 
                    className="btn-primary w-full relative z-20"
                    onClick={handleMoreInfoClick}
                >
                    More Info
                </button>
            </div>
        </div>
    );
}

Product.propTypes = {
  _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Product;
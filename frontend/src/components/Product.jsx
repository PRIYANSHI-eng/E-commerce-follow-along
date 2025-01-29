import React from "react";

export default function Product({ id, name, price, image }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <img
        src={image}
        alt={name}
        className="w-full h-48 object-cover rounded-md"
      />
      <h2 className="text-lg font-semibold mt-2">{name}</h2>
      <p className="text-gray-600">${price}</p>
      <button className="mt-2 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300">
        Buy Now
      </button>
    </div>
  );
}
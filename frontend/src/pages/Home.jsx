import  { useState, useEffect } from "react";
import Product from "../components/Product";
import { productData } from "../static/data";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(productData);
  }, []);

  return (
    <>
     
      <div className="w-full min-h-screen bg-neutral-800">
        <h1 className="text-3xl text-center text-white py-6">Product Gallery</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4">
          {products.map((product, index) => (
            <Product key={product.id || index} {...product} />
          ))}
        </div>
      </div>
    </>
  );
}
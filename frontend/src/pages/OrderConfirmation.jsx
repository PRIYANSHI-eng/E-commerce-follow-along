// OrderConfirmation.jsx
import { useState, useEffect } from 'react';
import NavBar from '../components/auth/nav';
import { useLocation, useNavigate } from 'react-router-dom';
// 1) Import PayPalScriptProvider & PayPalButtons
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from '../axiosConfig';

const OrderConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { addressId, email } = location.state || {};
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // 2) Track which payment method is selected
    const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'paypal'

    useEffect(() => {
        if (!addressId || !email) {
            navigate('/select-address'); // Redirect if no address selected or email missing
            return;
        }   
        const fetchData = async () => {
            try {
                const addressResponse = await axios.get('/api/v2/user/addresses', {
                    params: { email },
                });
                const address = addressResponse.data.addresses.find((a) => a._id === addressId);
                if (!address) throw new Error('Selected address not found.');
                setSelectedAddress(address);

                const cartResponse = await axios.get('/api/v2/product/cartproducts', {
                    params: { email },
                });
                const cartData = cartResponse.data;
                
                // Check if cart data has the expected structure
                if (!cartData || !cartData.cart || !Array.isArray(cartData.cart)) {
                    console.error('Unexpected cart data structure:', cartData);
                    setError("Unable to load cart data. Please try again later.");
                    setCartItems([]);
                    setTotalPrice(0);
                    return;
                }
                
                // Filter out any cart items with null productId
                const validCartItems = cartData.cart.filter(item => item && item.productId != null);
                
                if (validCartItems.length === 0) {
                    setError("Your cart is empty or contains invalid products.");
                    setCartItems([]);
                    setTotalPrice(0);
                    return;
                }
                
                // Map cart items to include full image URLs with null checks
                const processedCartItems = validCartItems.map(item => ({
                    product: item.productId._id,
                    name: item.productId.name || 'Unknown Product',
                    price: item.productId.price || 0,
                    image: item.productId.images && item.productId.images.length > 0 
                        ? item.productId.images.map(imagePath => `http://localhost:3000${imagePath}`)
                        : ['http://localhost:3000/products/placeholder.jpg'], // Fallback image
                    quantity: item.quantity || 1,
                }));
                
                setCartItems(processedCartItems);
                
                // Calculate total price
                const total = processedCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
                setTotalPrice(total);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.response?.data?.message || err.message || 'An unexpected error occurred.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [addressId, email, navigate]);

    // 3) Single function to place order, can accept PayPal data if payment was online
    const handlePlaceOrder = async (paymentType = 'cod', paypalOrderData = null) => {
        try {
            // setLoading(true);
            // const response = await axios.post('http://localhost:3000/api/v2/orders/place-order', {
            // Map cartItems to match the backend expected format
            const orderItems = cartItems.map(item => ({
                product: item.product,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                image: item.image && item.image.length > 0 ? item.image[0] : '/default-avatar.png'
            }));
            // console.log(orderItems);
            // Construct payload with paymentMethod and optional PayPal data
            const payload = {
                email,
                shippingAddress: selectedAddress,
                orderItems,
                paymentMethod: paymentType, // 'cod' or 'paypal'
                 // Optionally store PayPal transaction details:
                paypalOrderData,
            };
            const response = await axios.post('/api/v2/orders/place-order', payload);
            console.log('Order placed successfully:', response.data);
            // Navigate to an order success page or display a success message
            navigate('/order-success'); // Adjust route as needed
        } catch (error) {
            console.error('Error placing order:', error);
            // Optionally update error state to display an error message to the user
            setError(error.response?.data?.message || error.message || 'An unexpected error occurred.');
        }
    };
    if (loading) {
        return (
            <>
                <NavBar />
                <div className='w-full min-h-screen flex justify-center items-center p-4'>
                    <div className='text-center'>
                        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4'></div>
                        <p className='text-lg text-gray-700'>Loading your order details...</p>
                    </div>
                </div>
            </>
        );
    }
    
    if (error) {
        return (
            <>
                <NavBar />
                <div className='w-full min-h-screen flex flex-col justify-center items-center p-4'>
                    <div className='bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className='text-xl font-bold text-red-700 mb-2'>Something went wrong</h2>
                        <p className='text-red-600 mb-6'>{error}</p>
                        <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                            <button
                                onClick={() => navigate('/cart')}
                                className='px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors'
                            >
                                Return to Cart
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
    return (
        <div className='w-full min-h-screen flex flex-col'>
            <NavBar />
            <div className='flex-grow flex justify-center items-start p-4'>
                <div className='w-full max-w-4xl border border-neutral-300 rounded-md flex flex-col p-6 bg-white shadow-md'>
                    <h2 className='text-2xl font-semibold mb-6 text-center'>Order Confirmation</h2>
                    {/* Selected Address */}
                    <div className='mb-6'>
                        <h3 className='text-xl font-medium mb-2'>Shipping Address</h3>
                        {selectedAddress ? (
                            <div className='p-4 border rounded-md'>
                                <p className='font-medium'>
                                    {selectedAddress.address1}{selectedAddress.address2 ? `, ${selectedAddress.address2}` : ''}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.zipCode}
                                </p>
                                <p className='text-sm text-gray-600'>{selectedAddress.country}</p>
                                <p className='text-sm text-gray-500'>Type: {selectedAddress.addressType || 'N/A'}</p>
                            </div>
                        ) : (
                            <p>No address selected.</p>
                        )}
                    </div>
                    {/* Cart Items */}
                    <div className='mb-6'>
                        <h3 className='text-xl font-medium mb-2'>Cart Items</h3>
                        {cartItems.length > 0 ? (
                            <div className='space-y-4'>
                                {cartItems.map((item, index) => (
                                    <div key={item.product || index} className='flex justify-between items-center border p-4 rounded-md'>
                                        <div className='flex items-center'>
                                            <img
                                                src={item.image && item.image.length > 0 ? item.image[0] : '/default-avatar.png'} // Use first image or fallback
                                                alt={item.name}
                                                className='w-16 h-16 object-cover rounded-md mr-4'
                                            />
                                            <div>
                                                <p className='font-medium'>{item.name}</p>
                                                <p className='text-sm text-gray-600'>Quantity: {item.quantity}</p>
                                                <p className='text-sm text-gray-600'>Price: ${item.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className='font-semibold'>${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Your cart is empty.</p>
                        )}
                    </div>
                    {/* Total Price */}
                    <div className='mb-6 flex justify-end'>
                        <p className='text-xl font-semibold'>Total: ${totalPrice.toFixed(2)}</p>
                    </div>
                    {/* Payment Method (Cash on Delivery or PayPal) */}
                    <div className='mb-6'>
                        <h3 className='text-xl font-medium mb-2'>Payment Method</h3>
                        <div className='p-4 border rounded-md space-x-4'>
                             <label className='mr-4'>
                                 <input
                                     type='radio'
                                     name='paymentMethod'
                                     value='cod'
                                     checked={paymentMethod === 'cod'}
                                     onChange={() => setPaymentMethod('cod')}
                                 />
                                 <span className='ml-2'>Cash on Delivery</span>
                             </label>
                             <label>
                                 <input
                                     type='radio'
                                     name='paymentMethod'
                                     value='paypal'
                                     checked={paymentMethod === 'paypal'}
                                     onChange={() => setPaymentMethod('paypal')}
                                 />
                                 <span className='ml-2'>Pay Online (PayPal)</span>
                             </label>
                        </div>
                        {paymentMethod === 'paypal' && (
                             <div className='mt-4' style={{ maxWidth: '500px' }}>
                                 <PayPalScriptProvider
                                     options={{
                                         'client-id': import.meta.env.VITE_CLIENT_ID, 
                                     }}
                                 >
                                     <PayPalButtons
                                         style={{ layout: 'vertical' }}
                                         createOrder={(data, actions) => {
                                             return actions.order.create({
                                                 purchase_units: [
                                                     {
                                                         amount: {
                                                             value: totalPrice.toFixed(2),
                                                         },
                                                     },
                                                 ],
                                             });
                                         }}
                                         onApprove={async (data, actions) => {
                                             // Captures funds from the transaction
                                             const order = await actions.order.capture();
                                             console.log('PayPal order success:', order);
 
                                             // Call place order with PayPal data
                                             handlePlaceOrder('paypal', order);
                                         }}
                                         onError={(err) => {
                                             console.error('PayPal checkout error:', err);
                                         }}
                                     />
                                 </PayPalScriptProvider>
                             </div>
                         )}
                    </div>
                    {/* Place Order Button (for COD) */}
                    {paymentMethod === 'cod' && (
                         <div className='flex justify-center'>
                             <button
                                 onClick={() => handlePlaceOrder('cod', null)}
                                 className='bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors'
                             >
                                 Place Order
                             </button>
                         </div>
                     )}
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
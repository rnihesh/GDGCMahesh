import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EcommercePlatform.css';

const EcommercePlatform = () => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [platformFee, setPlatformFee] = useState(5);
  const [shippingCharges, setShippingCharges] = useState(5);

  useEffect(() => {
    axios.get('https://fakestoreapi.com/products')
      .then(res => setItems(res.data))
      .catch(err => console.error(err));
  }, []);

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    // Display success toast message
    toast.success(`${item.title} has been added to your cart.`);
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(cartItem => cartItem.id !== id));
    toast.error('Item has been removed from your cart.');
  };

  const increaseQuantity = (id) => {
    setCart(cart.map(cartItem => 
      cartItem.id === id 
      ? { ...cartItem, quantity: cartItem.quantity + 1 }
      : cartItem
    ));
  };

  const decreaseQuantity = (id) => {
    setCart(cart.map(cartItem => 
      cartItem.id === id && cartItem.quantity > 1
      ? { ...cartItem, quantity: cartItem.quantity - 1 }
      : cartItem
    ));
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const totalMRP = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalAmount = totalMRP - couponDiscount + platformFee + shippingCharges;

  const handleModalClose = (e) => {
    if (e.target.classList.contains('cart-modal')) {
      setIsCartModalOpen(false);
    }
  };

  const placeOrder = () => {
    setCart([]); 
    setIsCartModalOpen(false); 
    toast.success("Your order has been placed successfully!");
  };

  return (
    <div className="ecommerce-container">
      <header className="header">
        <div className='d-flex align-items-center'>
          <img src="https://w7.pngwing.com/pngs/340/635/png-transparent-shopping-centre-computer-icons-online-shopping-mall-miscellaneous-cdr-angle.png" alt="Logo" style={{width:"70px",borderRadius:"50%"}} />
          <h2 className="header-title px-5">FlipShop</h2>
        </div>
        <input 
          type="text" 
          className="search-bar w-25 px-2 py-2"
          style={{borderRadius:"60px"}}
          placeholder="Search items..." 
          value={search}
          onChange={handleSearch}
        />
        <i className="fas fa-shopping-cart cart-icon mx-5" onClick={() => setIsCartModalOpen(true)}></i>
      </header>
      <hr style={{borderTop: "1px solid white"}} />
      <main className="main" style={{minHeight:"100vh"}}>
        <section className="item-list">
          {items
            .filter(item => item.title.toLowerCase().includes(search.toLowerCase()))
            .map(item => (
              <div key={item.id} className="item-card">
                <img src={item.image} alt={item.title} className="item-image" />
                <div className="item-details">
                  <h5>{item.title}</h5>
                  <p>⭐ {item.rating.rate}</p> 
                  <p className='lead fs-5 fw-bold'>₹{item.price}</p>
                </div>
                <button onClick={() => addToCart(item)} className="add-to-cart-btn">Add to Cart</button>
              </div>
          ))}
        </section>
        {/* Cart Modal */}
        {isCartModalOpen && (
          <div className="cart-modal" onClick={handleModalClose}>
            <div className="cart-modal-content" onClick={(e) => e.stopPropagation()}>
              <span className="close-modal" onClick={() => setIsCartModalOpen(false)}>❌</span>
              <h2 className='text-light display-5'>Your Cart</h2>
              <div className="cart-container">
                <div className="cart-items">
                  {cart.length > 0 ? (
                    cart.map(cartItem => (
                      <div key={cartItem.id} className="cart-item">
                        <img src={cartItem.image} style={{objectFit:"contain"}} alt={cartItem.title} className="cart-item-image" />
                        <div className="cart-item-details">
                          <h5>{cartItem.title}</h5>
                          <p>₹{cartItem.price}</p>
                          <div className="cart-item-quantity">
                            <button onClick={() => decreaseQuantity(cartItem.id)} className="quantity-btn ">-</button>
                            <span>{cartItem.quantity}</span>
                            <button onClick={() => increaseQuantity(cartItem.id)} className="quantity-btn ">+</button>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(cartItem.id)} className="remove-item-btn">❌</button>
                      </div>
                    ))
                  ) : (
                    <div className="empty-cart-message">
                        <div className="empty-cart-content d-block mx-auto justify-content-center">
                            <img className='pb-5' src="https://mir-s3-cdn-cf.behance.net/projects/404/95974e121862329.Y3JvcCw5MjIsNzIxLDAsMTM5.png" alt="Empty Cart Illustration"/>
                            <h2>Your Cart is Empty</h2>
                            <p className='p-3'>Add items to your cart to see them here.</p>
                            <button className='btn btn-dark' onClick={() => setIsCartModalOpen(false)}>Start Shopping</button>
                        </div>
                    </div>
                  )}
                </div>

                {(cart.length>0) ? (
                <div className="card price-summary">
                  <div className='card-body'>
                  <h3>Price Details</h3>
                  <p>Total MRP: <strong>{Math.round(totalMRP)}</strong></p>
                  <p>Coupon Discount: <strong>₹{Math.round(couponDiscount)}</strong></p>
                  <p>Platform Fee: <strong>₹{Math.round(platformFee)}</strong></p>
                  <p>Shipping Charges: <strong>₹{Math.round(shippingCharges)}</strong></p>
                  <h4 className="total-amount">Total Amount: <strong>₹{Math.round(totalAmount)}</strong></h4>
                  </div>
                  <button className='btn btn-dark mb-4' onClick={() => setIsCartModalOpen(false)}>Continue Shopping</button>
                  <button className="card-footer place-order-btn" onClick={placeOrder}>
                    Place Order
                  </button>
                </div>) : (
                  <img src="https://static.wikia.nocookie.net/e7892774-ca83-4a92-9bd6-58f6704a2901" />
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <hr style={{borderBottom: "1px solid white"}} />
      <footer>
        <div className="footer-content p-3">
          <p className='text-light text-center fs-5'>&copy; {new Date().getFullYear()} FlipShop. All rights reserved.</p>
        </div>
      </footer>

      {/* Toast container to show notifications */}
      <ToastContainer 
        position="bottom-right" 
        autoClose={2000} 
        hideProgressBar={false} 
        newestOnTop={false} 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
      />

    </div>
  );
};

export default EcommercePlatform;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './order_place.css'; // Ensure this path matches your CSS file location

const OrderPlaced = () => {
  const navigate = useNavigate();

  return (
    <div className="main_container-order-place">
      <div className="button-container">
        <button className="button_1" onClick={() => navigate('/DineIn')}>
          Order More!
        </button>
        <button className="button_1" onClick={() => navigate('/home')}>
          Back Home
        </button>
        <button className="button_1" onClick={() => navigate('/gallery')}>
          Gallery
        </button>
      </div>
      <div className="content">
        <img src="/assets/6.png" alt="Order Placed" />
        <h1>Hooray!!!</h1>
        <p>Order is placed</p>
      </div>
    </div>
  );
};

export default OrderPlaced;

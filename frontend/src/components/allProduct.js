import React from 'react';
import { Helmet } from 'react-helmet';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import './allproduct.css';

const AllProduct = () => {
    const navigate = useNavigate();


    const handleDineIn= () => {
        navigate('/dineIn');
      }
    return (
        <div className="main_container">
            <Helmet>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC"
          crossorigin="anonymous"
        />
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
          crossorigin="anonymous"
        ></script>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
        />
      </Helmet>
          <div className="button-container">
            <button className="button_1" onClick={handleDineIn}>
              Dine In
            </button>
            <button className="button_1" onClick={() => window.location.href = 'dine_in.html'}>
              Take Away
            </button>
            <button className="button_1" onClick={() => window.location.href = 'videos.html'}>
              Gallery
            </button>
            <button className="button_1">Google Rating</button>
          </div>
          <div className="content">
            <div className="top_logo">ABLAZE</div>
    
            <div
              id="carouselExampleIndicators"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div
                className="carousel-indicators"
                style={{ position: 'absolute', bottom: '-4%' }}
              >
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="0"
                  className="active"
                  aria-current="true"
                  aria-label="Slide 1"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="1"
                  aria-label="Slide 2"
                ></button>
                <button
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide-to="2"
                  aria-label="Slide 3"
                ></button>
              </div>
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img
                    src="/assets/5ed1a351e6182f28ff3b9a13c47eb460.avif"
                    className="d-block w-100"
                    alt="..."
                  />
                </div>
                <div className="carousel-item">
                  <img
                    src="/assets/images.jfif"
                    className="d-block w-100"
                    alt="..."
                  />
                </div>
                <div className="carousel-item">
                  <img
                    src="/assets/images (1).jfif"
                    className="d-block w-100"
                    alt="..."
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row1" style={{ position: 'absolute', bottom: '5%', right: '0' }}>
            <div
              className="col-sm-6 bg-transparent lmn"
              style={{ display: 'flex', flexDirection: 'row-reverse' }}
            >
              <p>Contact us</p>
              <a href="#"><i className="fa-solid fa-message"></i></a>
              <a href="#"><i className="fa-brands fa-instagram"></i></a>
              <a href="#"><i className="fa-solid fa-globe"></i></a>
            </div>
          </div>
        </div>
      );
};

export default AllProduct;

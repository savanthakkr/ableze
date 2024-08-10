import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './dine_in.css';
import { Helmet } from 'react-helmet';

const DineIn = () => {
    const [activeTab, setActiveTab] = useState('food');
    const [openAccordion, setOpenAccordion] = useState({});
    const [categories, setCategories] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [products, setProducts] = useState({});
    const [loading, setLoading] = useState({});
    const token = localStorage.getItem('token');
    const [counters, setCounters] = useState({
        food: 0,
        drinks: 0,
        sheesha: 0,
    });
    console.log(token);
    const counterValue = 5;
    const navigate = useNavigate();


    const handleAccordionToggle = async (tab, index, categoryId) => {
        const key = `${tab}-${index}`;

        setOpenAccordion((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));

        if (!openAccordion[key]) {
            try {
                const response = await axios.get(`http://192.168.1.6:5000/api/getproduct/${categoryId}`, {
                    headers: {
                        Authorization: token,
                    },
                });
                setProducts((prev) => ({
                    ...prev,
                    [key]: response.data,
                }));

                console.log(products);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }
    };

    const fetchCartCounts = async () => {
        try { // Replace with your logic to get the current user ID
            const [foodResponse, drinksResponse, sheeshaResponse] = await Promise.all([
                axios.get(`http://192.168.1.6:5000/api/getCartCountByCategory/1`, { headers: { Authorization: token } }).catch(() => ({ data: { count: 0 } })),
                axios.get(`http://192.168.1.6:5000/api/getCartCountByCategory/2`, { headers: { Authorization: token } }).catch(() => ({ data: { count: 0 } })),
                axios.get(`http://192.168.1.6:5000/api/getCartCountByCategory/3`, { headers: { Authorization: token } }).catch(() => ({ data: { count: 0 } })),
            ]);

            setCounters({
                food: foodResponse.data.count,
                drinks: drinksResponse.data.count,
                sheesha: sheeshaResponse.data.count,
            });
            console.log(foodResponse.data.count);
        } catch (error) {
            console.error('Error fetching cart counts:', error);
        }
    };



    const fetchCartItems = () => {
        axios.get(`http://192.168.1.6:5000/api/cart`, {
            headers: {
                Authorization: token,
            },
        })
            .then(response => {
                const cartItems = response.data;
                const quantities = {};
                cartItems.forEach(item => {
                    quantities[item.product_id] = item.quantity;
                });

                setQuantities(quantities);

                console.log(quantities);
            })
            .catch(error => {
                console.error('Error fetching cart items:', error);
            });
    };


    useEffect(() => {
        fetchCartItems();
        fetchCategories(1);
        fetchCartCounts();
    }, []);


    const fetchCategories = (id) => {
        axios.get(`http://192.168.1.6:5000/api/subcategory/${id}`, {
            headers: {
                Authorization: token,
            },
        })
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });
    };

    const handleTabClick = (tab, id) => {
        setActiveTab(tab);
        fetchCategories(id);
    };


    const handleDecrement = (productId) => {
        setLoading((prev) => ({ ...prev, [productId]: true }));
        const currentQuantity = quantities[productId] || 0;
        if (currentQuantity > 0) {
            axios.put(`http://192.168.1.6:5000/api/updateCart/${productId}`, { action: 'decrement' }, {
                headers: {
                    Authorization: token,
                },
            })
                .then(() => {
                    fetchCartItems();
                    fetchCartCounts();
                })
                .catch(error => {
                    console.error('Error updating cart:', error);
                })
                .finally(() => {
                    setLoading((prev) => ({ ...prev, [productId]: false }));
                });
        } else {
            setLoading((prev) => ({ ...prev, [productId]: false }));
        }
    };

    const handleIncrement = (productId) => {
        setLoading((prev) => ({ ...prev, [productId]: true }));
        axios.post(`http://192.168.1.6:5000/api/checkCart`, { productId }, {
            headers: {
                Authorization: token,
            },
        })
            .then(response => {
                if (response.data.inCart) {
                    // If product is already in the cart, increment its quantity
                    axios.put(`http://192.168.1.6:5000/api/updateCart/${productId}`, { action: 'increment' }, {
                        headers: {
                            Authorization: token,
                        },
                    })
                        .then(() => {
                            fetchCartItems();
                            fetchCartCounts();
                        })
                        .catch(error => {
                            console.error('Error updating cart:', error);
                        })
                        .finally(() => {
                            setLoading((prev) => ({ ...prev, [productId]: false }));
                        });
                } else {
                    // If product is not in the cart, add it with a quantity of 1
                    axios.post(`http://192.168.1.6:5000/api/addToCart`, { productId, quantity: 1 }, {
                        headers: {
                            Authorization: token,
                        },
                    })
                        .then(() => {
                            fetchCartItems(); // Refresh the cart items
                        })
                        .catch(error => {
                            console.error('Error adding to cart:', error);
                        })
                        .finally(() => {
                            setLoading((prev) => ({ ...prev, [productId]: false }));
                        });
                }
            })
            .catch(error => {
                console.error('Error checking cart:', error);
                setLoading((prev) => ({ ...prev, [productId]: false }));
            });
    };

    const handlePlaceOrder = async () => {
        try {
            const tableNumber = localStorage.getItem('tableNumber');

            const response = await axios.post('http://192.168.1.6:5000/api/placeOrder', {
                tableNumber,
            }, {
                headers: {
                    Authorization: token,
                },
            });

            if (response.status === 200) {
                console.log('Order placed successfully');
                fetchCartItems();
                fetchCartCounts();
                setTimeout(() => {
                    navigate('/OrderPlaced');
                }, 2000); // Redirect after 2 seconds to allow the user to see the message
                // Redirect to order confirmation page or display a success message
            } else {
                console.error('Failed to place order:', response.data.message);
            }
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    const renderMenuItem = (product) => (
        <div key={product.id} className="menu-item d-flex justify-content-between align-items-center">
            <div className="menu-info">
                <img
                    src={product.image_url}
                    alt={product.title}
                    className="menu-img"
                />
                <div className="menu-details">
                    <h5>{product.title}</h5>
                    <p>{product.description}</p>
                </div>
            </div>
            <div className="menu-quantity">
                <button className="btn btn-light" onClick={() => handleDecrement(product.id)} disabled={loading[product.id]}>
                    {loading[product.id] ? 'Loading...' : '-'}
                </button>
                <input
                    type="number"
                    value={quantities[product.id] || 0}
                    className="quantity-input"
                    readOnly
                />
                <button className="btn btn-light" onClick={() => handleIncrement(product.id)} disabled={loading[product.id]}>
                    {loading[product.id] ? 'Loading...' : '+'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="container main_container dine_in_container">
            <Helmet>
                <script
                    src="https://code.jquery.com/jquery-3.5.1.slim.min.js"
                    integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj"
                    crossOrigin="anonymous"
                ></script>
                <script
                    src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"
                    integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj"
                    crossOrigin="anonymous"
                ></script>
            </Helmet>
            <div className="header">
                <button className="back_arrow" onClick={() => window.history.back()}>{"<"}</button>
                <h2>DINE IN</h2>
            </div>
            <div className="nav-tabs-wrapper">
                <ul className="nav nav-tabs justify-content-center">
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'food' ? 'active' : ''}`} onClick={() => handleTabClick('food', 1)}>
                            Food
                            {counters.food > 0 && <span className="counter">{counters.food}</span>}
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'drinks' ? 'active' : ''}`} onClick={() => handleTabClick('drinks', 2)}>
                            Drinks
                            {counters.drinks > 0 && <span className="counter">{counters.drinks}</span>}
                        </button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link ${activeTab === 'sheesha' ? 'active' : ''}`} onClick={() => handleTabClick('sheesha', 3)}>
                            Sheesha
                            {counters.sheesha > 0 && <span className="counter">{counters.sheesha}</span>}
                        </button>
                    </li>
                </ul>
            </div>
            <div className="tab-content">
                <div>
                    <div className="accordion" id={`${activeTab}Accordion`}>
                        {categories.map((category, index) => (
                            <div className="accordion-item" key={index}>
                                <h2 className="accordion-header" id={`heading${activeTab}${index}`}>
                                    <button
                                        className="accordion-button"
                                        type="button"
                                        onClick={() => handleAccordionToggle(activeTab, index, category.id)}
                                    >

                                        {category.title}
                                        <span className="accordion-icon">
                                            {openAccordion[`${activeTab}-${index}`] ? '-' : '+'}
                                        </span>
                                    </button>
                                </h2>
                                <div
                                    id={`collapse${activeTab}${index}`}
                                    className={`accordion-collapse collapse ${openAccordion[`${activeTab}-${index}`] ? 'show' : ''}`}
                                    aria-labelledby={`heading${activeTab}${index}`}
                                    data-bs-parent={`#${activeTab}Accordion`}
                                >
                                    <div className="accordion-body">
                                        {products[`${activeTab}-${index}`]?.map(renderMenuItem)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>


                </div>
            </div>
            <div className="place-order text-center">
                <button
                    className="order_placed_btn"
                    onClick={handlePlaceOrder}
                >
                    Place Order
                </button>
            </div>
        </div>
    );
};

export default DineIn;

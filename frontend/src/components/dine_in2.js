import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import './dine_in.css'; // Import your custom CSS
import { Helmet } from 'react-helmet';


const DineIn = () => {
    const [activeTab, setActiveTab] = useState('food');
    const [openAccordion, setOpenAccordion] = useState({});
    const [categories, setCategories] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [products, setProducts] = useState({});

    useEffect(() => {
        fetchCartItems();
        fetchCategories(1); // Default fetch for 'food'
    }, []);

    const fetchCartItems = () => {
        axios.get(`http://192.168.1.6:5000/api/cart/${userId}`)
            .then(response => {
                const cartItems = response.data;
                const quantities = {};
                cartItems.forEach(item => {
                    quantities[item.product_id] = item.quantity;
                });
                setQuantities(quantities);
            })
            .catch(error => {
                console.error('Error fetching cart items:', error);
            });
    };

    const fetchCategories = (id) => {
        axios.get(`http://192.168.1.6:5000/api/subcategory/${id}`)
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

    const handleAccordionToggle = async (tab, index, categoryId) => {
        const key = `${tab}-${index}`;

        setOpenAccordion((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));

        if (!openAccordion[key]) {
            try {
                const response = await axios.get(`http://192.168.1.6:5000/api/getproduct/${categoryId}`);
                setProducts((prev) => ({
                    ...prev,
                    [key]: response.data,
                }));
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }
    };

    const handleDecrement = (productId) => {
        const currentQuantity = quantities[productId] || 0;
        if (currentQuantity > 0) {
            axios.put(`http://192.168.1.6:5000/api/updateCart/${userId}/${productId}`, { action: 'decrement' })
                .then(() => {
                    setQuantities((prev) => ({
                        ...prev,
                        [productId]: currentQuantity - 1,
                    }));
                })
                .catch(error => {
                    console.error('Error updating cart:', error);
                });
        }
    };

    const handleIncrement = (productId) => {
        axios.post(`http://192.168.1.6:5000/api/checkCart`, { userId, productId })
            .then(response => {
                if (response.data.inCart) {
                    // If product is already in the cart, increment its quantity
                    axios.put(`http://192.168.1.6:5000/api/updateCart/${userId}/${productId}`, { action: 'increment' })
                        .then(() => {
                            setQuantities((prev) => ({
                                ...prev,
                                [productId]: (prev[productId] || 0) + 1,
                            }));
                        })
                        .catch(error => {
                            console.error('Error updating cart:', error);
                        });
                } else {
                    // If product is not in the cart, add it with a quantity of 1
                    axios.post(`http://192.168.1.6:5000/api/addToCart`, { userId, productId, quantity: 1 })
                        .then(() => {
                            setQuantities((prev) => ({
                                ...prev,
                                [productId]: 1,
                            }));
                        })
                        .catch(error => {
                            console.error('Error adding to cart:', error);
                        });
                }
            })
            .catch(error => {
                console.error('Error checking cart:', error);
            });
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
                <button className="btn btn-light" onClick={() => handleDecrement(product.id)}>-</button>
                <input
                    type="number"
                    value={quantities[product.id] || 0}
                    className="quantity-input"
                    readOnly
                />
                <button className="btn btn-light" onClick={() => handleIncrement(product.id)}>+</button>
            </div>
        </div>
    );

    return (
        <div className="dine-in">
            <Helmet>
                <title>Dine In</title>
            </Helmet>
            <div className="tabs">
                <button className={activeTab === 'food' ? 'active' : ''} onClick={() => handleTabClick('food', 1)}>Food</button>
                <button className={activeTab === 'drinks' ? 'active' : ''} onClick={() => handleTabClick('drinks', 2)}>Drinks</button>
                <button className={activeTab === 'sheesha' ? 'active' : ''} onClick={() => handleTabClick('sheesha', 3)}>Sheesha</button>
            </div>
            <div className="categories">
                {categories.map((category, index) => (
                    <div key={category.id}>
                        <div className="category-header" onClick={() => handleAccordionToggle(activeTab, index, category.id)}>
                            <h5>{category.name}</h5>
                        </div>
                        {openAccordion[`${activeTab}-${index}`] && (
                            <div className="category-content">
                                {products[`${activeTab}-${index}`]?.map(renderMenuItem)}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DineIn;

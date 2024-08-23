import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
    const [categoryId, setCategoryId] = useState('');
    const [subCategoryId, setSubCategoryId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImage(reader.result); // Set the base64 string of the image
        };

        if (file) {
            reader.readAsDataURL(file); // Read the file and convert to base64
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            category_id: categoryId,
            sub_category_id: subCategoryId,
            title,
            description,
            image // Base64 encoded image string
        };

        try {
            const response = await axios.post('https://ableze.fullstackresolutions.com/api/addProduct', data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Product added successfully:', response.data);
            alert('Product added successfully!');
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product. Please try again.');
        }
    };

    return (
        <div>
            <h2>Add Product</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Category ID:</label>
                    <input
                        type="text"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Sub Category ID:</label>
                    <input
                        type="text"
                        value={subCategoryId}
                        onChange={(e) => setSubCategoryId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div>
                    <label>Image:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />
                </div>
                <button type="submit">Add Product</button>
            </form>
        </div>
    );
};

export default AddProduct;

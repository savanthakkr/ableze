import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, useParams } from 'react-router-dom';
import './index.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'; 

const FormPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
  });

  const [formErrors, setFormErrors] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(''); // State for success message

  const navigate = useNavigate();
  const { tableNumber } = useParams();

  useEffect(() => {
    console.log('Table Number:', tableNumber);
  }, [tableNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let errors = {};
    let formIsValid = true;

    if (!formData.fullName) {
      formIsValid = false;
      errors.fullName = 'Please enter a valid name.';
    }

    if (!formData.mobileNumber) {
      formIsValid = false;
      errors.mobileNumber = 'Please enter a valid phone number.';
    }

    if (!formData.email) {
      formIsValid = false;
      errors.email = 'Please enter a valid email.';
    }

    setFormErrors(errors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);

      try {
        const response = await axios.post('https://ableze.fullstackresolutions.com/api/users/loginUserOrcreate', {
          name: formData.fullName,
          email: formData.email,
          phone: formData.mobileNumber,
          tableNumber
        });

        const { message, token, userId } = response.data;
        console.log(message, token, userId);

        setLoading(false);
        setSuccessMessage(message); // Set the success message

        localStorage.setItem('token', token);
        localStorage.setItem('tableNumber', tableNumber);
        localStorage.setItem('userId', userId);

        setTimeout(() => {
          navigate('/AllProduct');
        }, 2000); // Redirect after 2 seconds to allow the user to see the message
      } catch (error) {
        console.error('Error submitting form:', error);
        setLoading(false);
      }
    }
  };

  return (
    <div className="form-container">
      <div className="top_logo">ABLAZE</div>

      <div className="form-input">
        <form className="row g-4 needs-validation" noValidate onSubmit={handleSubmit}>
          <div className="col-md-5 position-relative">
            <label htmlFor="validationTooltip01" className="form-label">
              Full name
            </label>
            <input
              type="text"
              className={`form-control ${formErrors.fullName ? 'is-invalid' : ''}`}
              id="validationTooltip01"
              placeholder="Your Full Name Here!"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <div className="valid-tooltip">Sounds good!😎</div>
            <div className="invalid-tooltip">{formErrors.fullName}</div>
          </div>

          <div className="col-md-4 position-relative">
            <label htmlFor="validationTooltipUsername" className="form-label">
              Mobile Number
            </label>
            <div className="input-group has-validation">
              <span className="input-group-text" id="validationTooltipMobileNumberPrepend">
                +91
              </span>
              <input
                type="number"
                className={`form-control ${formErrors.mobileNumber ? 'is-invalid' : ''}`}
                id="validationTooltipMobileNumber"
                aria-describedby="validationTooltipMobileNumberPrepend"
                placeholder="123 123 123"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />
              <div className="invalid-tooltip">{formErrors.mobileNumber}</div>
            </div>
          </div>

          <div className="col-md-6 position-relative">
            <label htmlFor="validationTooltip03" className="form-label">
              Email
            </label>
            <input
              type="email"
              className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
              id="validationTooltip03"
              placeholder="OneConnectX@test.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <div className="invalid-tooltip">{formErrors.email}</div>
          </div>

          <div>
            <button className="btn1" type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Feed Me Now! 🍲'} <FontAwesomeIcon icon={faUtensils} />
            </button>
          </div>
        </form>
        {successMessage && (
          <div className="alert alert-success mt-3" role="alert">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormPage;

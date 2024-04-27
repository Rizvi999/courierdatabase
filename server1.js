const express = require('express');
const { Pool } = require('pg');
const os = require('os');

const app = express();
const port = process.env.PORT || 3001;

// Get local IP address
const getIPAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const { family, address, internal } of iface) {
      if (family === 'IPv4' && !internal) {
        return address;
      }
    }
  }
  return 'localhost'; // Fallback to localhost if no IP address found
};

// Database connection details
const pool = new Pool({
  user: 'your_database_user',
  host: 'your_database_host', // Usually 'localhost' if running locally
  database: 'your_database_name',
  password: 'your_database_password',
  port: 5432, // Default PostgreSQL port
});

// Middleware to parse JSON bodies
app.use(express.json());

// Define your routes here
app.post('/login', async (req, res) => {
  // Your login logic here
});

app.post('/register', async (req, res) => {
  // Your registration logic here
});

// Start the server
app.listen(port, () => {
  const ipAddress = getIPAddress();
  console.log(`Server is running at http://${ipAddress}:${port}`);

  // Pass the server's IP address to your React frontend
  console.log(`Server IP address: ${ipAddress}`);
});

import React, { useState } from 'react';
import './styles.css'; // Import your CSS file here

function App() {
  const [displayLoginForm, setDisplayLoginForm] = useState(true);
  const [displayRegistrationForm, setDisplayRegistrationForm] = useState(false);
  const [displayMainContainer, setDisplayMainContainer] = useState(false);
  const [displayRecipientInfoContainer, setDisplayRecipientInfoContainer] = useState(false);
  const [displayShipmentDetailsContainer, setDisplayShipmentDetailsContainer] = useState(false);
  const [displayPaymentContainer, setDisplayPaymentContainer] = useState(false);
  const [userType, setUserType] = useState('');

  const handleRegisterLinkClick = (event) => {
    event.preventDefault();
    setDisplayLoginForm(false);
    setDisplayRegistrationForm(true);
  };

  const nextStep = (nextStepId) => {
    setDisplayRecipientInfoContainer(false);
    setDisplayShipmentDetailsContainer(false);
    setDisplayPaymentContainer(false);

    switch (nextStepId) {
      case 'recipientInfoContainer':
        setDisplayRecipientInfoContainer(true);
        break;
      case 'shipmentDetailsContainer':
        setDisplayShipmentDetailsContainer(true);
        break;
      case 'paymentContainer':
        setDisplayPaymentContainer(true);
        break;
      default:
        break;
    }
  };

  const handleLoginFormSubmit = (event) => {
    event.preventDefault();
    const loginEmail = event.target.loginEmail.value;
    const loginPassword = event.target.loginPassword.value;
    const loginUserType = event.target.loginUserType.value;

    if (loginUserType === 'sender') {
      setDisplayLoginForm(false);
      setDisplayMainContainer(true);
      nextStep('recipientInfoContainer');
    }
  };

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  const handleRegistrationFormSubmit = (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    // Similar setup for other form fields

    // Send user registration data to backend
    // Implement AJAX request or fetch API here
    // After successful registration, redirect or show appropriate message
    window.location.href = 'registration_complete.html';
  };

  const handleShipmentDetailsFormSubmit = (event) => {
    event.preventDefault();
    const shipmentWeight = event.target.shipmentWeight.value;

    // Check if shipment weight is a valid number
    if (!isValidWeight(shipmentWeight)) {
      alert('Please enter a valid weight in kilograms.');
      return;
    }

    // Proceed to the next step
    nextStep('paymentContainer');
  };

  const isValidWeight = (weight) => {
    // Regular expression to check if the input is a valid number with optional decimal point
    const weightPattern = /^\d+(\.\d{1,3})?$/;
    return weightPattern.test(weight);
  };

  return (
    <div>
      <header>
        <div className="logo">
          <img src="logo.png" alt="Company Logo" />
        </div>
        <div className="title">
          <h1>Courier Management System</h1>
        </div>
      </header>
      <div className="container">
        {displayLoginForm && (
          <div className="form-container" id="loginFormContainer">
            <h2>User Login</h2>
            <form id="loginForm" onSubmit={handleLoginFormSubmit}>
              <label htmlFor="loginEmail">Email:</label>
              <input type="email" id="loginEmail" required />
              <label htmlFor="loginPassword">Password:</label>
              <input type="password" id="loginPassword" required />
              <label htmlFor="loginUserType">I am a:</label>
              <select id="loginUserType" onChange={handleUserTypeChange} required>
                <option value="">Select User Type</option>
                <option value="sender">Sender</option>
                <option value="customer">Customer</option>
              </select>
              <button type="submit">Login</button>
            </form>
            <p>
              Don't have an account?{' '}
              <a href="#" id="registerLink" onClick={handleRegisterLinkClick}>
                Register here
              </a>
            </p>
          </div>
        )}
        {displayRegistrationForm && (
          <div className="form-container" id="registrationFormContainer">
            {<div className="form-container" id="registrationFormContainer">
  <h2>User Registration</h2>
  <form id="registrationForm" onSubmit={handleRegistrationFormSubmit}>
    <label htmlFor="userType">I am a:</label>
    <select id="userType" onChange={handleUserTypeChange} required>
      <option value="">Select User Type</option>
      <option value="sender">Sender</option>
      <option value="customer">Customer</option>
    </select>

    {userType === 'sender' && (
      <div id="senderFields">
        <label htmlFor="senderName">Full Name:</label>
        <input type="text" id="senderName" />
        <label htmlFor="companyName">Company Name:</label>
        <input type="text" id="companyName" />
        <label htmlFor="senderPhoneNumber">Phone Number:</label>
        <input type="tel" id="senderPhoneNumber" />
      </div>
    )}

    {userType === 'customer' && (
      <div id="customerFields">
        <label htmlFor="customerName">Full Name:</label>
        <input type="text" id="customerName" />
        <label htmlFor="customerPhoneNumber">Phone Number:</label>
        <input type="tel" id="customerPhoneNumber" />
      </div>
    )}

    <label htmlFor="email">Email:</label>
    <input type="email" id="email" required />
    <label htmlFor="password">Password:</label>
    <input type="password" id="password" required />
    <button type="submit">Register</button>
  </form>
</div>}
          </div>
        )}
        {displayMainContainer && (
          <div className="container" id="mainContainer">
            {<div className="form-container" id="shipmentDetailsContainer">
  <h2>Shipment Details</h2>
  <form id="shipmentDetailsForm" onSubmit={handleShipmentDetailsFormSubmit}>
    <label htmlFor="shipmentWeight">Weight (kg):</label>
    <input type="text" id="shipmentWeight" pattern="\d+(\.\d{1,3})?" title="Weight must be in kilograms (e.g., 5 or 5.253)" required />
    <label htmlFor="specialInstructions">Special Instructions:</label>
    <textarea id="specialInstructions"></textarea>
    <button type="submit">Next</button>
  </form>
</div>}
          </div>
        )}
        {displayRecipientInfoContainer && (
  <div className="form-container" id="recipientInfoContainer">
    <h2>Recipient Information</h2>
    <form id="recipientInfoForm">
      <label htmlFor="recipientName">Recipient Name:</label>
      <input type="text" id="recipientName" required />
      <label htmlFor="recipientAddress">Address:</label>
      <input type="text" id="recipientAddress" required />
      <label htmlFor="recipientPhoneNumber">Phone Number:</label>
      <input type="tel" id="recipientPhoneNumber" required />
      <button type="button" onClick={() => nextStep('shipmentDetailsContainer')}>Next</button>
    </form>
  </div>
)}
        {displayShipmentDetailsContainer && (
  <div className="form-container" id="shipmentDetailsContainer">
    <h2>Shipment Details</h2>
    <form id="shipmentDetailsForm" onSubmit={handleShipmentDetailsFormSubmit}>
      <label htmlFor="shipmentWeight">Weight (kg):</label>
      <input type="text" id="shipmentWeight" pattern="\d+(\.\d{1,3})?" title="Weight must be in kilograms (e.g., 5 or 5.253)" required />
      <label htmlFor="specialInstructions">Special Instructions:</label>
      <textarea id="specialInstructions"></textarea>
      <button type="submit">Next</button>
    </form>
  </div>
)}

        {displayPaymentContainer && (
          <div className="form-container" id="paymentContainer">
            {<div className="form-container" id="paymentContainer">
  <h2>Payment</h2>
  <form id="paymentForm">
    <label htmlFor="paymentMethod">Payment Method:</label>
    <select id="paymentMethod">
      <option value="">Select any Payment Method</option>
      <option value="creditCardOrDebitCard">Credit Card or DebitCard</option>
      <option value="UPI">UPI</option>
      <option value="Netbanking">Netbanking</option>
      <option value="CashNoDelivery">Cash No Delivery</option>
    </select>
    <button type="submit">Complete Payment</button>
  </form>
</div>}
          </div>
        )}
      </div>
      <footer>
        <div className="copyright">
          &copy; 2024 THE ONE PIECE. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;

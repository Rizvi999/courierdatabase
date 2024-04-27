document.getElementById('registerLink').addEventListener('click', function(event) {
    event.preventDefault();
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('registrationFormContainer').style.display = 'block';
  });

  function nextStep(nextStepId) {
    document.getElementById('recipientInfoContainer').style.display = 'none';
    document.getElementById('shipmentDetailsContainer').style.display = 'none';
    document.getElementById('paymentContainer').style.display = 'none';
    
    document.getElementById(nextStepId).style.display = 'block';
  }

  document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var loginEmail = document.getElementById('loginEmail').value;
    var loginPassword = document.getElementById('loginPassword').value;
    var loginUserType = document.getElementById('loginUserType').value;
  
    // Here you can perform login authentication and redirect accordingly
    if (loginUserType === 'sender') {
      document.getElementById('loginFormContainer').style.display = 'none';
      document.getElementById('mainContainer').style.display = 'block';
      // Display sender options
      document.getElementById('senderOptions').style.display = 'block';
    } else if (loginUserType === 'customer') {
      document.getElementById('loginFormContainer').style.display = 'none';
      document.getElementById('mainContainer').style.display = 'block';
      // Display customer options
      document.getElementById('customerOptions').style.display = 'block';
    }
  });
  
  // Hide sender and customer options when an option is selected
  document.querySelectorAll('#senderOptions ul li a, #customerOptions ul li a').forEach(function(option) {
    option.addEventListener('click', function() {
      document.getElementById('senderOptions').style.display = 'none';
      document.getElementById('customerOptions').style.display = 'none';
    });
  });     

  document.getElementById('userType').addEventListener('change', function() {
    var userType = this.value;
    var senderFields = document.getElementById('senderFields');
    var customerFields = document.getElementById('customerFields');

    if (userType === 'sender') {
      senderFields.style.display = 'block';
      customerFields.style.display = 'none';
    } else if (userType === 'customer') {
      senderFields.style.display = 'none';
      customerFields.style.display = 'block';
    }
  });

  document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var userType = document.getElementById('userType').value;
    var companyName = document.getElementById('companyName').value;
    var senderPhoneNumber = document.getElementById('senderPhoneNumber').value;
    var senderName = document.getElementById('senderName').value; // New line
    var customerName = document.getElementById('customerName').value;
    var customerPhoneNumber = document.getElementById('customerPhoneNumber').value;    

    // Prepare data for sending to backend based on user type
    var userData = {
      email: email,
      password: password,
      userType: userType,
    };

    if (userType === 'sender') {
      userData.senderName = senderName; // New line
      userData.companyName = companyName;
      userData.senderPhoneNumber = senderPhoneNumber;
    } else if (userType === 'customer') {
      userData.customerName = customerName;
      userData.customerPhoneNumber = customerPhoneNumber;
    }    

    // Send user registration data to backend
    // Implement AJAX request or fetch API here
    console.log('Redirecting to registration_complete.html');
    window.location.href = 'registration_complete.html';
    // After successful registration, redirect or show appropriate message
  });

  document.getElementById('shipmentDetailsForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var shipmentWeight = document.getElementById('shipmentWeight').value;
  
    // Check if shipment weight is a valid number
    if (!isValidWeight(shipmentWeight)) {
      alert('Please enter a valid weight in kilograms.');
      return;
    }
  
    // Proceed to the next step
    nextStep('paymentContainer');
  });
  
  function isValidWeight(weight) {
    // Regular expression to check if the input is a valid number with optional decimal point
    var weightPattern = /^\d+(\.\d{1,3})?$/;
    return weightPattern.test(weight);
  }
  
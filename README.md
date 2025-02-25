#### Milestone 1: Initialize Project Repository  

This milestone focused on setting up the GitHub repository to serve as the central hub for the e-commerce project's development. By creating the repository and initializing it with a README file, the project gained a clear starting point with version control, ensuring organization and collaboration as the development progresses.

#### Milestone 2: Project Setup and Login Page 
This milestone focused on establishing the foundational structure and core functionalities of the project. 

Key tasks included:
1. *Structuring the Project:* Created a clear folder hierarchy to organize frontend and backend components efficiently.
2. *Frontend Setup:* Initialized a React app and configured Tailwind CSS for streamlined styling.
3. *Backend Setup:* Built a Node.js server to handle API requests and backend logic.
4. *Development Tools:* Integrated optional extensions to enhance productivity.
5. *Login Page:* Designed and developed a functional, styled login page as the first user-facing feature of the application.

#### Milestone 3: Backend Structure and Server Setup  

This milestone focused on setting up the backend infrastructure and establishing a robust foundation for server-side operations. 

Key tasks included:  
1. *Organizing Backend Files:* Created a structured hierarchy for routes, controllers, models, middleware, and utilities to ensure scalability and maintainability.  
2. *Server Setup:* Built a backend server using Node.js and Express, configured to listen on a designated port.  
3. *Database Integration:* Connected MongoDB for efficient data storage and verified the connection between the server and database.  
4. *Error Handling:* Implemented clear error messages to enhance debugging and provide better feedback for users.  

This milestone establishes a functional backend and prepares the project for future development.  

#### Milestone 4: User Management and File Upload  

This milestone focuses on implementing user data handling and file upload functionality. 

Key achievements include:  
1. *User Model:* Defined a blueprint for storing user data in the database, ensuring a consistent structure for user-related information.  
2. *User Controller:* Developed logic to manage user operations such as adding new users and retrieving user information.  
3. *File Upload Setup:* Integrated and configured Multer to enable file uploads (e.g., user profile images) and store them efficiently in the application.  

By completing this milestone, the application now supports user management and file uploads, enhancing its core functionality.  

#### Milestone 5: Signup page and Validation  

This milestone focuses on creating a user-friendly Sign-Up page and implementing essential form validation. Key tasks include:  

1. *Frontend UI:* Designed a clean and intuitive Sign-Up page where users can provide their details (Name, Email, Password) to create an account.  
2. *Form Validation:* Ensured user inputs are validated before submission, checking for proper email formats and secure passwords to prevent errors and maintain data integrity.  

By completing this milestone, the application now has a functional and secure user registration interface.

## Milestone 6: User Registration and Authentication
1. User Creation Endpoint (/create-user):
 Implemented an endpoint to create a new user.
 Validated the email to ensure the user doesn’t already exist.
 Successfully handled file uploads (e.g., avatar) using multer.

 2. Password Hashing:
 Used bcryptjs to hash passwords before saving them to the database, ensuring secure password storage.

4. Error Handling:
Incorporated centralized error handling using a custom ErrorHandler class.
Applied catchAsyncErrors middleware to manage asynchronous errors in the routes.

5. User Data Storage:
Stored user details (e.g., name, email, password, avatar) in MongoDB with encrypted password.

6. Email Notification (Optional):
Integrated an email notification system to send a welcome email to the user after successful registration (using sendMail).

7. JWT Token Generation:
Added a method to generate JWT tokens upon user login (for future use in authentication routes).

#### Milestone 7: User Authentication and Login  

This milestone focused on implementing a secure login system by verifying user credentials and ensuring proper authentication.  

**Key tasks included:**  

1. **Create Login Endpoint:**  
   - Developed an API endpoint to accept user credentials (email/username and password).  
   - Retrieved the corresponding user from the database for authentication.  

2. **Validate Password:**  
   - Used `bcrypt` to hash the entered password.  
   - Compared the hashed input with the stored hashed password to authenticate users.  

This milestone enhances security by ensuring only authenticated users gain access.  

#### Milestone 8: Product Card Component and Display  

This milestone focused on designing and implementing a reusable card component to display products effectively on the products page.  

**Key tasks included:**  

1. **Create the Card Component:**  
   - Designed a reusable card component with props for product details (e.g., name, image, price).  
   - Ensured a visually appealing layout to enhance user experience.  

2. **Design the Homepage Layout:**  
   - Implement a grid or flexbox layout for structured product display.  
   - Used mapping to dynamically render multiple product cards with unique details.  

This milestone improves product presentation, creating a clean and user-friendly browsing experience.

**###Milestone 9:Create Product Form**

In this milestone, we have successfully implemented a product creation form that allows users to input all necessary product details and upload multiple images. This form serves as the foundation for managing product data, which will eventually be stored in a database and displayed on the product homepage.

Key Features Implemented

Created a form to input product details, including:

Product Name

Description

Category

Tags

Price

Stock

Email

Product Images (multiple uploads supported)

Implemented image preview functionality for uploaded images.

Used React state management (useState) to handle form inputs dynamically.

Configured React Router to include a new route for the product creation page.

###Milestone 10: Product Management Enhancements


**Milestone 10 focuses on refining the product creation and management process. This includes improving the form submission flow, handling errors effectively, and ensuring a seamless user experience.**

Key Features Implemented

Form Submission & Error Handling

Implemented a structured form to capture product details including:

Name

Description

Price

Category

Tags

Stock

Email

Multiple Images

Integrated multiple image selection for better product representation.

Enhanced error handling using try-catch methods to catch and display errors during product creation.

Debugging tools added to log form data before submission for easier troubleshooting.

API Integration

Built a POST endpoint to receive and validate product data.

Used FormData to handle file uploads efficiently.

Sent form data to the backend API, ensuring proper request formatting (multipart/form-data).

Provided real-time feedback to users on successful product creation or errors encountered.

Why Validation & Error Handling?

Ensures only valid data is stored in the database.

Helps users identify and correct input mistakes quickly.

Prevents incomplete or invalid submissions, reducing inconsistencies in the system.

Technologies Used

React.js for frontend UI

Express.js for backend API handling

MongoDB & Mongoose for database storage

Axios for HTTP requests

Postman for API testing

Next Steps & Enhancements

Implement user authentication to restrict product uploads to authorized users.

Develop an admin panel to manage and moderate product listings.

Introduce real-time image preview and editing capabilities.

Optimize database indexing for faster search and retrieval.

Repository & Submission Details

GitHub Repository: [Your Repository Link Here]

Progress Summary: This milestone enhanced the product creation process by improving form submission, adding error handling, and integrating API communication.

Submission: The repository has been updated, and all changes have been pushed successfully.
**#Milestone 11 - Fetch and Display Products Data**

In this milestone, we implemented the functionality to fetch all products from the backend and dynamically display them on the frontend using components.

Backend (Node.js & Express)
Created an API endpoint to send all product data from the backend to the frontend.
Added a route in index.js to fetch product data.
Used Mongoose to retrieve product details from the database.
Sent the retrieved data as a JSON response.
Frontend (React)
Created a function to fetch product data from the backend.

Used fetch or axios to make a GET request to the backend endpoint.
Stored the response in a state variable using the useState hook.
Used useEffect to trigger the data fetch on component mount.
Displayed the data dynamically using the ProductCard component.

Passed fetched product data as props to the ProductCard component.
Rendered multiple ProductCard components dynamically using .map().

# Milestone 12: My Products Page

## Overview
In this milestone, we will create a "My Products" page that displays all products added by a user based on their email. We will accomplish this by writing a backend endpoint to fetch products from MongoDB filtered by the user's email and dynamically displaying them on the frontend using the previously created product card component.

## Learning Goals 🎯
By the end of this milestone, you will:

- Learn how to write an endpoint to filter and send data from MongoDB based on a user's email.
- Understand how to fetch and receive data on the frontend.
- Display data dynamically using a product card component.

## Steps to Complete Milestone 12 📝

### Backend:
1. **Create an endpoint** in your backend application that retrieves all products associated with a user's email from MongoDB.
2. **Filter products** based on the email provided in the request.
3. **Send the filtered data** as a response to the frontend.

### Frontend:
1. **Write a function** to fetch the filtered product data from the backend.
2. **Process the received data** and pass it to the product card component.
3. **Dynamically display** the products on the "My Products" page.

## Notes
- This lesson will help in understanding how to filter data based on specific constraints and send it to the client efficiently.
- Ensure proper error handling for scenarios where no products are found for a given email.

## Next Steps
- Enhance the UI with better styling and user experience.
- Implement pagination if needed for better performance.
- Add authentication checks to ensure only the logged-in user's products are displayed.

**# Milestone 13: Edit Uploaded Products**
🚀 Overview
In this milestone, we implemented the Edit Product feature. Users can now update product details, with the form auto-filling existing data for a seamless editing experience.

🎯 Key Features
Edit Button added to product cards.
Auto-Fill Form with existing product details.
Update API to modify product data in MongoDB.
Form Submission updates the database with new details.
🛠️ Implementation Steps
Backend: Created an API endpoint to update product details.
Frontend: Added an edit button and handled navigation.
Auto-Fill Form: Preloaded data when editing a product.
Save Changes: Updated product details in the database.
📂 How to Run
Start the backend and frontend servers.
Click "Edit" on a product to update details.
Submit the form to save changes.



**# Milestone 14 - Product Deletion Functionality 🚀**
Overview
In this milestone, we implemented the Delete Product functionality. Users can now remove products from the database using a delete button.

Key Updates
✅ Created a backend endpoint to delete a product by ID in MongoDB.
✅ Updated the frontend to include a delete button for each product.
✅ Integrated API calls to handle the deletion process.

Submission
Code is pushed to the GitHub repository.
The repository is publicly accessible.
Ready for submission in the assignment section.

### Milestone 15: Navbar Component Integration

In this milestone, we'll create and integrate a reusable Navbar component across all screens for smooth navigation.

#### Key Tasks:
- Create a Navbar with links to:
  - Home
  - My Products
  - Add Product
  - Cart
- Make the Navbar responsive.
- Add the Navbar to all pages for easy navigation.

This milestone teaches how to build and reuse a responsive Navbar for seamless navigation.

### Milestone 16: Product Info Page

In this milestone, we will create a page to display product details, choose quantity, and add to the cart.

#### Key Tasks:
- Create a page to display product data.
- Add a quantity selector.
- Implement an "Add to Cart" button.

This milestone focuses on building a functional product info page for users.

### Milestone 17 - Cart Functionality
Overview
In this milestone, we implemented the cart functionality by creating a schema to store products in the cart and an API endpoint to handle product storage.

Tasks Completed
✅ Created a Cart Schema to store product details.
✅ Developed an API Endpoint to receive and store products in the cart.
✅ Integrated the cart functionality with the backend.

Repository
The updated code is available in the GitHub repository.

Submission
Code has been pushed to the repository.
README has been updated with the progress summary.
The repository link has been shared for submission.

### Milestone 18 - Cart Page Backend
Summary
Implemented backend functionality for the cart page by creating endpoints to fetch products inside the cart for a user.

Progress
Developed an API Endpoint for the cart page.
Created an endpoint to retrieve cart products for a user.
Integrated the cart retrieval functionality with the backend.

### Milestone 19: Cart Page UI and Quantity Adjustment
Achievements
In this milestone, I developed the cart page UI and added functionality for adjusting product quantities:

Frontend: Created a Cart Page displaying products with options to increase or decrease the quantity using + and - buttons.
Backend: Developed API endpoints to handle quantity adjustments for each product in the cart.
User Interaction: Enabled real-time updates of the cart quantity on the frontend, ensuring a smooth user experience.
Files Updated
Cart page UI and API integration.
Next Steps
Implement functionality for removing items from the cart.
Add total price calculation and checkout process.

### Milestone 20: User Profile Page

In this milestone, we will build a frontend profile page to display user data and create a backend endpoint to retrieve that data.

#### Key Tasks:
- Create a backend endpoint to send user data using their email.
- Design a frontend profile page to display the user’s profile photo, name, email, and addresses.
- Add a section for addresses with an “Add Address” button, and display “No address found” if no address exists.

<<<<<<< HEAD
This milestone enhances the user experience by providing a profile page to view and manage their information.
=======
This milestone enhances the user experience by providing a profile page to view and manage their information.
>>>>>>> 943119042a93f91878226e444f8fb56694117b29

### 🏡 Address Form – Milestone 21
📌 Overview
This project implements a frontend Address Form that allows users to input their address details, including:

Country
City
Address Line 1 & 2
Zip Code
Address Type
🎯 Features
✅ React-based address form
✅ Uses state management to store input data
✅ Navigates to the form when clicking "Add Address" in the profile page
✅ Submits the form data via API

📥 Submission
Code pushed to GitHub
Repository is publicly accessible
README updated with progress

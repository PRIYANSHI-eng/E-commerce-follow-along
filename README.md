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
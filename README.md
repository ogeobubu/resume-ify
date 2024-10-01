# Resume-ify

**Resume-ify** is a full-stack web application that allows users to create, manage, and showcase their professional resumes effortlessly. Built with React for the frontend and Node.js for the backend, this application features a beautifully designed interface inspired by the Alt School template, utilizing Tailwind CSS for styling.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **User-Friendly Interface**: An intuitive design simplifies the resume creation process.
- **Customizable Templates**: Choose from a variety of templates inspired by professional designs.
- **Secure User Authentication**: Sign up and log in securely to manage your resumes.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Technologies Used

- **Frontend**: 
  - React
  - TypeScript
  - Tailwind CSS
- **Backend**: 
  - Node.js
  - Express
  - MongoDB
- **Authentication**: 
  - Passport.js

## Installation

To get started with this project, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/ogeobubu/resume-ify.git
   cd resume-ify
   ```

2. Install the dependencies for the backend:
   ```bash
   cd server
   npm install
   ```

3. Install the dependencies for the frontend:
   ```bash
   cd src
   npm install
   ```

4. Create a `.env` file in the root of the server directory and configure your environment variables (e.g., database URI).

5. Start the backend server:
   ```bash
   cd server
   node server.js
   ```

6. Start the frontend application:
   ```bash
   cd src
   npm start
   ```

## Usage

Once the application is running, you can access it in your browser at `http://localhost:3000`. From there, you can sign up, log in, and start creating your resume.

## Folder Structure

Here's an overview of the project structure:

```
resume-ify/
├── node_modules/              # Dependencies
├── public/                    # Public assets
│   └── index.html             # Main HTML file
├── src/                       # Frontend source code
│   ├── assets/                # Static assets
│   ├── pages/                 # React components for different pages
│   │   ├── signin.tsx         # Sign-in page component
│   │   ├── signup.tsx         # Sign-up page component
│   ├── App.tsx                # Main App component
│   ├── App.css                # Main styles
│   ├── index.tsx              # Entry point for React
│   └── main.tsx               # Main application logic
├── server/                    # Backend source code
│   ├── passport-setup.js      # Passport.js configuration
│   └── server.js              # Main server file
├── .env                        # Environment variables
├── .gitignore                  # Files to ignore in Git
├── README.md                   # Project documentation
├── package.json                # Node.js dependencies and scripts
└── yarn.lock                  # Dependencies lock file
```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a new Pull Request.

## License

This project is inspired by the Alt School template design. All rights reserved to Alt School. The code for this project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Contact

For questions or feedback, please contact [ogeobubu@gmail.com](mailto:ogeobubu@gmail.com).
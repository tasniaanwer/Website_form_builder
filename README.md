# FormCraft - Custom Form Builder Platform

A modern form builder platform that allows companies and individuals to create beautiful, customized forms with their own branding and personal touch.

## Features

- 🎨 **Custom Themes & Branding** - Choose from templates or create your own unique design
- 🖱️ **Drag & Drop Builder** - Intuitive visual form builder with no coding required
- 📊 **Real-time Analytics** - Track responses and analyze form performance
- 🏢 **Team Collaboration** - Perfect for companies and organizations
- 🔐 **User Authentication** - Secure login and registration system
- 📱 **Responsive Design** - Works perfectly on all devices

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT tokens
- **Styling**: CSS3 with modern design patterns

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas connection

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tasniaanwer/Website_form_builder.git
cd Website_form_builder
```

2. Install frontend dependencies:
```bash
npm install
```

3. Set up the backend:
```bash
cd server
npm install
```

4. Configure environment variables:
Create a `.env` file in the `server` directory:
```
PORT=5001
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-jwt-secret-key
NODE_ENV=development
```

### Running the Application

1. Start the backend server:
```bash
cd server
node index.js
```

2. Start the frontend development server:
```bash
npm start
```

3. Open your browser and navigate to:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## Usage

1. **Create Account**: Sign up with your email and password
2. **Login**: Access your dashboard
3. **Build Forms**: Use the drag-and-drop interface to create custom forms
4. **Customize**: Add your branding, colors, and personal touch
5. **Share**: Deploy your forms and collect responses

## API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/me` - Get current user
- `PUT /api/users/profile` - Update user profile

### Companies
- `POST /api/companies/` - Create company
- `GET /api/companies/:id` - Get company details
- `POST /api/companies/:id/invite` - Invite team members

## Contributing

This is a personal project by [tasniaanwer](https://github.com/tasniaanwer).

## License

© 2024 FormCraft. All rights reserved.

AndrAmrut Naturals E-Commerce Platform
This is a modern, full-stack e-commerce application built with Next.js, Tailwind CSS, and TypeScript. It features a complete shopping experience from product browsing to secure checkout, along with an innovative AI-powered recipe suggestion tool.

Features
Product Catalog: Browse and search for products with detailed descriptions, images, and pricing.

Shopping Cart: Add products to a cart that persists across sessions.

User Authentication: Secure user registration and login using Google OAuth.

Checkout: A multi-step checkout process with shipping information and secure payments powered by Razorpay.

Order Management: Users can view their order history and track order status.

AI Recipe Suggester: Get recipe recommendations based on the ingredients you have and the products available in the store.

Responsive Design: A beautiful and intuitive user interface that works seamlessly on all devices.

Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

Prerequisites
Node.js (v18.18.0 or later)

npm or yarn

Installation
Clone the repository:

Bash

git clone https://github.com/sriram-dev-9/e-commerce.git
Navigate to the project directory:

Bash

cd e-commerce
Install the dependencies:

Bash

npm install
Create a .env.local file in the root of your project and add the necessary environment variables:

NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_RAZORPAY_TEST_KEY=your_razorpay_test_key
Running the Development Server
To start the development server, run:

Bash

npm run dev
Open http://localhost:9002 with your browser to see the result.

Technologies Used
Frontend:

Next.js - React framework for server-side rendering and static site generation.

React - A JavaScript library for building user interfaces.

TypeScript - A typed superset of JavaScript that compiles to plain JavaScript.

Tailwind CSS - A utility-first CSS framework for rapid UI development.

shadcn/ui - A collection of re-usable components built using Radix UI and Tailwind CSS.

Lucide React for icons.

AI & Machine Learning:

Genkit - An open-source framework from Google to help build, deploy, and monitor production-ready AI-powered features.

Payment Gateway:

Razorpay - A secure and easy-to-use payment gateway for online payments.

Deployment:

Vercel - A cloud platform for static sites and Serverless Functions.

Project Structure
The project follows a standard Next.js app directory structure:

.
├── public/
├── src/
│   ├── ai/                 # Genkit AI flows and configuration
│   ├── app/                # Next.js app directory with pages and layouts
│   ├── components/         # Reusable React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Helper functions, API clients, and utilities
│   └── styles/             # Global styles and Tailwind CSS configuration
├── .env.local              # Environment variables
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
Available Scripts
In the project directory, you can run:

npm run dev: Runs the app in development mode.

npm run build: Builds the app for production.

npm run start: Starts a Next.js production server.

npm run lint: Lints the code using ESLint.

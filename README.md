Nine Shuttles

Nine Shuttles is a full-stack e-commerce platform built for a real business case.
The project was developed as a production-oriented online store for selling products, with user authentication, product management, shopping cart, order flow, payments, email notifications, and an admin dashboard.

Project Overview

The goal of the project was to build a professional online store that could be used by a real business before launch.
The platform includes both customer-facing functionality and internal admin tools for managing products and orders.

The project reached a near-launch stage, but the business side was paused before public release.

Features

* Product catalog
* Product detail pages
* Shopping cart
* User registration and login
* Admin dashboard
* Product management
* Order management
* Stripe payment integration
* PayPal payment integration
* Email notifications with Resend
* PostgreSQL database with Prisma ORM

Tech Stack

* Next.js
* React
* TypeScript
* Prisma
* PostgreSQL
* Stripe
* PayPal
* Resend
* Tailwind CSS

Screenshots

All screenshots are stored in the /screenshots folder.

The screenshots show the main pages of the application, including the customer interface, product flow, checkout-related pages, and admin functionality.

Architecture

The application uses a full-stack Next.js structure with server-side logic, database access through Prisma, and PostgreSQL as the relational database.

Core parts of the system include:

* authentication logic
* product and order data models
* shopping cart workflow
* payment integrations
* admin-only management pages
* email notification logic

What This Project Demonstrates

This project demonstrates practical full-stack development skills:

* building a real e-commerce workflow
* designing database models with Prisma
* integrating third-party payment providers
* implementing authentication and protected admin functionality
* working with production-oriented project structure
* creating a maintainable full-stack application with TypeScript

Installation

npm install
npm run dev

Environment Variables

This project requires environment variables for database connection, authentication, payments, and email services.

Environment files are not included in the repository for security reasons.
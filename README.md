# Garuda Store — Full-Stack E-Commerce Platform

A full-stack online store developed for a badminton equipment business, covering the customer shopping experience and internal tools for managing products and orders.

The platform includes authentication, a product catalog, shopping cart, order management, payment integrations, email notifications, and a protected admin dashboard.

**Project status:** The project reached a near-launch stage before the business paused the public release.

This repository contains the application’s source code and screenshots.

## My Contribution

I developed functionality across the frontend, server-side logic, database, and third-party integrations.

My work included:

- Building product browsing, product detail pages, and shopping cart functionality.
- Implementing user registration, login, and protected administrative functionality.
- Developing tools for managing products and orders.
- Designing PostgreSQL data models and relationships using Prisma.
- Integrating Stripe and PayPal payments.
- Implementing email notifications using Resend.
- Connecting the customer-facing interface with server-side business logic and data storage.

## Key Features

### Customer Experience

- Product catalog and product detail pages.
- User registration and login.
- Shopping cart.
- Checkout and order flow.
- Stripe and PayPal payment options.
- Email notifications.

### Administration

- Protected admin dashboard.
- Product management.
- Order management.

## Technology Stack

| Area | Technologies |
| --- | --- |
| Application framework | Next.js |
| User interface | React, TypeScript, Tailwind CSS |
| Database | PostgreSQL |
| Database access | Prisma ORM |
| Payments | Stripe, PayPal |
| Email notifications | Resend |

## Architecture

The application uses a full-stack Next.js structure, with user interfaces, server-side logic, and database access within the same project.

Core responsibilities include:

- **Presentation:** React components styled with Tailwind CSS provide the storefront and administrative interfaces.
- **Application logic:** server-side functionality handles authentication, products, shopping cart workflows, orders, and integrations.
- **Data access:** Prisma models and queries connect the application to PostgreSQL.
- **External services:** Stripe and PayPal support payments, while Resend handles email notifications.

Administrative functionality is protected to separate product and order management from the customer shopping experience.

## Project Scope and Status

Garuda Store was developed around a real business case, with the goal of supporting the sale of badminton equipment through a dedicated online store.

The project progressed to a near-launch stage, but the business paused the public release. It is presented here as a portfolio project demonstrating the implemented application, rather than as a currently operating store.

## Screenshots

Screenshots are available in the [`screenshots`](./screenshots/) folder.

They show examples of:

- The customer-facing storefront.
- Product browsing and detail pages.
- Shopping cart and checkout-related screens.
- Administrative functionality.

## Local Development

Running the application locally requires a configured PostgreSQL database and environment variables for authentication, payments, and email services.

The basic dependency installation and development commands are:

```bash
npm install
npm run dev
```

These commands do not configure the database or external services. The required environment settings and any Prisma database setup must be completed before the corresponding application features can work.

## Environment Configuration

The application requires configuration for:

- PostgreSQL database access.
- Authentication.
- Stripe.
- PayPal.
- Resend.

Use the variable names referenced by the application’s configuration and source files. Environment files containing credentials are not included in this repository.

## What This Project Demonstrates

- Full-stack application development with Next.js, React, and TypeScript.
- Relational data modelling with PostgreSQL and Prisma.
- Implementation of product, cart, and order workflows.
- Integration of payment and email services.
- Authentication and protected administrative functionality.
- Development of an e-commerce application around real business requirements.

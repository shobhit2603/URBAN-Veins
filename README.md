<div align="center">

# 🕶️ THE Paddler (Urban Veins)

### _Your Premium, Modern E-commerce Destination for Luxury & Street Culture Fashion_

**Immersive Parallax UI · Google & Apple Social Login · NextAuth JWT Sessions · Mongoose & MongoDB Atlas · PhonePe Checkout Integration**

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-v5-0053b3?style=for-the-badge&logo=auth0&logoColor=white)](https://next-auth.js.org/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-F1F2F6?style=for-the-badge&logo=cloudinary&logoColor=3448C5)](https://cloudinary.com/)

</div>

---

## 📖 What is THE Paddler / Urban Veins?

**THE Paddler (Urban Veins)** is a robust, production-ready full-stack e-commerce web application designed at the intersection of luxury fashion and street culture. It delivers an immersive, high-performance shopping experience coupled with advanced administrative capabilities:
- **Immersive User Interface** utilizing custom mouse parallax, interactive 3D composition, smooth scrolling powered by **Lenis**, and micro-animations via **Framer Motion**.
- **Secure Authentication System** built on **NextAuth.js (v5)** supporting email/password credentials, Google, and Apple social logins.
- **Robust E-Commerce Workflow** enabling dynamic cart updates (stored directly in MongoDB), coupon-based discounts, product reviews, and a secure checkout flow integrated with the **PhonePe Payment Gateway**.
- **Interactive Admin Console** allowing admins to manage products (CRUD), view and edit order statuses, and track coupon activity.

The application leverages Next.js 16's unified App Router architecture, facilitating seamless backend API handling and responsive client-side rendering.

---

## ✨ Features

- 🔐 **Multi-Provider Authentication** — Register and login securely using email credentials, Google, or Apple accounts. Powered by NextAuth.js (v5) with stateless JWT sessions.
- 🛍️ **Intuitive Product Catalog** — Explore, search, and filter premium items by categories, genders (`idealFor`), sub-types, and featured/new season tags.
- 🛒 **Persistent Shopping Cart** — Real-time cart calculations and updates. Items are saved per-user in MongoDB, allowing seamless access across multiple sessions.
- 🎫 **Smart Coupon System** — Apply coupon codes during checkout with validation checks for expiration, minimum purchase value, and discount types (flat discount vs. percentage).
- 💳 **PhonePe Payment Gateway** — Fully integrated checkout process featuring a **Mock Mode** for developer testing and a production-ready redirect checkout flow with secure SHA-256 X-Verify checksum validation and webhook handlers.
- 📸 **Cloudinary Asset Storage** — High-performance image loading and storage. Uses secure backend signatures for client-side uploads.
- ✍️ **Product Review & Rating** — User reviews with star ratings that dynamically recalculate products' overall score.
- 🛠️ **Unified Admin Dashboard** — Control panel for managing products, tracking order statuses, managing inventories/variants, and configuring active discount coupons.

---

## 🏗️ Tech Stack

### Frontend & UI
| Technology | Purpose |
|---|---|
| Next.js 16 | React framework with App Router & Server Actions |
| React 19 | Core UI rendering engine |
| Tailwind CSS v4 | Native utility-first stylesheet layouts and styling |
| Motion (Framer) | Fluid luxury mouse parallax and entry animations |
| Lenis | High-performance smooth inertial scrolling |
| Lucide React | Clean, scalable premium icon design resources |
| React Context | Centralized client-side state management (Cart, UI states) |
| Sonner | Elegant toast notification alerts |

### Backend & Database
| Technology | Purpose |
|---|---|
| Next.js API Routes | Serverless REST API endpoints |
| MongoDB Atlas | Managed cloud NoSQL database for users, orders, coupons, and products |
| Mongoose | Object Document Mapper (ODM) modeling and validation schema |
| NextAuth.js (v5) | Social OAuth (Google, Apple) and Credentials authentication handler |
| PhonePe API | Seamless payment request signing, redirection, and webhook callbacks |
| Cloudinary | Secure cloud hosting and optimization for product images |
| Crypto (Node.js) | SHA-256 hash generation for secure payment checksums |
| Bcrypt.js | Secure hashing algorithm for user credentials passwords |

---

## 📂 Project Structure

```
THE-Paddler/
├── app/                      # Next.js App Router (Pages & APIs)
│   ├── (auth)/               # Authentication pages
│   │   ├── login/            # User sign-in page
│   │   └── signup/           # User registration page
│   ├── admin/                # Admin Management dashboard
│   │   ├── orders/           # Admin order review pages
│   │   └── products/         # Admin product CRUD forms
│   ├── api/                  # Unified Backend REST API Endpoints
│   │   ├── admin/            # Admin authorization check and configurations
│   │   ├── auth/             # Social OAuth configurations & session endpoints
│   │   ├── cart/             # Cart item additions, updates, and deletes
│   │   ├── coupons/          # Coupon creation and validation checks
│   │   ├── products/         # Product catalog reads and listings
│   │   ├── create-phonepe-payment/ # Payment initiation & pending order logging
│   │   └── phonepe-callback/ # Secure transaction state webhooks
│   ├── cart/                 # Shopping cart frontend review page
│   ├── context/              # Global React Contexts (e.g. CartContext)
│   ├── product/              # Individual item detailed viewing page
│   ├── profile/              # User account & purchase history pages
│   ├── shop/                 # Product search, filter, and sorting grid
│   ├── globals.css           # Global Tailwind CSS style layout definitions
│   ├── layout.js             # Root template wrapper and Context Injection
│   └── page.js               # Main homepage layout entry point
│
├── components/               # Reusable React UI Elements
│   ├── HomePage/             # Homepage elements (Hero with mouse parallax)
│   ├── ProductPage/          # Item specific pages (Review lists, sizing options)
│   ├── ShopPage/             # Shop filters, sorting menus, product cards
│   ├── ui/                   # Micro components (Custom cursor, dynamic selection lists)
│   ├── Navbar.jsx            # Dynamic navigation bar with cart indicator
│   └── Footer.jsx            # Universal footer component
│
├── lib/                      # Helper Utilities & Core Connectors
│   ├── dbConnection.js       # Mongoose Atlas connection instance handler
│   ├── clientPromise.js      # MongoDB base client connector for NextAuth Adapter
│   ├── lenis.js              # Lenis smooth-scroll initiator hook
│   └── productsFallback.js   # Local catalog mock database for fallback
│
├── models/                   # Mongoose Database Schemas
│   ├── Coupon.js             # Coupon definitions & validity validations
│   ├── Order.js              # Order records & transaction details
│   ├── Product.js            # Product details, stocks, and variant parameters
│   ├── Review.js             # Customer comments & score records
│   └── User.js               # Auth details, roles, profiles, and cart records
│
├── public/                   # Static media, icons, and logo assets
├── auth.js                   # NextAuth v5 authentication handlers config
├── package.json              # Project manifest and core configurations
└── next.config.mjs           # Next.js compiler settings and image loaders
```

---

## 🔌 API Reference

### 🔐 Authentication — `/api/auth` (via NextAuth.js)

| Method | Endpoint | Authorization | Description |
|--------|----------|---------------|-------------|
| `GET`  | `/api/auth/signin` | Public | Initiates the credentials, Google, or Apple auth flow |
| `POST` | `/api/auth/signin/credentials` | Public | Validates email/password credentials and establishes user session |
| `GET`  | `/api/auth/session` | Bearer/Cookie | Resolves profile details and roles of the authenticated session |
| `POST` | `/api/auth/signout` | Bearer/Cookie | Clears the session JWT and logs the user out |
| `POST` | `/api/register` | Public | Registers a new user account with hashed passwords |

### 🛒 Cart & Products — `/api/cart` & `/api/products`

| Method | Endpoint | Authorization | Description |
|--------|----------|---------------|-------------|
| `GET`  | `/api/products` | Public | Retrieves all active products. Supports query sorting, categories, search, gender filters |
| `POST` | `/api/products` | Admin | Creates a new product variant, title, tags, and pricing |
| `GET`  | `/api/cart` | Authenticated | Fetches user's saved shopping cart with populated product data |
| `POST` | `/api/cart` | Authenticated | Adds a product variant (specified by size & color) to cart; updates quantity if exists |
| `PUT`  | `/api/cart` | Authenticated | Modifies quantity of a specific item in user's cart |
| `DELETE` | `/api/cart` | Authenticated | Removes an item from the user's cart |

### 💳 Checkout & Admin Orders — `/api/orders` & `/api/create-phonepe-payment`

| Method | Endpoint | Authorization | Description |
|--------|----------|---------------|-------------|
| `POST` | `/api/create-phonepe-payment` | Authenticated | Initiates PhonePe checkout. Calculates total with coupon discount, validates stock, logs ORD and returns redirect URL |
| `POST` | `/api/phonepe-callback` | Webhook (Public) | Securely receives transaction results directly from PhonePe backend, updating Order status |
| `GET`  | `/api/orders` | Authenticated | Retrieves order purchase history for the logged-in user |
| `GET`  | `/api/orders/:id` | Authenticated | Retrieves single order details if it belongs to the logged-in user |
| `GET`  | `/api/admin/orders` | Admin | Fetches all system orders for admin analytics and processing |
| `PUT`  | `/api/admin/orders/:id` | Admin | Updates order payment status or order fulfillment stages |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js (version 20+)
- MongoDB Atlas database connection string
- Google Cloud & Apple Developer credentials (for OAuth)
- Cloudinary developer API credentials
- PhonePe developer merchant keys (optional if testing with `MOCK_MODE=true` in `app/api/create-phonepe-payment/route.js`)

---

### Running Manually (Locally)

#### 1. Clone the repository
```bash
git clone https://github.com/shobhit2603/URBAN-Veins.git
cd URBAN-Veins
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configure environment variables
Create a `.env.local` file in the root directory:
```env
BASE_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string

# Next-Auth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_jwt_signing_secret

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Apple OAuth Credentials (Optional)
APPLE_CLIENT_ID=your_apple_client_id
APPLE_CLIENT_SECRET=your_apple_client_secret

# Cloudinary Credentials (Media storage)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# PhonePe Checkout Credentials (Optional if MOCK_MODE=true)
PHONEPE_MERCHANT_ID=your_phonepe_merchant_id
PHONEPE_SALT_KEY=your_phonepe_salt_key
PHONEPE_SALT_INDEX=your_phonepe_salt_index
PHONEPE_PAY_API_URL=your_phonepe_api_url
```

#### 4. Run the development server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🌐 Deployment

| Service | Host Provider | Configuration |
|---|---|---|
| **E-Commerce Application** | **Vercel** or **Render** | Connect your Git repository, set the root directory as the root folder, configure environment variables in the provider dashboard. |
| **Database** | **MongoDB Atlas** | Managed MongoDB Cloud Database |
| **Media Assets Storage** | **Cloudinary** | Image hosting and delivery cloud provider |

> [!NOTE]
> Ensure that you configure the production redirect URL in your Google Developer console (e.g. `https://your-domain.com/api/auth/callback/google`) and that your `NEXTAUTH_URL` environment variable points to your production domain.

---

## 📄 License

Distributed under the MIT License.

---

<div align="center">

Built with ❤️ by [Shobhit](https://github.com/shobhit2603)

</div>

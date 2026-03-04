# LocalBiz – Local Business Discovery Portal

## 📄 Project Abstract

**LocalBiz** is a full-stack web application designed to bridge the gap between local businesses and their potential customers within a community. Built using modern web technologies — **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS 4**, and **MongoDB Atlas** — the platform serves as a comprehensive digital directory that empowers users to **discover, explore, and connect** with local businesses across multiple categories such as restaurants, gyms, salons, healthcare providers, educational institutions, and more.

The application features a **dual-role architecture**: end-users can browse and search for businesses in their locality, while business owners can register, manage, and promote their business listings through a dedicated dashboard. Authentication is handled using **JWT (JSON Web Tokens)** with secure HTTP-only cookies, and passwords are hashed using **bcrypt**, ensuring industry-standard security practices.

The platform addresses a critical need in the Indian market where small and medium-scale local businesses often lack an affordable, centralised online presence. By offering a **free-to-use, feature-rich directory**, LocalBiz democratises digital visibility for local enterprises while simultaneously providing consumers with a trustworthy, community-driven platform to make informed decisions.

The project follows a **component-based, modular architecture** with a clean separation of concerns — API routes, data models, reusable UI components, providers (auth & theme), and utility libraries. It supports **light and dark mode** theming, **responsive design** for mobile and desktop, and features a polished, premium user interface with micro-animations, glassmorphism effects, and modern typography.

---

## 🛠️ Technology Stack

| Layer          | Technology                                      |
| -------------- | ----------------------------------------------- |
| Framework      | Next.js 16 (App Router)                         |
| Frontend       | React 19, TypeScript                            |
| Styling        | Tailwind CSS 4, PostCSS                         |
| Icons          | Lucide React                                    |
| Fonts          | Google Fonts (DM Sans, Sora)                    |
| Database       | MongoDB Atlas (via Mongoose 9)                  |
| Authentication | JWT (jsonwebtoken) + bcryptjs                   |
| File Upload    | Native FormData API + Server-side file storage  |
| Deployment     | Vercel-ready (Next.js optimised)                |

---

## ✅ Existing Features (Currently Implemented)

### 1. User Authentication System
- **User Signup** — Registration with name, email, and password (min 6 chars); passwords hashed with bcrypt (12 salt rounds); duplicate email detection.
- **User Login** — Email/password authentication with JWT token generation; secure HTTP-only cookie storage with 7-day expiry.
- **User Logout** — Cookie-based session clearing.
- **Session Persistence** — `/api/auth/me` endpoint for verifying logged-in user; auto-refresh on page load via AuthProvider context.

### 2. Business Management (CRUD)
- **Register Business** — Authenticated users can add a business with: business name, category, description, phone, email, website, full address (street, city, state, pincode, area/locality), opening hours, and images.
- **View Own Businesses** — Dashboard page lists all businesses owned by the logged-in user with image previews, category badges, location, and phone info.
- **Edit Business** — Owners can update any field of their business listing.
- **Delete Business** — Owners can permanently remove their business listing with confirmation prompt.

### 3. Image Upload System
- Server-side file upload API (`/api/upload`).
- Supports JPEG, PNG, WebP, and GIF formats.
- File size capped at 5 MB per image.
- Unique filename generation to prevent conflicts.
- Files stored in `/public/uploads/` directory.

### 4. Landing Page / Homepage
- **Hero Section** — Eye-catching gradient hero with search bar, quick-tag pills (Restaurants, Gyms, Salons, etc.), CTA buttons, and a live business panel showcasing nearby businesses.
- **Trust Stats Bar** — 50K+ Businesses, 2M+ Users, 500K+ Reviews, 200+ Cities.
- **Browse by Category Grid** — 6 icon-based category cards (Restaurants, Gyms, Salons, Shopping, Education, Healthcare).
- **Featured Listings** — Curated business cards with ratings, reviews, open/closed status, and descriptions.
- **Features Section** — Highlights: Search & Discover, Trusted Reviews, Business Dashboard.
- **Categories Section** — 8 browsable categories with listing counts.
- **How It Works** — 3-step guide: Search → Explore → Review.
- **Testimonials** — Community reviews from Mumbai, Bangalore, Ahmedabad users.
- **CTA Section** — Final call-to-action with trust badges.

### 5. UI/UX Design
- **Dark/Light Mode** — Full theme toggle via ThemeProvider with system preference detection.
- **Responsive Navbar** — Sticky header with scroll detection, mobile hamburger menu, auth-aware navigation (shows Dashboard/Logout when logged in, or Login/Signup when not).
- **Footer** — Full-width footer component.
- **Premium Design** — Glassmorphism panels, smooth gradients, micro-animations, hover effects, modern rounded corners (2xl/3xl), shadow transitions.

### 6. Static Pages
- **About Page** (`/about`)
- **Contact Page** (`/contact`) — Contact form component.

### 7. Backend Architecture
- **MongoDB Connection Caching** — Global Mongoose connection cache to prevent multiple connections during Next.js hot-reload in development.
- **RESTful API Design** — Proper HTTP methods (GET, POST, PUT, DELETE) with appropriate status codes (200, 201, 400, 401, 403, 404, 409, 500).
- **Owner-based Authorization** — Only business owners can edit/delete their own listings (403 Forbidden for others).
- **Input Validation** — Required field validation on business creation; password length checks on signup.

---

## 🚀 Proposed Future Features (What to Add)

### Phase 1: Core Enhancements

| # | Feature | Description |
|---|---------|-------------|
| 1 | **Public Business Listing Page** | A public-facing page (`/businesses`) where any visitor (without login) can browse ALL businesses with search, filters (by category, city, area, rating), and pagination. |
| 2 | **Individual Business Detail Page** | A dedicated page (`/business/[id]`) showing full details: name, description, all images in a gallery/carousel, map location, contact info, opening hours, and customer reviews. |
| 3 | **Search & Filter Functionality** | Implement real search across business name, category, city, area with debounced input. Add server-side filtering and sorting (by rating, newest, nearest). |
| 4 | **Ratings & Reviews System** | Allow authenticated users to leave star ratings (1–5) and text reviews for businesses. Display average rating, total review count, and individual review cards on the business detail page. Create a `Review` model in MongoDB. |
| 5 | **Google Maps Integration** | Embed Google Maps on business detail pages using latitude/longitude coordinates. Add a map view for browsing businesses geographically. |

### Phase 2: User Experience

| # | Feature | Description |
|---|---------|-------------|
| 6 | **User Profile Page** | Allow users to view/edit their profile (name, avatar, bio). Show their reviews and saved businesses. |
| 7 | **Bookmark / Save Businesses** | Let users save/favourite businesses for quick access later. Create a saved businesses section in the dashboard. |
| 8 | **Advanced Search with Autocomplete** | Add a search suggestions dropdown with real-time autocomplete as users type — showing business names, categories, and locations. |
| 9 | **Business Hours with Open/Closed Status** | Parse and display structured opening hours (e.g., Mon–Fri: 9 AM – 6 PM). Show real-time "Open Now" or "Closed" badges. |
| 10 | **Image Gallery & Carousel** | Multi-image viewer with lightbox effect on business detail pages. Allow business owners to upload multiple images and reorder them. |

### Phase 3: Growth & Engagement

| # | Feature | Description |
|---|---------|-------------|
| 11 | **Email Notifications** | Send email confirmations on signup, business registration, and when a new review is posted (using Nodemailer or Resend). |
| 12 | **Admin Panel** | A super-admin dashboard to manage all users, businesses, and reviews. Approve/reject business listings, flag inappropriate reviews. |
| 13 | **Business Analytics Dashboard** | Show business owners insights: profile views, review trends, search impressions, clicks-to-call, and website visits over time. |
| 14 | **Social Sharing** | Allow users to share business listings on WhatsApp, Facebook, Twitter, and copy link. Add Open Graph meta tags for rich link previews. |
| 15 | **SEO Optimization** | Dynamic meta tags, structured data (JSON-LD) for businesses, sitemap generation, and canonical URLs for better Google ranking. |

### Phase 4: Advanced Features

| # | Feature | Description |
|---|---------|-------------|
| 16 | **Geolocation-based Discovery** | Use browser Geolocation API to auto-detect user's location and show nearby businesses sorted by distance. |
| 17 | **Multi-language Support (i18n)** | Support Hindi, Gujarati, and other regional languages using `next-intl` or `next-i18next`. |
| 18 | **Business Categories Management** | Dynamic categories from the database instead of hardcoded. Allow admins to add/edit/delete categories with icons and colours. |
| 19 | **Claim Your Business** | Allow unregistered business owners to claim existing business profiles, verify ownership via email/phone OTP. |
| 20 | **Progressive Web App (PWA)** | Add PWA support with offline caching, push notifications, and "Add to Home Screen" for mobile users. |

---

## 🎯 Benefits of the Project

### For Users / Consumers
1. **Centralised Discovery** — One-stop platform to find all types of local businesses instead of searching across multiple platforms.
2. **Trusted Decision Making** — Community-driven reviews and ratings help users make informed choices.
3. **Time Saving** — Advanced search and filtering quickly narrows down the best options by location, category, and rating.
4. **Free Access** — No subscription or payment required to browse and use the platform.
5. **Dark Mode Support** — Comfortable browsing experience in low-light conditions.

### For Business Owners
1. **Free Digital Presence** — Small businesses get online visibility without paying for a website or advertising.
2. **Self-Service Management** — Business owners can independently register, update, and manage their listings through a user-friendly dashboard.
3. **Customer Engagement** — Direct display of contact details (phone, email, website) drives customer enquiries and footfall.
4. **Image Showcase** — Visual appeal through image uploads to attract potential customers.
5. **Community Trust** — Positive reviews and ratings build credibility and trustworthiness.

### For the Community
1. **Local Economy Support** — Promotes and supports small and medium businesses in the community.
2. **Information Transparency** — Accurate, up-to-date information about local services reduces misinformation.
3. **Neighbourhood Connectivity** — Strengthens the connection between local services and residents.

### Technical Benefits
1. **Modern Tech Stack** — Built with the latest versions of Next.js, React, and TypeScript for performance and maintainability.
2. **Scalable Architecture** — Modular, component-based design allows easy addition of new features.
3. **Secure by Design** — JWT authentication, bcrypt password hashing, HTTP-only cookies, and owner-based authorization.
4. **Responsive Design** — Works seamlessly on mobile phones, tablets, and desktops.
5. **Cloud-Ready** — MongoDB Atlas for database + Vercel-ready deployment = zero infrastructure management.

---

## 📊 Project Structure Overview

```
local-business-discovery-portal/
├── app/
│   ├── api/
│   │   ├── auth/          # Login, Signup, Logout, Me endpoints
│   │   ├── business/      # CRUD operations for businesses
│   │   └── upload/        # Image upload endpoint
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── dashboard/         # User dashboard (list, register, edit businesses)
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   ├── layout.tsx         # Root layout (Navbar + Footer + Providers)
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/
│   ├── auth/              # LoginForm, SignupForm
│   ├── forms/             # ContactForm
│   ├── layout/            # Navbar, Footer
│   ├── providers/         # AuthProvider, ThemeProvider
│   └── sections/          # Hero, Features, Categories, HowItWorks, Testimonials, CTA
├── lib/
│   ├── auth.ts            # JWT sign/verify/getCurrentUser helpers
│   └── dbConnect.ts       # MongoDB connection with caching
├── models/
│   ├── Business.ts        # Business Mongoose schema
│   └── User.ts            # User Mongoose schema
├── public/
│   └── uploads/           # Uploaded business images
└── package.json
```

---

## 📝 Conclusion

**LocalBiz** is a well-architected, production-grade local business discovery platform that already implements core functionalities — authentication, business CRUD, image uploads, and a premium landing page. With the proposed future features (public listings, reviews, maps, analytics, admin panel, PWA), the project has the potential to evolve into a full-scale community-driven business directory comparable to platforms like **Justdial**, **Google My Business**, or **Yelp**, specifically tailored for the Indian local business ecosystem.

---

*Document generated on: 23 February 2026*
*Project: LocalBiz — Local Business Discovery Portal*

# Deploying Amazon Clone (Centric E-Commerce Platform)
## Project Structure
- Frontend (React + Vite.js)
- Backend (Node.js + Express + Prisma)
- Database MySQL บน Aiven
- Auth: Clerk
- Payment: Stripe
- File Upload: Cloudinary
- Real-time Chat: Socket.io

# Frontend Deployment – Vercel
- Hosting: Vercel
- Framework:	React + Vite
- Auth: Clerk (via @clerk/clerk-react)
Domain: 	https://amazon-clone-frontend-web.vercel.app
- Backend:  API URL	setup in .env.local
- VITE_API_URL=https://amazonclone-backendserver.onrender.com
- Routing: Using React Router + Dynamic Routing and setup vercel.json
json<br>{<br> "rewrites": [ { "source": "/(.*)", "destination": "/" } ]<br>}<br>
### Auto deploy when git push to branch main on GitHub

# Backend Deployment – Render
- Hosting: Render
- Framework: Node.js + Express.js
- ORM: Prisma
- Domain: https://amazonclone-backendserver.onrender.com
- Env: setting Render Dashboard
- Auth Middleware	Clerk (ผ่าน @clerk/express)
### Auto deploy when git push to branch main on GitHub

# Database	MySQL from Aiven
- Hosting: Aiven
- DB Name: centric
- SSL Connection: Using ca.pem from Aiven
- .env (Backend): DATABASE_URL="mysql://...@...aivencloud.com:PORT/dbname?sslaccept=verify-ca&sslca=./prisma/certs/ca.pem"


# Auth – Clerk
Using @clerk/clerk-react และ @clerk/express

- Frontend: use useUser(), SignInButton, UserButton
- Backend: use clerkMiddleware() และตรวจสอบ req.auth.userId

# Payment – Stripe
1. Create Payment Intent at Backend
2. Connect with API /user/checkout-session
3. Use stripe.redirectToCheckout() at Frontend
4. Redirect to PaymentComplete-Page after payment success

# Cloudinary
Use for upload product pictures
setup at .env Backend:
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Summary the important files
.env (Backend): DATABASE_URL, Clerk, Cloudinary, Stripe key
.env.local (Frontend): VITE_API_URL, Clerk key
vercel.json: Rewrite routing for Vercel
server.js:	Start Express Server
AppRouter.jsx:	Manage Routing, all routes in project
vite.config.js:	set Vite, plugin react

# GitHub Repositories
Frontend Repo (olliewiranphatDEV/AmazonClone-FrontendWEB)
Backend Repo (olliewiranphatDEV/AmazonClone-BackendServer)
Live Demo : https://amazon-clone-frontend-web.vercel.app/
Live Backend : hosted on Render (protected endpoints)
Cloud Database: MySQL hosted on Aiven (secured access)


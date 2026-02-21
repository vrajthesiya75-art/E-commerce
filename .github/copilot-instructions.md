# Copilot Instructions for E-commerce React + Vite Project

## Project Overview
- **Architecture:** Modular React app using Vite for fast builds and HMR. Features are organized by domain in `src/features/` (auth, cart, products, user).
- **API Integration:** All API calls use a shared `axiosInstance` in `src/api/axiosInstance.js` (base URL: `https://dummyjson.com`). Auth token is auto-attached from `localStorage`.
- **Routing:** Uses `react-router-dom`. Protected routes are handled by `PrivateRoute.jsx` (checks for `accessToken` in `localStorage`).
- **UI:** Uses `react-bootstrap` and `framer-motion` for styling and animation. Demo credentials are provided in the login form.

## Developer Workflows
- **Start Dev Server:** `npm run dev` (or `yarn dev`) — launches Vite with HMR.
- **Build for Production:** `npm run build` — outputs static files.
- **Preview Production Build:** `npm run preview` — serves built files locally.
- **Lint:** `npm run lint` — uses ESLint with custom config (`eslint.config.js`).

## Patterns & Conventions
- **Feature Folders:** Each domain (auth, cart, products, user) has its own folder under `src/features/`.
- **API Calls:** Always use `axiosInstance` for HTTP requests. Example:
  ```js
  import axiosInstance from "../../api/axiosInstance";
  const res = await axiosInstance.get("/products");
  ```
- **Auth:** Store `accessToken` and user info in `localStorage` after login. Use `PrivateRoute` for protected pages.
- **Product Listing:** `ProductList.jsx` fetches categories and products, supports search and filtering, and uses Bootstrap for layout.
- **Demo Mode:** Login form displays demo credentials for quick access.

## Integration Points
- **External APIs:** All data comes from `https://dummyjson.com`.
- **UI Libraries:** `react-bootstrap`, `framer-motion`.
- **Routing:** `react-router-dom`.

## Key Files & Directories
- `src/api/axiosInstance.js` — API setup and token handling
- `src/features/auth/Login.jsx` — login logic and demo credentials
- `src/features/auth/PrivateRoute.jsx` — route protection
- `src/features/products/ProductList.jsx` — product search, filter, and display
- `eslint.config.js` — custom lint rules
- `vite.config.js` — Vite setup

## Special Notes
- **No TypeScript:** Project is JS-only, but can be extended (see README).
- **Empty Stubs:** Some files (e.g., `cartAPI.js`, `UserProfile.jsx`) are placeholders for future features.

---

> Update this file if you add new features, change API endpoints, or modify project structure.

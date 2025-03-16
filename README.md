# NoorNFT - Art NFT Marketplace (Inactive)

## 🚨 Project Status: No Longer Active
This project is no longer actively maintained, but the code is available for reference and use.

---

## 🎨 Project Overview
NoorNFT is a digital marketplace for artists and collectors to buy, sell, and showcase art NFTs. The platform allows users to explore NFT collections created by artists, add them to the cart, and proceed with checkout. Users can also switch to "Artist Mode" to create and publish NFT collections for sale. Artists receive royalties on sales, and users can follow their favorite artists.

### 🔥 Key Features
- **User Mode:** Sign up, browse NFT collections, add to cart, and purchase.
- **Artist Mode:** Create NFTs, group them into collections, and publish them for sale.
- **Royalties System:** Artists earn a percentage on NFT sales.
- **Artist Packages:** Special promotional packages to feature NFT collections.
- **Admin Portal:** Approve/reject artist requests, manage user roles, and approve featured collection requests.
- **Social Features:** Follow favorite artists and track their collections.

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express.js, MongoDB
- **Frontend:** React.js, TypeScript, JavaScript
- **Authentication:** JWT authentication, Bcrypt encryption
- **Validation:** Joi validation
- **File Handling:** Multer
- **NFT Storage:** Pinata (for NFT storage and metadata management)
- **Email Services:** SendGrid SDK

---

## 📊 Database Schema & ERD
The platform follows a structured schema to efficiently manage users, artists, NFTs, transactions, and royalties.

### **Entities and Relationships:**
- **User:** Stores user details, authentication, and role (user/artist/admin).
- **Artist:** Extended user profile with created NFT collections and earnings.
- **NFT:** Represents digital artwork with metadata, ownership details, and price.
- **Collection:** Grouping of multiple NFTs under a specific theme.
- **Transaction:** Tracks purchases and royalties.
- **Followers:** Manages artist-followers relationships.
- **Featured Collections:** Artists can apply for featured collection promotions.

### **Entity-Relationship Diagram (ERD):**

![ERD NoorNFT](https://github.com/user-attachments/assets/108e63e4-cb05-41c2-8b38-4f50394fa026)

---

## 📝 Code Snippets & Highlights
### Authentication (JWT, OAuth)
Handles user authentication with JWT tokens and role-based access control.

### Business Logic (Controllers & Services)
The platform follows an MVC architecture, where controllers handle API requests and services manage core business logic.

### Security Practices (Middleware, Rate Limiting, Validation)
- Middleware for request validation and authentication.
- Rate limiting to prevent excessive API calls.
- Data validation using Joi and express-validator.

---

## 📌 Project Summary for Portfolio
### What was the purpose?
To provide a decentralized platform for artists to sell their art as NFTs, allowing users to explore and purchase unique digital artwork.

### Technologies Used
- **Frontend:** React.js, TypeScript, JavaScript
- **Backend:** Node.js, Express.js, MongoDB
- **Authentication:** JWT authentication, Bcrypt encryption
- **Validation:** Joi validation
- **File Handling:** Multer, Pinata for NFT storage
- **Email Services:** SendGrid SDK

### What challenges did you solve?
- Implemented a secure authentication system with JWT and role-based access control.
- Developed a royalty system for artists to earn from NFT sales.
- Designed an admin portal for managing user roles and approving collections.
- Built a promotional system for artists to feature their NFT collections.

---

### 📌 Note:
Though this project is inactive, the source code remains accessible for reference purposes.

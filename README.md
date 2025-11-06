# 🚀Parcel Delivery Management System

Parcel is a **home/office pickup parcel delivery system** designed to simplify booking, tracking, and delivery processes across Bangladesh.  
It provides a seamless and transparent logistics solution with dedicated dashboards for **Users, Admins, and Riders**.

---

## 🌐 Live Demo

- **Client (Frontend):** [parcelx-client.vercel.app](https://parcelx-client.vercel.app/)  
- **Server (Backend):** [parcelx-auth-server.vercel.app](https://parcelx-auth-server.vercel.app/)

---

## 🧠 Project Overview

Parcel helps users send parcels from **door to door**, providing:

- Real-time parcel tracking  
- Automated delivery workflow management  
- Dynamic pricing and secure online payments  
- Rider assignment and performance tracking  
- Feedback and review system for quality assurance  

---

## 👥 User Roles

### 🧑‍💼 User
- Create and manage parcel bookings  
- Make secure payments  
- Track parcels in real-time  
- Submit reviews and feedback  

### 🧑‍💻 Admin
- Manage users, riders, and service centers  
- Assign riders and oversee parcel delivery  
- Track payments, deliveries, and system stats  

### 🚚 Rider
- Manage assigned pickups and deliveries  
- Update parcel status  
- Earn per successful delivery  

---

## 🧩 System Architecture

| Role | Technology |
|------|-------------|
| **Frontend** | React 19, Tailwind CSS, Vite, TanStack Query, Firebase Auth |
| **Backend** | Node.js, Express.js, MongoDB, Firebase Admin, Stripe API |
| **Payment Gateway** | Stripe Integration |
| **Hosting** | Vercel (Client + Server) |

---

## 🛠️ Tech Stack

### **Frontend**
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-38BDF8?logo=tailwindcss)
![TanStack Query](https://img.shields.io/badge/TanStack%20Query-5.90.5-FF4154?logo=reactquery)
![Firebase](https://img.shields.io/badge/Firebase-12.4.0-FFCA28?logo=firebase)

### **Backend**
![Node.js](https://img.shields.io/badge/Node.js-20.x-43853D?logo=node.js)
![Express](https://img.shields.io/badge/Express-5.1.0-lightgrey?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-6.20.0-47A248?logo=mongodb)
![Stripe](https://img.shields.io/badge/Stripe-19.1.0-635BFF?logo=stripe)

---

## 📦 Installation & Setup

### **Clone Repositories**
```bash
# Client
git clone https://github.com/nomayen31/Parcelx-client-.git
cd Parcelx-client-
npm install
npm run dev

# Server
git clone https://github.com/nomayen31/Parcelx-auth-server.git
cd Parcelx-auth-server
npm install
npm run dev




🧭 Dashboard Overview
User Dashboard


View parcel statistics (paid, unpaid, in-transit, delivered)


Add, track, and pay for parcels


View payment history


Leave reviews and manage profile


Admin Dashboard


Manage users and riders


Approve/reject rider applications


Assign parcels for pickup/delivery


View all system payments and analytics


Rider Dashboard


View earnings and assigned tasks


Confirm pickups and deliveries


Update parcel statuses in real-time



💳 Payment Flow


User selects unpaid parcel


Redirected to Stripe Payment Page


On success:


Payment info saved


Tracking number generated


Tracking record added


Confirmation alert shown





🗂️ Parcel Status Workflow
StageStatus1️⃣unpaid2️⃣paid3️⃣ready-to-pickup4️⃣in-transit5️⃣reached-service-center6️⃣shipped7️⃣ready-for-delivery8️⃣delivered

🧾 Features Summary
✅ Door-to-door parcel management
✅ Role-based dashboard (User/Admin/Rider)
✅ Firebase Authentication
✅ Stripe Payment Integration
✅ Real-time Parcel Tracking
✅ Service Center & Rider Management
✅ Review & Rating System
✅ Responsive UI with TailwindCSS
✅ Secure API with Express and MongoDB

📁 Repository Links


🖥️ Client Repository: ParcelX Client Repo


🧮 Server Repository: ParcelX Server Repo



📸 Screenshots (Optional)
Add screenshots here once UI is finalized.

💡 Future Improvements


Add Push Notifications for parcel updates


Implement analytics dashboard with live tracking map


Multi-language support


Referral and loyalty system



🤝 Contributors
👨‍💻 Developed by: Ohin (Nomayen31)
📧 Email: contact.nexloom@gmail.com

🪪 License
This project is licensed under the MIT License — feel free to use, modify, and distribute with credit.

🌟 Show your support
If you like this project, please ⭐ the repo and share it with others!

---

Would you like me to include **preview screenshots** (like dashboard mockup placeholders and links to future features) and make it **Markdown-styled for GitHub auto-render (with emojis and color badges)**?  
I can also format it in **Notion or PDF** style for your portfolio.


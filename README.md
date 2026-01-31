# 📚 EduMart – Stationery E-Commerce Platform

EduMart is a modern **full-stack e-commerce stationery store** designed to deliver a seamless shopping experience for users while providing powerful management tools for administrators.

The platform enables customers to browse and purchase stationery products, manage accounts, and leave reviews, while the integrated admin portal allows efficient store operations including product management, order tracking, and earnings analysis.

---

## 🚀 **Live Demo**
🔗 **Deployed on Vercel:**  
https://edu-mart-six.vercel.app

---

## ✨ **Features**

### 👤 User Features
- 🔐 Secure authentication using JWT  
- 🛒 Add products to cart and place orders  
- ⭐ Review and rate products  
- 🔑 Change password and recover forgotten passwords via email  
- 📦 Track order details and status  
- 👤 User account management  

### 🛠️ Admin Portal
- ➕ Add new products  
- ❌ Delete existing products  
- 🔄 Update order status  
- 📊 Analyze store earnings  
- 📦 Manage customer orders  

---

## 🧠 **Database Models**

The application is structured around the following core models:

- **User** – Authentication, profile data, and account security  
- **Product** – Product details, pricing, and media  
- **Cart** – Items selected before checkout  
- **Order** – Purchase tracking, payment info, and delivery status  

---

## ⚙️ **Tech Stack**

### 🎨 Frontend
- **Next.js**  
- **TypeScript**  
- **Tailwind CSS**  
- **Vercel AI** – Enhanced frontend development efficiency  

### 🔧 Backend & Services
- **JWT Authentication** – Secure login system  
- **Nodemailer** – Email-based password recovery  
- **Cloudinary** – Image storage and optimization  

### ☁️ Deployment
- **Vercel** – Fast and reliable hosting platform  

---

## 🔐 **Authentication Flow**
- ✅ Secure signup and login with JWT  
- ✅ Email-based password recovery  
- ✅ Protected admin routes  
- ✅ Encrypted user credentials  

---

## 📈 **Key Highlights**
- ✅ Full-stack production-ready application  
- ✅ Secure authentication architecture  
- ✅ Admin analytics dashboard  
- ✅ Clean and responsive user interface  
- ✅ Scalable system design  
- ✅ Cloud-based media handling  

---

## 🏗️ **Installation & Setup**

```bash
# Clone the repository
git clone https://github.com/your-username/edumart.git

# Navigate into the project
cd edumart

# Install dependencies
npm install

# Run the development server
npm run dev

```

## 🔑 **Environment Variables**

```bash

Create a .env.local file in the root directory and configure the following:


# 🗄️ Database
MONGO_URI=your_mongodb_connection_string

# 🔐 Authentication
TOKEN_SECRET=your_jwt_secret

# ☁️ Cloudinary
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_secret

# 💳 Razorpay
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
NEXT_PUBLIC_RAZORPAY_KEY=your_public_razorpay_key

# 🌐 Public Cloudinary Config
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

# 📧 Email Service
EMAIL_USER=your_email_address
EMAIL_PASSWORD=your_email_password

# 🔗 Domain
DOMAIN=your_domain_url

```

---


## 🎯 **Future Improvements**

📱 Further mobile and tablet optimizations

🤖 AI-based product recommendations

🚚 Real-time delivery tracking

---

## 👨‍💻 **Author**
Karan Kapoor
🚀 Full-Stack Developer | Next.js | TypeScript | Scalable Web Applications

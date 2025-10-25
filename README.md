# Organic Premium Store

This is a Vite + React demo store for "Organic Products" with Firebase backend. It includes a premium black theme, product catalog, cart, checkout (mock payment), PDF order slip generation, and an admin dashboard.

Requirements
- Node 18+
- Firebase project with Firestore and Storage enabled

Setup
1. Make `.env` and fill the VITE_Cridentials as below.

=> VITE_FIREBASE_API_KEY = Your cridentials Here
=> VITE_FIREBASE_AUTH_DOMAIN = Your cridentials Here
=> VITE_FIREBASE_PROJECT_ID = Your cridentials Here
=> VITE_FIREBASE_STORAGE_BUCKET = Your cridentials Here
=> VITE_FIREBASE_MESSAGING_SENDER_ID = Your cridentials Here
=> VITE_FIREBASE_APP_ID = Your cridentials Here

=> VITE_CLOUDINARY_CLOUD_NAME = Your cridentials Here
=> VITE_CLOUDINARY_UPLOAD_PRESET = Your cridentials Here

=> VITE_WHATSAPP_NUMBER = Your cridentials Here
=> VITE_CONTACT_EMAIL = Your cridentials Here

=> VITE_ADMIN_EMAIL = Your cridentials Here



2. Install dependencies:

```bash
npm install
```

3. Run locally:

```bash
npm run dev
```



Example Firestore rule (very basic):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    match /products/{docId} {
      allow read: if true; // everyone can see products
      allow update: if true;
      allow write: if request.auth != null && request.auth.token.email == "msaadsaad580@gmail.com"; 
    }

    match /orders/{docId} {
      allow read: if true; 
      allow create: if true; 
      allow update: if true;
    }
    match /reviews/{reviewId} {
      allow read: if true;              
      allow create: if true; 
      allow update, delete: if request.auth != null && request.auth.token.email == "Your Email";    
    }
  }
}

```

Known limitations and next steps
- Payment is mocked; integrate Stripe for real charges.
- Add stronger validation and UX polish.
- Add Cloud Functions to send email receipts.
<<<<<<< HEAD
=======

>>>>>>> 9942c2511b3a2fdd374c78e15c51058de0014a7d

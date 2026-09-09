# Suraj Bhoite Faculty Portfolio

A modern faculty portfolio website for Dr. Suraj Bhoite, featuring profile information, academic background, research, experience, certificates, gallery, notes, and contact information.

## Overview

This project is a static HTML/CSS/JavaScript portfolio built for a faculty member and includes:

- Home page with hero section and academic summary
- About/Profile section
- Skills section
- Experience timeline
- Research and publications
- Courses and certificates
- Notes portal for students
- Notes admin dashboard for faculty
- Gallery section
- Contact page
- Dark/light theme support

## Tech Stack

- HTML5
- CSS3
- JavaScript (Vanilla)
- Firebase Firestore + Authentication
- Supabase Storage

## Project Structure

```text
.
├── about.html
├── contact.html
├── courses.html
├── experience.html
├── gallery.html
├── index.html
├── notes.html
├── notes-admin.html
├── research.html
├── skills.html
├── welcome.html
├── LICENSE
├── README.md
├── SETUP.md
├── firestore.rules
├── supabase-storage-policy.sql
├── css/
│   ├── global.css
│   ├── index.css
│   ├── navbar.css
│   ├── notes.css
│   ├── pages.css
│   ├── secondary-pages.css
│   ├── variables.css
│   └── ...
├── js/
│   ├── animations.js
│   ├── firebase-config.js
│   ├── notes-admin.js
│   ├── notes-common.js
│   ├── notes-student.js
│   ├── supabase-config.js
│   └── ...
├── assets/
│   ├── Courses Certificate/
│   ├── FDP/
│   ├── Research/
│   ├── gallerypictures/
│   └── ...
└── README.md
```

## Features

### Public portfolio
- Faculty information and academic profile
- Research and publication listing
- Certifications and academic activities
- Contact details and social links
- Gallery showcase

### Notes portal
- Students can browse active notes by subject/class/unit
- Notes are stored in Supabase storage
- Metadata and access logs are stored in Firestore
- Access tracking is recorded for each note
- Students request access with an email address; faculty approval sends note details by email

### Admin dashboard
- Faculty login via Firebase Authentication
- Upload notes with subject/class/unit metadata
- Edit or delete notes
- Manage subject list
- View note access analytics
- Review pending note access requests and approve or reject them

## Setup

For full setup instructions, see [SETUP.md](SETUP.md).

### Quick start

1. Clone the repository
2. Open the project in a browser using a local static server
3. Configure Firebase and Supabase settings in the JavaScript config files
4. Update the Firestore rules and Supabase policy
5. Add faculty admin accounts in Firebase
6. Start uploading notes from the admin panel

## Firebase Configuration

Open the file:

- `js/firebase-config.js`

Fill in your Firebase project credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Supabase Configuration

Open the file:

- `js/supabase-config.js`

Add your Supabase project URL and anon key:

```javascript
export const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
export const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";
export const NOTES_BUCKET = "notes";
```

## Deployment

This project is static and can be deployed to:

- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Author

Suraj Bhoite

## Contact

For project-related questions, updates, or collaboration, use the contact information available in the portfolio site.

## Notes

This repository contains academic and faculty portfolio content and may require additional configuration for production use, especially for Firebase/Auth and Supabase integration.


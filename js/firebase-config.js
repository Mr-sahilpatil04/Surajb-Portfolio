/* =============================================
   FIREBASE CONFIG
   -----------------------------------------------
   1. Create a free project at https://console.firebase.google.com
   2. Enable: Firestore Database, Authentication (Email/Password)
   3. Project settings → General → "Your apps" → Web app → copy the config
      values below.
   4. Deploy firestore.rules (see SETUP.md).
   ============================================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import {
  getAuth
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// NOTE: Firebase Storage is intentionally not used here — as of Feb 2026,
// Cloud Storage for Firebase requires a linked billing account (Blaze plan)
// even at zero usage. File storage is instead handled by Supabase
// (see js/supabase-config.js), which stays free with no card required.

// ⬇️ REPLACE with your Firebase project's config (Project Settings → General)
const firebaseConfig = {
  apiKey: "AIzaSyCpaMTBOcrDOPnAfLqlfL4PdcmpfzkOxMw",
  authDomain: "surajb-portfolio-system-fe5d7.firebaseapp.com",
  projectId: "surajb-portfolio-system-fe5d7",
  storageBucket: "surajb-portfolio-system-fe5d7.firebasestorage.app",
  messagingSenderId: "624167309716",
  appId: "1:624167309716:web:3833c05dcc0600ba5a7f81",
  measurementId: "G-94RVH168G7"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

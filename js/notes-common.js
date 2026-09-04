/* =============================================
   NOTES — SHARED CONSTANTS & UTILITIES
   ============================================= */

import { db } from "./firebase-config.js";
import {
  doc, getDoc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// Structure: Subject → Class → [Units]
// Default subjects are preloaded here; custom additions are saved in localStorage and reused by the UI.
const DEFAULT_NOTES_STRUCTURE = {
  "Data Structure": {
    "FY B.Tech": ["Unit 1", "Unit 2", "Unit 3", "Unit 4"],
    "SY B.Tech": ["Unit 1", "Unit 2", "Unit 3", "Unit 4", "Unit 5"],
    "TY B.Tech": ["Unit 1", "Unit 2", "Unit 3", "Unit 4"],
    "TE": ["Unit 1", "Unit 2", "Unit 3"],
    "BE": ["Unit 1", "Unit 2", "Unit 3"]
  },
  "Web Technology": {
    "FY B.Tech": ["Unit 1", "Unit 2", "Unit 3"],
    "SY B.Tech": ["Unit 1", "Unit 2", "Unit 3", "Unit 4"],
    "TY B.Tech": ["Unit 1", "Unit 2", "Unit 3"],
    "TE": ["Unit 1", "Unit 2"],
    "BE": []
  },
  "Operating System": {
    "FY B.Tech": ["Unit 1", "Unit 2", "Unit 3"],
    "SY B.Tech": ["Unit 1", "Unit 2", "Unit 3", "Unit 4"],
    "TY B.Tech": ["Unit 1", "Unit 2", "Unit 3"],
    "TE": ["Unit 1", "Unit 2", "Unit 3"],
    "BE": []
  },
  "Database Management System": {
    "FY B.Tech": ["Unit 1", "Unit 2", "Unit 3"],
    "SY B.Tech": ["Unit 1", "Unit 2", "Unit 3", "Unit 4"],
    "TY B.Tech": ["Unit 1", "Unit 2", "Unit 3"],
    "TE": ["Unit 1", "Unit 2"],
    "BE": []
  },
  "Computer Networks": {
    "FY B.Tech": ["Unit 1", "Unit 2"],
    "SY B.Tech": ["Unit 1", "Unit 2", "Unit 3"],
    "TY B.Tech": ["Unit 1", "Unit 2", "Unit 3"],
    "TE": ["Unit 1"],
    "BE": []
  },
  "Java Programming": {
    "FY B.Tech": ["Unit 1", "Unit 2", "Unit 3"],
    "SY B.Tech": ["Unit 1", "Unit 2", "Unit 3", "Unit 4"],
    "TY B.Tech": ["Unit 1", "Unit 2", "Unit 3"],
    "TE": [],
    "BE": []
  },
  "Machine Learning": {
    "FY B.Tech": ["Unit 1", "Unit 2"],
    "SY B.Tech": ["Unit 1", "Unit 2", "Unit 3"],
    "TY B.Tech": ["Unit 1", "Unit 2", "Unit 3"],
    "TE": ["Unit 1", "Unit 2"],
    "BE": []
  }
};
const NOTES_STRUCTURE_REF = doc(db, "settings", "notesStructure");

function cloneStructure(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeUnits(units = []) {
  return [...new Set((Array.isArray(units) ? units : [units])
    .map(value => String(value || "").trim())
    .filter(Boolean))];
}

export function getNotesStructure() {
  const fallback = cloneStructure(DEFAULT_NOTES_STRUCTURE);
  if (typeof localStorage === "undefined") return fallback;
  try {
    const raw = localStorage.getItem("notesStructure");
    if (!raw) return fallback;
    const saved = JSON.parse(raw);
    if (saved && typeof saved === "object" && !Array.isArray(saved)) {
      return saved;
    }
  } catch (err) {
    console.warn("Unable to read saved notes structure:", err);
  }
  return fallback;
}

export function saveNotesStructure(structure) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem("notesStructure", JSON.stringify(structure));
  NOTES_STRUCTURE = getNotesStructure();
}

export function ensureDefaultSubjects() {
  return loadSharedNotesStructure(true);
}

export async function loadSharedNotesStructure(initializeIfMissing = false) {
  try {
    const snapshot = await getDoc(NOTES_STRUCTURE_REF);
    if (snapshot.exists()) {
      const shared = snapshot.data().structure;
      if (shared && typeof shared === "object" && !Array.isArray(shared)) {
        saveNotesStructure(shared);
        return shared;
      }
    }

    if (initializeIfMissing) {
      const structure = typeof localStorage !== "undefined" && localStorage.getItem("notesStructure") !== null
        ? getNotesStructure()
        : cloneStructure(DEFAULT_NOTES_STRUCTURE);
      await setDoc(NOTES_STRUCTURE_REF, { structure, updatedAt: serverTimestamp() });
      saveNotesStructure(structure);
      return structure;
    }
  } catch (err) {
    console.warn("Unable to sync shared notes structure:", err);
  }

  return getNotesStructure();
}

export async function saveSharedNotesStructure(structure) {
  await setDoc(NOTES_STRUCTURE_REF, { structure, updatedAt: serverTimestamp() });
  saveNotesStructure(structure);
  return structure;
}

export function addCustomSubject(subjectName, className, units = []) {
  const cleanedName = String(subjectName || "").trim();
  if (!cleanedName) return getNotesStructure();

  const structure = getNotesStructure();
  structure[cleanedName] = structure[cleanedName] || {};
  const cleanedClass = String(className || "").trim();
  if (cleanedClass) {
    const mergedUnits = normalizeUnits([
      ...(structure[cleanedName][cleanedClass] || []),
      ...(Array.isArray(units) ? units : [units])
    ]);
    structure[cleanedName][cleanedClass] = mergedUnits;
  }
  saveNotesStructure(structure);
  return structure;
}

export function deleteSubject(subjectName) {
  const cleanedName = String(subjectName || "").trim();
  if (!cleanedName) return getNotesStructure();

  const structure = getNotesStructure();
  if (!structure[cleanedName]) {
    return structure;
  }

  delete structure[cleanedName];
  saveNotesStructure(structure);
  return structure;
}

export let NOTES_STRUCTURE = getNotesStructure();
export const CLASS_OPTIONS = ["S.Y B.Tech", "TE", "BE"];
export const DIVISION_OPTIONS = ["A - AIDS", "B - AIDS", "A - AIML", "B - AIML", "A", "B"];
export const DIVISION_BY_CLASS = {
  "S.Y B.Tech": ["A - AIDS", "B - AIDS", "A - AIML", "B - AIML"],
  "TE": ["A"],
  "BE": ["A"]
};
export const ALLOWED_FILE_TYPES = {
  "application/pdf": { ext: "pdf", label: "PDF" },
  "application/vnd.ms-powerpoint": { ext: "ppt", label: "PPT" },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": { ext: "pptx", label: "PPTX" }
};
export const MAX_FILE_SIZE_BYTES = 30 * 1024 * 1024; // 30 MB

/* ---------- Relative time ("5 minutes ago") ---------- */
export function relativeTime(date) {
  if (!date) return "";
  const now = Date.now();
  const d = date instanceof Date ? date : date.toDate ? date.toDate() : new Date(date);
  const diffMs = now - d.getTime();
  const sec = Math.floor(diffMs / 1000);

  if (sec < 10) return "Just now";
  if (sec < 60) return `${sec} seconds ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} minute${min === 1 ? "" : "s"} ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hour${hr === 1 ? "" : "s"} ago`;
  const day = Math.floor(hr / 24);
  if (day === 1) return "Yesterday";
  if (day < 7) return `${day} days ago`;
  const week = Math.floor(day / 7);
  if (week < 5) return `${week} week${week === 1 ? "" : "s"} ago`;
  return d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

/* ---------- File size formatting ---------- */
export function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ---------- Safe, clean storage filename ---------- */
// "DS Unit 1 final latest(2).pdf"  ->  "data-structure_sy-btech_unit-1_a1b2c3.pdf"
export function generateSafeFileName({ subject, className, unit, division }, originalFileName) {
  const ext = (originalFileName.split(".").pop() || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const slug = (s) =>
    (s || "")
      .toLowerCase()
      .replace(/\(\d+\)/g, "")           // drop "(1)", "(2)" style suffixes
      .replace(/[^a-z0-9]+/g, "-")        // non-alphanumerics -> hyphen
      .replace(/^-+|-+$/g, "")            // trim leading/trailing hyphens
      .replace(/-{2,}/g, "-");            // collapse duplicate hyphens

  const parts = [slug(subject), slug(className), slug(unit), slug(division)].filter(Boolean);
  const unique = Math.random().toString(36).slice(2, 8); // prevents collisions/path traversal
  return `${parts.join("_")}_${unique}.${ext}`;
}

// "DS Unit 1 final latest(2).pdf" -> "Data Structure — SY B.Tech — Unit 1"
export function generateDisplayTitle({ subject, className, unit, division }) {
  return [subject, className, unit, division].filter(Boolean).join(" — ");
}

export function fileIcon(fileType) {
  if (fileType === "pdf") return "📄";
  if (fileType === "ppt" || fileType === "pptx") return "📊";
  return "📁";
}
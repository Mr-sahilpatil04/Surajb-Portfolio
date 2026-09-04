import { db, auth } from "./firebase-config.js";
import { supabase, NOTES_BUCKET } from "./supabase-config.js";
import {
  collection, query, orderBy, limit, getDocs, addDoc, doc, updateDoc, deleteDoc, getDoc,
  serverTimestamp, where
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged, setPersistence, inMemoryPersistence
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import {
  getNotesStructure, addCustomSubject, deleteSubject, CLASS_OPTIONS, DIVISION_OPTIONS, ALLOWED_FILE_TYPES, MAX_FILE_SIZE_BYTES,
  relativeTime, formatFileSize, generateSafeFileName, generateDisplayTitle, fileIcon
} from "./notes-common.js";

let allNotes = [];
let allAccessLogs = [];
let editingNoteId = null;
let currentPage = 1;
const PAGE_SIZE = 15;
const authPersistenceReady = setPersistence(auth, inMemoryPersistence);

/* ---------- Auth gate ---------- */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("login-form")?.addEventListener("submit", handleLogin);
  document.getElementById("logout-btn")?.addEventListener("click", () => signOut(auth));

  authPersistenceReady.then(() => signOut(auth)).then(() => onAuthStateChanged(auth, async (user) => {
    if (!user) {
      showLogin();
      return;
    }
    const adminDoc = await getDoc(doc(db, "admins", user.uid));
    if (!adminDoc.exists()) {
      showLogin("This account is not authorized for the Notes Management panel.");
      await signOut(auth);
      return;
    }
    showDashboard(user, adminDoc.data());
  }));

  document.getElementById("add-subject-form")?.addEventListener("submit", handleAddSubject);
  document.getElementById("delete-subject-form")?.addEventListener("submit", handleDeleteSubject);
});

function showLogin(errorMsg) {
  document.getElementById("admin-login-wrap").style.display = "flex";
  document.getElementById("admin-dashboard").style.display = "none";
  const err = document.getElementById("admin-login-error");
  if (errorMsg && err) { err.textContent = errorMsg; err.style.display = "block"; }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const err = document.getElementById("admin-login-error");
  err.style.display = "none";
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (e2) {
    err.textContent = "Invalid email or password.";
    err.style.display = "block";
  }
}

function showDashboard(user, adminData) {
  document.getElementById("admin-login-wrap").style.display = "none";
  document.getElementById("admin-dashboard").style.display = "block";
  document.getElementById("admin-name").textContent = adminData?.name || user.email;
  populateDropdowns();
  document.getElementById("upload-form")?.addEventListener("submit", handleUpload);
  document.getElementById("edit-form")?.addEventListener("submit", handleEditSave);
  bindFilterEvents();
  loadAll();
}

function handleAddSubject(e) {
  e.preventDefault();
  const nameInput = document.getElementById("new-subject-name");
  const classInput = document.getElementById("new-subject-class");
  const unitsInput = document.getElementById("new-subject-units");

  const subjectName = nameInput?.value.trim();
  const className = classInput?.value.trim();
  const units = (unitsInput?.value || "")
    .split(",")
    .map(v => v.trim())
    .filter(Boolean);

  if (!subjectName || !className) {
    toast("Please enter a subject name and select a class.");
    return;
  }

  addCustomSubject(subjectName, className, units);
  document.getElementById("add-subject-form")?.reset();
  populateDropdowns();
  toast(`Subject "${subjectName}" added.`);
}

function handleDeleteSubject(e) {
  e.preventDefault();
  const subjectSelect = document.getElementById("delete-subject-select");
  const subjectName = subjectSelect?.value;

  if (!subjectName) {
    toast("Please select a subject to delete.");
    return;
  }

  const confirmDelete = window.confirm(`Delete subject "${subjectName}" from the catalog?`);
  if (!confirmDelete) return;

  deleteSubject(subjectName);
  populateDropdowns();
  toast(`Subject "${subjectName}" deleted.`);
}

/* ---------- Dropdown population ---------- */
function populateDropdowns() {
  const structure = getNotesStructure();
  const subjSelects = document.querySelectorAll(".subject-select");
  const classSelects = document.querySelectorAll(".class-select");
  const divSelects = document.querySelectorAll(".division-select");

  subjSelects.forEach(sel => {
    const currentValue = sel.value;
    sel.innerHTML = sel.id === "af-subject" ? '<option value="">All Subjects</option>' : '<option value="" disabled selected>Subject</option>';
    Object.keys(structure).forEach(s => sel.insertAdjacentHTML("beforeend", `<option value="${s}">${s}</option>`));
    if (currentValue) sel.value = currentValue;
  });

  const deleteSubjectSelect = document.getElementById("delete-subject-select");
  if (deleteSubjectSelect) {
    deleteSubjectSelect.innerHTML = '<option value="">Select Subject</option>';
    Object.keys(structure).forEach(s => deleteSubjectSelect.insertAdjacentHTML("beforeend", `<option value="${s}">${s}</option>`));
  }

  const updateDivisionOptions = (divSel, defaultLabel) => {
    const classSource = {
      "upload-division": "upload-class",
      "edit-division": "edit-class",
      "af-division": "af-class"
    }[divSel.id];
    const classValue = classSource ? document.getElementById(classSource)?.value || "" : "";
    const options = classValue && DIVISION_BY_CLASS[classValue] ? DIVISION_BY_CLASS[classValue] : DIVISION_OPTIONS;
    const currentValue = divSel.value;
    divSel.innerHTML = defaultLabel;
    options.forEach(d => divSel.insertAdjacentHTML("beforeend", `<option value="${d}">${d}</option>`));
    if (currentValue && options.includes(currentValue)) divSel.value = currentValue;
    else if (divSel.id === "af-division") divSel.value = "";
  };

  classSelects.forEach(sel => {
    const currentValue = sel.value;
    sel.innerHTML = '<option value="" disabled selected>Select Class</option>';
    CLASS_OPTIONS.forEach(c => sel.insertAdjacentHTML("beforeend", `<option value="${c}">${c}</option>`));
    if (currentValue) sel.value = currentValue;
  });

  divSelects.forEach(sel => {
    const currentValue = sel.value;
    const defaultLabel = sel.id === "upload-division"
      ? '<option value="">— Not division-specific —</option>'
      : sel.id === "af-division"
        ? '<option value="">All Divisions</option>'
        : '<option value="">— None —</option>';
    updateDivisionOptions(sel, defaultLabel);
    if (currentValue) sel.value = currentValue;
  });

  const uploadClassSel = document.getElementById("upload-class");
  const editClassSel = document.getElementById("edit-class");
  const afClassSel = document.getElementById("af-class");
  const uploadDivSel = document.getElementById("upload-division");
  const editDivSel = document.getElementById("edit-division");
  const afDivSel = document.getElementById("af-division");
  [
    [uploadClassSel, uploadDivSel, '<option value="">— Not division-specific —</option>'],
    [editClassSel, editDivSel, '<option value="">— None —</option>'],
    [afClassSel, afDivSel, '<option value="">All Divisions</option>']
  ].forEach(([classSel, divSel, label]) => {
    if (!classSel || !divSel) return;
    classSel.addEventListener("change", () => {
      const currentValue = divSel.value;
      const classValue = classSel.value;
      const options = classValue && DIVISION_BY_CLASS[classValue] ? DIVISION_BY_CLASS[classValue] : DIVISION_OPTIONS;
      divSel.innerHTML = label;
      options.forEach(d => divSel.insertAdjacentHTML("beforeend", `<option value="${d}">${d}</option>`));
      if (currentValue && options.includes(currentValue)) divSel.value = currentValue;
      else if (divSel.id === "af-division") divSel.value = "";
    });
  });

  const unitSel = document.getElementById("upload-unit");
  const subjSel = document.getElementById("upload-subject");
  const classSel = document.getElementById("upload-class");
  const refreshUnits = () => {
    if (!unitSel || !subjSel || !classSel) return;
    unitSel.innerHTML = `<option value="" disabled selected>Unit</option>`;
    const units = (structure[subjSel.value] || {})[classSel.value] || [];
    units.forEach(u => unitSel.insertAdjacentHTML("beforeend", `<option value="${u}">${u}</option>`));
    if (!units.length) unitSel.insertAdjacentHTML("beforeend", `<option value="General">General</option>`);
  };
  subjSel?.addEventListener("change", refreshUnits);
  classSel?.addEventListener("change", refreshUnits);
  refreshUnits();
}

/* ---------- Load data ---------- */
async function loadAll() {
  await Promise.all([loadNotes(), loadAccessLogs()]);
  renderStats();
  renderNotesTable();
  renderMostAccessed();
  renderAccessTable();
}

async function loadNotes() {
  const snap = await getDocs(query(collection(db, "notes"), orderBy("createdAt", "desc")));
  allNotes = snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function loadAccessLogs() {
  // Fetch the most recent 500 logs for client-side filtering/pagination — adequate at portfolio scale.
  const snap = await getDocs(query(collection(db, "noteAccessLogs"), orderBy("accessedAt", "desc"), limit(500)));
  allAccessLogs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/* ---------- Stats ---------- */
function renderStats() {
  const total = allNotes.length;
  const totalAccess = allAccessLogs.length;
  const now = new Date();
  const thisMonth = allNotes.filter(n => n.createdAt && n.createdAt.toDate().getMonth() === now.getMonth() && n.createdAt.toDate().getFullYear() === now.getFullYear()).length;
  const mostAccessed = [...allNotes].sort((a, b) => (b.accessCount || 0) - (a.accessCount || 0))[0];
  const classCounts = {};
  allAccessLogs.forEach(l => { classCounts[l.className] = (classCounts[l.className] || 0) + 1; });
  const mostActiveClass = Object.entries(classCounts).sort((a, b) => b[1] - a[1])[0];

  setStat("stat-total-notes", total);
  setStat("stat-total-access", totalAccess);
  setStat("stat-month-notes", thisMonth);
  setStat("stat-most-accessed", mostAccessed ? generateDisplayTitle(mostAccessed) : "—");
  setStat("stat-active-class", mostActiveClass ? `${mostActiveClass[0]} (${mostActiveClass[1]})` : "—");
}
function setStat(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }

function renderMostAccessed() {
  const el = document.getElementById("most-accessed-list");
  if (!el) return;
  const top = [...allNotes].sort((a, b) => (b.accessCount || 0) - (a.accessCount || 0)).slice(0, 5);
  el.innerHTML = top.map(n => `
    <div class="notes-widget-item" style="border-top:1px solid var(--border-subtle);padding:0.75rem 0;">
      <div class="notes-widget-name">${escapeHtml(generateDisplayTitle(n))}</div>
      <div class="notes-widget-sub">${n.accessCount || 0} accesses</div>
    </div>`).join("") || `<p style="color:var(--text-muted);">No data yet.</p>`;
}

/* ---------- Notes table (CRUD) ---------- */
function renderNotesTable() {
  const tbody = document.getElementById("notes-admin-table-body");
  if (!tbody) return;
  if (!allNotes.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--text-muted);">No notes uploaded yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = allNotes.map(n => `
    <tr>
      <td>${fileIcon(n.fileType)} ${escapeHtml(n.title)}</td>
      <td>${escapeHtml(n.subject)}</td>
      <td>${escapeHtml(n.unit)}</td>
      <td>${escapeHtml(n.className)}</td>
      <td>${(n.fileType || "").toUpperCase()}</td>
      <td>${formatFileSize(n.fileSize)}</td>
      <td>${n.accessCount || 0}</td>
      <td>
        <div class="admin-table-actions">
          <button data-id="${n.id}" class="edit-btn">Edit</button>
          <button data-id="${n.id}" class="danger delete-btn">Delete</button>
        </div>
      </td>
    </tr>`).join("");

  tbody.querySelectorAll(".edit-btn").forEach(b => b.addEventListener("click", () => openEditModal(b.dataset.id)));
  tbody.querySelectorAll(".delete-btn").forEach(b => b.addEventListener("click", () => confirmDelete(b.dataset.id)));
}

/* ---------- Upload ---------- */
async function handleUpload(e) {
  e.preventDefault();
  const subject = document.getElementById("upload-subject").value;
  const className = document.getElementById("upload-class").value;
  const unit = document.getElementById("upload-unit").value;
  const division = document.getElementById("upload-division").value;
  const fileInput = document.getElementById("upload-file");
  const submitBtn = document.getElementById("upload-submit-btn");
  const file = fileInput.files[0];

  if (!subject || !className || !unit || !file) {
    toast("Please fill all required fields and choose a file.");
    return;
  }
  if (!ALLOWED_FILE_TYPES[file.type]) {
    toast("Only PDF, PPT, or PPTX files are allowed.");
    return;
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    toast("File is too large (max 30 MB).");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Uploading…";
  try {
    const safeName = generateSafeFileName({ subject, className, unit, division }, file.name);
    const storagePath = safeName; // stored at the bucket root

    const { error: uploadError } = await supabase.storage
      .from(NOTES_BUCKET)
      .upload(storagePath, file, { contentType: file.type, upsert: false });
    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.from(NOTES_BUCKET).getPublicUrl(storagePath);
    const fileUrl = urlData.publicUrl;

    await addDoc(collection(db, "notes"), {
      title: generateDisplayTitle({ subject, className, unit, division }),
      subject, className, unit, division: division || null,
      fileName: safeName,
      originalFileName: file.name,
      filePath: storagePath,
      fileUrl,
      fileType: ALLOWED_FILE_TYPES[file.type].ext,
      fileSize: file.size,
      uploadedBy: auth.currentUser?.email || "Faculty",
      allowDownload: true,
      isActive: true,
      accessCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    toast("Note uploaded successfully.");
    document.getElementById("upload-form").reset();
    await loadAll();
  } catch (err) {
    console.error(err);
    toast("Upload failed. Please try again.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Upload Note";
  }
}

/* ---------- Edit ---------- */
function openEditModal(id) {
  const note = allNotes.find(n => n.id === id);
  if (!note) return;
  editingNoteId = id;
  document.getElementById("edit-title").value = note.title;
  document.getElementById("edit-subject").value = note.subject;
  document.getElementById("edit-class").value = note.className;
  document.getElementById("edit-unit").value = note.unit;
  document.getElementById("edit-division").value = note.division || "";
  document.getElementById("edit-active").checked = note.isActive !== false;
  document.getElementById("edit-modal").classList.add("active");
}
document.addEventListener("click", (e) => {
  if (e.target.closest("#edit-modal .modal-close") || e.target.id === "edit-modal") {
    document.getElementById("edit-modal")?.classList.remove("active");
  }
});

async function handleEditSave(e) {
  e.preventDefault();
  if (!editingNoteId) return;
  const updates = {
    title: document.getElementById("edit-title").value.trim(),
    subject: document.getElementById("edit-subject").value,
    className: document.getElementById("edit-class").value,
    unit: document.getElementById("edit-unit").value,
    division: document.getElementById("edit-division").value || null,
    isActive: document.getElementById("edit-active").checked,
    updatedAt: serverTimestamp()
  };
  try {
    await updateDoc(doc(db, "notes", editingNoteId), updates);
    document.getElementById("edit-modal").classList.remove("active");
    toast("Note updated.");
    await loadAll();
  } catch (err) {
    console.error(err);
    toast("Update failed.");
  }
}

/* ---------- Delete ---------- */
let pendingDeleteId = null;
function confirmDelete(id) {
  pendingDeleteId = id;
  document.getElementById("confirm-modal").classList.add("active");
}
document.getElementById("confirm-delete-btn")?.addEventListener("click", async () => {
  if (!pendingDeleteId) return;
  const note = allNotes.find(n => n.id === pendingDeleteId);
  try {
    if (note?.filePath) {
      await supabase.storage.from(NOTES_BUCKET).remove([note.filePath]).catch(() => {}); // ignore if already gone
    }
    await deleteDoc(doc(db, "notes", pendingDeleteId));
    toast("Note deleted.");
    await loadAll();
  } catch (err) {
    console.error(err);
    toast("Delete failed.");
  }
  pendingDeleteId = null;
  document.getElementById("confirm-modal").classList.remove("active");
});
document.getElementById("cancel-delete-btn")?.addEventListener("click", () => {
  pendingDeleteId = null;
  document.getElementById("confirm-modal").classList.remove("active");
});

/* ---------- All Notes Access panel: search / filter / sort / paginate ---------- */
function bindFilterEvents() {
  ["af-student", "af-class", "af-division", "af-subject", "af-unit", "af-from", "af-to"].forEach(id => {
    document.getElementById(id)?.addEventListener("input", () => { currentPage = 1; renderAccessTable(); });
  });
  document.getElementById("af-prev")?.addEventListener("click", () => { if (currentPage > 1) { currentPage--; renderAccessTable(); } });
  document.getElementById("af-next")?.addEventListener("click", () => { currentPage++; renderAccessTable(); });
}

function renderAccessTable() {
  const tbody = document.getElementById("access-admin-table-body");
  if (!tbody) return;

  const studentF = (document.getElementById("af-student")?.value || "").toLowerCase();
  const classF = document.getElementById("af-class")?.value || "";
  const divF = document.getElementById("af-division")?.value || "";
  const subjF = document.getElementById("af-subject")?.value || "";
  const unitF = document.getElementById("af-unit")?.value || "";
  const fromF = document.getElementById("af-from")?.value;
  const toF = document.getElementById("af-to")?.value;

  let filtered = allAccessLogs.filter(l => {
    if (studentF && !(l.studentName || "").toLowerCase().includes(studentF)) return false;
    if (classF && l.className !== classF) return false;
    if (divF && l.division !== divF) return false;
    if (subjF && l.subject !== subjF) return false;
    if (unitF && l.unit !== unitF) return false;
    if (fromF && l.accessedAt && l.accessedAt.toDate() < new Date(fromF)) return false;
    if (toF && l.accessedAt && l.accessedAt.toDate() > new Date(toF + "T23:59:59")) return false;
    return true;
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  currentPage = Math.min(currentPage, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  document.getElementById("af-total-count").textContent = `${total} total access${total === 1 ? "" : "es"}`;
  document.getElementById("af-page-label").textContent = `Page ${currentPage} of ${totalPages}`;

  if (!pageItems.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--text-muted);">No matching records.</td></tr>`;
    return;
  }

  tbody.innerHTML = pageItems.map(l => `
    <tr>
      <td>${escapeHtml(l.studentName)}</td>
      <td>${escapeHtml(l.className)}</td>
      <td>${escapeHtml(l.division || "—")}</td>
      <td>${escapeHtml(l.subject)}</td>
      <td>${escapeHtml(l.unit)}</td>
      <td>${escapeHtml(l.noteTitle)}</td>
      <td>${l.accessedAt ? relativeTime(l.accessedAt) : "—"}</td>
    </tr>`).join("");
}

/* ---------- Helpers ---------- */
function escapeHtml(str = "") {
  return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function toast(msg) {
  const el = document.getElementById("toast");
  if (!el) return alert(msg);
  el.textContent = msg;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 3000);
}
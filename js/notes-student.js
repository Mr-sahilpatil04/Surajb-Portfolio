import { db } from "./firebase-config.js";
import {
  collection, query, where, orderBy, limit, getDocs, addDoc, doc, updateDoc,
  increment, serverTimestamp, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getNotesStructure, CLASS_OPTIONS, DIVISION_OPTIONS, relativeTime, formatFileSize, fileIcon } from "./notes-common.js";

const SESSION_KEY = "notesStudentInfo";
let allNotes = [];
let pendingNote = null;

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  populateFilterDropdowns();
  populateFormDropdowns();
  loadNotes();
  listenRecentActivity();
  setupModal();
  setupWidget();
  setInterval(refreshRelativeTimes, 30000);
});

function populateFilterDropdowns() {
  const subjectSel = document.getElementById("filter-subject");
  const classSel = document.getElementById("filter-class");
  const unitSel = document.getElementById("filter-unit");
  if (!subjectSel) return;

  const structure = getNotesStructure();
  Object.keys(structure).forEach(subj => {
    subjectSel.insertAdjacentHTML("beforeend", `<option value="${subj}">${subj}</option>`);
  });

  subjectSel.addEventListener("change", () => {
    const structureNow = getNotesStructure();
    classSel.innerHTML = `<option value="">All Classes</option>`;
    unitSel.innerHTML = `<option value="">All Units</option>`;
    const classes = structureNow[subjectSel.value] ? Object.keys(structureNow[subjectSel.value]) : [];
    classes.forEach(c => classSel.insertAdjacentHTML("beforeend", `<option value="${c}">${c}</option>`));
    renderFilteredNotes();
  });

  classSel.addEventListener("change", () => {
    const structureNow = getNotesStructure();
    unitSel.innerHTML = `<option value="">All Units</option>`;
    const units = (structureNow[subjectSel.value] || {})[classSel.value] || [];
    units.forEach(u => unitSel.insertAdjacentHTML("beforeend", `<option value="${u}">${u}</option>`));
    renderFilteredNotes();
  });

  unitSel.addEventListener("change", renderFilteredNotes);
}

function populateFormDropdowns() {
  const classSel = document.getElementById("access-class");
  const divSel = document.getElementById("access-division");
  const classList = ["S.Y B.Tech", "TE", "BE"];
  const divisionMap = {
    "S.Y B.Tech": ["A - AIDS", "B - AIDS", "A - AIML", "B - AIML"],
    "TE": ["A"],
    "BE": ["A"]
  };

  if (classSel) classList.forEach(c => classSel.insertAdjacentHTML("beforeend", `<option value="${c}">${c}</option>`));

  if (divSel) {
    const refreshDivisionOptions = () => {
      const selectedClass = classSel?.value || "S.Y B.Tech";
      const options = divisionMap[selectedClass] || ["A"];
      divSel.innerHTML = '<option value="">Select Division</option>';
      options.forEach(d => divSel.insertAdjacentHTML("beforeend", `<option value="${d}">${d}</option>`));
    };
    refreshDivisionOptions();
    classSel?.addEventListener("change", refreshDivisionOptions);
  }
}

/* ---------- Load & render notes ---------- */
async function loadNotes() {
  const grid = document.getElementById("notes-grid");
  if (!grid) return;
  try {
    const q = query(collection(db, "notes"), where("isActive", "==", true), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    allNotes = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderFilteredNotes();
  } catch (err) {
    console.error("Failed to load notes:", err);
    grid.innerHTML = `<div class="notes-empty">Couldn't load notes right now. Please try again shortly.</div>`;
  }
}

function renderFilteredNotes() {
  const grid = document.getElementById("notes-grid");
  if (!grid) return;
  const subject = document.getElementById("filter-subject")?.value || "";
  const className = document.getElementById("filter-class")?.value || "";
  const unit = document.getElementById("filter-unit")?.value || "";

  const filtered = allNotes.filter(n =>
    (!subject || n.subject === subject) &&
    (!className || n.className === className) &&
    (!unit || n.unit === unit)
  );

  if (!filtered.length) {
    grid.innerHTML = `<div class="notes-empty">📭 No notes available here yet. Check back soon.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(note => `
    <div class="card note-card">
      <div class="note-card-top">
        <span class="note-card-icon">${fileIcon(note.fileType)}</span>
        <span class="badge">${(note.fileType || "").toUpperCase()}</span>
      </div>
      <div class="note-card-title">${escapeHtml(note.title)}</div>
      <div class="note-card-meta">
        <span class="badge">${escapeHtml(note.subject)}</span>
        <span class="badge">${escapeHtml(note.unit)}</span>
        <span class="badge">${escapeHtml(note.className)}</span>
      </div>
      <div class="note-card-info">
        <span><span>Size</span><span>${formatFileSize(note.fileSize)}</span></span>
        <span><span>Uploaded</span><span>${note.createdAt ? relativeTime(note.createdAt) : "—"}</span></span>
        <span><span>By</span><span>Mr. Suraj Bhoite</span></span>
        <span><span>Accessed</span><span>${note.accessCount || 0} times</span></span>
      </div>
      <div class="note-card-actions">
        <button class="btn btn-primary note-open-btn" data-id="${note.id}">👁 Open Note</button>
        ${note.allowDownload !== false ? `<button class="btn btn-outline note-download-btn" data-id="${note.id}">⬇</button>` : ""}
      </div>
    </div>
  `).join("");

  grid.querySelectorAll(".note-open-btn").forEach(btn => {
    btn.addEventListener("click", () => handleNoteAction(btn.dataset.id, "open"));
  });
  grid.querySelectorAll(".note-download-btn").forEach(btn => {
    btn.addEventListener("click", () => handleNoteAction(btn.dataset.id, "download"));
  });
}

function escapeHtml(str = "") {
  return String(str).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------- Access-gate flow ---------- */
let pendingIntent = "open";

function handleNoteAction(noteId, intent) {
  const note = allNotes.find(n => n.id === noteId);
  if (!note) return;
  const saved = sessionStorage.getItem(SESSION_KEY);
  if (saved) {
    triggerNoteAction(note, intent);
    logAccess(note, JSON.parse(saved));
  } else {
    pendingNote = note;
    pendingIntent = intent;
    openModal();
  }
}

function triggerNoteAction(note, intent) {
  if (intent === "download") {
    downloadNoteFile(note);
  } else {
    openNoteFile(note);
  }
}

function setupModal() {
  const modal = document.getElementById("access-modal");
  const form = document.getElementById("access-form");
  const closeBtn = document.getElementById("access-modal-close");
  if (!modal || !form) return;

  closeBtn?.addEventListener("click", () => closeModal());
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal(); // click on backdrop
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("access-name").value.trim();
    const className = document.getElementById("access-class").value;
    const division = document.getElementById("access-division").value;
    const errorEl = document.getElementById("access-form-error");

    if (!name || !className || !division) {
      errorEl.textContent = "Please fill in all fields.";
      errorEl.style.display = "block";
      return;
    }
    errorEl.style.display = "none";

    const studentInfo = { name, className, division };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(studentInfo));
    closeModal();
    if (pendingNote) {
      triggerNoteAction(pendingNote, pendingIntent);   // open/download immediately, still inside the submit gesture
      logAccess(pendingNote, studentInfo);             // log in the background — doesn't block the action
    }
    pendingNote = null;
    pendingIntent = "open";
  });
}

function openModal() {
  const modal = document.getElementById("access-modal");
  if (!modal) { console.error("access-modal element not found in the page."); return; }
  if (typeof modal.showModal === "function") {
    modal.showModal();
  } else {
    // Fallback for very old browsers without <dialog> support
    modal.setAttribute("open", "");
  }
}
function closeModal() {
  const modal = document.getElementById("access-modal");
  if (!modal) return;
  if (typeof modal.close === "function") {
    modal.close();
  } else {
    modal.removeAttribute("open");
  }
}

function openNoteFile(note) {
  window.open(note.fileUrl, "_blank", "noopener");
}

function downloadNoteFile(note) {
  const a = document.createElement("a");
  a.href = note.fileUrl;
  a.download = note.originalFileName || note.title || "note";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

async function logAccess(note, studentInfo) {
  try {
    await addDoc(collection(db, "noteAccessLogs"), {
      noteId: note.id,
      noteTitle: note.title,
      subject: note.subject,
      unit: note.unit,
      fileType: note.fileType,
      studentName: studentInfo.name,
      className: studentInfo.className,
      division: studentInfo.division,
      accessedAt: serverTimestamp()
    });
    updateDoc(doc(db, "notes", note.id), { accessCount: increment(1) }).catch(() => {});
  } catch (err) {
    console.error("Failed to log access:", err);
  }
}

/* ---------- Recent activity (table + widget) ---------- */
let recentLogs = [];

function listenRecentActivity() {
  const tbody = document.getElementById("activity-table-body");
  const widgetBody = document.getElementById("widget-body");
  if (!tbody && !widgetBody) return;

  const q = query(collection(db, "noteAccessLogs"), orderBy("accessedAt", "desc"), limit(10));
  onSnapshot(q, (snap) => {
    recentLogs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderActivityTable();
    renderWidget();
  }, (err) => console.error("Activity listener error:", err));
}

function renderActivityTable() {
  const tbody = document.getElementById("activity-table-body");
  if (!tbody) return;
  if (!recentLogs.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);">No activity yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = recentLogs.map(log => `
    <tr>
      <td>${escapeHtml(log.studentName)}</td>
      <td>${escapeHtml(log.subject)}</td>
      <td>${escapeHtml(log.unit)}</td>
      <td>${escapeHtml(log.noteTitle)}</td>
      <td>${escapeHtml(log.className)} ${log.division ? `- ${escapeHtml(log.division)}` : ""}</td>
      <td class="activity-time" data-ts="${log.accessedAt ? log.accessedAt.toMillis() : ""}">${log.accessedAt ? relativeTime(log.accessedAt) : "just now"}</td>
    </tr>
  `).join("");
}

function renderWidget() {
  const widgetBody = document.getElementById("widget-body");
  const countEl = document.getElementById("widget-count");
  if (!widgetBody) return;
  const top5 = recentLogs.slice(0, 5);
  widgetBody.innerHTML = top5.map(log => `
    <div class="notes-widget-item" data-ts="${log.accessedAt ? log.accessedAt.toMillis() : ""}">
      <div class="notes-widget-name">${escapeHtml(log.studentName)}</div>
      <div class="notes-widget-sub">${escapeHtml(log.subject)} • ${escapeHtml(log.unit)} — <span class="wtime">${log.accessedAt ? relativeTime(log.accessedAt) : "just now"}</span></div>
    </div>
  `).join("") + `<div class="notes-widget-footer">${recentLogs.length} recent note ${recentLogs.length === 1 ? "access" : "accesses"}</div>`;
  if (countEl) countEl.textContent = recentLogs.length;
}

function refreshRelativeTimes() {
  document.querySelectorAll(".activity-time[data-ts]").forEach(el => {
    const ts = Number(el.dataset.ts);
    if (ts) el.textContent = relativeTime(new Date(ts));
  });
  document.querySelectorAll(".notes-widget-item[data-ts] .wtime").forEach(el => {
    const parent = el.closest("[data-ts]");
    const ts = Number(parent.dataset.ts);
    if (ts) el.textContent = relativeTime(new Date(ts));
  });
}

function setupWidget() {
  const widget = document.getElementById("notes-widget");
  const toggle = document.getElementById("widget-toggle");
  const header = document.getElementById("widget-header");
  if (!widget) return;
  const collapse = () => widget.classList.add("collapsed");
  const expand = () => widget.classList.remove("collapsed");

  toggle?.addEventListener("click", (e) => {
    e.stopPropagation();
    widget.classList.contains("collapsed") ? expand() : collapse();
  });
  header?.addEventListener("click", () => {
    if (widget.classList.contains("collapsed")) expand();
  });
}
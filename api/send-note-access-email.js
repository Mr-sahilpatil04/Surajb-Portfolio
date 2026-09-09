const admin = require("firebase-admin");

function getFirebaseAdmin() {
  if (admin.apps.length) return admin;
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not configured");
  }
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  return admin;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const authorization = req.headers.authorization || "";
    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing authorization token" });
    }

    const firebaseAdmin = getFirebaseAdmin();
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(authorization.slice(7));
    const adminSnapshot = await firebaseAdmin.firestore().doc(`admins/${decodedToken.uid}`).get();
    if (!adminSnapshot.exists) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const requestId = req.body?.requestId;
    if (!requestId || !/^[A-Za-z0-9_-]+$/.test(requestId)) {
      return res.status(400).json({ error: "Invalid request ID" });
    }

    const requestSnapshot = await firebaseAdmin.firestore().doc(`noteAccessRequests/${requestId}`).get();
    if (!requestSnapshot.exists || requestSnapshot.data().status !== "approved") {
      return res.status(409).json({ error: "Request is not approved" });
    }

    const noteRequest = requestSnapshot.data();
    if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
      throw new Error("RESEND_API_KEY or EMAIL_FROM is not configured");
    }
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [noteRequest.studentEmail],
        subject: `Note access approved: ${noteRequest.noteTitle}`,
        html: `
          <p>Hello ${escapeHtml(noteRequest.studentName)},</p>
          <p>Your request for the following note has been approved:</p>
          <ul>
            <li><strong>Note:</strong> ${escapeHtml(noteRequest.noteTitle)}</li>
            <li><strong>Subject:</strong> ${escapeHtml(noteRequest.subject)}</li>
            <li><strong>Unit:</strong> ${escapeHtml(noteRequest.unit)}</li>
            <li><strong>Class:</strong> ${escapeHtml(noteRequest.className)}${noteRequest.division ? ` - ${escapeHtml(noteRequest.division)}` : ""}</li>
          </ul>
          <p><a href="${escapeAttribute(noteRequest.fileUrl)}">Open or download the note</a></p>
          <p>Regards,<br />Faculty Notes Portal</p>
        `
      })
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Resend error:", errorText);
      return res.status(502).json({ error: "Email provider failed", details: errorText });
    }

    await requestSnapshot.ref.update({ emailSentAt: new Date() });
    return res.status(200).json({ sent: true });
  } catch (error) {
    console.error("Note access email failed:", error);
    return res.status(500).json({ error: "Unable to send note access email", details: error.message });
  }
};

function escapeHtml(value = "") {
  return String(value).replace(/[&<>\"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
  }[character]));
}

function escapeAttribute(value = "") {
  return escapeHtml(value).replace(/`/g, "&#96;");
}

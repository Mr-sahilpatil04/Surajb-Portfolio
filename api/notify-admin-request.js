const admin = require("firebase-admin");

function getFirebaseAdmin() {
  if (admin.apps.length) return admin;
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON is not configured");
  }
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON))
  });
  return admin;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const firebaseAdmin = getFirebaseAdmin();
    const requestId = req.body?.requestId;
    if (!requestId || !/^[A-Za-z0-9_-]+$/.test(requestId)) {
      return res.status(400).json({ error: "Invalid request ID" });
    }

    const requestRef = firebaseAdmin.firestore().doc(`noteAccessRequests/${requestId}`);
    let requestData;
    await firebaseAdmin.firestore().runTransaction(async transaction => {
      const snapshot = await transaction.get(requestRef);
      if (!snapshot.exists || snapshot.data().status !== "pending") throw new Error("Request is not pending");
      requestData = snapshot.data();
      if (requestData.notificationSentAt) return;
      transaction.update(requestRef, { notificationSentAt: new Date() });
    });

    if (requestData.notificationSentAt) return res.status(200).json({ sent: false, duplicate: true });
    await firebaseAdmin.messaging().send({
      topic: "faculty-admin",
      notification: {
        title: "New note access request",
        body: `${requestData.studentName} requested ${requestData.noteTitle}`
      },
      data: { requestId }
    });
    return res.status(200).json({ sent: true });
  } catch (error) {
    console.error("Admin request notification failed:", error);
    return res.status(500).json({ error: "Unable to send admin notification" });
  }
};
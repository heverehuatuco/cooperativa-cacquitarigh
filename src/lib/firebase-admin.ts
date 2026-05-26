import * as admin from "firebase-admin";

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  // Evitar inicializar si son marcadores de posición o faltan datos (evita errores en la compilación npm run build)
  const hasPlaceholders = 
    privateKey?.includes("your_private_key_here") || 
    clientEmail?.includes("firebase-adminsdk-xxxxx");

  if (privateKey && clientEmail && projectId && !hasPlaceholders) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey: privateKey.replace(/\\n/g, "\n"),
        }),
      });
    } catch (error) {
      console.warn("Error al inicializar Firebase Admin SDK:", error);
    }
  } else {
    console.warn("Firebase Admin SDK no está inicializado porque faltan credenciales reales en .env.local.");
  }
}

const adminAuth = admin.apps.length > 0 ? admin.auth() : null;
const adminDb = admin.apps.length > 0 ? admin.firestore() : null;

export { adminAuth, adminDb, admin };

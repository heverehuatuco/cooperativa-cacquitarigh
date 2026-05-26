import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import * as admin from "firebase-admin";

export async function POST(req: NextRequest) {
  try {
    // 1. Verificar que el SDK de administración esté inicializado
    if (!adminAuth || !adminDb) {
      return NextResponse.json(
        { error: "El SDK de administración de Firebase no está configurado en .env.local" },
        { status: 500 }
      );
    }

    // 2. Obtener el token del encabezado de autorización
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Token de autorización faltante o inválido" },
        { status: 401 }
      );
    }

    const token = authHeader.split("Bearer ")[1];
    
    // 3. Verificar el token y comprobar si el emisor es el SuperAdmin
    const decodedToken = await adminAuth.verifyIdToken(token);
    const callerEmail = decodedToken.email?.toLowerCase().trim();

    if (callerEmail !== "heverehuatuco@gmail.com") {
      return NextResponse.json(
        { error: "Acceso denegado: Solo el administrador principal puede realizar esta acción" },
        { status: 403 }
      );
    }

    // 4. Leer los datos del nuevo usuario
    const { email, password, displayName, role = "staff" } = await req.json();

    if (!email || !password || !displayName) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios (email, contraseña, nombre)" },
        { status: 400 }
      );
    }

    // 5. Crear el usuario en Firebase Authentication
    const userRecord = await adminAuth.createUser({
      email: email.toLowerCase().trim(),
      password: password,
      displayName: displayName,
    });

    // 6. Registrar los detalles del rol en la colección "users" de Firestore
    await adminDb.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: email.toLowerCase().trim(),
      name: displayName,
      role: role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      message: `Usuario ${displayName} creado con éxito`,
      uid: userRecord.uid,
    });

  } catch (error: any) {
    console.error("Error al crear usuario:", error);
    return NextResponse.json(
      { error: error.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}

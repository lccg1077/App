import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore, collection, doc, getDocs, setDoc, query, where } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { signInWithPopup } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";




// ✅ Configuración real de tu proyecto
const firebaseConfig = {
  apiKey: "AIzaSyBDXcvx-DNz2g0vy-_RMgYT91r-WO6cK5I",
  authDomain: "appchatbot-90dbd.firebaseapp.com",
  projectId: "appchatbot-90dbd",
  storageBucket: "appchatbot-90dbd.firebasestorage.app",
  messagingSenderId: "1086999132472",
  appId: "1:1086999132472:web:2fab90300f9fc8f329a9cd",
  measurementId: "G-DDF23FFYX2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


//  CORRECTO (versión modular)
const googleProvider = new GoogleAuthProvider();

// Elementos del DOM
const profileSelector = document.getElementById('profileSelector');
const loginForm = document.getElementById('loginForm');
const loading = document.getElementById('loading');
const message = document.getElementById('message');
const authForm = document.getElementById('authForm');
const loginOptions = document.getElementById('loginOptions');

// Funciones principales


function selectProfile(profile) {
  profile = profile.trim().toLowerCase();
  window.selectedProfile = profile;

  const icons = {
    estudiante: "🎓",
    docente: "👨‍🏫",
    padre: "👨‍👩‍👧‍👦",
    admin: "⚙️",
  };

  const titles = {
    estudiante: "Iniciar Sesión - Estudiante",
    docente: "Iniciar Sesión - Docente",
    padre: "Iniciar Sesión - Padre de Familia",
    admin: "Iniciar Sesión - Administrador",
  };

  const colors = {
    estudiante: "linear-gradient(135deg, #3182ce, #2b77cb)",
    docente: "linear-gradient(135deg, #38a169, #2f855a)",
    padre: "linear-gradient(135deg, #d69e2e, #b7791f)",
    admin: "linear-gradient(135deg, #805ad5, #6b46c1)",
  };

  const loginBtn = document.getElementById("loginBtn");
  const loginTitle = document.getElementById("loginTitle");
  const selectedIcon = document.getElementById("selectedIcon");

  loginBtn.style.background = colors[profile];
  loginTitle.textContent = titles[profile];
  selectedIcon.textContent = icons[profile];

  loginOptions.style.display = profile === "estudiante" ? "none" : "block";
  loginForm.style.display = "block";
  profileSelector.style.display = "none";
}


// Función auxiliar para iconos
function getProfileIcon(profile) {
  const icons = {
    estudiante: "🎓",
    docente: "👨‍🏫",
    padre: "👨‍👩‍👧‍👦",
    admin: "⚙️",
  };
  return icons[profile] || "👤";
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Hacerla visible globalmente
window.selectProfile = selectProfile;

function goBack() {
  loginForm.style.display = 'none';
  profileSelector.style.display = 'block';
  window.selectedProfile = '';
  resetForm();
}

function resetForm() {
  authForm.reset();
  hideMessage();
}

function showLoading() {
  loading.style.display = 'block';
  loginForm.style.display = 'none';
}

function hideLoading() {
  loading.style.display = 'none';
  loginForm.style.display = 'block';
}

function showMessage(text, type = 'error') {
  message.textContent = text;
  message.className = `message ${type}`;
  message.style.display = 'block';
  setTimeout(hideMessage, 5000);
}

function hideMessage() {
  message.style.display = 'none';
}

// Funciones de autenticación
async function loginWithGoogle() {
  // Verificar que no sea estudiante
  if (window.selectedProfile === 'estudiante') {
    showMessage('Los estudiantes deben usar usuario y contraseña');
    return;
  }

  try {
    showLoading();
    const result = await signInWithPopup(auth, googleProvider); // Falta esta línea
const user = result.user;

    // Guardar información del usuario en Firestore
    await saveUserProfile(auth.currentUser, window.selectedProfile);

    showMessage('Inicio de sesión exitoso con Google', 'success');
    setTimeout(() => redirectUser(selectedProfile), 2000);
  } catch (error) {
    hideLoading();
    showMessage('Error al iniciar sesión con Google: ' + error.message);
  }
}

async function saveUserProfile(user, profile) {
  try {
    console.log('>> INTENTO GUARDAR PERFIL');
    console.log('auth.currentUser:', auth.currentUser);
    console.log('user:', user);

    if (!auth.currentUser || auth.currentUser.uid !== user.uid) {
      console.warn('🚫 Usuario no autenticado o UID inválido');
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      profile: profile,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      createdAt: new Date(),
      lastLogin: new Date()
    }, { merge: true });

    console.log('✅ Perfil guardado correctamente');

  } catch (error) {
    console.error('❌ Error guardando perfil:', error.message);
  }
}


async function loginWithUsernamePassword(username, password) {
  try {
    // Normalizar inputs
    username = username.trim().toLowerCase();
    const profile = window.selectedProfile.trim().toLowerCase();


    // Si es estudiante (sin Firebase Auth)
    if (profile === 'estudiante') {
      if (auth.currentUser) await auth.signOut();

      const usersRef = collection(db, 'estudiantes');
      const q = query(usersRef, where('username', '==', username));
      const snapshot = await getDocs(q);

      if (snapshot.empty) throw new Error('Usuario no encontrado');

      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();

      console.log("Comparación exacta de perfil:");
      console.log("Firestore →", userData.profile);
      console.log("Formulario →", profile);


      if (userData.password !== password) {
        throw new Error('Contraseña incorrecta');
      }

      // Guardar sesión simulada
      localStorage.setItem('estudiante', JSON.stringify({
        uid: userDoc.id,
        username: userData.username,
        nombre: userData.nombre || '',
        avatar: userData.avatar || '🎓'
      }));

      // Redirigir
      window.location.href = 'pages/estudiante.html';
      return;
    }

    // Usuarios autenticados (docente, padre, admin)
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', username));
    const snapshot = await getDocs(q);

    if (snapshot.empty) throw new Error('Usuario no encontrado');

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    if (userData.profile !== profile) {
      throw new Error('El perfil no coincide con el usuario');
    }

    const userCredential = await signInWithEmailAndPassword(auth, userData.email, password);
    return userCredential.user;

  } catch (error) {
    console.error("❌ Error en login:", error.message);
    throw error;
  }
}

function redirectUser(profile) {
  const redirects = {
    estudiante: 'pages/estudiante.html',
    docente: 'pages/profesor.html',
    padre: 'pages/padre.html',
    admin: 'pages/admin.html'
  };

  window.location.href = redirects[profile];
}


async function forgotPassword() {
  const username = document.getElementById('username').value;

  if (!username) {
    showMessage('Por favor ingresa tu usuario primero');
    return;
  }

  try {
    if (window.selectedProfile === 'estudiante') {
      showMessage('Los estudiantes no tienen correo registrado');
      return;
    }

    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('username', '==', username),
      where('profile', '==', selectedProfile)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      showMessage('Usuario no encontrado');
      return;
    }

    const userData = querySnapshot.docs[0].data();
    await sendPasswordResetEmail(auth, userData.email);
    showMessage('Se ha enviado un correo para restablecer tu contraseña', 'success');

  } catch (error) {
    showMessage('Error al enviar correo de recuperación: ' + error.message);
  }
}


authForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (!username) {
    showMessage('Por favor ingresa tu usuario');
    return;
  }

  try {
    showLoading();
    const user = await loginWithUsernamePassword(username, password);

    if (window.selectedProfile === 'estudiante') {
      // ✅ Login simulado (sin Firebase Auth)
      console.log("🎓 Login de estudiante exitoso:", user.username);
      showMessage('Inicio de sesión exitoso', 'success');
      setTimeout(() => redirectUser('estudiante'), 2000);
    } else {
      // 🔐 Login con Firebase Auth
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("No hay sesión activa");

      await saveUserProfile(currentUser, window.selectedProfile);
      showMessage('Inicio de sesión exitoso', 'success');
      setTimeout(() => redirectUser(window.selectedProfile), 2000);
    }

  } catch (error) {
    hideLoading();
    showMessage('Error al iniciar sesión: ' + error.message);
  }
});




onAuthStateChanged(auth, (user) => {
  if (window.selectedProfile === 'estudiante') {
    // No aplicar para estudiantes
    return;
  }

  if (user) {
    console.log("✅ Usuario autenticado:", user.uid);

    const uid = user.uid;
    const docRef = doc(db, "users", uid);
    setDoc(docRef, { test: true }, { merge: true })
      .then(() => {
        console.log("✅ Prueba de escritura exitosa en Firestore");
      })
      .catch((error) => {
        console.error("❌ Error al escribir en Firestore:", error.message);
      });
  } else {
    console.warn("⚠️ No hay usuario autenticado");
  }
});



window.goBack = goBack;

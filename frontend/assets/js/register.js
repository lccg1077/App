import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
// Configuración de Firebase
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

// Función para registrar usuario AUTOMÁTICAMENTE
async function registerUserAutomatically(formData) {
    try {
        let authUser = null;

        if (formData.rol !== 'estudiante' && formData.email) {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
            authUser = userCredential.user;
        }

        // Construir datos para Firestore
        const userData = {
            username: formData.username,
            password: formData.password,
            profile: formData.rol.trim().toLowerCase(),
            createdAt: serverTimestamp()
        };

        let docRef;

        if (authUser?.uid) {
            // Si es un usuario autenticado (profesor, padre, admin)
            userData.email = authUser.email;
            userData.uid = authUser.uid;

            await setDoc(doc(db, "users", authUser.uid), userData);
            docRef = { id: authUser.uid };
        } else {
            // Si es estudiante sin autenticación
            try {
                docRef = await addDoc(collection(db, "estudiantes"), userData);
            } catch (error) {
                console.warn("⚠️ Error al guardar estudiante sin autenticación:", error);
                throw error; // vuelve a lanzar para que el catch principal lo capture
            }

        }

        console.log('✅ Usuario guardado automáticamente con ID:', docRef.id);

        return {
            success: true,
            id: docRef.id,
            message: `${formData.rol} registrado exitosamente`
        };

    } catch (error) {
        console.error('❌ Error automático:', error);

        // Traducción de errores de Firebase Auth
        let errorMessage = 'Error desconocido';
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'Este correo ya está registrado';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'La contraseña debe tener al menos 6 caracteres';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'El formato del correo no es válido';
        }

        return { success: false, error: errorMessage };
    }
}

// Hacer disponible globalmente
window.registerUserAutomatically = registerUserAutomatically;

// Variables
const form = document.getElementById('registerForm');
const passwordInput = document.getElementById('password');
const emailInput = document.getElementById('email');
const emailGroup = emailInput?.closest('.form-group');

const strengthIndicator = document.getElementById('passwordStrength');
const strengthBar = document.getElementById('strengthBar');
const submitBtn = document.querySelector('.submit-btn');
const spinner = document.getElementById('spinner');
const btnText = document.getElementById('btnText');
const successMessage = document.getElementById('successMessage');

// Función para mostrar/ocultar campo de email según el rol
function toggleEmailField() {
    const selectedRole = document.querySelector('input[name="rol"]:checked');

    if (selectedRole && selectedRole.value === 'estudiante') {
        emailGroup.style.display = 'none';
        emailInput.removeAttribute('required');
        emailInput.value = ''; // Limpiar el campo si estaba lleno
    } else {
        emailGroup.style.display = 'block';
        emailInput.setAttribute('required', 'required');
    }
}

// Animación de entrada
document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('.register-container');
    container.style.opacity = '0';
    container.style.transform = 'translateY(30px)';

    setTimeout(() => {
        container.style.transition = 'all 0.6s ease';
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 100);
});

// Evaluador de fortaleza de contraseña
function evaluatePasswordStrength(password) {
    let score = 0;
    let feedback = '';

    if (password.length >= 8) score += 25;
    if (/[a-z]/.test(password)) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;

    if (score <= 25) {
        feedback = 'Muy débil';
        return { score, feedback, color: '#e53e3e' };
    } else if (score <= 50) {
        feedback = 'Débil';
        return { score, feedback, color: '#dd6b20' };
    } else if (score <= 75) {
        feedback = 'Buena';
        return { score, feedback, color: '#d69e2e' };
    } else {
        feedback = 'Excelente';
        return { score, feedback, color: '#38a169' };
    }
}

// Event listener para la contraseña
passwordInput.addEventListener('input', function () {
    const password = this.value;

    if (password.length > 0) {
        strengthIndicator.classList.add('show');
        const strength = evaluatePasswordStrength(password);

        strengthBar.style.width = strength.score + '%';
        strengthBar.style.background = strength.color;
    } else {
        strengthIndicator.classList.remove('show');
    }
});

// Efecto de typing en placeholders
const inputs = document.querySelectorAll('input[type="text"], input[type="email"]');
inputs.forEach(input => {
    input.addEventListener('focus', function () {
        this.style.transform = 'translateY(-2px)';
    });

    input.addEventListener('blur', function () {
        this.style.transform = 'translateY(0)';
    });
});

// Animación de selección de roles
const roleOptions = document.querySelectorAll('.role-option input');
roleOptions.forEach(option => {
    option.addEventListener('change', function () {
        // Resetear todas las opciones
        document.querySelectorAll('.role-card').forEach(card => {
            card.style.transform = 'scale(1)';
        });

        // Animar la opción seleccionada
        if (this.checked) {
            const card = this.nextElementSibling;
            setTimeout(() => {
                card.style.transform = 'scale(1.05)';
            }, 100);
        }

        // Mostrar/ocultar campo de email
        toggleEmailField();
    });
});

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    submitBtn.classList.add('loading');
    spinner.style.display = 'inline-block';
    btnText.textContent = 'Creando cuenta...';

    const formData = {
        username: document.getElementById('username').value,
        rol: document.querySelector('input[name="rol"]:checked')?.value,
        password: document.getElementById('password').value,
        email: document.getElementById('email')?.value || null
    };

    // ✅ LLAMA la función real de Firebase
    const result = await registerUserAutomatically(formData);

    if (result.success) {
        successMessage.style.display = 'block';
        submitBtn.classList.remove('loading');
        spinner.style.display = 'none';
        btnText.textContent = 'Cuenta creada ✓';
        submitBtn.style.background = 'linear-gradient(135deg, #48bb78, #38a169)';

        setTimeout(() => {
            window.location.href = '../index.html'; // Redirige al login
        }, 3000);
    } else {
        alert('❌ Error: ' + result.error);
        submitBtn.classList.remove('loading');
        spinner.style.display = 'none';
        btnText.textContent = 'Crear cuenta';
    }
});


// Efectos de partículas en hover
document.addEventListener('mousemove', function (e) {
    const shapes = document.querySelectorAll('.shape');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.5;
        const x = mouseX * speed;
        const y = mouseY * speed;

        shape.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Validación en tiempo real
emailInput.addEventListener('blur', function () {
    const email = this.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && !emailRegex.test(email)) {
        this.style.borderColor = '#e74c3c';
        this.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
    } else if (email) {
        this.style.borderColor = '#27ae60';
        this.style.boxShadow = '0 0 0 3px rgba(39, 174, 96, 0.1)';
    }
});

// Inicializar estado del formulario
document.addEventListener('DOMContentLoaded', function () {
    // Ocultar email por defecto
    emailGroup.style.display = 'none';
});

let selectedAvatar = 'MG';
let studentCount = 32;

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('show');
}

function mostrarSeccion(e, id) {
    // Asegurar que el evento está definido
    if (!e) return;

    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });

    const clickedItem = e.currentTarget;
    if (clickedItem) {
        clickedItem.classList.add('active');
    }

    document.querySelectorAll('.content-page').forEach(page => {
        page.style.display = 'none';
    });

    const paginaActiva = document.getElementById(id);
    if (paginaActiva) {
        paginaActiva.style.display = 'block';
        paginaActiva.style.animation = 'slideInRight 0.4s ease-out';
    }

    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('show');
    }
}



function selectAvatar(element, avatar) {
    document.querySelectorAll('.avatar-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    element.classList.add('selected');
    selectedAvatar = avatar;
}

function updateStudentCount() {
    const count = document.getElementById('studentCountInput').value;
    document.getElementById('totalStudents').textContent = count;
    document.getElementById('studentsCount').textContent = count;
    document.getElementById('attendanceStudents').textContent = count;
    studentCount = count;
}

window.cerrarSesion = function() {
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            alert('👋 ¡Hasta pronto!\n\nSesión cerrada exitosamente.');
            // Aquí se redirigiría al login
            window.location.href = '../index.html';
        }
    };

function guardarPerfil() {
    const nombre = document.getElementById('nombreInput').value;
    const studentCountNew = document.getElementById('studentCountInput').value;
    
    document.getElementById('sidebarName').textContent = nombre;
    document.getElementById('sidebarAvatar').textContent = selectedAvatar;
    
    updateStudentCount();
    
    alert('✅ Perfil actualizado correctamente');
}


document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.querySelector('.sidebar-toggle');

    if (
        window.innerWidth <= 768 &&
        sidebar.classList.contains('show') &&
        !sidebar.contains(event.target) &&
        !toggle.contains(event.target)
    ) {
        sidebar.classList.remove('show');
    }
});
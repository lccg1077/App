
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
}

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionId).classList.add('active');

    // Update active menu item
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.menu-item').classList.add('active');

    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'contenido': 'Gestión de Contenidos',
        'usuarios': 'Administrar Estudiantes',
        'docentes': 'Gestión de Docentes',
        'colaboracion': 'Chat con Docentes',
        'reportes': 'Reportes y Análisis',
        'configuracion': 'Configuración del Sistema'
    };
    document.getElementById('pageTitle').textContent = titles[sectionId];
}

// Add some interactive animations
document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});
function cerrarSesion() {
    if (confirm('¿Deseas cerrar sesión?')) {
        alert('Sesión cerrada correctamente');
        window.location.href = '../index.html';
    }
}

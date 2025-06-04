
        function mostrarSeccion(seccionId) {
            // Ocultar todas las secciones
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // Mostrar la sección seleccionada
            document.getElementById(seccionId).classList.add('active');
            
            // Actualizar el menú activo
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            document.querySelector(`[data-section="${seccionId}"]`).classList.add('active');
        }

        function cerrarSesion() {
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                // Aquí puedes agregar la lógica para cerrar sesión
                alert('Sesión cerrada correctamente');
                window.location.href = '../index.html'; // Redirigir al login
            }
        }
    
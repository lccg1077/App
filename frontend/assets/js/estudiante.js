// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // Control del menú
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const menuItems = document.querySelectorAll('.menu-item');

    if (menuToggle && sidebar && overlay) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });

        overlay.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    // Función para mostrar secciones - DEFINIDA GLOBALMENTE
    window.mostrarSeccion = function(id) {
        // Ocultar todas las secciones
        document.querySelectorAll('.seccion').forEach(s => {
            s.classList.remove('active');
        });
       
        // Mostrar la sección seleccionada
        const seccion = document.getElementById(id);
        if (seccion) {
            seccion.classList.add('active');
        }
       
        // Actualizar menú activo
        menuItems.forEach(item => item.classList.remove('active'));
        
        // Buscar el elemento del menú que corresponde a esta sección
        const menuItem = document.querySelector(`[onclick*="${id}"]`);
        if (menuItem) {
            menuItem.classList.add('active');
        }
       
        // Cerrar menú en móvil
        if (window.innerWidth <= 1024) {
            if (menuToggle && sidebar && overlay) {
                menuToggle.classList.remove('active');
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            }
        }
    };

    // Función para iniciar temáticas - DEFINIDA GLOBALMENTE
    window.iniciarTematica = function(tipo) {
        alert(`¡Excelente! Comenzarás a practicar ${tipo}.\n\n✨ Próximamente tendrás ejercicios interactivos aquí.`);
    };

    // Función para cerrar sesión - DEFINIDA GLOBALMENTE
    window.cerrarSesion = function() {
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            alert('👋 ¡Hasta pronto!\n\nSesión cerrada exitosamente.');
            // Aquí se redirigiría al login
            window.location.href = '../index.html';
        }
    };

    // Función para cargar tareas (simulación de llamada a API)
    function cargarTareas() {
        // Esto se conectaría a la base de datos para obtener las tareas asignadas
        // Por ahora mostramos el estado vacío
        console.log('Cargando tareas desde la base de datos...');
    }

    // Manejar selección de avatares
    const avatarOptions = document.querySelectorAll('.avatar-option');
    avatarOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remover clase active de todos los avatares
            avatarOptions.forEach(opt => opt.classList.remove('active'));
            // Agregar clase active al avatar seleccionado
            this.classList.add('active');
            
            // Actualizar avatares en la interfaz
            const selectedAvatar = this.dataset.avatar;
            const selectedName = this.dataset.name;
            
            // Actualizar avatar en sidebar y inicio
            const sidebarAvatar = document.getElementById('sidebarAvatar');
            const inicioAvatar = document.getElementById('inicioAvatar');
            
            if (sidebarAvatar) sidebarAvatar.textContent = selectedAvatar;
            if (inicioAvatar) inicioAvatar.textContent = selectedAvatar;
        });
    });

    // Prevenir envío del formulario
    const formPerfil = document.querySelector('form');
    if (formPerfil) {
        formPerfil.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('✅ ¡Perfil guardado exitosamente!\n\nTus cambios han sido registrados.');
        });
    }

    // Cerrar menú al redimensionar ventana
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024 && overlay) {
            overlay.classList.remove('active');
        }
    });

    // Inicializar la carga de tareas al cargar la página
    cargarTareas();
    
    console.log('EduConnect - Portal Estudiante cargado correctamente');
});
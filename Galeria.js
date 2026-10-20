document.addEventListener('DOMContentLoaded', () => {

    // --- 1. GENERADOR DE FONDO INTERACTIVO (Hojas cayendo) ---
    const interactiveBg = document.getElementById('interactiveBg');
    const leafCount = 18;

    for (let i = 0; i < leafCount; i++) {
        const leaf = document.createElement('div');
        leaf.classList.add('leaf');
        
        // Tamaños, posiciones y velocidades aleatorias
        const size = Math.random() * 15 + 10; // entre 10px y 25px
        leaf.style.width = `${size}px`;
        leaf.style.height = `${size * 1.2}px`;
        leaf.style.left = `${Math.random() * 100}vw`;
        
        const duration = Math.random() * 8 + 6; // entre 6s y 14s
        const delay = Math.random() * 5; // entre 0s y 5s
        
        leaf.style.animationDuration = `${duration}s`;
        leaf.style.animationDelay = `${delay}s`;
        
        interactiveBg.appendChild(leaf);
    }

    // --- 2. DATOS INICIALES Y LOCALSTORAGE ---
    const fotosIniciales = [
        {
            id: 1,
            titulo: 'Bosque Tropical Esmeralda',
            album: 'naturaleza',
            url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
            filtro: 'normal'
        },
        {
            id: 2,
            titulo: 'Valle Nebuloso',
            album: 'naturaleza',
            url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
            filtro: 'brightness'
        },
        {
            id: 3,
            titulo: 'Aventura en la Montaña',
            album: 'viajes',
            url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
            filtro: 'contrast'
        },
        {
            id: 4,
            titulo: 'Tarde de Campo Familiar',
            album: 'familia',
            url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80',
            filtro: 'sepia'
        },
        {
            id: 5,
            titulo: 'Cascada Oculta',
            album: 'naturaleza',
            url: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&w=800&q=80',
            filtro: 'normal'
        },
        {
            id: 6,
            titulo: 'Excursión Otoñal',
            album: 'viajes',
            url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
            filtro: 'grayscale'
        }
    ];

    let galeriaFotos = JSON.parse(localStorage.getItem('verdeGaleria_fotos')) || fotosIniciales;

    function guardarEnLocalStorage() {
        localStorage.setItem('verdeGaleria_fotos', JSON.stringify(galeriaFotos));
    }

    // --- 3. RENDERIZAR GALERÍA (Tarjetas) ---
    const cardsGrid = document.getElementById('cardsGrid');

    function renderizarGaleria(filtroAlbum = 'todos') {
        cardsGrid.innerHTML = '';
        
        const fotosFiltradas = filtroAlbum === 'todos' 
            ? galeriaFotos 
            : galeriaFotos.filter(f => f.album === filtroAlbum);

        if (fotosFiltradas.length === 0) {
            cardsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color: #666; padding: 2rem;">No hay fotos en este álbum todavía. ¡Sube la primera!</p>`;
            return;
        }

        fotosFiltradas.forEach(foto => {
            const card = document.createElement('div');
            card.classList.add('photo-card');
            card.dataset.id = foto.id;

            let claseFiltro = '';
            if (foto.filtro === 'sepia') claseFiltro = 'filter-sepia';
            if (foto.filtro === 'grayscale') claseFiltro = 'filter-grayscale';
            if (foto.filtro === 'brightness') claseFiltro = 'filter-brightness';
            if (foto.filtro === 'contrast') claseFiltro = 'filter-contrast';

            card.innerHTML = `
                <div class="card-img-wrapper">
                    <img src="${foto.url}" alt="${foto.titulo}" class="${claseFiltro}" loading="lazy">
                </div>
                <div class="card-body">
                    <h4>${foto.titulo}</h4>
                    <span class="badge-album">${foto.album}</span>
                </div>
            `;

            // Evento para abrir modal de vista ampliada
            card.addEventListener('click', () => abrirModalVista(foto));
            cardsGrid.appendChild(card);
        });
    }

    // --- 4. SISTEMA DE FILTROS POR ÁLBUM ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const albumSeleccionado = e.target.dataset.filter;
            renderizarGaleria(albumSeleccionado);
        });
    });

    // --- 5. MODALES (Subir y Vista Ampliada) ---
    const modalSubir = document.getElementById('modalSubir');
    const btnSubirModal = document.getElementById('btnSubirModal');
    const closeModal = document.getElementById('closeModal');
    const formSubirFoto = document.getElementById('formSubirFoto');

    btnSubirModal.addEventListener('click', () => modalSubir.style.display = 'flex');
    closeModal.addEventListener('click', () => modalSubir.style.display = 'none');

    // Botón secundario del Hero
    document.getElementById('btnCtaGuardar').addEventListener('click', () => {
        alert('Tus fotos se guardan automáticamente en la memoria local de tu dispositivo. También puedes usar los botones "Descargar" y "Cargar" para respaldarlas en un archivo.');
    });

    // Modal de vista ampliada
    const modalVista = document.getElementById('modalVista');
    const closeModalVista = document.getElementById('closeModalVista');
    const imgVistaAmplia = document.getElementById('imgVistaAmplia');
    const tituloVistaAmplia = document.getElementById('tituloVistaAmplia');
    const albumVistaAmplia = document.getElementById('albumVistaAmplia');
    const btnEliminarFoto = document.getElementById('btnEliminarFoto');
    const btnDescargarFotoIndividual = document.getElementById('btnDescargarFotoIndividual');
    
    let fotoActualId = null;

    function abrirModalVista(foto) {
        fotoActualId = foto.id;
        imgVistaAmplia.src = foto.url;
        tituloVistaAmplia.textContent = foto.titulo;
        albumVistaAmplia.textContent = foto.album.toUpperCase();
        
        // Aplicar mismo filtro en vista amplia
        imgVistaAmplia.className = '';
        if (foto.filtro === 'sepia') imgVistaAmplia.classList.add('filter-sepia');
        if (foto.filtro === 'grayscale') imgVistaAmplia.classList.add('filter-grayscale');
        if (foto.filtro === 'brightness') imgVistaAmplia.classList.add('filter-brightness');
        if (foto.filtro === 'contrast') imgVistaAmplia.classList.add('filter-contrast');

        modalVista.style.display = 'flex';
    }

    closeModalVista.addEventListener('click', () => modalVista.style.display = 'none');

    // Cerrar modales haciendo clic fuera del contenido
    window.addEventListener('click', (e) => {
        if (e.target === modalSubir) modalSubir.style.display = 'none';
        if (e.target === modalVista) modalVista.style.display = 'none';
    });

    // --- 6. AÑADIR NUEVA FOTO ---
    const fotoArchivoInput = document.getElementById('fotoArchivo');
    let archivoBase64Temp = '';

    fotoArchivoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(uploadEvent) {
                archivoBase64Temp = uploadEvent.target.result;
                document.getElementById('fotoUrl').value = ''; // limpiar URL si usa archivo local
            };
            reader.readAsDataURL(file);
        }
    });

    formSubirFoto.addEventListener('submit', (e) => {
        e.preventDefault();
        const titulo = document.getElementById('fotoTitulo').value;
        const album = document.getElementById('fotoAlbum').value;
        const urlInput = document.getElementById('fotoUrl').value;
        const filtro = document.getElementById('fotoFiltro').value;

        const urlFinal = archivoBase64Temp || urlInput;

        if (!urlFinal) {
            alert('Por favor ingresa una URL de imagen o selecciona un archivo de tu dispositivo.');
            return;
        }

        const nuevaFoto = {
            id: Date.now(),
            titulo,
            album,
            url: urlFinal,
            filtro
        };

        galeriaFotos.unshift(nuevaFoto); // Añadir al inicio
        guardarEnLocalStorage();
        renderizarGaleria();

        // Limpiar formulario y cerrar modal
        formSubirFoto.reset();
        archivoBase64Temp = '';
        modalSubir.style.display = 'none';
        alert('¡Foto agregada exitosamente!');
    });

    // --- 7. ELIMINAR FOTO ---
    btnEliminarFoto.addEventListener('click', () => {
        if (confirm('¿Estás seguro de eliminar esta foto?')) {
            galeriaFotos = galeriaFotos.filter(f => f.id !== fotoActualId);
            guardarEnLocalStorage();
            renderizarGaleria();
            modalVista.style.display = 'none';
        }
    });

    // --- 8. DESCARGAR / CARGAR DATOS (JSON) Y DESCARGAR FOTO INDIVIDUAL ---
    // Descargar foto individual
    btnDescargarFotoIndividual.addEventListener('click', () => {
        const foto = galeriaFotos.find(f => f.id === fotoActualId);
        if (!foto) return;

        const a = document.createElement('a');
        a.href = foto.url;
        a.download = `${foto.titulo.replace(/\s+/g, '_')}.jpg`;
        // Nota: para URLs externas CORS puede bloquear la descarga directa, simulamos apertura en nueva pestaña si falla
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    // Descargar toda la galería en JSON
    const btnDescargarTodo = document.getElementById('btnDescargarTodo');
    btnDescargarTodo.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(galeriaFotos, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "verdeGaleria_respaldo.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    });

    // Cargar datos desde JSON
    const inputCargarTodo = document.getElementById('inputCargarTodo');
    inputCargarTodo.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const datosCargados = JSON.parse(event.target.result);
                if (Array.isArray(datosCargados)) {
                    galeriaFotos = datosCargados;
                    guardarEnLocalStorage();
                    renderizarGaleria();
                    alert('¡Galería cargada y restaurada exitosamente!');
                } else {
                    alert('El archivo no tiene el formato correcto.');
                }
            } catch (err) {
                alert('Error al leer el archivo JSON.');
            }
        };
        reader.readAsText(file);
    });

    // --- 9. CARRUSEL DE IMÁGENES AUTOMÁTICO / MANUAL ---
    const track = document.getElementById('carouselTrack');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.getElementById('nextSlide');
        const prevButton = document.getElementById('prevSlide');

        const slideWidth = slides[0].getBoundingClientRect().width;

        // Posicionar slides uno al lado de otro (si se requiere carrusel deslizante horizontal o se maneja por opacidad)
        // En nuestro CSS actual manejamos opacidad, así que creamos la lógica de cambio de clase:
        let currentIndex = 0;

        function actualizarCarrusel(targetIndex) {
            slides[currentIndex].classList.remove('current-slide');
            slides[targetIndex].classList.add('current-slide');
            currentIndex = targetIndex;
        }

        nextButton.addEventListener('click', () => {
            const nextIndex = (currentIndex + 1) % slides.length;
            actualizarCarrusel(nextIndex);
        });

        prevButton.addEventListener('click', () => {
            const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
            actualizarCarrusel(prevIndex);
        });

        // Auto-play carrusel cada 5 segundos
        setInterval(() => {
            const nextIndex = (currentIndex + 1) % slides.length;
            actualizarCarrusel(nextIndex);
        }, 5000);
    }

    // Inicializar renderizado por primera vez
    renderizarGaleria();
});
// ==========================================================================
// 1. BASES DE DATOS Y DICCIONARIOS GLOBALES (Memoria estática)
// ==========================================================================
let listaDeCanciones = [];
let listaDeCarpetas = JSON.parse(localStorage.getItem('mis_carpetas')) || [
    { nombre: "LENTAS", canciones: 0 },
    { nombre: "RAPIDAS", canciones: 0 },
    { nombre: "INTERMEDIAS", canciones: 0 },
    { nombre: "ROCK", canciones: 0 },
    { nombre: "NU METAL", canciones: 0 },
    { nombre: "MIS FAVORITOS", canciones: 0 }
];

const dbAcordesGuitarra = {
    'C': { t: ['x',3,2,0,1,0] }, 'C#': { t: ['x',4,6,6,6,4], c: 4 }, 'Db': { t: ['x',4,6,6,6,4], c: 4 },
    'D': { t: ['x','x',0,2,3,2] }, 'D#': { t: ['x',6,8,8,8,6], c: 6 }, 'Eb': { t: ['x',6,8,8,8,6], c: 6 },
    'E': { t: [0,2,2,1,0,0] }, 'F': { t: [1,3,3,2,1,1], c: 1 },
    'F#': { t: [2,4,4,3,2,2], c: 2 }, 'Gb': { t: [2,4,4,3,2,2], c: 2 },
    'G': { t: [3,2,0,0,0,3] }, 'G#': { t: [4,6,6,5,4,4], c: 4 }, 'Ab': { t: [4,6,6,5,4,4], c: 4 },
    'A': { t: ['x',0,2,2,2,0] }, 'A#': { t: ['x',1,3,3,3,1], c: 1 }, 'Bb': { t: ['x',1,3,3,3,1], c: 1 },
    'B': { t: ['x',2,4,4,4,2], c: 2 },
    'Cm': { t: ['x',3,5,5,4,3], c: 3 }, 'Dm': { t: ['x','x',0,2,3,1] }, 'Em': { t: [0,2,2,0,0,0] },
    'Fm': { t: [1,3,3,1,1,1], c: 1 }, 'Gm': { t: [3,5,5,3,3,3], c: 3 }, 'Am': { t: ['x',0,2,2,1,0] },
    'Bm': { t: ['x',2,4,4,3,2], c: 2 }, 'C#m': { t: ['x',4,6,6,5,4], c: 4 }, 'F#m': { t: [2,4,4,2,2,2], c: 2 },
    'A#m': { t: ['x',1,3,3,2,1], c: 1 }, 'Bbm': { t: ['x',1,3,3,2,1], c: 1 },
    'D#m': { t: ['x',6,8,8,7,6], c: 6 }, 'Ebm': { t: ['x',6,8,8,7,6], c: 6 },
    'G#m': { t: [4,6,6,4,4,4], c: 4 }, 'Abm': { t: [4,6,6,4,4,4], c: 4 }
};

const padRelativos = {
    'A': 'F#m', 'A#': 'Gm', 'B': 'G#m', 'C': 'Am', 'C#': 'A#m', 
    'D': 'Bm', 'D#': 'Cm', 'E': 'C#m', 'F': 'Dm', 'F#': 'D#m', 
    'G': 'Em', 'G#': 'Fm'
};

const tonoMultiplicador = {
    'C': 1.0, 'C#': 1.05946, 'D': 1.12246, 'D#': 1.18920, 'E': 1.25992, 
    'F': 1.33483, 'F#': 1.41421, 'G': 1.49830, 'G#': 1.58740, 'A': 1.68179, 
    'A#': 1.78179, 'B': 1.88774
};

const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const normalizeMap = { 'Db':'C#', 'Eb':'D#', 'Gb':'F#', 'Ab':'G#', 'Bb':'A#', 'E#':'F', 'B#':'C', 'Cb':'B', 'Dbm': 'C#m', 'Ebm': 'D#m', 'Gbm': 'F#m', 'Abm': 'G#m', 'Bbm': 'A#m' };

const listaAccionesApp = [
    { id: "Ninguno", key: "act_none", bold: false }, 
    { id: "Página siguiente", key: "act_next_page", bold: false },
    { id: "Página anterior", key: "act_prev_page", bold: false }, 
    { id: "Canción siguiente", key: "act_next_song", bold: false },
    { id: "Canción anterior", key: "act_prev_song", bold: false }, 
    { id: "Ir hacia arriba", key: "act_scroll_up", bold: false },
    { id: "Ir hacia abajo", key: "act_scroll_down", bold: false }, 
    { id: "Play - Desplazamiento", key: "act_play_scroll", bold: false },
    { id: "Metronomo", key: "act_metro", bold: false }, 
    { id: "Zoom +", key: "act_zoom_in", bold: false },
    { id: "Zoom -", key: "act_zoom_out", bold: false }, 
    { id: "Zoom Reset", key: "act_zoom_reset", bold: false },
    { id: "Subir Tonalidad", key: "act_tone_up", bold: false }, 
    { id: "Bajar Tonalidad", key: "act_tone_down", bold: false },
    { id: "Play - Pista", key: "act_play_track", bold: false }, 
    { id: "Anterior - Pista", key: "act_prev_track", bold: false },
    { id: "Siguiente - Pista", key: "act_next_track", bold: false }, 
    { id: "Pantalla Completa", key: "act_fullscreen", bold: false }
];

const TUNER_CONFIG = {
    A4: 440.0,
    tolerance: 3,      
    smoothing: 0.80,   
    noiseGate: 0.01,   
    lockMargin: 0.15,  
    lockFrames: 10,    
    guitarra: { minFreq: 60, maxFreq: 1100, fft: 4096 }, 
    bajo:     { minFreq: 30, maxFreq: 350,  fft: 4096 }  
};

// ==========================================================================
// 2. ESTADO: BIBLIOTECA, EDICIÓN Y NAVEGACIÓN
// ==========================================================================
let modoSeleccion = false;
let cancionesSeleccionadas = [];
let songIndexToMove = null;
let indiceEditando = null;
let indiceAEliminar = null;
let tituloOriginal = "";    
let contenidoOriginal = ""; 
let currentSortCanciones = 'date'; 
let currentSortCarpetas = 'date';  
let origenAccesoRapido = false; 
let modoSeleccionCarpetasActivo = false;
let indiceCarpetaAEliminar = null;
let carpetasSeleccionadas = [];
let bloqueoGhostClick = false;
let historialEdicion = [];
let clockElementCache = null;

// ==========================================================================
// 3. ESTADO: VISOR DE CANCIONES, GESTOS Y CARRUSEL
// ==========================================================================
let currentZoom = 1.0;
let currentCapo = 0;
let modoCarruselActivo = false;
let cancionesEnCarrusel = []; 
let indiceCarruselActual = 0;
let isScrolling = false;
let scrollTimeout = null;
let touchStartX = 0;
let touchEndX = 0;
let touchStartY = 0;
let touchEndY = 0;
let compSettings = {
    escala: 100,
    columnas: 2,
    orientacion: 'portrait'
};

// ==========================================================================
// 4. ESTADO: AUDIO NATIVO Y PISTAS DE ACOMPAÑAMIENTO
// ==========================================================================
let pistaActualOnline = 1;
let isPlayingTrack = false;
let reproductorAudioNativo = new Audio();
const audioUrlsLocales = {};
let contadorPistasAudio = 4;
let playerInactividadTimer = null;


// ==========================================================================
// 5. ESTADO: SINTETIZADOR, PADS Y PEDAL (STOMP BOX)
// ==========================================================================
let padSettings = {
    volumen: 0.8,
    crossfade: 8.4,
    eqActiva: false,
    hpFreq: 48,
    lpFreq: 182
};
const MasterAudio = new (window.AudioContext || window.webkitAudioContext)();
let ctxPad = MasterAudio;
const audioCtxPedal = MasterAudio;
let audioCtxTuner = MasterAudio;
var audioCtx = MasterAudio;

let bufferPadReal = null; 
let padsSonando = {}; 
let notaPadActual = null; 
let rutaAudioPadActual = 'pad-1.mp3'; 
let bufferPedalPersonalizado = null;
let pedalHabilitado = localStorage.getItem('config_pedal_on') === 'true';
let temporizadorBuscador = null;
let cacheAfinadorUI = {
    hz: null,
    center: null,
    left1: null,
    right1: null,
    needle: null
};
// VARIABLES GLOBALES DE ESTADO PARA LA COORDINACIÓN
let seccionActualDom = null; 
let compasActualDeLaSeccion = 0; 
let beatsPorMinutoActual = 0; 
let tiemposPorCompasActual = 4; // Por defecto 4/4
let velocidadScrollCalculada = 0; 
let ultimaVozGuiaAnunciada = "";
let ultimoEncabezadoSincronizado = null; // Memoria para el metrónomo

// ==========================================================================
// 6. ESTADO: AFINADOR VIRTUAL
// ==========================================================================
let analyser = null;
let streamMic = null;
let tunerActive = false;
let tunerAnimationId = null;
let mandoEnVivoAnimationId = null;
let mandoMenuAnimationId = null;
let tunerInstrumentoActual = 'guitarra';
let smoothedRotation = 0; 
let lastFreq = 0;         
let smoothedPitch = 0; 
let currentNeedleRotation = 0; 
let targetNeedleRotation = 0;
let noteLockedFreq = 0;
let wildJumpCounter = 0;
let calibracionHz = 440; 

// ==========================================================================
// 7. ESTADO: METRÓNOMO
// ==========================================================================
var beatsCompas = 4;     
var metroActivo = false;
var timerMetro = null;
var conteoActual = 0;
let tiempoProximoGolpe = 0.0;
var subdivisionMetro = 1; 
var bufferClick = null; 
let vozGuiaSintetizador = window.speechSynthesis;
let tipoVozGuia = 1; 
let autoplayActivo = localStorage.getItem('config_autoplay_master') === 'true';
let countInActivo = false;
let ultimoEncabezadoAnunciado = null;

const mapaPalabrasClave = {
    // SECCIONES NUMERADAS
    'coro 1': 'Coro1.wav', 'coro 2': 'Coro2.wav', 'coro 3': 'Coro3.wav', 'coro 4': 'Coro4.wav',
    'verso 1': 'Verso1.wav', 'verso 2': 'Verso2.wav', 'verso 3': 'Verso3.wav', 'verso 4': 'Verso4.wav', 'verso 5': 'Verso5.wav', 'verso 6': 'Verso6.wav',
    'estrofa 1': 'Verso1.wav', 'estrofa 2': 'Verso2.wav', 'estrofa 3': 'Verso3.wav', 'estrofa 4': 'Verso4.wav', 'estrofa 5': 'Verso5.wav', 'estrofa 6': 'Verso6.wav',
    'puente 1': 'Puente1.wav', 'puente 2': 'Puente2.wav', 'puente 3': 'Puente3.wav', 'puente 4': 'Puente4.wav',
    'pre coro 1': 'Precoro1.wav', 'pre coro 2': 'Precoro2.wav', 'precoro 1': 'Precoro1.wav', 'precoro 2': 'Precoro2.wav',

    // SECCIONES GENERALES
    'intro': 'Intro.wav',
    'coro': 'Coro.wav', 'chorus': 'Coro.wav',
    'verso': 'Verso.wav', 'estrofa': 'Verso.wav',
    'puente': 'Puente.wav', 'bridge': 'Puente.wav',
    'pre coro': 'Precoro.wav', 'precoro': 'Precoro.wav',
    'post coro': 'Postcoro.wav', 'postcoro': 'Postcoro.wav',
    'instrumental': 'Instrumental.wav',
    'interludio': 'Interludio.wav',
    'solo': 'Solo.wav',
    'final': 'Final.wav', 'outro': 'Outro.wav',

    // DINÁMICAS Y BANDA (Para usar en los apuntes * * )
    'a capella': 'A Capella.wav',
    'baja intensidad': 'Baja Intensidad.wav',
    'sube intensidad': 'Sube Intensidad.wav',
    'baja tono': 'Baja Tono.wav',
    'sube tono': 'Sube Tono.wav',
    'suave': 'Suave.wav',
    'toda la banda': 'Toda La Banda.wav',
    'ultima vez': 'Ultima Vez.wav',
    'repetir': 'Repetir.wav',
    'sostener': 'Sostener.wav',
    'pausa': 'Pausa.wav',
    
    // INSTRUMENTOS
    'bajo': 'Bajo.wav',
    'bateria': 'Bateria.wav',
    'entra bateria': 'Entra Bateria.wav',
    'teclado': 'Teclado.wav',
    'guitarra': 'Guitarra.wav'
};

const reproductorVozGuia = new Audio();

// ==========================================================================
// 8. ESTADO: HARDWARE (ATAJOS, JOYSTICK Y BLUETOOTH/PC)
// ==========================================================================
let gamepadRegistroPrevio = {};
let botonAccionActivo = null;
let escaneoJoystickEnCurso = false;
let botonAtajoActivo = null;
let loopJoystickActivo = null;
let peerApp = null;
let conexionConPC = null;
let escuchadorTecladoGlobal = null;

// ==========================================================================
// DICCIONARIO MAESTRO DE IDIOMAS (ES / EN) - DEFINITIVO
// ==========================================================================
const i18n = {
    es: {
        // --- TODO LO DEL HTML (Bloques 1 al 12) ---
        tab_songs: "CANCIONES", tab_folders: "CARPETAS", tab_settings: "AJUSTES",
        menu_general: "General", menu_personalization: "Personalización", menu_diagrams: "Diagramas de Acordes", 
        menu_pedal: "Pedal de Acompañamiento", menu_pads: "Pads de Acompañamiento", menu_advanced: "Avanzado",
        menu_backup: "Copia de Seguridad y Restauración", menu_about: "Acerca de", menu_pro: "Comprar versión completa", 
        settings_title: "Ajustes", theme_title: "Tema:", theme_light: "Claro", theme_dark: "Oscuro",
        lang_title: "Idioma:", lang_es: "Español", lang_en: "Inglés", emphasis_color: "Color de énfasis", 
        new_song_header: "NUEVA CANCIÓN", edit_song_header: "EDITAR CANCIÓN", lbl_title: "TÍTULO DE LA CANCIÓN",
        plh_title: "Escribe el nombre aquí...", lbl_artist: "ARTISTA/GRUPO", plh_artist: "Nombre del artista...", 
        plh_lyrics: "Escribe la letra aquí...", btn_save: "GUARDAR", btn_cancel: "CANCELAR", btn_accept: "ACEPTAR", 
        btn_delete: "ELIMINAR", btn_close: "CERRAR", panel_title_songs: "Todas las canciones", search_song: "Buscar canción",
        sort_by: "Ordenar por: ", sort_date: "Última modificación", sort_visual: "Visuales primero", sort_alpha: "Título (A-Z)", 
        sort_artist: "Artista (A-Z)", import_pdf: "Importar de PDF", import_word: "Importar de Word", view_pdf: "Visualizar PDF", 
        view_img: "Visualizar Imagen", import_pbk: "Importar PraiseBook (.pbk)", import_cho: "Importar ChordPro (.cho)",
        create_song: "Crear canción", create_folder: "Nueva carpeta", bulk_select: "Seleccionar", bulk_select_all: "Seleccionar todo",
        bulk_move: "Mover a:", bulk_share: "Compartir", bulk_delete: "Eliminar", adv_float_title: "Botones Flotantes", 
        adv_float_style: "Estilo de Velocidad:", adv_player_title: "Reproductor Multimedia", adv_player_btn: "Botones de Reproductor flotante:",
        adv_audio_title: "Reproducir Audio", adv_add_track: "+ Añadir Pista", adv_invert_title: "Invertir colores a visualizadores", 
        adv_inv_pdf: "Invertir Colores - PDF", adv_inv_img: "Invertir Colores - Imagen", adv_info_title: "Información de contenido",
        backup_title: "Copia de Seguridad", backup_create: "Crear Copia de Seguridad de la Biblioteca", backup_restore: "Restaurar Biblioteca", 
        backup_auto: "Copia de seguridad automática", share_title: "Compartir", share_print: "IMPRIMIR", share_colors: "Imprimir con Colores", 
        share_chords: "Imprimir con Acordes", share_orientation: "Orientación", share_scale: "Escala", share_layout: "Disposición",
        sync_title: "Vincular con PC", sync_step1: "1. Abre este enlace en tu computadora:", sync_step2: "2. Ingresa este PIN en la PC:", 
        sync_waiting: "Esperando conexión...", about_desc: "Creado con el propósito de equipar a músicos, líderes de alabanza y ministerios para servir con excelencia. PraiseBook es tu herramienta integral para organizar, transponer y dirigir la adoración sin distracciones.",
        about_quote: '"Cántenle una canción nueva;<br>toquen con destreza<br>y den voces de alegría.."', about_credits: "Diseñado y desarrollado con dedicación.",
        pro_subtitle: "EXPERIENCIA SIN LÍMITES", pro_desc: "Estás en la versión de cortesía. Desbloquea <b>todo el poder</b> de la herramienta definitiva para directores de alabanza y sirve con excelencia técnica en cada reunión.",
        pro_f1: "Almacenamiento ilimitado en la nube", pro_f2: "Importación inteligente de PDF y Word", pro_f3: "Sincronización PC-Móvil en tiempo real", 
        pro_f4: "Acceso a Pads Atmosféricos exclusivos", pro_btn: "OBTENER VERSIÓN PRO", pro_footer: "Pago único. Licencia vitalicia vinculada a tu cuenta.",
        tone_adjust: "AJUSTE DE TONO", lbl_meter: "Compás:", lbl_accent: "Acento:", lbl_pulse: "Pulso:", pulse_quarter: "Negras", 
        pulse_eighth: "Corcheas", lbl_sound: "Sonido:", lbl_light: "Luz:", move_title: "Mover a:", tuner_title: "Afinador de Precisión", 
        search_in: "Buscar en:", tone_label: "Tono:", capo_label: "Capo:", lbl_bpm: "BPM:", lbl_speed: "Vel. Letra:",
        select_song_title: "Selecciona una canción", qa_title: "ACCESOS RÁPIDOS", qa_play: "PLAY", qa_chords_on: "ACORDES: ON", 
        qa_chords_off: "ACORDES: OFF", qa_lyrics_on: "LETRA: ON", qa_lyrics_off: "LETRA: OFF", qa_sharp: "SOSTENIDO", qa_flat: "BEMOL", 
        qa_mixed: "HÍBRIDO", qa_scroll_auto: "SCROLL: AUTO", qa_scroll_man: "SCROLL: MANUAL", qa_pads: "PADS", qa_pedal_on: "PEDAL: ON", 
        qa_pedal_off: "PEDAL: OFF", qa_tuner: "AFINADOR", qa_diagram: "DIAGRAMA", qa_theme_dark: "TEMA OSCURO", qa_theme_light: "TEMA CLARO", 
        qa_emphasis: "ENFASIS", qa_styles: "ESTILOS", qa_sync: "SYNC PC", qa_print: "IMPRIMIR", qa_search: "Buscar ONLINE", 
        cipher_std: "Estándar", cipher_lat: "Latino", inst_guitar: "Guitarra", inst_bass: "Bajo", inst_uke: "Ukelele", tuning: "Afinación:", 
        notation: "Notación de Acordes:", not_sharp: "Sostenidos (#)", not_flat: "Bemoles (b)", not_mixed: "Híbrido (#/b)", 
        diag_location: "Ubicación del diagrama de acordes:", diag_hidden: "Oculto", diag_start: "Inicio", diag_end: "Final", 
        diag_fixed: "Fijo", diag_size: "Tamaño del diagrama de acordes:", size_small: "Pequeño", size_normal: "Normal", size_large: "Grande", 
        left_handed: "Gráficos de acordes para zurdos", meta_title: "METADATOS", font_lyrics: "Letra: ", font_chords: "Acorde: ", 
        hide_chords: "Esconder Acordes", hide_lyrics: "Esconder Letra", line_spacing: "Interlineado: ", letter_spacing: "Espaciado: ", 
        bis_function: "Función BIS - x2 - x3", deploy_mult: "Desplegar multiplicadores", structure_title: "ESTRUCTURA", headers_title: "Encabezados", 
        font_size: "Tamaño de la Fuente: ", color_label: "Color", highlight_color: "Color de resaltado", notes_label: "Apuntes", 
        viewer_bg: "Fondo del Visor", btn_reset: "RESTAURAR VALORES PREDETERMINADOS", structure_empty: "Selecciona una canción para ver su estructura.",
		disp_options: "Opciones de visualización:", design_mode: "MODO DE DISEÑO", 
		mode_normal: "Normal", mode_pages: "Dividir la canción en páginas", mode_fit: "Ajustar la canción a una sola página",
		lbl_tone: "TONO", lbl_lyric_spd: "Vel. Letra", lbl_duration: "Duración", lbl_capture: "CAPTURA", 
		lbl_photo: "FOTO", lbl_lyrics_chords: "LETRA Y ACORDES", btn_instructions: "INSTRUCCIONES", waiting_notes: "Esperando notas...",
		pedal_title: "STOMP BOX (BOMBO)", input_device: "Dispositivo de entrada:", 
        assign_shortcut: "Asigne el Atajo", assign_function: "Asigne una Función",
        exec_sound: "Sonido de ejecución:", add_custom_sound: "Añadir sonido propio",
        pads_title: "Pads Atmosféricos", activate_pads: "Activar Pads:", pads_minor: "Menores",
        pads_config: "CONFIGURACIÓN ATMÓSFERA", pads_vol: "Volumen Maestro", 
        pads_cross: "Transición (Crossfade)", pads_eq: "Ecualización Activa", 
        pads_hp: "Highpass (Corte Graves)", pads_lp: "Lowpass (Corte Agudos)",
        add_phone_audio: "AÑADIR AUDIO DEL TELÉFONO",
        act_none: "Ninguno", act_next_page: "Página siguiente", act_prev_page: "Página anterior",
        act_next_song: "Canción siguiente", act_prev_song: "Canción anterior", 
        act_scroll_up: "Ir hacia arriba", act_scroll_down: "Ir hacia abajo", 
        act_play_scroll: "Play - Desplazamiento", act_metro: "Metronomo", 
        act_zoom_in: "Zoom +", act_zoom_out: "Zoom -", act_zoom_reset: "Zoom Reset",
        act_tone_up: "Subir Tonalidad", act_tone_down: "Bajar Tonalidad", 
        act_play_track: "Play - Pista", act_prev_track: "Anterior - Pista", 
        act_next_track: "Siguiente - Pista", act_fullscreen: "Pantalla Completa",
		info_total_songs: "Total de Canciones:", info_pdf_vis: "Total de PDF Visuales:", 
        info_img_vis: "Total de Imagen Visuales:", info_pdf_imp: "Total de PDF Importado:",
        info_word_imp: "Total de WORD Importado:", info_db: "Base de Datos:", info_audio: "Archivos Audio:",
        js_col_single: "1 columna por hoja", js_col_multi: "columnas por hoja",
        js_vertical: "Vertical", js_horizontal: "Horizontal", js_default: "DEFAULT", js_active: "ACTIVO",
        js_no_headers: "No se detectaron encabezados en esta canción.", js_add_audio: "Agrega un audio",
        js_waiting: "Esperando...",
        js_open_first: "Abre una canción primero.",
        js_copied_songs: "¡Canciones copiadas al portapapeles!",
        js_err_tesseract: "Error: La librería de lectura de texto no se cargó correctamente.",
        js_err_native: "El motor nativo no está cargado.",
        js_del_selected: "¿ELIMINAR SELECCIONADOS?",
        js_del_selected_desc: "¿Estás seguro de borrar las canciones seleccionadas?",
        js_shared_songs: "🎵 CANCIONES COMPARTIDAS:\n\n",
        js_tone_prefix: "Tono: ",
        color_lyrics: "COLOR DE LETRA", color_chords: "COLOR DE ACORDES", color_headers: "COLOR DE ENCABEZADOS",
        color_section: "COLOR DE SECCIÓN", color_emphasis: "COLOR DE ÉNFASIS", color_notes: "COLOR DE APUNTES",
        color_bg: "COLOR DE FONDO", color_choose: "ELEGIR COLOR",
        js_visual_share_msg: "Los archivos puramente visuales se compartirán directamente en su formato original.",
        js_no_midi: "Ningún teclado MIDI conectado", js_midi_denied: "Permiso MIDI denegado", js_midi_notsupported: "MIDI no soportado",
		js_sample_lyrics: "Coro:\nG           D\nEsta es una canción\nEm          C\nDe muestra para el monitor\n*Apunte de prueba*",
        js_pdf_loading: "Cargando partitura...",
        js_pdf_error: "Error al cargar PDF",
        js_in_dev: "🛠️ Función en desarrollo. ¡Pronto estará disponible!",
        js_tone: "TONALIDAD: ",
        js_songs_count: "canciones",
        js_search_folder: "Buscar carpeta",
        js_search_song: "Buscar canción",
        js_sort_date_short: "Última modif.",
        js_imported_word: "Importado Word",
        js_imported_pdf: "Importado PDF",
        js_visual_file: "ARCHIVO VISUAL",
        tt_metro: "Metrónomo", tt_slower: "Más lento", tt_scroll: "AutoScroll", tt_faster: "Más rápido",
        tt_zoom_out: "Disminuir tamaño", tt_zoom_reset: "Restablecer tamaño", tt_zoom_in: "Aumentar tamaño",
        tt_pads: "Teclado / Pads", lbl_tone_header: "TONO:", sel_function: "Seleccionar Función",
        sel_pad: "Seleccionar Pad", mode_minor: "Modo Menores", ph_type_here: "Escribe aquí...",
        style_buttons: "Botones (- / +)", style_bar: "Barra deslizante", js_preview_loading: "Cargando vista previa...",
		qa_autoplay: "AUTOPLAY",
		qa_sync_banda: "SYNC BANDA",
		adv_voice_guide_title: "Voz Guía de Encabezados",
		adv_voice_guide_desc: "Anunciar secciones de la canción",
		lbl_guide_voice: "Voz Guía:", lbl_guide_line: "Línea:",

        // --- NUEVO: TEXTOS DINÁMICOS DEL JAVASCRIPT ---
        js_no_songs: "No hay canciones",
        js_untitled: "Sin título",
        js_unknown: "Desconocido",
        js_empty_folder: "Carpeta vacía",
        js_back_folders: "VOLVER A CARPETAS",
        js_back_folders_empty: "VOLVER A CARPETAS (VACÍA)",
        js_no_folders: "No hay carpetas. Crea una primero.",
        js_err_open_first: "Abre una canción primero para poder editarla.",
        js_err_not_found: "No se encontró la canción exacta en la base de datos.",
        js_warn_unsaved: "¿SALIR SIN GUARDAR?",
        js_warn_unsaved_desc: "Tienes cambios pendientes. Si sales ahora, se perderá lo que has escrito.",
        js_btn_yes_exit: "SÍ, SALIR",
        js_del_song_title: "¿ELIMINAR CANCIÓN?",
        js_btn_yes_delete: "SÍ, ELIMINAR",
        js_change_name: "CAMBIAR NOMBRE",
        js_err_folder_exists: "Ya existe una carpeta con ese nombre.",
        js_new_folder: "NUEVA CARPETA",
        js_copied_list: "¡Lista copiada al portapapeles!",
        js_del_folder_title: "¿ELIMINAR CARPETA?",
        js_rem_folder_title: "¿QUITAR DE CARPETA?",
        js_btn_remove: "QUITAR"
    },
    en: {
        // --- TODO LO DEL HTML (Bloques 1 al 12) ---
        tab_songs: "SONGS", tab_folders: "FOLDERS", tab_settings: "SETTINGS",
        menu_general: "General", menu_personalization: "Personalization", menu_diagrams: "Chord Diagrams", 
        menu_pedal: "Stomp Box", menu_pads: "Ambient Pads", menu_advanced: "Advanced",
        menu_backup: "Backup & Restore", menu_about: "About", menu_pro: "Buy full version", 
        settings_title: "Settings", theme_title: "Theme:", theme_light: "Light", theme_dark: "Dark",
        lang_title: "Language:", lang_es: "Spanish", lang_en: "English", emphasis_color: "Emphasis color", 
        new_song_header: "NEW SONG", edit_song_header: "EDIT SONG", lbl_title: "SONG TITLE",
        plh_title: "Type the name here...", lbl_artist: "ARTIST/GROUP", plh_artist: "Artist name...", 
        plh_lyrics: "Type the lyrics here...", btn_save: "SAVE", btn_cancel: "CANCEL", btn_accept: "ACCEPT", 
        btn_delete: "DELETE", btn_close: "CLOSE", panel_title_songs: "All songs", search_song: "Search song",
        sort_by: "Sort by: ", sort_date: "Last modified", sort_visual: "Visuals first", sort_alpha: "Title (A-Z)", 
        sort_artist: "Artist (A-Z)", import_pdf: "Import from PDF", import_word: "Import from Word", view_pdf: "View PDF", 
        view_img: "View Image", import_pbk: "Import PraiseBook (.pbk)", import_cho: "Import ChordPro (.cho)",
        create_song: "Create song", create_folder: "New folder", bulk_select: "Select", bulk_select_all: "Select all",
        bulk_move: "Move to:", bulk_share: "Share", bulk_delete: "Delete", adv_float_title: "Floating Buttons", 
        adv_float_style: "Speed Style:", adv_player_title: "Media Player", adv_player_btn: "Floating Player Buttons:",
        adv_audio_title: "Play Audio", adv_add_track: "+ Add Track", adv_invert_title: "Invert colors for visualizers", 
        adv_inv_pdf: "Invert Colors - PDF", adv_inv_img: "Invert Colors - Image", adv_info_title: "Content Information",
        backup_title: "Backup", backup_create: "Create Library Backup", backup_restore: "Restore Library", 
        backup_auto: "Automatic backup", share_title: "Share", share_print: "PRINT", share_colors: "Print with Colors", 
        share_chords: "Print with Chords", share_orientation: "Orientation", share_scale: "Scale", share_layout: "Layout",
        sync_title: "Link with PC", sync_step1: "1. Open this link on your computer:", sync_step2: "2. Enter this PIN on the PC:", 
        sync_waiting: "Waiting for connection...", about_desc: "Created with the purpose of equipping musicians, worship leaders, and ministries to serve with excellence. PraiseBook is your comprehensive tool to organize, transpose, and lead worship without distractions.",
        about_quote: '"Sing to him a new song;<br>play skillfully, and shout for joy."', about_credits: "Designed and developed with dedication.",
        pro_subtitle: "LIMITLESS EXPERIENCE", pro_desc: "You are on the courtesy version. Unlock <b>all the power</b> of the ultimate tool for worship directors and serve with technical excellence in every meeting.",
        pro_f1: "Unlimited cloud storage", pro_f2: "Smart PDF and Word import", pro_f3: "Real-time PC-Mobile synchronization", 
        pro_f4: "Access to exclusive Ambient Pads", pro_btn: "GET PRO VERSION", pro_footer: "One-time payment. Lifetime license linked to your account.",
        tone_adjust: "TONE ADJUSTMENT", lbl_meter: "Meter:", lbl_accent: "Accent:", lbl_pulse: "Pulse:", pulse_quarter: "Quarter", 
        pulse_eighth: "Eighth", lbl_sound: "Sound:", lbl_light: "Light:", move_title: "Move to:", tuner_title: "Precision Tuner", 
        search_in: "Search in:", tone_label: "Key:", capo_label: "Capo:", lbl_bpm: "BPM:", lbl_speed: "Lyric Spd:",
        select_song_title: "Select a song", qa_title: "QUICK ACCESS", qa_play: "PLAY", qa_chords_on: "CHORDS: ON", 
        qa_chords_off: "CHORDS: OFF", qa_lyrics_on: "LYRICS: ON", qa_lyrics_off: "LYRICS: OFF", qa_sharp: "SHARP", qa_flat: "FLAT", 
        qa_mixed: "HYBRID", qa_scroll_auto: "SCROLL: AUTO", qa_scroll_man: "SCROLL: MANUAL", qa_pads: "PADS", qa_pedal_on: "PEDAL: ON", 
        qa_pedal_off: "PEDAL: OFF", qa_tuner: "TUNER", qa_diagram: "DIAGRAM", qa_theme_dark: "DARK THEME", qa_theme_light: "LIGHT THEME", 
        qa_emphasis: "EMPHASIS", qa_styles: "STYLES", qa_sync: "SYNC PC", qa_print: "PRINT", qa_search: "ONLINE SEARCH",
        cipher_std: "Standard", cipher_lat: "Latin", inst_guitar: "Guitar", inst_bass: "Bass", inst_uke: "Ukulele", tuning: "Tuning:", 
        notation: "Chord Notation:", not_sharp: "Sharps (#)", not_flat: "Flats (b)", not_mixed: "Hybrid (#/b)", 
        diag_location: "Chord diagram location:", diag_hidden: "Hidden", diag_start: "Start", diag_end: "End", 
        diag_fixed: "Fixed", diag_size: "Chord diagram size:", size_small: "Small", size_normal: "Normal", size_large: "Large", 
        left_handed: "Left-handed chord charts", meta_title: "METADATA", font_lyrics: "Lyrics: ", font_chords: "Chords: ", 
        hide_chords: "Hide Chords", hide_lyrics: "Hide Lyrics", line_spacing: "Line spacing: ", letter_spacing: "Letter spacing: ", 
        bis_function: "BIS function - x2 - x3", deploy_mult: "Expand multipliers", structure_title: "STRUCTURE", headers_title: "Headers", 
        font_size: "Font Size: ", color_label: "Color", highlight_color: "Highlight color", notes_label: "Notes", 
        viewer_bg: "Viewer Background", btn_reset: "RESTORE DEFAULT VALUES", structure_empty: "Select a song to see its structure.",
		disp_options: "Display Options:", design_mode: "LAYOUT MODE", 
		mode_normal: "Normal", mode_pages: "Split song into pages", mode_fit: "Fit song to a single page",
		lbl_tone: "KEY", lbl_lyric_spd: "Lyric Spd", lbl_duration: "Duration", lbl_capture: "CAPTURE", 
		lbl_photo: "PHOTO", lbl_lyrics_chords: "LYRICS & CHORDS", btn_instructions: "INSTRUCTIONS", waiting_notes: "Waiting for notes...",
		pedal_title: "STOMP BOX", input_device: "Input device:", 
        assign_shortcut: "Assign Shortcut", assign_function: "Assign Function",
        exec_sound: "Execution sound:", add_custom_sound: "Add custom sound",
        pads_title: "Ambient Pads", activate_pads: "Activate Pads:", pads_minor: "Minor Chords",
        pads_config: "ATMOSPHERE SETTINGS", pads_vol: "Master Volume", 
        pads_cross: "Crossfade", pads_eq: "Active EQ", 
        pads_hp: "Highpass (Cut Lows)", pads_lp: "Lowpass (Cut Highs)",
        add_phone_audio: "ADD AUDIO FROM PHONE",
        act_none: "None", act_next_page: "Next Page", act_prev_page: "Previous Page",
        act_next_song: "Next Song", act_prev_song: "Previous Song", 
        act_scroll_up: "Scroll Up", act_scroll_down: "Scroll Down", 
        act_play_scroll: "Play - AutoScroll", act_metro: "Metronome", 
        act_zoom_in: "Zoom In", act_zoom_out: "Zoom Out", act_zoom_reset: "Reset Zoom",
        act_tone_up: "Key Up", act_tone_down: "Key Down", 
        act_play_track: "Play - Track", act_prev_track: "Previous - Track", 
        act_next_track: "Next - Track", act_fullscreen: "Fullscreen",
		info_total_songs: "Total Songs:", info_pdf_vis: "Total Visual PDFs:", 
        info_img_vis: "Total Visual Images:", info_pdf_imp: "Total Imported PDFs:",
        info_word_imp: "Total Imported WORDs:", info_db: "Database:", info_audio: "Audio Files:",
        js_col_single: "1 column per page", js_col_multi: "columns per page",
        js_vertical: "Portrait", js_horizontal: "Landscape", js_default: "DEFAULT", js_active: "ACTIVE",
        js_no_headers: "No headers detected in this song.", js_add_audio: "Add an audio",
        js_waiting: "Waiting...",
        js_open_first: "Open a song first.",
        js_copied_songs: "Songs copied to clipboard!",
        js_err_tesseract: "Error: Text reading library failed to load.",
        js_err_native: "Native engine is not loaded.",
        js_del_selected: "DELETE SELECTED?",
        js_del_selected_desc: "Are you sure you want to delete the selected songs?",
        js_shared_songs: "🎵 SHARED SONGS:\n\n",
        js_tone_prefix: "Key: ",
        color_lyrics: "LYRICS COLOR", color_chords: "CHORDS COLOR", color_headers: "HEADERS COLOR",
        color_section: "SECTION COLOR", color_emphasis: "EMPHASIS COLOR", color_notes: "NOTES COLOR",
        color_bg: "BACKGROUND COLOR", color_choose: "CHOOSE COLOR",
        js_visual_share_msg: "Purely visual files will be shared directly in their original format.",
        js_no_midi: "No MIDI keyboard connected", js_midi_denied: "MIDI permission denied", js_midi_notsupported: "MIDI not supported",
		js_sample_lyrics: "Chorus:\nG           D\nThis is a sample song\nEm          C\nTo preview the monitor\n*Test note*",
        js_pdf_loading: "Loading sheet music...",
        js_pdf_error: "Error loading PDF",
        js_in_dev: "🛠️ Feature in development. Coming soon!",
        js_tone: "KEY: ",
        js_songs_count: "songs",
        js_search_folder: "Search folder",
        js_search_song: "Search song",
        js_sort_date_short: "Last modif.",
        js_imported_word: "Word Imported",
        js_imported_pdf: "PDF Imported",
        js_visual_file: "VISUAL FILE",
        tt_metro: "Metronome", tt_slower: "Slower", tt_scroll: "AutoScroll", tt_faster: "Faster",
        tt_zoom_out: "Zoom out", tt_zoom_reset: "Reset zoom", tt_zoom_in: "Zoom in",
        tt_pads: "Keyboard / Pads", lbl_tone_header: "KEY:", sel_function: "Select Function",
        sel_pad: "Select Pad", mode_minor: "Minor Mode", ph_type_here: "Type here...",
        style_buttons: "Buttons (- / +)", style_bar: "Slider bar", js_preview_loading: "Loading preview...",
		qa_autoplay: "AUTOPLAY",
		qa_sync_banda: "BAND SYNC",
		adv_voice_guide_title: "Header Guide Voice",
		adv_voice_guide_desc: "Announce song sections",
		lbl_guide_voice: "Guide Voice:", lbl_guide_line: "Line:",

        
        // --- NUEVO: TEXTOS DINÁMICOS DEL JAVASCRIPT ---
        js_no_songs: "No songs available",
        js_untitled: "Untitled",
        js_unknown: "Unknown",
        js_empty_folder: "Empty folder",
        js_back_folders: "BACK TO FOLDERS",
        js_back_folders_empty: "BACK TO FOLDERS (EMPTY)",
        js_no_folders: "No folders. Create one first.",
        js_err_open_first: "Open a song first to edit.",
        js_err_not_found: "Exact song not found in database.",
        js_warn_unsaved: "EXIT WITHOUT SAVING?",
        js_warn_unsaved_desc: "You have unsaved changes. If you exit now, your work will be lost.",
        js_btn_yes_exit: "YES, EXIT",
        js_del_song_title: "DELETE SONG?",
        js_btn_yes_delete: "YES, DELETE",
        js_change_name: "CHANGE NAME",
        js_err_folder_exists: "A folder with that name already exists.",
        js_new_folder: "NEW FOLDER",
        js_copied_list: "List copied to clipboard!",
        js_del_folder_title: "DELETE FOLDER?",
        js_rem_folder_title: "REMOVE FROM FOLDER?",
        js_btn_remove: "REMOVE"
    }
};
// ==========================================================================
// ARRANQUE MAESTRO DE LA APLICACIÓN (ORDENADO Y OPTIMIZADO)
// ==========================================================================
// 🚨 NOTA: Le agregamos la palabra 'async' a la función
window.addEventListener('DOMContentLoaded', async () => { 

    let cancionesGuardadas = await localforage.getItem('mis_canciones');
    
    if (cancionesGuardadas) {
        listaDeCanciones = cancionesGuardadas; // Si hay canciones, las cargamos
    } else {
        // OPERACIÓN RESCATE: Si es la primera vez, vemos si el usuario tenía algo en la mochila vieja
        const cancionesViejas = localStorage.getItem('mis_canciones');
        if (cancionesViejas) {
            listaDeCanciones = JSON.parse(cancionesViejas); // Recuperamos lo viejo
            await localforage.setItem('mis_canciones', listaDeCanciones); // Lo guardamos en el almacén nuevo
            localStorage.removeItem('mis_canciones'); // Destruimos la mochila vieja para liberar espacio
            console.log("Migración de canciones a IndexedDB exitosa.");
        } else {
            listaDeCanciones = []; // Usuario totalmente nuevo
        }
    }

    const listContainer = document.getElementById('main-songs-list');
    if (listContainer) listContainer.innerHTML = ''; 
    if (typeof renderSongs === 'function') renderSongs(listaDeCanciones);

    // --- 2. TEMAS Y DISEÑO GLOBAL ---
    const savedTema = localStorage.getItem('config_tema_global') || 'oscuro';
    const esClaro = savedTema === 'claro';
    if (esClaro) {
        document.body.classList.add('tema-claro');
        const rdClaro = document.getElementById('radio-tema-claro');
        if (rdClaro) rdClaro.checked = true;
    } else {
        const rdOscuro = document.getElementById('radio-tema-oscuro');
        if (rdOscuro) rdOscuro.checked = true;
    }

    const savedDiseno = localStorage.getItem('config_modo_diseno') || 'normal';
    if (typeof cambiarModoDiseno === 'function') cambiarModoDiseno(savedDiseno, false);
    document.querySelectorAll('input[name="diseno"]').forEach(r => { if(r.value === savedDiseno) r.checked = true; });

    const savedAccent = localStorage.getItem('config_accent_color') || '#00FFFF';
    if (typeof updateThemeColor === 'function') updateThemeColor(savedAccent);

    const savedFondo = localStorage.getItem('config_bg_color');
    if (!savedFondo || savedFondo === '#000000') {
        document.documentElement.style.setProperty('--bg-black', esClaro ? '#ffffff' : '#000000');
        if (typeof actualizarVisualBotonColor === 'function') actualizarVisualBotonColor('fondo', 'DEFAULT');
    } else {
        document.documentElement.style.setProperty('--bg-black', savedFondo);
        if (typeof actualizarVisualBotonColor === 'function') actualizarVisualBotonColor('fondo', savedFondo);
    }

    // --- 3. COLORES DE TEXTO Y ELEMENTOS (Acordes, Letra, Encabezado, Resalte, Notas) ---
    const configColores = [
        { key: 'config_chord_color', varCSS: '--chord-color', tipo: 'acorde' },
        { key: 'config_lyrics_color', varCSS: '--lyrics-color', tipo: 'letra' },
        { key: 'config_structure_color', varCSS: '--structure-color', tipo: 'header' }
    ];

    configColores.forEach(conf => {
        const savedColor = localStorage.getItem(conf.key);
        if (savedColor && savedColor !== 'DEFAULT') {
            document.body.style.setProperty(conf.varCSS, savedColor, 'important');
            if (typeof actualizarVisualBotonColor === 'function') actualizarVisualBotonColor(conf.tipo, savedColor);
        } else {
            document.body.style.removeProperty(conf.varCSS);
            if (typeof actualizarVisualBotonColor === 'function') actualizarVisualBotonColor(conf.tipo, 'DEFAULT');
        }
    });

    const savedHighlight = localStorage.getItem('config_highlight_color') || 'transparent';
    document.documentElement.style.setProperty('--highlight-color', savedHighlight);
    if (typeof actualizarVisualBotonColor === 'function') actualizarVisualBotonColor('resaltar', savedHighlight);

    const savedNotes = localStorage.getItem('config_notes_color');
    if (!savedNotes || savedNotes.toUpperCase() === '#FFA500' || savedNotes.toUpperCase() === '#FF9800') {
        document.documentElement.style.setProperty('--notes-color', '#FFA500');
        if (typeof aplicarColorNotas === 'function') aplicarColorNotas('DEFAULT', 'btn-notas-color');
    } else {
        document.documentElement.style.setProperty('--notes-color', savedNotes);
        if (typeof aplicarColorNotas === 'function') aplicarColorNotas(savedNotes, 'btn-notas-color');
    }

    // --- 4. VISIBILIDAD DE ELEMENTOS Y FORMATO ---
    const togglesVisibilidad = [
        { key: 'config_mostrar_apuntes', id: 'switch-mostrar-apuntes', clase: 'apuntes-ocultos', invertir: true },
        { key: 'config_esconder_acordes', id: 'switch-esconder-acordes', clase: 'acordes-ocultos', invertir: false },
        { key: 'config_esconder_letra', id: 'switch-esconder-letra', clase: 'letras-ocultas', invertir: false }
    ];

    togglesVisibilidad.forEach(toggle => {
        const savedVal = localStorage.getItem(toggle.key) === 'true';
        const sw = document.getElementById(toggle.id);
        if (sw) sw.checked = savedVal;
        
        const aplicarClase = toggle.invertir ? !savedVal : savedVal;
        if (aplicarClase) document.body.classList.add(toggle.clase);
        else document.body.classList.remove(toggle.clase);
    });

    const estilosMaestros = [
        { tipo: 'letra', estilo: 'B' }, { tipo: 'letra', estilo: 'I' },
        { tipo: 'acorde', estilo: 'B' }, { tipo: 'acorde', estilo: 'I' }
    ];
    estilosMaestros.forEach(item => {
        if (localStorage.getItem(`config_${item.tipo}_${item.estilo}`) === 'true') {
            const btn = document.querySelector(`button[onclick*="'${item.tipo}', '${item.estilo}'"]`);
            if (btn) btn.classList.add('activo');
        }
    });

    const guardadoEncabezados = localStorage.getItem('config_ver_encabezados');
    const swEncabezados = document.getElementById('switch-encabezados-principal');
    if (swEncabezados && guardadoEncabezados !== null) {
        swEncabezados.checked = (guardadoEncabezados === 'true');
        if (typeof toggleEncabezadosPrincipal === 'function') setTimeout(() => toggleEncabezadosPrincipal(), 300);
    }

    const savedHeaderSize = localStorage.getItem('config_header_size') || '15';
    document.documentElement.style.setProperty('--header-font-size', savedHeaderSize + 'px');
    const sliderH = document.querySelector('input[oninput*="cambiarTamanoEncabezado"]');
    const labelH = document.getElementById('val-font-h');
    if (sliderH) sliderH.value = savedHeaderSize;
    if (labelH) labelH.innerText = savedHeaderSize;

    // --- 5. LECTURA MUSICAL (Cifrado, Afinación, Diagramas) ---
    const savedCifrado = localStorage.getItem('config_cifrado') || 'estandar';
    const savedInstru = localStorage.getItem('config_instrumento') || 'guitarra';
    const savedAfin = (localStorage.getItem('config_afinacion') || 'Standard').toLowerCase();
    const savedNotacion = localStorage.getItem('config_notacion') || 'sostenidos';

    document.querySelectorAll('.segment-item').forEach(item => {
        const onclickText = (item.getAttribute('onclick') || '').toLowerCase();
        if (onclickText.includes(`'${savedCifrado}'`) || 
            onclickText.includes(`'${savedInstru}'`) || 
            onclickText.includes(`'${savedAfin}'`) ||
            onclickText.includes(`'${savedNotacion}'`)) {
            const parent = item.parentElement;
            parent.querySelectorAll('.segment-item').forEach(sib => sib.classList.remove('active'));
            item.classList.add('active');
        }
    });

    const savedUbica = localStorage.getItem('config_diag_ubica') || 'oculto';
    const savedTamano = localStorage.getItem('config_diag_tamano') || 'normal';
    document.querySelectorAll('input[name="ubica"]').forEach(r => {
        if(r.value === savedUbica) r.checked = true;
        r.addEventListener('change', (e) => {
            localStorage.setItem('config_diag_ubica', e.target.value);
            if (typeof refrescarVisorActual === 'function') refrescarVisorActual();
        });
    });
    document.querySelectorAll('input[name="tamano"]').forEach(r => {
        if(r.value === savedTamano) r.checked = true;
        r.addEventListener('change', (e) => {
            localStorage.setItem('config_diag_tamano', e.target.value);
            if (typeof refrescarVisorActual === 'function') refrescarVisorActual();
        });
    });

    const savedZurdos = localStorage.getItem('config_zurdos') === 'true';
    const swZurdos = document.getElementById('switch-zurdos');
    if (swZurdos) swZurdos.checked = savedZurdos;

    const savedMultiplicadores = localStorage.getItem('config_multiplicadores');
    const swMultiplicadores = document.getElementById('switch-multiplicadores');
    if (swMultiplicadores) swMultiplicadores.checked = savedMultiplicadores === null ? true : savedMultiplicadores === 'true';

    // --- 6. AUDIO Y HARDWARE (Reproductor, Afinador, Joystick) ---
    ['joystick', 'teclado', 'midi'].forEach(type => {
        const saved = localStorage.getItem(`config_device_${type}`);
        if (saved) {
            const display = document.getElementById(`${type}-active-name`);
            if (display) display.innerText = saved;
        }
    });

    const arrancarReproductor = localStorage.getItem('config_adv_btn-multi') !== 'false';
    const reproductorFlotante = document.getElementById('floating-player');
    const checkboxAvanzado = document.getElementById('adv-btn-multi');
    if (reproductorFlotante) reproductorFlotante.style.display = arrancarReproductor ? 'flex' : 'none';
    if (checkboxAvanzado) checkboxAvanzado.checked = arrancarReproductor;

    const switchPads = document.getElementById('adv-pads');
    if(switchPads) switchPads.checked = false;

    // --- 7. SISTEMA Y BACKUPS ---
    if (typeof inicializarSeccionAvanzado === 'function') inicializarSeccionAvanzado();

    const autoBackupActivo = localStorage.getItem('config_auto_backup') === 'true';
    const swBackup = document.getElementById('switch-auto-backup');
    if (swBackup) swBackup.checked = autoBackupActivo;

    // --- 8. INICIALIZACIÓN DE MÓDULOS ACTIVOS ---
    inicializarReproductorFlotante();
    actualizarEstadoAtajos();
	escanearMandoEnVivo();
    habilitarArrastreInteligente();
    habilitarSwipePanel();
    habilitarZoomTactil();
    verificarCicloBackup();
    updateClock();
    setInterval(updateClock, 1000);
	limpiarDispositivosFantasma(); 
	
	
	/* CÓDIGO CORREGIDO (Reemplaza las líneas 1260-1270 con esto solo) */
	const sliderLetra = document.querySelector('#section-personalizacion .slider-verde');
	if (sliderLetra) {
		sliderLetra.addEventListener('change', (e) => { // 'change' evita el lag al arrastrar
			const tamaño = e.target.value + 'px';
			localStorage.setItem('config_lyrics_size', tamaño);
		});
	}
	const wrapper = document.getElementById('carousel-wrapper');
	if (wrapper) {
		wrapper.addEventListener('touchstart', e => {
		touchStartX = e.changedTouches[0].screenX;
		touchStartY = e.changedTouches[0].screenY;
	}, {passive: true});

	wrapper.addEventListener('touchend', e => {
		touchEndX = e.changedTouches[0].screenX;
		touchEndY = e.changedTouches[0].screenY;
		manejarSwipe();
	}, {passive: true});
	}
	// --- SISTEMA DE IDIOMAS: CARGA INICIAL ---
    const langGuardado = localStorage.getItem('config_idioma') || 'es';
    const radioLang = document.getElementById('radio-lang-' + langGuardado);
    if (radioLang) radioLang.checked = true;
    aplicarTraduccion();
	// 🔥 FORZAR APAGADO DEL AUTOPLAY AL INICIAR 🔥
    autoplayActivo = false;
    localStorage.setItem('config_autoplay_master', 'false');
    document.body.classList.remove('modo-autoplay');
    
    // Apaga el switch oculto y la línea láser por si acaso
    if (typeof toggleLineaSync === 'function') toggleLineaSync(false);
    const switchLinea = document.getElementById('metro-line');
    if (switchLinea) switchLinea.checked = false;
});
// ------------------- Fin de window.addEventListener --------------------------------//
// =========================================================
// LOS ESCUCHADORES EN VIVO (Los Oídos de la App)
// =========================================================

// OÍDO TECLADO
window.addEventListener('keydown', (e) => {
    // Si estás escribiendo el título de una canción, ignoramos los atajos
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    let nombreTecla = e.code.replace('Key', '').replace('Digit', '');
    ejecutarAccionGlobal(nombreTecla);
});

// OÍDO MIDI
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(midiAccess => {
        for (let input of midiAccess.inputs.values()) {
            input.onmidimessage = (e) => {
                if (e.data[0] === 248) return; // Ignorar reloj
                
                if (e.data[0] >= 144 && e.data[0] <= 159 && e.data[2] > 0) { // Presionar Pad
                    let velocidadMidi = e.data[2]; // Número del 1 al 127
                    let fuerzaDelGolpe = velocidadMidi / 127; // Lo convertimos a un rango de 0.0 a 1.0
                    
                    // Enviamos la acción JUNTO con la fuerza
                    ejecutarAccionGlobal(`Nota ${e.data[1]}`, fuerzaDelGolpe);
                    
                } else if (e.data[0] >= 176 && e.data[0] <= 191 && e.data[2] > 0) { // Pedal
                    ejecutarAccionGlobal(`CC ${e.data[1]}`, 1); // Los pedales de switch siempre van al 100% (1)
                }
            };
        }
    });
}
// =========================================================
// ESCUCHADORES MAESTROS DE LA APP
// =========================================================
window.addEventListener('touchstart', manejadorCierreGlobal, { passive: false, capture: true });
window.addEventListener('click', manejadorCierreGlobal, { passive: false, capture: true });
document.addEventListener('resume', verificarCicloBackup);
// ==========================================================================
// 💾 1. Núcleo y Almacenamiento (Base de Datos y Backups)
// ==========================================================================
function escaparHTML(texto) {
    if (!texto) return "";
    return texto.toString().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function actualizarAlmacenamiento() {
    localforage.setItem('mis_canciones', listaDeCanciones);
}
async function crearCopiaSeguridad(esAutomatica = false) {
    // 🔥 TRADUCCIÓN EN VIVO
    const lang = localStorage.getItem('config_idioma') || 'es';

    // 1. RECOLECTAR TODA LA CONFIGURACIÓN (Colores, ajustes, switches)
    let configuraciones = {};
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key && key.startsWith('config_')) {
            configuraciones[key] = localStorage.getItem(key);
        }
    }

    // 2. EMPAQUETAR TODO EN LA MALETA
    const backupData = {
        canciones: listaDeCanciones,
        carpetas: listaDeCarpetas,
        ajustes_app: configuraciones, // <-- LA NUEVA MAGIA AQUÍ
        fecha: new Date().toISOString(),
        version: "2.0" // Subimos la versión para saber que este backup incluye ajustes
    };

    const jsonString = JSON.stringify(backupData);
    const fechaStr = new Date().toISOString().split('T')[0];
    const prefijo = esAutomatica ? "AutoBackup" : "PraiseBook";
    const nombreArchivo = `${prefijo}_${fechaStr}.pbk`;

    // 3. GUARDADO NATIVO EN DESCARGAS (ANDROID/IOS)
    if (window.Capacitor && window.Capacitor.isNativePlatform()) {
        try {
            const { Filesystem } = Capacitor.Plugins;
            
            // Escribe directamente en la carpeta Descargas (Download)
            await Filesystem.writeFile({
                path: 'Download/' + nombreArchivo,
                data: jsonString,
                directory: 'EXTERNAL_STORAGE', 
                encoding: 'utf8',
                recursive: true
            }).catch(async () => {
                // Plan B: Si la capa de seguridad de Android bloquea Downloads, va a Documentos
                await Filesystem.writeFile({
                    path: nombreArchivo,
                    data: jsonString,
                    directory: 'DOCUMENTS', 
                    encoding: 'utf8'
                });
            });

            if (!esAutomatica) {
                abrirModalDinamico(lang === 'en' ? "BACKUP CREATED" : "COPIA CREADA", false, () => {});
                document.getElementById('md-mensaje').innerText = lang === 'en' 
                    ? `Successfully saved!\nFind the file "${nombreArchivo}" in your phone's Downloads folder.` 
                    : `¡Guardado con éxito!\nBusca el archivo "${nombreArchivo}" en la carpeta de Descargas de tu teléfono.`;
            }
        } catch (error) {
            if (!esAutomatica) alert((lang === 'en' ? "Error saving to phone: " : "Error al guardar en el teléfono: ") + error.message);
        }
    } else {
        // Código de prueba para PC (Navegador)
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nombreArchivo;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        if (!esAutomatica) {
            abrirModalDinamico(lang === 'en' ? "BACKUP CREATED" : "COPIA CREADA", false, () => {});
            document.getElementById('md-mensaje').innerText = lang === 'en' ? "Backup successfully downloaded to your PC." : "Copia descargada con éxito en tu PC.";
        }
    }

    if (esAutomatica) {
        localStorage.setItem('config_last_auto_backup', Date.now().toString());
    }
}
function restaurarCopiaSeguridad(event) {
    // 🔥 TRADUCCIÓN EN VIVO
    const lang = localStorage.getItem('config_idioma') || 'es';

    const archivo = event.target.files[0];
    if (!archivo) return;

    if (!archivo.name.endsWith('.pbk')) {
        abrirModalDinamico(lang === 'en' ? "INVALID FORMAT" : "FORMATO INVÁLIDO", false, () => {});
        document.getElementById('md-mensaje').innerText = lang === 'en' ? "Select a .pbk file generated by PraiseBook." : "Selecciona un archivo .pbk generado por PraiseBook.";
        event.target.value = ''; 
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const contenido = e.target.result;
            const dataDecodificada = JSON.parse(contenido);

            if (!dataDecodificada.canciones || !dataDecodificada.carpetas) {
                throw new Error("El archivo no tiene la estructura correcta.");
            }

            const modal = document.getElementById('confirm-modal');
            const tituloModal = document.getElementById('confirm-title');
            const mensajeModal = document.getElementById('confirm-message');
            const btnConfirmar = document.getElementById('btn-confirm-delete');

            if (modal) {
                tituloModal.innerText = lang === 'en' ? "⚠️ RESTORE EVERYTHING?" : "⚠️ ¿RESTAURAR TODO?";
                tituloModal.style.color = "#ffb347";
                mensajeModal.innerText = lang === 'en' 
                    ? `This will erase your current library and restore ${dataDecodificada.canciones.length} songs, your folders and ALL YOUR VISUAL AND HARDWARE SETTINGS.\n\nAre you sure you want to continue?` 
                    : `Esto borrará tu biblioteca actual y restaurará ${dataDecodificada.canciones.length} canciones, tus carpetas y TODOS TUS AJUSTES VISUALES Y DE HARDWARE.\n\n¿Estás seguro de continuar?`;
                
                btnConfirmar.innerText = lang === 'en' ? "RESTORE" : "RESTAURAR";
                btnConfirmar.style.backgroundColor = "#ffb347";
                btnConfirmar.style.color = "#000";

                btnConfirmar.onclick = function(evento) {
                    if (evento) evento.stopPropagation(); // Evita clicks fantasmas

                    // 1. Restaurar Base de Datos (Canciones y Carpetas)
                    listaDeCanciones = dataDecodificada.canciones;
                    listaDeCarpetas = dataDecodificada.carpetas;

                    actualizarAlmacenamiento();
                    localStorage.setItem('mis_carpetas', JSON.stringify(listaDeCarpetas));

                    // 2. Restaurar Ajustes (Si es un backup nuevo V2.0)
                    if (dataDecodificada.ajustes_app) {
                        // Limpiamos los ajustes viejos para evitar conflictos con versiones anteriores
                        for (let i = localStorage.length - 1; i >= 0; i--) {
                            let key = localStorage.key(i);
                            if (key && key.startsWith('config_')) {
                                localStorage.removeItem(key);
                            }
                        }
                        
                        // Inyectamos los nuevos ajustes
                        Object.keys(dataDecodificada.ajustes_app).forEach(key => {
                            localStorage.setItem(key, dataDecodificada.ajustes_app[key]);
                        });
                    }

                    closeConfirm();
                    
                    tituloModal.style.color = "var(--accent-color)";
                    btnConfirmar.style.backgroundColor = "var(--accent-color)";

                    // 3. Reinicio Rápido para aplicar los colores y estilos en toda la app
                    abrirModalDinamico(lang === 'en' ? "RESTORE SUCCESSFUL" : "RESTAURACIÓN EXITOSA", false, () => {
                        window.location.reload(); // Recarga la app
                    });
                    document.getElementById('md-mensaje').innerText = lang === 'en' 
                        ? "Library and settings successfully restored!\n\nTap 'ACCEPT' to restart the app and apply changes." 
                        : "¡Biblioteca y ajustes restaurados con éxito!\n\nToca 'ACEPTAR' para reiniciar la aplicación y aplicar los cambios.";
                };

                modal.style.setProperty('display', 'flex', 'important');
                modal.style.visibility = 'visible';
                modal.classList.add('active');
            }

        } catch (err) {
            abrirModalDinamico(lang === 'en' ? "ERROR" : "ERROR", false, () => {});
            document.getElementById('md-mensaje').innerText = lang === 'en' ? "Error reading the file. It might be corrupted." : "Error al leer el archivo. Podría estar dañado.";
            console.error(err);
        }
    };
    reader.readAsText(archivo);
    
    event.target.value = ''; 
}
// Función para ejecución automática sin diálogos
async function ejecutarBackupSilencioso() {
    try {
        // 1. Empaquetar TODO: Canciones, Carpetas y Ajustes de Personalización
        let configuraciones = {};
        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);
            if (key && key.startsWith('config_')) {
                configuraciones[key] = localStorage.getItem(key);
            }
        }

        const backupData = {
            canciones: listaDeCanciones,
            carpetas: listaDeCarpetas,
            ajustes_app: configuraciones,
            fecha: new Date().toISOString(),
            version: "2.0"
        };

        const jsonString = JSON.stringify(backupData);
        const fechaStr = new Date().toISOString().split('T')[0];
        const nombreArchivo = `PraiseBook_AutoBackup_${fechaStr}.pbk`;

        // 2. Guardado Directo en Descargas
        if (window.Capacitor && window.Capacitor.isNativePlatform()) {
            const { Filesystem } = Capacitor.Plugins;
            
            await Filesystem.writeFile({
                path: 'Download/' + nombreArchivo,
                data: jsonString,
                directory: 'EXTERNAL_STORAGE', 
                encoding: 'utf8',
                recursive: true
            });
        }
        
        // 3. Registrar éxito para no repetir hasta dentro de 7 días
        localStorage.setItem('config_last_auto_backup', Date.now().toString());

    } catch (error) {
        console.error("Fallo en el backup automático:", error);
    }
}
function verificarCicloBackup() {
    // Si la opción de auto-backup está apagada en ajustes, no hace nada
    if (localStorage.getItem('config_auto_backup') !== 'true') return;

    const ahora = new Date();
    const horaActual = ahora.getHours();
    const ultimoBackup = parseInt(localStorage.getItem('config_last_auto_backup') || "0");
    const unaSemanaMs = 7 * 24 * 60 * 60 * 1000;

    // REGLA: ¿Pasaron 7 días? Y ¿Es la ventana de la madrugada (00:00 a 05:59)?
    // O ¿Es la primera vez que abres la app después de la fecha de respaldo?
    if (ahora.getTime() - ultimoBackup >= unaSemanaMs) {
        if (horaActual >= 0 && horaActual < 6) {
            ejecutarBackupSilencioso();
        }
    }
}

function toggleAutoBackup(activo) {
    const lang = localStorage.getItem('config_idioma') || 'es';
    localStorage.setItem('config_auto_backup', activo);
    if (activo) {
        localStorage.setItem('config_last_auto_backup', Date.now().toString());
        abrirModalDinamico(lang === 'en' ? "AUTOMATIC BACKUP" : "COPIA AUTOMÁTICA", false, () => {});
        document.getElementById('md-mensaje').innerText = lang === 'en' 
            ? "Activated. A .pbk file will be downloaded every 7 days when you open the app." 
            : "Activado. Se descargará un archivo .pbk cada 7 días al abrir la app.";
    }
}
// ==========================================================================
// 📚 2. Gestión de Biblioteca (Canciones)
// ==========================================================================
// --- 5. RENDERIZADO Y BUSCADOR ---
function renderSongs(songsToDisplay) {
    const listContainer = document.getElementById('main-songs-list');
    if (!listContainer) return; 
    listContainer.innerHTML = ''; 

    if (!songsToDisplay || songsToDisplay.length === 0) {
        // 🔥 TRADUCCIÓN: "No hay canciones"
        listContainer.innerHTML = `<div style="color: #666; padding: 20px; text-align: center;">${t('js_no_songs')}</div>`;
        return;
    }
    const cajaInvisible = document.createDocumentFragment();

    songsToDisplay.forEach((song, index) => {
        const div = document.createElement('div');
        div.className = 'song-item';
        
        const estaSeleccionada = modoSeleccion && cancionesSeleccionadas.includes(index);
        if (estaSeleccionada) {
            div.classList.add('selected');
        }

        const esMulticarpeta = song.folders && song.folders.length > 2;
        
        div.innerHTML = `
            <div style="display: flex; align-items: center; width: 100%;">
                <span style="font-family: var(--f-medium); font-size: 0.65rem; color: #444; min-width: 5px; margin-right: 2px; user-select: none;">
                    ${index + 1}
                </span>

                <span class="material-icons" style="margin-right: 15px; color: ${estaSeleccionada ? 'var(--accent-color)' : '#888888'} !important; font-size: 1.35rem !important;">
                    ${song.tipoArchivo === 'pdf' ? 'picture_as_pdf' : (song.tipoArchivo === 'image' ? 'image' : 'music_note')}
                </span>

                <div class="song-text-wrapper" style="flex: 1; min-width: 0; padding-right: 10px;">
                    <div class="s-name" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: var(--f-medium) !important; font-weight: 500 !important; font-size: 1rem; color: #ffffff !important; display: flex; align-items: center;">
                        <!-- 🔥 TRADUCCIÓN: "Sin título" -->
                        ${escaparHTML(song.title || t('js_untitled'))}
                        ${esMulticarpeta ? `<span class="material-icons" style="font-size:14px; color:var(--accent-color); margin-left:6px; opacity: 0.7;" title="Presente en varias carpetas">layers</span>` : ''}
                    </div>
                    <div class="s-author" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #888888 !important; font-size: 0.8rem; font-family: var(--f-medium) !important; margin-top: 2px; font-weight: 500 !important;">
                        <!-- 🔥 TRADUCCIÓN: "Desconocido" -->
                        ${song.artist || t('js_unknown')}
                    </div>
                </div>

                <div class="song-actions-wrapper" style="display: flex; align-items: center; flex-shrink: 0; margin-left: auto; gap: 4px;">
                    <span class="song-key-badge" style="color: var(--accent-color); font-family: var(--f-bold); font-size: 0.75rem; background: rgba(76, 175, 0, 0.1); padding: 2px 6px; border-radius: 4px;">
                        ${(song.tone === 'VISUAL' || song.tone === '--' || !song.tone) ? (song.tone || '--') : transformarAcordeEspecial(song.tone)}
                    </span>

                    <button class="dots-btn" onclick="toggleSongMenu(event, ${index})" style="padding: 0; margin-right: -10px; width: 35px; display: flex; justify-content: center; background: none !important; border: none !important; outline: none !important;">
                        <span class="material-icons" style="font-size: 1.3rem !important; color: #444444 !important;">more_vert</span>
                    </button>
                    
                    <div id="menu-${index}" class="options-menu" style="bottom: auto; top: 35px; right: 10px; width: 180px;">
                        ${!song.isVisual ? `
                        <div class="menu-item" onclick="event.stopPropagation(); editSong(${index})">
                            <!-- 🔥 TRADUCCIÓN: "Editar Contenido" -->
                            <span class="material-icons">edit</span> <span data-i18n="edit_song_header">${t('edit_song_header')}</span>
                        </div>` : ''}
                        
                        <div class="menu-item" onclick="event.stopPropagation(); abrirModalCambiarNombre(${index})">
                            <!-- 🔥 TRADUCCIÓN: "Cambiar Nombre" -->
                            <span class="material-icons">drive_file_rename_outline</span> <span data-i18n="js_change_name">${t('js_change_name')}</span>
                        </div>
                        
                        <div class="menu-item" onclick="event.stopPropagation(); openMoveModal(${index})">
                            <!-- 🔥 TRADUCCIÓN: "Mover a:" -->
                            <span class="material-icons">drive_file_move</span> <span data-i18n="bulk_move">${t('bulk_move')}</span>
                        </div>

                        <div class="menu-item" onclick="event.stopPropagation(); compartirCancion(${index})">
                            <!-- 🔥 TRADUCCIÓN: "Compartir" -->
                            <span class="material-icons">share</span> <span data-i18n="bulk_share">${t('bulk_share')}</span>
                        </div>

                        <div class="menu-item delete" onclick="event.stopPropagation(); deleteSong(${index})">
                            <!-- 🔥 TRADUCCIÓN: "Eliminar" -->
                            <span class="material-icons">delete</span> <span data-i18n="bulk_delete">${t('bulk_delete')}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        div.onclick = () => {
            if (modoSeleccion) {
                const pos = cancionesSeleccionadas.indexOf(index);
                if (pos > -1) {
                    cancionesSeleccionadas.splice(pos, 1);
                    div.classList.remove('selected');
                } else {
                    cancionesSeleccionadas.push(index);
                    div.classList.add('selected');
                }
                actualizarEstadoMenuBulk();
            } else {
                seleccionarCanción(songsToDisplay[index]);
            }
        };
        // 1. Metemos el div en la caja invisible en lugar de la pantalla
        cajaInvisible.appendChild(div); 
    });

    // 2. FUERA DEL BUCLE: Pegamos la caja entera a la pantalla UNA SOLA VEZ
    listContainer.appendChild(cajaInvisible);
}
function quitarAcentos(str) {
    if (!str) return "";
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function filterSongs() {
    // 1. Capturamos lo que escribes al instante
    const rawTerm = document.getElementById('song-search').value.toLowerCase();
    const tabFolders = document.getElementById('tab-folders');
    const esVistaCarpetas = tabFolders ? tabFolders.classList.contains('active') : false;

    // Si borraste el texto, mostramos toda la lista
    if (rawTerm.trim() === "") {
        if (esVistaCarpetas) {
            showFoldersView(); 
        } else {
            renderSongs(listaDeCanciones); 
        }
        return;
    }

    // 2. Normalizamos (quitamos tildes) y separamos por espacios
    const term = quitarAcentos(rawTerm);
    const palabrasBuscadas = term.split(/\s+/).filter(p => p.length > 0);

    if (esVistaCarpetas) {
        // --- BÚSQUEDA EN CARPETAS ---
        const filteredFolders = listaDeCarpetas.filter(folder => {
            const nombre = quitarAcentos((folder.nombre || "").toLowerCase());
            return palabrasBuscadas.every(palabra => nombre.includes(palabra));
        });
        renderCarpetasFiltradas(filteredFolders);
        
    } else {
        // --- BÚSQUEDA EN CANCIONES ---
        const filtered = listaDeCanciones.filter(song => {
            const titulo = quitarAcentos((song.title || "").toLowerCase());
            const artista = quitarAcentos((song.artist || "").toLowerCase());
            const letra = song.isVisual ? "" : quitarAcentos((song.lyrics || "").toLowerCase());

            return palabrasBuscadas.every(palabra => {
                
                // 🧠 LA MAGIA ESTÁ AQUÍ 🧠
                // Si la palabra es muy cortita (1 o 2 letras), SOLO buscamos en Título y Artista.
                // Así evitamos que la letra "L" te traiga todas las canciones del universo.
                if (palabra.length <= 2) {
                    return titulo.includes(palabra) || artista.includes(palabra);
                } 
                // Si ya escribiste 3 letras o más (ej: "lev"), buscamos también dentro de las estrofas.
                else {
                    return titulo.includes(palabra) || artista.includes(palabra) || letra.includes(palabra);
                }
                
            });
        });
        
        renderSongs(filtered);
    }
}
function changeSort(criterio, tipo) {       
    cerrarTodoLoAbierto(); // Oculta el menú
    if (tipo === 'canciones') {
        currentSortCanciones = criterio;
        showSongsView(); // Aplica orden y renderiza
    } else if (tipo === 'carpetas') {
        currentSortCarpetas = criterio;
        showFoldersView(); // Aplica orden y renderiza
    }
}

function showSongsView() {
    // --- ESTA ES LA VARIABLE QUE FALTABA ---
    const tabSongs = document.getElementById('tab-songs');
    const estabaInactivo = tabSongs ? !tabSongs.classList.contains('active') : true;

    if (tabSongs) tabSongs.classList.add('active');
    document.getElementById('tab-folders').classList.remove('active');
    document.getElementById('bar-songs').style.display = 'flex';
    document.getElementById('bar-folders').style.display = 'none';

    // --- NUEVO: CAMBIAR TEXTO DEL BUSCADOR ---
    const buscador = document.getElementById('song-search');
    if (buscador) buscador.placeholder = t('js_search_song');
    
    // Solo reseteamos si venimos de la pestaña de carpetas
    if (estabaInactivo) {
        modoSeleccionCarpetasActivo = false;
        carpetasSeleccionadas = [];
        modoSeleccion = false;
        cancionesSeleccionadas = [];
        
        // 🔥 LA MAGIA: Apaga la barrita visual instantáneamente al cambiar a esta pestaña
        const listContainer = document.getElementById('main-songs-list');
        if (listContainer) {
            listContainer.classList.remove('modo-seleccion-activo', 'modo-seleccion-carpetas');
        }

        if (typeof actualizarEstadoMenuBulk === 'function') actualizarEstadoMenuBulk();
        if (typeof actualizarEstadoMenuBulkCarpetas === 'function') actualizarEstadoMenuBulkCarpetas();
    }
    
    // --- CONTROL DEL MENÚ DE ORDENAMIENTO ---
    document.querySelectorAll('.sort-song-opt').forEach(el => el.style.display = 'flex');
    document.querySelectorAll('.sort-folder-opt').forEach(el => el.style.display = 'none');
    
    const label = document.getElementById('current-sort-label');
    if (label) {
        if (currentSortCanciones === 'title') label.innerText = t('sort_alpha').split(' ')[0]; // Toma solo "Título"
        else if (currentSortCanciones === 'artist') label.innerText = t('sort_artist').split(' ')[0]; // Toma solo "Artista"
        else if (currentSortCanciones === 'date') label.innerText = t('js_sort_date_short');
        else if (currentSortCanciones === 'visual') label.innerText = t('sort_visual').split(' ')[0]; 
    }

    // --- APLICAR ORDENAMIENTO (A-Z, Fechas o Visuales) ---
    listaDeCanciones.sort((a, b) => {
        if (currentSortCanciones === 'date') {
            let dateA = a.fecha ? new Date(a.fecha).getTime() : 0;
            let dateB = b.fecha ? new Date(b.fecha).getTime() : 0;
            return dateB - dateA; // Los más nuevos arriba

        } else if (currentSortCanciones === 'visual') {
            // LÓGICA DE VISUALES: 1 si es visual, 0 si es texto normal
            let esVisualA = (a.isVisual || a.urlArchivo) ? 1 : 0;
            let esVisualB = (b.isVisual || b.urlArchivo) ? 1 : 0;
            
            if (esVisualA !== esVisualB) {
                return esVisualB - esVisualA; // Envía los 1 (visuales) arriba de los 0 (textos)
            }
            // Si hay empate (ambos son visuales o ambos textos), los desempatamos por fecha
            let dateA = a.fecha ? new Date(a.fecha).getTime() : 0;
            let dateB = b.fecha ? new Date(b.fecha).getTime() : 0;
            return dateB - dateA;

        } else {
            let valA = (a[currentSortCanciones] || "").toLowerCase();
            let valB = (b[currentSortCanciones] || "").toLowerCase();
            return valA.localeCompare(valB);
        }
    });

    renderSongs(listaDeCanciones);
}
function seleccionarCanción(song) {
    modoCarruselActivo = false;
	// 🔥 FIX 1: Borrar la memoria del carrusel para matar los títulos fantasma
    cancionesEnCarrusel = [];
    indiceCarruselActual = 0;
	
    const riel = document.getElementById('carousel-rail');
    if (riel) {
        riel.style.transform = 'translateX(0)';
        riel.style.transition = 'none';
    }

    resetZoom(); 
    window.scrollTo(0, 0); // 🔥 FIX: REGRESA EL SCROLL AL INICIO
    
    const headerTitle = document.getElementById('header-song-title');
    if (headerTitle) headerTitle.innerText = song.title;
    // ...
    document.querySelector('.main-title').innerText = song.title;
    document.querySelector('.author-name').innerText = song.artist;
    
    // 🔥 FIX: Traducir a Latino o Bemoles en la cabecera al instante
    const tonoFinal = (song.tone === 'VISUAL' || song.tone === '--' || !song.tone) ? (song.tone || '--') : transformarAcordeEspecial(song.tone);
    document.getElementById('header-tone-label').innerText = tonoFinal;
    
    const visorDiv = document.querySelector('.lyrics-container');
    // ...
    if (visorDiv) {
        // 🔥 ELIMINAMOS EL PADDING Y FORZAMOS EL CENTRO DESDE LA RAÍZ 🔥
        if (song.urlArchivo) {
            if (song.tipoArchivo === 'pdf') {
				visorDiv.innerHTML = `<div class="song-slide" style="width: 100vw !important; padding-left: 0px !important; display: flex !important; align-items: center !important; justify-content: center !important;"><div class="visor-pdf-container" id="pdf-slide-visor-unico" style="width: 100%;"></div></div>`;
				renderizarPDFEnContenedor(song.urlArchivo, 'pdf-slide-visor-unico'); 
			}
            else if (song.tipoArchivo === 'image') {
                visorDiv.innerHTML = `
                    <div class="song-slide" style="width: 100vw !important; padding-left: 0px !important; display: flex !important; align-items: center !important; justify-content: center !important;">
                        <div class="visor-imagen-container">
                            <img src="${song.urlArchivo}" id="img-visual-directa" style="width: 100%;">
                        </div>
                    </div>`;
            }
        } 
        else {
            visorDiv.innerHTML = `<div class="song-slide" style="width: 100vw !important; padding-left: 15px !important; padding-right: 15px !important; display: flex !important; align-items: flex-start !important; justify-content: flex-start !important;">${generarVistaConDiagramas(song.lyrics)}</div>`;
        }
    }
    
    currentCapo = 0;
    if (document.getElementById('capo-value')) document.getElementById('capo-value').innerText = "0";
    if (document.getElementById('capo-indicator')) document.getElementById('capo-indicator').innerText = "";

    toggleSongsPanel();

    // 👇 NUEVO: CONECTAR BPM Y VELOCIDAD DE LA CANCIÓN AL VISOR 👇
    
    // 1. Configurar Metrónomo
    const bpmInput = document.getElementById('bpm-input');
    if (bpmInput) {
        bpmInput.value = song.bpm || 85; // Usa el BPM de la canción, si no tiene, usa 85
        // Si el metrónomo está sonando y cambias de canción, lo actualiza al vuelo
        if (typeof metroActivo !== 'undefined' && metroActivo && typeof iniciarMotorMetro === 'function') {
            if (timerMetro) clearTimeout(timerMetro);
            iniciarMotorMetro();
        }
    }

    const speedInput = document.getElementById('scrollSpeed');
    if (speedInput) {
        // Leemos el número del 1 al 20 que guardaste (ej: 5). Si está vacío, usa 5.
        let velGuardada = parseInt(song.velLetra) || 5; 
        
        // Lo divide entre 10 (ej: 5 -> 0.5, o 1 -> 0.1 que es el súper lento)
        speedInput.value = (velGuardada / 10).toFixed(1); 
    }
    
    // 👆 FIN DE LO NUEVO 👆
    
    setTimeout(() => { 
        if (typeof aplicarModoDiseno === 'function') aplicarModoDiseno(); 
    }, 50);
}
function prepararNuevaCancion() {
    indiceEditando = null;
    tituloOriginal = "";    
    contenidoOriginal = ""; 
    
    document.getElementById('crear-titulo').value = "";
    document.getElementById('crear-artista').value = "";
    document.getElementById('crear-tono').value = "";
    document.getElementById('crear-letra').value = "";
    
    if(document.getElementById('crear-bpm')) document.getElementById('crear-bpm').value = "";
    if(document.getElementById('crear-vel-letra')) document.getElementById('crear-vel-letra').value = "";
    if(document.getElementById('crear-duracion')) document.getElementById('crear-duracion').value = "";
    
    if(document.getElementById('display-notas')) {
    const visorNotasAbajo = document.getElementById('display-notas');
    visorNotasAbajo.innerText = t('waiting_notes'); // <--- REEMPLAZAR AQUÍ
    visorNotasAbajo.style.opacity = "0.6";
	}
    
    // 🔥 EL FIX: Le ponemos un "if" para que no choque si el elemento ya no existe en el HTML
    const visorTonalidad = document.getElementById('crear-display-tonalidad');
    if (visorTonalidad) {
        visorTonalidad.innerHTML = `${t('js_tone')} <span style="color: #fff">--</span>`; // 🔥 TRADUCCIÓN
    }
    
    const headerB = document.querySelector('.c-h-center b');
    if (headerB) headerB.innerText = t('new_song_header'); // 🔥 TRADUCCIÓN
    
    abrirVentanaCrear();
}
function abrirVentanaCrear() {
    document.getElementById('ventana-crear').classList.add('active');
    
    const areaTexto = document.getElementById('crear-letra');
    const visorTonalidad = document.getElementById('crear-display-tonalidad');
    const visorNotasAbajo = document.getElementById('display-notas');
    const inputTono = document.getElementById('crear-tono'); 

    if (areaTexto) {
        historialEdicion = [areaTexto.value];

        areaTexto.oninput = function(e) {
            // Guardamos el estado inteligentemente para el "Deshacer"
            if (!e || e.isTrusted) { 
                if (historialEdicion.length === 0 || historialEdicion[historialEdicion.length - 1] !== areaTexto.value) {
                    historialEdicion.push(areaTexto.value);
                    if(historialEdicion.length > 200) historialEdicion.shift(); // Límite amplio de 200 pasos
                }
            }
            
            const contenido = areaTexto.value;
            const patron = /(?<![A-Za-z])([A-G][#b]?)(m|maj|7|sus|add|dim|aug|[0-9])*(?![A-Za-z])/g;
            const coincidencias = contenido.match(patron) || [];
            const excluidas = ["As", "Va", "He", "Me", "Solo", "Fue", "Del", "Al"];
            let notasUnicas = [];

            coincidencias.forEach(match => {
                let nota = match.trim();
                if (!excluidas.includes(nota) && !notasUnicas.includes(nota)) {
                    notasUnicas.push(nota);
                }
            });

            if (inputTono) {
                if (notasUnicas.length > 0) {
                    inputTono.value = transformarAcordeEspecial(notasUnicas[0]); 
                } else {
                    inputTono.value = "";
                }
            }

            if (visorNotasAbajo) {
                if (notasUnicas.length > 0) {
                    visorNotasAbajo.innerText = t('waiting_notes'); 
                    visorNotasAbajo.style.opacity = "1";
                } else {
                    visorNotasAbajo.innerText = "Esperando notas...";
                    visorNotasAbajo.style.opacity = "0.6";
                }
            }
        };
    }
}
function cerrarVentanaCrear() {
    const titulo = document.getElementById('crear-titulo').value.trim();
    const letra = document.getElementById('crear-letra').value.trim();

    // Comparamos lo que hay escrito con lo que había al abrir la ventana
    const hayCambios = (titulo !== (tituloOriginal || "").trim()) || (letra !== (contenidoOriginal || "").trim());

    // Si NO hay cambios, cerramos directo
    if (!hayCambios) {
        ejecutarCierreVentanaCrear();
        return;
    }

    // Si SÍ hay cambios, llamamos a tu controlador maestro de modales
    mostrarModalConfirmacion(
        t('js_warn_unsaved'), // 🔥 TRADUCCIÓN: "¿SALIR SIN GUARDAR?"
        t('js_warn_unsaved_desc'), // 🔥 TRADUCCIÓN: "Tienes cambios pendientes..."
        t('js_btn_yes_exit'), // 🔥 TRADUCCIÓN: "SÍ, SALIR"
        "var(--accent-color)", // 🔥 FIX: Usa el color de énfasis de la app
        ejecutarCierreVentanaCrear
    );
}

function ejecutarCierreVentanaCrear() {
    document.getElementById('ventana-crear').classList.remove('active');
    
    // Limpiamos la memoria
    indiceEditando = null;
    tituloOriginal = "";    
    contenidoOriginal = ""; 
    
    const headerB = document.querySelector('.c-h-center b');
    if (headerB) headerB.innerText = "NUEVA CANCIÓN";
    
    closeConfirm(); // Cierra el modal de advertencia si estaba abierto
    
    // Escudo anti-clic fantasma
    bloqueoGhostClick = true;
    setTimeout(() => bloqueoGhostClick = false, 400);
}
function resetVariablesEditor() {
    indiceEditando = null;
    tituloOriginal = "";
    contenidoOriginal = "";
    const headerB = document.querySelector('.c-h-center b');
    if (headerB) headerB.innerText = "NUEVA CANCIÓN";
}
function guardarNuevaCancion() {
    const titulo = document.getElementById('crear-titulo').value.trim();
    const artista = document.getElementById('crear-artista').value.trim();
    const tono = document.getElementById('crear-tono').value.trim();
    const letra = document.getElementById('crear-letra').value.trim();

    const bpm = document.getElementById('crear-bpm') ? document.getElementById('crear-bpm').value.trim() : "";
    const velLetra = document.getElementById('crear-vel-letra') ? document.getElementById('crear-vel-letra').value.trim() : "";
    const duracion = document.getElementById('crear-duracion') ? document.getElementById('crear-duracion').value.trim() : "";

    if (!titulo) { 
        const lang = localStorage.getItem('config_idioma') || 'es';
        alert(lang === 'en' ? "Please enter a title." : "Ponle un título."); 
        return; 
    }

    let cancionAActualizar = null;

    if (indiceEditando !== null) {
        cancionAActualizar = listaDeCanciones[indiceEditando];
        cancionAActualizar.title = titulo; // Mantenemos exactamente lo que escribas
        cancionAActualizar.artist = artista;
        cancionAActualizar.tone = tono;
        cancionAActualizar.bpm = bpm;
        cancionAActualizar.velLetra = velLetra;
        cancionAActualizar.duracion = duracion;
        cancionAActualizar.lyrics = letra;
        cancionAActualizar.fecha = new Date().toISOString();
    } else {
        const lang = localStorage.getItem('config_idioma') || 'es';
        cancionAActualizar = { 
            title: titulo, artist: artista, tone: tono, bpm: bpm, velLetra: velLetra, duracion: duracion, lyrics: letra, 
            folder: lang === 'en' ? "Uncategorized" : "Sin Categoría", folders: [], tipoArchivo: "cho", fecha: new Date().toISOString()
        };
        listaDeCanciones.unshift(cancionAActualizar); 
    }

    actualizarAlmacenamiento();
    renderSongs(listaDeCanciones);

    // 🔥 EL REFRESCO EN VIVO INFALIBLE 🔥
    const tituloVisor = document.querySelector('.main-title').innerText;
    
    const limpiezaNuclear = (texto) => {
        if (!texto) return "";
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    };

    // Comprobamos si la canción guardada es la misma que está abierta de fondo
    const esLaMismaEnPantalla = (indiceEditando !== null && limpiezaNuclear(tituloOriginal) === limpiezaNuclear(tituloVisor));
    const esPantallaVacia = (indiceEditando === null && (tituloVisor.includes("---") || tituloVisor.includes("Selecciona")));

    if (esLaMismaEnPantalla || esPantallaVacia) {
        // Si estamos dentro del carrusel de una carpeta
        if (typeof modoCarruselActivo !== 'undefined' && modoCarruselActivo && typeof cancionesEnCarrusel !== 'undefined' && cancionesEnCarrusel.length > 0) {
            cancionesEnCarrusel[indiceCarruselActual] = cancionAActualizar;
            actualizarInfoCancionActual();
            
            const slide = document.querySelectorAll('.song-slide')[indiceCarruselActual];
            if (slide) {
                const idPre = `pre-slide-${indiceCarruselActual}`;
                slide.innerHTML = `<div style="width: 100%; display: flex; flex-direction: column; align-items: flex-start;">${generarVistaConDiagramas(cancionAActualizar.lyrics, idPre)}</div>`;
            }
            if (typeof aplicarModoDiseno === 'function') aplicarModoDiseno();
        } else {
            // Si estamos en la lista normal
            seleccionarCanción(cancionAActualizar);
        }
    }

    // Limpieza de inputs y cierre de ventana
    document.getElementById('crear-titulo').value = "";
    document.getElementById('crear-letra').value = "";
    if(document.getElementById('crear-bpm')) document.getElementById('crear-bpm').value = "";
    if(document.getElementById('crear-vel-letra')) document.getElementById('crear-vel-letra').value = "";

    document.getElementById('ventana-crear').classList.remove('active');
    indiceEditando = null;
    if (typeof cerrarTodoLoAbierto === 'function') cerrarTodoLoAbierto();
}
function editSong(index) {
    indiceEditando = index;
    const song = listaDeCanciones[index];
    
    tituloOriginal = song.title || '';
    contenidoOriginal = song.lyrics || song.contenido || '';
    
    document.getElementById('crear-titulo').value = song.title || '';
    document.getElementById('crear-artista').value = song.artist || '';
    document.getElementById('crear-tono').value = song.tone || '';
    document.getElementById('crear-letra').value = song.lyrics || song.contenido || '';
    
    // NUEVO: Cargamos BPM y Velocidad
    if(document.getElementById('crear-bpm')) document.getElementById('crear-bpm').value = song.bpm || "";
    if(document.getElementById('crear-vel-letra')) document.getElementById('crear-vel-letra').value = song.velLetra || "5";
	if(document.getElementById('crear-duracion')) document.getElementById('crear-duracion').value = song.duracion || "";    
    const headerB = document.querySelector('.c-h-center b');
    if (headerB) headerB.innerText = t('edit_song_header'); // 🔥 TRADUCCIÓN
    
    abrirVentanaCrear();

    const areaTexto = document.getElementById('crear-letra');
    if (areaTexto) areaTexto.dispatchEvent(new Event('input'));

    document.querySelectorAll('.options-menu').forEach(m => m.classList.remove('active'));
}
function editarContenido() {
    let tituloPantalla = document.querySelector('.main-title').innerText;

    // Validamos si hay algo abierto
    if (!tituloPantalla || tituloPantalla.includes("---") || tituloPantalla.includes("Selecciona") || tituloPantalla.includes("Select")) {
        alert(t('js_err_open_first'));
        return;
    }

    // 🔥 LA LIMPIEZA NUCLEAR: Quitamos espacios, acentos, símbolos, paréntesis y mayúsculas.
    const limpiezaNuclear = (texto) => {
        if (!texto) return "";
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Quita acentos
                    .replace(/[^a-zA-Z0-9]/g, "") // Quita TODO lo que no sea letra o número
                    .toLowerCase();
    };

    let tituloLimpio = limpiezaNuclear(tituloPantalla);

    // Buscamos en la base de datos cruzando los textos purificados
    let index = listaDeCanciones.findIndex(c => limpiezaNuclear(c.title || c.titulo) === tituloLimpio);

    // Si por alguna razón extrema falla, buscamos si al menos una contiene a la otra
    if (index === -1) {
        index = listaDeCanciones.findIndex(c => limpiezaNuclear(c.title || c.titulo).includes(tituloLimpio));
    }

    if (index !== -1) {
        editSong(index);
    } else {
        alert(t('js_err_not_found') + ' "' + tituloPantalla.trim() + '"');
    }
}
function deleteSong(index) {        
    const song = listaDeCanciones[index];
    if (!song) return;
    
    indiceAEliminar = index;
    
    // Llamamos al controlador maestro
    mostrarModalConfirmacion(
        t('js_del_song_title'), // 🔥 TRADUCCIÓN: "¿ELIMINAR CANCIÓN?"
        // 🔥 TRADUCCIÓN: Usamos el título del modal y le quitamos el "?" para armar la frase con la canción
        `${t('js_del_song_title').replace('?', '')} "${song.title}"?`, 
        t('js_btn_yes_delete'), // 🔥 TRADUCCIÓN: "SÍ, ELIMINAR"
        "var(--accent-color)",
        ejecutarEliminacion
    );
}


function ejecutarEliminacion() {      
    if (indiceAEliminar !== null) {
        listaDeCanciones.splice(indiceAEliminar, 1);
        actualizarAlmacenamiento(); 
        
        // Sincroniza la cantidad de canciones en las carpetas
        if (typeof actualizarContadoresCarpetas === 'function') {
            actualizarContadoresCarpetas();
        }
        
        renderSongs(listaDeCanciones);
        closeConfirm();
        indiceAEliminar = null;
    }
}
function abrirModalCambiarNombre(index) {
    cerrarTodoLoAbierto(); 
    const song = listaDeCanciones[index];
    if (!song) return;

    // 🔥 TRADUCCIÓN: "CAMBIAR NOMBRE"
    abrirModalDinamico(t('js_change_name'), true, (nuevoNombre) => {
        if (nuevoNombre && nuevoNombre.trim() !== "") {
            song.title = nuevoNombre.trim().toUpperCase();
            actualizarAlmacenamiento();
            renderSongs(listaDeCanciones); 
        }
    });
    
    setTimeout(() => {
        const input = document.getElementById('md-input');
        if (input) input.value = song.title;
    }, 50);
}
function borrarUltimo() {
    const editor = document.getElementById('crear-letra');
    
    // Si tenemos más de 1 estado guardado en la memoria
    if (editor && historialEdicion.length > 1) {
        // 🔥 LA MAGIA: Guardamos el scroll y el cursor actual antes de tocar nada
        const scrollGuardado = editor.scrollTop;
        const cursorGuardado = editor.selectionStart;

        historialEdicion.pop(); // Sacamos el estado actual (el error)
        
        const textoAnterior = historialEdicion[historialEdicion.length - 1];
        editor.value = textoAnterior; // Restauramos la versión pasada
        
        // 🔥 EL ANCLA: Devolvemos el cursor y la vista a donde estabas
        editor.selectionStart = editor.selectionEnd = Math.min(cursorGuardado, textoAnterior.length);
        editor.scrollTop = scrollGuardado;
        
        // Refrescamos la vista
        editor.dispatchEvent(new Event('input')); 
        editor.focus();
    }
}

// ==========================================================================
// 📁 3. Gestión de Carpetas
// ==========================================================================
function showFoldersView() {
    const tabFolders = document.getElementById('tab-folders');
    const tabSongs = document.getElementById('tab-songs');
    const barSongs = document.getElementById('bar-songs');
    const barFolders = document.getElementById('bar-folders');

    // --- NUEVO: CAMBIAR TEXTO DEL BUSCADOR ---
    const buscador = document.getElementById('song-search');
    if (buscador) buscador.placeholder = t('js_search_folder');
    // 1. Verificamos si estamos entrando desde otra pestaña
    const estabaInactivo = tabFolders ? !tabFolders.classList.contains('active') : true;

    if (tabFolders) tabFolders.classList.add('active');
    if (tabSongs) tabSongs.classList.remove('active');
    if (barSongs) barSongs.style.display = 'none';
    if (barFolders) barFolders.style.display = 'flex';

    // 2. Solo reseteamos la memoria si venimos de la pestaña de canciones
    if (estabaInactivo) {
        modoSeleccion = false;
        cancionesSeleccionadas = [];
        modoSeleccionCarpetasActivo = false;
        carpetasSeleccionadas = [];
        if (typeof actualizarEstadoMenuBulk === 'function') actualizarEstadoMenuBulk();
        if (typeof actualizarEstadoMenuBulkCarpetas === 'function') actualizarEstadoMenuBulkCarpetas();
    }

    // --- CONTROL DEL MENÚ DE ORDENAMIENTO ---
    document.querySelectorAll('.sort-song-opt').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.sort-folder-opt').forEach(el => el.style.display = 'flex');

    const label = document.getElementById('current-sort-label');
    if (label) {
        if (currentSortCarpetas === 'nombre') label.innerText = t('sort_alpha').split(' ')[0];
        else if (currentSortCarpetas === 'date') label.innerText = t('js_sort_date_short');
    }

    // --- APLICAR ORDENAMIENTO DE CARPETAS ---
    listaDeCarpetas.sort((a, b) => {
        if (currentSortCarpetas === 'date') {
            let dateA = a.fecha ? new Date(a.fecha).getTime() : 0;
            let dateB = b.fecha ? new Date(b.fecha).getTime() : 0;
            return dateB - dateA; // Las más nuevas arriba
        } else {
            let valA = (a.nombre || "").toLowerCase();
            let valB = (b.nombre || "").toLowerCase();
            return valA.localeCompare(valB);
        }
    });

    const container = document.getElementById('main-songs-list');
    if (!container) return;
    container.innerHTML = '';
    
    if (typeof modoSeleccionCarpetasActivo !== 'undefined' && modoSeleccionCarpetasActivo) {
        container.classList.add('modo-seleccion-carpetas');
    } else {
        container.classList.remove('modo-seleccion-carpetas');
    }
	const cajaInvisible = document.createDocumentFragment();
    listaDeCarpetas.forEach((folder, index) => {
        const div = document.createElement('div');
        const estaSel = typeof carpetasSeleccionadas !== 'undefined' && carpetasSeleccionadas.includes(index);
        
        div.className = `folder-item ${estaSel ? 'selected' : ''}`;
        
        div.innerHTML = `
            <div style="display: flex; align-items: center; width: 100%;">
                <span class="material-icons" style="margin-right: 15px; color: ${estaSel ? 'var(--accent-color)' : '#888888'} !important; font-size: 1.35rem !important;">
                    folder
                </span>
                
                <div style="flex: 1; min-width: 0;">
                    <div style="font-family: var(--f-medium); color: #ffffff !important; font-size: 1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${escaparHTML(folder.nombre)}
                    </div>
                    <div style="font-size: 0.8rem; color: #888888 !important; font-family: var(--f-medium) !important;">
                        ${folder.canciones || 0} ${t('js_songs_count')}
                    </div>
                </div>

                <div class="song-actions-wrapper" style="display: flex; align-items: center; flex-shrink: 0; margin-left: auto; gap: 4px;">
                    <button class="dots-btn" onclick="toggleFolderMenu(event, ${index})" style="padding: 0; margin-right: -10px; width: 35px; display: flex; justify-content: center; background: none !important; border: none !important; outline: none !important;">
                        <span class="material-icons" style="font-size: 1.3rem !important; color: #444444 !important;">more_vert</span>
                    </button>
                    
                    <div id="menu-folder-${index}" class="options-menu" style="bottom: auto; top: 35px; right: 10px; width: 180px;">
                            <div class="menu-item" onclick="event.stopPropagation(); abrirModalCambiarNombreCarpeta(${index})">
                                <span class="material-icons">drive_file_rename_outline</span> ${t('js_change_name')}
                            </div>
                            <div class="menu-item" onclick="event.stopPropagation(); compartirCarpeta(${index})">
                                <span class="material-icons">share</span> ${t('bulk_share')}
                            </div>
                            <div class="menu-item delete" onclick="event.stopPropagation(); confirmarEliminarCarpeta(${index})">
                                <span class="material-icons">delete</span> ${t('bulk_delete')}
                            </div>
                        </div>
                </div>
            </div>
        `;

        div.onclick = () => {
            if (typeof modoSeleccionCarpetasActivo !== 'undefined' && modoSeleccionCarpetasActivo) {
                const idx = carpetasSeleccionadas.indexOf(index);
                if (idx > -1) carpetasSeleccionadas.splice(idx, 1);
                else carpetasSeleccionadas.push(index);
                showFoldersView(); 
            } else {
                const filtradas = listaDeCanciones.filter(s => {
                    if (Array.isArray(s.folders)) return s.folders.includes(folder.nombre);
                    return (s.folder || 'Sin Categoría') === folder.nombre;
                });

                if (filtradas.length > 0) {
					renderSongsEnCarpeta(filtradas, folder.nombre);
				} else {
                    container.innerHTML = '';
                    const btnAtras = document.createElement('div');
                    btnAtras.innerHTML = `<div onclick="showFoldersView()" style="padding: 12px; color: #888; display: flex; align-items: center; border-bottom: 1px solid #111; cursor: pointer;">
                        <span class="material-icons">arrow_back</span> 
                        <span style="margin-left:10px; font-family:var(--f-bold); font-size:0.8rem;">VOLVER A CARPETAS (VACÍA)</span>
                    </div>`;
                    container.prepend(btnAtras);
                }
            }
        };
        cajaInvisible.appendChild(div);
    });
    
    container.appendChild(cajaInvisible);
    actualizarEstadoMenuBulkCarpetas();
}
function renderCarpetasFiltradas(carpetas) {
    const container = document.getElementById('main-songs-list');
    if (!container) return;
    container.innerHTML = '';
	const cajaInvisible = document.createDocumentFragment();
    carpetas.forEach((folder) => {
        const div = document.createElement('div');
        div.className = 'folder-item';
        
        div.innerHTML = `
            <div style="display: flex; align-items: center; width: 100%;">
                <span class="material-icons" style="margin-right: 15px; color: #888888 !important; font-size: 1.35rem !important;">
                    folder
                </span>
                <div style="flex: 1; min-width: 0;">
                    <div style="font-family: var(--f-medium); color: #ffffff !important; font-size: 1rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${escaparHTML(folder.nombre)}
                    </div>
                    <div style="font-size: 0.8rem; color: #888888 !important; font-family: var(--f-medium) !important;">
                        ${folder.canciones || 0} ${t('js_songs_count')}
                    </div>
                </div>
            </div>
        `;

        div.onclick = () => {
            const filtradas = listaDeCanciones.filter(s => {
                if (Array.isArray(s.folders)) return s.folders.includes(folder.nombre);
                return (s.folder || 'Sin Categoría') === folder.nombre;
            });
            renderSongsEnCarpeta(filtradas, folder.nombre);
        };
        
        cajaInvisible.appendChild(div);
    });
    
    container.appendChild(cajaInvisible);
}
function prepararNuevaCarpeta() {
    // 🔥 TRADUCCIÓN: "NUEVA CARPETA"
    abrirModalDinamico(t('js_new_folder'), true, (nuevoNombre) => {
        if (nuevoNombre && nuevoNombre.trim() !== "") {
            const nombreLimpio = nuevoNombre.trim().toUpperCase();
            
            const existe = listaDeCarpetas.some(c => c.nombre === nombreLimpio);
            if (existe) {
                // 🔥 TRADUCCIÓN: "Ya existe una carpeta con ese nombre."
                alert(t('js_err_folder_exists'));
                return;
            }

            // --- AQUÍ ESTÁ EL CAMBIO: Agregamos la fecha al guardar ---
            listaDeCarpetas.push({ 
                nombre: nombreLimpio, 
                canciones: 0, 
                fecha: new Date().toISOString() 
            });
            
            localStorage.setItem('mis_carpetas', JSON.stringify(listaDeCarpetas));
            showFoldersView();
        }
    });
}
function cargarCarpetaEnCarrusel(listaFiltrada, indiceInicial = 0) {
    cancionesEnCarrusel = JSON.parse(JSON.stringify(listaFiltrada));
    indiceCarruselActual = indiceInicial;
    modoCarruselActivo = true; 
    
    window.scrollTo(0, 0); // 🔥 FIX: REGRESA AL INICIO AL ABRIR LA CARPETA

    const riel = document.getElementById('carousel-rail');
    if (!riel) return; 
    
    riel.innerHTML = ''; 

    cancionesEnCarrusel.forEach((song, index) => {
        const slide = document.createElement('div');
        slide.className = 'song-slide';
        
        // 🔥 ELIMINAMOS EL PADDING IZQUIERDO Y DEJAMOS EL CONTROL AL MARGEN 🔥
        // 🔥 DEVOLVEMOS LA RESPIRACIÓN A LOS BORDES 🔥
		slide.style.setProperty('padding-left', '15px', 'important');
		slide.style.setProperty('padding-right', '15px', 'important');
        slide.style.setProperty('align-items', 'flex-start', 'important');
        slide.style.setProperty('justify-content', 'flex-start', 'important');
        
        if (song.urlArchivo) {
            if (song.tipoArchivo === 'pdf') {
                slide.innerHTML = `<div class="visor-pdf-container" id="pdf-slide-${index}" style="width:100%; height:100vh; overflow-y:auto;">${t('js_pdf_loading')}</div>`;
            } else {
                slide.innerHTML = `<div class="visor-imagen-container"><img src="${song.urlArchivo}" style="width:100%; display:block;"></div>`;
            }
        } else {
            const idGenerado = `pre-slide-${index}`;
            slide.innerHTML = generarVistaConDiagramas(song.lyrics || "", idGenerado);
        }
        riel.appendChild(slide);
    });

    actualizarPosicionCarrusel(false); 
    actualizarInfoCancionActual();
    
    if (cancionesEnCarrusel[indiceInicial]?.tipoArchivo === 'pdf') {
        renderizarSiEsPDF(indiceInicial);
    }
    setTimeout(() => { 
        if (typeof aplicarModoDiseno === 'function') aplicarModoDiseno(); 
    }, 50);
}
function renderSongsEnCarpeta(filtradas, nombreCarpeta) {
    const container = document.getElementById('main-songs-list');
    if (!container) return;
    container.innerHTML = '';

    const btnAtras = document.createElement('div');
    // 🔥 TRADUCCIÓN: "VOLVER A CARPETAS"
    btnAtras.innerHTML = `
        <div onclick="showFoldersView()" style="padding: 12px; color: #888; background: #080808; display: flex; align-items: center; border-bottom: 1px solid #111; cursor: pointer;">
            <span class="material-icons">arrow_back</span> 
            <span style="margin-left:10px; font-family:var(--f-bold); font-size:0.8rem;">${t('js_back_folders')}</span>
        </div>`;
    container.appendChild(btnAtras);

    if (filtradas.length === 0) {
        // 🔥 TRADUCCIÓN: "Carpeta vacía"
        container.innerHTML += `<div style="color:#666; text-align:center; padding:20px;">${t('js_empty_folder')}</div>`;
        return;
    }
    const cajaInvisible = document.createDocumentFragment();
    filtradas.forEach((song, idx) => {
        const div = document.createElement('div');
        div.className = 'song-item';
        const indexReal = listaDeCanciones.findIndex(s => s.title === song.title && s.artist === song.artist);
        const esMulticarpeta = song.folders && song.folders.length > 2;

        // 🔥 TRADUCCIÓN: Prevención si el título o artista están vacíos
        const tituloSeguro = song.title || t('js_untitled');
        const artistaSeguro = song.artist || t('js_unknown');

        div.innerHTML = `
            <div style="display: flex; align-items: center; width: 100%; justify-content: space-between;">
                <div class="song-text-wrapper" style="flex: 1; min-width: 0;">
                    <div class="s-name" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center;">
                        ${escaparHTML(tituloSeguro)}
                        ${esMulticarpeta ? `<span class="material-icons" style="font-size:14px; color:var(--accent-color); margin-left:6px; opacity: 0.7;">layers</span>` : ''}
                    </div>
                    <div class="s-author">${escaparHTML(artistaSeguro)}</div>
                </div>
                
                <div class="folder-actions" style="display: flex; align-items: center; gap: 5px; flex-shrink: 0;">
                    <span class="material-icons" style="color: #444; padding: 5px;" onclick="event.stopPropagation(); moverCancionManual(${idx}, -1, '${nombreCarpeta}')">expand_less</span>
                    <span class="material-icons" style="color: #444; padding: 5px;" onclick="event.stopPropagation(); moverCancionManual(${idx}, 1, '${nombreCarpeta}')">expand_more</span>
                    <span class="material-icons" style="color: #ffb347; padding: 5px; margin-left: 10px;" onclick="event.stopPropagation(); confirmarQuitarDeCarpeta(${indexReal}, '${nombreCarpeta}')">delete</span>
                </div>
            </div>
        `;
        
        div.onclick = () => {
            if (!modoSeleccion) {
                const panel = document.getElementById('songs-panel');
                if (panel) panel.classList.remove('active');
                cargarCarpetaEnCarrusel(filtradas, idx);
            }
        };
        cajaInvisible.appendChild(div);
    });
    
    container.appendChild(cajaInvisible);
}

function moverCancionManual(idxActual, direccion, nombreCarpeta) {
    let filtradas = listaDeCanciones.filter(s => s.folders && s.folders.includes(nombreCarpeta));
    let nuevaPos = idxActual + direccion;

    if (nuevaPos < 0 || nuevaPos >= filtradas.length) return;

    const itemMovido = filtradas.splice(idxActual, 1)[0];
    filtradas.splice(nuevaPos, 0, itemMovido);

    let otrasCanciones = listaDeCanciones.filter(s => !s.folders || !s.folders.includes(nombreCarpeta));
    listaDeCanciones = [...otrasCanciones, ...filtradas];

    actualizarAlmacenamiento();
    renderSongsEnCarpeta(filtradas, nombreCarpeta);
}
function confirmarQuitarDeCarpeta(indexReal, nombreCarpeta) {
    const song = listaDeCanciones[indexReal];
    if (!song) return;

    const modal = document.getElementById('confirm-modal');
    const tituloModal = document.getElementById('confirm-title');
    const mensajeModal = document.getElementById('confirm-message');
    const btnConfirmar = document.getElementById('btn-confirm-delete');

    if (modal) {
        // 🔥 TRADUCCIÓN: "¿QUITAR DE CARPETA?"
        tituloModal.innerText = t('js_rem_folder_title');

        // 🔥 TRADUCCIÓN EN VIVO
        const lang = localStorage.getItem('config_idioma') || 'es';
        mensajeModal.innerText = (lang === 'en') 
            ? `Do you want to remove "${song.title}" from the folder ${nombreCarpeta}? The song will still exist in your main list.`
            : `¿Deseas quitar "${song.title}" de la carpeta ${nombreCarpeta}? La canción seguirá existiendo en tu lista general.`;
        
        // 🔥 TRADUCCIÓN: "QUITAR"
        btnConfirmar.innerText = t('js_btn_remove');
        
        btnConfirmar.onclick = () => {
            song.folders = song.folders.filter(f => f !== nombreCarpeta);
            actualizarAlmacenamiento();
            actualizarContadoresCarpetas();
            const nuevasFiltradas = listaDeCanciones.filter(s => s.folders && s.folders.includes(nombreCarpeta));
            renderSongsEnCarpeta(nuevasFiltradas, nombreCarpeta);
            closeConfirm();
        };
        modal.style.setProperty('display', 'flex', 'important');
		modal.style.visibility = 'visible';
		modal.classList.add('active');
    }
}
function abrirModalCambiarNombreCarpeta(index) {
    cerrarTodoLoAbierto();
    const carpeta = listaDeCarpetas[index];
    if (!carpeta) return;

    // 🔥 TRADUCCIÓN: "CAMBIAR NOMBRE"
    abrirModalDinamico(t('js_change_name'), true, (nuevoNombre) => {
        if (nuevoNombre && nuevoNombre.trim() !== "") {
            const nombreLimpio = nuevoNombre.trim().toUpperCase();
            
            // Validar que no se repita con otra
            if (listaDeCarpetas.some((c, i) => c.nombre === nombreLimpio && i !== index)) {
                // 🔥 TRADUCCIÓN: "Ya existe otra carpeta con ese nombre."
                alert(t('js_err_folder_exists'));
                return;
            }
            
            const nombreViejo = carpeta.nombre;
            carpeta.nombre = nombreLimpio;
            carpeta.fecha = new Date().toISOString(); // Actualiza fecha de modificación
            
            // MAGIA: Buscar en todas las canciones y actualizar el nombre de la carpeta
            listaDeCanciones.forEach(song => {
                if (song.folders && song.folders.includes(nombreViejo)) {
                    song.folders = song.folders.map(f => f === nombreViejo ? nombreLimpio : f);
                }
            });

            actualizarAlmacenamiento();
            localStorage.setItem('mis_carpetas', JSON.stringify(listaDeCarpetas));
            showFoldersView();
        }
    });
    
    setTimeout(() => {
        const input = document.getElementById('md-input');
        if (input) input.value = carpeta.nombre;
    }, 50);
}

function compartirCarpeta(index) {
    cerrarTodoLoAbierto();
    const carpeta = listaDeCarpetas[index];
    if (!carpeta) return;

    // 🔥 TRADUCCIÓN EN VIVO
    const lang = localStorage.getItem('config_idioma') || 'es';

    const filtradas = listaDeCanciones.filter(s => s.folders && s.folders.includes(carpeta.nombre));
    let texto = lang === 'en' ? `📁 FOLDER: ${carpeta.nombre}\n\n` : `📁 CARPETA: ${carpeta.nombre}\n\n`;
    
    filtradas.forEach((s, i) => {
        texto += `${i + 1}. ${s.title} - ${s.artist}\n`;
    });

    if (navigator.share) {
        navigator.share({ title: carpeta.nombre, text: texto }).catch(console.error);
    } else {
        // 🔥 TRADUCCIÓN: Lista copiada
        navigator.clipboard.writeText(texto).then(() => alert(t('js_copied_list')));
    }
}

function confirmarEliminarCarpeta(index) {
    cerrarTodoLoAbierto();
    const carpeta = listaDeCarpetas[index];
    if (!carpeta) return;
    
    indiceCarpetaAEliminar = index;
    const modal = document.getElementById('confirm-modal');
    const tituloModal = document.getElementById('confirm-title');
    const mensajeModal = document.getElementById('confirm-message');
    const btnConfirmar = document.getElementById('btn-confirm-delete');

    if (modal) {
        // 🔥 TRADUCCIÓN: "¿ELIMINAR CARPETA?"
        tituloModal.innerText = t('js_del_folder_title');
        
        // 🔥 TRADUCCIÓN EN VIVO: Mensaje con el nombre de la carpeta
        const lang = localStorage.getItem('config_idioma') || 'es';
        mensajeModal.innerText = (lang === 'en')
            ? `Are you sure you want to delete the folder "${carpeta.nombre}"? (Don't worry, the songs inside will still exist in your main list).`
            : `¿Seguro que deseas eliminar la carpeta "${carpeta.nombre}"? (No te preocupes, las canciones seguirán existiendo en tu lista general).`;
        
        modal.style.setProperty('display', 'flex', 'important');
		modal.style.visibility = 'visible';
		modal.classList.add('active');
        
        btnConfirmar.onclick = () => {
            const nombreAEliminar = listaDeCarpetas[indiceCarpetaAEliminar].nombre;
            
            // Quitar la etiqueta de la carpeta de todas las canciones
            listaDeCanciones.forEach(song => {
                if (song.folders) {
                    song.folders = song.folders.filter(f => f !== nombreAEliminar);
                }
            });
            
            listaDeCarpetas.splice(indiceCarpetaAEliminar, 1);
            
            actualizarAlmacenamiento();
            localStorage.setItem('mis_carpetas', JSON.stringify(listaDeCarpetas));
            showFoldersView();
            closeConfirm();
            indiceCarpetaAEliminar = null;
        };
    }
}
function renderFoldersParaMover() {
    const container = document.getElementById('folders-list-dynamic');
    if (!container) return;
    container.innerHTML = '';

    if (listaDeCarpetas.length === 0) {
        // 🔥 TRADUCCIÓN
        container.innerHTML = `<div style="color: #888; text-align: center; padding: 20px; font-family: var(--f-medium);">${t('js_no_folders')}</div>`;
        return;
    }

    listaDeCarpetas.forEach(carpeta => {
        const div = document.createElement('div');
        
        // 🔥 FIX: Blindamos el contenedor con "text-align: left"
        div.style.cssText = "padding: 12px 15px; border-bottom: 1px solid #333; color: #fff; display: flex; align-items: center; cursor: pointer; text-align: left;";
        
        div.innerHTML = `
            <span class="material-icons" style="margin-right: 15px; color: var(--accent-color);">folder</span>
            <span style="font-family: var(--f-medium); font-size: 1rem; flex: 1; text-align: left; line-height: 1.2;">${carpeta.nombre}</span>
        `;
        
        // Al hacer clic en la carpeta, ejecuta el movimiento
        div.onclick = () => {
            ejecutarMovimientoFinal(carpeta.nombre);
        };
        container.appendChild(div);
    });
}

function openMoveModal(index) {
    cerrarTodoLoAbierto(); 
    songIndexToMove = index; // Guardamos qué canción se va a mover
    
    renderFoldersParaMover(); // Dibujamos la lista de carpetas
    
    const modal = document.getElementById('move-modal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
    }
}
function closeMoveModal() {
    const modal = document.getElementById('move-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active'); 
    }
    songIndexToMove = null;

    const escudo = document.getElementById('escudo-cierre');
    if (escudo) {
        escudo.style.display = 'none';
    }
}
function ejecutarMovimientoFinal(nombreCarpeta) {
    const aplicarACancion = (index) => {
        let song = listaDeCanciones[index];
        if (!song) return;
        if (!Array.isArray(song.folders)) {
            song.folders = song.folder ? [song.folder] : [];
            delete song.folder; 
        }
        if (!song.folders.includes(nombreCarpeta)) {
            song.folders.push(nombreCarpeta);
        } else {
            song.folders = song.folders.filter(f => f !== nombreCarpeta);
        }
    };

    if (modoSeleccion && cancionesSeleccionadas.length > 0) {
        cancionesSeleccionadas.forEach(idx => aplicarACancion(idx));
    } else if (songIndexToMove !== null) {
        aplicarACancion(songIndexToMove);
    }

    actualizarContadoresCarpetas();
    actualizarAlmacenamiento();
    closeMoveModal();
    resetSeleccion();
}

function actualizarContadoresCarpetas() {
    listaDeCarpetas.forEach(carpeta => {
        const total = listaDeCanciones.filter(s => {
            if (Array.isArray(s.folders)) return s.folders.includes(carpeta.nombre);
            return s.folder === carpeta.nombre;
        }).length;
        carpeta.canciones = total;
    });
    localStorage.setItem('mis_carpetas', JSON.stringify(listaDeCarpetas));
}
function eliminarCancionSegunContexto(index, nombreCarpeta = null) {
    if (nombreCarpeta) {
        let song = listaDeCanciones[index];
        if (song.folders) {
            song.folders = song.folders.filter(f => f !== nombreCarpeta);
        }
        actualizarAlmacenamiento();
        actualizarContadoresCarpetas();
        const filtradas = listaDeCanciones.filter(s => s.folders && s.folders.includes(nombreCarpeta));
        renderSongsEnCarpeta(filtradas, nombreCarpeta); 
    } else {
        deleteSong(index); 
    }
}
// ==========================================================================
// 🟧 4. Modo Selección Masiva (Bulk Actions)
// ==========================================================================
function bulkAction(tipo) {
    const listContainer = document.getElementById('main-songs-list');
    
    switch(tipo) {
        case 'select':
            modoSeleccion = !modoSeleccion;
            cancionesSeleccionadas = [];
            if (listContainer) listContainer.classList.toggle('modo-seleccion-activo', modoSeleccion);
            renderSongs(listaDeCanciones);
            break;

        case 'selectAll':
            // Si ya están todas seleccionadas, las deseleccionamos
            if (cancionesSeleccionadas.length === listaDeCanciones.length && listaDeCanciones.length > 0) {
                modoSeleccion = false;
                cancionesSeleccionadas = [];
                if (listContainer) listContainer.classList.remove('modo-seleccion-activo');
            } else {
                // Si no, seleccionamos todas
                modoSeleccion = true;
                if (listContainer) listContainer.classList.add('modo-seleccion-activo');
                cancionesSeleccionadas = listaDeCanciones.map((_, index) => index);
            }
            renderSongs(listaDeCanciones);
            break;

        case 'move':
            if (cancionesSeleccionadas.length === 0) return;
            cerrarTodoLoAbierto();
            songIndexToMove = null; // Indica que usaremos las seleccionadas
            renderFoldersParaMover();
            
            const modalMover = document.getElementById('move-modal');
            if (modalMover) {
                modalMover.style.display = 'flex';
                modalMover.classList.add('active');
            }
            break;

        case 'share':
            if (cancionesSeleccionadas.length === 0) return;
            cerrarTodoLoAbierto();
            
            let textoCompartir = t('js_shared_songs'); // 🔥 TRADUCCIÓN
            cancionesSeleccionadas.forEach(idx => {
                const s = listaDeCanciones[idx];
                textoCompartir += `[${s.title} - ${s.artist}]\n${t('js_tone_prefix')}${s.tone || '--'}\n${s.lyrics || ''}\n\n`; // 🔥 TRADUCCIÓN
            });

            if (navigator.share) {
                // El title nativo de share usualmente no se traduce porque es interno del SO, pero puedes poner "PraiseBook"
                navigator.share({ title: "PraiseBook", text: textoCompartir }).catch(console.error);
            } else {
                navigator.clipboard.writeText(textoCompartir).then(() => alert(t('js_copied_songs'))); // 🔥 TRADUCCIÓN
            }
            
            resetSeleccion();
            break;

        case 'delete':
            if (cancionesSeleccionadas.length === 0) return;

            const modal = document.getElementById('confirm-modal');
            const tituloModal = document.getElementById('confirm-title');
            const mensajeModal = document.getElementById('confirm-message');
            const btnConfirmar = document.getElementById('btn-confirm-delete');

            if (modal) {
                tituloModal.innerText = t('js_del_selected'); // 🔥 TRADUCCIÓN
                // 🔥 TRADUCCIÓN (Concatenamos el número para no complicar el diccionario)
                mensajeModal.innerText = `${t('js_del_selected_desc')} (${cancionesSeleccionadas.length})`;
                
                modal.style.setProperty('display', 'flex', 'important');
                modal.style.visibility = 'visible';
                modal.classList.add('active');
                btnConfirmar.onclick = ejecutarEliminacionMasiva;
            }
            break;
    }
    actualizarEstadoMenuBulk();
    cerrarTodoLoAbierto();
}
function ejecutarEliminacionMasiva() {
    cancionesSeleccionadas.sort((a, b) => b - a);
    cancionesSeleccionadas.forEach(index => {
        listaDeCanciones.splice(index, 1);
    });

    actualizarAlmacenamiento();
    actualizarContadoresCarpetas(); // <--- ESTO ES LO NUEVO
    resetSeleccion(); 
    closeConfirm(); 
}
function actualizarEstadoMenuBulk() {
    const btnCrear = document.getElementById('btn-crear-estandar');
    const contenedorIconos = document.getElementById('iconos-bulk-reemplazo');
    const menu = document.getElementById('bulk-options-menu');
    const btnImportar = document.getElementById('contenedor-importar'); // <-- Atrapamos el botón importar
    
    if (!menu) return;

    if (modoSeleccion) {
        if (btnCrear) btnCrear.style.display = 'none';
        if (btnImportar) btnImportar.style.visibility = 'hidden'; // <-- Lo hacemos invisible
        if (contenedorIconos) {
            contenedorIconos.style.display = 'flex';
            contenedorIconos.style.width = '100%'; 
        }
    } else {
        if (btnCrear) btnCrear.style.display = 'inline';
        if (btnImportar) btnImportar.style.visibility = 'visible'; // <-- Lo regresamos a la normalidad
        if (contenedorIconos) contenedorIconos.style.display = 'none';
    }

    const tieneSeleccion = cancionesSeleccionadas.length > 0;

    if (contenedorIconos) {
        contenedorIconos.style.opacity = tieneSeleccion ? "1" : "0.3";
        contenedorIconos.style.pointerEvents = tieneSeleccion ? "auto" : "none";
    }

    const items = menu.querySelectorAll('.menu-item');
    items.forEach(item => {
        const onclick = item.getAttribute('onclick') || "";
        if (onclick.includes("'move'") || onclick.includes("'share'") || onclick.includes("'delete'")) {
            if (tieneSeleccion) {
                item.classList.remove('disabled');
            } else {
                item.classList.add('disabled');
            }
        }
    });
}

function resetSeleccion() {
    modoSeleccion = false;
    cancionesSeleccionadas = [];
    const listContainer = document.getElementById('main-songs-list');
    if (listContainer) listContainer.classList.remove('modo-seleccion-activo');
    renderSongs(listaDeCanciones);
    actualizarEstadoMenuBulk();
}
function modoSeleccionCarpetas() {
    modoSeleccionCarpetasActivo = !modoSeleccionCarpetasActivo;
    carpetasSeleccionadas = [];
    cerrarTodoLoAbierto();
    showFoldersView();
}

// 3. Botón "Seleccionar todo"
function seleccionarTodasCarpetas() {
    if (carpetasSeleccionadas.length === listaDeCarpetas.length && listaDeCarpetas.length > 0) {
        modoSeleccionCarpetasActivo = false;
        carpetasSeleccionadas = [];
    } else {
        modoSeleccionCarpetasActivo = true;
        carpetasSeleccionadas = listaDeCarpetas.map((_, i) => i);
    }
    cerrarTodoLoAbierto();
    showFoldersView();
}

function compartirCarpetas() {
    if (carpetasSeleccionadas.length === 0) return;
    cerrarTodoLoAbierto();
    
    // 🔥 TRADUCCIÓN EN VIVO
    const lang = localStorage.getItem('config_idioma') || 'es';
    let textoMasivo = lang === 'en' ? `📁 *SHARED LIBRARY*\n\n` : `📁 *BIBLIOTECA COMPARTIDA*\n\n`;
    
    carpetasSeleccionadas.forEach(idx => {
        const carpeta = listaDeCarpetas[idx];
        const filtradas = listaDeCanciones.filter(s => s.folders && s.folders.includes(carpeta.nombre));
        textoMasivo += lang === 'en' ? `📂 *FOLDER: ${carpeta.nombre}*\n` : `📂 *CARPETA: ${carpeta.nombre}*\n`;
        filtradas.forEach((s, i) => {
            textoMasivo += `${i + 1}. ${s.title} (${s.tone})\n`;
        });
        textoMasivo += `\n`;
    });

    if (navigator.share) {
        navigator.share({
            title: lang === 'en' ? "My PraiseBook Folders" : "Mis Carpetas PraiseBook",
            text: textoMasivo
        });
    } else {
        navigator.clipboard.writeText(textoMasivo).then(() => {
            // 🔥 TRADUCCIÓN: Lista copiada
            alert(t('js_copied_list'));
        });
    }
    
    modoSeleccionCarpetasActivo = false;
    carpetasSeleccionadas = [];
    showFoldersView();
}

function confirmarEliminarMasivoCarpetas() {
    if (carpetasSeleccionadas.length === 0) return;
    cerrarTodoLoAbierto();

    const modal = document.getElementById('confirm-modal');
    const tituloModal = document.getElementById('confirm-title');
    const mensajeModal = document.getElementById('confirm-message');
    const btnConfirmar = document.getElementById('btn-confirm-delete');

    if (modal) {
        // 🔥 TRADUCCIÓN: "¿ELIMINAR CARPETAS?"
        tituloModal.innerText = t('js_del_folder_title') + "S"; // Le suma una S para plural (CARPETAS / FOLDERS)
        
        // 🔥 TRADUCCIÓN EN VIVO: Mensaje con cantidad
        const lang = localStorage.getItem('config_idioma') || 'es';
        mensajeModal.innerText = (lang === 'en')
            ? `Are you sure you want to delete the ${carpetasSeleccionadas.length} selected folders? (The songs inside them will remain safe in your main list).`
            : `¿Seguro que deseas eliminar las ${carpetasSeleccionadas.length} carpetas seleccionadas? (Las canciones que tienen dentro seguirán a salvo en la lista general).`;
        
        modal.style.setProperty('display', 'flex', 'important');
		modal.style.visibility = 'visible';
		modal.classList.add('active');
        
        btnConfirmar.onclick = () => {
            // Ordenamos de mayor a menor para borrar sin romper la lista
            carpetasSeleccionadas.sort((a, b) => b - a);
            
            carpetasSeleccionadas.forEach(idx => {
                const nombreAEliminar = listaDeCarpetas[idx].nombre;
                // Le quitamos la etiqueta de la carpeta a las canciones
                listaDeCanciones.forEach(song => {
                    if (song.folders) {
                        song.folders = song.folders.filter(f => f !== nombreAEliminar);
                    }
                });
                // Borramos la carpeta
                listaDeCarpetas.splice(idx, 1);
            });

            actualizarAlmacenamiento();
            localStorage.setItem('mis_carpetas', JSON.stringify(listaDeCarpetas));
            
            modoSeleccionCarpetasActivo = false;
            carpetasSeleccionadas = [];
            showFoldersView();
            closeConfirm();
        };
    }
}
function actualizarEstadoMenuBulkCarpetas() {
    const btnCrear = document.getElementById('btn-crear-carpeta');
    const contenedorIconos = document.getElementById('iconos-bulk-carpetas');
    const menu = document.getElementById('folder-bulk-menu');
    
    if (!menu) return;

    if (modoSeleccionCarpetasActivo) {
        if (btnCrear) btnCrear.style.display = 'none';
        if (contenedorIconos) contenedorIconos.style.display = 'flex';
    } else {
        if (btnCrear) btnCrear.style.display = 'inline';
        if (contenedorIconos) contenedorIconos.style.display = 'none';
    }

    const tieneSeleccion = typeof carpetasSeleccionadas !== 'undefined' && carpetasSeleccionadas.length > 0;

    if (contenedorIconos) {
        contenedorIconos.style.opacity = tieneSeleccion ? "1" : "0.3";
        contenedorIconos.style.pointerEvents = tieneSeleccion ? "auto" : "none";
    }

    const items = menu.querySelectorAll('.menu-item');
    items.forEach(item => {
        const onclickAttr = item.getAttribute('onclick') || "";
        if (onclickAttr.includes("compartirCarpetas") || onclickAttr.includes("EliminarMasivo")) {
            if (tieneSeleccion) {
                item.classList.remove('disabled');
            } else {
                item.classList.add('disabled');
            }
        }
    });
}
// ==========================================================================
// 🧠 5. Motor ChordPro y Dibujo de Acordes
// ==========================================================================
function convertirTextoAChordPro(texto) {
    if (!texto) return "";
    let lineas = texto.replace(/\t/g, '    ').split('\n');
    let resultado = [];
    
    const patronAcordes = /(?<![a-z0-9])([A-G][#b]?(?:m|maj|7|sus|add|dim|aug|[0-9])*(?:\/[A-G][#b]?)?|[-]{1,})(?![a-záéíóú0-9#])/g;
    const palabrasExcluidas = ["As", "Va", "He", "Me", "Solo", "Fue", "Del", "Al"];

    for (let i = 0; i < lineas.length; i++) {
        let lineaActual = lineas[i];
        let lineaLimpia = lineaActual.trimEnd();

        let lineaSinAcordes = lineaLimpia;
        let tieneAcordes = false;
        let mapaAcordes = {};
        
        let regex = new RegExp(patronAcordes.source, patronAcordes.flags);
        let match;
        
        while ((match = regex.exec(lineaLimpia)) !== null) {
            if (!palabrasExcluidas.includes(match[0].trim())) {
                tieneAcordes = true;
                mapaAcordes[match.index] = match[0].trim();
                lineaSinAcordes = lineaSinAcordes.substring(0, match.index) + ' '.repeat(match[0].length) + lineaSinAcordes.substring(match.index + match[0].length);
            }
        }

        let lineaValidacion = lineaSinAcordes.replace(/\([^)]*\)/g, ' ');
        let esLineaAcordes = tieneAcordes && lineaValidacion.trim() === '';
        let tieneParentesis = /\([^)]*\)/.test(lineaLimpia);

        if (esLineaAcordes) {
            let lineaSiguiente = (i + 1 < lineas.length) ? lineas[i + 1].trimEnd() : null;
            
            let sigEsSoloAcordes = false;
            let sigEsApunte = false;
            // 🔥 NUEVO: ESCUDO CONTRA LAS REPETICIONES FANTASMA
            let sigEsRepeticion = false;

            if (lineaSiguiente !== null && lineaSiguiente.trim() !== '') {
                // Escudo de apuntes
                if (lineaSiguiente.trim().startsWith('*')) {
                    sigEsApunte = true;
                }
                // Escudo de repeticiones (@@REP@@)
                if (lineaSiguiente.trim().startsWith('@@REP@@')) {
                    sigEsRepeticion = true;
                }

                let sigSinAcordes = lineaSiguiente;
                let sigRegex = new RegExp(patronAcordes.source, patronAcordes.flags);
                let sigMatch;
                let sigTieneAc = false;
                
                while ((sigMatch = sigRegex.exec(lineaSiguiente)) !== null) {
                    if (!palabrasExcluidas.includes(sigMatch[0].trim())) {
                        sigTieneAc = true;
                        sigSinAcordes = sigSinAcordes.substring(0, sigMatch.index) + ' '.repeat(sigMatch[0].length) + sigSinAcordes.substring(sigMatch.index + sigMatch[0].length);
                    }
                }
                sigEsSoloAcordes = sigTieneAc && sigSinAcordes.replace(/\([^)]*\)/g, ' ').trim() === '';
            }
            
            // 🔥 ARREGLO MAESTRO: Regex actualizado para reconocer el compás |8| al inicio del encabezado
            const regexEncabezadoProtegido = /^(?:\|\s*\d*\s*\|\s*)?(Solo de Guitarra|Instrumental Final|Pre-Coro|PreCoro|Estructura|Instrumental|Estribillo|Interludio|Preludio|Estrofa|Puente|Outro|Final|Nota Final|Verso|Bridge|Intro|Coro|Solo|Bis)\b(?:[\s\-:\dIVXx\|]|\([^)]*\))*$/i;

            // Añadimos el rechazo a sigEsRepeticion y usamos el nuevo regex
            if (!tieneParentesis && lineaSiguiente !== null && lineaSiguiente.trim() !== '' && !sigEsSoloAcordes && !sigEsApunte && !sigEsRepeticion && !lineaSiguiente.match(regexEncabezadoProtegido)) {
                let nuevaLetra = "";
                let maxLen = Math.max(lineaLimpia.length, lineaSiguiente.length);
                for(let j = 0; j < maxLen; j++) {
                    if (mapaAcordes[j]) { nuevaLetra += `[${mapaAcordes[j]}]`; }
                    nuevaLetra += (lineaSiguiente[j] !== undefined ? lineaSiguiente[j] : " ");
                }
                resultado.push(nuevaLetra);
                i++; 
            } else {
                // Pase VIP para los Acordes sueltos que chocaron contra el Escudo
                let nuevaLetra = "@@CHORDLINE@@";
                for(let j = 0; j < lineaLimpia.length; j++) {
                    if (mapaAcordes[j]) {
                        nuevaLetra += `<span class="chord">${mapaAcordes[j]}</span>`;
                        j += mapaAcordes[j].length - 1; 
                    } else {
                        nuevaLetra += lineaLimpia[j];
                    }
                }
                resultado.push(nuevaLetra);
            }
        } else {
            resultado.push(lineaActual);
        }
    }
    return resultado.join('\n');
}
// 2. EL MOTOR DE RENDERIZADO CHORDPRO (Crea las cajas indestructibles) //

function formatearLetra(texto) {      
    if (!texto) return "";
    let textoLimpio = texto.replace(/\t/g, '    ');
    
    // 1. Pre-procesar multiplicadores (x2, x3) para expandir la canción
    let textoExpandido = preProcesarMultiplicadores(textoLimpio);
    
    // 2. Convertir a ChordPro estándar
    let textoChordPro = convertirTextoAChordPro(textoExpandido);
    
    // Regla de detección de encabezados que acepta compases opcionales: ej "| 2 | Intro" o "Intro"
    const patronEncabezado = /^(?:\s*\|\s*(\d+)\s*\|\s*)?(Solo de Guitarra|Instrumental Final|Pre-Coro|Pre - Coro|Pre Coro|PreCoro|Estructura|Instrumental|Estribillo|Interludio|Preludio|Estrofa|Puente|Outro|Final|Nota Final|Verso|Bridge|Intro|Coro|Coro Final|Solo|Bis)\b(?:[\s\-:\dIVXx\|]|\([^)]*\))*$/i;
    
    let estiloHeredado = "";
    const lineas = textoChordPro.split('\n').map(l => l.trimEnd());
    let htmlFinal = [];
    let sangriaActiva = ""; 

    let masterLetraB = localStorage.getItem('config_letra_B') === 'true' ? "texto-negrita" : "";
    let masterLetraI = localStorage.getItem('config_letra_I') === 'true' ? "texto-cursiva" : "";
    let clasesLetraMaestra = `${masterLetraB} ${masterLetraI}`.trim();

    let masterAcordeB = localStorage.getItem('config_acorde_B') === 'true' ? "texto-negrita" : "";
    let masterAcordeI = localStorage.getItem('config_acorde_I') === 'true' ? "texto-cursiva" : "";
    let clasesAcordeMaestra = `chord ${masterAcordeB} ${masterAcordeI}`.trim();

    const aplicarParentesis = (txt) => txt.replace(/\((.*?)\)/g, '<span class="parentesis-regla">($1)</span>');
    const aplicarApuntes = (txt) => {
        let isBold = localStorage.getItem('config_notes_bold') === 'true';
        let isItalic = localStorage.getItem('config_notes_italic') === 'true';
        let estiloStr = isBold ? "font-weight: 800 !important; font-family: var(--f-bold) !important; " : "";
        if (isItalic) estiloStr += "font-style: italic !important; ";
        return txt.replace(/(^|\s)\*([^\*]+)\*(?=\s|$)/g, `$1<span class="apunte-regla" style="${estiloStr}">*$2*</span>`);
    };
    const aplicarFormatoExtra = (txt) => aplicarApuntes(aplicarParentesis(txt));

    let bloqueAbierto = false;

    // 🔥 LA MAGIA DEL DOM: Envoltorios de sección con datos musicales
    function abrirBloque(nombreSeccion, compasesDefinidos) {
        if (!bloqueAbierto) {
            let compases = parseInt(compasesDefinidos) || 0;
            htmlFinal.push(`<div class="seccion-bloque" data-nombre-seccion="${nombreSeccion.toUpperCase()}" data-compases="${compases}">`);
            bloqueAbierto = true;
        }
    }
    function cerrarBloque() {
        if (bloqueAbierto) { htmlFinal.push('</div>'); bloqueAbierto = false; }
    }

    for (let i = 0; i < lineas.length; i++) {
        let lineaProcesada = lineas[i];

        if (lineaProcesada.trim() === "" || lineaProcesada === "&nbsp;") {
            cerrarBloque(); // Si hay línea en blanco, cerramos la sección
            htmlFinal.push(`<div style="height: 1.2em;">&nbsp;</div>`); 
            continue;
        }

        const matchEncabezado = lineaProcesada.match(patronEncabezado);
        if (matchEncabezado && !lineaProcesada.includes('[')) { 
            cerrarBloque(); 
            let compasesDefinidos = matchEncabezado[1] || 0;
            let nombreLimpio = matchEncabezado[2].toUpperCase(); 
            
            abrirBloque(nombreLimpio, compasesDefinidos);
            
            lineaProcesada = lineaProcesada.replace(/\|\s*\d+\s*\|/g, '').trim(); 
            
            let colorMasterEncabezado = localStorage.getItem('config_structure_color');
            let colorMasterLetra = localStorage.getItem('config_lyrics_color');
            let colorIndividual = localStorage.getItem('config_color_' + nombreLimpio);
            
            let colorHeader = (colorMasterEncabezado && colorMasterEncabezado !== 'DEFAULT') ? colorMasterEncabezado : (colorIndividual || "var(--structure-color, #888888)");
            let colorLetra = (colorMasterLetra && colorMasterLetra !== 'DEFAULT') ? colorMasterLetra : (colorIndividual || "var(--lyrics-color, #ffffff)");

            let isBold = localStorage.getItem('config_bold_' + nombreLimpio) === 'true';
            let isItalic = localStorage.getItem('config_italic_' + nombreLimpio) === 'true';
            let isIndented = localStorage.getItem('config_indent_' + nombreLimpio) === 'true';
            let colorResaltado = localStorage.getItem('config_highlight_color') || 'transparent';

            estiloHeredado = `color: ${colorLetra} !important; `;
            if (isBold) estiloHeredado += `font-weight: 800 !important; font-family: var(--f-bold) !important; `;
            if (isItalic) estiloHeredado += `font-style: italic !important; `;

            let estiloEnc = `color: ${colorHeader} !important; `;
            if (isBold) estiloEnc += `font-weight: 800 !important; font-family: var(--f-bold) !important; `;
            if (isItalic) estiloEnc += `font-style: italic !important; `;
            
            let resalto = (colorResaltado !== 'transparent') ? `background-color: ${colorResaltado} !important; ` : "";
            sangriaActiva = isIndented ? "margin-left: 30px !important;" : "";
            
            let txtEnc = aplicarFormatoExtra(lineaProcesada);
            htmlFinal.push(`<div class="bloque-seccion-general" style="${sangriaActiva}"><span class="linea-encabezado-txt" style="${estiloEnc} ${resalto}">${txtEnc}</span></div>`);
            continue;
        }

        // 🔥 EL FIX MAESTRO: Subimos la detección de repeticiones ANTES de abrir el bloque "VERSO" fantasma.
        // Esto evita que una línea de repetición genere un bloque falso vacío que engaña al reproductor de voz.
        // Le enseñamos a detectar ambas marcas (la normal y la final)
        if (lineaProcesada.startsWith('@@REP@@') || lineaProcesada.startsWith('@@REP_LAST@@')) {
            let esUltimaRep = lineaProcesada.startsWith('@@REP_LAST@@');
            let encLimpio = lineaProcesada.replace(/@@REP_LAST@@|@@REP@@/, '');
            
            let compasesHeredados = 0;
            let nombreSeccionPura = encLimpio.replace(/\|\s*\d*\s*\|/g, '').trim().toUpperCase();
            const matchRep = encLimpio.match(patronEncabezado);
            if (matchRep) {
                compasesHeredados = matchRep[1] || 0;
                nombreSeccionPura = matchRep[2].toUpperCase();
            }

            cerrarBloque();
            // Le inyectamos el dato "data-ultima-rep" al cajón HTML
            htmlFinal.push(`<div class="seccion-bloque" data-nombre-seccion="${nombreSeccionPura}" data-compases="${compasesHeredados}" data-repeticion="true" data-ultima-rep="${esUltimaRep}">`);
            bloqueAbierto = true;

            htmlFinal.push(`<div class="bloque-seccion-general" style="height: 0px !important; margin: 0 !important; padding: 0 !important; overflow: hidden !important; border: none !important;"><span class="linea-encabezado-txt">${aplicarFormatoExtra(encLimpio)}</span></div>`);
            continue;
        }

        // Si es una línea de acordes o letra normal, debe pertenecer al bloque de la sección actual
        if (!bloqueAbierto) {
            // Si por alguna razón no hay sección abierta (ej: la canción empieza sin encabezado),
            // creamos una sección genérica "VERSO" con 0 compases para no romper el motor.
            abrirBloque("VERSO", 0);
        }

        if (lineaProcesada.startsWith('@@CHORDLINE@@')) {
            let lineaLimpia = lineaProcesada.replace('@@CHORDLINE@@', '');
            let lineaConFormato = aplicarFormatoExtra(lineaLimpia);
            lineaConFormato = lineaConFormato.replace(/<span class="chord">(.*?)<\/span>/g, (match, chordText) => {
                return `<span class="chord">${transformarAcordeEspecial(chordText)}</span>`;
            });
            lineaConFormato = lineaConFormato.replace(/class="chord"/g, `class="${clasesAcordeMaestra}"`);
            htmlFinal.push(`<div class="linea-acorde ${clasesLetraMaestra}" style="${estiloHeredado} ${sangriaActiva}">${lineaConFormato}</div>`);
            continue;
        }

        if (lineaProcesada.includes('[')) {
            let htmlLinea = `<div class="linea-sincronizada ${clasesLetraMaestra}" style="${estiloHeredado} ${sangriaActiva}">`;
            let tokens = lineaProcesada.match(/\S+|\s+/g) || [lineaProcesada];
            for (let k = 0; k < tokens.length; k++) {
                let token = tokens[k];
                if (/^\s+$/.test(token)) {
                    htmlLinea += `<div class="chunk-box"><span class="${clasesAcordeMaestra} chunk-chord-empty"></span><span class="chunk-lyric">${token}</span></div>`;
                } else {
                    htmlLinea += `<div class="word-wrapper">`;
                    let partes = token.split(/\[([^\]]+)\]/);
                    let textoInicial = partes[0];
                    if (textoInicial) htmlLinea += `<div class="chunk-box"><span class="${clasesAcordeMaestra} chunk-chord-empty"></span><span class="chunk-lyric">${aplicarFormatoExtra(textoInicial)}</span></div>`;
                    for (let j = 1; j < partes.length; j += 2) {
                        let acorde = transformarAcordeEspecial(partes[j]);
                        let letra = partes[j+1] || "&#8203;"; 
                        htmlLinea += `<div class="chunk-box"><span class="${clasesAcordeMaestra}">${acorde}</span><span class="chunk-lyric">${aplicarFormatoExtra(letra)}</span></div>`;
                    }
                    htmlLinea += `</div>`;
                }
            }
            htmlLinea += `</div>`;
            htmlFinal.push(htmlLinea);
        } else {
            let lineaConFormato = aplicarFormatoExtra(lineaProcesada);
            htmlFinal.push(`<div class="linea-letra-normal ${clasesLetraMaestra}" style="${estiloHeredado} ${sangriaActiva}">${lineaConFormato}</div>`);
        }
    }
    cerrarBloque(); // Cerrar la última sección abierta
    return htmlFinal.join('');
}
function preProcesarMultiplicadores(texto) {
    const duplicarActivo = localStorage.getItem('config_multiplicadores') !== 'false'; 

    // 🔥 EL ARREGLO: Agregamos (?:\|\s*\d*\s*\|\s*)? al inicio para que ignore el compás si existe
    const patronIntro = /^(?:\|\s*\d*\s*\|\s*)?(Intro\b(?:[\s\-:\|]|\([^)]*\))*)(.*)$/i;
    const patronMultiplicadorFinal = /\s*\(*x\s*\d+\)*$/i;
    const patronSoloMultiplicador = /^\(*x\s*\d+\)*$/i;
    const patronCompas = /\|\s*\d*\s*\|/g;

    let lineasCrudas = texto.split('\n');
    let lineasSeparadas = [];

    for (let i = 0; i < lineasCrudas.length; i++) {
        let lineaCruda = lineasCrudas[i].trimEnd();
        let match = lineaCruda.match(patronIntro);
        
        if (match) {
            let encabezado = match[1];
            let resto = match[2].trim();
            
            if (resto === "" || patronSoloMultiplicador.test(resto)) {
                lineasSeparadas.push(lineaCruda); 
            } else {
                let multiplicador = "";
                let compas = ""; 

                let matchMult = resto.match(patronMultiplicadorFinal);
                if (matchMult) {
                    multiplicador = matchMult[0];
                    resto = resto.substring(0, resto.length - matchMult[0].length).trim();
                }

                // Extraemos el compas buscando en toda la línea (porque ahora está al inicio)
                let matchComp = lineaCruda.match(patronCompas);
                if (matchComp) {
                    compas = matchComp[0]; 
                    resto = resto.replace(patronCompas, '').trim(); 
                }
                
                let nuevaCabecera = encabezado.trim();
                // Ensamblamos dejando siempre el compás por delante
                if (compas !== "") nuevaCabecera = compas.trim() + " " + nuevaCabecera; 
                if (multiplicador !== "") nuevaCabecera += " " + multiplicador.trim();
                
                lineasSeparadas.push(nuevaCabecera);
                if (resto !== "") lineasSeparadas.push(resto);
            }
        } else {
            lineasSeparadas.push(lineaCruda);
        }
    }

    const lineas = lineasSeparadas;
    const patronEnc = /^(?:\|\s*\d*\s*\|\s*)?(Solo de Guitarra|Instrumental Final|Pre-Coro|Pre - Coro|Pre Coro|PreCoro|Estructura|Instrumental|Estribillo|Interludio|Preludio|Estrofa|Puente|Outro|Final|Nota Final|Verso|Bridge|Intro|Coro|Coro Final|Solo|Bis)\b(?:[\s\-:\dIVXx\|]|\([^)]*\))*$/i;
    const patronMultiplicador = /\s*\(*x\s*(\d+)\)*/i; 
    
    // 🗑️ ELIMINAMOS "patronSinEspacio" porque ahora TODOS tendrán separación limpia

    let bloques = [];
    let bloqueActual = null;

    for (let i = 0; i < lineas.length; i++) {
        let linea = lineas[i];
        let lineaLimpia = linea.trim();

        if (patronEnc.test(lineaLimpia)) {
            if (bloqueActual) bloques.push(bloqueActual);
            
            let multiplicador = 1;
            
            // Rescatamos el compás para ponerlo al principio del bloque limpio
            let compasStr = "";
            let matchC = lineaLimpia.match(/\|\s*\d*\s*\|/);
            if(matchC) {
                compasStr = matchC[0] + " ";
                lineaLimpia = lineaLimpia.replace(/\|\s*\d*\s*\|/, '').trim();
            }

            if (duplicarActivo) {
                let matchMult = lineaLimpia.match(patronMultiplicador);
                if (matchMult) {
                    multiplicador = parseInt(matchMult[1]);
                    lineaLimpia = lineaLimpia.replace(patronMultiplicador, '').trim(); 
                }
            }
            
            lineaLimpia = lineaLimpia.replace(/[\-=_.\+\/]{3,}/g, '');
            lineaLimpia = lineaLimpia.replace(/\(\s*\)/g, ''); 
            lineaLimpia = lineaLimpia.replace(/\s+/g, ' ').trim();
            
            let indexParentesis = lineaLimpia.indexOf('(');
            if (indexParentesis !== -1) {
                let partePrincipal = lineaLimpia.substring(0, indexParentesis).toUpperCase();
                let parteSecundaria = lineaLimpia.substring(indexParentesis); 
                lineaLimpia = partePrincipal + parteSecundaria;
            } else {
                lineaLimpia = lineaLimpia.toUpperCase();
            }

            // Devolvemos el compás al inicio de la cabecera limpia
            lineaLimpia = compasStr + lineaLimpia;

            bloqueActual = { encabezado: lineaLimpia, contenido: [], multiplicador: multiplicador };
        } else {
            if (bloqueActual) {
                bloqueActual.contenido.push(linea);
            } else {
                bloqueActual = { encabezado: null, contenido: [linea], multiplicador: 1 };
            }
        }
    }
    if (bloqueActual) bloques.push(bloqueActual);

    let textoFinal = [];
    for (let b of bloques) {
        if (b.encabezado !== null) {
            // Limpiamos el compás momentáneamente para evaluar si empieza con INTRO
            let textCheck = b.encabezado.replace(/\|\s*\d*\s*\|/, '').trim();
            if (textoFinal.length > 0 && !/^INTRO\b/i.test(textCheck)) {
                if (textoFinal[textoFinal.length - 1] !== "") {
                    textoFinal.push("");
                }
            }
            textoFinal.push(b.encabezado);
        }

        if (b.contenido.length > 0) {
            while (b.contenido.length > 0 && b.contenido[0].trim() === "") {
                b.contenido.shift();
            }

            let espaciosSobrantes = 0;
            while (b.contenido.length > 0 && b.contenido[b.contenido.length - 1].trim() === "") {
                b.contenido.pop();
                espaciosSobrantes++;
            }

            if (b.multiplicador > 1 && duplicarActivo) {
                for (let m = 0; m < b.multiplicador; m++) {
                    if (m > 0 && b.encabezado !== null) {
                        // Si es la última vuelta de un x3 o mayor, le ponemos una marca especial
                        if (b.multiplicador >= 3 && m === b.multiplicador - 1) {
                            textoFinal.push(`@@REP_LAST@@${b.encabezado}`);
                        } else {
                            textoFinal.push(`@@REP@@${b.encabezado}`);
                        }
                    }
                    textoFinal.push(...b.contenido);
                    
                    // 🔥 MAGIA AQUÍ: Ya no le preguntamos si es instrumental o no. 
                    // Siempre colocará su respectivo espacio entre repeticiones.
                    if (m < b.multiplicador - 1) {
                        textoFinal.push(""); 
                    }
                }
            } else {
                textoFinal.push(...b.contenido);
            }
        }
    }
    return textoFinal.join('\n');
}
function generarVistaConDiagramas(letraCruda, idPre = '') {
    // 🛡️ ESCUDO XSS: Desinfectamos la letra antes de procesar nada
    const letraDesinfectada = escaparHTML(letraCruda);

    // Ahora sí, trabajamos con el texto 100% seguro
    const letraLimpia = letraDesinfectada.trim().replace(/\n{3,}/g, '\n\n');
    const dataDiagramas = construirHTMLDiagramas(letraLimpia); 
    const preAtributo = idPre ? `id="${idPre}"` : '';
    
    // 🔥 EL SECRETO 1: width: 100% le da permiso de estirarse por toda la pantalla
    let htmlFinal = `<pre ${preAtributo} style="width: 100% !important; max-width: 100% !important; margin: 0 auto !important; display: block !important;">${formatearLetra(letraLimpia)}</pre>`;
    
    if (dataDiagramas.ubicacion === 'inicio') htmlFinal = dataDiagramas.html + htmlFinal;
    else if (dataDiagramas.ubicacion === 'final' || dataDiagramas.ubicacion === 'fijo') htmlFinal = htmlFinal + dataDiagramas.html;
    
    return `<div style="width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">${htmlFinal}</div>`;
}
// 🚨 REEMPLAZA TU FUNCIÓN ACTUAL CON ESTA (Arregla el centrado de los diagramas)
function construirHTMLDiagramas(textoLetra, forzarImpresion = false) {
    const ubicacion = localStorage.getItem('config_diag_ubica') || 'oculto';
    
    // 🔥 EL ARREGLO: Si estamos imprimiendo, ignoramos si está oculto en la app
    if (ubicacion === 'oculto' && !forzarImpresion) return { html: '', ubicacion };

    const tamaño = localStorage.getItem('config_diag_tamano') || 'normal';

    const patronAcordes = /(?<![A-Za-z])([A-G][#b]?)(m|maj|7|sus|add|dim|aug|[0-9])*(?![A-Za-z])/g;
    const acordesEncontrados = textoLetra.match(patronAcordes) || [];
    const excluidas = ["As", "Va", "He", "Me", "Solo", "Fue", "Del", "Al"];
    
    let acordesUnicos = [...new Set(acordesEncontrados.map(a => a.trim()))].filter(a => !excluidas.includes(a));

    if (acordesUnicos.length === 0) return { html: '', ubicacion };

    // Quitamos la clase 'diag-fijo' para que no se peguen abajo en el papel
    const claseFijo = (ubicacion === 'fijo' && !forzarImpresion) ? 'diag-fijo' : '';
    let html = `<div class="diagramas-container diag-${tamaño} ${claseFijo}" style="justify-content: center; margin-bottom: 25px; margin-top: 15px;">`;
    
    acordesUnicos.forEach(acorde => {
        let acordeTransformado = transformarAcordeEspecial(acorde);
        html += generarSvgAcorde(acorde, acordeTransformado); 
    });

    html += `</div>`;
    return { html, ubicacion };
}
function generarSvgAcorde(acordeReal, acordeMostrar) {
    // Busca el acorde base ignorando el bajo (ej: D/F# -> D)
    let clave = acordeReal.split('/')[0];
    let data = dbAcordesGuitarra[clave] || dbAcordesGuitarra[clave.replace(/7|maj7|sus4|sus2|add9/g, '')];
    
    // Si no está en la base de datos, mostramos solo el nombre sin diagrama
    if (!data) return `<div class="acorde-diagrama"><span>${acordeMostrar}</span><svg viewBox="0 0 60 70" style="opacity:0.2"><line x1="0" y1="10" x2="60" y2="10" stroke="white" stroke-width="2"/></svg></div>`;

    const trastes = data.t;
    const offset = data.c ? data.c - 1 : 0; // Si hay cejilla, ajustamos los números
    const isZurdo = localStorage.getItem('config_zurdos') === 'true'; // 🔥 LEEMOS EL MODO ZURDO

    let svg = `<div class="acorde-diagrama">
                 <span>${acordeMostrar}</span>
                 <svg viewBox="0 0 70 85" width="100%" xmlns="http://www.w3.org/2000/svg">`;
    
    // Si no hay cejilla, dibujar la tuerca gruesa superior
    if (!data.c) {
        svg += `<line x1="10" y1="15" x2="60" y2="15" stroke="white" stroke-width="4" stroke-linecap="round"/>`;
    } else {
        svg += `<text x="0" y="28" fill="white" font-size="10" font-family="sans-serif" font-weight="bold">${data.c}fr</text>`;
    }

    // Dibujar las 6 cuerdas verticales
    for(let i=0; i<6; i++) {
        svg += `<line x1="${10 + i*10}" y1="15" x2="${10 + i*10}" y2="75" stroke="white" stroke-width="1.5"/>`;
    }
    // Dibujar los 5 trastes horizontales
    for(let i=0; i<=4; i++) {
        svg += `<line x1="10" y1="${15 + i*15}" x2="60" y2="${15 + i*15}" stroke="white" stroke-width="1.5"/>`;
    }

    // Dibujar los dedos y cuerdas al aire/mutadas
    for(let i=0; i<6; i++) {
        let t = trastes[i];
        
        // 🔥 LA MAGIA ZURDA: Invertimos el orden visual de las cuerdas horizontalmente
        let x = 10 + (isZurdo ? (5 - i) : i) * 10;
        
        if (t === 'x') {
            svg += `<text x="${x-3}" y="10" fill="white" font-size="10" font-family="sans-serif">x</text>`;
        } else if (t === 0) {
            svg += `<circle cx="${x}" cy="10" r="3" fill="transparent" stroke="white" stroke-width="1"/>`;
        } else {
            let posRelativa = t - offset;
            let cy = 15 + (posRelativa * 15) - 7.5;
            svg += `<circle cx="${x}" cy="${cy}" r="4" fill="white" class="punto-relleno"/>`;
        }
    }
    
    svg += `</svg></div>`;
    return svg;
}
function parsearChordPro(contenido) {
    let song = {
        title: "SIN TÍTULO",
        artist: "Desconocido",
        tone: "--",
        lyrics: "",
        folder: "Sin Categoría",
        tipoArchivo: "cho",
        fecha: new Date().toISOString()
    };

    const lineas = contenido.split('\n');
    let lineasFinales = [];

    for (let linea of lineas) {
        let l = linea.trimEnd();
        
        // 1. Atrapar Metadatos {title: X}, {key: X}, etc.
        const dirMatch = l.match(/^\{([^:]+):\s*([^}]+)\}$/);
        if (dirMatch) {
            const key = dirMatch[1].toLowerCase();
            const val = dirMatch[2].trim();
            
            if (key === 'title' || key === 't') song.title = val.toUpperCase();
            else if (key === 'artist' || key === 'a' || key === 'st' || key === 'subtitle') song.artist = val;
            else if (key === 'key' || key === 'k') song.tone = val;
            else if (key === 'comment' || key === 'c') lineasFinales.push(val.toUpperCase() + ":"); // {c: Coro} -> CORO:
            continue;
        }

        // 2. Traductor de acordes anidados (Ej: "Hola [C]mundo" -> "     C\nHola mundo")
        if (l.includes('[')) {
            let lineaAcordes = "";
            let lineaLetras = "";
            let regex = /\[([^\]]+)\]/g;
            let lastIndex = 0;
            let match;

            while ((match = regex.exec(l)) !== null) {
                const chord = match[1];
                const indexInRaw = match.index;
                
                // Texto antes del acorde
                const chunk = l.substring(lastIndex, indexInRaw);
                lineaLetras += chunk;
                
                // Rellenar la línea de acordes con espacios hasta alcanzar a la letra
                while (lineaAcordes.length < lineaLetras.length) {
                    lineaAcordes += " ";
                }
                
                // Plantar el acorde justo arriba de la letra correspondiente
                lineaAcordes += chord;
                lastIndex = regex.lastIndex;
            }
            
            // Añadir el resto del texto
            lineaLetras += l.substring(lastIndex);
            
            if (lineaAcordes.trim().length > 0) lineasFinales.push(lineaAcordes);
            lineasFinales.push(lineaLetras);
        } else {
            // Si es una línea normal sin acordes, pasa directo
            lineasFinales.push(l);
        }
    }

    song.lyrics = lineasFinales.join('\n').trim();
    return song;
}
// ==========================================================================
// 🎵 6. Teoría Musical (Transposición, Capo y Cifrado)
// ==========================================================================
function openToneModal() { 
    const modal = document.getElementById('tone-modal');
    const displayTono = document.getElementById('display-tonalidad');
    const labelHeader = document.getElementById('header-tone-label');

    if (modal && displayTono && labelHeader) {
        let tonoActual = labelHeader.innerText.trim();
        if (tonoActual === "--" || tonoActual === "") {
            displayTono.innerText = "--";
        } else {
            displayTono.innerText = tonoActual;
        }
        
        modal.classList.add('active'); 
    }
}
function selectTone(newTone, keepOpen = false) {
    let cancionReferencia;
    let contenedorPadre;
    let idPreGenerado = '';

    if (modoCarruselActivo && cancionesEnCarrusel.length > 0) {
        cancionReferencia = cancionesEnCarrusel[indiceCarruselActual];
        contenedorPadre = document.querySelectorAll('.song-slide')[indiceCarruselActual];
        idPreGenerado = `pre-slide-${indiceCarruselActual}`;
    } else {
        const tituloActual = document.querySelector('.main-title').innerText;
        const limpiezaNuclear = (texto) => texto ? texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase() : "";
        let tituloLimpio = limpiezaNuclear(tituloActual);
        
        cancionReferencia = listaDeCanciones.find(c => limpiezaNuclear(c.title || c.titulo) === tituloLimpio);
        if (!cancionReferencia) cancionReferencia = listaDeCanciones.find(c => limpiezaNuclear(c.title || c.titulo).includes(tituloLimpio));
        
        contenedorPadre = document.querySelector('.lyrics-container');
    }
    
    if (!cancionReferencia || !contenedorPadre) return;

    // Fix: Si la canción no tiene tono, usa "C" como base temporal para que no aborte.
    const tonoBaseRaw = (cancionReferencia.tone === "--" || !cancionReferencia.tone) ? "C" : cancionReferencia.tone;
    const tonoBase = revertirAcordeA_Ingles(tonoBaseRaw.trim());
    const matchOriginal = tonoBase.match(/^([A-G][#b]?)(.*)$/i);
    if (!matchOriginal) return;

    const notaRaizOriginal = matchOriginal[1].toUpperCase();
    const extensionOriginal = matchOriginal[2]; 
    const notaOrigen = normalizeMap[notaRaizOriginal] || notaRaizOriginal;

    const newToneIngles = revertirAcordeA_Ingles(newTone);
    const matchDestino = newToneIngles.match(/^([A-G][#b]?)(.*)$/i);
    if (!matchDestino) return;

    const notaRaizDestino = matchDestino[1].toUpperCase();
    const extensionDestino = matchDestino[2] || extensionOriginal; 
    
    const notaDestino = normalizeMap[notaRaizDestino] || notaRaizDestino;
    const idxOrigen = notes.indexOf(notaOrigen);
    const idxDestino = notes.indexOf(notaDestino);

    if (idxOrigen === -1 || idxDestino === -1) return;
    
    const diff = (idxDestino - idxOrigen + 120) % 12;

    if (typeof notaPadActual !== 'undefined' && notaPadActual !== null) {
        let deltaTransposicion = diff;
        const tonoActualPantalla = document.getElementById('header-tone-label').innerText.trim();
        
        if (tonoActualPantalla !== "--") {
            const tonoRevertido = revertirAcordeA_Ingles(tonoActualPantalla);
            const matchPantalla = tonoRevertido.match(/^([A-G][#b]?)/i);
            if (matchPantalla) {
                const notaPantalla = normalizeMap[matchPantalla[1].toUpperCase()] || matchPantalla[1].toUpperCase();
                const idxPantalla = notes.indexOf(notaPantalla);
                if (idxPantalla !== -1) {
                    deltaTransposicion = (idxDestino - idxPantalla + 120) % 12;
                }
            }
        }

        let indexPad = notes.indexOf(notaPadActual);
        if (indexPad !== -1) {
            let newPadIndex = (indexPad + deltaTransposicion + 120) % 12;
            let newPadNote = notes[newPadIndex];
            
            let btnId = 'pad-btn-' + newPadNote.replace('#', 's');
            let btn = document.getElementById(btnId);
            
            if (btn) {
                togglePad(newPadNote, btn);
            }
        }
    }
    
    let capoActivo = 0;
    if (typeof currentCapo !== 'undefined') {
        capoActivo = currentCapo;
    } else {
        const capoText = document.getElementById('capo-indicator')?.innerText || "";
        const matchC = capoText.match(/Capo\s*(\d+)/i);
        if (matchC) capoActivo = parseInt(matchC[1]);
    }

    const transposicionFinal = diff - capoActivo;
    const nuevaLetraTranspuesta = transponerTexto(cancionReferencia.lyrics, transposicionFinal);

    if (modoCarruselActivo && cancionesEnCarrusel.length > 0) {
        contenedorPadre.innerHTML = generarVistaConDiagramas(nuevaLetraTranspuesta, idPreGenerado);
    } else {
        contenedorPadre.innerHTML = `<div class="song-slide" style="width: 100vw !important; padding-left: 15px !important; padding-right: 15px !important; display: flex !important; align-items: flex-start !important; justify-content: flex-start !important;">${generarVistaConDiagramas(nuevaLetraTranspuesta, idPreGenerado)}</div>`;
    }

    aplicarModoDiseno();

    const tonoFinalPuro = notaRaizDestino + extensionDestino;
    const tonoFinalVisual = transformarAcordeEspecial(tonoFinalPuro);

    document.getElementById('header-tone-label').innerText = tonoFinalVisual;
    document.getElementById('display-tonalidad').innerText = tonoFinalVisual;
    
    const modalVal = document.getElementById('modal-tone-value');
    if (modalVal) modalVal.innerText = tonoFinalVisual;

    const capoInd = document.getElementById('capo-indicator');
    if (capoInd && capoInd.innerText.trim() !== "") {
        const matchCapo = capoInd.innerText.match(/Capo\s*(\d+)/i);
        const capoVal = matchCapo ? parseInt(matchCapo[1]) : 0;
        
        if (capoVal > 0) {
            const notasArray = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
            const mapaBemoles = {"DB":"C#", "EB":"D#", "GB":"F#", "AB":"G#", "BB":"A#"};
            
            let raiz = notaRaizDestino.toUpperCase();
            raiz = mapaBemoles[raiz] || raiz;
            
            let i = notasArray.indexOf(raiz);
            if (i !== -1) {
                let nuevoI = (i - capoVal + 120) % 12; 
                let acordeResultanteIngles = notasArray[nuevoI] + (extensionDestino || "");
                let acordeResultanteVisual = transformarAcordeEspecial(acordeResultanteIngles);
                capoInd.innerHTML = `Capo ${capoVal} - <span>${acordeResultanteVisual}</span>`;
            }
        }
    }

    if (!keepOpen) {
        const modal = document.getElementById('tone-modal');
        if (modal) modal.classList.remove('active');
    }
}
function shiftModalTone(direction) {
    const display = document.getElementById('display-tonalidad');
    if (!display || display.innerText === "--") return; 

    let currentFullNote = revertirAcordeA_Ingles(display.innerText.trim());
    const match = currentFullNote.match(/^([A-G][#b]?)(.*)$/);
    if (!match) return;

    let notaBase = match[1];  
    let extension = match[2]; 
    
    let noteToSearch = normalizeMap[notaBase] || notaBase;
    const currentIndex = notes.indexOf(noteToSearch);
    
    if (currentIndex !== -1) {
        let newIndex = (currentIndex + direction + 12) % 12;
        const newToneBase = notes[newIndex];
        const nuevoTonoCompleto = newToneBase + extension;
        selectTone(nuevoTonoCompleto, true); 
    }
}
function shiftNote(note, steps) {
    // 1. Separamos la nota base (ej: "A") de su extensión (ej: "m" o "maj7")
    const match = note.match(/^([A-G][#b]?)(.*)$/i);
    if (!match) return note;

    let base = match[1].toUpperCase();
    let extension = match[2] || "";
    let fullNote = normalizeMap[base] || base;
    let index = notes.indexOf(fullNote);

    if (index === -1) return note; // Si hay un error, devuelve lo mismo
    let newIndex = (index + steps + 120) % 12;
    return notes[newIndex] + extension;
}

function transponerTexto(texto, semitonos) {
    if (!texto || semitonos === 0) return texto;

    // Atrapa el acorde base y el bajo si existe (Ej: C#m7/F#)
    const patronAcordes = /(?<![A-Za-z])([A-G][#b]?)((?:m|maj|7|sus|add|dim|aug|[0-9])*)(?:\/([A-G][#b]?))?(?![A-Za-z0-9])/g;

    return texto.replace(patronAcordes, (match, notaBase, extension, bajo) => {
        const excluidas = ["As", "Va", "He", "Me", "Solo", "Fue", "Del", "Al"];
        if (excluidas.includes(match.trim())) return match;

        // Transponer raíz
        let notaLimpia = (normalizeMap[notaBase.trim()] || notaBase.trim()).toUpperCase();
        let indice = notes.indexOf(notaLimpia);
        if (indice === -1) return match;
        
        // El 120 asegura que nunca haya módulos negativos en JavaScript
        let nuevoIndice = (indice + semitonos + 120) % 12; 
        let nuevaNota = notes[nuevoIndice];

        // Transponer nota de bajo si existe
        let nuevoBajo = "";
        if (bajo) {
            let bajoLimpio = (normalizeMap[bajo.trim()] || bajo.trim()).toUpperCase();
            let indiceBajo = notes.indexOf(bajoLimpio);
            if (indiceBajo !== -1) {
                let nuevoIndiceBajo = (indiceBajo + semitonos + 120) % 12;
                nuevoBajo = "/" + notes[nuevoIndiceBajo];
            } else {
                nuevoBajo = "/" + bajo; // Fallback por si la nota es extraña
            }
        }

        return nuevaNota + (extension || "") + nuevoBajo;
    });
}

// --- 3. SISTEMA DE CAPO ---
function updateCapoVisuals() {
    let tituloActual = document.querySelector('.main-title').innerText;
    const limpiezaNuclear = (texto) => texto ? texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase() : "";
    let tituloLimpio = limpiezaNuclear(tituloActual);
    
    let cancion = listaDeCanciones.find(c => limpiezaNuclear(c.title || c.titulo) === tituloLimpio);
    if (!cancion) cancion = listaDeCanciones.find(c => limpiezaNuclear(c.title || c.titulo).includes(tituloLimpio));
    
    if (!cancion) return;

    const tonoPantallaVisual = document.getElementById('header-tone-label').innerText.trim();
    const tonoPantalla = (tonoPantallaVisual !== "--") ? revertirAcordeA_Ingles(tonoPantallaVisual) : "--";
    const tonoBase = (tonoPantalla !== "--") ? tonoPantalla : revertirAcordeA_Ingles(cancion.tone || "--");
    
    const indicatorEl = document.getElementById('capo-indicator');
    const capoEl = document.getElementById('capo-value');
    
    const tonoEjecucionBruto = shiftNote(tonoBase, -currentCapo);
    const tonoEjecucion = transformarAcordeEspecial(tonoEjecucionBruto);

    if (capoEl) capoEl.innerText = currentCapo;
    if (indicatorEl) {
        if (currentCapo > 0) {
            indicatorEl.innerHTML = `Capo ${currentCapo} - <span>${tonoEjecucion}</span>`;
            indicatorEl.style.display = "block"; 
        } else {
            indicatorEl.innerHTML = ""; 
            indicatorEl.style.display = "none";
        }
    }
    
    let diffTonalidad = 0;
    const tonoOriginal = revertirAcordeA_Ingles(cancion.tone || "--");
    
    if (tonoOriginal !== "--" && tonoPantalla !== "--") {
        const matchO = tonoOriginal.match(/^([A-G][#b]?)/i);
        const matchP = tonoPantalla.match(/^([A-G][#b]?)/i);
        
        if (matchO && matchP) {
            const raizO = normalizeMap[matchO[1].toUpperCase()] || matchO[1].toUpperCase();
            const raizP = normalizeMap[matchP[1].toUpperCase()] || matchP[1].toUpperCase();
            
            const iO = notes.indexOf(raizO);
            const iP = notes.indexOf(raizP);
            
            if (iO !== -1 && iP !== -1) {
                diffTonalidad = (iP - iO + 120) % 12; 
            }
        }
    }

    const transposicionTotal = diffTonalidad - currentCapo;
    const nuevaLetraCapo = transponerTexto(cancion.lyrics, transposicionTotal);

    if (modoCarruselActivo && cancionesEnCarrusel.length > 0) {
        const slide = document.querySelectorAll('.song-slide')[indiceCarruselActual];
        if (slide) slide.innerHTML = generarVistaConDiagramas(nuevaLetraCapo, `pre-slide-${indiceCarruselActual}`);
    } else {
        const visorDiv = document.querySelector('.lyrics-container');
        if (visorDiv) visorDiv.innerHTML = `<div class="song-slide" style="width: 100vw !important; padding-left: 15px !important; padding-right: 15px !important; display: flex !important; align-items: flex-start !important; justify-content: flex-start !important;">${generarVistaConDiagramas(nuevaLetraCapo)}</div>`;
    }
    aplicarModoDiseno();
}
function changeCapo(val) {
    currentCapo += val;
    if (currentCapo < 0) currentCapo = 0;
    if (currentCapo > 12) currentCapo = 12;
    updateCapoVisuals();
}

function resetCapo() {
    currentCapo = 0;
    const capoEl = document.getElementById('capo-value');
    if(capoEl) capoEl.innerText = "0";

    const indicatorEl = document.getElementById('capo-indicator');
    if(indicatorEl) indicatorEl.innerText = "";

    const tituloActual = document.querySelector('.main-title').innerText;
    const cancion = listaDeCanciones.find(c => c.title === tituloActual);
    
    if (cancion) {
        const tonoBase = cancion.tone || "--";
        
        // 🔥 FIX: Traducimos el tono original al formato visual (Latino/Bemol) antes de imprimirlo
        const tonoVisual = transformarAcordeEspecial(tonoBase);
        
        document.getElementById('display-tonalidad').innerText = tonoVisual;
        document.getElementById('header-tone-label').innerText = tonoVisual;

        if (modoCarruselActivo && cancionesEnCarrusel.length > 0) {
            const slide = document.querySelectorAll('.song-slide')[indiceCarruselActual];
            if (slide) slide.innerHTML = generarVistaConDiagramas(cancion.lyrics, `pre-slide-${indiceCarruselActual}`);
        } else {
            const visorDiv = document.querySelector('.lyrics-container');
            if (visorDiv) visorDiv.innerHTML = `<div class="song-slide" style="width: 100vw !important; padding-left: 15px !important; padding-right: 15px !important; display: flex !important; align-items: flex-start !important; justify-content: flex-start !important;">${generarVistaConDiagramas(cancion.lyrics)}</div>`;
        }
        aplicarModoDiseno();
    }
}
function revertirAcordeA_Ingles(nota) {
    if (!nota) return "";
    const mapaInverso = { 'DO':'C', 'RE':'D', 'MI':'E', 'FA':'F', 'SOL':'G', 'LA':'A', 'SI':'B' };
    let res = nota.replace(/(DO|RE|MI|FA|SOL|LA|SI)/gi, match => mapaInverso[match.toUpperCase()]);
    const aSostenidos = { 'Db':'C#', 'Eb':'D#', 'Gb':'F#', 'Ab':'G#', 'Bb':'A#' };
    res = res.replace(/[A-G]b/gi, match => {
        let key = match.charAt(0).toUpperCase() + 'b';
        return aSostenidos[key] || match;
    });
    return res;
}

// FORMATO VISUAL: De Inglés a lo que pidió el usuario (Latino, Bajo, Bemoles)
function transformarAcordeEspecial(acorde) {
    let res = acorde.trim();
    if (!res || res === "") return res;

    const isBajo = localStorage.getItem('config_instrumento') === 'bajo';
    const isLatino = localStorage.getItem('config_cifrado') === 'latino';
    const notacion = localStorage.getItem('config_notacion') || 'sostenidos';

    // 1. LÓGICA DE SOSTENIDOS / BEMOLES (AHORA APLICA PARA TODOS)
    const mapaBemoles = { 'C#':'Db', 'D#':'Eb', 'F#':'Gb', 'G#':'Ab', 'A#':'Bb' };
    const mapaSostenidos = { 'Db':'C#', 'Eb':'D#', 'Gb':'F#', 'Ab':'G#', 'Bb':'A#' };
    const mapaHibrido = { 'Db':'C#', 'D#':'Eb', 'Gb':'F#', 'G#':'Ab', 'A#':'Bb' };

    if (notacion === 'bemoles') {
        res = res.replace(/[A-G]#/gi, m => mapaBemoles[m.toUpperCase()] || m);
    } else if (notacion === 'sostenidos') {
        res = res.replace(/[A-G]b/gi, m => {
            let key = m.charAt(0).toUpperCase() + 'b';
            return mapaSostenidos[key] || m;
        });
    } else if (notacion === 'mixto') {
        res = res.replace(/[A-G][#b]/gi, m => {
            let key = m.length === 2 ? m[0].toUpperCase() + m[1].toLowerCase() : m;
            return mapaHibrido[key] || m;
        });
    }

    // 2. FILTRO DE BAJO
    if (isBajo) {
        if (res.includes('/')) {
            res = res.split('/')[1]; 
        } else {
            let match = res.match(/^[A-G][#b]?/i);
            if (match) res = match[0];
        }
    }

    // 3. FILTRO LATINO
    if (isLatino) {
        const mapaLatino = { 'C':'Do', 'D':'Re', 'E':'Mi', 'F':'Fa', 'G':'Sol', 'A':'La', 'B':'Si' };
        res = res.replace(/(^|\/)([A-G])/gi, function(m, barra, nota) {
            return barra + mapaLatino[nota.toUpperCase()];
        });
    }

    return res;
}
function seleccionarTonoDesdeMenuNuevo(notaIngles, event) {
    event.stopPropagation();
    
    const menu = document.getElementById('menu-tono-modal');
    if (menu) menu.classList.remove('active');

    // Le mandamos la nota en inglés puro a tu motor.
    // Tu función selectTone ya sabe mantener el "m" (menor) si la canción original lo tiene,
    // y también se encarga de traducirlo visualmente en la pantalla.
    selectTone(notaIngles, true); 
}
function cambiarConfigMusical(el, valor) {
    // 1. Efecto visual: Apaga a los hermanos y enciende el clickeado
    const parent = el.parentElement;
    parent.querySelectorAll('.segment-item').forEach(item => item.classList.remove('active'));
    el.classList.add('active');

    // 2. Lógica: Detectar qué categoría estamos cambiando
    const v = valor.toLowerCase();
    
    if (v === 'estandar' || v === 'latino') {
        localStorage.setItem('config_cifrado', v);
        refrescarVisorActual(); 
        document.getElementById('song-search')?.dispatchEvent(new Event('input')); // 🔥 REPINTADO EN VIVO
    } 
    else if (v === 'guitarra' || v === 'bajo' || v === 'ukelele') {
        localStorage.setItem('config_instrumento', v);
        refrescarVisorActual(); // Refresca la letra en vivo
    } 
	// --- NUEVA LÓGICA DE NOTACIÓN ---
    else if (v === 'sostenidos' || v === 'bemoles' || v === 'mixto') {
        localStorage.setItem('config_notacion', v);
        refrescarVisorActual();
		document.getElementById('song-search')?.dispatchEvent(new Event('input'));
    }
    else {
        // Es una afinación (Standard, Drop D, etc)
        localStorage.setItem('config_afinacion', valor); 
        // La afinación no requiere refrescar la letra todavía, servirá para los diagramas
    }
}
// ==========================================================================
// 🎨 7. Personalización y Temas Visuales
// ==========================================================================
function aplicarEnfasisApp(colorHex) {
    document.documentElement.style.setProperty('--accent-color', colorHex);
    localStorage.setItem('config_accent_color', colorHex);
}
function abrirConfig() {       
    document.getElementById('config-modal').classList.add('active');
    mostrarMenuConfig(); // Siempre que abras ajustes, inicia en la lista principal
    actualizarListaEstructuraAjustes(); // <--- ¡ESTO ARREGLA QUE NO APAREZCA LA ESTRUCTURA!
}

function mostrarMenuConfig() {
    const sidebar = document.querySelector('.config-sidebar');
    const content = document.querySelector('.config-content');
    const tituloHeader = document.querySelector('.config-header .panel-title-text');
    
    // Mostramos la lista al 100% y ocultamos el contenido interno
    if (sidebar) sidebar.style.display = 'block';
    if (content) content.style.display = 'none';
    if (tituloHeader) tituloHeader.innerText = 'Ajustes';
}

function navegarAtrasConfig() {
    const sidebar = document.querySelector('.config-sidebar');
    
    // 🔥 LA MAGIA: Si vinimos del rayito, salimos directo al visor de la canción
    if (origenAccesoRapido) {
        cerrarConfig();
        return;
    }
    
    // Si la lista principal está oculta (comportamiento normal paso a paso)
    if (sidebar && sidebar.style.display === 'none') {
        mostrarMenuConfig(); // Regresamos a la lista principal
    } else {
        cerrarConfig(); // Si ya estamos en la lista principal, cerramos todo el modal
    }
}
function cerrarConfig() {
    document.getElementById('config-modal').classList.remove('active');
    cerrarTodoLoAbierto();
    origenAccesoRapido = false; // <-- Limpiamos el rastro para la próxima vez
}
function cambiarSeccion(elemento, idSeccion) {
    const sidebar = document.querySelector('.config-sidebar');
    const content = document.querySelector('.config-content');
    if (sidebar) sidebar.style.display = 'none';
    if (content) content.style.display = 'block';

    // 👇 Añadido 'section-pads' al arreglo
    const secciones = ['section-general', 'section-personalizacion', 'section-copia', 'section-diagramas', 'section-pedal', 'section-afinador', 'section-pads', 'section-avanzado', 'section-acerca', 'section-comprar'];
    secciones.forEach(id => {
        const sec = document.getElementById(id);
        if (sec) sec.style.display = 'none';
    });

    const activa = document.getElementById('section-' + idSeccion);
    if (activa) activa.style.display = 'block';

    const tituloHeader = document.querySelector('.config-header .panel-title-text');
    if (tituloHeader) {
        const nombres = {
            'general': t('menu_general'),
            'personalizacion': t('menu_personalization'),
            'copia': t('menu_backup'),
            'diagramas': t('menu_diagrams'),
            'pedal': t('menu_pedal'),
            'pads': t('menu_pads'),
            'afinador': t('qa_tuner'),
            'avanzado': t('menu_advanced'),
            'acerca': t('menu_about'),
            'comprar': t('menu_pro')
        };
        tituloHeader.innerText = nombres[idSeccion] || t('settings_title');
    }
    
    if (idSeccion === 'personalizacion' && typeof actualizarMonitorVistaPrevia === 'function') {
        actualizarMonitorVistaPrevia();
    } else if (idSeccion === 'avanzado' && typeof actualizarInfoContenido === 'function') {
        actualizarInfoContenido(); 
    }

    if (content) content.scrollTop = 0;
}
function cambiarTemaGlobal(tema) {
    if (tema === 'claro') {
        document.body.classList.add('tema-claro');
    } else {
        document.body.classList.remove('tema-claro');
    }
    localStorage.setItem('config_tema_global', tema);
    
    // 🔥 EL GATILLO AUTOMÁTICO 🔥
    // Verifica si estás usando el fondo "Default" y lo voltea al instante
    const savedFondo = localStorage.getItem('config_bg_color');
    if (!savedFondo || savedFondo === '#000000') {
        document.documentElement.style.setProperty('--bg-black', tema === 'claro' ? '#ffffff' : '#000000');
    }
}
function updateThemeColor(colorHex) {
    if (colorHex === 'DEFAULT' || colorHex === '') colorHex = '#00FFFF';
    document.documentElement.style.setProperty('--accent-color', colorHex);
    localStorage.setItem('config_accent_color', colorHex);
    
    // Usamos el ayudante mágico para el nuevo botón de énfasis
    if (typeof actualizarVisualBotonColor === 'function') {
        actualizarVisualBotonColor('enfasis', colorHex);
    }
}
function aplicarColorLetra(colorHex) {
    if (colorHex === 'DEFAULT' || colorHex === '') {
        document.body.style.removeProperty('--lyrics-color');
        localStorage.removeItem('config_lyrics_color');
    } else {
        document.body.style.setProperty('--lyrics-color', colorHex, 'important');
        localStorage.setItem('config_lyrics_color', colorHex);
    }
    actualizarVisualBotonColor('letra', colorHex);
    refrescarVisorActual();
}

function aplicarColorAcordes(colorHex) {
    if (colorHex === 'DEFAULT' || colorHex === '') {
        document.body.style.removeProperty('--chord-color');
        localStorage.removeItem('config_chord_color');
    } else {
        document.body.style.setProperty('--chord-color', colorHex, 'important');
        localStorage.setItem('config_chord_color', colorHex);
    }
    actualizarVisualBotonColor('acorde', colorHex);
    refrescarVisorActual();
}

function aplicarColorEstructura(colorHex) {
    if (colorHex === 'DEFAULT' || colorHex === '') {
        document.body.style.removeProperty('--structure-color');
        localStorage.removeItem('config_structure_color');
    } else {
        document.body.style.setProperty('--structure-color', colorHex, 'important');
        localStorage.setItem('config_structure_color', colorHex);
    }
    actualizarVisualBotonColor('header', colorHex);
    refrescarVisorActual();
}
function aplicarColorEstructuraDinamica(colorHex, nombreClave) {
    if (colorHex === 'DEFAULT' || colorHex === '') {
        localStorage.removeItem('config_color_' + nombreClave);
    } else {
        localStorage.setItem('config_color_' + nombreClave, colorHex);
    }
    
    // IMPORTANTE: Le pasamos el nombreClave a la función para que SOLO pinte ese botón
    actualizarVisualBotonColor('estructura_dinamica', colorHex, nombreClave);
    
    refrescarVisorActual();
}
function aplicarColorSeccionFila(colorHex, elementoId) {
    if (!elementoId || elementoId === 'null') return;
    const btn = document.getElementById(elementoId);
    const txtId = elementoId.replace('btn-', 'txt-'); // Convierte btn-est-coro-color a txt-est-coro-color
    const txt = document.getElementById(txtId);
    
    if (!btn || !txt) return;

    if (colorHex === 'DEFAULT' || colorHex === '') {
        btn.style.backgroundColor = "#333";
        btn.style.borderColor = "#444";
        txt.innerText = "DEFAULT";
        txt.style.color = "#aaaaaa";
    } else {
        btn.style.backgroundColor = colorHex;
        btn.style.borderColor = colorHex;
        txt.innerText = "ACTIVO";
        const coloresClaros = ['#FFFFFF','#F5F5F5','#FFFFCC','#F5F5DC','#E8E8E8','#D3D3D3','#F2F2F2','#FFFF00','#66FF66','#00FFFF','#FFFF99','#CCFF00','#B2F2BB','#87CEEB','#B0E0E6','#AEC6CF','#D8BFD8','#FFD1DC','#FFB3FF','#40E0D0','#7FFFD4'];
        txt.style.color = coloresClaros.includes(colorHex.toUpperCase()) ? '#000' : '#fff';
    }
}

// Función para el Nuevo Fondo
function aplicarColorFondo(colorHex) {
    // Si es DEFAULT, vacío, o explícitamente NEGRO (#000000)
    if (colorHex === 'DEFAULT' || colorHex === '' || colorHex === '#000000') {
        const esClaro = document.body.classList.contains('tema-claro');
        document.documentElement.style.setProperty('--bg-black', esClaro ? '#ffffff' : '#000000');
        localStorage.removeItem('config_bg_color');
        actualizarVisualBotonColor('fondo', 'DEFAULT'); // Forzamos el botón a transparente
    } else {
        document.documentElement.style.setProperty('--bg-black', colorHex);
        localStorage.setItem('config_bg_color', colorHex);
        actualizarVisualBotonColor('fondo', colorHex);
    }
}
function aplicarColorResaltado(colorHex, elementoId) {
    // Si no llega el ID, lo forzamos al correcto
    if (!elementoId || elementoId === 'null') elementoId = 'btn-resaltar-color';
    
    const preview = document.getElementById(elementoId);
    const textoInterno = document.getElementById('txt-resaltar-color'); // Corregido: Era 'text-resaltar'

    // Si elegimos DEFAULT o Transparente
    if (colorHex === 'DEFAULT' || colorHex === '' || colorHex === 'transparent') {
        document.documentElement.style.setProperty('--highlight-color', 'transparent');
        localStorage.removeItem('config_highlight_color');
        
        if (preview && textoInterno) {
            // 🔥 CAMBIO: Fuerzas la transparencia venciendo al CSS
            preview.style.setProperty('background-color', 'transparent', 'important'); 
            preview.style.setProperty('border-color', '#444', 'important');
            textoInterno.style.color = "#888";
            textoInterno.innerText = "DEFAULT";
        }
    } else {
        document.documentElement.style.setProperty('--highlight-color', colorHex);
        localStorage.setItem('config_highlight_color', colorHex);
        
        if (preview && textoInterno) {
            // 🔥 CAMBIO: Fuerzas el color elegido venciendo al CSS
            preview.style.setProperty('background-color', colorHex, 'important');
            preview.style.setProperty('border-color', colorHex, 'important'); // Que el borde combine
            
            const coloresClaros = ['#FFFFFF','#F5F5F5','#FFFFCC','#F5F5DC','#E8E8E8','#D3D3D3','#F2F2F2','#FFFF00'];
            const esClaro = coloresClaros.includes(colorHex.toUpperCase());
            
            textoInterno.style.color = esClaro ? '#000' : '#fff';
            textoInterno.innerText = "ACTIVO";
        }
    }
    
    // 🚨 VITAL: Actualizamos el visor para ver el resaltado en vivo sin tener que salir
    refrescarVisorActual(); 
}
function aplicarColorNotas(colorHex, elementoId) {
    if (!elementoId || elementoId === 'null') elementoId = 'btn-notas-color';
    
    const preview = document.getElementById(elementoId);
    const textoInterno = document.getElementById('txt-notas-color');

    // Si es DEFAULT, o los tonos Naranja de la paleta
    if (colorHex === 'DEFAULT' || colorHex === '' || colorHex.toUpperCase() === '#FFA500' || colorHex.toUpperCase() === '#FF9800') {
        document.documentElement.style.setProperty('--notes-color', '#FFA500'); // Naranja por defecto
        localStorage.removeItem('config_notes_color');
        
        if (preview && textoInterno) {
            // 🔥 AÑADIDO EL !IMPORTANT PARA VENCER AL CSS 🔥
            preview.style.setProperty('background-color', 'transparent', 'important'); 
            preview.style.setProperty('border-color', '#444', 'important');
            textoInterno.style.color = "#888";
            textoInterno.innerText = "DEFAULT";
        }
    } else {
        document.documentElement.style.setProperty('--notes-color', colorHex);
        localStorage.setItem('config_notes_color', colorHex);
        
        if (preview && textoInterno) {
            // 🔥 AÑADIDO EL !IMPORTANT PARA VENCER AL CSS 🔥
            preview.style.setProperty('background-color', colorHex, 'important');
            preview.style.setProperty('border-color', colorHex, 'important');
            
            const coloresClaros = ['#FFFFFF','#F5F5F5','#FFFFCC','#F5F5DC','#E8E8E8','#D3D3D3','#F2F2F2', '#FFA500', '#FF9800'];
            const esClaro = coloresClaros.includes(colorHex.toUpperCase());
            
            textoInterno.style.color = esClaro ? '#000' : '#fff';
            textoInterno.innerText = "ACTIVO";
        }
    }
}
function abrirPaletaColor(tipo, elementoId = null) {
    const titulos = {
        'letra': t('color_lyrics'),
        'acorde': t('color_chords'),
        'estructura': t('color_headers'),
        'estructura_dinamica': t('color_section'), 
        'estructura_fila': t('color_section'),
        'enfasis': t('color_emphasis'),
        'notas': t('color_notes'),
        'fondo': t('color_bg')
    };
    
    const titulo = titulos[tipo] || t('color_choose');
    abrirModalDinamico(titulo, false, () => {});

    let funcionPintar = 'aplicarColorEstructura';
    if (tipo === 'letra') funcionPintar = 'aplicarColorLetra';
    else if (tipo === 'acorde') funcionPintar = 'aplicarColorAcordes';
    else if (tipo === 'estructura_dinamica') funcionPintar = 'aplicarColorEstructuraDinamica'; // <-- ¡LA CONEXIÓN CRUCIAL!
    else if (tipo === 'estructura_fila') funcionPintar = 'aplicarColorSeccionFila';
    else if (tipo === 'notas') funcionPintar = 'aplicarColorNotas';
    else if (tipo === 'resaltar') funcionPintar = 'aplicarColorResaltado'; 
    else if (tipo === 'enfasis') funcionPintar = 'updateThemeColor'; 
    else if (tipo === 'fondo') funcionPintar = 'aplicarColorFondo';

    const contenedor = document.getElementById('md-mensaje');
    contenedor.style.display = "grid";
    contenedor.style.gridTemplateColumns = "repeat(6, 1fr)";
    contenedor.style.gap = "10px";
    contenedor.style.padding = "15px 5px";

    const colores = [
        '#000000', '#FFFFFF','#F5F5F5','#808080','#D3D3D3','#E8E8E8','#F2F2F2',
        '#FF0000','#FF6666','#FFB3B3','#FFA500','#FFD1A3','#FFFF00','#FFFF99',
        '#FFFACD','#D4A017','#F5F5DC','#008000','#66FF66','#CCFF00','#00A86B',
        '#B2F2BB','#00FFFF','#40E0D0','#87CEEB','#B0E0E6','#AEC6CF','#800080',
        '#B266FF','#D8BFD8','#FF69B4','#FFD1DC','#FF00FF','#FF66FF','#FFB3FF'
    ];

    let botonesHtml = `
        <div style="grid-column: span 2; height:32px; background:#333; border:1px solid #555; border-radius:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; font-family:var(--f-medium); font-size:0.75rem; color:#aaa;" 
             onclick="${funcionPintar}('DEFAULT', '${elementoId}'); cerrarModalDinamico();">
            <span class="material-icons" style="font-size:16px;">history</span>
            DEFAULT
        </div>
    `;

    botonesHtml += colores.map(col => `
        <div style="width:32px; height:32px; background:${col}; border:1px solid #444; border-radius:50%; cursor:pointer;" 
             onclick="${funcionPintar}('${col}', '${elementoId}'); cerrarModalDinamico();">
        </div>
    `).join('');

    contenedor.innerHTML = botonesHtml;
}
function actualizarVisualBotonColor(tipo, color, nombreDinamico = null) {

    const idBtn = nombreDinamico 
        ? `btn-est-${nombreDinamico.toLowerCase()}-color` 
        : `btn-${tipo}-color`;
    
    const idTxt = nombreDinamico 
        ? `txt-est-${nombreDinamico.toLowerCase()}-color` 
        : `txt-${tipo}-color`;

    const btn = document.getElementById(idBtn);
    const txt = document.getElementById(idTxt);
    
    if (!btn || !txt) return;

    if (color === 'DEFAULT' || color === 'transparent' || color === '') {
        // 🔥 CAMBIO: Forzamos la transparencia venciendo al CSS
        btn.style.setProperty('background-color', 'transparent', 'important'); 
        btn.style.setProperty('border-color', '#444', 'important'); 
        txt.innerText = t('js_default');
        txt.style.color = "#888"; 
    } else {
        // 🔥 CAMBIO: Forzamos tu color elegido venciendo al CSS
        btn.style.setProperty('background-color', color, 'important');
        btn.style.setProperty('border-color', color, 'important');
        txt.innerText = t('js_active');
        const coloresClaros = ['#FFFFFF','#F5F5F5','#FFFFCC','#F5F5DC','#E8E8E8','#D3D3D3','#F2F2F2','#FFFF00','#66FF66','#00FFFF','#FFFF99','#CCFF00','#B2F2BB','#87CEEB','#B0E0E6','#AEC6CF','#D8BFD8','#FFD1DC','#FFB3FF','#40E0D0','#7FFFD4'];
        txt.style.color = coloresClaros.includes(color.toUpperCase()) ? '#000' : '#fff';
    }
}
function alternarEstilo(boton, tipo, estilo) {
    boton.classList.toggle('activo');
    const estado = boton.classList.contains('activo');
    
    // Guardamos en la memoria para que el motor principal lo lea
    localStorage.setItem(`config_${tipo}_${estilo}`, estado);
    
    // Refrescamos la pantalla (actualiza el monitor y la canción de fondo instantáneamente)
    refrescarVisorActual();
}
function alternarEstiloNotas(estilo, boton) {
    boton.classList.toggle('activo');
    const estado = boton.classList.contains('activo');
    localStorage.setItem('config_notes_' + estilo, estado);
    refrescarVisorActual();
}
function alternarEstiloDinamico(nombreClave, estilo, botonElement) {
    botonElement.classList.toggle('activo');
    let estado = botonElement.classList.contains('activo');
    localStorage.setItem('config_' + estilo + '_' + nombreClave, estado);
    refrescarVisorActual();
}
function toggleEncabezadosPrincipal() {
    const check = document.getElementById('switch-encabezados-principal');
    if (!check) return; 

    const mostrar = check.checked;

    if (mostrar) {
        document.body.classList.remove('encabezados-apagados');
    } else {
        document.body.classList.add('encabezados-apagados');
    }

    const slider = check.parentElement.querySelector('.sw-slider');
    if (slider) {
        if (mostrar) {
            slider.style.removeProperty('background-color');
        } else {
            slider.style.setProperty('background-color', '#555', 'important'); 
        }
    }

    localStorage.setItem('config_ver_encabezados', mostrar);
}
function cambiarTamanoEncabezado(val) {
    const label = document.getElementById('val-font-h');
    if (label) label.innerText = val;

    document.documentElement.style.setProperty('--header-font-size', val + 'px');
    localStorage.setItem('config_header_size', val);
}
function toggleEsconderAcordes() {
    const check = document.getElementById('switch-esconder-acordes');
    if (!check) return; // Seguro: evita errores si no encuentra el interruptor
    
    const esconder = check.checked;
    
    // Usamos una clase en el body para no arruinar la estructura de los acordes
    if (esconder) {
        document.body.classList.add('acordes-ocultos');
    } else {
        document.body.classList.remove('acordes-ocultos');
    }
    
    localStorage.setItem('config_esconder_acordes', esconder);
}
function toggleEsconderLetra() {
    const check = document.getElementById('switch-esconder-letra');
    if (!check) return;
    
    const esconder = check.checked;
    if (esconder) {
        document.body.classList.add('letras-ocultas');
    } else {
        document.body.classList.remove('letras-ocultas');
    }
    localStorage.setItem('config_esconder_letra', esconder);
}
function toggleMostrarApuntes() {
    const check = document.getElementById('switch-mostrar-apuntes');
    if (!check) return;
    
    const mostrar = check.checked;
    if (mostrar) {
        document.body.classList.remove('apuntes-ocultos');
    } else {
        // Al estar apagado (gris), se añade la clase que los oculta
        document.body.classList.add('apuntes-ocultos');
    }
    
    localStorage.setItem('config_mostrar_apuntes', mostrar);
}
function toggleMultiplicadores() {
    const check = document.getElementById('switch-multiplicadores');
    if (!check) return;
    
    localStorage.setItem('config_multiplicadores', check.checked);
    // Refrescamos la pantalla para que la letra se reconstruya al instante
    refrescarVisorActual(); 
}
function toggleZurdos() {
    const check = document.getElementById('switch-zurdos');
    if (!check) return;
    
    // Guardamos la decisión en memoria
    localStorage.setItem('config_zurdos', check.checked);
    
    // 🔥 Refrescamos la canción en vivo para que los diagramas se volteen al instante
    refrescarVisorActual();
}
function añadirNuevaEstructura() {
    const lang = localStorage.getItem('config_idioma') || 'es'; // 🔥 TRADUCCIÓN EN VIVO

    abrirModalDinamico(lang === 'en' ? "NEW SECTION" : "NUEVA SECCIÓN", true, (nombre) => {
        const lista = document.getElementById('lista-estructura');
        const div = document.createElement('div');
        div.className = 'est-item';
        div.style.marginTop = "15px";
        
        const idUnico = 'est-' + Date.now() + '-color'; // Generar ID único
        
        div.innerHTML = `
            <div class="est-top">
                <span class="est-name">${nombre}:</span>
                <div class="est-actions">
                    <span class="material-icons">edit</span>
                    <span class="material-icons" onclick="eliminarFila(this)">delete</span>
                </div>
            </div>
            <div class="est-controls" style="display: flex; gap: 10px; align-items: center;">
                <div id="btn-${idUnico}" class="btn-color-rectangular" onclick="abrirPaletaColor('estructura_fila', 'btn-${idUnico}')">
                    <span id="txt-${idUnico}">DEFAULT</span>
                </div>
                <div class="est-btns-group">
                    <button class="btn-p">B</button>
                    <button class="btn-p">I</button>
                    <button class="btn-p"><span class="material-icons">format_indent_increase</span></button>
                </div>
            </div>`;
        lista.appendChild(div);
    });
}
function eliminarFila(elemento) {
    const item = elemento.closest('.est-item');
    if (item) item.remove();
}
function actualizarListaEstructuraAjustes() {
    const lista = document.getElementById('lista-estructura');
    if (!lista) return;
    lista.innerHTML = ''; 

    const tituloActual = document.querySelector('.main-title').innerText;
    const cancion = listaDeCanciones.find(c => c.title === tituloActual);
    
    if (!cancion) {
		lista.innerHTML = `<p style="color:#888; font-size:0.8rem; text-align:center;">${t('structure_empty')}</p>`;
		return;
	}

	const patronEncabezado = /^(Solo de Guitarra|Instrumental Final|Pre-Coro|Pre - Coro|Pre Coro|PreCoro|Estructura|Instrumental|Estribillo|Interludio|Preludio|Estrofa|Puente|Outro|Final|Nota Final|Verso|Bridge|Intro|Coro|Coro Final|Solo|Bis)\b(?:[\s\-:\dIVXx\|]|\([^)]*\))*$/i;
    let encabezadosUnicos = new Set();
    
    cancion.lyrics.split('\n').forEach(line => {
        let match = line.trim().match(patronEncabezado);
        if (match) {
            encabezadosUnicos.add(match[1].toUpperCase());
        }
    });

    if (encabezadosUnicos.size === 0) {
        // 🔥 TRADUCCIÓN: "No se detectaron encabezados..."
        lista.innerHTML = `<p style="color:#888; font-size:0.8rem; text-align:center;">${t('js_no_headers')}</p>`;
        return;
    }

    encabezadosUnicos.forEach(nombre => {
        const idBtn = 'btn-est-' + nombre.toLowerCase() + '-color';
        const idTxt = 'txt-est-' + nombre.toLowerCase() + '-color';
        
        const savedColor = localStorage.getItem('config_color_' + nombre) || 'DEFAULT';
        const isBold = localStorage.getItem('config_bold_' + nombre) === 'true';
        const isItalic = localStorage.getItem('config_italic_' + nombre) === 'true';
        const isIndented = localStorage.getItem('config_indent_' + nombre) === 'true';

        const div = document.createElement('div');
        div.className = 'est-item';
        div.style.marginBottom = "15px";
        
        // --- AQUI ESTÁ LA MAGIA DEL DISEÑO EN UNA SOLA FILA ---
        div.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; width: 100%;">
                <span class="est-name" style="font-weight: bold; font-size: 0.9rem; flex-shrink: 0;">${nombre}:</span>
                <div class="est-controls" style="display: flex; gap: 6px; align-items: center; justify-content: flex-end; flex-grow: 1;">
                    <div id="${idBtn}" class="btn-color-rectangular" onclick="abrirPaletaColor('estructura_dinamica', '${nombre}')" style="margin-right: 4px;">
                        <span id="${idTxt}">${savedColor === 'DEFAULT' ? 'DEFAULT' : 'ACTIVO'}</span>
                    </div>
                    <button class="btn-p ${isBold ? 'activo' : ''}" onclick="alternarEstiloDinamico('${nombre}', 'bold', this)">B</button>
                    <button class="btn-p ${isItalic ? 'activo' : ''}" onclick="alternarEstiloDinamico('${nombre}', 'italic', this)">I</button>
                    <button class="btn-p ${isIndented ? 'activo' : ''}" onclick="alternarEstiloDinamico('${nombre}', 'indent', this)"><span class="material-icons">format_indent_increase</span></button>
                </div>
            </div>`;
        lista.appendChild(div);
        
        setTimeout(() => {
            const colorGuardado = localStorage.getItem('config_color_' + nombre) || 'DEFAULT';
            // Llamamos a la función unificada
            actualizarVisualBotonColor('estructura_dinamica', colorGuardado, nombre);
        }, 10);
    });
}
function confirmarRestaurarPredeterminados() {
    const lang = localStorage.getItem('config_idioma') || 'es'; // 🔥 TRADUCCIÓN EN VIVO

    // Llamamos a tu controlador maestro que ya maneja las animaciones y el escudo
    mostrarModalConfirmacion(
        lang === 'en' ? "⚠️ RESTORE SETTINGS?" : "⚠️ ¿RESTAURAR AJUSTES?",
        lang === 'en' 
            ? "All colors, sizes, and visual settings will return to factory defaults. Your songs and folders will NOT be deleted." 
            : "Todos los colores, tamaños y configuraciones visuales volverán a su estado de fábrica. Tus canciones y carpetas NO se borrarán.",
        lang === 'en' ? "YES, RESTORE" : "SÍ, RESTAURAR",
        "#ffb347", // Color naranja de advertencia
        () => {
            // 1. Recolectamos todas las configuraciones visuales, de hardware y colores
            let llavesParaBorrar = [];
            for (let i = 0; i < localStorage.length; i++) {
                let llave = localStorage.key(i);
                // Si empieza con "config_", es un ajuste de la app. Lo marcamos.
                if (llave && llave.startsWith('config_')) {
                    llavesParaBorrar.push(llave);
                }
            }

            // 2. Ejecutamos el borrado (Tus canciones y carpetas están a salvo)
            llavesParaBorrar.forEach(llave => localStorage.removeItem(llave));
            
            closeConfirm();

            // 3. Recargamos la aplicación para aplicar valores de fábrica
            window.location.reload();
        }
    );
}
function refrescarVisorActual() {
    const labelTono = document.getElementById('header-tone-label');
    let tonoActualIngles = "--";
    
    if (labelTono && labelTono.innerText !== "--") {
        tonoActualIngles = revertirAcordeA_Ingles(labelTono.innerText.trim());
        const nuevaNotaVisual = transformarAcordeEspecial(tonoActualIngles);
        labelTono.innerText = nuevaNotaVisual;
        
        const displayTonalidad = document.getElementById('display-tonalidad');
        if (displayTonalidad) displayTonalidad.innerText = nuevaNotaVisual;

        const modalVal = document.getElementById('modal-tone-value');
        if (modalVal) modalVal.innerText = nuevaNotaVisual;
    }

    const indicatorCapo = document.getElementById('capo-indicator');
    if (indicatorCapo && indicatorCapo.style.display !== "none") {
        const spanCapo = indicatorCapo.querySelector('span');
        if (spanCapo) {
            const notaCapoIngles = revertirAcordeA_Ingles(spanCapo.innerText);
            spanCapo.innerText = transformarAcordeEspecial(notaCapoIngles);
        }
    }

    // Búsqueda Nuclear Inmune a Espacios
    let tituloActual = document.querySelector('.main-title').innerText;
    const limpiezaNuclear = (texto) => texto ? texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase() : "";
    let tituloLimpio = limpiezaNuclear(tituloActual);
    
    let cancion = listaDeCanciones.find(c => limpiezaNuclear(c.title || c.titulo) === tituloLimpio);
    if (!cancion) cancion = listaDeCanciones.find(c => limpiezaNuclear(c.title || c.titulo).includes(tituloLimpio));
    
    if (cancion) {
        const visorDiv = document.querySelector('.lyrics-container');
        if (visorDiv && !cancion.isVisual) {
            
            let letraARenderizar = cancion.lyrics;
            const tonoOriginal = revertirAcordeA_Ingles(cancion.tone || "--");
            
            if (tonoOriginal !== "--" && tonoActualIngles !== "--" && tonoOriginal !== tonoActualIngles) {
                const matchOrig = tonoOriginal.match(/^([A-G][#b]?)/i);
                const matchAct = tonoActualIngles.match(/^([A-G][#b]?)/i);
                if (matchOrig && matchAct) {
                    const notaOrig = normalizeMap[matchOrig[1].toUpperCase()] || matchOrig[1].toUpperCase();
                    const notaAct = normalizeMap[matchAct[1].toUpperCase()] || matchAct[1].toUpperCase();
                    const idxOrig = notes.indexOf(notaOrig);
                    const idxAct = notes.indexOf(notaAct);
                    if (idxOrig !== -1 && idxAct !== -1) {
                        const diff = (idxAct - idxOrig + 120) % 12;
                        letraARenderizar = transponerTexto(letraARenderizar, diff);
                    }
                }
            }

            if (currentCapo > 0) {
                letraARenderizar = transponerTexto(letraARenderizar, -currentCapo);
            }

            if (modoCarruselActivo && cancionesEnCarrusel.length > 0) {
                const slide = document.querySelectorAll('.song-slide')[indiceCarruselActual];
                if (slide) slide.innerHTML = generarVistaConDiagramas(letraARenderizar, `pre-slide-${indiceCarruselActual}`);
            } else {
                visorDiv.innerHTML = `<div class="song-slide" style="width: 100vw !important; padding-left: 15px !important; padding-right: 15px !important; display: flex !important; align-items: flex-start !important; justify-content: flex-start !important;">${generarVistaConDiagramas(letraARenderizar)}</div>`;
            }
            
            aplicarModoDiseno();
        }
    }
    
    if (typeof actualizarMonitorVistaPrevia === 'function') {
        actualizarMonitorVistaPrevia();
    }
}
function actualizarMonitorVistaPrevia() {
    const previewBox = document.getElementById('live-preview-box');
    if (!previewBox) return;

    // 1. Búsqueda blindada (Nuclear) para no fallar si hay espacios o mayúsculas
    let tituloActual = document.querySelector('.main-title').innerText;
    const limpiezaNuclear = (texto) => texto ? texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase() : "";
    let tituloLimpio = limpiezaNuclear(tituloActual);
    
    let cancion = listaDeCanciones.find(c => limpiezaNuclear(c.title || c.titulo) === tituloLimpio);
    if (!cancion) cancion = listaDeCanciones.find(c => limpiezaNuclear(c.title || c.titulo).includes(tituloLimpio));

    let textoMuestra = "";

    if (cancion && !cancion.isVisual && cancion.lyrics) {
        textoMuestra = cancion.lyrics.trim();
    } else {
        textoMuestra = t('js_sample_lyrics'); 
    }

    // 2. 🛡️ FIX: Restauramos las clases "song-viewer" y "lyrics-container" 
    // para que el CSS sepa que debe aplicarle tu fuente Inter-Medium y tus estilos exactos.
    previewBox.innerHTML = `
        <div class="song-viewer" style="padding-top: 10px !important; width: 100%; background: transparent !important;">
            <div class="lyrics-container" style="padding-bottom: 10px !important; padding-top: 0 !important;">
                ${generarVistaConDiagramas(textoMuestra, 'pre-monitor')}
            </div>
        </div>
    `;
    
    // 3. Forzamos al monitor a ignorar columnas o alturas raras (Si usan Modo Páginas)
    const preInterno = previewBox.querySelector('pre');
    if (preInterno) {
        preInterno.style.setProperty('height', 'auto', 'important');
        preInterno.style.setProperty('column-count', 'auto', 'important');
        preInterno.style.setProperty('overflow', 'visible', 'important');
        preInterno.style.setProperty('font-family', 'var(--f-medium)', 'important'); // Seguro anti-fallos
    }
}
function cambiarModoDiseno(modo, refrescar = true) {
    document.body.classList.remove('modo-paginas', 'modo-columnas');
    
    if (modo === 'paginas') document.body.classList.add('modo-paginas');
    else if (modo === 'columnas') document.body.classList.add('modo-columnas');
    
    localStorage.setItem('config_modo_diseno', modo);
    
    if (typeof aplicarModoDiseno === 'function') aplicarModoDiseno();
    if (refrescar && typeof refrescarVisorActual === 'function') refrescarVisorActual();
}
function aplicarModoDiseno() {
    const modo = localStorage.getItem('config_modo_diseno') || 'normal';
    const pres = document.querySelectorAll('.lyrics-container pre, .song-slide pre');
    const wrapper = document.getElementById('carousel-wrapper');
    
    if (!pres.length) return;

    if (wrapper) {
        if (modo === 'normal') wrapper.style.setProperty('touch-action', 'auto', 'important');
        else wrapper.style.setProperty('touch-action', 'auto', 'important');
    }

    pres.forEach(pre => {
        // --- 1. MODO NORMAL ---
        pre.style.setProperty('column-width', 'auto', 'important');
        pre.style.setProperty('column-count', 'auto', 'important');
        pre.style.setProperty('height', 'auto', 'important');
        pre.style.setProperty('column-gap', 'normal', 'important');
        pre.style.setProperty('overflow-x', 'hidden', 'important');
        pre.style.setProperty('overflow-y', 'hidden', 'important');
        pre.style.setProperty('scroll-snap-type', 'none', 'important');
        pre.style.setProperty('padding-bottom', '0px', 'important');
        
        pre.style.setProperty('display', 'table', 'important'); 
        pre.style.setProperty('width', 'max-content', 'important');
        pre.style.setProperty('max-width', '95%', 'important');
        pre.style.setProperty('margin', '0 auto', 'important');
        pre.style.setProperty('align-self', 'center', 'important'); 

        if (modo === 'paginas') {
            // --- 2. MODO PÁGINAS ---
            pre.style.setProperty('display', 'block', 'important'); 
            pre.style.setProperty('width', '100%', 'important'); 
            pre.style.setProperty('max-width', '100%', 'important');
            pre.style.setProperty('margin', '0 auto', 'important');
            pre.style.setProperty('align-self', 'stretch', 'important'); 
            
            pre.style.setProperty('column-width', 'min(95vw, 380px)', 'important'); 
            pre.style.setProperty('column-gap', '20px', 'important'); 
            pre.style.setProperty('height', 'calc(100vh - 250px)', 'important'); 
            
            // 🔥 LA CLAVE PARA QUE SE LLENE DE ARRIBA A ABAJO 🔥
            pre.style.setProperty('column-fill', 'auto', 'important');
            
            pre.style.setProperty('overflow-x', 'auto', 'important');
            pre.style.setProperty('overflow-y', 'hidden', 'important');
            pre.style.setProperty('scroll-snap-type', 'x mandatory', 'important'); 
            pre.style.setProperty('padding-bottom', '20px', 'important');
            
        } else if (modo === 'ajustar') {
            // --- 3. MODO AJUSTAR ---
            pre.style.setProperty('display', 'block', 'important'); 
            pre.style.setProperty('width', '100%', 'important'); 
            pre.style.setProperty('max-width', '100%', 'important');
            pre.style.setProperty('margin', '0 auto', 'important');
            pre.style.setProperty('align-self', 'stretch', 'important'); 
            
            pre.style.setProperty('column-width', '320px', 'important'); 
            pre.style.setProperty('column-gap', '20px', 'important'); 
            pre.style.setProperty('height', 'calc(100vh - 180px)', 'important'); 
            
            // 🔥 LA CLAVE PARA QUE SE LLENE DE ARRIBA A ABAJO 🔥
            pre.style.setProperty('column-fill', 'auto', 'important');
            
            pre.style.setProperty('overflow-x', 'auto', 'important');
            pre.style.setProperty('overflow-y', 'hidden', 'important');
            pre.style.setProperty('scroll-snap-type', 'none', 'important');
            pre.style.setProperty('padding-bottom', '20px', 'important');
        }
    });
}

// 2. Función maestra que lee la memoria y enciende/apaga los elementos
function aplicarEstiloFlotante() {
    const estiloActual = localStorage.getItem('config_adv_float_style') || 'botones';

    const botonesTxt = document.querySelectorAll('.btn-velocidad-txt');
    const slider = document.getElementById('scrollSpeed');

    if (!slider || botonesTxt.length < 2) return; // Blindaje anti-errores

    if (estiloActual === 'barra') {
        // Apaga los botones y enciende el slider
        botonesTxt[0].style.display = 'none';
        botonesTxt[1].style.display = 'none';
        slider.style.display = 'block';
    } else {
        // Enciende los botones y apaga el slider (cap-btn usa flex)
        botonesTxt[0].style.display = 'flex';
        botonesTxt[1].style.display = 'flex';
        slider.style.display = 'none';
    }
}
function seleccionarEstilo(estilo) {
    localStorage.setItem('config_adv_float_style', estilo);
    
    // 🔥 TRADUCCIÓN APLICADA
    const labelUI = document.getElementById('estilo-active-name');
    if (labelUI) {
        labelUI.innerText = estilo === 'barra' ? t('style_bar') : t('style_buttons');
    }

    // Aplica el cambio visual a la cápsula de controles
    aplicarEstiloFlotante();
    
    // Cierra el menú
    const menu = document.getElementById('menu-estilo');
    if (menu) menu.classList.remove('active');
}
// ==========================================================================
// 🚀 8. Menús, Modales y Gestos UI
// ==========================================================================
function toggleSongsPanel() {
    const panel = document.getElementById('songs-panel');
    const searchInput = document.getElementById('song-search');
    const tabFolders = document.getElementById('tab-folders');

    if (!panel) return;
    const esPestañaCarpetas = tabFolders ? tabFolders.classList.contains('active') : false;

    if (panel.classList.contains('active')) {
        let hizoAlgo = false;

        if (modoSeleccion) {
            resetSeleccion(); 
            hizoAlgo = true;
        }

        if (typeof modoSeleccionCarpetasActivo !== 'undefined' && modoSeleccionCarpetasActivo) {
            modoSeleccionCarpetasActivo = false;
            carpetasSeleccionadas = [];
            const listContainer = document.getElementById('main-songs-list');
            if (listContainer) listContainer.classList.remove('modo-seleccion-carpetas');
            if (typeof actualizarEstadoMenuBulkCarpetas === 'function') actualizarEstadoMenuBulkCarpetas();
            showFoldersView(); 
            hizoAlgo = true;
        }

        if (searchInput && searchInput.value !== "") {
            searchInput.value = "";
            hizoAlgo = true;
        }

        const btnVolver = document.querySelector('#main-songs-list div[onclick="showFoldersView()"]');
        if (btnVolver && esPestañaCarpetas) {
            showFoldersView();
            hizoAlgo = true;
        }

        if (hizoAlgo) {
            if (!esPestañaCarpetas && searchInput && searchInput.value === "") {
                renderSongs(listaDeCanciones);
            }
            return; 
        }

        if (esPestañaCarpetas) {
            showSongsView();
            return;
        }

        panel.classList.remove('active');
        
    } else {
        panel.classList.add('active');
    }
}
function toggleBulkMenu(event) {      
    event.stopPropagation(); 
    const menu = document.getElementById('bulk-options-menu'); 
    const escudo = document.getElementById('escudo-cierre');

    if (menu) {
        menu.classList.toggle('active'); 

        if (menu.classList.contains('active')) {
            if (escudo) escudo.style.display = 'block';
        } else {
            if (escudo) escudo.style.display = 'none';
        }

        const tieneSeleccion = cancionesSeleccionadas.length > 0;
        const items = menu.querySelectorAll('.menu-item');

        items.forEach(item => {
            const onclickAttr = item.getAttribute('onclick') || "";
            const esAccionCritica = (
                onclickAttr.includes("'move'") || 
                onclickAttr.includes("'share'") || 
                onclickAttr.includes("'delete'")
            );

            if (esAccionCritica) {
                if (tieneSeleccion) {
                    item.classList.remove('disabled');
                } else {
                    item.classList.add('disabled');
                }
            }
        });
    }
}

function toggleSongMenu(event, index) {      
    event.stopPropagation();
    
    const menus = document.querySelectorAll('.options-menu, .bulk-menu-up');
    menus.forEach(m => {
        if (m.id !== `menu-${index}`) m.classList.remove('active');
    });

    const menu = document.getElementById(`menu-${index}`);

    cerrarTodoLoAbierto(); 

    if (menu) {
        const boton = event.currentTarget;
        const posicionBoton = boton.getBoundingClientRect();
        
        const espacioHaciaAbajo = window.innerHeight - posicionBoton.bottom;

        if (espacioHaciaAbajo < 350) {
            menu.classList.add('subir');
        } else {
            menu.classList.remove('subir');
        }

        menu.classList.add('active'); 
        // 🚨 Se eliminó la activación del escudo aquí para no bloquear los clics
    }
}
function toggleFolderBulkMenu(event) {
    event.stopPropagation();
    const menu = document.getElementById('folder-bulk-menu');
    const escudo = document.getElementById('escudo-cierre');
    
    const estabaAbierto = menu.classList.contains('active');
    cerrarTodoLoAbierto(); // Cierra cualquier otra cosa abierta

    if (menu && !estabaAbierto) {
        menu.classList.add('active');
        if (escudo) escudo.style.display = 'block';

        // Lógica de deshabilitado (gris) si no hay seleccionados
        const tieneSeleccion = carpetasSeleccionadas.length > 0;
        const items = menu.querySelectorAll('.menu-item');
        
        items.forEach(item => {
            const onclickAttr = item.getAttribute('onclick') || "";
            if (onclickAttr.includes("compartirCarpetas") || onclickAttr.includes("EliminarMasivo")) {
                if (tieneSeleccion) {
                    item.classList.remove('disabled');
                } else {
                    item.classList.add('disabled');
                }
            }
        });
    }
}
function toggleFolderMenu(event, index) {      
    event.stopPropagation();
    const menu = document.getElementById(`menu-folder-${index}`);
    
    const estabaAbierto = menu ? menu.classList.contains('active') : false;
    cerrarTodoLoAbierto(); 

    if (menu && !estabaAbierto) {
        const boton = event.currentTarget;
        const posicionBoton = boton.getBoundingClientRect();
        const espacioHaciaAbajo = window.innerHeight - posicionBoton.bottom;

        if (espacioHaciaAbajo < 250) {
            menu.classList.add('subir');
        } else {
            menu.classList.remove('subir');
        }

        menu.classList.add('active'); 
        // 🚨 Se eliminó la activación del escudo aquí para no bloquear los clics
    }
}   
function toggleSortMenu(event) {
    event.stopPropagation();
    const menu = document.getElementById('sort-options-menu');
    const escudo = document.getElementById('escudo-cierre');
    
    const estabaAbierto = menu.classList.contains('active');
    cerrarTodoLoAbierto(); // Cierra todo lo demás
    
    if (menu && !estabaAbierto) {
        menu.classList.add('active'); // Lo abre bonito con tu CSS
        if (escudo) escudo.style.display = 'block';
    }
}
function toggleImportMenu(event) {
    event.stopPropagation();
    const menu = document.getElementById('import-options-menu');
    const escudo = document.getElementById('escudo-cierre');
    
    const isActive = menu.classList.toggle('active');
    if (escudo) escudo.style.display = isActive ? 'block' : 'none';
}
function toggleEstiloMenu(event) {
    event.stopPropagation();
    cerrarTodoLoAbierto(); // Cierra otros menús si los hay
    const menu = document.getElementById('menu-estilo');
    if (menu) {
        menu.classList.toggle('active');
    }
}
function toggleDeviceMenu(event, type) {
    event.stopPropagation();
    
    const menu = document.getElementById(`menu-${type}`);
    if (!menu) return;

    const estabaAbierto = menu.classList.contains('active');
    
    // 1. AÑADIDO: 'pads-personalizado' ahora está en la lista para cerrarse automáticamente
    ['joystick', 'teclado', 'midi', 'pedal', 'sonido-bombo', 'reproductor-online', 'pads-sonido', 'sync-modo', 'afinador-tipo', 'pads-personalizado'].forEach(id => {
        const m = document.getElementById(`menu-${id}`);
        if (m) m.classList.remove('active');
    });
    
    // Si el que tocaste estaba cerrado, lo abrimos
    if (!estabaAbierto) {
        menu.classList.add('active');
        // 2. AÑADIDO: Excluimos 'pads-personalizado' para que la app no intente buscar un dispositivo físico
        if (type !== 'sonido-bombo' && type !== 'reproductor-online' && type !== 'pads-sonido' && type !== 'sync-modo' && type !== 'pads-personalizado' && typeof buscarDispositivos === 'function') {
            buscarDispositivos(type, true);
        }
    }
}
function abrirMenuTonoModal(event) {
    event.stopPropagation();
    cerrarTodoLoAbierto(); // Cierra otros menús por si acaso

    const menu = document.getElementById('menu-tono-modal');
    if (!menu) return;

    if (!menu.classList.contains('active')) {
        // La lista matemática pura en inglés
        const notasBase = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        let htmlOpciones = '';
        
        notasBase.forEach(nota => {
            // 🔥 TRADUCCIÓN EN VIVO: Transforma cada opción a Latino o Bemol según tu ajuste
            const notaTraducida = transformarAcordeEspecial(nota);
            
            htmlOpciones += `<div class="menu-item" style="justify-content: center; padding: 10px;" onclick="seleccionarTonoDesdeMenuNuevo('${nota}', event)">${notaTraducida}</div>`;
        });

        menu.innerHTML = htmlOpciones;
        menu.classList.add('active');
    } else {
        menu.classList.remove('active');
    }
}
function abrirModalAcciones(boton) {
    botonAccionActivo = boton;
    const modal = document.getElementById('modal-acciones');
    const container = document.getElementById('lista-acciones-container');
    
    container.innerHTML = ''; 
    
    listaAccionesApp.forEach(acc => {
        const div = document.createElement('div');
        div.style.cssText = `padding: 12px 20px; color: ${acc.bold ? '#fff' : '#bbb'}; font-family: ${acc.bold ? 'var(--f-bold)' : 'var(--f-medium)'}; font-size: 0.95rem; border-bottom: 1px solid #2a2a2a; cursor: pointer; transition: background 0.2s;`;
        
        // Extraer la traducción
        div.innerText = t(acc.key);
        
        div.onclick = () => {
            botonAccionActivo.innerText = t(acc.key);
            botonAccionActivo.dataset.accionReal = acc.id; // 🔥 EL SEGURO ANTI-FALLOS

            if (acc.bold) {
                botonAccionActivo.style.color = "#fff";
                botonAccionActivo.style.fontFamily = "var(--f-bold)";
            } else {
                botonAccionActivo.style.color = "#ccc";
                botonAccionActivo.style.fontFamily = "var(--f-bold)"; 
            }
            modal.style.display = 'none';
        };
        container.appendChild(div);
    });

    modal.style.display = 'flex';
}
function cerrarTodoLoAbierto() {      
    // 1. Matamos el escuchador del teclado de Bluetooth si estaba buscando (VERSIÓN SEGURA)
    if (typeof escuchadorTecladoGlobal !== 'undefined' && escuchadorTecladoGlobal !== null) {
        window.removeEventListener('keydown', escuchadorTecladoGlobal);
        escuchadorTecladoGlobal = null;
    }
    
    // 2. Cerramos todos los menús desplegables
    const todosLosMenus = document.querySelectorAll('.bulk-menu-up, .options-menu, #bulk-options-menu, #import-options-menu, #folder-bulk-menu, #sort-options-menu');
    
    todosLosMenus.forEach(m => {
        if (m) m.classList.remove('active');
    });

    // 3. Ocultamos la capa invisible (escudo) que atrapa los clics
    const escudo = document.getElementById('escudo-cierre');
    if (escudo) escudo.style.display = 'none';
}
function closeFromOverlay() {        
    // Ya no preguntamos por isPinned porque lo eliminaste
    if (bloqueoGhostClick) return; 
    
    const panel = document.getElementById('songs-panel');
    if (panel) {
        panel.classList.remove('active');
        resetSeleccion(); // Limpia marcas de canciones seleccionadas
    }
}
function manejadorCierreGlobal(e) {
    const objetivo = e.target;

    // 1. EL ESCUDO ATRAPAMOSCAS
    if (objetivo.id === 'escudo-cierre') {
        e.preventDefault();
        e.stopPropagation();
        if (typeof cerrarTodoLoAbierto === 'function') cerrarTodoLoAbierto();
        return; 
    }

	// 2. CIERRE DE MODALES AL TOCAR EL FONDO OSCURO
    if (objetivo.classList.contains('modal-overlay')) {
        e.preventDefault(); 
        e.stopPropagation();
        
        const idModal = objetivo.id;
        if (idModal === 'confirm-modal') {
            if (typeof closeConfirm === 'function') closeConfirm(); 
        } else if (idModal === 'move-modal') {
            if (typeof closeMoveModal === 'function') closeMoveModal();
        } else {
            // 🔥 SOLUCIÓN UNIVERSAL: Cierra de forma segura CUALQUIER modal que toques
            objetivo.classList.remove('active');
            setTimeout(() => {
                if (!objetivo.classList.contains('active')) {
                    objetivo.style.display = 'none';
                }
            }, 300);
        }
        
        const escudo = document.getElementById('escudo-cierre');
        if (escudo) escudo.style.display = 'none';
        return;
    }

    // 3. SEGURIDAD DE ATAJOS
    if (typeof botonAtajoActivo !== 'undefined' && botonAtajoActivo && !objetivo.closest('.dev-btn')) {
        botonAtajoActivo.innerText = botonAtajoActivo.dataset.textoViejo || "Asigne el Atajo";
        botonAtajoActivo.style.color = "#999";
        botonAtajoActivo.style.borderColor = "#333";
        botonAtajoActivo.style.background = "#111";
        if (typeof cancelarEscuchas === 'function') cancelarEscuchas();
    }

    // 4. CIERRE DEL RAYITO
    const modalRayito = document.getElementById('quick-modal');
    if (modalRayito && modalRayito.classList.contains('active')) {
        if (!objetivo.closest('.quick-panel') && !objetivo.closest('#btn-rayo')) {
            e.preventDefault(); 
            e.stopPropagation();
            if (typeof cerrarQuickAccess === 'function') cerrarQuickAccess();
            return;
        }
    }

    // 5. CIERRE DE MENÚS (Dispositivos, Ajustes, 3 puntos)
    if (!objetivo.closest('.dev-select') && !objetivo.closest('.options-menu') && !objetivo.closest('.bulk-menu-up')) {
        
        let seCerroAlgo = false;

        // Cierra los menús desplegables de selección (Le quitamos la regla agresiva)
        ['estilo', 'joystick', 'teclado', 'midi', 'pedal', 'sonido-bombo', 'reproductor-online', 'pads-sonido', 'sync-modo', 'afinador-tipo', 'pads-personalizado'].forEach(id => {
            const menu = document.getElementById(`menu-${id}`);
            if (menu && menu.classList.contains('active')) {
                menu.classList.remove('active');
                seCerroAlgo = true;
            }
        });
        
        // Cierra los menús de 3 puntos
        if (!objetivo.closest('.menu-icon-large') && !objetivo.closest('.dots-btn')) {
             const menusOpciones = document.querySelectorAll('.options-menu.active, .bulk-menu-up.active, #sort-options-menu.active');
             if (menusOpciones.length > 0) {
                 if (typeof cerrarTodoLoAbierto === 'function') cerrarTodoLoAbierto();
                 seCerroAlgo = true;
             }
        }

        if (seCerroAlgo) {
            e.preventDefault();
            e.stopPropagation();
        }
    }
}
function abrirModalDinamico(titulo, esInput, callback) {
    const modal = document.getElementById('modal-dinamico');
    const inputCont = document.getElementById('md-input-container');
    const msgCont = document.getElementById('md-mensaje');
    const inputField = document.getElementById('md-input');
    const btnConfirmar = document.getElementById('md-btn-confirmar');

    document.getElementById('md-titulo').innerText = titulo;
    inputField.value = ""; 

    if (esInput) {
        inputCont.style.display = "block";
        msgCont.style.display = "none";
        setTimeout(() => inputField.focus(), 300); 
    } else {
        inputCont.style.display = "none";
        msgCont.style.display = "block";
    }

    // EL DESTRABE DEFINITIVO
    modal.style.display = "flex"; 
    modal.classList.add('active');

    btnConfirmar.onclick = null; 
    btnConfirmar.onclick = function() {
        const valor = inputField.value.trim();
        if (esInput && valor === "") return; 
        
        callback(valor);
        cerrarModalDinamico();
    };
}
function cerrarModalDinamico() {
    const modal = document.getElementById('modal-dinamico');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none'; 
        
        // Escudo anti-clic fantasma para la creación de carpetas
        bloqueoGhostClick = true;
        setTimeout(() => bloqueoGhostClick = false, 400);
    }
}
function mostrarModalConfirmacion(titulo, mensaje, textoBoton, colorBoton, callbackAccion) {
    // Esto solo cierra los menús de 3 puntitos para limpiar la pantalla
    cerrarTodoLoAbierto(); 
    
    const modal = document.getElementById('confirm-modal');
    const tituloModal = document.getElementById('confirm-title');
    const mensajeModal = document.getElementById('confirm-message');
    const btnConfirmar = document.getElementById('btn-confirm-delete');

    if (modal && tituloModal && mensajeModal && btnConfirmar) {
        tituloModal.innerText = titulo;
        tituloModal.style.color = colorBoton || "var(--accent-color)";
        mensajeModal.innerText = mensaje;
        btnConfirmar.innerText = textoBoton || "SÍ, ELIMINAR";
        
        btnConfirmar.style.backgroundColor = colorBoton || "var(--accent-color)";
        btnConfirmar.style.color = colorBoton === "#ffb347" ? "#000" : "var(--bg-black, #000)";

        modal.style.setProperty('display', 'flex', 'important');
        modal.style.visibility = 'visible';
        modal.classList.add('active');

        // 👇 EL BLINDAJE CONTRA CLICS FANTASMAS 👇
        btnConfirmar.onclick = function(e) {
            e.stopPropagation(); // Obliga al clic a morir aquí y no cerrar tus paneles
            callbackAccion();
        };
    }
}
function closeConfirm() {
    const modal = document.getElementById('confirm-modal');
    if (modal) {
        modal.classList.remove('active');
        
        // Oculta la ventana de forma segura después de la animación
        setTimeout(() => {
            modal.style.setProperty('display', 'none', 'important');
            modal.style.visibility = 'hidden';
        }, 300);

        // 👇 EL ESCUDO MÁGICO CONTRA CLICS FANTASMAS 👇
        // Activa el bloqueo por 400ms para que el panel ignore el toque residual de tu dedo
        if (typeof bloqueoGhostClick !== 'undefined') {
            bloqueoGhostClick = true;
            setTimeout(() => bloqueoGhostClick = false, 400);
        }
    }
}
function actualizarPosicionCarrusel(conAnimacion = true) {
    const riel = document.getElementById('carousel-rail');
    if (!riel) return;
    const despliegue = indiceCarruselActual * 100;
    riel.style.transition = conAnimacion ? "transform 0.3s ease-out" : "none";
    riel.style.transform = `translateX(-${despliegue}vw)`;
}

function actualizarInfoCancionActual() {
    const song = cancionesEnCarrusel[indiceCarruselActual];
    if (!song) return;

    document.getElementById('header-song-title').innerText = song.title;
    document.querySelector('.main-title').innerText = song.title;
    document.querySelector('.author-name').innerText = song.artist;
    document.getElementById('header-tone-label').innerText = song.tone || "--";
    
    currentCapo = 0;
    if (document.getElementById('capo-value')) document.getElementById('capo-value').innerText = "0";
}
function manejarSwipe() {
    // Si el carrusel está apagado, prohibido cambiar de canción
    if (!modoCarruselActivo) return;

    // BLOQUEO DE PROTECCIÓN: Si estamos en modo Páginas o Columnas
    const modo = localStorage.getItem('config_modo_diseno') || 'normal';
    if (modo !== 'normal') return; 

    // 🔥 EL NUEVO CANDADO MAESTRO: Si el Autoplay/Scroll está activo, prohibido deslizar
    if (typeof isScrolling !== 'undefined' && isScrolling) {
        return; // Muere aquí, obliga al usuario a pausar primero
    }

    const umbral = 50; 
    const distanciaY = Math.abs(touchStartY - touchEndY);
    if (distanciaY > 60) return;
    
    if (touchStartX - touchEndX > umbral) {
        // Swipe Izquierda (Siguiente Canción)
        if (indiceCarruselActual < cancionesEnCarrusel.length - 1) {
            indiceCarruselActual++;
            ultimoEncabezadoAnunciado = null; // Reseteamos la voz para la nueva canción
            actualizarPosicionCarrusel();
            actualizarInfoCancionActual();
            renderizarSiEsPDF(indiceCarruselActual);
            window.scrollTo(0, 0); 
        }
    }
    if (touchEndX - touchStartX > umbral) {
        // Swipe Derecha (Canción Anterior)
        if (indiceCarruselActual > 0) {
            indiceCarruselActual--;
            ultimoEncabezadoAnunciado = null; // Reseteamos la voz
            actualizarPosicionCarrusel();
            actualizarInfoCancionActual();
            renderizarSiEsPDF(indiceCarruselActual);
            window.scrollTo(0, 0); 
        }
    }
}
function habilitarSwipePanel() {
    const overlay = document.getElementById('songs-panel');
    const panel = document.querySelector('#songs-panel .panel-content');
    if (!overlay || !panel) return;

    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let panelWidth = 0;
    let wasOpen = false;
    const edgeSize = 35; // Área táctil en el borde izquierdo (px)

    document.addEventListener('touchstart', (e) => {
        // 🔥 EL ESCUDO TOTAL: Ignora el arrastre si tocas el reproductor o la barra superior
        if (e.target.closest('#floating-player') || e.target.closest('.top-bar')) return;

        // Ignorar si hay múltiples dedos
        if (e.touches.length > 1) return;
        
        startX = e.touches[0].clientX;
        currentX = startX;
        // ... (el resto del código sigue igual)
        wasOpen = overlay.classList.contains('active');

        // Si está cerrado, solo permitir arrastre desde el borde izquierdo (como en iOS)
        if (!wasOpen && startX > edgeSize) return;

        // Si está abierto y tocó el fondo transparente, dejamos que tu 'onclick' nativo lo cierre
        if (wasOpen && startX > panel.offsetWidth) return; 

        isDragging = true;
        panelWidth = panel.offsetWidth;
        
        // Apagamos animaciones CSS para que el panel siga el dedo sin lag
        panel.style.transition = 'none';
        overlay.style.transition = 'none';
        
        // Forzamos la aparición del overlay para que se vea la sombra al jalar
        if (!wasOpen) {
            overlay.style.left = '0';
            overlay.style.background = 'rgba(0,0,0,0)';
        }
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;

        currentX = e.touches[0].clientX;
        let dx = currentX - startX;
        let translateX = 0;
        
        if (wasOpen) {
            translateX = Math.min(0, dx); // Solo permite mover hacia la izquierda para cerrar
        } else {
            translateX = Math.min(0, -panelWidth + dx); // Jala desde afuera hacia la derecha
        }

        // Evita que el panel se "rompa" si jalas de más
        translateX = Math.max(-panelWidth, translateX);

        // Calcula la opacidad de la sombra negra dinámicamente
        let porcentajeVisible = 1 - (Math.abs(translateX) / panelWidth);
        overlay.style.background = `rgba(0,0,0,${0.6 * porcentajeVisible})`;
        panel.style.transform = `translateX(${translateX}px)`;
    }, { passive: true });

    document.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;

        // Devolvemos el control visual al CSS
        panel.style.transition = '';
        overlay.style.transition = '';
        panel.style.transform = '';
        overlay.style.background = '';
        overlay.style.left = '';

        let distanciaMovida = currentX - startX;
        
        // Si jaló más del 20% del ancho del panel, dispara tu función nativa
        if (wasOpen && distanciaMovida < -(panelWidth * 0.20)) {
            toggleSongsPanel(); // Cierra y limpia memoria
        } else if (!wasOpen && distanciaMovida > (panelWidth * 0.20)) {
            toggleSongsPanel(); // Abre normal
        }
    });
}
function habilitarZoomTactil() {
    let distanciaInicialPellizco = null;
    let zoomInicialAlPellizcar = 1.0;
    const contenedorVisor = document.getElementById('carousel-wrapper');

    if (!contenedorVisor) return;

    contenedorVisor.addEventListener('touchstart', function(e) {
        if (e.touches.length === 2) {
            distanciaInicialPellizco = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
            zoomInicialAlPellizcar = currentZoom;
        }
    }, { passive: false });

    contenedorVisor.addEventListener('touchmove', function(e) {
        if (e.touches.length === 2 && distanciaInicialPellizco) {
            e.preventDefault(); 
            let distanciaActual = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
            let escala = distanciaActual / distanciaInicialPellizco;
            let nuevoZoom = zoomInicialAlPellizcar * escala;
            
            if (nuevoZoom < 0.5) nuevoZoom = 0.5;
            if (nuevoZoom > 3.0) nuevoZoom = 3.0;

            currentZoom = nuevoZoom;
            document.documentElement.style.setProperty('--zoom-level', currentZoom);

            const hojasPDF = document.querySelectorAll('.visor-pdf-container canvas');
            hojasPDF.forEach(canvas => { canvas.style.width = (currentZoom * 100) + "%"; });

            const img = document.getElementById('img-visual-directa');
            if (img) img.style.width = (currentZoom * 100) + "%";
        }
    }, { passive: false });

    contenedorVisor.addEventListener('touchend', function(e) {
        if (e.touches.length < 2) {
            distanciaInicialPellizco = null; 
        }
    });
}
// ==========================================================================
// 9. ⏬ EL DISPARO MAESTRO Y REANUDACIÓN INTELIGENTE
// ==========================================================================
function toggleScroll() {
    isScrolling = !isScrolling;
    const btn = document.getElementById('scrollBtn');
    const icon = document.getElementById('scrollIcon');
    
    // 🔥 FIX 1: Detener el motor de animación correctamente (evita que se trabe)
    if (scrollTimeout) {
        cancelAnimationFrame(scrollTimeout); 
        scrollTimeout = null;
    }

    if (isScrolling) {
        btn.classList.add('activo-scroll'); 
        icon.innerText = '||'; 
        icon.style.fontWeight = '900'; 
        icon.style.letterSpacing = '1px';

        if (autoplayActivo) {
            ultimoEncabezadoAnunciado = null;

            // Verificamos si estamos al tope de la canción
            let estamosAlInicio = (window.scrollY <= 15);

            if (estamosAlInicio) {
                iniciarConteoYArrancar(); 
            } else {
                if (!metroActivo) toggleMetronomo(); 
                arrancarScrollNativo();
            }
        } else {
            // MODO NORMAL (Clásico)
            arrancarScrollNativo();
        }
    } else {
        // PAUSA
        btn.classList.remove('activo-scroll');
        icon.innerText = '▲'; 
        icon.style.fontWeight = 'normal';
        icon.style.letterSpacing = 'normal';
        
        // SI PAUSAS DURANTE EL CONTEO INICIAL:
        if (countInActivo) {
            countInActivo = false; // Cancela el ciclo de conteo
            if (typeof reproductorVozGuia !== 'undefined') reproductorVozGuia.pause(); 
        }
        
        if (autoplayActivo && metroActivo) toggleMetronomo();
    }
}
function cambiarVelocidad(cambio) {
    const slider = document.getElementById('scrollSpeed');
    if (!slider) return;
    
    // Calculamos el nuevo valor con decimales
    let nuevoValor = parseFloat(slider.value) + cambio;
    
    // Evitamos que pase del mínimo (0.1) o del máximo (3.0)
    if (nuevoValor < parseFloat(slider.min)) nuevoValor = parseFloat(slider.min);
    if (nuevoValor > parseFloat(slider.max)) nuevoValor = parseFloat(slider.max);
    
    // Actualizamos el slider oculto redondeando a 1 decimal
    slider.value = nuevoValor.toFixed(1); 
    
    // Le avisamos a tu código existente que el valor cambió
    slider.dispatchEvent(new Event('input'));
    slider.dispatchEvent(new Event('change'));
    const modalVelDisplay = document.getElementById('modal-vel-letra-val');
    if (modalVelDisplay) {
        modalVelDisplay.value = Math.round(nuevoValor * 10);
    }
}
function actualizarVelocidadDesdeModal(valor) {
    let entero = parseInt(valor);
    if (isNaN(entero) || entero < 1) entero = 1;
    if (entero > 50) entero = 50; // El límite máximo de 50
    
    // Auto-corrige visualmente si pusiste letras
    document.getElementById('modal-vel-letra-val').value = entero; 
    
    // Le manda los decimales a tu motor oculto de AutoScroll
    const slider = document.getElementById('scrollSpeed');
    if (slider) {
        slider.value = (entero / 10).toFixed(1);
        slider.dispatchEvent(new Event('input'));
        slider.dispatchEvent(new Event('change'));
    }
}
function calcularDelayBase() {
    const isAuto = localStorage.getItem('config_scroll_auto') !== 'false';
    let velManual = parseFloat(document.getElementById('scrollSpeed').value);
    let delayManual = 100 / (velManual > 0 ? velManual : 1);

    if (!isAuto) return delayManual;

    const tituloActual = document.querySelector('.main-title').innerText;
    const cancion = listaDeCanciones.find(c => c.title === tituloActual);
    
    let duracionSegundos = cancion ? obtenerSegundos(cancion.duracion) : 0;
    
    if (duracionSegundos <= 0) return delayManual;

    const alturaReal = document.documentElement.scrollHeight - window.innerHeight;
    
    let alturaExtra = 0;
    document.querySelectorAll('[data-mult]').forEach(bloque => {
        let m = parseFloat(bloque.getAttribute('data-mult'));
        if (!isNaN(m) && m > 1) {
            alturaExtra += bloque.offsetHeight * (m - 1);
        }
    });

    const alturaVirtualTotal = alturaReal + alturaExtra;
    const pixelesPorSegundo = alturaVirtualTotal / duracionSegundos;
    
    return 1000 / pixelesPorSegundo;
}
function obtenerMultiplicadorCentral() {
    const centroX = window.innerWidth / 2;
    // 🎯 FIX: Alineamos el cálculo de velocidad exactamente al láser visual (25%)
    const centroY = window.innerHeight * 0.25 + 10; 
    const elementoCentral = document.elementFromPoint(centroX, centroY);

    if (!elementoCentral) return 1;

    const bloque = elementoCentral.closest('[data-mult]');
    if (bloque) {
        let m = parseFloat(bloque.getAttribute('data-mult'));
        return isNaN(m) || m < 1 ? 1 : m;
    }

    return 1;
}

function obtenerSegundos(strDuracion) {
    if (!strDuracion) return 0;
    let partes = strDuracion.split(':');
    if (partes.length === 2) {
        return (parseInt(partes[0]) * 60) + parseInt(partes[1]);
    }
    return 0;
}
function zoom(val) {
    let nuevoZoom = currentZoom + val;
    if (nuevoZoom >= 0.5 && nuevoZoom <= 3.0) {
        currentZoom = nuevoZoom;
        document.documentElement.style.setProperty('--zoom-level', currentZoom);

        const hojasPDF = document.querySelectorAll('.visor-pdf-container canvas');
        hojasPDF.forEach(canvas => {
            canvas.style.width = (currentZoom * 100) + "%";
        });

        const img = document.getElementById('img-visual-directa');
        if (img) {
            img.style.width = (currentZoom * 100) + "%";
        }
    }
}

function resetZoom() {
    currentZoom = 1.0;
    document.documentElement.style.setProperty('--zoom-level', 1);

    const pdfCanvases = document.querySelectorAll('.visor-pdf-container canvas');
    const pdfCont = document.querySelector('.visor-pdf-container');
    if (pdfCanvases.length > 0) {
        pdfCanvases.forEach(canvas => { canvas.style.width = "100%"; });
        if (pdfCont) { pdfCont.scrollTop = 0; pdfCont.scrollLeft = 0; }
    }

    const img = document.getElementById('img-visual-directa');
    const imgCont = document.querySelector('.visor-imagen-container');
    if (img) {
        img.style.width = "100%";
        if (imgCont) { imgCont.scrollTop = 0; imgCont.scrollLeft = 0; }
    }
}
// ==========================================================================
// 🎸 10. Afinador Digital
// ==========================================================================
function cambiarInstrumentoAfinador(inst) {
    tunerInstrumentoActual = inst;
    
    document.getElementById('btn-tun-guitarra').classList.toggle('active', inst === 'guitarra');
    document.getElementById('btn-tun-bajo').classList.toggle('active', inst === 'bajo');

    if (analyser) {
        analyser.fftSize = TUNER_CONFIG[inst].fft;
    }
}
async function iniciarMic() {
    const lang = localStorage.getItem('config_idioma') || 'es'; // 🔥 TRADUCCIÓN

    // 🚨 1. Verificación de Seguridad (HTTPS)
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert(lang === 'en' 
            ? "Your browser blocked the microphone. If testing on a local network, ensure you use HTTPS or localhost." 
            : "Tu navegador bloqueó el micrófono. Si estás en el celular probando en red local, asegúrate de usar HTTPS o localhost.");
        return;
    }

    try {
        // Como la consola maestra ya existe, solo creamos los cables si no existen
        if (!analyser) { 
            analyser = audioCtxTuner.createAnalyser();
            analyser.fftSize = TUNER_CONFIG[tunerInstrumentoActual].fft; 

            // Creamos el Escudo Anti-Armónicos
            lowpassFilter = audioCtxTuner.createBiquadFilter();
            lowpassFilter.type = "lowpass";
            lowpassFilter.Q.value = 0.5;
            lowpassFilter.connect(analyser);
        }

        // 🚨 2. Despertar el motor de audio (Vital para que el iPhone no se quede mudo)
        if (audioCtxTuner.state === 'suspended') {
            await audioCtxTuner.resume();
        }

        let audioConstraints = {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false
        };

        try {
            // Plan A: Pedimos el audio con calidad de estudio
            streamMic = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints });
        } catch (e) {
            // 🚨 Plan B: Si el celular entra en pánico por los filtros, pedimos el audio normal
            console.warn(lang === 'en' ? "Phone rejected studio audio. Trying standard mode..." : "El celular rechazó el audio de estudio. Intentando modo estándar...", e);
            streamMic = await navigator.mediaDevices.getUserMedia({ audio: true });
        }
        
        const source = audioCtxTuner.createMediaStreamSource(streamMic);
        
        // CONEXIÓN: Micrófono -> Filtro -> Analizador
        source.connect(lowpassFilter);
        lowpassFilter.frequency.value = TUNER_CONFIG[tunerInstrumentoActual].maxFreq;
        cacheAfinadorUI.hz = document.getElementById('tuner-hz');
        cacheAfinadorUI.center = document.getElementById('note-center');
        cacheAfinadorUI.left1 = document.getElementById('note-left-1');
        cacheAfinadorUI.right1 = document.getElementById('note-right-1');
        cacheAfinadorUI.needle = document.getElementById('tuner-needle');
        tunerActive = true;
        updateTuner(); 

    } catch (err) {
        // Ahora si falla, te dirá EXACTAMENTE por qué en pantalla
        alert((lang === 'en' ? "Microphone Error: " : "Error de Micrófono: ") + err.message);
        console.error(err);
    }
}

function cerrarAfinador() {
    document.getElementById('modal-afinador').classList.remove('active');
    tunerActive = false;
    
    if (tunerAnimationId) {
        cancelAnimationFrame(tunerAnimationId);
        tunerAnimationId = null;
    }

    if (streamMic) streamMic.getTracks().forEach(track => track.stop());
    if (audioCtxTuner && audioCtxTuner.state === 'running') audioCtxTuner.suspend();
}

// 3. EL ALGORITMO YIN (Matemática pura y perfecta)
function autoCorrelateFast(buf, sampleRate, config) {
    let SIZE = buf.length;
    
    // Filtro de ruido
    let rms = 0;
    for (let i = 0; i < SIZE; i++) {
        rms += buf[i] * buf[i];
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < TUNER_CONFIG.noiseGate) return -1;

    let MAX_LAG = Math.floor(sampleRate / config.minFreq);
    if (MAX_LAG > Math.floor(SIZE / 2)) MAX_LAG = Math.floor(SIZE / 2);

    // 🔥 LA MAGIA DE LA PRECISIÓN: Ventana de suma constante
    // Esto garantiza que la matemática lea la onda completa sin márgenes de error.
    let windowSize = SIZE - MAX_LAG; 
    let yinBuffer = new Float32Array(MAX_LAG);
    
    for (let t = 0; t < MAX_LAG; t++) {
        let sum = 0;
        for (let i = 0; i < windowSize; i++) {
            let delta = buf[i] - buf[i + t];
            sum += delta * delta;
        }
        yinBuffer[t] = sum;
    }

    yinBuffer[0] = 1;
    let runningSum = 0;
    for (let t = 1; t < MAX_LAG; t++) {
        runningSum += yinBuffer[t];
        yinBuffer[t] *= t / runningSum;
    }

    // Aumentamos el umbral a 0.20 para que atrape las notas más rápido
    let probabilityThreshold = 0.20; 
    let tau = -1;
    for (let t = 1; t < MAX_LAG; t++) {
        if (yinBuffer[t] < probabilityThreshold) {
            while (t + 1 < MAX_LAG && yinBuffer[t + 1] < yinBuffer[t]) {
                t++;
            }
            tau = t;
            break;
        }
    }

    if (tau === -1) return -1;

    // 🔥 INTERPOLACIÓN PARABÓLICA (La que da la precisión de decimales exacta)
    let betterTau;
    let x0 = tau < 1 ? tau : tau - 1;
    let x2 = tau + 1 < MAX_LAG ? tau + 1 : tau;
    
    if (x0 === tau || x2 === tau) {
        betterTau = tau;
    } else {
        let s0 = yinBuffer[x0];
        let s1 = yinBuffer[tau];
        let s2 = yinBuffer[x2];
        
        let denominador = s0 - 2 * s1 + s2;
        let shift = (denominador === 0) ? 0 : 0.5 * (s0 - s2) / denominador;
        betterTau = tau + shift;
    }

    return sampleRate / betterTau;
}

function notaDesdeFrecuencia(frecuencia) {
    return Math.round(12 * Math.log2(frecuencia / calibracionHz)) + 69;
}
function frecuenciaDesdeNota(nota) {
    return calibracionHz * Math.pow(2, (nota - 69) / 12);
}
function centsDesdeFrecuencia(frecuencia, targetFreq) {
    return 1200 * Math.log2(frecuencia / targetFreq);
}

// 4. EL CEREBRO VISUAL
function updateTuner() {
    if (!tunerActive || !analyser) return;
	console.log("¡El afinador está calculando a 60 FPS!");
    let bufferLength = analyser.fftSize;
    let buffer = new Float32Array(bufferLength);
    analyser.getFloatTimeDomainData(buffer); 

    const config = TUNER_CONFIG[tunerInstrumentoActual];
    let acFrecuencia = autoCorrelateFast(buffer, audioCtxTuner.sampleRate, config);

    if (acFrecuencia !== -1 && acFrecuencia >= config.minFreq && acFrecuencia <= config.maxFreq) {
        
        // Sistema de Anclaje para ignorar los brincos raros
        if (noteLockedFreq === 0) {
            noteLockedFreq = acFrecuencia; 
        } else {
            let diferenciaPorcentaje = Math.abs(acFrecuencia - noteLockedFreq) / noteLockedFreq;
            
            if (diferenciaPorcentaje > TUNER_CONFIG.lockMargin) {
                wildJumpCounter++;
                if (wildJumpCounter < TUNER_CONFIG.lockFrames) {
                    acFrecuencia = noteLockedFreq; 
                } else {
                    noteLockedFreq = acFrecuencia;
                    wildJumpCounter = 0;
                }
            } else {
                noteLockedFreq = acFrecuencia;
                wildJumpCounter = 0;
            }
        }

        smoothedPitch = smoothedPitch === 0 ? acFrecuencia : (smoothedPitch * TUNER_CONFIG.smoothing) + (acFrecuencia * (1 - TUNER_CONFIG.smoothing));
        
        let notaDetectada = notaDesdeFrecuencia(smoothedPitch);
        let nombreNota = notes[notaDetectada % 12];
        let octava = Math.floor(notaDetectada / 12) - 1;

        let freqEstandar = frecuenciaDesdeNota(notaDetectada);
        let cents = centsDesdeFrecuencia(smoothedPitch, freqEstandar);

        // Usamos nuestras cajas guardadas en la caché
        if (cacheAfinadorUI.hz) cacheAfinadorUI.hz.innerText = smoothedPitch.toFixed(1) + " Hz";
        if (cacheAfinadorUI.center) cacheAfinadorUI.center.innerText = nombreNota + octava;
        if (cacheAfinadorUI.left1) cacheAfinadorUI.left1.innerText = notes[(notaDetectada - 1 + 120) % 12];
        if (cacheAfinadorUI.right1) cacheAfinadorUI.right1.innerText = notes[(notaDetectada + 1) % 12];

        targetNeedleRotation = Math.max(-50, Math.min(50, cents));
        
        if (Math.abs(cents) <= TUNER_CONFIG.tolerance) {
            if (cacheAfinadorUI.needle) cacheAfinadorUI.needle.style.background = 'var(--accent-color)';
            if (cacheAfinadorUI.center) cacheAfinadorUI.center.style.color = 'var(--accent-color)';
        } else {
            if (cacheAfinadorUI.needle) cacheAfinadorUI.needle.style.background = '#ff4444'; 
            if (cacheAfinadorUI.center) cacheAfinadorUI.center.style.color = '#fff';
        }
        
    } else {
        // 🔥 TRADUCCIÓN: "Esperando..."
        if (cacheAfinadorUI.hz && cacheAfinadorUI.hz.innerText !== t('js_waiting')) {
            cacheAfinadorUI.hz.innerText = t('js_waiting');
            if (cacheAfinadorUI.center) cacheAfinadorUI.center.style.color = '#444';
            if (cacheAfinadorUI.needle) cacheAfinadorUI.needle.style.background = '#555';
        }

        smoothedPitch = 0; 
        targetNeedleRotation = 0;
        noteLockedFreq = 0; 
        wildJumpCounter = 0;
    }

    currentNeedleRotation += (targetNeedleRotation - currentNeedleRotation) * 0.15;
    let aguja = cacheAfinadorUI.needle;
    if (aguja) aguja.style.transform = `translateX(-50%) rotate(${currentNeedleRotation}deg)`;

    tunerAnimationId = requestAnimationFrame(updateTuner);
}
// ==========================================================================
// ⏱️ 11. Metrónomo
// ==========================================================================
async function toggleMetronomo() {
    // 1. Si no existe el motor, lo creamos
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // 🔥 EL DESPERTADOR: Obligamos al navegador a quitar el bloqueo de silencio
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    metroActivo = !metroActivo;
    const btn = document.getElementById('metroBtn');
    const icon = document.getElementById('metroIcon');
    
    if (timerMetro) {
        clearTimeout(timerMetro); 
        timerMetro = null;
    }

    if (metroActivo) {
        btn.classList.add('activo-red'); 
        
        // 🔥 EL FIX: Esperamos a que el archivo WAV cargue ANTES de arrancar el motor
        if (!bufferClick) {
            await cargarSonidosMetronomo();
        }
        
        iniciarMotorMetro();
    } else {
        btn.classList.remove('activo-red');
        if (icon) {
            icon.classList.remove('metro-luz-activa');
            icon.style.opacity = "0.8"; 
        }
        conteoActual = 0; 
		if (audioCtx && audioCtx.state === 'running') audioCtx.suspend();
    }
}

function iniciarMotorMetro() {
    cargarSonidosMetronomo();
    // Sincronizamos el tiempo inicial con la tarjeta de sonido (le damos 50ms de ventaja)
    tiempoProximoGolpe = MasterAudio.currentTime + 0.05;
    planificarGolpes();
}

function planificarGolpes() {
    if (!metroActivo) return;

    // Mientras el próximo golpe esté a menos de 100ms en el futuro, lo programamos
    while (tiempoProximoGolpe < MasterAudio.currentTime + 0.1) {
        darGolpePreciso(tiempoProximoGolpe);
        avanzarProximoGolpe();
    }
    
    // Revisamos de nuevo muy rápido (cada 25ms) para ver si ya toca programar el siguiente
    timerMetro = setTimeout(planificarGolpes, 25);
}

function avanzarProximoGolpe() {
    const bpmInput = document.getElementById('bpm-input');
    let bpm = parseInt(bpmInput.value) || 85;
    if (bpm < 10) bpm = 60;
    
    // Calculamos cuánto dura un golpe en SEGUNDOS (no en milisegundos)
    const segundosPorGolpe = (60.0 / bpm) / subdivisionMetro;
    tiempoProximoGolpe += segundosPorGolpe;
    conteoActual++;
}

function darGolpePreciso(tiempoExacto) {
    const chkEnfasis = document.getElementById('metro-enfasis');
    const enfasisActivado = chkEnfasis ? chkEnfasis.checked : true;
    
    const ticksPorCompas = beatsCompas * subdivisionMetro;
    const esPrimerGolpe = (conteoActual % ticksPorCompas) === 0;
    const esGolpeNegra = (conteoActual % subdivisionMetro) === 0;
    
    if (document.getElementById('metro-sound').checked && MasterAudio) {
        const gain = MasterAudio.createGain();
        let usarPitidoDigital = false;

        if (bufferClick) {
            const source = MasterAudio.createBufferSource();
            source.buffer = bufferClick;
            source.connect(gain);
            gain.connect(MasterAudio.destination);
            
            if (esPrimerGolpe && enfasisActivado) {
                // Fíjate cómo usamos 'tiempoExacto' en lugar de ejecutarlo al instante
                gain.gain.setValueAtTime(1.0, tiempoExacto); 
                source.playbackRate.setValueAtTime(1.3, tiempoExacto); 
            } else {
                gain.gain.setValueAtTime(esGolpeNegra ? 0.4 : 0.15, tiempoExacto); 
                source.playbackRate.setValueAtTime(1.0, tiempoExacto); 
            }
            source.start(tiempoExacto);
        } else { 
            usarPitidoDigital = true; 
        }

        if (usarPitidoDigital) {
            const osc = MasterAudio.createOscillator();
            if (esPrimerGolpe && enfasisActivado) {
                osc.frequency.setValueAtTime(1000, tiempoExacto);
                gain.gain.setValueAtTime(0.15, tiempoExacto); 
            } else {
                osc.frequency.setValueAtTime(600, tiempoExacto);  
                gain.gain.setValueAtTime(esGolpeNegra ? 0.10 : 0.05, tiempoExacto); 
            }
            osc.connect(gain);
            gain.connect(MasterAudio.destination);
            osc.start(tiempoExacto);
            osc.stop(tiempoExacto + 0.05);
        }
    }

	// LUZ VISUAL: Calculamos cuánto falta para que suene y prendemos el flash justo a tiempo
    let delayParaLuz = (tiempoExacto - MasterAudio.currentTime) * 1000;
    if (delayParaLuz < 0) delayParaLuz = 0;

    setTimeout(() => {
        if (!metroActivo) return; // Por si lo apagaron justo antes de brillar
        
        // 1. Flash del Botón Flotante
        if (document.getElementById('metro-light').checked && esGolpeNegra) {
            const capsulaCompleta = document.querySelector('.floating-controls.dynamic-island');
            if (capsulaCompleta) {
                capsulaCompleta.classList.add('metro-flash-global');
                setTimeout(() => capsulaCompleta.classList.remove('metro-flash-global'), 80);
            }
        }

        // 2. Flash de la Línea Guía (NUEVO)
        if (document.body.classList.contains('mostrar-linea-sync')) {
            const linea = document.getElementById('autoplay-sync-line');
            if (linea) {
                // Brilla fuerte en el primer golpe (acento) y suave en los demás
                if (esPrimerGolpe && enfasisActivado) {
                    linea.classList.add('linea-flash');
                    setTimeout(() => linea.classList.remove('linea-flash'), 90);
                } else if (esGolpeNegra) {
                    // Micro-destello para las demás negras
                    linea.style.opacity = '0.5';
                    setTimeout(() => linea.style.opacity = '', 50);
                }
            }
        }
    }, delayParaLuz);
}
async function cargarSonidosMetronomo() {
    if (!audioCtx || bufferClick) return;

    try {
        // Llama directamente a tu archivo físico
        const res = await fetch("metronomo.wav");
        const arr = await res.arrayBuffer();
        bufferClick = await audioCtx.decodeAudioData(arr);
    } catch (error) {
        console.error("Error: Asegúrate de que metronomo.wav esté en la carpeta.");
    }
}

function changeCompas(val) {
    const visor = document.getElementById('compas-display'); 
    if (!visor) return;

    const opciones = ["1/4", "2/4", "3/4", "4/4", "6/8"];
    let indiceActual = opciones.indexOf(visor.innerText);
    if (indiceActual === -1) indiceActual = 3; 

    let nuevoIndice = indiceActual + val;

    if (nuevoIndice < 0) nuevoIndice = 0;
    if (nuevoIndice >= opciones.length) nuevoIndice = opciones.length - 1;

    let compasElegido = opciones[nuevoIndice];
    visor.innerText = compasElegido;

    beatsCompas = parseInt(compasElegido.split('/')[0]);
    
    if (metroActivo) {
        conteoActual = 0; 
    }
}
function changeBPM(val) {
    const input = document.getElementById('bpm-input');
    let nuevoBPM = parseInt(input.value) + val;
    
    // Solo actualizamos el valor visual. El motor lo leerá al vuelo sin detenerse.
    input.value = Math.max(20, Math.min(300, nuevoBPM));
}
function actualizarBPMDirecto() {
    const input = document.getElementById('bpm-input');
    let valor = parseInt(input.value);

    if (valor > 300) input.value = 300;

    // Si el metrónomo está prendido, forzamos el reinicio inmediato
    if (metroActivo) {
        if (timerMetro) clearTimeout(timerMetro);
        iniciarMotorMetro(); 
    }
}
function cambiarSubdivisionMetro(val) {
    subdivisionMetro = val;
    
    // Solo actualizamos el color de los botones visualmente
    document.getElementById('btn-negras').classList.remove('active');
    document.getElementById('btn-corcheas').classList.remove('active');
    
    if (val === 1) document.getElementById('btn-negras').classList.add('active');
    else document.getElementById('btn-corcheas').classList.add('active');
}
// ==========================================================================
// 🎹 12. Sintetizador de Pads
// ==========================================================================
function cambiarAudioPad(nuevaRuta) {
    rutaAudioPadActual = nuevaRuta;
    if (ctxPad) {
        cargarAudioBase(); // Carga el nuevo sonido a la memoria
        // Apagamos el pad actual si estaba sonando para evitar mezclar sonidos distintos
        if (notaPadActual) detenerPad(); 
    }
}

async function cargarAudioBase() {
    try {
        // Añadimos un timestamp para que el servidor no se confunda con pedidos viejos
        const respuesta = await fetch(rutaAudioPadActual + "?t=" + Date.now());
        
        if (!respuesta.ok) throw new Error("Archivo no encontrado");
        
        const arrayBuffer = await respuesta.arrayBuffer();
        bufferPadReal = await ctxPad.decodeAudioData(arrayBuffer);
    } catch (error) {
        console.error("❌ Error en el servidor de Python:", error);
    }
}

async function togglePad(nota, btnElement) {

    if (ctxPad.state === 'suspended') {
        await ctxPad.resume();
    }

    // 3. Cargar el audio si no se ha hecho antes
    if (!bufferPadReal) {
        await cargarAudioBase();
    }

    // 4. Si el buffer falló después de cargar, no continuar
    if (!bufferPadReal) return;

    // 5. Lógica de encendido/apagado (Toggle)
    if (notaPadActual === nota) {
        detenerPad();
        return;
    }

    // 6. Actualización visual de los botones
    document.querySelectorAll('.pad-btn').forEach(b => b.classList.remove('activo-pad'));
    btnElement.classList.add('activo-pad');
    
    // 7. Ejecución del sonido
    apagarTodosLosPads();
    iniciarPadSampler(nota);
    notaPadActual = nota;
}

function apagarTodosLosPads() {
    const tiempoActual = ctxPad.currentTime;
    for (const id in padsSonando) {
        const pad = padsSonando[id];
        // Fade out ultra suave de 2 segundos (Crossfade)
        pad.gain.gain.setTargetAtTime(0, tiempoActual, 2.0); 
        try { pad.source.stop(tiempoActual + 8); } catch(e){}
        delete padsSonando[id];
    }
}

function detenerPad() {
    if (ctxPad) apagarTodosLosPads();
    notaPadActual = null;
    document.querySelectorAll('.pad-btn').forEach(b => b.classList.remove('activo-pad'));
}
function seleccionarSonidoPad(nombre) {
    const display = document.getElementById('pads-sonido-active-name');
    if (display) display.innerText = nombre;
    localStorage.setItem('config_pads_sonido', nombre);
    
    const menu = document.getElementById('menu-pads-sonido');
    if (menu) menu.classList.remove('active');
}
function seleccionarPadDesdeModal(elementoHTML, ruta, nombre) {
    // 1. Actualizar el texto del botón principal
    const textoSeleccionado = document.getElementById('texto-pad-seleccionado');
    if (textoSeleccionado) textoSeleccionado.textContent = nombre;
    
    // 2. Cerrar el menú desplegable
    const menu = document.getElementById('menu-pads-personalizado');
    if (menu) menu.classList.remove('active');
    
    // 3. Quitar el sombreado a todos los demás elementos del menú
    if (menu) {
        menu.querySelectorAll('.menu-item').forEach(el => {
            el.style.backgroundColor = ''; 
            el.style.color = '';            
        });
    }

    // 4. Pintar de tu color de énfasis solo el que seleccionaste
    elementoHTML.style.backgroundColor = 'color-mix(in srgb, var(--accent-color) 15%, transparent)';
    elementoHTML.style.color = 'var(--accent-color)';

    // 5. Mandar la orden al motor de audio
    if (typeof cambiarAudioPad === 'function') {
        cambiarAudioPad(ruta);
    }
}

function agregarNuevoPadLocalDesdeModal(inputElement) {
    const archivo = inputElement.files[0];
    if (!archivo) return;
    
    // Creamos la ruta temporal y limpiamos el nombre (.mp3, .wav)
    const urlLocal = URL.createObjectURL(archivo);
    const nombreLimpio = archivo.name.replace(/\.[^/.]+$/, "");

    const menu = document.getElementById('menu-pads-personalizado');
    if (!menu) return;
    
    // Creamos la nueva opción con el mismo diseño del menú desplegable
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.innerHTML = `<span class="material-icons" style="font-size: 1.2rem; margin-right: 8px;">audiotrack</span> ${nombreLimpio}`;
    
    // Le conectamos la función de clic
    div.onclick = function() { seleccionarPadDesdeModal(this, urlLocal, nombreLimpio); };
    
    // Insertamos el nuevo pad justo ANTES del botón "AÑADIR PROPIO"
    const botonAnadir = menu.querySelector('div[onclick*="input-nuevo-pad"]');
    if (botonAnadir) {
        menu.insertBefore(div, botonAnadir);
    } else {
        menu.appendChild(div);
    }
    
    // Simulamos un clic para que se seleccione automáticamente al terminar de subir
    div.click();
    
    // Vaciamos el input
    inputElement.value = "";
}
function togglePadsMenores() {
    const check = document.getElementById('adv-pads-menores');
    if (!check) return;
    
    const isMinor = check.checked;
    localStorage.setItem('config_pads_menores', isMinor);

    // Actualizamos los botones del grid de la configuración principal (Ajustes)
    document.querySelectorAll('#grid-pads-sintetizador .pad-btn').forEach(btn => {
        const mainText = btn.querySelector('.pad-main-text');
        const cornerText = btn.querySelector('.pad-corner-text');
        
        if (!mainText || !cornerText) return;

        // Detectamos la nota base buscando en el diccionario
        let notaMayor = Object.keys(padRelativos).find(key => 
            key === mainText.innerText || padRelativos[key] === mainText.innerText
        );

        if (notaMayor) {
            if (isMinor) {
                mainText.innerText = padRelativos[notaMayor];
                cornerText.innerText = notaMayor;
            } else {
                mainText.innerText = notaMayor;
                cornerText.innerText = padRelativos[notaMayor];
            }
        }
    });
}
function actualizarAjustesPad() {
    padSettings.volumen = document.getElementById('pad-master-vol').value / 100;
    padSettings.crossfade = document.getElementById('pad-crossfade').value / 10;
    padSettings.eqActiva = document.getElementById('pad-eq-switch').checked;
    padSettings.hpFreq = document.getElementById('pad-hp-freq').value;
    padSettings.lpFreq = document.getElementById('pad-lp-freq').value;

    // Actualizar etiquetas visuales
    document.getElementById('val-pad-vol').innerText = Math.round(padSettings.volumen * 100) + "%";
    document.getElementById('val-pad-cross').innerText = padSettings.crossfade.toFixed(1) + "s";
    document.getElementById('val-pad-hp').innerText = padSettings.hpFreq + " Hz";
    document.getElementById('val-pad-lp').innerText = padSettings.lpFreq + " Hz";

    // Si hay un pad sonando, actualizar los filtros en tiempo real
    actualizarFiltrosEnVivo();
}

function iniciarPadSampler(nota) {
    const multiplicador = tonoMultiplicador[nota];
    if (!multiplicador) return;

    // 1. Crear Nodo de Ganancia (Volumen) con Crossfade
    const noteGain = ctxPad.createGain();
    noteGain.gain.setValueAtTime(0, ctxPad.currentTime);
    // Usamos el valor de crossfade para la entrada suave
    noteGain.gain.setTargetAtTime(padSettings.volumen, ctxPad.currentTime, padSettings.crossfade / 3); 

    // 2. Crear Filtros (EQ)
    const hpFilter = ctxPad.createBiquadFilter();
    hpFilter.type = "highpass";
    hpFilter.frequency.value = padSettings.eqActiva ? padSettings.hpFreq : 10;

    const lpFilter = ctxPad.createBiquadFilter();
    lpFilter.type = "lowpass";
    lpFilter.frequency.value = padSettings.eqActiva ? padSettings.lpFreq : 22000;

    // 3. Cadena de Audio: Fuente -> LP -> HP -> Ganancia -> Salida
    const fuenteAudio = ctxPad.createBufferSource();
    fuenteAudio.buffer = bufferPadReal;
    fuenteAudio.loop = true;
    
    // (Opcional: Si editaste los MP3 para quitar silencios, agrega aquí el loopStart/End)

    fuenteAudio.playbackRate.value = multiplicador;

    // Conexiones
    fuenteAudio.connect(lpFilter);
    lpFilter.connect(hpFilter);
    hpFilter.connect(noteGain);
    noteGain.connect(ctxPad.destination);

    fuenteAudio.start(0);

    const idUnico = Date.now();
    padsSonando[idUnico] = { 
        source: fuenteAudio, 
        gain: noteGain, 
        hp: hpFilter, 
        lp: lpFilter 
    };
}

// Para que los filtros cambien mientras el pad ya está sonando
function actualizarFiltrosEnVivo() {
    for (let id in padsSonando) {
        const p = padsSonando[id];
        const tempo = ctxPad.currentTime;
        
        // Actualizar frecuencias suavemente
        p.hp.frequency.setTargetAtTime(padSettings.eqActiva ? padSettings.hpFreq : 10, tempo, 0.1);
        p.lp.frequency.setTargetAtTime(padSettings.eqActiva ? padSettings.lpFreq : 22000, tempo, 0.1);
        p.gain.gain.setTargetAtTime(padSettings.volumen, tempo, 0.1);
    }
}
// ==========================================================================
// 🎧 13. Reproductor de Pistas Locales
// ==========================================================================
function inicializarReproductorFlotante() {
    const btnPrev = document.getElementById('btn-player-prev');
    const btnNext = document.getElementById('btn-player-next');

    if (!btnPrev || !btnNext) return;

    // Función constructora para los botones
    function bindPlayerButton(btn, actionHold, actionDoubleTap) {
        let interval = null;
        let lastTap = 0;

        const startAction = (e) => {
            // Evitamos que el navegador haga cosas raras al tocar
            if(e.cancelable && e.type === 'touchstart') e.preventDefault();

            const now = new Date().getTime();
            const timespan = now - lastTap;

            if (timespan > 0 && timespan < 300) {
                // 🔥 DOBLE TOQUE DETECTADO
                clearInterval(interval);
                actionDoubleTap();
                lastTap = 0; // Reseteamos
            } else {
                // 🔥 MANTENER PRESIONADO (Inicia al instante)
                actionHold(); // Primera ejecución inmediata
                interval = setInterval(actionHold, 150); // Se repite cada 150ms mientras no sueltes
                lastTap = now;
            }
        };

        const stopAction = (e) => {
            if(e.cancelable && e.type === 'touchend') e.preventDefault();
            clearInterval(interval);
        };

        // Escucha toques de celular
        btn.addEventListener('touchstart', startAction, {passive: false});
        btn.addEventListener('touchend', stopAction, {passive: false});
        // Escucha clics de PC
        btn.addEventListener('mousedown', startAction);
        btn.addEventListener('mouseup', stopAction);
        btn.addEventListener('mouseleave', stopAction);
    }

// --- CONECTAR BOTÓN ANTERIOR/RETROCEDER ---
    bindPlayerButton(btnPrev,
        () => { 
            if(reproductorAudioNativo.readyState > 0) reproductorAudioNativo.currentTime -= 2;
        },
        () => { 
            btnPrev.style.transform = "scale(1.2)";
            setTimeout(() => btnPrev.style.transform = "scale(1)", 150);
            
            const pistasValidas = Object.keys(audioUrlsLocales).map(Number).sort((a,b) => a - b);
            if(pistasValidas.length === 0) return;
            
            let idx = pistasValidas.indexOf(pistaActualOnline);
            if(idx <= 0) idx = pistasValidas.length - 1; 
            else idx--;
            
            pistaActualOnline = pistasValidas[idx];
            if (isPlayingTrack) iniciarReproduccionCasillero(pistaActualOnline);
        }
    );

    // --- CONECTAR BOTÓN SIGUIENTE/AVANZAR ---
    bindPlayerButton(btnNext,
        () => { 
            if(reproductorAudioNativo.readyState > 0) reproductorAudioNativo.currentTime += 2;
        },
        () => { 
            btnNext.style.transform = "scale(1.2)";
            setTimeout(() => btnNext.style.transform = "scale(1)", 150);
            
            const pistasValidas = Object.keys(audioUrlsLocales).map(Number).sort((a,b) => a - b);
            if(pistasValidas.length === 0) return;
            
            let idx = pistasValidas.indexOf(pistaActualOnline);
            if(idx === -1 || idx === pistasValidas.length - 1) idx = 0; 
            else idx++;
            
            pistaActualOnline = pistasValidas[idx];
            if (isPlayingTrack) iniciarReproduccionCasillero(pistaActualOnline);
        }
    );
}

function cargarAudioLocal(numero, inputElement) {
    const archivo = inputElement.files[0];
    if (!archivo) return;
    
    const nombreSpan = document.getElementById(`name-Audio-${numero}`);
    if (nombreSpan) {
        nombreSpan.innerText = archivo.name;
        nombreSpan.style.color = "#ccc";
    }
    
    if (audioUrlsLocales[numero]) {
        URL.revokeObjectURL(audioUrlsLocales[numero]);
    }
    
    audioUrlsLocales[numero] = URL.createObjectURL(archivo);
}

function eliminarFilaAudio(btn) {
    const row = btn.closest('.audio-row');
    if (row) {
        const input = row.querySelector('input[type="file"]');
        if (input) {
            const idMatch = input.id.match(/\d+/);
            if (idMatch) {
                const numero = idMatch[0];
                if (pistaActualOnline == numero && isPlayingTrack) {
                    toggleReproductorPlay();
                }
                if (audioUrlsLocales[numero]) {
                    URL.revokeObjectURL(audioUrlsLocales[numero]);
                    delete audioUrlsLocales[numero];
                }
            }
        }
        row.remove();
    }
}
function agregarAudioInput() {
    contadorPistasAudio++;
    const num = contadorPistasAudio;
    const container = document.getElementById('contenedor-urls-audio');
    if (!container) return;
    
    const div = document.createElement('div');
    div.className = 'box-input audio-row';
    div.id = `audio-row-${num}`;
    div.style.cssText = "background: #080808; border-color: #2a2a2a; border-style: solid; border-width: 1px; border-radius: 4px; display: flex; align-items: center; padding: 8px 10px;";
    
    // 🔥 TRADUCCIÓN: "Agrega un audio"
    div.innerHTML = `
        <span class="material-icons" style="color: #666; margin-right: 8px; font-size: 1.2rem;">music_note</span>
        <span id="name-Audio-${num}" style="font-size: 0.85rem; color: #888; flex: 1; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" onclick="document.getElementById('file-Audio-${num}').click()">${t('js_add_audio')}</span>
        <input type="file" id="file-Audio-${num}" accept="audio/*, audio/mpeg, .mp3, .wav, .m4a" style="display: none;" onchange="cargarAudioLocal(${num}, this)">
        <span class="material-icons" style="color: #ffb347; font-size: 1.2rem; cursor: pointer; margin-left: 10px;" onclick="eliminarFilaAudio(this)">delete</span>
    `;
    container.appendChild(div);
}
function toggleReproductorPlay() {
    // 1. Primero verificamos si realmente hay un audio cargado
    const urlLocal = audioUrlsLocales[pistaActualOnline];

    // Si está vacío, forzamos el apagado y cortamos aquí
    if (!urlLocal) {
        isPlayingTrack = false;
        document.getElementById('icon-player-play').innerText = 'play_arrow';
        document.getElementById('btn-player-play').classList.remove('activo-btn');
        return; 
    }

    // 2. Si sí hay audio, alternamos el estado normalmente
    isPlayingTrack = !isPlayingTrack; 
    const icon = document.getElementById('icon-player-play');
    const btn = document.getElementById('btn-player-play');
    
    if (icon && btn) {
        icon.innerText = isPlayingTrack ? 'pause' : 'play_arrow';
        
        if (isPlayingTrack) {
            btn.classList.add('activo-btn'); 
            iniciarReproduccionCasillero(pistaActualOnline);
        } else {
            btn.classList.remove('activo-btn');
            detenerReproduccionCasillero();
        }
    }
}

function iniciarReproduccionCasillero(numero) {
    const urlLocal = audioUrlsLocales[numero];

    document.querySelectorAll('.grupo-urls .audio-row').forEach(box => {
        box.style.border = "1px solid #2a2a2a";
        box.style.boxShadow = "none";
    });

    const rowActiva = document.getElementById(`audio-row-${numero}`);
    if (rowActiva) {
        rowActiva.style.border = "2px solid var(--accent-color)";
        rowActiva.style.boxShadow = "0 0 10px rgba(76, 175, 80, 0.3)";
    }

    detenerReproduccionCasillero();

    reproductorAudioNativo.src = urlLocal;
    reproductorAudioNativo.loop = true;
    reproductorAudioNativo.play().catch(e => console.error("Error de audio:", e));
}

function detenerReproduccionCasillero() {
    document.querySelectorAll('.grupo-urls .audio-row').forEach(box => {
        box.style.border = "1px solid #2a2a2a";
        box.style.boxShadow = "none";
    });
    
    reproductorAudioNativo.pause();
    reproductorAudioNativo.src = "";
}
function resetPlayerTimer() {
    if (playerInactividadTimer) clearTimeout(playerInactividadTimer);
    const player = document.getElementById('floating-player');
    
    // Solo inicia el contador si el cajón está abierto
    if (player && player.classList.contains('abierto')) {
        playerInactividadTimer = setTimeout(() => {
            player.classList.remove('abierto');
            actualizarIconoPlayer();
        }, 5000);
    }
}

function actualizarIconoPlayer() {
    const player = document.getElementById('floating-player');
    const icon = document.getElementById('player-handle-icon');
    if (!player || !icon) return;
    
    const isOpen = player.classList.contains('abierto');
    const isLeft = player.getAttribute('data-edge') === 'left';

    // La flecha cambia dependiendo de en qué borde está y si está abierto o cerrado
    if (isLeft) icon.innerText = isOpen ? "chevron_left" : "chevron_right";
    else icon.innerText = isOpen ? "chevron_right" : "chevron_left";
}

function togglePlayerPanel(event) {
    if(event) event.stopPropagation();
    const player = document.getElementById('floating-player');
    if (!player) return;
    
    player.classList.toggle('abierto');
    actualizarIconoPlayer();
    
    // Si lo abrimos, disparamos el contador de 5 segundos
    if (player.classList.contains('abierto')) {
        resetPlayerTimer();
    } else {
        if (playerInactividadTimer) clearTimeout(playerInactividadTimer);
    }
}

function habilitarArrastreInteligente() {
    const player = document.getElementById('floating-player');
    if (!player) return;

    // Memoria: Cargamos de qué lado se quedó la última vez
    const savedEdge = localStorage.getItem('config_player_edge') || 'right';
    player.setAttribute('data-edge', savedEdge);
    
    if (savedEdge === 'right') {
        player.style.right = '0px';
        player.style.left = 'auto';
    } else {
        player.style.left = '0px';
        player.style.right = 'auto';
    }
    // Forzamos un pequeño delay para que el navegador registre la posición 
    // antes de que el usuario intente abrirlo, evitando el salto brusco.
    setTimeout(() => {
        player.style.transition = 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1), left 0.3s, right 0.3s';
    }, 100);

    actualizarIconoPlayer();

    let isDragging = false, seMovio = false;
    let startX, startY, initialTop, initialLeft;

    const onDragStart = (e) => {
        isDragging = true; 
        seMovio = false;
        
        // 1. Obtenemos las coordenadas EXACTAS en pantalla antes de moverlo
        const rect = player.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;
        
        startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        startY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        
        if (playerInactividadTimer) clearTimeout(playerInactividadTimer);
    };

    const onDragMove = (e) => {
        if (!isDragging) return;
        
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        
        const dx = clientX - startX; 
        const dy = clientY - startY;

        if (!seMovio && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
            seMovio = true;
            // 🔥 LA CLAVE: Matamos la transición y el transform para que CSS no estorbe
            player.style.transition = 'none'; 
            player.style.transform = 'none'; 
            player.classList.remove('abierto'); 
            actualizarIconoPlayer();
        }

        if (!seMovio) return;
        e.preventDefault(); 

        // Como apagamos el 'transform', la posición ahora es 1:1 con tu dedo
        let newTop = initialTop + dy;
        let newLeft = initialLeft + dx;

        const topeSuperior = 70;
        const topeInferior = window.innerHeight - player.offsetHeight - 90;
        newTop = Math.max(topeSuperior, Math.min(newTop, topeInferior));

        player.style.top = newTop + 'px';
        player.style.left = newLeft + 'px';
        player.style.right = 'auto'; // Soltamos el ancla derecha para mover libremente
    };

    const onDragEnd = () => {
        if (!isDragging) return;
        isDragging = false;
        
        if (seMovio) {
            // Devolvemos el control de la animación al CSS
            player.style.transform = ''; 
            player.style.transition = 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1), left 0.3s, right 0.3s';
            
            const rect = player.getBoundingClientRect();
            const centerX = rect.left + (rect.width / 2);
            
            // Imán hacia los bordes
            if (centerX > window.innerWidth / 2) {
                player.setAttribute('data-edge', 'right');
                localStorage.setItem('config_player_edge', 'right');
                player.style.left = 'auto';
                player.style.right = '0px';
            } else {
                player.setAttribute('data-edge', 'left');
                localStorage.setItem('config_player_edge', 'left');
                player.style.left = '0px';
                player.style.right = 'auto';
            }
            actualizarIconoPlayer();
        }
    };

    player.addEventListener('mousedown', onDragStart, { passive: false });
    player.addEventListener('touchstart', onDragStart, { passive: false });
    document.addEventListener('mousemove', onDragMove, { passive: false });
    document.addEventListener('touchmove', onDragMove, { passive: false });
    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('touchend', onDragEnd);

    player.addEventListener('click', (e) => {
        if (seMovio) { 
            e.preventDefault(); e.stopPropagation(); 
        } else {
            resetPlayerTimer(); 
        }
    }, true);
}
// ==========================================================================
// 🎮 14. Hardware y Sensores (MIDI, Gamepad, Teclado)
// ==========================================================================
function actualizarEstadoAtajos() {
    const lang = localStorage.getItem('config_idioma') || 'es'; // 🔥 TRADUCCIÓN EN VIVO

    // 1. Lógica para Joystick, Teclado y MIDI
    ['joystick', 'teclado', 'midi'].forEach(tipo => {
        const dispositivo = localStorage.getItem(`config_device_${tipo}`);
        const contenedor = document.getElementById(`shortcuts-${tipo}`);
        const displayNombre = document.getElementById(`${tipo}-active-name`);
        const btnAdd = document.querySelector(`.dev-add[onclick*="('${tipo}')"]`);
        
        if (!contenedor) return;
        const botones = contenedor.querySelectorAll('.dev-btn');
        const esValido = dispositivo && dispositivo !== 'Sin dispositivo' && dispositivo !== 'No device';

        if (displayNombre) displayNombre.innerText = dispositivo || (lang === 'en' ? 'No device' : 'Sin dispositivo');

        botones.forEach(btn => {
            if (esValido) {
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
            } else {
                btn.style.opacity = '0.3';
                btn.style.pointerEvents = 'none';
                if (btn.innerText !== 'Asigne una Función' && btn.innerText !== 'Asigne el Atajo' && btn.innerText !== 'Assign a Function' && btn.innerText !== 'Assign Shortcut') {
                    btn.innerText = btn.innerText.includes('Función') || btn.innerText.includes('Function') ? (lang === 'en' ? 'Assign a Function' : 'Asigne una Función') : (lang === 'en' ? 'Assign Shortcut' : 'Asigne el Atajo');
                    btn.style.color = '#999';
                    btn.style.background = '#111';
                    btn.style.borderColor = '#333';
                }
            }
        });
        
        if (btnAdd) {
            btnAdd.style.opacity = esValido ? '1' : '0.3';
            btnAdd.style.pointerEvents = esValido ? 'auto' : 'none';
        }
    });

    // 2. LÓGICA EXCLUSIVA PARA EL PEDAL (STOMP BOX)
    const dispositivoPedal = localStorage.getItem('config_device_pedal');
    const pedalValido = dispositivoPedal && dispositivoPedal !== 'Sin dispositivo' && dispositivoPedal !== 'No device';
    const displayPedal = document.getElementById('pedal-active-name');
    
    if (displayPedal) displayPedal.innerText = dispositivoPedal || (lang === 'en' ? 'No device' : 'Sin dispositivo');

    // Seleccionamos los contenedores que deben bloquearse
    const btnAsignarPedal = document.querySelector('#section-pedal .dev-btn[onclick*="pedal"]');
    // Subimos dos niveles (parentElement) para atrapar todo el bloque del selector de sonido
    const contenedorSonido = document.querySelector('#section-pedal .dev-select[onclick*="sonido-bombo"]')?.parentElement.parentElement; 

    if (btnAsignarPedal) {
        btnAsignarPedal.style.opacity = pedalValido ? '1' : '0.3';
        btnAsignarPedal.style.pointerEvents = pedalValido ? 'auto' : 'none';
        
        if (!pedalValido && btnAsignarPedal.innerText !== 'Asigne el Atajo' && btnAsignarPedal.innerText !== 'Assign Shortcut') {
            btnAsignarPedal.innerText = lang === 'en' ? 'Assign Shortcut' : 'Asigne el Atajo';
            btnAsignarPedal.style.color = '#999';
            btnAsignarPedal.style.background = '#111';
            btnAsignarPedal.style.borderColor = '#333';
        }
    }

    if (contenedorSonido) {
        contenedorSonido.style.opacity = pedalValido ? '1' : '0.3';
        contenedorSonido.style.pointerEvents = pedalValido ? 'auto' : 'none';
    }
}

function seleccionarDispositivo(type, name) {
    const displayNombre = document.getElementById(`${type}-active-name`);
    if (displayNombre) displayNombre.innerText = name;
    
    localStorage.setItem(`config_device_${type}`, name);
    
    if (typeof actualizarEstadoAtajos === 'function') actualizarEstadoAtajos();
    if (typeof cerrarTodoLoAbierto === 'function') cerrarTodoLoAbierto();
}

// Aseguramos que al crear una fila nueva nazca bloqueada si no hay dispositivo
function addShortcutRow(type) {
    const lang = localStorage.getItem('config_idioma') || 'es'; // 🔥 TRADUCCIÓN
    const container = document.getElementById(`shortcuts-${type}`);
    if (!container) return;
    const div = document.createElement('div');
    div.style.cssText = "display: flex; gap: 8px; width: 100%; align-items: center;";
    div.innerHTML = `
        <button class="dev-btn" onclick="abrirModalAcciones(this)">${lang === 'en' ? 'Assign a Function' : 'Asigne una Función'}</button>
        <button class="dev-btn" onclick="escucharEntrada(this, '${type}')">${lang === 'en' ? 'Assign Shortcut' : 'Asigne el Atajo'}</button>
        <div class="dev-trash" onclick="this.parentElement.remove()"><span class="material-icons" style="font-size: 1.2rem;">delete</span></div>
    `;
    container.appendChild(div);
    actualizarEstadoAtajos(); // Bloquea los nuevos botones si es necesario
}

function buscarDispositivos(type, silencioso = false) {
    const lang = localStorage.getItem('config_idioma') || 'es'; // 🔥 TRADUCCIÓN

    const menu = document.getElementById(`menu-${type}`);
    if (!menu) return;
    
    const textBuscarNuevo = lang === 'en' ? 'Search again' : 'Buscar de nuevo';
    const textDesconectar = lang === 'en' ? 'Disconnect' : 'Desconectar';
    const textBuscando = lang === 'en' ? 'Searching devices...' : 'Buscando equipos...';

    const btnBuscar = `<div class="menu-item" style="color: var(--accent-color); justify-content: center; font-weight: bold; border-top: 1px solid #333;" onclick="buscarDispositivos('${type}')">${textBuscarNuevo}</div>`;
    const btnDesconectar = `<div class="menu-item" style="color: #ff4444; justify-content: center; border-top: 1px solid #333;" onclick="seleccionarDispositivo('${type}', '${lang === 'en' ? 'No device' : 'Sin dispositivo'}')"><span class="material-icons" style="margin-right:8px;">link_off</span>${textDesconectar}</div>`;

    if (!silencioso) {
        menu.innerHTML = `<div class="menu-item" style="color: #888; justify-content: center;">${textBuscando}</div>`;
    }

    setTimeout(() => {
        let html = '';
        
        // -------------------------------------------------------------
        // CASO 1: JOYSTICK (Escaneo en tiempo real)
        // -------------------------------------------------------------
        if (type === 'joystick') {
            escaneoJoystickEnCurso = false; // Detenemos cualquier escaneo viejo
            
            function escanearMandosVisual() {
                // Si el menú se cerró o cambiaron de tipo, abortamos el bucle
                if (!menu.classList.contains('active') || !escaneoJoystickEnCurso) return;

                const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
                let found = false;
                let nuevoHtml = '';
                
                for (let i = 0; i < gamepads.length; i++) {
                    if (gamepads[i]) {
                        found = true;
                        let nombreCorto = gamepads[i].id.split('(')[0].substring(0, 20).trim();
                        nuevoHtml += `<div class="menu-item" onclick="escaneoJoystickEnCurso = false; seleccionarDispositivo('${type}', '${nombreCorto}')"><span class="material-icons" style="margin-right:8px; color:#888;">sports_esports</span>${nombreCorto}</div>`;
                    }
                }
                
                if (!found) {
                    const txtNoMando = lang === 'en' ? 'Plug in your controller or<br>press a button to search...' : 'Enchufa tu mando o<br>toca un botón para buscar...';
                    nuevoHtml += `<div class="menu-item" style="color: #ccc; justify-content: center; text-align: center; line-height: 1.4; padding: 15px;"><span class="material-icons" style="font-size: 1.5rem; margin-bottom: 5px; display:block; color:var(--accent-color);">videogame_asset</span>${txtNoMando}</div>`;
                }

                // 🚨 LA MAGIA AQUÍ: Solo repinta el menú si el contenido ES DIFERENTE
                if (menu.innerHTML !== nuevoHtml + btnBuscar) {
                    menu.innerHTML = nuevoHtml + btnBuscar;
                }
                
                mandoMenuAnimationId = requestAnimationFrame(escanearMandosVisual);
            }
            
            escaneoJoystickEnCurso = true;
            escanearMandosVisual(); // Arranca el bucle en vivo
        } 
        
        // -------------------------------------------------------------
        // CASO 2: TECLADO Y PEDAL (Lista + Escuchador)
        // -------------------------------------------------------------
        else if (type === 'teclado' || type === 'pedal') {
            let icono = type === 'pedal' ? 'bluetooth_connected' : 'keyboard';
            let mensaje = type === 'pedal' 
                ? (lang === 'en' ? 'Press your pedal or a key<br>to detect it...' : 'Pisa tu pedal o toca una tecla<br>para detectarlo...') 
                : (lang === 'en' ? 'Press a physical key<br>to detect and connect...' : 'Toca una tecla física<br>para detectar y conectar...');
            
            // 1. Mensaje de trampa táctil
            html += `<div class="menu-item" style="color: #888; justify-content: center; text-align: center; line-height: 1.4; padding: 15px;"><span class="material-icons" style="font-size: 1.5rem; margin-bottom: 5px; display:block; color:var(--accent-color);">${icono}</span>${mensaje}</div>`;

            const txtTecladoP = lang === 'en' ? 'Main Keyboard' : 'Teclado Principal';

            // 2. Opción Manual: Teclado Físico visible en la lista
            html += `<div class="menu-item" onclick="seleccionarDispositivo('${type}', '${txtTecladoP}')"><span class="material-icons" style="margin-right:8px; color:#888;">keyboard</span>${txtTecladoP}</div>`;

            // Limpiamos si había uno viejo colgado
			if (escuchadorTecladoGlobal) window.removeEventListener('keydown', escuchadorTecladoGlobal);

			escuchadorTecladoGlobal = (e) => {
				if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
				e.preventDefault();
				seleccionarDispositivo(type, txtTecladoP); 
				window.removeEventListener('keydown', escuchadorTecladoGlobal);
				escuchadorTecladoGlobal = null; // Vaciamos la memoria
			};

			window.addEventListener('keydown', escuchadorTecladoGlobal);
            
            if (type === 'pedal') {
                escaneoJoystickEnCurso = false; // Detenemos cualquier escaneo viejo
                
                function escanearPedalesVisual() {
                    if (!menu.classList.contains('active') || !escaneoJoystickEnCurso) return;

                    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
                    let nuevoHtmlGamepads = '';
                    
                    for (let i = 0; i < gamepads.length; i++) {
                        if (gamepads[i]) {
                            let nombreCorto = gamepads[i].id.split('(')[0].substring(0, 20).trim();
                            nuevoHtmlGamepads += `<div class="menu-item" onclick="escaneoJoystickEnCurso = false; seleccionarDispositivo('${type}', '${nombreCorto}')"><span class="material-icons" style="margin-right:8px; color:#888;">sports_esports</span>${nombreCorto}</div>`;
                        }
                    }

                    // Y también agregamos dispositivos MIDI a la lista del Pedal
                    if (navigator.requestMIDIAccess) {
                        navigator.requestMIDIAccess().then(midiAccess => {
                            let midiHtml = '';
                            for (let input of midiAccess.inputs.values()) {
                                let nombreCorto = input.name.substring(0, 20).trim();
                                midiHtml += `<div class="menu-item" onclick="escaneoJoystickEnCurso = false; seleccionarDispositivo('${type}', '${nombreCorto}')"><span class="material-icons" style="margin-right:8px; color:#888;">piano</span>${nombreCorto}</div>`;
                            }
                            
                            let htmlFinal = html + nuevoHtmlGamepads + midiHtml + btnDesconectar + btnBuscar;
                            if (menu.innerHTML !== htmlFinal) {
                                menu.innerHTML = htmlFinal;
                            }
                        }).catch(() => {
                            let htmlFinal = html + nuevoHtmlGamepads + btnDesconectar + btnBuscar;
                            if (menu.innerHTML !== htmlFinal) {
                                menu.innerHTML = htmlFinal;
                            }
                        });
                    } else {
                        let htmlFinal = html + nuevoHtmlGamepads + btnDesconectar + btnBuscar;
                        if (menu.innerHTML !== htmlFinal) {
                            menu.innerHTML = htmlFinal;
                        }
                    }
                    
                    mandoMenuAnimationId = requestAnimationFrame(escanearPedalesVisual);
                }
                
                escaneoJoystickEnCurso = true;
                escanearPedalesVisual(); // Arranca el bucle en vivo para el pedal
                return; // Cortamos aquí porque la función de arriba dibuja todo en bucle
            }

            // Dibuja el menú si no es pedal
            menu.innerHTML = html + btnDesconectar + btnBuscar;
        }
        
        // -------------------------------------------------------------
        // CASO 3: MIDI (Solo Piano/Controladora)
        // -------------------------------------------------------------
        else if (type === 'midi') {
            const txtNoMidi = t('js_no_midi'); // 🔥 TRADUCCIÓN
            const txtMidiDenied = t('js_midi_denied'); // 🔥 TRADUCCIÓN
            const txtMidiNotSupported = t('js_midi_notsupported'); // 🔥 TRADUCCIÓN

            if (navigator.requestMIDIAccess) {
                navigator.requestMIDIAccess().then(midiAccess => {
                    let found = false;
                    for (let input of midiAccess.inputs.values()) {
                        found = true;
                        let nombreCorto = input.name.substring(0, 20).trim();
                        html += `<div class="menu-item" onclick="seleccionarDispositivo('${type}', '${nombreCorto}')"><span class="material-icons" style="margin-right:8px; color:#888;">piano</span>${nombreCorto}</div>`;
                    }
                    if (!found) html += `<div class="menu-item" style="color: #ff4444; justify-content: center;">${txtNoMidi}</div>`;
                    menu.innerHTML = html + btnDesconectar + btnBuscar; 
                }).catch(() => {
                    menu.innerHTML = `<div class="menu-item" style="color: #ff4444; justify-content: center;">${txtMidiDenied}</div>` + btnBuscar;
                });
            } else {
                menu.innerHTML = `<div class="menu-item" style="color: #ff4444; justify-content: center;">${txtMidiNotSupported}</div>` + btnBuscar;
            }
        }
    }, 300); 
}

// --- 3. LIMPIEZA FANTASMA AL ABRIR LA APP ---
function limpiarDispositivosFantasma() {
    setTimeout(() => {
        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess().then(midiAccess => {
                const puertosActivos = Array.from(midiAccess.inputs.values()).map(input => input.name.substring(0, 20).trim());
                
                ['midi', 'pedal', 'joystick'].forEach(tipo => {
                    const guardado = localStorage.getItem(`config_device_${tipo}`);
                    
                    if (guardado && guardado !== 'Sin dispositivo' && guardado !== 'Teclado Principal') {
                        const nombreLower = guardado.toLowerCase();
                        if (!puertosActivos.includes(guardado) && !nombreLower.includes('wireless') && !nombreLower.includes('gamepad')) {
                            seleccionarDispositivo(tipo, 'Sin dispositivo');
                        }
                    }
                });
            });
        }
    }, 1500);
}


function escucharEntrada(boton, tipo) {
    const lang = localStorage.getItem('config_idioma') || 'es'; // 🔥 TRADUCCIÓN
    cancelarEscuchas();
    
    botonAtajoActivo = boton;
    boton.dataset.textoViejo = boton.innerText;
    
    // Le decimos al botón qué tipo de dispositivo estamos esperando específicamente
    boton.dataset.esperandoTipo = tipo; 

    boton.innerText = lang === 'en' ? "Press the physical button..." : "Presione el botón físico...";
    boton.style.color = "var(--accent-color)";
    boton.style.background = "#1a2a1a";

    // Iniciamos las escuchas pero ahora cada una filtrará por su cuenta
    if (tipo === 'teclado' || (tipo === 'pedal' && localStorage.getItem('config_device_pedal') === (lang === 'en' ? 'Main Keyboard' : 'Teclado Principal'))) {
        window.addEventListener('keydown', atraparTecla, { once: true });
    }
    
    // Solo activamos joystick o midi si el dispositivo seleccionado coincide
    iniciarEscaneoEspecífico(tipo);
}
function iniciarEscaneoEspecífico(tipo) {
    const dispositivoSeleccionado = localStorage.getItem(`config_device_${tipo}`);
    
    if (!dispositivoSeleccionado || dispositivoSeleccionado === 'Sin dispositivo') return;

    function loop() {
        if (!botonAtajoActivo) return;

        // --- FILTRO JOYSTICK ---
        if (tipo === 'joystick' || tipo === 'pedal') {
            const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
            for (let i = 0; i < gamepads.length; i++) {
                const gp = gamepads[i];
                if (gp) {
                    let nombreCorto = gp.id.split('(')[0].substring(0, 20).trim();
                    // 🚨 LA CLAVE: Solo lee si el nombre del mando coincide con el seleccionado
                    if (nombreCorto === dispositivoSeleccionado) {
                        for (let b = 0; b < gp.buttons.length; b++) {
                            if (gp.buttons[b].pressed) {
                                registrarAtajoCapturado(`Botón ${b}`);
                                return;
                            }
                        }
                    }
                }
            }
        }

        // --- FILTRO MIDI ---
        if (tipo === 'midi' || (tipo === 'pedal' && !dispositivoSeleccionado.includes('Teclado'))) {
            // La lógica MIDI se filtra dentro de su propio onmidimessage (ver abajo)
        }

        loopJoystickActivo = requestAnimationFrame(loop);
    }
    loop();
}

function atraparTecla(e) {
    if (!botonAtajoActivo) return;
    
    const tipoEsperado = botonAtajoActivo.dataset.esperandoTipo;
    const dispositivoSeleccionado = localStorage.getItem(`config_device_${tipoEsperado}`);

    // Solo registramos si el dispositivo seleccionado es el teclado
    if (dispositivoSeleccionado === 'Teclado Principal') {
        e.preventDefault();
        let nombreTecla = e.code.replace('Key', '').replace('Digit', ''); 
        registrarAtajoCapturado(nombreTecla);
    } else {
        // Si presionó teclado pero esperaba otra cosa, volvemos a escuchar
        window.addEventListener('keydown', atraparTecla, { once: true });
    }
}
async function cargarSonidoPropioPedal(event) {
    const lang = localStorage.getItem('config_idioma') || 'es'; // 🔥 TRADUCCIÓN EN VIVO

    const archivo = event.target.files[0];
    if (!archivo) return;

    // Usamos tu modal nativo para avisar que está procesando
    abrirModalDinamico(lang === 'en' ? "LOADING SOUND..." : "CARGANDO SONIDO...", false, () => {});
    document.getElementById('md-mensaje').innerText = lang === 'en' ? "Processing audio file..." : "Procesando archivo de audio...";

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            if (audioCtxPedal.state === 'suspended') audioCtxPedal.resume();
            
            const audioData = e.target.result;
            bufferPedalPersonalizado = await audioCtxPedal.decodeAudioData(audioData);

            let nombreCorto = archivo.name.substring(0, 15);
            seleccionarSonidoPedal('Propio: ' + nombreCorto);
            
            document.getElementById('md-mensaje').innerText = lang === 'en' ? "Sound loaded and ready to use!" : "¡Sonido cargado y listo para usar!";
            setTimeout(cerrarModalDinamico, 1500); // Se cierra solito
            
        } catch (err) {
            console.error("Error decodificando audio:", err);
            document.getElementById('md-mensaje').innerText = lang === 'en' ? "Error. Make sure it is a valid MP3 or WAV file." : "Error. Asegúrate de que sea un archivo MP3 o WAV válido.";
            setTimeout(cerrarModalDinamico, 3000);
        }
    };
    
    reader.readAsArrayBuffer(archivo);
    event.target.value = ''; // Resetea el input
}
function iniciarEscaneoJoystick() {
    function loop() {
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        for (let i = 0; i < gamepads.length; i++) {
            const gp = gamepads[i];
            if (gp) {
                // Buscamos botones
                for (let b = 0; b < gp.buttons.length; b++) {
                    if (gp.buttons[b].pressed) {
                        registrarAtajoCapturado(`Botón ${b}`);
                        return; // Frenamos el loop
                    }
                }
                // Buscamos flechas/crucetas (Axes)
                for (let a = 0; a < gp.axes.length; a++) {
                    if (Math.abs(gp.axes[a]) > 0.8) { // Si empuja la palanca a tope
                        let direccion = gp.axes[a] > 0 ? '+' : '-';
                        registrarAtajoCapturado(`Eje ${a} ${direccion}`);
                        return; // Frenamos
                    }
                }
            }
        }
        loopJoystickActivo = requestAnimationFrame(loop);
    }
    loop();
}

function iniciarEscaneoMidi() {
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(midiAccess => {
            for (let input of midiAccess.inputs.values()) {
                input.onmidimessage = (e) => {
                    if (!botonAtajoActivo || e.data[0] === 248) return;

                    // Obtenemos el tipo que el botón está esperando (joystick, midi o pedal)
                    const tipoEsperado = botonAtajoActivo.dataset.esperandoTipo;
                    const dispositivoSeleccionado = localStorage.getItem(`config_device_${tipoEsperado}`);

                    // 🚨 LA CLAVE: Comparamos el nombre del puerto MIDI con el que guardamos
                    if (input.name.trim().includes(dispositivoSeleccionado)) {
                        if (e.data[0] >= 144 && e.data[0] <= 159 && e.data[2] > 0) {
                            registrarAtajoCapturado(`Nota ${e.data[1]}`);
                        } else if (e.data[0] >= 176 && e.data[0] <= 191 && e.data[2] > 0) {
                            registrarAtajoCapturado(`CC ${e.data[1]}`);
                        }
                    }
                };
            }
        });
    }
}
function registrarAtajoCapturado(valor) {
    if (botonAtajoActivo) {
        botonAtajoActivo.innerText = valor;
        botonAtajoActivo.style.color = "#ccc";
        botonAtajoActivo.style.borderColor = "#333";
        botonAtajoActivo.style.background = "#111"; // Regresamos al color gris
        cancelarEscuchas();
    }
}

function cancelarEscuchas() {
    window.removeEventListener('keydown', atraparTecla);
    if (loopJoystickActivo) {
        cancelAnimationFrame(loopJoystickActivo);
        loopJoystickActivo = null;
    }
    botonAtajoActivo = null;
}

function seleccionarSonidoPedal(nombre) {
    const display = document.getElementById('sonido-bombo-active-name');
    if (display) display.innerText = nombre;
    localStorage.setItem('config_sonido_pedal', nombre);
    
    // Cerramos el menú después de elegir
    ['joystick', 'teclado', 'midi', 'pedal', 'sonido-bombo'].forEach(id => {
        const m = document.getElementById(`menu-${id}`);
        if (m) m.classList.remove('active');
    });
}
function reproducirSonidoPedal(fuerza = 1) {
    // 🚨 EL ESCUDO: Si el botón de acceso rápido está en OFF, mutear el pedal (ignorar golpe)
    if (!pedalHabilitado) return; 

    if (audioCtxPedal.state === 'suspended') audioCtxPedal.resume();
    
    const tipoSonido = localStorage.getItem('config_sonido_pedal') || 'Bombo 1 (Acústico)';
    const tiempo = audioCtxPedal.currentTime;
    let volumenMaximo = 1.2 * fuerza;

    // --- 1. SI ES EL SONIDO PERSONALIZADO DEL USUARIO ---
    if (tipoSonido.startsWith('Propio:') && bufferPedalPersonalizado) {
        const fuente = audioCtxPedal.createBufferSource();
        const gain = audioCtxPedal.createGain();
        
        fuente.buffer = bufferPedalPersonalizado;
        fuente.connect(gain);
        gain.connect(audioCtxPedal.destination);
        
        gain.gain.setValueAtTime(volumenMaximo, tiempo);
        fuente.start(tiempo);
        return; // Detiene la función aquí para no hacer los sonidos falsos
    }

    // --- 2. MOTOR DE SONIDOS DIGITALES PREDETERMINADOS ---
    const osc = audioCtxPedal.createOscillator();
    const gain = audioCtxPedal.createGain();
    
    osc.connect(gain);
    gain.connect(audioCtxPedal.destination);

    if (tipoSonido === 'Bombo 1 (Acústico)') {
        osc.frequency.setValueAtTime(150, tiempo);
        osc.frequency.exponentialRampToValueAtTime(0.001, tiempo + 0.5);
        gain.gain.setValueAtTime(volumenMaximo, tiempo);
        gain.gain.exponentialRampToValueAtTime(0.001, tiempo + 0.5);
        
    } else if (tipoSonido === 'Bombo 2 (Punch)') {
        osc.frequency.setValueAtTime(250, tiempo);
        osc.frequency.exponentialRampToValueAtTime(0.001, tiempo + 0.2);
        gain.gain.setValueAtTime(volumenMaximo, tiempo);
        gain.gain.exponentialRampToValueAtTime(0.001, tiempo + 0.2);
        
    } else if (tipoSonido === 'Cajón Peruano') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(100, tiempo);
        osc.frequency.exponentialRampToValueAtTime(0.001, tiempo + 0.3);
        gain.gain.setValueAtTime(volumenMaximo, tiempo);
        gain.gain.exponentialRampToValueAtTime(0.001, tiempo + 0.3);
        
    } else if (tipoSonido === 'Caja (Snare)') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(200, tiempo);
        gain.gain.setValueAtTime(volumenMaximo, tiempo);
        gain.gain.exponentialRampToValueAtTime(0.001, tiempo + 0.2);
        
    } else if (tipoSonido === 'Hi-Hat Cerrado') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(8000, tiempo);
        gain.gain.setValueAtTime(volumenMaximo * 0.3, tiempo); // Platillo más bajito
        gain.gain.exponentialRampToValueAtTime(0.001, tiempo + 0.05);
        
    } else { // Pandereta
        osc.type = 'square';
        osc.frequency.setValueAtTime(8000, tiempo);
        osc.frequency.exponentialRampToValueAtTime(100, tiempo + 0.1);
        gain.gain.setValueAtTime(volumenMaximo, tiempo);
        gain.gain.exponentialRampToValueAtTime(0.001, tiempo + 0.1);
    }

    osc.start(tiempo);
    osc.stop(tiempo + 0.5);
}

function ejecutarAccionGlobal(inputFisico, fuerza = 1) { 
    if (typeof botonAtajoActivo !== 'undefined' && botonAtajoActivo !== null) return;

    let accionAejecutar = null;

    document.querySelectorAll('#section-dispositivos .dev-btn:nth-child(2), #shortcuts-joystick .dev-btn:nth-child(2), #shortcuts-teclado .dev-btn:nth-child(2), #shortcuts-midi .dev-btn:nth-child(2)').forEach(btnDOM => {
        if (btnDOM.innerText === inputFisico) {
            // 🔥 LEEMOS EL ID OCULTO, NO EL TEXTO EN INGLÉS
            const botonFuncion = btnDOM.previousElementSibling;
            accionAejecutar = botonFuncion.dataset.accionReal || botonFuncion.innerText; 
        }
    });

    const btnPedal = document.querySelector('#section-pedal .dev-btn');
    if (btnPedal && btnPedal.innerText === inputFisico) accionAejecutar = 'STOMP_BOX';

    if (!accionAejecutar) return;

    switch (accionAejecutar) {
        case 'STOMP_BOX':
            reproducirSonidoPedal(fuerza); // <-- Le pasamos la fuerza al sintetizador
            break;
            
        case 'Play - Desplazamiento':
            if (typeof toggleScroll === 'function') toggleScroll();
            break;
            
        case 'Metronomo':
            if (typeof toggleMetronomo === 'function') toggleMetronomo();
            break;
            
        case 'Desplazarse hacia abajo':
            window.scrollBy({ top: 150, behavior: 'smooth' });
            break;
            
        case 'Desplazarse hacia arriba':
            window.scrollBy({ top: -150, behavior: 'smooth' });
            break;
            
        case 'Página siguiente':
            // Baja casi toda la pantalla completa
            window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
            break;
            
        case 'Página anterior':
            window.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' });
            break;
            
        case 'Acercarse':
            if (typeof zoom === 'function') zoom(0.1);
            break;
            
        case 'Alejarse':
            if (typeof zoom === 'function') zoom(-0.1);
            break;
            
        case 'Restablecer zoom':
            if (typeof resetZoom === 'function') resetZoom();
            break;
            
        case 'Subir Tonalidad':
            if (typeof shiftModalTone === 'function') shiftModalTone(1);
            break;
            
        case 'Bajar Tonalidad':
            if (typeof shiftModalTone === 'function') shiftModalTone(-1);
            break;
    }
}

function escanearMandoEnVivo() {
    if (!localStorage.getItem('config_device_joystick') || localStorage.getItem('config_device_joystick') === 'Sin dispositivo') return;

    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (let i = 0; i < gamepads.length; i++) {
        const gp = gamepads[i];
        if (gp) {
            if (!gamepadRegistroPrevio[i]) gamepadRegistroPrevio[i] = { buttons: {}, axes: {} };
            
            // 1. Escanear Botones
            for (let b = 0; b < gp.buttons.length; b++) {
                const estaPresionado = gp.buttons[b].pressed;
                if (estaPresionado && !gamepadRegistroPrevio[i].buttons[b]) {
                    ejecutarAccionGlobal(`Botón ${b}`);
                }
                gamepadRegistroPrevio[i].buttons[b] = estaPresionado;
            }
            
            // 2. Escanear Flechas/Cruceta (Ejes)
            for (let a = 0; a < gp.axes.length; a++) {
                // Si la palanca se mueve más del 80%
                const valorEje = gp.axes[a];
                const estaPresionado = Math.abs(valorEje) > 0.8;
                const direccion = valorEje > 0 ? '+' : '-';
                const nombreEje = `Eje ${a} ${direccion}`;

                if (estaPresionado && !gamepadRegistroPrevio[i].axes[nombreEje]) {
                    ejecutarAccionGlobal(nombreEje);
                }
                
                // Guardamos el estado para evitar el efecto ametralladora
                gamepadRegistroPrevio[i].axes[nombreEje] = estaPresionado;
            }
        }
    }
    mandoEnVivoAnimationId = requestAnimationFrame(escanearMandoEnVivo);
}
// ==========================================================================
// ⚡ 15. Panel de Accesos Rápidos (El Rayito)
// ==========================================================================
function toggleQuickAccess() {
    const modal = document.getElementById('quick-modal');
    const isActive = modal.classList.contains('active');
    
    if (isActive) {
        cerrarQuickAccess();
    } else {
        cerrarTodoLoAbierto(); 
        actualizarEstadosQuickPanel(); 
        
        setTimeout(() => {
            modal.classList.add('active');
        }, 50);
    }
}

function cerrarQuickAccess() {
    const modal = document.getElementById('quick-modal');
    if (modal) modal.classList.remove('active');
}

// 🎛️ Revisa la base de datos y enciende/apaga las luces de los botones del panel
// 🎛️ Revisa la base de datos y enciende/apaga las luces de los botones del panel
function actualizarEstadosQuickPanel() {
    // 1. Reproductor
    const btnPlayer = document.getElementById('q-btn-player');
    const playerState = localStorage.getItem('config_adv_btn-multi') !== 'false';
    if (btnPlayer) {
        if (playerState) btnPlayer.classList.add('active'); else btnPlayer.classList.remove('active');
    }

    // 2. Pad (Accesos Rápidos)
    const btnPad = document.getElementById('q-btn-pad');
    const imgPad = document.getElementById('img-pad-rapido'); 
    if (btnPad) {
        btnPad.classList.add('active');
        if (imgPad) {
            imgPad.style.opacity = '1';
            imgPad.style.filter = 'none'; 
        }
    }

    // 3. Stomp Box (Pedal)
    const btnPedal = document.getElementById('q-btn-pedal');
    const txtPedal = document.getElementById('txt-pedal-estado');
    if (btnPedal && txtPedal) {
        if (pedalHabilitado) {
            btnPedal.classList.add('active');
            txtPedal.innerText = "PEDAL: ON";
        } else {
            btnPedal.classList.remove('active');
            txtPedal.innerText = "PEDAL: OFF";
        }
    }

    // 4. Tema
    const btnTheme = document.getElementById('q-btn-theme');
    const txtTheme = document.getElementById('txt-theme-estado');
    const isClaro = localStorage.getItem('config_tema_global') === 'claro';
    if (btnTheme && txtTheme) {
        if (isClaro) {
            btnTheme.classList.add('active');
            txtTheme.innerText = "TEMA CLARO";
            btnTheme.querySelector('.material-icons').innerText = "light_mode";
        } else {
            btnTheme.classList.remove('active');
            txtTheme.innerText = "TEMA OSCURO";
            btnTheme.querySelector('.material-icons').innerText = "dark_mode";
        }
    }

    // 5. Cifrado
    const btnCifrado = document.getElementById('q-btn-cifrado');
    const txtCifrado = document.getElementById('txt-cifrado-estado');
    const iconCifrado = document.getElementById('notation-icon'); 
    const isLatino = localStorage.getItem('config_cifrado') === 'latino';
    
    if (btnCifrado && txtCifrado && iconCifrado) {
        iconCifrado.style.width = "auto"; 
        iconCifrado.style.minWidth = "24px";
        
        if (isLatino) {
            btnCifrado.classList.add('active');
            txtCifrado.innerText = "LATINO";
            iconCifrado.innerText = "Do"; 
        } else {
            btnCifrado.classList.remove('active');
            txtCifrado.innerText = "ESTÁNDAR";
            iconCifrado.innerText = "C";  
        }
    }

    // 6. Botón de Diagramas
    const btnDiag = document.getElementById('q-btn-diagramas');
    const diagState = localStorage.getItem('config_diag_ubica') || 'oculto';
    if (btnDiag) {
        if (diagState !== 'oculto') {
            btnDiag.classList.add('active');
        } else {
            btnDiag.classList.remove('active');
        }
    }

    // 7. Instrumento (GUITAR / BAJO)
    const btnInst = document.getElementById('q-btn-instrumento');
    const txtInst = document.getElementById('txt-instrumento-estado');
    const imgInst = document.getElementById('img-inst-rapido'); 
    const instActual = localStorage.getItem('config_instrumento') || 'guitarra';

    if (btnInst && txtInst && imgInst) {
        if (instActual === 'bajo') {
            txtInst.innerText = 'BAJO';        
            imgInst.src = 'bajo.png';         
            btnInst.classList.add('active');
            imgInst.style.opacity = '1';      
        } else {
            txtInst.innerText = 'GUITAR';      
            imgInst.src = 'guitar.png';       
            btnInst.classList.remove('active');
            imgInst.style.opacity = '0.7';    
        }
    }

    // 🔥 8. ACORDES 🔥
    const btnVerAcordes = document.getElementById('q-btn-ver-acordes');
    const txtVerAcordes = document.getElementById('txt-ver-acordes');
    const iconVerAcordes = document.getElementById('icon-ver-acordes');
    const esconderAcordes = localStorage.getItem('config_esconder_acordes') === 'true';
    if (btnVerAcordes && txtVerAcordes && iconVerAcordes) {
        if (!esconderAcordes) {
            btnVerAcordes.classList.add('active');
            txtVerAcordes.innerText = "ACORDES: ON";
            iconVerAcordes.innerText = "music_note";
        } else {
            btnVerAcordes.classList.remove('active');
            txtVerAcordes.innerText = "ACORDES: OFF";
            iconVerAcordes.innerText = "music_off";
        }
    }

    // 🔥 9. LETRA 🔥
    const btnVerLetra = document.getElementById('q-btn-ver-letra');
    const txtVerLetra = document.getElementById('txt-ver-letra');
    const iconVerLetra = document.getElementById('icon-ver-letra');
    const esconderLetra = localStorage.getItem('config_esconder_letra') === 'true';
    if (btnVerLetra && txtVerLetra && iconVerLetra) {
        if (!esconderLetra) {
            btnVerLetra.classList.add('active');
            txtVerLetra.innerText = "LETRA: ON";
            iconVerLetra.innerText = "notes";
        } else {
            btnVerLetra.classList.remove('active');
            txtVerLetra.innerText = "LETRA: OFF";
            iconVerLetra.innerText = "format_strikethrough";
        }
    }

    // 🔥 10. NOTACIÓN 🔥
    const btnNotacion = document.getElementById('q-btn-notacion');
    const txtNotacion = document.getElementById('txt-notacion');
    const iconNotacion = document.getElementById('icon-notacion');
    const notacionActual = localStorage.getItem('config_notacion') || 'sostenidos';
    
    if (btnNotacion && txtNotacion && iconNotacion) {
        btnNotacion.classList.add('active'); 
        iconNotacion.style.width = "auto"; 
        iconNotacion.style.minWidth = "24px";

        if (notacionActual === 'sostenidos') {
            txtNotacion.innerText = "SOSTENIDO";
            iconNotacion.innerText = "#";
        } else if (notacionActual === 'bemoles') {
            txtNotacion.innerText = "BEMOL";
            iconNotacion.innerText = "b";
        } else if (notacionActual === 'mixto') {
            txtNotacion.innerText = "HÍBRIDO";
            iconNotacion.innerText = "#/b";
        }
    }

    // 🔥 11. AUTOPLAY MAESTRO (REEMPLAZA A SCROLL AUTO) 🔥
    const btnAutoplay = document.getElementById('q-btn-autoplay');
    const txtAutoplay = document.getElementById('txt-autoplay');
    const iconAutoplay = document.getElementById('icon-autoplay');
    const isAutoplay = localStorage.getItem('config_autoplay_master') === 'true';

    if (btnAutoplay && txtAutoplay && iconAutoplay) {
        if (isAutoplay) {
            btnAutoplay.classList.add('active');
            txtAutoplay.innerText = "AUTOPLAY: ON";
            iconAutoplay.innerText = "play_circle_filled";
            iconAutoplay.style.color = "var(--accent-color)";
        } else {
            btnAutoplay.classList.remove('active');
            txtAutoplay.innerText = "AUTOPLAY: OFF";
            iconAutoplay.innerText = "stop_circle"; 
            iconAutoplay.style.color = ""; // Regresa al color normal gris
        }
    }
}

// 🔥 REPARACIÓN DEL BOTÓN DE RETROCESO 🔥
function saltarAConfigRapido(seccionId) {
    cerrarQuickAccess();
    if (seccionId === 'afinador') {
        document.getElementById('modal-afinador').classList.add('active');
        iniciarMic(); 
    } else {
        origenAccesoRapido = true; // <-- ESTO ES LO QUE SOLUCIONA EL BOTÓN ATRÁS
        abrirConfig();
        cambiarSeccion(null, seccionId);
    }
}

function toggleDiagramasRapido() {
    const currentUbica = localStorage.getItem('config_diag_ubica') || 'oculto';
    const nuevoEstado = (currentUbica === 'oculto') ? 'inicio' : 'oculto';
    
    localStorage.setItem('config_diag_ubica', nuevoEstado);
    
    document.querySelectorAll('input[name="ubica"]').forEach(radio => {
        radio.checked = (radio.value === nuevoEstado);
    });

    if (typeof refrescarVisorActual === 'function') {
        refrescarVisorActual();
    }
    actualizarEstadosQuickPanel();
}

function toggleReproductorRapido() {
    // 1. Leemos la verdad absoluta de la memoria
    const estadoActual = localStorage.getItem('config_adv_btn-multi') !== 'false';
    const nuevoEstado = !estadoActual; // Si era true, ahora es false

    // 2. Guardamos la nueva orden
    localStorage.setItem('config_adv_btn-multi', nuevoEstado);

    // 3. Mostramos u ocultamos el reproductor INSTANTÁNEAMENTE
    const player = document.getElementById('floating-player');
    if (player) player.style.display = nuevoEstado ? 'flex' : 'none';

    // 4. Sincronizamos el checkbox oculto de Ajustes por si acaso
    const chk = document.getElementById('adv-btn-multi');
    if (chk) chk.checked = nuevoEstado;

    // 5. Refrescamos las luces del rayito
    actualizarEstadosQuickPanel();
}

function togglePadRapido() {
    const modal = document.getElementById('modal-pads-rayo');
    const grid = document.getElementById('grid-pads-rayo');
    if (!modal || !grid) return;

    const isMinor = localStorage.getItem('config_pads_menores') === 'true';
    const switchMenores = document.getElementById('rayo-pads-menores');
    if (switchMenores) switchMenores.checked = isMinor;

    const notas = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

    grid.innerHTML = notas.map(n => {
        const esActivo = (typeof notaPadActual !== 'undefined' && notaPadActual === n) ? 'activo-pad' : '';
        const textoMenor = padRelativos[n];
        
        return `
            <div class="pad-btn ${esActivo}" onclick="togglePad('${n}', this)">
                <span class="pad-main-text">${isMinor ? textoMenor : n}</span>
                <span class="pad-corner-text">${isMinor ? n : textoMenor}</span>
            </div>
        `;
    }).join('');

    cerrarQuickAccess(); 
    modal.classList.add('active'); 
}

function sincronizarMenoresRayo(checked) {
    // 1. Guardamos la preferencia
    localStorage.setItem('config_pads_menores', checked);

    // 3. Cambiamos los textos al instante
    document.querySelectorAll('#grid-pads-rayo .pad-btn').forEach(btn => {
        const mainText = btn.querySelector('.pad-main-text');
        const cornerText = btn.querySelector('.pad-corner-text');
        
        let notaMayor = Object.keys(padRelativos).find(key => 
            key === mainText.innerText || padRelativos[key] === mainText.innerText
        );

        if (notaMayor) {
            if (checked) {
                mainText.innerText = padRelativos[notaMayor];
                cornerText.innerText = notaMayor;
            } else {
                mainText.innerText = notaMayor;
                cornerText.innerText = padRelativos[notaMayor];
            }
        }
    });

    // 4. Sincronizamos con ajustes generales si existen
    const mainSwitch = document.getElementById('adv-pads-menores');
    if (mainSwitch) {
        mainSwitch.checked = checked;
        if (typeof togglePadsMenores === 'function') togglePadsMenores();
    }
}
function toggleInstrumentoRapido() {
    const current = localStorage.getItem('config_instrumento') || 'guitarra';
    const nuevo = (current === 'guitarra') ? 'bajo' : 'guitarra';
    
    localStorage.setItem('config_instrumento', nuevo);
    if (typeof refrescarVisorActual === 'function') refrescarVisorActual();
    
    document.querySelectorAll('#section-diagramas .segment-item').forEach(item => {
        const txt = item.innerText.toLowerCase();
        if (txt === 'guitarra' || txt === 'bajo') {
            item.classList.toggle('active', txt === nuevo);
        }
    });

    actualizarEstadosQuickPanel();
}

function togglePedalRapido() {
    pedalHabilitado = !pedalHabilitado;
    
    // 🔥 Guardamos el estado en memoria para que no se olvide al reiniciar
    localStorage.setItem('config_pedal_on', pedalHabilitado); 
    
    actualizarEstadosQuickPanel();
}

function toggleTemaRapido() {
    const current = localStorage.getItem('config_tema_global') || 'oscuro';
    const nuevoTema = current === 'claro' ? 'oscuro' : 'claro';
    cambiarTemaGlobal(nuevoTema);
    
    const rd = document.getElementById('radio-tema-' + nuevoTema);
    if (rd) rd.checked = true;
    
    actualizarEstadosQuickPanel();
}

function toggleCifradoRapido() {
    const current = localStorage.getItem('config_cifrado') || 'estandar';
    const nuevo = current === 'estandar' ? 'latino' : 'estandar';
    
    localStorage.setItem('config_cifrado', nuevo);
    if (typeof refrescarVisorActual === 'function') refrescarVisorActual(); 
    
    document.getElementById('song-search')?.dispatchEvent(new Event('input')); // 🔥 REPINTADO EN VIVO
    
    document.querySelectorAll('#section-diagramas .segment-item').forEach(item => {
        const onclickText = (item.getAttribute('onclick') || '').toLowerCase();
        if (onclickText.includes(`'estandar'`) || onclickText.includes(`'latino'`)) {
            item.classList.remove('active');
            if (onclickText.includes(`'${nuevo}'`)) item.classList.add('active');
        }
    });

    actualizarEstadosQuickPanel(); 
}

// 🔥 NUEVAS FUNCIONES DE BOTONES RÁPIDOS 🔥

function toggleVerAcordesRapido() {
    const check = document.getElementById('switch-esconder-acordes');
    if (check) {
        check.checked = !check.checked;
        toggleEsconderAcordes(); // Reutiliza tu función original
    }
    actualizarEstadosQuickPanel();
}

function toggleVerLetraRapido() {
    const check = document.getElementById('switch-esconder-letra');
    if (check) {
        check.checked = !check.checked;
        toggleEsconderLetra(); // Reutiliza tu función original
    }
    actualizarEstadosQuickPanel();
}

function toggleNotacionRapido() {
    const current = localStorage.getItem('config_notacion') || 'sostenidos';
    let nuevo = 'sostenidos';
    
    if (current === 'sostenidos') nuevo = 'bemoles';
    else if (current === 'bemoles') nuevo = 'mixto';
    else if (current === 'mixto') nuevo = 'sostenidos';

    localStorage.setItem('config_notacion', nuevo);
    
    // Sincronizar con el menú de ajustes internos
    document.querySelectorAll('#section-diagramas .segment-item').forEach(item => {
        const onclickText = (item.getAttribute('onclick') || '').toLowerCase();
        if (onclickText.includes(`'sostenidos'`) || onclickText.includes(`'bemoles'`) || onclickText.includes(`'mixto'`)) {
            item.classList.remove('active');
            if (onclickText.includes(`'${nuevo}'`)) item.classList.add('active');
        }
    });

    if (typeof refrescarVisorActual === 'function') refrescarVisorActual();
	document.getElementById('song-search')?.dispatchEvent(new Event('input'));
    actualizarEstadosQuickPanel();
}
function toggleScrollAutoRapido() {
    const estadoActual = localStorage.getItem('config_scroll_auto') !== 'false';
    localStorage.setItem('config_scroll_auto', !estadoActual);
    
    actualizarEstadosQuickPanel();

    // 🔥 MAGIA: Si el autoscroll está andando, lo reiniciamos imperceptiblemente 
    // para que tome el cambio al instante.
    if (typeof isScrolling !== 'undefined' && isScrolling) {
        toggleScroll(); // Apaga
        toggleScroll(); // Prende con la nueva configuración
    }
}
function togglePadDesdeFlotante() {
    const btnFlotante = document.getElementById('btn-player-pads');
    if (!btnFlotante) return;
    
    // 1. Leemos el tono de la cabecera
    let tonoTexto = document.getElementById('header-tone-label').innerText.trim();
    if (tonoTexto === "--" || !tonoTexto) return;
    
    // 2. Nos aseguramos de capturar solo la nota base (limpiamos si dice "Am7" o "Cmaj7")
    const match = tonoTexto.match(/^([A-G][#b]?m?)/i);
    if (!match) return;
    
    // Convertimos la primera letra a mayúscula (ej: "am" -> "Am", "f#m" -> "F#m")
    let notaBuscada = match[1];
    notaBuscada = notaBuscada.charAt(0).toUpperCase() + notaBuscada.slice(1).toLowerCase();

    let notaPadFinal = notaBuscada; // Asumimos que es mayor de inicio

    // 4. TRADUCCIÓN: Si termina en 'm', buscamos en el diccionario
    if (notaBuscada.endsWith('m')) {
        for (const [mayor, menor] of Object.entries(padRelativos)) {
            if (menor === notaBuscada) {
                notaPadFinal = mayor; // Encontramos la equivalencia (Ej: 'F#m' -> 'A')
                break;
            }
        }
    }

    // 5. ACTIVACIÓN: Buscamos el ID del botón (ej: 'pad-btn-A' o 'pad-btn-Fs')
    const idBoton = 'pad-btn-' + notaPadFinal.replace('#', 's');
    const btnPadReal = document.getElementById(idBoton);

    if (btnPadReal) {
        // Comprobamos si el pad ya está sonando
        if (notaPadActual === notaPadFinal) {
            detenerPad();
            btnFlotante.classList.remove('activo-pad');
        } else {
            togglePad(notaPadFinal, btnPadReal);
            btnFlotante.classList.add('activo-pad');
        }
    } else {
        console.warn("No se encontró el pad correspondiente en el HTML: " + idBoton);
    }
}
// ==========================================================================
// 📥 16. Importación, Exportación y PDF
// ==========================================================================
async function importarArchivo(tipo, modo) {
    cerrarTodoLoAbierto(); 

    const input = document.createElement('input');
    input.type = 'file';
    
    // Filtros de extensión
    if (tipo === 'pdf') input.accept = '.pdf';
    else if (tipo === 'word') input.accept = '.docx';
    else if (tipo === 'image') input.accept = 'image/*';
    else if (tipo === 'pbk') input.accept = '.pbk';
    else if (tipo === 'cho') input.accept = '.cho,.crd,.pro';

    input.onchange = async (e) => {
        const archivo = e.target.files[0];
        if (!archivo) return;

        if (modo === 'view') {
            // 🔥 MAGIA AQUÍ: Limpiamos la extensión y separamos Título de Artista
            let nombreLimpio = archivo.name.replace(/\.[^/.]+$/, "").trim();
            let tituloFinal = nombreLimpio.toUpperCase();
            let artistaFinal = t('js_visual_file');

            // Si el nombre tiene guion (Ej: "Way Maker - Leeland.pdf")
            if (nombreLimpio.includes("-")) {
                const partes = nombreLimpio.split("-");
                artistaFinal = partes.pop().trim().toUpperCase();
                tituloFinal = partes.join("-").trim().toUpperCase();
            }

            const lector = new FileReader();
            lector.onload = function(event) {
                const nuevaCancion = {
                    title: tituloFinal, 
                    artist: artistaFinal,
                    tone: "VISUAL",
                    lyrics: `--- ${t('js_visual_file')} ---`,
                    folder: "Sin Categoría",
                    tipoArchivo: tipo,
                    urlArchivo: event.target.result, 
                    isVisual: true,
                    fecha: new Date().toISOString()
                };
                listaDeCanciones.unshift(nuevaCancion); 
                actualizarAlmacenamiento(); 
                renderSongs(listaDeCanciones); 
                cerrarTodoLoAbierto(); 
            };
            lector.readAsDataURL(archivo);
            
        } else if (tipo === 'pbk' || tipo === 'cho') {
            procesarImportacionNativa(archivo, tipo);
        } else {
            if (tipo === 'word') procesarImportacionWord(archivo); 
            else if (tipo === 'pdf') procesarPDFPorPaginas(archivo); 
        }
    };
    input.click();
}
async function procesarImportacionWord(archivo) {
    const arrayBuffer = await archivo.arrayBuffer();
    
    mammoth.extractRawText({ arrayBuffer: arrayBuffer })
        .then(function(result) {
            const textoCompleto = result.value;
            const patronSeparador = /\n(?=[A-Z\sÑÁÉÍÓÚ]+(?<!-).*\s\([A-G][#b]?m?\)\s*(\n|$))/g;
            const bloques = textoCompleto.split(patronSeparador);
            let cancionesNuevas = 0;

            bloques.forEach((bloque) => {
                const contenido = bloque.trim();
                if (contenido.length < 20) return;

                const lineas = contenido.split('\n');
                const primeraLinea = lineas[0].trim();
                
                const regexTono = /\(([A-G][#b]?m?)\)$/i;
                const matchTono = primeraLinea.match(regexTono);
                if (!matchTono) return; 

                let tono = matchTono[1];
                let restoLinea = primeraLinea.replace(matchTono[0], "").trim();

                if (/^[A-G\s\-]+$/i.test(restoLinea)) return; 

                let artista = t('js_imported_word');
                let titulo = restoLinea;

                const regexArtistaParentesis = /\(([^)]+)\)$/;
                const matchArtPar = restoLinea.match(regexArtistaParentesis);

                if (matchArtPar) {
                    artista = matchArtPar[1].trim().toUpperCase();
                    titulo = restoLinea.replace(matchArtPar[0], "").trim().toUpperCase();
                } else if (restoLinea.includes(" - ")) {
                    const partes = restoLinea.split(/ - /);
                    if (partes.length >= 2) {
                        artista = partes.pop().trim().toUpperCase(); 
                        titulo = partes.join(" - ").trim().toUpperCase(); 
                    }
                } else {
                    titulo = restoLinea.toUpperCase();
                }

                // Filtro limpiador avanzado para Word
				// Sin filtros: la letra se pega exactamente como viene de Word
                const letraProcesada = lineas.slice(1)
                    .join('\n')
                    .replace(/\n\n/g, '\n')
                    .trim();

                listaDeCanciones.unshift({ // <-- Cambiado de push a unshift
                    title: titulo, artist: artista, tone: tono,
                    lyrics: letraProcesada, folder: "Sin Categoría",
                    tipoArchivo: "word", fecha: new Date().toISOString()
                });
                cancionesNuevas++;
            });

            if (cancionesNuevas > 0) {
                actualizarAlmacenamiento();
                renderSongs(listaDeCanciones);
            }
        })
        .catch(err => console.error("Error:", err));
}
function procesarImportacionNativa(archivo, tipo) {
    const lang = localStorage.getItem('config_idioma') || 'es'; // 🔥 TRADUCCIÓN
    const lector = new FileReader();
    lector.onload = function(e) {
        try {
            const contenido = e.target.result;
            
            if (tipo === 'pbk') {
                const data = JSON.parse(contenido);
                
                // Si es un backup entero (.pbk de la app)
                if (data.canciones && Array.isArray(data.canciones)) {
                    let cancionesNuevas = data.canciones;
                    listaDeCanciones = [...cancionesNuevas, ...listaDeCanciones];
                    alert(lang === 'en' ? `Success! ${cancionesNuevas.length} songs were imported to your library.` : `¡Éxito! Se importaron ${cancionesNuevas.length} canciones a tu biblioteca.`);
                } 
                // Si es una sola canción compartida
                else if (data.title) {
                    data.fecha = new Date().toISOString();
                    listaDeCanciones.unshift(data);
                    alert(lang === 'en' ? `Song "${data.title}" added successfully.` : `Canción "${data.title}" añadida con éxito.`);
                } else {
                    throw new Error(lang === 'en' ? "Corrupted or empty .pbk file." : "Archivo .pbk corrupto o vacío.");
                }
            } 
            else if (tipo === 'cho') {
                const cancionTraducida = parsearChordPro(contenido);
                listaDeCanciones.unshift(cancionTraducida);
                alert(lang === 'en' ? `Song "${cancionTraducida.title}" translated and imported.` : `Canción "${cancionTraducida.title}" traducida e importada.`);
            }

            actualizarAlmacenamiento();
            renderSongs(listaDeCanciones);

        } catch (err) {
            alert((lang === 'en' ? "Error reading file: " : "Error al leer el archivo: ") + err.message);
            console.error(err);
        }
    };
    lector.readAsText(archivo);
}
async function procesarPDFPorPaginas(archivo) {
    const reader = new FileReader();
    reader.onload = async function() {
        try {
            const typedarray = new Uint8Array(this.result);
            const pdf = await pdfjsLib.getDocument(typedarray).promise;
            let cancionesNuevas = 0;

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                
                let lineasTexto = [];
                let yActual = -1;
                let lineaActual = "";

                for (let item of content.items) {
                    if (yActual !== -1 && Math.abs(yActual - item.transform[5]) > 5) {
                        lineasTexto.push(lineaActual.trim());
                        lineaActual = "";
                    }
                    lineaActual += item.str + " ";
                    yActual = item.transform[5];
                }
                lineasTexto.push(lineaActual.trim());
                const textoLimpio = lineasTexto.filter(l => l !== "");
                if (textoLimpio.length < 1) continue;

                let primeraLinea = textoLimpio[0];
                let tonoEncontrado = "--";
                let artistaEncontrado = t('js_imported_pdf');

                const regexPdfTono = /[\s\-(]([A-G][#b]?m?)\)?$/i;
                const matchTono = primeraLinea.match(regexPdfTono);

                if (matchTono) {
                    tonoEncontrado = matchTono[1];
                    primeraLinea = primeraLinea.replace(matchTono[0], "").trim();
                }

                const regexArtistaParentesis = /\(([^)]+)\)$/;
                const matchArtPar = primeraLinea.match(regexArtistaParentesis);

                if (matchArtPar) {
                    artistaEncontrado = matchArtPar[1].trim().toUpperCase();
                    primeraLinea = primeraLinea.replace(matchArtPar[0], "").trim();
                } 
                else if (primeraLinea.includes(" - ")) {
                    const partes = primeraLinea.split(" - ");
                    artistaEncontrado = partes.pop().trim().toUpperCase();
                    primeraLinea = partes.join(" - ").trim();
                }

                if (tonoEncontrado === "--") {
                    const textoCompletoHoja = textoLimpio.join('\n');
                    const patronAcordesGlobal = /(?<![A-Za-z])([A-G][#b]?)(m|maj|7|sus|add|dim|aug|[0-9])*(?![A-Za-z])/g;
                    const todosLosAcordes = textoCompletoHoja.match(patronAcordesGlobal);
                    
                    if (todosLosAcordes && todosLosAcordes.length > 0) {
                        const excluidas = ["As", "Va", "He", "Me", "Solo", "Fue", "Del", "Al"];
                        const primeraNotaReal = todosLosAcordes.find(n => !excluidas.includes(n.trim()));
                        if (primeraNotaReal) tonoEncontrado = primeraNotaReal.trim().toUpperCase();
                    }
                }

                const letraCuerpo = textoLimpio.slice(1).join('\n').trim();

                listaDeCanciones.unshift({ // <-- Cambiado de push a unshift
                    title: primeraLinea.toUpperCase(),
                    artist: artistaEncontrado,
                    tone: tonoEncontrado,
                    lyrics: letraCuerpo,
                    folder: "Sin Categoría",
                    tipoArchivo: "pdf",
                    fecha: new Date().toISOString()
                });
                cancionesNuevas++;
            }

            if (cancionesNuevas > 0) {
                actualizarAlmacenamiento();
                renderSongs(listaDeCanciones);
            }
        } catch (err) {
            console.error("Error PDF:", err);
        }
    };
    reader.readAsArrayBuffer(archivo);
}
function renderizarSiEsPDF(index) {
    const song = cancionesEnCarrusel[index];
    const contenedorID = `pdf-slide-${index}`;
    const contenedor = document.getElementById(contenedorID);

    if (song && song.tipoArchivo === 'pdf' && contenedor && !contenedor.querySelector('canvas')) {
        renderizarPDFEnContenedor(song.urlArchivo, contenedorID);
    }
}

async function renderizarPDFEnContenedor(url, id) {
    const contenedor = document.getElementById(id);
    if (!contenedor) return;

    try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        contenedor.innerHTML = ''; 

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            const viewport = page.getViewport({scale: 2.0});
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            canvas.style.width = "100%"; 

            await page.render({canvasContext: context, viewport: viewport}).promise;
            contenedor.appendChild(canvas);
        }
    } catch (e) {
        contenedor.innerHTML = `<div style="color:red; text-align:center; padding:20px;">${t('js_pdf_error')}</div>`;
    }
}
function compartirCancion(index) {
    cerrarTodoLoAbierto();
    window.cancionCompartirIndex = index;
    abrirVistaPreviaCompartir();
}

function compartirCancionActual() {
    let tituloPantalla = document.querySelector('.main-title').innerText;
    
    if (!tituloPantalla || tituloPantalla.includes("---") || tituloPantalla.includes("Selecciona") || tituloPantalla.includes("Select")) {
        alert(t('js_err_open_first')); 
        return;
    }

    // El purificador de textos
    const limpiezaNuclear = (texto) => {
        if (!texto) return "";
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    };

    let tituloLimpio = limpiezaNuclear(tituloPantalla);
    
    let index = listaDeCanciones.findIndex(c => limpiezaNuclear(c.title || c.titulo) === tituloLimpio);
    if (index === -1) {
        index = listaDeCanciones.findIndex(c => limpiezaNuclear(c.title || c.titulo).includes(tituloLimpio));
    }

    window.cancionCompartirIndex = index !== -1 ? index : null;
    abrirVistaPreviaCompartir();
}
async function ejecutarCompartirNativo(formato) {
    const lang = localStorage.getItem('config_idioma') || 'es'; // 🔥 TRADUCCIÓN
    let song;
    if (window.cancionCompartirIndex !== null && window.cancionCompartirIndex !== undefined) {
        song = listaDeCanciones[window.cancionCompartirIndex];
    } else {
        const titulo = document.querySelector('.main-title').innerText.trim();
        song = { title: titulo, artist: document.querySelector('.author-name').innerText.trim(), tone: document.getElementById('header-tone-label').innerText.trim(), lyrics: document.querySelector('.lyrics-container').innerText };
    }

    if (!song || song.title === "---") return;

    if (formato === 'pbk' || formato === 'cho') {
        let contenido, mimeType, extension;
        if (formato === 'pbk') {
            contenido = JSON.stringify(song);
            mimeType = 'application/json';
            extension = '.pbk';
        } else {
            contenido = `{title: ${song.title}}\n{artist: ${song.artist || ''}}\n{key: ${song.tone || ''}}\n\n${song.lyrics || ''}`;
            mimeType = 'text/plain';
            extension = '.cho';
        }
        
        cerrarVistaPreviaCompartir();
        const nombreArchivo = `${song.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}${extension}`;
        const blob = new Blob([contenido], { type: mimeType });
        
        compartirArchivoAndroid(blob, nombreArchivo);
        return;
    }

    if (formato === 'pdf') {
        if (!window.lastCompPagesHTML) return;
        
        abrirModalDinamico(lang === 'en' ? "PREPARING PDF..." : "PREPARANDO PDF...", false, () => {});
        document.getElementById('md-mensaje').innerText = lang === 'en' ? "Generating file, please wait..." : "Generando archivo, un momento...";

        if (typeof html2pdf === 'undefined') {
            const script = document.createElement('script');
            script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
            script.onload = () => procesarPDFParaMenuNativo(song);
            document.head.appendChild(script);
        } else {
            procesarPDFParaMenuNativo(song);
        }
    }
}
function abrirVistaPreviaCompartir() {
    cerrarTodoLoAbierto();
    
    if (typeof cerrarQuickAccess === 'function') cerrarQuickAccess();
    const configModal = document.getElementById('config-modal');
    if (configModal) configModal.classList.remove('active');

    const modal = document.getElementById('modal-compartir');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10);
        
        // 🚨 NUEVA LÍNEA: Actualiza el texto visual a 2 columnas
        document.getElementById('comp-cols-val').innerText = "2 columnas por hoja";
        
        generarMiniaturasPDF();
    }
}

function cerrarVistaPreviaCompartir() {
    const modal = document.getElementById('modal-compartir');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 350);
    }
}

// 2. Controles de Configuración de Compartir
function cambiarEscalaComp(val) {
    compSettings.escala += val;
    if (compSettings.escala < 50) compSettings.escala = 50;
    if (compSettings.escala > 200) compSettings.escala = 200;
    document.getElementById('comp-escala-val').innerText = compSettings.escala + " %";
    generarMiniaturasPDF();
}

function cambiarOrientacionComp(modo) {
    compSettings.orientacion = modo;
    // 🔥 TRADUCCIÓN:
    document.getElementById('comp-ori-label').innerText = modo === 'portrait' ? t('js_vertical') : t('js_horizontal');
    document.getElementById('btn-comp-ori-vert').classList.toggle('active-ori', modo === 'portrait');
    document.getElementById('btn-comp-ori-horiz').classList.toggle('active-ori', modo === 'landscape');
    generarMiniaturasPDF();
}

function ciclarColumnasComp() {
    let limiteColumnas = 3;

    // 🔥 INTELIGENCIA: Misma lógica para compartir PDF
    if (compSettings.columnas === 2 && compSettings.totalPaginas === 1) {
        limiteColumnas = 2;
    }

    compSettings.columnas++;
    
	if (compSettings.columnas > limiteColumnas) {
        compSettings.columnas = 1;
    }

    // 🔥 TRADUCCIÓN:
    const texto = compSettings.columnas === 1 ? t('js_col_single') : `${compSettings.columnas} ${t('js_col_multi')}`;
    document.getElementById('comp-cols-val').innerText = texto;
    generarMiniaturasPDF();
}
async function compartirArchivoAndroid(blob, nombreArchivo) {
    const lang = localStorage.getItem('config_idioma') || 'es'; // 🔥 TRADUCCIÓN

    if (window.Capacitor && window.Capacitor.isNativePlatform()) {
        // --- ESTO ES PARA EL APK NATIVO (Se queda igual, funciona perfecto) ---
        const reader = new FileReader();
        reader.readAsDataURL(blob); 
        
        reader.onloadend = async function() {
            try {
                const base64data = reader.result;
                const { Filesystem, Share } = Capacitor.Plugins;

                const savedFile = await Filesystem.writeFile({
                    path: nombreArchivo,
                    data: base64data,
                    directory: 'CACHE'
                });

                await Share.share({
                    title: nombreArchivo,
                    url: savedFile.uri,
                    dialogTitle: lang === 'en' ? 'Share File' : 'Compartir Archivo'
                });
            } catch (e) {
                alert((lang === 'en' ? "Android system error: " : "Error del sistema Android: ") + e.message);
            }
        };
    } else {
        // --- 🔥 LA MAGIA PARA LA WEB / CLOUDFLARE PAGES 🔥 ---
        const mimeType = nombreArchivo.endsWith('.pdf') ? 'application/pdf' : 
                         nombreArchivo.endsWith('.pbk') ? 'application/json' : 'text/plain';
                         
        const archivoReal = new File([blob], nombreArchivo, { type: mimeType });

        // Si es un celular moderno (Soporta ventana nativa)
        if (navigator.canShare && navigator.canShare({ files: [archivoReal] })) {
            try {
                await navigator.share({
                    files: [archivoReal],
                    title: nombreArchivo,
                    text: (lang === 'en' ? 'I share with you: ' : 'Te comparto: ') + nombreArchivo
                });
                return; 
            } catch (err) {
                console.log(lang === 'en' ? "Mission aborted by user." : "Misión abortada por el usuario.");
                return; // <--- ESTE RETURN EVITA QUE SE DESCARGUE AL CANCELAR
            }
        } 
        // Si es una PC de escritorio (No tiene ventana nativa)
        else {
            const url = URL.createObjectURL(archivoReal);
            const a = document.createElement('a');
            a.href = url;
            a.download = nombreArchivo;
            document.body.appendChild(a); 
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 2000);
        }
    }
}
function generarMiniaturasPDF() {
    const containerId = 'comp-thumbnails-container';
    const optColoresId = 'comp-opt-colores';
    const optAcordesId = 'comp-opt-acordes';
    const settings = compSettings; 
    const scopeId = 'comp-preview-' + Date.now();

    const container = document.getElementById(containerId);
    if (!container) return;

    container.style.cssText = 'display: flex; flex-direction: row; overflow-x: auto; gap: 20px; padding: 15px 20px; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; justify-content: flex-start;';

    const conColores = document.getElementById(optColoresId).checked;
    const conAcordes = document.getElementById(optAcordesId).checked;
    
    let song, titulo, artista, tonoImpresion;

    // LÓGICA BLINDADA DE OBTENCIÓN DE CANCIÓN
    if (window.cancionCompartirIndex !== null && window.cancionCompartirIndex !== undefined) {
        song = listaDeCanciones[window.cancionCompartirIndex];
    } else {
        let tituloPantalla = document.querySelector('.main-title').innerText;
        const limpiezaNuclear = (texto) => texto ? texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase() : "";
        song = listaDeCanciones.find(c => limpiezaNuclear(c.title || c.titulo) === limpiezaNuclear(tituloPantalla));
        
        if (!song) {
            alert("Error crítico: No se pudo cargar la canción para imprimir. Intenta abrirla de nuevo.");
            cerrarVistaPreviaCompartir();
            return;
        }
    }

    titulo = song.title;
    artista = song.artist || "Desconocido";
    
    // Si la pantalla tiene un tono visual (Ej: Capo aplicado), priorizamos la pantalla, si no, el de la BD.
    let tonoPantalla = document.getElementById('header-tone-label').innerText.trim();
    tonoImpresion = (tonoPantalla !== "--" && tonoPantalla !== "") ? tonoPantalla : (song.tone || "--");

    // Mensaje para archivos visuales
    if (song.isVisual) {
        const msj = t('js_visual_share_msg'); 
        container.innerHTML = `<div style="color:#888; text-align:center; width:100%; padding:20px; font-family:var(--f-medium);">${msj}</div>`;
        return;
    }

    // ... (A PARTIR DE AQUÍ DEJAS TU CÓDIGO INTACTO) ...
    let letraARenderizar = song.lyrics;
    const tonoOriginal = song.tone || "--";

    // Transposición General
    if (tonoOriginal !== "--" && tonoImpresion !== "--" && tonoOriginal !== tonoImpresion) {
        const matchOrig = tonoOriginal.match(/^([A-G][#b]?)/i);
        const matchAct = tonoImpresion.match(/^([A-G][#b]?)/i);
        if (matchOrig && matchAct) {
            const notaOrig = normalizeMap[matchOrig[1].toUpperCase()] || matchOrig[1].toUpperCase();
            const notaAct = normalizeMap[matchAct[1].toUpperCase()] || matchAct[1].toUpperCase();
            const idxOrig = notes.indexOf(notaOrig);
            const idxAct = notes.indexOf(notaAct);
            if (idxOrig !== -1 && idxAct !== -1) {
                const diff = (idxAct - idxOrig + 12) % 12;
                letraARenderizar = transponerTexto(letraARenderizar, diff);
            }
        }
    }

    // Capo
    let capaCapoHTML = "";
    if (typeof currentCapo !== 'undefined' && currentCapo > 0) {
        letraARenderizar = transponerTexto(letraARenderizar, -currentCapo);
        let tonoConCapo = transponerTexto(tonoImpresion, -currentCapo);
        capaCapoHTML = `<div style="font-size: 10px; color: #666; margin-top: 5px; font-weight: bold; text-transform: uppercase;">Capo ${currentCapo} - (Forma ${tonoConCapo})</div>`;
    }

    let contenidoPuro = formatearLetra(letraARenderizar);

    // Estilos dinámicos
    const rootStyles = getComputedStyle(document.documentElement);
    const bodyStyles = getComputedStyle(document.body); 
    const accentColor = conColores ? (rootStyles.getPropertyValue('--accent-color').trim() || '#00FFFF') : '#333333';
    let chordColorPrint = conColores ? (bodyStyles.getPropertyValue('--chord-color').trim() || accentColor) : '#000000';
    const headerColorPrint = conColores ? accentColor : '#666666';
    
    if (['#ffffff', '#fff', 'rgb(255, 255, 255)'].includes(chordColorPrint.toLowerCase())) {
        chordColorPrint = '#121212';
    }

    const ocultarAcordesCSS = conAcordes ? "" : ".thumb-preview-scope .chord, .thumb-preview-scope .linea-acorde { display: none !important; }";

    // Variables de Layout
    const isLandscape = settings.orientacion === 'landscape';
    const RATIO = isLandscape ? 0.20 : 0.23; 
    const A4_W = isLandscape ? 1123 : 794; 
    const A4_H = isLandscape ? 794 : 1123;
    const MARGIN = 50; 
    const CONT_W = A4_W - (MARGIN * 2); 
    const CONT_H = A4_H - (MARGIN * 2); 
    const GAP = 40; 
    const COLS = settings.columnas;

    const baseFontSizeStr = bodyStyles.getPropertyValue('--user-font-size').trim() || '15px';
    const finalFontSize = parseFloat(baseFontSizeStr) * (settings.escala / 100); 

    const headerHTML = `
        <div style="margin-bottom: 25px; border-bottom: 2px solid #ddd; padding-bottom: 15px; font-family: Helvetica, Arial, sans-serif;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0;">
                <div style="flex: 1; text-align: left; font-size: 14px; color: #555; font-weight: normal;">${artista}</div>
                <div style="flex: 2; text-align: center;">
                    <h1 style="margin: 0; font-size: 20px; text-transform: uppercase; font-weight: 900; color: #333333;">${titulo}</h1>
                </div>
                <div style="flex: 1; display: flex; flex-direction: column; align-items: flex-end;">
                    <div style="display: inline-block; padding: 4px 14px; background: #eee; color: #333; border-radius: 12px; font-weight: bold; font-size: 13px; border: 1px solid #ccc;">TONO: ${tonoImpresion}</div>
                    ${capaCapoHTML}
                </div>
            </div>
        </div>
    `;

    const workspace = document.createElement('div');
    workspace.style.cssText = `position: absolute; visibility: hidden; pointer-events: none; width: ${A4_W}px; top: 0; left: 0; z-index: -9999; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;`;
    
    const styleBlock = document.createElement('style');
    styleBlock.innerHTML = `
        #${scopeId} .thumb-preview-scope .chord { color: ${chordColorPrint} !important; font-weight: 900 !important; font-size: ${finalFontSize}px !important; display: block; margin:0; padding:0;}
        #${scopeId} .thumb-preview-scope .linea-acorde .chord { display: inline; }
        #${scopeId} .thumb-preview-scope .linea-encabezado-txt { font-weight: 900 !important; display: inline-block; text-transform: uppercase; margin-top: 15px; color: ${headerColorPrint} !important; font-size: ${finalFontSize}px !important;}
        #${scopeId} .thumb-preview-scope .chunk-lyric { color: #121212 !important; }
        #${scopeId} .thumb-preview-scope .linea-letra-normal { color: #121212 !important; }
        #${scopeId} .thumb-preview-scope .apunte-regla { color: #888 !important; font-style: italic !important; }
        
        #${scopeId} .thumb-preview-scope .bloque-seccion-general, 
        #${scopeId} .thumb-preview-scope .linea-sincronizada, 
        #${scopeId} .thumb-preview-scope .linea-letra-normal, 
        #${scopeId} .thumb-preview-scope .linea-acorde {
            break-inside: avoid; page-break-inside: avoid; -webkit-column-break-inside: avoid;
        }

        #${scopeId} .thumb-preview-scope .linea-sincronizada { display: block; margin-top: 8px; }
        #${scopeId} .thumb-preview-scope .word-wrapper { display: inline-block; white-space: nowrap; } 
        #${scopeId} .thumb-preview-scope .chunk-box { display: inline-flex; flex-direction: column; justify-content: flex-end; align-items: flex-start; vertical-align: bottom; }
        #${scopeId} .thumb-preview-scope .chunk-chord-empty { display: block; min-height: 1.2em; margin: 0; line-height: 1; }
        #${scopeId} .thumb-preview-scope .chunk-lyric { display: block; white-space: pre-wrap; word-wrap: break-word; color: #121212 !important;}
        #${scopeId} .thumb-preview-scope .linea-letra-normal { color: #121212 !important; }
        #${scopeId} .thumb-preview-scope .linea-acorde { display: block; min-height: 1.2em; margin-top: 5px; white-space: pre-wrap; }
        
        ${ocultarAcordesCSS}
    `;
    workspace.appendChild(styleBlock);

    const tempLyrics = document.createElement('div');
    tempLyrics.innerHTML = contenidoPuro;
    const blocks = Array.from(tempLyrics.childNodes).filter(node => node.nodeType === 1);
    document.body.appendChild(workspace);

    const pagesHTML = [];
    let currentPageDiv = null;
    let currentMulticol = null;

    function createNewPage(isFirstPage) {
        const pageWrapper = document.createElement('div');
        pageWrapper.style.cssText = `width: ${CONT_W}px; height: ${CONT_H}px; padding: 0; box-sizing: border-box; display: flex; flex-direction: column; overflow: hidden;`;
        
        let headerHeight = 0;
        if (isFirstPage) {
            const headerDiv = document.createElement('div');
            headerDiv.innerHTML = headerHTML;
            pageWrapper.appendChild(headerDiv);
            workspace.appendChild(pageWrapper); 
            headerHeight = headerDiv.offsetHeight;
        } else {
            workspace.appendChild(pageWrapper);
        }

        const multicolHeight = CONT_H - headerHeight;
        const multicol = document.createElement('div');
        multicol.className = 'thumb-preview-scope';
        
        multicol.style.cssText = `
            column-count: ${COLS};
            column-gap: ${GAP}px;
            column-fill: auto !important;
            height: ${multicolHeight}px;
            width: ${CONT_W}px;
            font-size: ${finalFontSize}px;
            line-height: 1.6;
            color: #121212;
        `;
        pageWrapper.appendChild(multicol);
        
        currentPageDiv = pageWrapper;
        currentMulticol = multicol;
        return pageWrapper;
    }

    let currentPage = createNewPage(true);

    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        currentMulticol.appendChild(block);
        if (currentMulticol.scrollWidth > CONT_W) {
            currentMulticol.removeChild(block);
            pagesHTML.push(currentPage.outerHTML);
            workspace.removeChild(currentPage);
            
            currentPage = createNewPage(false);
            currentMulticol.appendChild(block);
        }
    }
    
    pagesHTML.push(currentPage.outerHTML);
    workspace.removeChild(currentPage);
    
    // Guardamos en memoria global para que html2pdf y el iframe puedan leerlo
    window.lastCompPagesHTML = pagesHTML;
    window.lastCompScopeId = scopeId;
    window.lastCompStyleBlock = styleBlock.outerHTML;

    let finalHtml = '';
    pagesHTML.forEach((pageHtml, index) => {
        finalHtml += `
        <div style="width: ${A4_W * RATIO}px; height: ${A4_H * RATIO}px; position: relative; scroll-snap-align: center; flex-shrink: 0; box-shadow: 0 5px 20px rgba(0,0,0,0.3); background: white; border-radius: 4px; overflow: hidden;">
            <div id="${scopeId}" style="transform: scale(${RATIO}); transform-origin: top left; width: ${A4_W}px; height: ${A4_H}px; padding: ${MARGIN}px; box-sizing: border-box; position: absolute; top:0; left:0;">
                ${styleBlock.outerHTML}
                ${pageHtml}
            </div>
            <div style="position: absolute; bottom: 8px; right: 12px; font-size: 11px; color: #666; font-family: sans-serif; font-weight: bold; background: rgba(255,255,255,0.8); padding: 2px 6px; border-radius: 4px;">
                ${t('js_page')} ${index + 1}/${pagesHTML.length}
            </div>
        </div>`;
    });

    document.body.removeChild(workspace);
    container.innerHTML = finalHtml;
}
function procesarPDFParaMenuNativo(song) {
    const A4_W = compSettings.orientacion === 'landscape' ? 1123 : 794; 
    const A4_H = compSettings.orientacion === 'landscape' ? 794 : 1123;
    const MARGIN = 50;

    const tempDiv = document.createElement('div');
    
    // Dejamos que html2pdf procese el HTML internamente
    let fullHtml = `<div id="${window.lastCompScopeId}" style="margin: 0; padding: 0;">${window.lastCompStyleBlock}`;
    
    let totalPages = window.lastCompPagesHTML.length;
    let pageCount = 0;

    window.lastCompPagesHTML.forEach((page) => {
        pageCount++;
        
        // Rompe página en todas MENOS en la última para evitar la hoja en blanco al final
        let pageBreak = (pageCount === totalPages) ? '' : 'page-break-after: always;';
        
        // Restamos 1 pixel a la altura para evitar que decimales generen una hoja en blanco por overflow
        fullHtml += `<div style="width: ${A4_W}px; height: ${A4_H - 1}px; padding: ${MARGIN}px; box-sizing: border-box; background: #fff; position: relative; margin: 0; overflow: hidden; ${pageBreak}">${page}</div>`;
    });
    fullHtml += `</div>`;
    tempDiv.innerHTML = fullHtml;

    const opt = {
        margin: 0,
        filename: `${song.title}.pdf`,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { 
            scale: 2, 
            useCORS: true, 
            windowWidth: A4_W,
            scrollY: 0,
            scrollX: 0
        },
        jsPDF: { unit: 'px', format: [A4_W, A4_H], orientation: compSettings.orientacion, hotfixes: ['px_scaling'] }
    };

    html2pdf().set(opt).from(tempDiv).output('blob').then(async function(pdfBlob) {
        cerrarModalDinamico();
        cerrarVistaPreviaCompartir();
        if (typeof compartirArchivoAndroid === 'function') {
            compartirArchivoAndroid(pdfBlob, `${song.title}.pdf`);
        } else {
            alert(t('js_err_native')); // 🔥 TRADUCCIÓN
        }
    });
}
// ==========================================================================
// 💻 17. Sincronización P2P (Celular a PC)
// ==========================================================================
function abrirModalSincronizacion() {
    const lang = localStorage.getItem('config_idioma') || 'es';
    if (typeof cerrarQuickAccess === 'function') cerrarQuickAccess();

    if (conexionConPC && conexionConPC.open) {
        // Usamos tu propio diseño de confirmación para preguntar
        mostrarModalConfirmacion(
            lang === 'en' ? "DISCONNECT PC" : "DESCONECTAR PC",
            lang === 'en' ? "Do you want to disconnect from the current computer?" : "¿Deseas cortar la sincronización con la computadora actual?",
            lang === 'en' ? "DISCONNECT" : "DESCONECTAR",
            "#f44336", // Rojo para advertencia
            ejecutarDesconexionPC
        );
    } else {
        // Si NO estamos conectados, abrimos el modal normal para dar el PIN
        document.getElementById('modal-sincronizacion').style.display = 'flex';
        activarSincronizacionPC();
    }
}
function cerrarModalSincronizacion() {
    document.getElementById('modal-sincronizacion').style.display = 'none';
    if(peerApp && !conexionConPC) {
        peerApp.destroy(); // Apagamos el escuchador si el usuario canceló
    }
}
function ejecutarDesconexionPC() {
    const lang = localStorage.getItem('config_idioma') || 'es';
    // 1. Cerramos el canal directo con la PC
    if (conexionConPC) {
        conexionConPC.close();
        conexionConPC = null;
    }
    // 2. Apagamos nuestra "antena" receptora de PeerJS
    if (peerApp) {
        peerApp.destroy();
        peerApp = null;
    }
    
    // 3. Cerramos el mensaje y avisamos
    closeConfirm();
    setTimeout(() => {
        alert(lang === 'en' ? "Synchronization ended for security reasons." : "Sincronización finalizada por seguridad.");
    }, 300);
}
function copiarLinkPC() {
    const lang = localStorage.getItem('config_idioma') || 'es';
    const link = document.getElementById('link-pc').innerText;
    navigator.clipboard.writeText(link).then(() => {
        alert(lang === 'en' ? "Link copied! Paste it in WhatsApp or anywhere you like." : "¡Enlace copiado! Pégalo en WhatsApp o donde quieras.");
    }).catch(err => {
        alert(lang === 'en' ? "Could not copy automatically. Long press the link to copy it." : "No se pudo copiar automáticamente. Mantén presionado el enlace para copiarlo.");
    });
}

function activarSincronizacionPC() {
    const lang = localStorage.getItem('config_idioma') || 'es';
    // Generamos un PIN de 4 dígitos (Siempre será nuevo y de un solo uso)
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    document.getElementById('pin-display').innerText = pin;
    document.getElementById('sync-status').innerText = lang === 'en' ? "This window must remain open during connection" : "Esta ventana debe estar abierta durante la conexión";
    document.getElementById('sync-status').style.color = "#f44336"; // Rojo

    // Limpiamos cualquier conexión vieja por si acaso
    if (peerApp) peerApp.destroy();

    // Creamos nuestro "Servidor" en el celular
    peerApp = new Peer('PraiseBook-' + pin);

    peerApp.on('connection', (conn) => {
        
        // 🚨 BLOQUEO DE SEGURIDAD EXTREMA 🚨
        // Si ya hay una conexión activa, rechazamos a cualquier otro que intente entrar con el PIN
        if (conexionConPC && conexionConPC.open) {
            console.warn("Seguridad: Un dispositivo extraño intentó conectarse y fue bloqueado.");
            conn.close(); // Le cerramos la puerta
            return; // Cortamos la función para que no lea los datos
        }

        // Si la puerta estaba libre, lo dejamos pasar y lo registramos como el único invitado
        conexionConPC = conn;
        
        document.getElementById('sync-status').innerText = lang === 'en' ? "PC Connected! Synchronizing..." : "¡PC Conectada! Sincronizando...";
        document.getElementById('sync-status').style.color = "#4CAF50"; // Verde

        // Cuando la PC abre el canal de datos
        conn.on('open', () => {
            // Le disparamos TODAS las canciones al instante
            conn.send(JSON.stringify({
                type: 'update_full',
                data: listaDeCanciones 
            }));
            
            setTimeout(() => {
                cerrarModalSincronizacion();
                alert(lang === 'en' ? "Connection established with PC! You can now edit from your computer." : "¡Conexión establecida con la PC! Ya puedes editar desde la computadora.");
            }, 1500);
        });

        // Escuchamos si la PC nos manda algo (como una canción editada)
        conn.on('data', (payload) => {
            let data = payload;
            if (typeof payload === 'string') {
                try { data = JSON.parse(payload); } catch(e) {}
            }
            
            // Si la PC nos pide la lista de nuevo
            if (data.type === 'request_sync') {
                conn.send(JSON.stringify({
                    type: 'update_full',
                    data: listaDeCanciones 
                }));
            }
            // Si la PC editó o creó una canción y nos la manda de vuelta
            else if (data.type === 'cancion_actualizar') {
                guardarCancionDesdePC(data.data);
                // Le avisamos a la PC que todo salió bien
                conn.send(JSON.stringify({ type: 'save_success' }));
            }
        });

        // Escuchar si la PC cierra la pestaña o se le va el internet
        conn.on('close', () => {
            conexionConPC = null; // Liberamos el espacio
            if (peerApp) {
                peerApp.destroy();
                peerApp = null;
            }
            alert(lang === 'en' ? "The PC has closed the PraiseBook session." : "La PC ha cerrado la sesión de PraiseBook.");
        });
    });
}

// Función que actualiza la memoria del celular cuando la PC manda un cambio
function guardarCancionDesdePC(nuevaCancion) {
    
    // Si la PC nos manda la posición exacta, sobrescribimos ahí mismo
    if (nuevaCancion.indiceBaseDatos !== null && nuevaCancion.indiceBaseDatos !== undefined) {
        listaDeCanciones[nuevaCancion.indiceBaseDatos] = nuevaCancion;
    } else {
        // Si no tiene índice, significa que le diste a "Nueva Canción" en la PC
        listaDeCanciones.unshift(nuevaCancion); 
    }
    
    // Guardamos y repintamos
    actualizarAlmacenamiento(); 
    renderSongs(listaDeCanciones); 
    
    // Si por casualidad estabas viendo esa misma canción en el celular, se refresca
    const tituloActual = document.querySelector('.main-title');
    if (tituloActual && tituloActual.innerText === nuevaCancion.title && typeof seleccionarCanción === 'function') {
        seleccionarCanción(nuevaCancion);
    }
}
// ==========================================================================
// 🔍 18. Herramientas Extra (Buscador, OCR, Info)
// ==========================================================================
// Guardamos el elemento del reloj en caché para no buscarlo cada segundo


function updateClock() {
    if (!clockElementCache) clockElementCache = document.getElementById('clock');
    if (!clockElementCache) return;

    const now = new Date();
    let horas = now.getHours();
    let minutos = now.getMinutes();

    const ampm = horas >= 12 ? 'PM' : 'AM';

    horas = horas % 12;
    horas = horas ? horas : 12; 

    const minStr = minutos.toString().padStart(2, '0');
    const hrStr = horas.toString().padStart(2, '0');

    clockElementCache.innerText = hrStr + ":" + minStr + " " + ampm;
}
function abrirModalBusqueda() {
    cerrarQuickAccess(); // Cerramos el rayito
    document.getElementById('modal-busqueda-online').classList.add('active');
}
function cerrarModalBusqueda() {
    document.getElementById('modal-busqueda-online').classList.remove('active');
}

function ejecutarBusqueda(plataforma) {
    const lang = localStorage.getItem('config_idioma') || 'es'; // 🔥 TRADUCCIÓN EN VIVO

    // 1. CAPTURAR TÍTULO 
    let tituloEl = document.querySelector('.main-title') || document.querySelector('h1');
    let titulo = tituloEl ? tituloEl.innerText.trim() : '';

    // 🔥 TRADUCCIÓN: Agregué 'Select a song' a la validación por si la app está en inglés
    if (!titulo || titulo === '' || titulo === '---' || titulo === 'Selecciona una canción' || titulo === 'Select a song') {
        alert(lang === 'en' ? "Open a song first to search." : "Abre una canción primero para buscarla.");
        if (typeof cerrarModalBusqueda === 'function') cerrarModalBusqueda();
        return;
    }

    // 2. EXTRAER ARTISTA
    let artista = '';
    const cancion = typeof listaDeCanciones !== 'undefined' ? listaDeCanciones.find(c => c.title === titulo) : null;
    
    if (cancion && cancion.artist) {
        artista = cancion.artist.trim();
    } else {
        let artistaEl = document.querySelector('.main-artist') || document.getElementById('visor-artista') || document.querySelector('h2');
        artista = artistaEl ? artistaEl.innerText.trim() : '';
    }

    // 3. LA LISTA NEGRA BLINDADA
    const frasesIgnoradas = [
        'importado de word', 'importado word', 'importando de pdf', 'importado de pdf',
        'importado pdf', 'archivo importado', 'sin artista', 'desconocido', 'unknown',
        'selecciona una canción', 'select a song', 'joystick'
    ];

    let artistaLimpio = artista.toLowerCase();
    let esInvalido = frasesIgnoradas.some(frase => artistaLimpio.includes(frase));

    if (esInvalido) {
        artista = ''; 
    }

    // 4. Crear el enlace final
    let queryDeBusqueda = `${titulo} ${artista}`.trim();
    let queryCodificada = encodeURIComponent(queryDeBusqueda);
    let urlFinal = '';

	if (plataforma === 'youtube') {
        urlFinal = `https://www.youtube.com/results?search_query=${queryCodificada}`;
    } else if (plataforma === 'spotify') {
        urlFinal = `spotify:search:${queryCodificada}`;
    } else if (plataforma === 'tidal') {
        urlFinal = `tidal://search?q=${queryCodificada}`;
    }

    // 5. Ejecutar y cerrar
    window.open(urlFinal, '_blank');
    if (typeof cerrarModalBusqueda === 'function') cerrarModalBusqueda();
}
// 1. Activa el input oculto que abre la cámara nativa
function iniciarCapturaOCR() {
    // Verificamos si Tesseract está cargado
    if (typeof Tesseract === 'undefined') {
        alert(t('js_err_tesseract')); // 🔥 TRADUCCIÓN
        return;
    }
    document.getElementById('ocr-camera-input').click();
}

// 2. Procesa la imagen capturada por la cámara
function procesarImagenOCR(input) {
    const lang = localStorage.getItem('config_idioma') || 'es'; // 🔥 TRADUCCIÓN EN VIVO

    if (input.files && input.files[0]) {
        const imagen = input.files[0];
        const textAreaLetra = document.getElementById('crear-letra');
        
        // Guardamos el texto original por seguridad
        const textoOriginal = textAreaLetra.value;
        
        // Mostramos feedback visual de carga en el editor
        textAreaLetra.value = lang === 'en' ? "--- READING IMAGE, PLEASE WAIT... ---" : "--- LEYENDO IMAGEN, POR FAVOR ESPERE... ---";
        textAreaLetra.disabled = true; // Bloqueamos el editor mientras lee

        // Iniciamos Tesseract.js
        Tesseract.recognize(
            imagen,
            'spa', // Idioma Español (puedes usar 'eng' para inglés)
            { logger: () => {} }
        ).then(({ data: { text } }) => {
            // ÉXITO: Limpiamos el texto extraído
            let textoLimpio = limpiarTextoOCR(text);
            
            // Preguntamos si quiere reemplazar o añadir
            const confirmMsg = lang === 'en' 
                ? "Do you want to replace the current lyrics with the captured text? (Cancel to append at the end)" 
                : "¿Deseas reemplazar la letra actual con el texto capturado? (Cancelar para añadir al final)";

            if (textoOriginal.trim() !== "" && confirm(confirmMsg)) {
                textAreaLetra.value = textoLimpio;
            } else {
                textAreaLetra.value = textoOriginal + (lang === 'en' ? "\n\n--- CAPTURED TEXT ---\n" : "\n\n--- TEXTO CAPTURADO ---\n") + textoLimpio;
            }
        }).catch(err => {
            // ERROR
            console.error("Error OCR:", err);
            alert(lang === 'en' ? "Could not read text from image. Make sure there is good lighting." : "No se pudo leer el texto de la imagen. Asegúrate de que haya buena luz.");
            textAreaLetra.value = textoOriginal; // Restauramos texto original
        }).finally(() => {
            // LIMPIEZA FINAL
            textAreaLetra.disabled = false; // Desbloqueamos el editor
            input.value = ""; // Reseteamos el input de archivo para la próxima vez
        });
    }
}

// 3. Función auxiliar para limpiar basura común del OCR
function limpiarTextoOCR(text) {
    if (!text) return "";
    return text
        .replace(/^\s*[\r\n]/gm, "") // Quitar líneas vacías al inicio
        .trim(); // Quitar espacios extra extremos
}
function toggleAvanzado(opcion, estadoForzado = null) {
    const check = document.getElementById(`adv-${opcion}`);
    const estaActivo = estadoForzado !== null ? estadoForzado : (check ? check.checked : false);
    
    localStorage.setItem(`config_adv_${opcion}`, estaActivo);

    // Sincronizar el checkbox gemelo si es la Voz Guía
    if (opcion === 'voice-guide') {
        const checkAjustes = document.getElementById('adv-voice-guide');
        const checkModal = document.getElementById('metro-voice');
        if (checkAjustes) checkAjustes.checked = estaActivo;
        if (checkModal) checkModal.checked = estaActivo;
    }

    // 🔥 MAGIA DE EXCLUSIVIDAD: Solo 1 puede estar encendido a la vez
    if (opcion === 'musica-online' && estaActivo) {
        const padsCheck = document.getElementById('adv-pads');
        if (padsCheck && padsCheck.checked) {
            padsCheck.checked = false;
            localStorage.setItem('config_adv_pads', false);
        }
    } else if (opcion === 'pads') {
                const gridPads = document.getElementById('grid-pads-sintetizador');
                if (gridPads) {
                    if (estaActivo) {
                        gridPads.style.opacity = '1';
                        gridPads.style.pointerEvents = 'auto';
                        gridPads.style.filter = 'none';
                    } else {
                        gridPads.style.opacity = '0.3';
                        gridPads.style.pointerEvents = 'none';
                        gridPads.style.filter = 'grayscale(1)';
                    }
                }
                
                if (!estaActivo && typeof detenerPad === 'function') detenerPad();
            }

    // Funciones visuales (Invertir colores, mostrar reproductor flotante)
    if (opcion === 'inv-pdf') {
        if (estaActivo) document.body.classList.add('invertir-pdf');
        else document.body.classList.remove('invertir-pdf');
    } else if (opcion === 'inv-img') {
        if (estaActivo) document.body.classList.add('invertir-img');
        else document.body.classList.remove('invertir-img');
    } 
    else if (opcion === 'btn-multi') {
        const player = document.getElementById('floating-player');
        if (player) player.style.display = estaActivo ? 'flex' : 'none';
    }
}

function inicializarSeccionAvanzado() {
    const opciones = [
        'btn-multi', 'musica-online', 'pads', 'inv-pdf', 'inv-img'
    ];
    
    opciones.forEach(op => {
            const check = document.getElementById(`adv-${op}`);
            // Para el reproductor el valor por defecto es true, para el resto false
            const saved = op === 'btn-multi' 
                ? localStorage.getItem(`config_adv_${op}`) !== 'false' 
                : localStorage.getItem(`config_adv_${op}`) === 'true';
        if (check) check.checked = saved;
        
        if (op === 'inv-pdf' && saved) document.body.classList.add('invertir-pdf');
        if (op === 'inv-img' && saved) document.body.classList.add('invertir-img');
        
        // 🔥 MAGIA DEL REPRODUCTOR FLOTANTE
        if (op === 'btn-multi') {
            const player = document.getElementById('floating-player');
            if (player) player.style.display = saved ? 'flex' : 'none';
        }
    });

    // Carga de la fuente de impresión
    const savedFont = localStorage.getItem('config_adv_print_font') || '10';
    const slider = document.querySelector('#section-avanzado .slider-verde');
    if (slider) slider.value = savedFont;
    const fontVal = document.getElementById('val-print-font');
    if (fontVal) fontVal.innerText = savedFont;
}

// 🧮 CALCULADORA DE CONTENIDO
function actualizarInfoContenido() {
    let totalCanciones = 0; let pdfVisuales = 0; let imgVisuales = 0;
    let pdfImportado = 0; let wordImportado = 0;

    if (typeof listaDeCanciones !== 'undefined') {
        totalCanciones = listaDeCanciones.length;
        listaDeCanciones.forEach(c => {
            if (c.isVisual) {
                if (c.tipoArchivo === 'pdf') pdfVisuales++;
                if (c.tipoArchivo === 'image') imgVisuales++;
            } else {
                if (c.tipoArchivo === 'pdf') pdfImportado++;
                if (c.tipoArchivo === 'word') wordImportado++;
            }
        });
    }

    let ls1 = localStorage.getItem('mis_canciones') || '';
    let ls2 = localStorage.getItem('mis_carpetas') || '';
    let pesoBytes = (ls1.length + ls2.length) * 2; 
    let bdTexto = pesoBytes > 1048576 
        ? (pesoBytes / 1048576).toFixed(2) + ' MB' 
        : (pesoBytes / 1024).toFixed(2) + ' KB';

    const mapValores = {
        'info-canciones': totalCanciones,
        'info-pdf-vis': pdfVisuales,
        'info-img-vis': imgVisuales,
        'info-pdf-imp': pdfImportado,
        'info-word-imp': wordImportado,
        'info-bd': bdTexto,
        'info-audio': "0" 
    };

    for (let id in mapValores) {
        const el = document.getElementById(id);
        if (el) el.innerText = mapValores[id];
    }
}
function mostrarInstrucciones() {
    const lang = localStorage.getItem('config_idioma') || 'es'; // 🔥 TRADUCCIÓN

    abrirModalDinamico(lang === 'en' ? "FORMAT MANUAL" : "MANUAL DE FORMATO", false, () => {});
    
    if (lang === 'en') {
        document.getElementById('md-mensaje').innerHTML = 
            "<ul style='text-align: left; padding-left: 15px; margin: 0; line-height: 1.6; font-size: 0.85rem; color: #ccc;'>" +
            "<li><b>Chords:</b> Write them above the word, or use the ChordPro format by pasting text with <code>[Am]</code>.</li>" +
            "<li><b>Auto Structure:</b> Writing <code>CHORUS:</code>, <code>VERSE:</code>, etc., will give them color and title formatting.</li>" +
            "<li><b>Intro/Solo Rule:</b> Instrumental sections smartly collapse chords so they don't leave empty spaces below.</li>" +
            "<li><b>Multipliers:</b> Adding <code>x2</code> or <code>(x3)</code> to a section title will duplicate its lyrics automatically.</li>" +
            "<li><b>Notes:</b> Write between asterisks to create colored notes. Ex: <code>*The pastor will give a verse*</code>.</li>" +
            "<li><b>Echoes:</b> Text in parentheses <code>(Raise intensity)</code> will take a subtle, gray font.</li>" +
            "<li><b>Key Calculator:</b> The app reads the first valid chord you write to deduce the overall key.</li>" +
            "<li><b>Extreme Cleaning:</b> The viewer removes tabs, double line breaks, and garbage lines like <code>----</code> or <code>====</code>.</li>" +
            "<li><b>Tip:</b> For better alignment, paste lyrics that come in monospaced fonts (like Lucida Console or Courier).</li>" +
            "</ul>";
    } else {
        document.getElementById('md-mensaje').innerHTML = 
            "<ul style='text-align: left; padding-left: 15px; margin: 0; line-height: 1.6; font-size: 0.85rem; color: #ccc;'>" +
            "<li><b>Acordes:</b> Escríbelos sobre la palabra, o usa el formato ChordPro pegando texto con <code>[Am]</code>.</li>" +
            "<li><b>Estructura Automática:</b> Escribir <code>CORO:</code>, <code>ESTROFA:</code>, etc., les dará color y formato de título.</li>" +
            "<li><b>Regla Intro/Solo:</b> Las secciones instrumentales colapsan los acordes de forma inteligente para no dejar espacios vacíos debajo.</li>" +
            "<li><b>Multiplicadores:</b> Agregar <code>x2</code> o <code>(x3)</code> al título de una sección duplicará su letra automáticamente.</li>" +
            "<li><b>Apuntes:</b> Escribe entre asteriscos para crear notas de color. Ej: <code>*El pastor dará un  versículo*</code>.</li>" +
            "<li><b>Ecos:</b> El texto entre paréntesis <code>(Sube la intensidad)</code> tomará una fuente sutil y gris.</li>" +
            "<li><b>Calculador de Tono:</b> La app lee el primer acorde válido que escribas para deducir la tonalidad general.</li>" +
            "<li><b>Limpieza Extrema:</b> El visor elimina tabs, saltos dobles y líneas basura como <code>----</code> o <code>====</code>.</li>" +
            "<li><b>Tip:</b> Para mejor alineación, pega letras que vengan en fuentes monoespaciadas (como Lucida Console o Courier).</li>" +
            "</ul>";
    }
}
function mostrarInfoAccesosRapidos() {
    const lang = localStorage.getItem('config_idioma') || 'es'; // 🔥 TRADUCCIÓN

    cerrarQuickAccess(); // Cerramos el panel del rayito para que no estorbe
    
    abrirModalDinamico(lang === 'en' ? "QUICK ACCESS GUIDE" : "GUÍA DE ACCESOS RÁPIDOS", false, () => {});
    
    // Le inyectamos una lista con scroll interno por si la pantalla del celular es pequeña
    if (lang === 'en') {
        document.getElementById('md-mensaje').innerHTML = `
            <div style="text-align: left; font-size: 0.85rem; color: #ccc; line-height: 1.6; max-height: 55vh; overflow-y: auto; padding-right: 8px;">
                <p style="margin-bottom: 12px;"><b style="color: var(--accent-color);">▶ PLAY:</b> Shows or hides the floating player for local tracks.</p>
                <p style="margin-bottom: 12px;"><b style="color: var(--accent-color);">🎵 CHORDS:</b> Hides chords throughout the song (ideal for singers).</p>
                <p style="margin-bottom: 12px;"><b style="color: var(--accent-color);">📝 LYRICS:</b> Hides lyrics (ideal for musicians who only read chords and rests).</p>
                <p style="margin-bottom: 12px;"><b style="color: var(--accent-color);"># / b NOTATION:</b> Globally toggles between Sharps, Flats, or Hybrid mode.</p>
                <p style="margin-bottom: 12px;"><b style="color: var(--accent-color);">⏫ SCROLL:</b> Toggles between Smart Auto-Scroll (duration-based) or Manual.</p>
                <p style="margin-bottom: 12px;"><b style="color: var(--accent-color);">🎹 PADS:</b> Activates the bottom Ambient Pads soundboard.</p>
                <p style="margin-bottom: 12px;"><b style="color: var(--accent-color);">🎛️ PEDAL:</b> Turns the Stomp Box on or off if using a Bluetooth/MIDI pedal.</p>
                <p style="margin-bottom: 12px;"><b style="color: var(--accent-color);">🎸 TUNER:</b> Opens the integrated precision tuner (Guitar/Bass).</p>
                <p style="margin-bottom: 12px;"><b style="color: var(--accent-color);">C CIPHER:</b> Changes the language of notes (Standard: C, D or Latin: Do, Re).</p>
                <p style="margin-bottom: 12px;"><b style="color: var(--accent-color);">📊 DIAGRAM:</b> Shows or hides chord diagrams at the beginning of the lyrics.</p>
                <p style="margin-bottom: 12px;"><b style="color: var(--accent-color);">🎸 INSTRUMENT:</b> Toggles chord diagrams between Guitar and Bass.</p>
                <p style="margin-bottom: 12px;"><b style="color: var(--accent-color);">🌗 THEME:</b> Quickly switches between Light Mode and Dark Mode.</p>
                <p style="margin-bottom: 12px;"><b style="color: var(--accent-color);">🎨 EMPHASIS:</b> Changes the main color of the entire application.</p>
                <p style="margin-bottom: 12px;"><b style="color: var(--accent-color);">Aa STYLES:</b> Takes you to size, font, and spacing settings.</p>
                <p style="margin-bottom: 12px;"><b style="color: var(--accent-color);">💻 SYNC PC:</b> Real-time sync with your PC for comfortable lyric editing.</p>
                <p style="margin-bottom: 0;"><b style="color: var(--accent-color);">🌐 SEARCH:</b> Searches the current song on YouTube, Spotify, or Tidal.</p>
            </div>
        `;
    } else {
        document.getElementById('md-mensaje').innerHTML = `
            <div style="text-align: left; font-size: 0.85rem; color: #ccc; line-height: 1.6; max-height: 55vh; overflow-y: auto; padding-right: 8px;">
                <p style="margin-bottom: 12px;"><b style="color: var(--accent-color);">▶ PLAY:</b> Muestra u oculta el reproductor flotante para pistas locales.</p>
                <p style="margin-bottom: 12px;"><b style="color: var(--accent-color);">🎵 ACORDES:</b> Oculta los acordes en toda la canción (ideal para cantantes).</p>
                <p style="margin-bottom: 12px;"><b style="color: var(--accent-color);">📝 LETRA:</b> Oculta la letra (ideal para músicos que solo leen acordes y silencios).</p>
                <p style="margin-bottom: 12px;"><b style="color: var(--accent-color);"># / b NOTACIÓN:</b> Cambia globalmente entre Sostenidos, Bemoles o modo Híbrido.</p>
                <p style="margin-bottom: 12px;"><b style="color: var(--accent-color);">⏫ SCROLL:</b> Alterna entre Auto-Scroll inteligente (basado en la duración) o Manual.</p>
                <p style="margin-bottom: 12px;"><b style="color: var(--accent-color);">🎹 PADS:</b> Activa la botonera inferior de Pads Atmosféricos.</p>
                <p style="margin-bottom: 12px;"><b style="color: var(--accent-color);">🎛️ PEDAL:</b> Enciende o apaga el Stomp Box (Bombo) si usas un pedal Bluetooth/MIDI.</p>
                <p style="margin-bottom: 12px;"><b style="color: var(--accent-color);">🎸 AFINADOR:</b> Abre el afinador de precisión integrado (Guitarra/Bajo).</p>
                <p style="margin-bottom: 12px;"><b style="color: var(--accent-color);">C CIFRADO:</b> Cambia el idioma de las notas (Estándar: C, D o Latino: Do, Re).</p>
                <p style="margin-bottom: 12px;"><b style="color: var(--accent-color);">📊 DIAGRAMA:</b> Muestra u oculta los dibujos de los acordes al inicio de la letra.</p>
                <p style="margin-bottom: 12px;"><b style="color: var(--accent-color);">🎸 INSTRUMENTO:</b> Alterna los dibujos de acordes entre Guitarra y Bajo.</p>
                <p style="margin-bottom: 12px;"><b style="color: var(--accent-color);">🌗 TEMA:</b> Cambia rápidamente entre Modo Claro y Modo Oscuro.</p>
                <p style="margin-bottom: 12px;"><b style="color: var(--accent-color);">🎨 ÉNFASIS:</b> Cambia el color principal de toda la aplicación.</p>
                <p style="margin-bottom: 12px;"><b style="color: var(--accent-color);">Aa ESTILOS:</b> Te lleva a los ajustes de tamaños, fuentes y espaciado.</p>
                <p style="margin-bottom: 12px;"><b style="color: var(--accent-color);">💻 SYNC PC:</b> Sincroniza en tiempo real con tu PC para editar letras más cómodo.</p>
                <p style="margin-bottom: 0;"><b style="color: var(--accent-color);">🌐 BUSCAR:</b> Busca la canción actual en YouTube, Spotify o Tidal.</p>
            </div>
        `;
    }
}
// ==========================================================================
// 🖨️ DISTRIBUIDOR DE IMPRESIÓN (MÓVIL)
// ==========================================================================
function imprimirDesdeRayito() {
    const lang = localStorage.getItem('config_idioma') || 'es'; 
    cerrarQuickAccess();
    
    let tituloPantalla = document.querySelector('.main-title').innerText;
    if (!tituloPantalla || tituloPantalla.includes("---") || tituloPantalla.includes("Selecciona") || tituloPantalla.includes("Select")) {
        alert(lang === 'en' ? "Open a song first." : "Abre una canción primero.");
        return;
    }

    // El purificador de textos
    const limpiezaNuclear = (texto) => {
        if (!texto) return "";
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    };

    let tituloLimpio = limpiezaNuclear(tituloPantalla);
    
    let index = listaDeCanciones.findIndex(c => limpiezaNuclear(c.title || c.titulo) === tituloLimpio);
    if (index === -1) {
        index = listaDeCanciones.findIndex(c => limpiezaNuclear(c.title || c.titulo).includes(tituloLimpio));
    }
    
    window.cancionCompartirIndex = index !== -1 ? index : null;
    
    abrirModalDinamico(lang === 'en' ? "PREPARING TO PRINT..." : "PREPARANDO PARA IMPRIMIR...", false, () => {});
    document.getElementById('md-mensaje').innerText = lang === 'en' ? "Generating PDF to print or share..." : "Generando PDF para imprimir o compartir...";
    
    generarMiniaturasPDF(); 
    
    setTimeout(() => {
        ejecutarCompartirNativo('pdf');
    }, 500); 
}
// ==========================================================================
// 19. IDIOMA
// ==========================================================================
// Función para traducir el HTML (SEGURO PARA ICONOS E IMÁGENES)
function aplicarTraduccion() {
    const lang = localStorage.getItem('config_idioma') || 'es';
    const textos = i18n[lang];

    // 1. Traducir textos y placeholders (data-i18n)
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const clave = el.getAttribute('data-i18n');
        if (textos[clave]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = textos[clave];
            } else {
                el.innerText = textos[clave];
            }
        }
    });

    // 2. Traducir SOLO los Tooltips flotantes (data-i18n-title)
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const clave = el.getAttribute('data-i18n-title');
        if (textos[clave]) {
            el.title = textos[clave];
        }
    });
}

function cambiarIdioma(nuevoLang) {
    localStorage.setItem('config_idioma', nuevoLang);
    aplicarTraduccion();
    // Forzamos un repintado de las listas del JS
    if (document.getElementById('tab-folders').classList.contains('active')) {
        showFoldersView();
    } else {
        renderSongs(listaDeCanciones);
    }
}

// 🔥 NUEVA HERRAMIENTA: Traductor instantáneo para el JavaScript
function t(clave) {
    const lang = localStorage.getItem('config_idioma') || 'es';
    return i18n[lang][clave] || clave;
}
// ==========================================================================
// 20. 🚀 MOTOR AUTOPLAY Y VOZ GUÍA
// ==========================================================================
function toggleAutoplayRapido() {
    autoplayActivo = !autoplayActivo;
    localStorage.setItem('config_autoplay_master', autoplayActivo);
    
    // 🔥 AQUÍ SE LIGA LA LÍNEA DIRECTAMENTE AL AUTOPLAY
    toggleLineaSync(autoplayActivo);
    const switchLinea = document.getElementById('metro-line');
    if (switchLinea) switchLinea.checked = autoplayActivo;
    
    actualizarEstadosQuickPanel();
    
    const btnMetro = document.getElementById('metroBtn');
    const contenedorLetras = document.querySelector('.lyrics-container');

    if (autoplayActivo) {
        document.body.classList.add('modo-autoplay');
        ultimoEncabezadoAnunciado = null; 
        
        if (btnMetro) {
            btnMetro.style.pointerEvents = 'none';
            btnMetro.style.opacity = '0.3';
        }

        if (contenedorLetras) contenedorLetras.style.paddingTop = '10px';
        window.scrollTo({ top: 0, behavior: 'auto' }); 

        setTimeout(() => {
            const primerBloque = document.querySelector('.bloque-seccion-general');
            const targetY = window.innerHeight * 0.25; 

            if (primerBloque) {
                const textoReal = primerBloque.querySelector('.linea-encabezado-txt') || primerBloque;
                const rect = textoReal.getBoundingClientRect();
                
                if (rect.top < targetY) {
                    const diferenciaOffset = targetY - rect.top;
                    contenedorLetras.style.paddingTop = (10 + diferenciaOffset) + 'px';
                }
            }
        }, 50); 

    } else {
        document.body.classList.remove('modo-autoplay');
        if (contenedorLetras) contenedorLetras.style.paddingTop = '10px'; 
        
        if (isScrolling) toggleScroll(); 
        if (metroActivo) toggleMetronomo(); 
        reproductorVozGuia.pause();
        
        if (btnMetro) {
            btnMetro.style.pointerEvents = 'auto';
            btnMetro.style.opacity = '1';
        }
    }
}


// Botón Sync Banda (Placeholder futuro)
function toggleSyncBanda() {
    cerrarQuickAccess();
    const lang = localStorage.getItem('config_idioma') || 'es';
    abrirModalDinamico("SYNC BANDA", false, () => {});
    document.getElementById('md-mensaje').innerText = lang === 'en' 
        ? "Band sync feature (P2P real-time broadcast) will be available in the next update!" 
        : "La función de sincronización de banda (transmisión en tiempo real P2P) estará disponible en la próxima actualización.";
}

function actualizarEstadosQuickPanel_Actualizacion() { // (Integrar esto en tu función original)
    // 🔥 AUTOPLAY MAESTRO 🔥
    const btnAutoplay = document.getElementById('q-btn-autoplay');
    const txtAutoplay = document.getElementById('txt-autoplay');
    const iconAutoplay = document.getElementById('icon-autoplay');
    const isAutoplay = localStorage.getItem('config_autoplay_master') === 'true';

    if (btnAutoplay && txtAutoplay && iconAutoplay) {
        if (isAutoplay) {
            btnAutoplay.classList.add('active');
            txtAutoplay.innerText = "AUTOPLAY: ON";
            iconAutoplay.innerText = "play_circle_filled";
            iconAutoplay.style.color = "var(--accent-color)";
        } else {
            btnAutoplay.classList.remove('active');
            txtAutoplay.innerText = "AUTOPLAY: OFF";
            iconAutoplay.innerText = "stop_circle"; 
        }
    }
}
// Inyectar la línea en el HTML automáticamente
document.addEventListener("DOMContentLoaded", () => {
    const lineaDOM = document.createElement('div');
    lineaDOM.id = 'autoplay-sync-line';
    document.body.appendChild(lineaDOM);

    // Leer la memoria al arrancar
    const lineaActiva = localStorage.getItem('config_adv_sync-line') === 'true';
    const switchLinea = document.getElementById('metro-line');
	if(switchLinea) {
		switchLinea.checked = false;
		toggleLineaSync(false); // Asegura que la función interna también inicie apagada
	}
    
    if (switchLinea) switchLinea.checked = lineaActiva;
    if (lineaActiva) document.body.classList.add('mostrar-linea-sync');
});

// Función del Switch
function toggleLineaSync(activo) {
    localStorage.setItem('config_adv_sync-line', activo);
    if (activo) {
        document.body.classList.add('mostrar-linea-sync');
    } else {
        document.body.classList.remove('mostrar-linea-sync');
    }
}
// 🚀 MOTOR AUTOSCROLL MATEMÁTICO

function arrancarScrollNativo() {
    if (!isScrolling || (typeof indiceEditando !== 'undefined' && indiceEditando !== null)) return;
    
    window.ultimaDinamicaAnunciada = null; 
    
    let lastTime = performance.now();
    const targetY = window.innerHeight * 0.25;
    let acumuladorDecimales = 0; 
    
    const runScroll = (time) => {
        if (!isScrolling || (typeof indiceEditando !== 'undefined' && indiceEditando !== null)) return;
        
        if (!time) time = performance.now();
        let deltaTime = time - lastTime;
        lastTime = time;
        
        if (deltaTime > 50) deltaTime = 16.66; 

        let step = 0;

        try {
            const isAuto = localStorage.getItem('config_scroll_auto') !== 'false';
            
            if (typeof autoplayActivo !== 'undefined' && autoplayActivo && isAuto) {
                
                // 🔥 EL FIX MAESTRO: Obligamos al Autoplay a ignorar los clones de la Vista Previa
                let contenedorActivo = document.getElementById('viewer') || document; 
                
                if (typeof modoCarruselActivo !== 'undefined' && modoCarruselActivo) {
                    const slides = document.querySelectorAll('#viewer .song-slide');
                    if (slides[indiceCarruselActual]) contenedorActivo = slides[indiceCarruselActual];
                }

                const todosLosBloques = Array.from(contenedorActivo.querySelectorAll('[data-compases]'));

                if (todosLosBloques.length > 0) {
                    let bloqueActivo = null;
                    let siguienteBloque = null;

                    for (let i = 0; i < todosLosBloques.length; i++) {
                        let rect = todosLosBloques[i].getBoundingClientRect();
                        if (rect.top <= targetY + 1) { 
                            bloqueActivo = todosLosBloques[i];
                            siguienteBloque = (i + 1 < todosLosBloques.length) ? todosLosBloques[i + 1] : null;
                        } else if (i === 0 && rect.top > targetY + 1) {
                            bloqueActivo = todosLosBloques[0];
                            siguienteBloque = (todosLosBloques.length > 1) ? todosLosBloques[1] : null;
                            break;
                        }
                    }

                    if (bloqueActivo) {
                        let compases = parseInt(bloqueActivo.getAttribute('data-compases')) || 0;
                        
                        if (compases === 0) {
                            let idxAct = todosLosBloques.indexOf(bloqueActivo);
                            for (let j = idxAct - 1; j >= 0; j--) {
                                let cAnt = parseInt(todosLosBloques[j].getAttribute('data-compases')) || 0;
                                if (cAnt > 0) { compases = cAnt; break; }
                            }
                            if (compases === 0) compases = 1; 
                        }
                        
                        let inputBpm = document.getElementById('bpm-input');
                        let bpm = parseInt(inputBpm ? inputBpm.value : 85) || 85;
                        
                        let displayCompas = document.getElementById('compas-display');
                        let beatsStr = displayCompas ? displayCompas.innerText : "4/4";
                        let beats = parseInt(beatsStr.split('/')[0]) || 4;
                        
                        let totalBeats = compases * beats;
                        let duracionSegundos = totalBeats * (60 / bpm);
                        let alturaReal;

                        if (siguienteBloque) {
                            alturaReal = siguienteBloque.getBoundingClientRect().top - bloqueActivo.getBoundingClientRect().top;
                        } else {
                            alturaReal = bloqueActivo.getBoundingClientRect().height;
                            if (alturaReal < window.innerHeight * 0.5) alturaReal += window.innerHeight * 0.5;
                        }

                        let pxPorSegundo = alturaReal / duracionSegundos;
                        let pxPorBeat = alturaReal / totalBeats;

                        step = pxPorSegundo * (deltaTime / 1000);

                        let rectActivo = bloqueActivo.getBoundingClientRect();
                        let esPrimerBloque = (bloqueActivo === todosLosBloques[0]);
                        let elemTexto = bloqueActivo.querySelector('.linea-encabezado-txt');
                        let texto = (elemTexto && elemTexto.innerText.trim() !== "") ? elemTexto.innerText : bloqueActivo.dataset.nombreSeccion;
                        let esRep = bloqueActivo.dataset.repeticion === 'true';
                        let esUltimaRep = bloqueActivo.dataset.ultimaRep === 'true';

                        if (esPrimerBloque && Math.abs(rectActivo.top - targetY) <= 5) {
                            if (typeof ultimoEncabezadoAnunciado !== 'undefined' && ultimoEncabezadoAnunciado !== bloqueActivo && typeof anunciarVozGuia === 'function') {
                                ultimoEncabezadoAnunciado = bloqueActivo;
                                anunciarVozGuia(texto, esRep, esUltimaRep);
                            }
                        }

                        if (siguienteBloque && pxPorBeat > 0) {
                            let distanciaAnticipacion = targetY + (pxPorBeat * 2);
                            let rectSiguiente = siguienteBloque.getBoundingClientRect();
                            
                            if (rectSiguiente.top <= distanciaAnticipacion && rectSiguiente.top > targetY) {
                                let elemSig = siguienteBloque.querySelector('.linea-encabezado-txt');
                                let textoSig = (elemSig && elemSig.innerText.trim() !== "") ? elemSig.innerText : siguienteBloque.dataset.nombreSeccion;
                                let esRepSig = siguienteBloque.dataset.repeticion === 'true';
                                let esUltimaRepSig = siguienteBloque.dataset.ultimaRep === 'true';

                                if (typeof ultimoEncabezadoAnunciado !== 'undefined' && ultimoEncabezadoAnunciado !== siguienteBloque && typeof anunciarVozGuia === 'function') {
                                    ultimoEncabezadoAnunciado = siguienteBloque;
                                    anunciarVozGuia(textoSig, esRepSig, esUltimaRepSig);
                                }
                            }
                        }

                        let dinamicas = bloqueActivo.querySelectorAll('.parentesis-regla, .apunte-regla');
                        dinamicas.forEach(dyn => {
                            let rectDyn = dyn.getBoundingClientRect();
                            let distanciaAnticipacion = targetY + (pxPorBeat * 2); 
                            
                            if (rectDyn.top <= distanciaAnticipacion && rectDyn.top > targetY) {
                                if (window.ultimaDinamicaAnunciada !== dyn) {
                                    window.ultimaDinamicaAnunciada = dyn;
                                    if (typeof anunciarVozGuia === 'function') anunciarVozGuia(dyn.innerText, false);
                                }
                            }
                        });

                        // Parada Final Automática
                        if (!siguienteBloque) {
                            let ultimaLinea = bloqueActivo.lastElementChild || bloqueActivo;
                            // 🔥 FIX SEGURIDAD 2: Solo se apaga si ya ha bajado al menos 30 píxeles. 
                            // Esto evita apagones instantáneos si abres los ajustes.
                            if (ultimaLinea.getBoundingClientRect().bottom <= targetY && window.scrollY > 30) {
                                if (typeof toggleScroll === 'function') toggleScroll(); 
                                if (typeof metroActivo !== 'undefined' && metroActivo && typeof toggleMetronomo === 'function') toggleMetronomo(); 
                                return; 
                            }
                        }
                    }
                }
            } 
            
            if (step === 0 || !autoplayActivo || !isAuto || isNaN(step)) {
                let inputVel = document.getElementById('scrollSpeed');
                let speedMultiplier = parseFloat(inputVel ? inputVel.value : 1) || 1;
                step = (speedMultiplier * 30) * (deltaTime / 1000);
                
                const scrollAlcanzado = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 5;
                if (scrollAlcanzado && window.scrollY > 30) {
                    if (typeof toggleScroll === 'function') toggleScroll(); 
                    return;
                }
            }
        } catch (err) {
            let inputVel = document.getElementById('scrollSpeed');
            let speedMultiplier = parseFloat(inputVel ? inputVel.value : 1) || 1;
            step = (speedMultiplier * 30) * (deltaTime / 1000);
        }

        if (step > 0 && !isNaN(step)) {
            acumuladorDecimales += step;
            let pixelesEnteros = Math.floor(acumuladorDecimales);
            
            if (pixelesEnteros >= 1) {
                window.scrollBy(0, pixelesEnteros);
                acumuladorDecimales -= pixelesEnteros; 
            }
        }

        scrollTimeout = requestAnimationFrame(runScroll);
    };
    
    scrollTimeout = requestAnimationFrame(runScroll);
}
// Dejamos esta función vacía para que no cause errores en otras partes del código.
function chequearInterseccionVozGuia() {
    return; 
}
// 🧮 Lógica de Conteo Inicial PRO (Dinámico por BPM)
function iniciarConteoYArrancar() {
    countInActivo = true;
    let bpm = parseInt(document.getElementById('bpm-input').value) || 85;
    let intervalMs = (60 / bpm) * 1000; 
    const lang = localStorage.getItem('config_idioma') || 'es';

    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    // 🧠 EL CEREBRO DEL DIRECTOR MUSICAL
    let secuenciaVoz = [];
    
    if (bpm > 90) {
        // Conteo PRO para canciones rápidas
        if (beatsCompas === 4) {
            // 1 - (silencio) - 2 - (silencio) - 1, 2, 3, 4
            secuenciaVoz = [1, 0, 2, 0, 1, 2, 3, 4]; 
        } else if (beatsCompas === 3) {
            // Adaptación pro para valses/rancheras rápidas (1 - 2 - 1, 2, 3)
            secuenciaVoz = [1, 0, 2, 1, 2, 3]; 
        } else {
            // Si es un compás raro, lo hace normal
            for (let i = 1; i <= beatsCompas * 2; i++) secuenciaVoz.push(i > beatsCompas ? i - beatsCompas : i);
        }
    } else {
        // Conteo Normal (1, 2, 3, 4) para baladas / worship (<= 90 BPM)
        for (let i = 1; i <= beatsCompas; i++) secuenciaVoz.push(i);
    }

    let totalGolpes = secuenciaVoz.length;
    let golpeActual = 0;

    function playTick() {
        if (!isScrolling) { 
            countInActivo = false; 
            return; 
        }
        
        if (golpeActual < totalGolpes) {
            let numeroAudio = secuenciaVoz[golpeActual];
            
            // Si el número es 0, es un silencio estratégico (no habla), pero el tiempo sigue corriendo
            if (numeroAudio > 0 && numeroAudio <= 7) {
                reproductorVozGuia.pause(); 
                
                // 🔥 TRUCO ANTI-IDM PARA EL CONTEO INICIAL
                fetch(`voces/${lang}/${numeroAudio}.wav`)
                    .then(res => res.blob())
                    .then(blob => {
                        const urlSegura = URL.createObjectURL(blob);
                        reproductorVozGuia.src = urlSegura;
                        reproductorVozGuia.currentTime = 0;
                        reproductorVozGuia.play().catch(e => console.log("Falta audio:", e));
                    })
                    .catch(err => console.log("Error de red:", err));
            }
            
            // Destello visual en el botón de Play de la cápsula (para que el músico lleve el pulso visual)
            const capsula = document.querySelector('.floating-controls.dynamic-island');
            if (capsula) {
                capsula.classList.add('metro-flash-global');
                setTimeout(() => capsula.classList.remove('metro-flash-global'), 80);
            }

            // Destello en la línea de la pantalla
            const linea = document.getElementById('autoplay-sync-line');
            if (linea && document.body.classList.contains('mostrar-linea-sync')) {
                linea.classList.add('linea-flash');
                setTimeout(() => linea.classList.remove('linea-flash'), 90);
            }

            golpeActual++;
            setTimeout(playTick, intervalMs);
        } else {
            // ¡FIN DEL CONTEO! Arranca el Autoplay.
            countInActivo = false;
            if (!metroActivo) toggleMetronomo(); // Enciende la luz del metrónomo
            arrancarScrollNativo(); 
            
            // 🔥 FORZAR LECTURA INMEDIATA: Si el intro ya está pisando la línea, corta el último número de voz y dice "¡Intro!"
            chequearInterseccionVozGuia();
        }
    }
    
    playTick();
}
function darGolpeRapidoConteo(esAcento) {
    const gain = audioCtx.createGain();
    gain.connect(audioCtx.destination);
    
    if (bufferClick) {
        const source = audioCtx.createBufferSource();
        source.buffer = bufferClick;
        source.playbackRate.value = esAcento ? 1.3 : 1.0;
        gain.gain.value = esAcento ? 1.0 : 0.4;
        source.connect(gain);
        source.start();
    }
}
// ==========================================================================
// 🛠️ HERRAMIENTA: INSERCIÓN DE COMPASES EN EDITOR (BORRADO ATÓMICO)
// ==========================================================================
function insertarCompases() {
    let editor = document.getElementById('crear-letra');
    if (!editor) return;

    let cursor = editor.selectionStart;
    let texto = editor.value;
    
    // Detectamos el inicio exacto de la línea actual
    let inicioLinea = texto.lastIndexOf('\n', cursor - 1) + 1;
    let finLinea = texto.indexOf('\n', cursor);
    if (finLinea === -1) finLinea = texto.length;

    let lineaActual = texto.substring(inicioLinea, finLinea);

    // Evita duplicados si la línea ya empieza con un compás
    if (/^\|\s*\d*\s*\|/.test(lineaActual)) {
        editor.focus();
        return; 
    }

    // Si había un compás por ahí en medio, lo borramos para ponerlo al principio
    let lineaLimpia = lineaActual.replace(/\|\s*\d*\s*\|/g, '').trimStart();
    
    // Lo pegamos EXACTAMENTE al principio, quedando así: "| |Intro"
    let nuevoTexto = texto.slice(0, inicioLinea) + "| |" + lineaLimpia + texto.slice(finLinea);

    // Guardamos en historial ANTES del cambio para que el Undo funcione
    if (historialEdicion.length === 0 || historialEdicion[historialEdicion.length - 1] !== texto) {
        historialEdicion.push(texto);
        if(historialEdicion.length > 50) historialEdicion.shift();
    }

    editor.value = nuevoTexto;
    
    // Metemos el cursor justo en medio del | |
    editor.selectionStart = editor.selectionEnd = inicioLinea + 1;
    editor.focus();
    editor.dispatchEvent(new Event('input'));
}

// 🛡️ DETECTOR MAESTRO PARA EL EDITOR (COMPASES)
document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('crear-letra');
    if (editor) {
        
        // 1. Manejo Inteligente de Borrado (Backspace / Delete)
        editor.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' || e.key === 'Delete') {
                // Si el usuario seleccionó varias letras a la vez, lo dejamos borrar normal
                if (this.selectionStart !== this.selectionEnd) return;

                const cursor = this.selectionStart;
                const text = this.value;
                const regex = /\|[ \d]\|/g; // Busca bloques como "| |" o "|4|"
                let match;
                
                while ((match = regex.exec(text)) !== null) {
                    const start = match.index;
                    const end = start + 3; // La longitud del bloque siempre es 3
                    
                    if (e.key === 'Backspace') {
                        if (cursor === start + 1 || cursor === start + 3) {
                            // Está intentando borrar una de las barras '|' -> BORRAMOS TODO
                            e.preventDefault();
                            this.value = text.slice(0, start) + text.slice(end);
                            this.selectionStart = this.selectionEnd = start;
                            this.dispatchEvent(new Event('input'));
                            return;
                        } else if (cursor === start + 2) {
                            // Está borrando el número de adentro -> LO CAMBIAMOS POR ESPACIO
                            e.preventDefault();
                            this.value = text.slice(0, start + 1) + " " + text.slice(start + 2);
                            this.selectionStart = this.selectionEnd = start + 1; // Cursor listo para escribir de nuevo
                            this.dispatchEvent(new Event('input'));
                            return;
                        }
                    } else if (e.key === 'Delete') {
                        if (cursor === start || cursor === start + 2) {
                            // Está intentando borrar una de las barras '|' con Suprimir -> BORRAMOS TODO
                            e.preventDefault();
                            this.value = text.slice(0, start) + text.slice(end);
                            this.selectionStart = this.selectionEnd = start;
                            this.dispatchEvent(new Event('input'));
                            return;
                        } else if (cursor === start + 1) {
                            // Está borrando el número hacia adelante -> LO CAMBIAMOS POR ESPACIO
                            e.preventDefault();
                            this.value = text.slice(0, start + 1) + " " + text.slice(start + 2);
                            this.selectionStart = this.selectionEnd = start + 1; // El cursor se queda en su sitio
                            this.dispatchEvent(new Event('input'));
                            return;
                        }
                    }
                }
            }
        });

        // 2. Restricción de 1 Dígito y Sobreescritura
        editor.addEventListener('keypress', function(e) {
            const cursor = this.selectionStart;
            const text = this.value;
            
            // Si el cursor está justo después del primer '|' y antes del segundo '|'
            if (text[cursor - 1] === '|' && (text[cursor] === ' ' || /\d/.test(text[cursor])) && text[cursor + 1] === '|') {
                if (!/\d/.test(e.key)) {
                    e.preventDefault(); // Si intenta escribir una letra, la bloqueamos
                } else {
                    e.preventDefault();
                    // Sobrescribe el número y empuja el cursor hacia adelante
                    this.value = text.slice(0, cursor) + e.key + text.slice(cursor + 1);
                    this.selectionStart = this.selectionEnd = cursor + 1; 
                    this.dispatchEvent(new Event('input'));
                }
            }
        });
    }
});


// ==========================================================================
// 🗣️ MOTOR DE VOZ INTELIGENTE (FUSIÓN DE AUDIOS: "Repetir" + "Sección")
// ==========================================================================
function anunciarVozGuia(texto, esRepeticion = false, esUltimaRepeticion = false) {
    const guiaActiva = localStorage.getItem('config_adv_voice-guide') === 'true';
    if (!guiaActiva || !texto) return;

    let textoNormalizado = texto.toLowerCase().trim();
    
    // Limpieza de guiones (Convierte "Pre-coro" en "pre coro")
    textoNormalizado = textoNormalizado.replace(/-/g, ' ').replace(/\s+/g, ' ');

    // Traductor de Números Romanos a Arábigos
    textoNormalizado = textoNormalizado.replace(/\biv\b/g, "4")
                                       .replace(/\biii\b/g, "3")
                                       .replace(/\bii\b/g, "2")
                                       .replace(/\bi\b/g, "1")
                                       .replace(/\bv\b/g, "5");

    let clavesCoincidentes = Object.keys(mapaPalabrasClave).filter(k => 
        textoNormalizado.includes(k) && k !== 'repetir'
    );
    
    // Filtramos la coincidencia más exacta y larga
    let claveDetectada = clavesCoincidentes.sort((a, b) => b.length - a.length)[0];

    if (claveDetectada) {
        const lang = localStorage.getItem('config_idioma') || 'es';
        let audiosAReproducir = [];

        // 1. Inyectar "Repetir.wav" justo antes de la sección
        if (esRepeticion && mapaPalabrasClave['repetir']) {
            audiosAReproducir.push(`voces/${lang}/${mapaPalabrasClave['repetir']}`);
        }

        // 2. Añadir la sección principal (ej. "Coro.wav")
        let nombreArchivoSeccion = mapaPalabrasClave[claveDetectada];
        audiosAReproducir.push(`voces/${lang}/${nombreArchivoSeccion}`);

        // 3. Inyectar "Ultima Vez.wav" al final SI es el último bloque de un x3 o mayor
        if (esUltimaRepeticion && mapaPalabrasClave['ultima vez']) {
            audiosAReproducir.push(`voces/${lang}/${mapaPalabrasClave['ultima vez']}`);
        }

        // Enviamos todo a tu súper-reproductor con overlapping
        reproducirVocesEnSecuencia(audiosAReproducir);
    }
}
// Motor reproductor de la voz guía (BLINDADO CONTRA IDM)
async function reproducirVocesEnSecuencia(audios) {
    if (!audios || audios.length === 0) return;

    const blobs = await Promise.all(audios.map(url =>
        fetch(url).then(res => res.blob()).catch(() => null)
    ));

    let idx = 0;

    function playNext() {
        if (idx >= blobs.length) return;

        const blob = blobs[idx];
        if (!blob) {
            idx++;
            playNext();
            return;
        }

        const urlSegura = URL.createObjectURL(blob);
        
        // 🔥 EL CAMBIO MAESTRO: En vez de "const voz = new Audio()", 
        // usamos el reproductor global que el celular YA autorizó en el conteo.
        reproductorVozGuia.src = urlSegura;
        reproductorVozGuia.load(); // Obliga al celular a registrar el cambio de pista

        let siguienteDisparado = false;

        reproductorVozGuia.onloadedmetadata = () => {
            // Tu misma matemática perfecta
            const tiempoDeEspera = (reproductorVozGuia.duration - 0.7) * 1000;
            
            setTimeout(() => {
                if (!siguienteDisparado) {
                    siguienteDisparado = true;
                    idx++;
                    playNext();
                }
            }, Math.max(0, tiempoDeEspera)); 
        };

        reproductorVozGuia.onended = () => {
            URL.revokeObjectURL(urlSegura); 
            if (!siguienteDisparado) {
                siguienteDisparado = true;
                idx++;
                playNext();
            }
        };

        // Al usar el reproductor reciclado, Safari y Chrome lo dejan sonar
        reproductorVozGuia.play().catch(e => console.warn("Audio de voz no disponible:", e));
    }

    playNext();
}
// ESTO ES UN EJEMPLO DE DÓNDE INSERTARLO EN TU CÓDIGO DE METRÓNOMO
function playNextBeat() {
    // ... tu lógica de sonido de metrónomo ...

    currentBeatCount++; // El tiempo (1, 2, 3, 4)
    if (currentBeatCount > tiemposPorCompasTotal) {
        currentBeatCount = 1;
        currentMeasureCount++; // El compás total de la canción
    }

    // 🔥 INSERTAR LA LLAMADA AQUÍ 🔥
    // Conecta el tiempo musical con el visor y la coordinación
    if (typeof procesarBeatMusical === 'function') {
        procesarBeatMusical(currentBeatCount, currentMeasureCount);
    }
    
    // ... más lógica de metrónomo ...
}
// ESTA FUNCIÓN SE DEBE EJECUTAR EN CADA BEAT DEL METRÓNOMO
// Recibe el tiempo actual (1, 2, 3, 4) y el conteo total de compases de la canción
function procesarBeatMusical(tiempoActualEnCompas, compasTotalCancion) {
    // 🔥 EL FIX: Cambiado a indiceEditando !== null
    if (!metroActivo || indiceEditando !== null) return;

    const visorTexto = document.getElementById('visor-texto') || document.querySelector('.lyrics-container');
    if (!visorTexto) return;

    const bpmInput = document.getElementById('bpm-input');
    const compasDisplay = document.getElementById('compas-display');
    beatsPorMinutoActual = parseInt(bpmInput ? bpmInput.value : 85) || 85;
    tiemposPorCompasActual = parseInt(compasDisplay ? compasDisplay.innerText.split('/')[0] : 4) || 4;

    const seccionesDom = Array.from(visorTexto.querySelectorAll('.seccion-bloque'));
    if (seccionesDom.length === 0) return;

    if (tiempoActualEnCompas === 1) {
        let compasesAcumulados = 0;
        let nuevaSeccionDom = null;

        for (let seccion of seccionesDom) {
            let compasesDeEstaSeccion = parseInt(seccion.dataset.compases) || 0;
            let duracionSeccion = compasesDeEstaSeccion > 0 ? compasesDeEstaSeccion : 1; 
            
            if (compasTotalCancion <= compasesAcumulados + duracionSeccion) {
                nuevaSeccionDom = seccion;
                compasActualDeLaSeccion = (compasTotalCancion - compasesAcumulados);
                break;
            }
            compasesAcumulados += duracionSeccion;
        }

        if (nuevaSeccionDom !== seccionActualDom) {
            seccionActualDom = nuevaSeccionDom;
            actualizarVelocidadScrollPorSeccion(); 

            if (compasTotalCancion === 1) {
                if (autoplayActivo && typeof anunciarVozGuia === 'function') {
                    anunciarVozGuia(seccionActualDom.dataset.nombreSeccion);
                }
            }
        }
    }

    if (tiempoActualEnCompas === 3) {
        if (seccionActualDom) {
            let compasesDefinidos = parseInt(seccionActualDom.dataset.compases) || 0;
            let duracionSeccionActual = compasesDefinidos > 0 ? compasesDefinidos : 1;
            
            if (compasActualDeLaSeccion === duracionSeccionActual) {
                let indexActual = seccionesDom.indexOf(seccionActualDom);
                if (indexActual !== -1 && indexActual + 1 < seccionesDom.length) {
                    let siguienteSeccionDom = seccionesDom[indexActual + 1];
                    let nombreSiguienteSeccion = siguienteSeccionDom.dataset.nombreSeccion;
                    
                    if (autoplayActivo && typeof anunciarVozGuia === 'function') {
                        anunciarVozGuia(nombreSiguienteSeccion);
                    }
                }
            }
        }
    }
}

// LA INTELIGENCIA DEL SCROLL: Calcula px/segundo exactos para la sección actual
function actualizarVelocidadScrollPorSeccion() {
    if (!seccionActualDom || !autoplayActivo) {
        velocidadScrollCalculada = 0;
        return;
    }

    // Obtenemos la duración musical de la sección en SEGUNDOS
    let compasesDefinidos = parseInt(seccionActualDom.dataset.compases) || 0;
    let compasesTotalesSeccion = compasesDefinidos > 0 ? compasesDefinidos : 1;
    let duracionMusicalSegundos = compasesTotalesSeccion * tiemposPorCompasActual * (60 / beatsPorMinutoActual);

    if (duracionMusicalSegundos <= 0) {
        velocidadScrollCalculada = 0;
        return;
    }

    // Obtenemos la altura real en PÍXELES de la sección del DOM
    // `offsetHeight` mide la altura del contenedor con su padding y bordes.
    // Esto cumple la indicación: "debe toma el espacio grande o pequeño... de encabezado a encabezado"
    let alturaPixeles = seccionActualDom.offsetHeight;
    
    // Cálculo final px/segundo
    velocidadScrollCalculada = alturaPixeles / duracionMusicalSegundos;

    if (velocidadScrollCalculada <= 0 || !isFinite(velocidadScrollCalculada)) {
        velocidadScrollCalculada = 0;
    }
}
// ==========================================================================
// ESCUCHADOR DE ARRASTRE TÁCTIL (SINCRONIZACIÓN EN VIVO)
// ==========================================================================
window.addEventListener('scroll', () => {
    // Si el usuario arrastra la pantalla con el dedo, verificamos si algún
    // encabezado tocó la línea para forzar la sincronización del metrónomo.
    if (autoplayActivo || metroActivo) {
        if (typeof chequearInterseccionVozGuia === 'function') {
            chequearInterseccionVozGuia();
        }
    }
}, { passive: true });
/* ==========================================================================
   FIN DEL ARCHIVO SCRIPT.JS - PraiseBook Pro 2026
   ========================================================================== */

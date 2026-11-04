/* navbar.js: barra de navegación de las páginas internas.
   Necesita datos.js, estado.js y utils.js cargados antes.
   Cada página solo tiene <header id="navbar"></header> y este archivo lo completa. */

const ICONOS = {
    racha: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ff9400" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 18.56c0-2.05-1.68-3.38-2.5-3.91-.82.53-2.5 1.86-2.5 3.91 0 1.62 1.12 2.94 2.5 2.94s2.5-1.32 2.5-2.94"></path><path d="M18.78 7.39a.99.99 0 0 0-.83.32c-.77.84-1.82 1.31-2.94 1.31-2.21 0-4.01-1.8-4.01-4.01 0-.27.03-.56.1-.87.08-.39-.07-.79-.38-1.02a.98.98 0 0 0-1.09-.06C7.16 4.48 3 7.67 3 13.01c0 3.59 2.12 6.7 5.18 8.14-.42-.75-.68-1.63-.68-2.57 0-3.96 3.9-5.88 4.07-5.96.28-.13.59-.13.87 0 .17.08 4.07 2.01 4.07 5.96 0 .95-.26 1.82-.68 2.57 3.05-1.44 5.18-4.54 5.18-8.14 0-1.82-.49-3.55-1.47-5.14a.98.98 0 0 0-.76-.47Z"></path></svg>',
    xp: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#00c8ee" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.92 11.61c-.16-.37-.52-.61-.92-.61h-3.3l4.17-7.51c.22-.39.15-.88-.17-1.19s-.8-.38-1.19-.17L13.4 6.08l.58-2.88c.08-.42-.11-.84-.47-1.06-.37-.22-.83-.17-1.16.1L4.19 9.2c-2.92 2.92-2.92 7.68 0 10.61 1.42 1.42 3.3 2.2 5.3 2.2s3.89-.78 5.31-2.21l6.9-7.1a1 1 0 0 0 .2-1.09ZM9.5 18C7.57 18 6 16.43 6 14.5c0-1.4.83-2.6 2.02-3.16 0 .05-.02.1-.02.16 0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5c0-.05-.01-.11-.02-.16C12.17 11.9 13 13.1 13 14.5c0 1.93-1.57 3.5-3.5 3.5"></path></svg>',
    gemas: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#FF63DA" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.44 11H17.7l-3.12 8.44 6.77-8.27c.04-.05.06-.11.1-.17ZM10.72 2 8.39 9h7.22l-2.33-7zm10.81 6.91-3.37-5.9A2 2 0 0 0 16.42 2h-1.03l2.33 7h3.84s-.02-.06-.04-.09ZM8.39 11l3.4 10.2L15.56 11zM5.84 3.01l-3.37 5.9s-.02.06-.04.09h3.84L8.6 2H7.57c-.72 0-1.38.39-1.74 1.01Zm3.02 15.73L6.28 11H2.56c.04.05.06.11.1.17l6.2 7.58Z"></path></svg>',
    vidas: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#af1818" viewBox="0 0 24 24" aria-hidden="true"><path d="M11.29 20.69c.2.2.45.29.71.29s.51-.1.71-.29l7.5-7.5c2.35-2.35 2.35-6.05 0-8.41-2.29-2.29-5.84-2.35-8.21-.2-2.36-2.15-5.91-2.09-8.21.2-2.35 2.36-2.35 6.06 0 8.41z"></path></svg>',
};

/* Links del menú. */
/* Links del menú. */
const LINKS_NAVBAR = [
    {
        texto: "Mis cursos",
        href: "../cursos/mis-cursos.html",
        seccion: "mis-cursos",
        // Ícono: Gorro de graduación
        icono: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
    },
    {
        texto: "Catálogo",
        href: "../cursos/catalogo.html",
        seccion: "catalogo",
        // Ícono: Libreta / Catálogo
        icono: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><path d="M8 7h8M8 11h8M8 15h4"/></svg>`,
    },
    {
        texto: "Perfil",
        href: "../perfil/perfil.html",
        seccion: "perfil",
        // Ícono: Usuario
        icono: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    },
    {
        texto: "Ranking",
        href: "../ranking/ranking.html",
        seccion: "ranking",
        // Ícono: Trofeo
        icono: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`,
    },
    {
        texto: "Tienda",
        href: "../tienda/tienda.html",
        seccion: "tienda",
        // Ícono: Carrito de compras
        icono: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`,
    },
];

// Mira la URL y dice en qué sección estamos
function seccionActual() {
    const ruta = window.location.pathname;
    if (ruta.includes("/cursos/catalogo")) return "catalogo";
    if (ruta.includes("/cursos/")) return "mis-cursos";
    if (ruta.includes("/perfil/")) return "perfil";
    if (ruta.includes("/ranking/")) return "ranking";
    if (ruta.includes("/tienda/")) return "tienda";
    return "";
}

// Arma (o vuelve a armar) el navbar con los datos del usuario
function actualizarNavbar() {
    const contenedor = document.getElementById("navbar");
    const usuario = usuarioActual();
    if (!contenedor || !usuario) return;

    const seccion = seccionActual();
    const racha = rachaActual(usuario);

    // Un <li> por link para el menú lateral
    // Un <li> por link para el menú lateral
    let links = "";
    LINKS_NAVBAR.forEach(function (link) {
        const actual = link.seccion === seccion ? ' aria-current="page"' : "";
        links +=
            '<li><a href="' +
            link.href +
            '"' +
            actual +
            ">" +
            link.icono + // Insertamos el ícono
            "<span>" +
            link.texto +
            "</span>" + // Envolvemos el texto
            "</a></li>";
    });

    contenedor.innerHTML = `
        <nav class="navbar" aria-label="Menú principal">
            <!-- Botón Hamburguesa (Izquierda) -->
            <button id="btn-hamburguesa" class="btn-hamburguesa" aria-label="Abrir menú" aria-expanded="false">
                <span></span>
                <span></span>
                <span></span>
            </button>

            <!-- Logo (Centro) -->
            <a href="../inicio/inicio.html" class="navbar-logo">
                <img src="../../imagenes/poli/TipoLogo.png" alt="PoliLingo: ir al inicio" />
            </a>

            <!-- Estadísticas (Derecha) -->
            <ul class="navbar-estadisticas">
                <li>
                    <a href="../racha/racha.html" class="racha-link">
                        <span>${ICONOS.racha} ${racha} ${racha === 1 ? "día" : "días"}</span>
                    </a>
                </li>
                <li>
                    <span title="Experiencia total">${ICONOS.xp} ${usuario.xpTotal} XP</span>
                </li>
                <li>
                    <a href="../tienda/tienda.html" class="racha-link">
                        <span>${ICONOS.gemas} ${usuario.gemas}</span>
                    </a>
                </li>
                <li>
                    <a href="../tienda/tienda.html" class="racha-link" aria-label="${usuario.vidas} vidas">
                        <span>${ICONOS.vidas} ${usuario.vidas}</span>
                    </a>
                </li>
            </ul>
        </nav>

        <!-- Capa de desenfoque de fondo -->
        <div id="navbar-overlay" class="navbar-overlay"></div>

        <!-- Menú Lateral Deslizante -->
        <aside id="navbar-menu" class="navbar-menu">
            <div class="menu-header">
                <h2>Menú</h2>
                <button id="btn-cerrar-menu" class="btn-cerrar-menu" aria-label="Cerrar menú">✕</button>
            </div>
            <ul class="navbar-links-menu">
                ${links}
            </ul>
        </aside>
    `;

    // --- Lógica para abrir y cerrar el menú ---
    const btnHamburguesa = document.getElementById("btn-hamburguesa");
    const btnCerrarMenu = document.getElementById("btn-cerrar-menu");
    const menuLateral = document.getElementById("navbar-menu");
    const overlay = document.getElementById("navbar-overlay");

    function toggleMenu(abrir) {
        if (abrir) {
            menuLateral.classList.add("abierto");
            overlay.classList.add("abierto");
            btnHamburguesa.setAttribute("aria-expanded", "true");
        } else {
            menuLateral.classList.remove("abierto");
            overlay.classList.remove("abierto");
            btnHamburguesa.setAttribute("aria-expanded", "false");
        }
    }

    btnHamburguesa.addEventListener("click", () => toggleMenu(true));
    btnCerrarMenu.addEventListener("click", () => toggleMenu(false));
    overlay.addEventListener("click", () => toggleMenu(false));
}

document.addEventListener("DOMContentLoaded", function () {
    if (!usuarioActual()) {
        window.location.href = "../cuenta/login.html";
        return;
    }
    actualizarNavbar();
    crearFooter();
});

function crearFooter() {
    const footer = document.getElementById("footer");
    if (!footer) return;
    const anio = new Date().getFullYear();
    footer.innerHTML =
        "<p>©" + anio + " PoliLingo - Todos los derechos reservados.</p>";
}

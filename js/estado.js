/* =====================================================
   estado.js — Lo que cambia con el uso de PoliLingo
   -----------------------------------------------------
   Maneja todo lo que se guarda en localStorage:
   - las cuentas de usuario y su progreso
   - la sesión activa (quién está logueado)
   - los comentarios y valoraciones de los cursos
 
   Necesita que datos.js esté cargado ANTES.
 
   Dos tipos de funciones:
   1) Funciones de CONSULTA: reciben un usuario y devuelven
      información. No guardan nada.
         ej: obtenerProgresoCurso(usuario, "ingles")
   2) Funciones de ACCIÓN: trabajan sobre el usuario que
      inició sesión, modifican sus datos y los GUARDAN.
      Devuelven un objeto { ok, mensaje, ... } para que la
      página muestre el resultado.
         ej: inscribirse("chino")
 
   Importante: usuarioActual() devuelve una COPIA del usuario.
   Si una página modifica algo a mano, tiene que llamar a
   guardarUsuario(usuario) para que quede guardado.
   ===================================================== */
 
const CLAVE_USUARIOS = "polilingo_usuarios";
const CLAVE_SESION = "polilingo_sesion";
const CLAVE_COMENTARIOS = "polilingo_comentarios";
 
/* ===================== localStorage ===================== */
 
// Lee un valor guardado. Si no existe o está roto, devuelve "porDefecto".
function leerGuardado(clave, porDefecto) {
    try {
        const texto = localStorage.getItem(clave);
        return texto === null ? porDefecto : JSON.parse(texto);
    } catch (error) {
        return porDefecto;
    }

}
 
function guardarDato(clave, valor) {
    try {
        localStorage.setItem(clave, JSON.stringify(valor));
        return true;
    } catch (error) {
        return false;

    }
}
 
/* ===================== Fechas ===================== */
// Las fechas se guardan como texto "AAAA-MM-DD" (fácil de comparar y de guardar).
 
function fechaATexto(fecha) {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");
    return anio + "-" + mes + "-" + dia;
}
 
function textoAFecha(texto) {
    const partes = texto.split("-");
    return new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]));
}
 
function fechaHoy() {
    return fechaATexto(new Date());
}
 
function sumarDias(texto, dias) {
    const fecha = textoAFecha(texto);
    fecha.setDate(fecha.getDate() + dias);
    return fechaATexto(fecha);
}
 
// Días de diferencia entre dos fechas texto (b - a)
function diasEntre(a, b) {
    const unDia = 24 * 60 * 60 * 1000;
    return Math.round((textoAFecha(b) - textoAFecha(a)) / unDia);
}
 
/* ===================== Carga inicial ===================== */
 
// La primera vez que se abre la página, copia los usuarios y
// comentarios de demostración de datos.js a localStorage.
function inicializarDatos() {
    if (leerGuardado(CLAVE_USUARIOS, null) === null) {
        const hoy = fechaHoy();
        const usuarios = USUARIOS_DEMO.map(function (demo) {
            const usuario = JSON.parse(JSON.stringify(demo)); // copia
            // Racha vigente: los últimos N días hasta ayer
            usuario.diasActivos = [];
            for (let i = usuario.diasDeRacha; i >= 1; i--) {
                usuario.diasActivos.push(sumarDias(hoy, -i));
            }
            delete usuario.diasDeRacha;
            // Las lecciones completadas quedan con fecha de ayer
            for (const curso in usuario.progreso) {
                for (const clave in usuario.progreso[curso]) {
                    usuario.progreso[curso][clave].fecha = sumarDias(hoy, -1);
                }
            }
            usuario.fechaXpHoy = hoy;
            usuario.logros = [];
            calcularLogros(usuario);
            return usuario;
        });
        guardarDato(CLAVE_USUARIOS, usuarios);
    }
    if (leerGuardado(CLAVE_COMENTARIOS, null) === null) {
        guardarDato(CLAVE_COMENTARIOS, COMENTARIOS_DEMO);
    }
}
 
inicializarDatos(); // se ejecuta solo al cargar este archivo
 
/* ===================== Usuarios ===================== */
 
function obtenerUsuarios() {
    return leerGuardado(CLAVE_USUARIOS, []);
}
 
function guardarUsuarios(usuarios) {
    return guardarDato(CLAVE_USUARIOS, usuarios);
}
 
// Busca por nombre de usuario o por email (sin importar mayúsculas)
function buscarUsuario(usuarioOEmail) {
    if (!usuarioOEmail) return null;
    const buscado = usuarioOEmail.trim().toLowerCase();
    const usuarios = obtenerUsuarios();
    for (const usuario of usuarios) {
        if (usuario.usuario.toLowerCase() === buscado || usuario.email.toLowerCase() === buscado) {
            return usuario;
        }
    }
    return null;
}
 
function existeNombreUsuario(nombreUsuario) {
    const buscado = nombreUsuario.trim().toLowerCase();
    return obtenerUsuarios().some(function (u) { return u.usuario.toLowerCase() === buscado; });
}
 
function existeEmail(email) {
    const buscado = email.trim().toLowerCase();
    return obtenerUsuarios().some(function (u) { return u.email.toLowerCase() === buscado; });
}
 
// Guarda los cambios de un usuario (lo reemplaza en la lista)
function guardarUsuario(usuario) {
    const usuarios = obtenerUsuarios();
    const posicion = usuarios.findIndex(function (u) { return u.usuario === usuario.usuario; });
    if (posicion === -1) return false;
    usuarios[posicion] = usuario;
    return guardarUsuarios(usuarios);
}
 
// Crea una cuenta nueva. "datos" = { nombre, apellido, usuario, email, contrasenia }
// Las validaciones de formato (vacíos, email, largo) las hace registro.js;
// acá solo se controla que el usuario y el email no estén ocupados.
function crearUsuario(datos) {
    if (existeNombreUsuario(datos.usuario)) {
        return { ok: false, campo: "usuario", mensaje: "Ese nombre de usuario ya está en uso." };
    }
    if (existeEmail(datos.email)) {
        return { ok: false, campo: "email", mensaje: "Ya existe una cuenta con ese email." };
    }
    const nuevo = {
        usuario: datos.usuario.trim(),
        nombre: datos.nombre.trim(),
        apellido: datos.apellido ? datos.apellido.trim() : "",
        email: datos.email.trim(),
        contrasenia: datos.contrasenia,
        fechaAlta: fechaHoy(),
        avatar: AVATAR_PREDETERMINADO,
        idioma: "es",
        inscripciones: [],
        progreso: {},
        cursosCompletados: [],
        xpTotal: 0,
        xpSemanal: 0,
        xpHoy: 0,
        fechaXpHoy: fechaHoy(),
        racha: 0,
        mejorRacha: 0,
        diasActivos: [],
        gemas: GEMAS_INICIALES,
        vidas: VIDAS_INICIALES,
        protectoresRacha: 0,
        compras: 0,
        vidasPerdidas: 0,
        vecesSinVidas: 0,
        liga: "bronce",
        logros: [],
    };
    const usuarios = obtenerUsuarios();
    usuarios.push(nuevo);
    guardarUsuarios(usuarios);
    return { ok: true, mensaje: "¡Cuenta creada! Ya podés empezar a aprender.", usuario: nuevo };
}
 
// Cambia la contraseña. La usan recuperar (sin pedir la actual) y perfil
// (el perfil controla la contraseña actual antes de llamarla).
function cambiarPassword(usuarioOEmail, nueva) {
    const usuario = buscarUsuario(usuarioOEmail);
    if (!usuario) {
        return { ok: false, mensaje: "No encontramos una cuenta con esos datos." };
    }
    usuario.contrasenia = nueva;
    guardarUsuario(usuario);
    return { ok: true, mensaje: "Tu contraseña se cambió correctamente." };
}
 
// Borra la cuenta, sus comentarios y la sesión si era la activa.
// Al borrarse, también deja de aparecer en el ranking.
function eliminarUsuario(nombreUsuario) {
    const usuarios = obtenerUsuarios();
    const quedan = usuarios.filter(function (u) { return u.usuario !== nombreUsuario; });
    if (quedan.length === usuarios.length) {
        return { ok: false, mensaje: "No encontramos esa cuenta." };
    }
    guardarUsuarios(quedan);
    const comentarios = leerGuardado(CLAVE_COMENTARIOS, []);
    guardarDato(CLAVE_COMENTARIOS, comentarios.filter(function (c) { return c.usuario !== nombreUsuario; }));
    if (leerGuardado(CLAVE_SESION, null) === nombreUsuario) {
        cerrarSesion();
    }
    return { ok: true, mensaje: "Tu cuenta se eliminó." };
}
 
/* ===================== Sesión ===================== */
 
// Devuelve el usuario logueado (una copia) o null si no hay sesión
function usuarioActual() {
    const nombre = leerGuardado(CLAVE_SESION, null);
    if (!nombre) return null;
    const usuario = buscarUsuario(nombre);
    if (!usuario) return null;
    // XP del día: si cambió el día, arranca de cero
    if (usuario.fechaXpHoy !== fechaHoy()) {
        usuario.xpHoy = 0;
        usuario.fechaXpHoy = fechaHoy();
        guardarUsuario(usuario);
    }
    return usuario;
}
 
function haySesion() {
    return usuarioActual() !== null;
}
 
function iniciarSesion(usuarioOEmail, contrasenia) {
    const usuario = buscarUsuario(usuarioOEmail);
    if (!usuario || usuario.contrasenia !== contrasenia) {
        return { ok: false, mensaje: "Usuario o contraseña incorrectos." };
    }
    guardarDato(CLAVE_SESION, usuario.usuario);
    return { ok: true, mensaje: "¡Hola, " + usuario.nombre + "!", usuario: usuario };
}
 
// Solo borra la sesión. El usuario y su progreso quedan guardados.
function cerrarSesion() {
    try {
        localStorage.removeItem(CLAVE_SESION);
    } catch (error) {
        // nada para hacer
    }
}
 
/* ===================== Cursos (consultas) ===================== */
 
function obtenerCurso(idCurso) {
    return CURSOS[idCurso] || null;
}
 
function obtenerUnidad(idCurso, numeroUnidad) {
    const curso = obtenerCurso(idCurso);
    if (!curso) return null;
    return curso.unidades.find(function (u) { return u.numero === Number(numeroUnidad); }) || null;
}
 
function obtenerLeccion(idCurso, numeroUnidad, numeroLeccion) {
    const unidad = obtenerUnidad(idCurso, numeroUnidad);
    if (!unidad) return null;
    return unidad.lecciones.find(function (l) { return l.numero === Number(numeroLeccion); }) || null;
}
 
// "1-3" = unidad 1, lección 3
function claveLeccion(numeroUnidad, numeroLeccion) {
    return numeroUnidad + "-" + numeroLeccion;
}
 
// Todas las lecciones del curso que tienen ejercicios, en orden
function leccionesJugables(idCurso) {
    const curso = obtenerCurso(idCurso);
    const lista = [];
    if (!curso) return lista;
    curso.unidades.forEach(function (unidad) {
        unidad.lecciones.forEach(function (leccion) {
            if (leccion.ejercicios.length > 0) {
                lista.push({ unidad: unidad.numero, leccion: leccion.numero, titulo: leccion.titulo });
            }
        });
    });
    return lista;
}
 
function estaInscripto(usuario, idCurso) {
    return usuario.inscripciones.includes(idCurso);
}
 
function leccionCompletada(usuario, idCurso, numeroUnidad, numeroLeccion) {
    const progresoCurso = usuario.progreso[idCurso] || {};
    return Boolean(progresoCurso[claveLeccion(numeroUnidad, numeroLeccion)]);
}
 
// "completada" | "disponible" | "bloqueada" | "proximamente"
// Una lección se desbloquea cuando se completa la anterior (en orden, aunque sea de otra unidad).
function estadoLeccion(usuario, idCurso, numeroUnidad, numeroLeccion) {
    const leccion = obtenerLeccion(idCurso, numeroUnidad, numeroLeccion);
    if (!leccion || leccion.ejercicios.length === 0) return "proximamente";
    if (leccionCompletada(usuario, idCurso, numeroUnidad, numeroLeccion)) return "completada";
 
    const lista = leccionesJugables(idCurso);
    const posicion = lista.findIndex(function (l) {
        return l.unidad === Number(numeroUnidad) && l.leccion === Number(numeroLeccion);
    });
    if (posicion === 0) return "disponible";
    const anterior = lista[posicion - 1];
    return leccionCompletada(usuario, idCurso, anterior.unidad, anterior.leccion) ? "disponible" : "bloqueada";
}
 
// "completada" | "en-curso" | "bloqueada" | "proximamente"
function estadoUnidad(usuario, idCurso, numeroUnidad) {
    const unidad = obtenerUnidad(idCurso, numeroUnidad);
    if (!unidad) return "proximamente";
    const estados = unidad.lecciones
        .filter(function (l) { return l.ejercicios.length > 0; })
        .map(function (l) { return estadoLeccion(usuario, idCurso, numeroUnidad, l.numero); });
    if (estados.length === 0) return "proximamente";
    if (estados.every(function (e) { return e === "completada"; })) return "completada";
    if (estados.some(function (e) { return e === "completada" || e === "disponible"; })) return "en-curso";
    return "bloqueada";
}
 
// { completadas, total, porcentaje } del curso (solo cuenta lecciones con ejercicios)
function obtenerProgresoCurso(usuario, idCurso) {
    const lista = leccionesJugables(idCurso);
    const completadas = lista.filter(function (l) {
        return leccionCompletada(usuario, idCurso, l.unidad, l.leccion);
    }).length;
    const total = lista.length;
    return {
        completadas: completadas,
        total: total,
        porcentaje: total === 0 ? 0 : Math.round((completadas / total) * 100),
    };
}
 
// Lo mismo pero de una unidad. total = todas las lecciones (para mostrar "2/4 lecciones")
function obtenerProgresoUnidad(usuario, idCurso, numeroUnidad) {
    const unidad = obtenerUnidad(idCurso, numeroUnidad);
    if (!unidad) return { completadas: 0, total: 0, porcentaje: 0 };
    const completadas = unidad.lecciones.filter(function (l) {
        return leccionCompletada(usuario, idCurso, numeroUnidad, l.numero);
    }).length;
    const total = unidad.lecciones.length;
    return {
        completadas: completadas,
        total: total,
        porcentaje: total === 0 ? 0 : Math.round((completadas / total) * 100),
    };
}
 
// La próxima lección para hacer (o null si ya completó todas)
function siguienteLeccion(usuario, idCurso) {
    const lista = leccionesJugables(idCurso);
    for (const l of lista) {
        if (estadoLeccion(usuario, idCurso, l.unidad, l.leccion) === "disponible") return l;
    }
    return null;
}
 
/* ===================== Cursos (acciones) ===================== */
 
function inscribirse(idCurso) {
    const usuario = usuarioActual();
    if (!usuario) return { ok: false, mensaje: "Iniciá sesión para inscribirte." };
    const curso = obtenerCurso(idCurso);
    if (!curso) return { ok: false, mensaje: "Ese curso no existe." };
    if (estaInscripto(usuario, idCurso)) {
        return { ok: false, mensaje: "Ya estás inscripto en " + curso.nombre + "." };
    }
    usuario.inscripciones.push(idCurso);
    if (!usuario.progreso[idCurso]) usuario.progreso[idCurso] = {};
    guardarUsuario(usuario);
    return { ok: true, mensaje: "¡Te inscribiste en " + curso.nombre + "!" };
}
 
// Se llama al terminar una lección.
// Devuelve { ok, xpGanado, primeraVez, cursoCompletado, recompensa, logrosNuevos }
function completarLeccion(idCurso, numeroUnidad, numeroLeccion, xpGanado) {
    const usuario = usuarioActual();
    if (!usuario) return { ok: false, mensaje: "Iniciá sesión para guardar tu progreso." };
 
    if (!usuario.progreso[idCurso]) usuario.progreso[idCurso] = {};
    const clave = claveLeccion(numeroUnidad, numeroLeccion);
    const primeraVez = !usuario.progreso[idCurso][clave];
    usuario.progreso[idCurso][clave] = { xp: xpGanado, fecha: fechaHoy() };
 
    sumarXp(usuario, xpGanado);
    registrarActividad(usuario);
 
    // ¿Completó todo el curso por primera vez? -> recompensa una sola vez
    let cursoCompletado = false;
    const progreso = obtenerProgresoCurso(usuario, curso.id).porcentaje;
    if (progreso.total > 0 && progreso.completadas === progreso.total && !usuario.cursosCompletados.includes(idCurso)) {
        usuario.cursosCompletados.push(idCurso);
        usuario.gemas += RECOMPENSA_CURSO.gemas;
        sumarXp(usuario, RECOMPENSA_CURSO.xp);
        cursoCompletado = true;
    }
 
    const logrosNuevos = calcularLogros(usuario);
    guardarUsuario(usuario);
 
    return {
        ok: true,
        xpGanado: xpGanado,
        primeraVez: primeraVez,
        cursoCompletado: cursoCompletado,
        recompensa: cursoCompletado ? RECOMPENSA_CURSO : null,
        logrosNuevos: logrosNuevos,
    };
}
 
// Suma XP al total, a la semana y al día (no guarda: lo hace quien la llama)
function sumarXp(usuario, cantidad) {
    if (usuario.fechaXpHoy !== fechaHoy()) {
        usuario.xpHoy = 0;
        usuario.fechaXpHoy = fechaHoy();
    }
    usuario.xpTotal += cantidad;
    usuario.xpSemanal += cantidad;
    usuario.xpHoy += cantidad;
}
 
/* ===================== Racha ===================== */
 
// Anota que hoy hubo actividad y actualiza la racha (no guarda)
function registrarActividad(usuario) {
    const hoy = fechaHoy();
    const ultimo = usuario.diasActivos[usuario.diasActivos.length - 1];
    if (ultimo === hoy) return;
 
    if (!ultimo) {
        usuario.racha = 1;
    } else {
        const diasSinUsar = diasEntre(ultimo, hoy) - 1;
        if (diasSinUsar === 0) {
            usuario.racha += 1;
        } else if (diasSinUsar <= usuario.protectoresRacha) {
            // Extra: los protectores cubren los días que faltó
            usuario.protectoresRacha -= diasSinUsar;
            usuario.racha += 1;
        } else {
            usuario.racha = 1;
        }
    }
    usuario.diasActivos.push(hoy);
    usuario.mejorRacha = Math.max(usuario.mejorRacha, usuario.racha);
}
 
// La racha que hay que mostrar hoy: si dejó de usar la app y no tiene
// protectores suficientes, la racha ya se cortó (0).
function rachaActual(usuario) {
    const ultimo = usuario.diasActivos[usuario.diasActivos.length - 1];
    if (!ultimo) return 0;
    const diasSinUsar = diasEntre(ultimo, fechaHoy()) - 1;
    if (diasSinUsar <= 0) return usuario.racha; // usó la app hoy o ayer
    return diasSinUsar <= usuario.protectoresRacha ? usuario.racha : 0;
}
 
function hizoActividadHoy(usuario) {
    return usuario.diasActivos.includes(fechaHoy());
}
 
/* ===================== Vidas ===================== */
 
function tieneVidas(usuario) {
    return usuario.vidas > 0;
}
 
// Se llama cuando se gastan los 3 intentos de una lección
function perderVida() {
    const usuario = usuarioActual();
    if (!usuario) return { ok: false, mensaje: "No hay sesión iniciada." };
    if (usuario.vidas > 0) usuario.vidas -= 1;
    usuario.vidasPerdidas += 1;
    if (usuario.vidas === 0) usuario.vecesSinVidas += 1;
    const logrosNuevos = calcularLogros(usuario);
    guardarUsuario(usuario);
    return { ok: true, vidas: usuario.vidas, sinVidas: usuario.vidas === 0, logrosNuevos: logrosNuevos };
}
 
/* ===================== Gemas y tienda ===================== */
 
function agregarGemas(cantidad) {
    const usuario = usuarioActual();
    if (!usuario) return { ok: false, mensaje: "No hay sesión iniciada." };
    usuario.gemas += cantidad;
    calcularLogros(usuario);
    guardarUsuario(usuario);
    return { ok: true, gemas: usuario.gemas };
}
 
function gastarGemas(cantidad) {
    const usuario = usuarioActual();
    if (!usuario) return { ok: false, mensaje: "No hay sesión iniciada." };
    if (usuario.gemas < cantidad) {
        return { ok: false, mensaje: "No te alcanzan las gemas. Te faltan " + (cantidad - usuario.gemas) + "." };
    }
    usuario.gemas -= cantidad;
    guardarUsuario(usuario);
    return { ok: true, gemas: usuario.gemas };
}
 
function obtenerProducto(idProducto) {
    return PRODUCTOS.find(function (p) { return p.id === idProducto; }) || null;
}
 
// Compra con gemas desde la tienda
function comprarConGemas(idProducto) {
    const usuario = usuarioActual();
    const producto = obtenerProducto(idProducto);
    if (!usuario) return { ok: false, mensaje: "No hay sesión iniciada." };
    if (!producto || producto.tipo !== "gemas") return { ok: false, mensaje: "Ese producto no se compra con gemas." };
 
    if (producto.id === "recarga-vidas" && usuario.vidas >= VIDAS_MAX) {
        return { ok: false, mensaje: "Ya tenés todas tus vidas." };
    }
    if (producto.id === "protector-racha" && usuario.protectoresRacha >= producto.maximo) {
        return { ok: false, mensaje: "Ya tenés el máximo de " + producto.maximo + " protectores equipados." };
    }
    if (usuario.gemas < producto.precio) {
        return { ok: false, mensaje: "No te alcanzan las gemas. Te faltan " + (producto.precio - usuario.gemas) + "." };
    }
 
    usuario.gemas -= producto.precio;
    if (producto.id === "recarga-vidas") usuario.vidas = VIDAS_MAX;
    if (producto.id === "protector-racha") usuario.protectoresRacha += 1;
    usuario.compras += 1;
    const logrosNuevos = calcularLogros(usuario);
    guardarUsuario(usuario);
    return { ok: true, mensaje: "¡Compraste " + producto.nombre + "!", logrosNuevos: logrosNuevos };
}
 
// Compra "con dinero" simulada (después de validar metodo-de-pago)
function acreditarCompraSimulada(idProducto) {
    const usuario = usuarioActual();
    const producto = obtenerProducto(idProducto);
    if (!usuario) return { ok: false, mensaje: "No hay sesión iniciada." };
    if (!producto || producto.tipo !== "dinero") return { ok: false, mensaje: "Ese producto no existe." };
    usuario.gemas += producto.gemas;
    usuario.protectoresRacha += producto.protectores;
    usuario.compras += 1;
    const logrosNuevos = calcularLogros(usuario);
    guardarUsuario(usuario);
    return { ok: true, mensaje: "¡Listo! Sumaste " + producto.gemas + " gemas.", logrosNuevos: logrosNuevos };
}
 
/* ===================== Logros ===================== */
 
// { actual, meta, porcentaje, desbloqueado } de un logro para un usuario
function progresoLogro(usuario, logro) {
    const yaLoTiene = usuario.logros.includes(logro.id);
    const actual = Math.min(logro.valor(usuario), logro.meta);
    return {
        actual: yaLoTiene ? logro.meta : actual,
        meta: logro.meta,
        porcentaje: yaLoTiene ? 100 : Math.round((actual / logro.meta) * 100),
        desbloqueado: yaLoTiene,
    };
}
 
// Revisa qué logros alcanzó y los agrega. Devuelve los NUEVOS (no guarda).
// Una vez desbloqueado, un logro queda aunque después baje el valor (ej: gemas).
function calcularLogros(usuario) {
    const nuevos = [];
    LOGROS.forEach(function (logro) {
        if (!usuario.logros.includes(logro.id) && logro.valor(usuario) >= logro.meta) {
            usuario.logros.push(logro.id);
            nuevos.push(logro);
        }
    });
    return nuevos;
}
 
/* ===================== Perfil ===================== */
 
function cambiarAvatar(archivo) {
    const usuario = usuarioActual();
    if (!usuario) return { ok: false, mensaje: "No hay sesión iniciada." };
    if (!AVATARES.includes(archivo) && archivo !== AVATAR_PREDETERMINADO) {
        return { ok: false, mensaje: "Elegí una de las imágenes disponibles." };
    }
    usuario.avatar = archivo;
    const logrosNuevos = calcularLogros(usuario);
    guardarUsuario(usuario);
    return { ok: true, mensaje: "¡Foto actualizada!", logrosNuevos: logrosNuevos };
}
 
function cambiarIdioma(idioma) {
    const usuario = usuarioActual();
    if (!usuario) return { ok: false, mensaje: "No hay sesión iniciada." };
    usuario.idioma = idioma;
    guardarUsuario(usuario);
    return { ok: true };
}
 
/* ===================== Comentarios y valoraciones ===================== */
 
// Comentarios de un curso, del más nuevo al más viejo, con el avatar de quien lo escribió
function obtenerComentarios(idCurso) {
    const usuarios = obtenerUsuarios();
    return leerGuardado(CLAVE_COMENTARIOS, [])
        .filter(function (c) { return c.curso === idCurso; })
        .map(function (c) {
            const autor = usuarios.find(function (u) { return u.usuario === c.usuario; });
            const demo = PARTICIPANTES_DEMO.find(function (p) { return p.usuario === c.usuario; });
            const avatar = autor ? autor.avatar : demo ? demo.avatar : AVATAR_PREDETERMINADO;
            return Object.assign({}, c, { avatar: avatar });
        })
        .sort(function (a, b) { return a.fecha < b.fecha ? 1 : -1; });
}
 
// Promedio de estrellas del curso (0 si no tiene valoraciones)
function promedioEstrellas(idCurso) {
    const comentarios = obtenerComentarios(idCurso);
    if (comentarios.length === 0) return 0;
    const suma = comentarios.reduce(function (total, c) { return total + c.estrellas; }, 0);
    return Math.round((suma / comentarios.length) * 10) / 10;
}
 
function agregarComentario(idCurso, estrellas, texto) {
    const usuario = usuarioActual();
    if (!usuario) return { ok: false, mensaje: "Iniciá sesión para comentar." };
    if (!obtenerCurso(idCurso)) return { ok: false, mensaje: "Ese curso no existe." };
    const numero = Number(estrellas);
    if (!(numero >= 1 && numero <= 5)) return { ok: false, campo: "estrellas", mensaje: "Elegí de 1 a 5 estrellas." };
    if (!texto || texto.trim() === "") return { ok: false, campo: "texto", mensaje: "Escribí un comentario." };
 
    const comentarios = leerGuardado(CLAVE_COMENTARIOS, []);
    comentarios.push({
        curso: idCurso,
        usuario: usuario.usuario,
        estrellas: numero,
        texto: texto.trim(),
        fecha: fechaHoy(),
    });
    guardarDato(CLAVE_COMENTARIOS, comentarios);
    return { ok: true, mensaje: "¡Gracias por tu opinión!" };
}
 
/* ===================== Ranking ===================== */
 
function obtenerLiga(idLiga) {
    return LIGAS.find(function (l) { return l.id === idLiga; }) || null;
}
 
// Tabla de una liga: participantes de demo + usuarios registrados de esa liga,
// ordenada por XP semanal. Cada fila: { puesto, usuario, avatar, xpSemanal, estado, esActual }
function obtenerRanking(idLiga) {
    const liga = obtenerLiga(idLiga);
    if (!liga) return [];
    const actual = leerGuardado(CLAVE_SESION, null);
 
    const filas = PARTICIPANTES_DEMO
        .filter(function (p) { return p.liga === idLiga; })
        .map(function (p) { return { usuario: p.usuario, avatar: p.avatar, xpSemanal: p.xpSemanal, esActual: false }; });
 
    obtenerUsuarios()
        .filter(function (u) { return u.liga === idLiga; })
        .forEach(function (u) {
            filas.push({ usuario: u.usuario, avatar: u.avatar, xpSemanal: u.xpSemanal, esActual: u.usuario === actual });
        });
 
    filas.sort(function (a, b) { return b.xpSemanal - a.xpSemanal; });
 
    return filas.map(function (fila, i) {
        const puesto = i + 1;
        let estado = "Zona neutral";
        if (puesto <= liga.ascienden) estado = "Zona de ascenso";
        else if (liga.descienden > 0 && puesto > filas.length - liga.descienden) estado = "Zona de descenso";
        if (!liga.siguiente && puesto <= 3) estado = "Top " + puesto;
        return Object.assign({ puesto: puesto, estado: estado }, fila);
    });
}


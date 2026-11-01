//busca si hay datos gguardados y si lo encuentra parsea los datos a un array
const obtenerUsuariosRegistrados = () => {
  const datosGuardados = localStorage.getItem("usuarios");

  if (datosGuardados) {
    return JSON.parse(datosGuardados);
  } else {
    return [];
  }
};

//recibe la lista actualizada de usuarios y lo guarda den el localstorage de usuarios
const guardarListaUsuarios = (listaUsuarios) => {
  localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
};

const registrarNuevoUsuario = (usuarioValor, passwordValor) => {
  let listaUsuarios = obtenerUsuariosRegistrados();

  let usuarioExistente = null;
  //busca si un usuario ya existe
  for (const u of listaUsuarios) {
    if (u.usuario.toLowerCase() === usuarioValor.toLowerCase()) {
      usuarioExistente = u;
      break;
    }
  }

  //si existe manda mensaje de que ya esta registrado
  if (usuarioExistente) {
    return {
      exito: false,
      mensaje: `El usuario "${usuarioValor}" ya está registrado.`,
    };
  }

  //crea el usuario con los datos enviados y le pone la configuracion inicial
  const nuevoUsuario = {
    usuario: usuarioValor,
    password: passwordValor,
    vidas: CONFIG_INICIAL.vidasMaximas,
    gemas: CONFIG_INICIAL.gemasIniciales,
    racha: CONFIG_INICIAL.rachaInicial,

    xp: 0,
    xpPorDia: {},
    metaDiaria: CONFIG_INICIAL.metaDiaria,
    inscripciones: [],
    leccionesCompletadas: [],

    fechaRegistro: new Date().toLocaleDateString(),
  };

  //mete en la lista al usuario
  listaUsuarios.push(nuevoUsuario);
  //lo guarda usando el metodo guardarListaUsuarios
  guardarListaUsuarios(listaUsuarios);

  //hace que el nuevo usuario creado sea la sesion activa
  localStorage.setItem("sesion_activa", JSON.stringify(nuevoUsuario));

  //si todo sale bien manda un mensaje
  return {
    exito: true,
    mensaje: `¡Usuario "${usuarioValor}" registrado con éxito!`,
  };
};

//inicio de sesiones
const iniciarSesionUsuario = (emailValor, passwordValor) => {
  const listaUsuarios = obtenerUsuariosRegistrados();

  //busca si existe el usuario en la lista
  let usuarioEncontrado = null;
  for (const u of listaUsuarios) {
    if (u.usuario.toLowerCase() === emailValor.toLowerCase()) {
      usuarioEncontrado = u;
      break;
    }
  }

  //si no existe tira mensaje de que no esta reistrado
  if (!usuarioEncontrado) {
    return {
      exito: false,
      mensaje: "El usuario o correo no se encuentra registrado.",
    };
  }

  //valida la contrasenia
  if (usuarioEncontrado.password !== passwordValor) {
    return {
      exito: false,
      mensaje: "Contraseña incorrecta. Inténtalo nuevamente.",
    };
  }

  //si todo esta bien guarda la sesion activa en localstorage
  localStorage.setItem("sesion_activa", JSON.stringify(usuarioEncontrado));

  return {
    exito: true,
    mensaje: "¡Inicio de sesión exitoso!",
  };
};

//devuelve la fecha de hoy como texto, ej: "2026-11-01"
const fechaHoy = () => {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return `${hoy.getFullYear()}-${mes}-${dia}`;
};

//devuelve el usuario con la sesion activa, leido de la lista (asi tiene los datos mas nuevos)
//si es una cuenta vieja y le faltan campos, se los completa para que no se rompa nada
const usuarioActual = () => {
  const sesion = JSON.parse(localStorage.getItem("sesion_activa"));
  if (!sesion) return null;

  let usuario = null;
  for (const u of obtenerUsuariosRegistrados()) {
    if (u.usuario.toLowerCase() === sesion.usuario.toLowerCase()) {
      usuario = u;
      break;
    }
  }
  if (!usuario) return null;

  usuario.xp = usuario.xp ?? 0;
  usuario.xpPorDia = usuario.xpPorDia ?? {};
  usuario.metaDiaria = usuario.metaDiaria ?? CONFIG_INICIAL.metaDiaria;
  usuario.inscripciones = usuario.inscripciones ?? [];
  usuario.leccionesCompletadas = usuario.leccionesCompletadas ?? [];
  return usuario;
};

//guarda los cambios de un usuario en la lista Y en la sesion activa (siempre las dos juntas)
const guardarUsuario = (usuarioModificado) => {
  const listaUsuarios = obtenerUsuariosRegistrados();

  for (let i = 0; i < listaUsuarios.length; i++) {
    if (listaUsuarios[i].usuario.toLowerCase() === usuarioModificado.usuario.toLowerCase()) {
      listaUsuarios[i] = usuarioModificado;
      break;
    }
  }

  guardarListaUsuarios(listaUsuarios);
  localStorage.setItem("sesion_activa", JSON.stringify(usuarioModificado));
};

//inscribe al usuario activo en un curso
const inscribirse = (idCurso) => {
  const usuario = usuarioActual();

  if (!usuario || !CURSOS_DISPONIBLES[idCurso]) {
    return { exito: false, mensaje: "No se pudo completar la inscripción." };
  }

  if (usuario.inscripciones.includes(idCurso)) {
    return { exito: false, mensaje: "Ya estás inscripto en este curso." };
  }

  usuario.inscripciones.push(idCurso);
  guardarUsuario(usuario);

  return {
    exito: true,
    mensaje: `Te inscribiste en ${CURSOS_DISPONIBLES[idCurso].nombre}.`,
  };
};

//porcentaje de avance (0 a 100) = lecciones completadas del curso / lecciones totales del curso
//las lecciones completadas se guardan como "idCurso-idUnidad-idLeccion", ej: "ingles-1-2"
const obtenerProgresoCurso = (idCurso, usuario = usuarioActual()) => {
  let total = 0;
  for (const unidad of CURSOS_DISPONIBLES[idCurso].unidades) {
    total += unidad.lecciones.length;
  }

  let hechas = 0;
  for (const clave of usuario.leccionesCompletadas) {
    if (clave.startsWith(idCurso + "-")) hechas++;
  }

  return total === 0 ? 0 : Math.round((hechas / total) * 100);
};

//xp que gano el usuario hoy (para la barra de meta diaria)
const obtenerXpHoy = (usuario = usuarioActual()) => {
  return usuario.xpPorDia[fechaHoy()] ?? 0;
};

//cierra la sesion pero NO borra al usuario de la lista
const cerrarSesion = () => {
  localStorage.removeItem("sesion_activa");
};

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

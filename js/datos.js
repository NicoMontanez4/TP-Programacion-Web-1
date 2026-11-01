//aca se instancian todos los cursos disponibles

const CURSOS_DISPONIBLES = {
  ingles: {
    id: "ingles",
    descripcion: "Mejorá tu inglés desde cero o perfeccioná lo que sabés.",
    bandera: "BanderaReinoUnido.png",
    nombre: "Inglés desde Español",
    nivel: "Intermedio (B1)",
    progreso: 45,
    icono: "🇺🇸",
    unidades: [
      {
        id: 1,
        nombre: "Unidad 1: Introducción y Saludos",
        lecciones: [
          { id: 1, titulo: "Frases Básicas", estado: "Completado" },
          { id: 2, titulo: "Presentaciones", estado: "En Curso" },
          { id: 3, titulo: "Vocabulario de Familia", estado: "Bloqueado" },
        ],
      },
    ],
  },
  aleman: {
    id: "aleman",
    descripcion: "Aprendé alemán y conectá con nuevas oportunidades.",
    bandera: "BanderaAlemania.png",
    nombre: "Alemán desde Español",
    nivel: "Principiante (A1)",
    progreso: 12,
    icono: "🇩🇪",
    unidades: [
      {
        id: 1,
        nombre: "Unidad 1: Primeros Contactos",
        lecciones: [
          { id: 1, titulo: "Saludos (Guten Tag)", estado: "En Curso" },
          { id: 2, titulo: "Números y Colores", estado: "Bloqueado" },
        ],
      },
    ],
  },
  chino: {
    id: "chino",
    descripcion: "Descubrí el idioma más hablado del mundo.",
    bandera: "BanderaChina.png",
    nombre: "Chino desde Español",
    nivel: "Inicial (HSK 1)",
    progreso: 0,
    icono: "🇨🇳",
    unidades: [
      {
        id: 1,
        nombre: "Unidad 1: Tonos y Pinyin",
        lecciones: [
          { id: 1, titulo: "Hola y Gracias", estado: "En Curso" },
          { id: 2, titulo: "Pronombres Personales", estado: "Bloqueado" },
        ],
      },
    ],
  },
};

//configuracion inicial para los nuevos usuarios
const CONFIG_INICIAL = {
  vidasMaximas: 5,
  gemasIniciales: 50,
  rachaInicial: 0,
  metaDiaria: 50,
};

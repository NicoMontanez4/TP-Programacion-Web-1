/* =====================================================
   datos.js — Contenido fijo de PoliLingo
   -----------------------------------------------------
   Acá está TODO lo que la aplicación muestra y no cambia
   según el usuario: cursos, unidades, lecciones, ejercicios,
   ligas, tienda, logros, avatares y usuarios de demostración.
 
   Las páginas NO escriben este contenido a mano en el HTML:
   lo leen de acá y lo arman con JS (consigna: "Presentación
   dinámica de la información").
 
   Este archivo solo DEFINE datos. Lo que cambia con el uso
   (progreso, XP, gemas, sesión, comentarios) se guarda en
   localStorage y se maneja desde estado.js.
 
   Se carga ANTES que estado.js en todas las páginas.
   ===================================================== */
 
/* ---------- Reglas del juego ---------- */
 
const XP_POR_NIVEL = 20; // cada ejercicio (nivel) correcto suma 20 XP -> 80 XP por lección
const INTENTOS_POR_LECCION = 3; // al gastar los 3 se pierde 1 vida
const VIDAS_MAX = 5;
const VIDAS_INICIALES = 5;
const GEMAS_INICIALES = 100;
const META_DIARIA_XP = 50;
const RECOMPENSA_CURSO = { gemas: 100, xp: 200 }; // se da una sola vez por curso completado
 
const AVATAR_PREDETERMINADO = "avatar.png";
 
// Avatares que se pueden elegir en el perfil (están en imagenes/avatares/)
const AVATARES = [
    "Avatar1.png",
    "Avatar2.png",
    "Avatar3.png",
    "Avatar4.png",
    "Avatar5.png",
    "Avatar6.png",
    "Avatar7.png",
    "Avatar8.png",
    "Avatar9.png",
    "Avatar10.png",
    "Avatar11.png",
    "Avatar12.png",
];
 
const IDIOMAS_INTERFAZ = [
    { id: "es", nombre: "Español" },
    { id: "en", nombre: "English" },
];
 
/* ---------- Cursos ----------
   Estructura:
   CURSOS[idCurso] = {
       ...datos del curso,
       unidades: [
           {
               numero, titulo, descripcion, imagen,
               lecciones: [
                   {
                       numero, titulo,
                       ejercicios: [
                           { frase, respuesta: [palabras en orden], distractores: [palabras de más] }
                       ]
                   }
               ]
           }
       ]
   }
 
   - El banco de palabras de cada ejercicio = respuesta + distractores, mezclados.
   - Una unidad con lecciones: [] todavía no tiene contenido ("Próximamente").
   - Las lecciones marcadas "Ejercicios nuevos" no estaban en el TP1:
     las agregamos para que cada unidad 1 (y la 3 de inglés) esté completa.
*/

/* Esto explica como está armado cursos */
 
const CONSIGNA_TRADUCIR = "Traducí la siguiente oración:";
 
// Las 5 unidades son las mismas en los 3 cursos; cambian sus lecciones
const UNIDADES_BASE = [
    {
        numero: 1,
        titulo: "Saludos",
        descripcion: "Aprendé a presentarte, saludar y mantener conversaciones básicas.",
        imagen: "Unidad-Saludos.png",
    },
    {
        numero: 2,
        titulo: "Comidas",
        descripcion: "Hablá sobre tus comidas favoritas, restaurantes y hábitos alimenticios.",
        imagen: "Unidad-Comida.png",
    },
    {
        numero: 3,
        titulo: "Viajes",
        descripcion: "Aprendé a viajar, pedir direcciones y hablar sobre tus planes.",
        imagen: "Unidad-Viajes.png",
    },
    {
        numero: 4,
        titulo: "Conversaciones",
        descripcion: "Mantené diálogos completos sobre temas de todos los días.",
        imagen: "Unidad-Conversacion.png",
    },
    {
        numero: 5,
        titulo: "Tiempos verbales",
        descripcion: "Hablá del pasado, el presente y el futuro.",
        imagen: "Unidad-TiemposVerbales.png",
    },
];
 
// Arma la lista de unidades de un curso con las lecciones que le pasemos.
// lecciones = { 1: [...lecciones de la unidad 1], 3: [...] } ; las que no estén quedan vacías.
function armarUnidades(lecciones) {
    return UNIDADES_BASE.map(function (unidad) {
        return {
            numero: unidad.numero,
            titulo: unidad.titulo,
            descripcion: unidad.descripcion,
            imagen: unidad.imagen,
            lecciones: lecciones[unidad.numero] || [],
        };
    });
}
 
const CURSOS = {
    ingles: {
        id: "ingles",
        nombre: "Inglés",
        desde: "Español",
        nivel: "Intermedio (B1)",
        descripcion: "El idioma más hablado del mundo para viajar, estudiar y trabajar.",
        bandera: "BanderaReinoUnido.png",
        imagenTarjeta: "Curso-Ingles.png", // la de Mis cursos y el catálogo
        imagenMapa: "CursoIngles.png", // la de Poli en el mapa del curso
        unidades: armarUnidades({
            1: [
                {
                    numero: 1,
                    titulo: "Frases Básicas",
                    ejercicios: [
                        { frase: "Good morning", respuesta: ["Buenos", "días"], distractores: ["noches", "Hola"] },
                        { frase: "Good afternoon", respuesta: ["Buenas", "tardes"], distractores: ["días", "Chau"] },
                        { frase: "Good night", respuesta: ["Buenas", "noches"], distractores: ["tardes", "mañana"] },
                        { frase: "Goodbye, take care.", respuesta: ["Adiós,", "que", "estés", "bien"], distractores: ["Hola,", "mal"] },
                    ],
                },
                {
                    numero: 2,
                    titulo: "Presentaciones",
                    ejercicios: [
                        { frase: "Nice to meet you", respuesta: ["Encantado", "de", "conocerte"], distractores: ["verte", "Gracias"] },
                        { frase: "This is my friend Micaela", respuesta: ["Esta", "es", "mi", "amiga", "Micaela"], distractores: ["tu", "hermana"] },
                        { frase: "Hello, my name is Carlos", respuesta: ["Hola,", "mi", "nombre", "es", "Carlos"], distractores: ["tu", "María"] },
                        { frase: "I am from Argentina", respuesta: ["Soy", "de", "Argentina"], distractores: ["Estoy", "en"] },
                    ],
                },
                {
                    numero: 3,
                    titulo: "Vocabulario Familiar",
                    ejercicios: [
                        { frase: "She is my mother", respuesta: ["Ella", "es", "mi", "madre"], distractores: ["Él", "padre"] },
                        { frase: "My aunt's son is my cousin.", respuesta: ["El", "hijo", "de", "mi", "tía", "es", "mi", "primo"], distractores: ["hija", "tío"] },
                        { frase: "My grandfather is very kind.", respuesta: ["Mi", "abuelo", "es", "muy", "amable"], distractores: ["abuela", "poco"] },
                        { frase: "My brother is older than me.", respuesta: ["Mi", "hermano", "es", "más", "grande", "que", "yo"], distractores: ["menor", "vos"] },
                    ],
                },
                {
                    numero: 4,
                    titulo: "Preguntando",
                    ejercicios: [
                        { frase: "Where are you from?", respuesta: ["¿De", "dónde", "sos?"], distractores: ["¿Cómo", "vivís?"] },
                        { frase: "How old are you?", respuesta: ["¿Cuántos", "años", "tenés?"], distractores: ["días", "sos?"] },
                        { frase: "What is your name?", respuesta: ["¿Cómo", "es", "tu", "nombre?"], distractores: ["mi", "¿Dónde"] },
                        { frase: "How are you?", respuesta: ["¿Cómo", "estás?"], distractores: ["¿Dónde", "sos?"] },
                    ],
                },
            ],
            2: [
                {
                    numero: 1,
                    titulo: "Alimentos",
                    ejercicios: [
                        { frase: "This is an apple", respuesta: ["Esta", "es", "una", "manzana"], distractores: ["naranja", "un"] },
                        { frase: "This meat is raw.", respuesta: ["Esta", "carne", "está", "cruda"], distractores: ["cocida", "es"] },
                        { frase: "The soup is hot.", respuesta: ["La", "sopa", "está", "caliente"], distractores: ["fría", "El"] },
                        { frase: "These strawberries are delicious.", respuesta: ["Estas", "frutillas", "son", "deliciosas"], distractores: ["manzanas", "feas"] },
                    ],
                },
                {
                    numero: 2,
                    titulo: "Bebidas",
                    ejercicios: [
                        { frase: "A cup of tea", respuesta: ["Una", "taza", "de", "té"], distractores: ["café", "vaso"] },
                        { frase: "The wine is delicious.", respuesta: ["El", "vino", "es", "delicioso"], distractores: ["agua", "feo"] },
                        { frase: "Orange juice is sweet.", respuesta: ["El", "jugo", "de", "naranja", "es", "dulce"], distractores: ["manzana", "amargo"] },
                        { frase: "A coffee in the morning", respuesta: ["Un", "café", "por", "la", "mañana"], distractores: ["noche", "té"] },
                    ],
                },
                {
                    numero: 3,
                    titulo: "Gustos",
                    ejercicios: [
                        { frase: "I like pizza.", respuesta: ["Me", "gusta", "la", "pizza"], distractores: ["odio", "el"] },
                        { frase: "I love ice cream", respuesta: ["Me", "encanta", "el", "helado"], distractores: ["la", "torta"] },
                        { frase: "I don't like fish.", respuesta: ["No", "me", "gusta", "el", "pescado"], distractores: ["pollo", "Sí"] },
                        { frase: "My favourite food is asado", respuesta: ["Mi", "comida", "favorita", "es", "el", "asado"], distractores: ["bebida", "tu"] },
                    ],
                },
                {
                    numero: 4,
                    titulo: "Pedir comida",
                    ejercicios: [
                        { frase: "Can I see the menu?", respuesta: ["¿Puedo", "ver", "el", "menú?"], distractores: ["comer", "la"] },
                        { frase: "I would like a pizza, please.", respuesta: ["Quisiera", "una", "pizza", "por", "favor"], distractores: ["un", "gracias"] },
                        { frase: "A coffee, please.", respuesta: ["Un", "café", "por", "favor"], distractores: ["té", "Una"] },
                        { frase: "No onions, please.", respuesta: ["Sin", "cebolla", "por", "favor"], distractores: ["Con", "tomate"] },
                    ],
                },
            ],
            3: [
                {
                    numero: 1,
                    titulo: "Transporte",
                    ejercicios: [
                        { frase: "The train is red", respuesta: ["El", "tren", "es", "rojo"], distractores: ["auto", "mi", "ella", "azul", "bicicleta"] },
                        { frase: "I'm going to take the bus.", respuesta: ["Me", "voy", "a", "tomar", "el", "colectivo"], distractores: ["tren", "ir", "avión"] },
                        { frase: "I like riding a motorcycle.", respuesta: ["Me", "gusta", "andar", "en", "moto"], distractores: ["odio", "cuatriciclo", "lavar", "no"] },
                        { frase: "The boat is huge", respuesta: ["El", "barco", "es", "gigante"], distractores: ["auto", "mi", "ella", "pequeño", "bicicleta"] },
                    ],
                },
                {
                    numero: 2,
                    titulo: "Direcciones",
                    // Ejercicios nuevos (no estaban en el TP1): revisar
                    ejercicios: [
                        { frase: "Turn left at the corner.", respuesta: ["Doblá", "a", "la", "izquierda", "en", "la", "esquina"], distractores: ["derecha", "calle"] },
                        { frase: "Where is the station?", respuesta: ["¿Dónde", "está", "la", "estación?"], distractores: ["¿Cómo", "el"] },
                        { frase: "Go straight ahead.", respuesta: ["Seguí", "derecho"], distractores: ["Doblá", "atrás"] },
                        { frase: "The bank is next to the school.", respuesta: ["El", "banco", "está", "al", "lado", "de", "la", "escuela"], distractores: ["lejos", "plaza"] },
                    ],
                },
                {
                    numero: 3,
                    titulo: "Viajando",
                    // Ejercicios nuevos (no estaban en el TP1): revisar
                    ejercicios: [
                        { frase: "I have a reservation.", respuesta: ["Tengo", "una", "reserva"], distractores: ["un", "pasaje"] },
                        { frase: "Where is my hotel?", respuesta: ["¿Dónde", "está", "mi", "hotel?"], distractores: ["tu", "casa"] },
                        { frase: "I want to visit the museum.", respuesta: ["Quiero", "visitar", "el", "museo"], distractores: ["la", "playa"] },
                        { frase: "How much is the ticket?", respuesta: ["¿Cuánto", "cuesta", "el", "boleto?"], distractores: ["¿Cuántos", "la"] },
                    ],
                },
                {
                    numero: 4,
                    titulo: "Aeropuerto",
                    // Ejercicios nuevos (no estaban en el TP1): revisar
                    ejercicios: [
                        { frase: "Here is my passport.", respuesta: ["Acá", "está", "mi", "pasaporte"], distractores: ["tu", "valija"] },
                        { frase: "The flight is delayed.", respuesta: ["El", "vuelo", "está", "demorado"], distractores: ["temprano", "avión"] },
                        { frase: "Where is gate five?", respuesta: ["¿Dónde", "está", "la", "puerta", "cinco?"], distractores: ["tres", "el"] },
                        { frase: "I have one suitcase.", respuesta: ["Tengo", "una", "valija"], distractores: ["dos", "mochila"] },
                    ],
                },
            ],
        }),
    },
 
    aleman: {
        id: "aleman",
        nombre: "Alemán",
        desde: "Español",
        nivel: "Principiante (A1)",
        descripcion: "Clave para estudiar y trabajar en Europa. ¡Empezá por lo básico!",
        bandera: "BanderaAlemania.png",
        imagenTarjeta: "Curso-Aleman.png",
        imagenMapa: "CursoAleman.png",
        unidades: armarUnidades({
            1: [
                {
                    numero: 1,
                    titulo: "Frases Básicas",
                    ejercicios: [
                        { frase: "Guten Morgen", respuesta: ["Buenos", "días"], distractores: ["noches", "Hola"] },
                        { frase: "Guten Tag.", respuesta: ["Buenas", "tardes"], distractores: ["noches", "Chau"] },
                        { frase: "Gute Nacht.", respuesta: ["Buenas", "noches"], distractores: ["tardes", "días"] },
                        { frase: "Hallo und auf Wiedersehen.", respuesta: ["Hola", "y", "adiós"], distractores: ["gracias", "o"] },
                    ],
                },
                {
                    numero: 2,
                    titulo: "Presentaciones",
                    ejercicios: [
                        { frase: "Hallo, ich heiße Carlos.", respuesta: ["Hola", "me", "llamo", "Carlos"], distractores: ["te", "María"] },
                        { frase: "Freut mich, dich kennenzulernen.", respuesta: ["Mucho", "gusto", "en", "conocerte"], distractores: ["verte", "poco"] },
                        { frase: "Er ist mein Freund Tomas", respuesta: ["Él", "es", "mi", "amigo", "Tomás"], distractores: ["Ella", "tu"] },
                        { frase: "Ich komme aus Argentinien.", respuesta: ["Soy", "de", "Argentina"], distractores: ["Estoy", "en"] },
                    ],
                },
                {
                    numero: 3,
                    titulo: "Vocabulario Familiar",
                    ejercicios: [
                        { frase: "Er ist mein Großvater", respuesta: ["Él", "es", "mi", "abuelo"], distractores: ["su", "ella", "abuela"] },
                        { frase: "Meine Mutter ist die Beste.", respuesta: ["Mi", "madre", "es", "la", "mejor"], distractores: ["Su", "padre"] },
                        { frase: "Mein Cousin ist groß.", respuesta: ["Mi", "primo", "es", "alto"], distractores: ["prima", "su"] },
                        { frase: "Mein Sohn ist klein.", respuesta: ["Mi", "hijo", "es", "pequeño"], distractores: ["Su", "pequeña"] },
                    ],
                },
                {
                    numero: 4,
                    titulo: "Preguntando",
                    // Ejercicios nuevos (no estaban en el TP1): revisar
                    ejercicios: [
                        { frase: "Woher kommst du?", respuesta: ["¿De", "dónde", "sos?"], distractores: ["¿Cómo", "vivís?"] },
                        { frase: "Wie alt bist du?", respuesta: ["¿Cuántos", "años", "tenés?"], distractores: ["días", "sos?"] },
                        { frase: "Wie heißt du?", respuesta: ["¿Cómo", "te", "llamás?"], distractores: ["me", "¿Dónde"] },
                        { frase: "Wie geht es dir?", respuesta: ["¿Cómo", "estás?"], distractores: ["¿Dónde", "sos?"] },
                    ],
                },
            ],
        }),
    },
 
    chino: {
        id: "chino",
        nombre: "Chino Mandarín",
        desde: "Español",
        nivel: "Inicial (HSK 1)",
        descripcion: "El idioma con más hablantes nativos. Arrancá con saludos y presentaciones.",
        bandera: "BanderaChina.png",
        imagenTarjeta: "Curso-Chino.png",
        imagenMapa: "CursoChino.png",
        unidades: armarUnidades({
            1: [
                {
                    numero: 1,
                    titulo: "Frases Básicas",
                    ejercicios: [
                        { frase: "早上好，你好吗？", respuesta: ["Buenos", "días", "¿Cómo", "estás?"], distractores: ["Gracias", "Buenas", "noches"] },
                        { frase: "你好，我叫Carlos。", respuesta: ["Hola,", "mi", "nombre", "es", "Carlos"], distractores: ["tu", "María"] },
                        { frase: "我很好，你呢？", respuesta: ["Estoy", "bien,", "¿y", "vos?"], distractores: ["mal,", "él?"] },
                        { frase: "你叫什么名字？", respuesta: ["¿Cuál", "es", "tu", "nombre?"], distractores: ["mi", "¿Qué"] },
                    ],
                },
                {
                    numero: 2,
                    titulo: "Presentaciones",
                    // Ejercicios nuevos (no estaban en el TP1): revisar
                    ejercicios: [
                        { frase: "很高兴认识你。", respuesta: ["Encantado", "de", "conocerte"], distractores: ["verte", "Gracias"] },
                        { frase: "我是阿根廷人。", respuesta: ["Soy", "argentino"], distractores: ["Estoy", "chino"] },
                        { frase: "这是我的朋友。", respuesta: ["Este", "es", "mi", "amigo"], distractores: ["tu", "hermano"] },
                        { frase: "我是学生。", respuesta: ["Soy", "estudiante"], distractores: ["profesor", "Es"] },
                    ],
                },
                {
                    numero: 3,
                    titulo: "Vocabulario Familiar",
                    // Ejercicios nuevos (no estaban en el TP1): revisar
                    ejercicios: [
                        { frase: "这是我妈妈。", respuesta: ["Ella", "es", "mi", "mamá"], distractores: ["papá", "tu"] },
                        { frase: "我爸爸很高。", respuesta: ["Mi", "papá", "es", "alto"], distractores: ["bajo", "mamá"] },
                        { frase: "我有一个哥哥。", respuesta: ["Tengo", "un", "hermano", "mayor"], distractores: ["menor", "una"] },
                        { frase: "我爱我的家人。", respuesta: ["Amo", "a", "mi", "familia"], distractores: ["tu", "casa"] },
                    ],
                },
                {
                    numero: 4,
                    titulo: "Preguntando",
                    // Ejercicios nuevos (no estaban en el TP1): revisar
                    ejercicios: [
                        { frase: "你从哪里来？", respuesta: ["¿De", "dónde", "sos?"], distractores: ["¿Cómo", "vivís?"] },
                        { frase: "你多大了？", respuesta: ["¿Cuántos", "años", "tenés?"], distractores: ["días", "sos?"] },
                        { frase: "你好吗？", respuesta: ["¿Cómo", "estás?"], distractores: ["¿Dónde", "sos?"] },
                        { frase: "你住在哪里？", respuesta: ["¿Dónde", "vivís?"], distractores: ["¿Cómo", "sos?"] },
                    ],
                },
            ],
        }),
    },

    
    frances: {
        id: "frances",
        nombre: "Francés",
        desde: "Español",
        nivel: "Principiante (A1)",
        descripcion: "Aprendé francés para viajar, estudiar y conocer nuevas culturas.",
        bandera: "BanderaFrances.png",
        imagenTarjeta: "Curso-Frances.png",
        imagenMapa: "CursoFrances.png",

        unidades: armarUnidades({
            1: [
                {
                    numero: 1,
                    titulo: "Saludos",
                    ejercicios: [
                        {
                            frase: "Bonjour",
                            respuesta: ["Buenos", "días"],
                            distractores: ["noches", "chau"]
                        },
                        {
                            frase: "Bonsoir",
                            respuesta: ["Buenas", "noches"],
                            distractores: ["días", "tardes"]
                        },
                        {
                            frase: "Merci",
                            respuesta: ["Gracias"],
                            distractores: ["Hola", "Adiós"]
                        },
                        {
                            frase: "Au revoir",
                            respuesta: ["Hasta", "luego"],
                            distractores: ["Gracias", "Buenos", "días"]
                        }
                    ]
                }
            ]
        })
    },

    
    italiano: {
        id: "italiano",
        nombre: "Italiano",
        desde: "Español",
        nivel: "Principiante (A1)",
        descripcion: "Aprendé italiano para viajar, conocer su cultura y comunicarte con confianza.",
        bandera: "BanderaItaliano.png",
        imagenTarjeta: "Curso-Italiano.png",
        imagenMapa: "CursoItaliano.png",
        unidades: armarUnidades({
            1: [
                {
                    numero: 1,
                    titulo: "Frases Básicas",
                    ejercicios: [
                        { frase: "Buongiorno", respuesta: ["Buenos", "días"], distractores: ["noches", "Gracias"] },
                        { frase: "Buonasera", respuesta: ["Buenas", "tardes"], distractores: ["días", "Chau"] },
                        { frase: "Buonanotte", respuesta: ["Buenas", "noches"], distractores: ["tardes", "Hola"] },
                        { frase: "Ciao, come stai?", respuesta: ["Hola,", "¿cómo", "estás?"], distractores: ["bien", "Gracias"] },
                    ],
                },
                {
                    numero: 2,
                    titulo: "Presentaciones",
                    ejercicios: [
                        { frase: "Mi chiamo Marco.", respuesta: ["Me", "llamo", "Marco"], distractores: ["Carlos", "Ella"] },
                        { frase: "Piacere di conoscerti.", respuesta: ["Mucho", "gusto", "en", "conocerte"], distractores: ["verte", "Gracias"] },
                        { frase: "Sono argentino.", respuesta: ["Soy", "argentino"], distractores: ["italiano", "Estoy"] },
                        { frase: "Lei è mia sorella.", respuesta: ["Ella", "es", "mi", "hermana"], distractores: ["madre", "Él"] },
                    ],
                },
                {
                    numero: 3,
                    titulo: "Vocabulario Familiar",
                    ejercicios: [
                        { frase: "Questa è mia madre.", respuesta: ["Esta", "es", "mi", "madre"], distractores: ["padre", "hermana"] },
                        { frase: "Mio padre è alto.", respuesta: ["Mi", "padre", "es", "alto"], distractores: ["bajo", "madre"] },
                        { frase: "Ho un fratello.", respuesta: ["Tengo", "un", "hermano"], distractores: ["primo", "una"] },
                        { frase: "Amo la mia famiglia.", respuesta: ["Amo", "a", "mi", "familia"], distractores: ["amigo", "casa"] },
                    ],
                },
                {
                    numero: 4,
                    titulo: "Preguntando",
                    ejercicios: [
                        { frase: "Di dove sei?", respuesta: ["¿De", "dónde", "sos?"], distractores: ["¿Cómo", "estás?"] },
                        { frase: "Quanti anni hai?", respuesta: ["¿Cuántos", "años", "tenés?"], distractores: ["días", "meses"] },
                        { frase: "Come ti chiami?", respuesta: ["¿Cómo", "te", "llamás?"], distractores: ["vivís", "dónde"] },
                        { frase: "Dove abiti?", respuesta: ["¿Dónde", "vivís?"], distractores: ["¿Cuándo", "sos?"] },
                    ],
                },
            ],
        }),
    },

    
    japones: {
        id: "japones",
        nombre: "Japonés",
        desde: "Español",
        nivel: "Principiante (N5)",
        descripcion: "Descubrí el idioma japonés y aprendé a comunicarte desde cero.",
        bandera: "BanderaJapones.png",
        imagenTarjeta: "Curso-Japones.png",
        imagenMapa: "CursoJapones.png",
        unidades: armarUnidades({
            1: [
                {
                    numero: 1,
                    titulo: "Frases Básicas",
                    ejercicios: [
                        { frase: "おはようございます", respuesta: ["Buenos", "días"], distractores: ["noches", "Gracias"] },
                        { frase: "こんにちは", respuesta: ["Hola", "buenas", "tardes"], distractores: ["Gracias", "Adiós"] },
                        { frase: "こんばんは", respuesta: ["Buenas", "noches"], distractores: ["días", "Hola"] },
                        { frase: "ありがとう", respuesta: ["Gracias"], distractores: ["Hola", "Adiós"] },
                    ],
                },
                {
                    numero: 2,
                    titulo: "Presentaciones",
                    ejercicios: [
                        { frase: "私の名前は田中です", respuesta: ["Mi", "nombre", "es", "Tanaka"], distractores: ["Carlos", "apellido"] },
                        { frase: "はじめまして", respuesta: ["Mucho", "gusto"], distractores: ["Gracias", "Adiós"] },
                        { frase: "私はアルゼンチン人です", respuesta: ["Soy", "argentino"], distractores: ["japonés", "brasileño"] },
                        { frase: "私は学生です", respuesta: ["Soy", "estudiante"], distractores: ["profesor", "amigo"] },
                    ],
                },
                {
                    numero: 3,
                    titulo: "Vocabulario Familiar",
                    ejercicios: [
                        { frase: "これは私の母です", respuesta: ["Esta", "es", "mi", "madre"], distractores: ["padre", "hermana"] },
                        { frase: "私の父です", respuesta: ["Es", "mi", "padre"], distractores: ["madre", "hermano"] },
                        { frase: "兄がいます", respuesta: ["Tengo", "un", "hermano", "mayor"], distractores: ["menor", "hermana"] },
                        { frase: "家族が大好きです", respuesta: ["Amo", "a", "mi", "familia"], distractores: ["amigo", "casa"] },
                    ],
                },
                {
                    numero: 4,
                    titulo: "Preguntando",
                    ejercicios: [
                        { frase: "どこから来ましたか？", respuesta: ["¿De", "dónde", "venís?"], distractores: ["¿Cómo", "estás?"] },
                        { frase: "何歳ですか？", respuesta: ["¿Cuántos", "años", "tenés?"], distractores: ["días", "meses"] },
                        { frase: "お名前は何ですか？", respuesta: ["¿Cuál", "es", "tu", "nombre?"], distractores: ["apellido", "edad"] },
                        { frase: "どこに住んでいますか？", respuesta: ["¿Dónde", "vivís?"], distractores: ["¿Cuándo", "viajás?"] },
                    ],
                },
            ],
        }),
    },

    
    portugues: {
        id: "portugues",
        nombre: "Portugués",
        desde: "Español",
        nivel: "Principiante (A1)",
        descripcion: "Aprendé portugués para viajar, trabajar y comunicarte con personas de Brasil.",
        bandera: "BanderaPortugues.png",
        imagenTarjeta: "Curso-Portugues.png",
        imagenMapa: "CursoPortugues.png",
        unidades: armarUnidades({
            1: [
                {
                    numero: 1,
                    titulo: "Frases Básicas",
                    ejercicios: [
                        { frase: "Bom dia!", respuesta: ["¡Buenos", "días!"], distractores: ["noches", "Hola"] },
                        { frase: "Boa tarde!", respuesta: ["¡Buenas", "tardes!"], distractores: ["noches", "Gracias"] },
                        { frase: "Boa noite!", respuesta: ["¡Buenas", "noches!"], distractores: ["días", "Chau"] },
                        { frase: "Tudo bem?", respuesta: ["¿Todo", "bien?"], distractores: ["mal", "Gracias"] },
                    ],
                },
                {
                    numero: 2,
                    titulo: "Presentaciones",
                    ejercicios: [
                        { frase: "Meu nome é Pedro.", respuesta: ["Mi", "nombre", "es", "Pedro"], distractores: ["Carlos", "apellido"] },
                        { frase: "Muito prazer em conhecer você.", respuesta: ["Mucho", "gusto", "en", "conocerte"], distractores: ["verte", "Gracias"] },
                        { frase: "Eu sou argentino.", respuesta: ["Yo", "soy", "argentino"], distractores: ["brasileño", "Estoy"] },
                        { frase: "Ela é minha amiga.", respuesta: ["Ella", "es", "mi", "amiga"], distractores: ["hermana", "Él"] },
                    ],
                },
                {
                    numero: 3,
                    titulo: "Vocabulario Familiar",
                    ejercicios: [
                        { frase: "Esta é minha mãe.", respuesta: ["Esta", "es", "mi", "madre"], distractores: ["padre", "hermana"] },
                        { frase: "Meu pai é alto.", respuesta: ["Mi", "padre", "es", "alto"], distractores: ["bajo", "madre"] },
                        { frase: "Eu tenho um irmão.", respuesta: ["Yo", "tengo", "un", "hermano"], distractores: ["primo", "una"] },
                        { frase: "Eu amo minha família.", respuesta: ["Yo", "amo", "a", "mi", "familia"], distractores: ["amigo", "casa"] },
                    ],
                },
                {
                    numero: 4,
                    titulo: "Preguntando",
                    ejercicios: [
                        { frase: "De onde você é?", respuesta: ["¿De", "dónde", "sos?"], distractores: ["¿Cómo", "estás?"] },
                        { frase: "Quantos anos você tem?", respuesta: ["¿Cuántos", "años", "tenés?"], distractores: ["días", "meses"] },
                        { frase: "Qual é o seu nome?", respuesta: ["¿Cuál", "es", "tu", "nombre?"], distractores: ["apellido", "dónde"] },
                        { frase: "Onde você mora?", respuesta: ["¿Dónde", "vivís?"], distractores: ["¿Cuándo", "sos?"] },
                    ],
                },
            ],
        }),
    },




};
 
// Orden en el que se muestran los cursos (catálogo, mis cursos)
const ORDEN_CURSOS = ["ingles", "aleman", "chino", "frances", "italiano" , "japones" , "portugues"];
 
/* ---------- Ligas y ranking ---------- */
 
const LIGAS = [
    {
        id: "bronce",
        nombre: "Liga de Bronce",
        texto: "Los 3 primeros ascienden a la Liga de Plata esta semana.",
        ascienden: 3,
        descienden: 0,
        siguiente: "plata",
    },
    {
        id: "plata",
        nombre: "Liga de Plata",
        texto: "Los 3 primeros ascienden a la Liga de Oro esta semana.",
        ascienden: 3,
        descienden: 1,
        siguiente: "oro",
    },
    {
        id: "oro",
        nombre: "Liga de Oro",
        texto: "Los 3 primeros reciben 350 PoliGemas.",
        ascienden: 0,
        descienden: 1,
        siguiente: null,
    },
];
 
// Participantes de demostración: completan la tabla de cada liga.
// No son cuentas para iniciar sesión. Los usuarios registrados se suman
// a la tabla de su liga desde estado.js (obtenerRanking).
const PARTICIPANTES_DEMO = [
    { usuario: "JuanLopez62", avatar: "Avatar3.png", liga: "bronce", xpSemanal: 610 },
    { usuario: "Lara43", avatar: "Avatar4.png", liga: "bronce", xpSemanal: 360 },
    { usuario: "Santi123", avatar: "Avatar5.png", liga: "bronce", xpSemanal: 290 },
    { usuario: "AgusTI", avatar: "Avatar6.png", liga: "bronce", xpSemanal: 200 },
    { usuario: "Kans", avatar: "Avatar19.png", liga: "bronce", xpSemanal: 180 },
    { usuario: "Miri", avatar: "Avatar20.png", liga: "bronce", xpSemanal: 150 },
    { usuario: "Jaimito77", avatar: "Avatar21.png", liga: "bronce", xpSemanal: 130 },
    { usuario: "Pochio", avatar: "Avatar22.png", liga: "bronce", xpSemanal: 120 },
 
    { usuario: "Fer21", avatar: "Avatar7.png", liga: "plata", xpSemanal: 1270 },
    { usuario: "Saber2000", avatar: "Avatar8.png", liga: "plata", xpSemanal: 1200 },
    { usuario: "Zafina34", avatar: "Avatar9.png", liga: "plata", xpSemanal: 1060 },
    { usuario: "Miki", avatar: "Avatar10.png", liga: "plata", xpSemanal: 1020 },
    { usuario: "GiGi98", avatar: "Avatar11.png", liga: "plata", xpSemanal: 950 },
    { usuario: "Tato4", avatar: "Avatar26.png", liga: "plata", xpSemanal: 940 },
    { usuario: "Part67", avatar: "Avatar25.png", liga: "plata", xpSemanal: 920 },
    { usuario: "Rikit", avatar: "Avatar24.png", liga: "plata", xpSemanal: 900 },
    { usuario: "Marioh", avatar: "Avatar23.png", liga: "plata", xpSemanal: 880 },
    { usuario: "Mari123", avatar: "Avatar12.png", liga: "plata", xpSemanal: 870 },
 
    { usuario: "Faku", avatar: "Avatar13.png", liga: "oro", xpSemanal: 1530 },
    { usuario: "Joaco", avatar: "Avatar14.png", liga: "oro", xpSemanal: 1520 },
    { usuario: "Nico", avatar: "Avatar15.png", liga: "oro", xpSemanal: 1500 },
    { usuario: "Jaem77", avatar: "Avatar16.png", liga: "oro", xpSemanal: 1360 },
    { usuario: "Flori", avatar: "Avatar17.png", liga: "oro", xpSemanal: 1330 },
    { usuario: "Taichi", avatar: "Avatar30.png", liga: "oro", xpSemanal: 1320 },
    { usuario: "Juani7", avatar: "Avatar29.png", liga: "oro", xpSemanal: 1310 },
    { usuario: "Itachi123", avatar: "Avatar28.png", liga: "oro", xpSemanal: 1300 },
    { usuario: "Qoqo12", avatar: "Avatar27.png", liga: "oro", xpSemanal: 1290 },
    { usuario: "Juanchi", avatar: "Avatar18.png", liga: "oro", xpSemanal: 1280 },
];
 
/* ---------- Tienda ----------
   tipo:
   - "gemas": se paga con PoliGemas (precio en gemas)
   - "dinero": pago simulado en USD (va a metodo-de-pago.html)
   - "info": no se compra, abre una página informativa
*/
const PRODUCTOS = [
    {
        id: "protector-racha",
        nombre: "Protector de racha",
        descripcion: "Te permite mantener tu racha cuando no usás la app por un día.",
        categoria: "potenciadores",
        imagen: "ProtectorDeRacha.png",
        tipo: "gemas",
        precio: 250,
        maximo: 2, // se pueden tener hasta 2 equipados
    },
    {
        id: "recarga-vidas",
        nombre: "Recuperá tus vidas",
        descripcion: "Recargá tu set de vidas y aumentá las posibilidades de terminar una lección.",
        categoria: "vidas",
        imagen: "vidas.png",
        tipo: "gemas",
        precio: 350,
    },
    {
        id: "paquete-refuerzo",
        nombre: "Paquete de refuerzo",
        descripcion: "300 gemas + 50 gemas de regalo + 3 protectores de racha.",
        categoria: "paquetes",
        imagen: "Cofre1.png",
        tipo: "dinero",
        precio: 3.0,
        gemas: 350,
        protectores: 3,
    },
    {
        id: "paquete-gemas",
        nombre: "Paquete de GEMAS",
        descripcion: "1500 gemas + 200 de regalo.",
        categoria: "paquetes",
        imagen: "Cofre2.png",
        tipo: "dinero",
        precio: 9.99,
        gemas: 1700,
        protectores: 0,
    },
    {
        id: "superpoli",
        nombre: "SuperPoli",
        descripcion: "Suscribite a SuperPoli y disfrutá de los beneficios.",
        categoria: "suscripcion",
        imagen: "SuperPoli.png",
        tipo: "info",
    },
];
 
const CATEGORIAS_TIENDA = [
    { id: "todas", nombre: "Todo" },
    { id: "vidas", nombre: "Vidas" },
    { id: "potenciadores", nombre: "Potenciadores" },
    { id: "paquetes", nombre: "Paquetes" },
    { id: "suscripcion", nombre: "Suscripción" },
];
 
/* ---------- Logros ----------
   Cada logro tiene:
   - meta: el número a alcanzar
   - valor(usuario): devuelve cuánto lleva el usuario (para la barra "3/5")
   Un logro está desbloqueado cuando valor(usuario) >= meta.
   imagen: null -> se muestra el ícono de "?" mientras esté bloqueado.
*/
const LOGROS = [
    {
        id: "en-llamas",
        nombre: "En llamas",
        descripcion: "Alcanzá una racha de 5 días",
        imagen: "Logro-1.png",
        meta: 5,
        valor: function (u) { return u.mejorRacha; },
    },
    {
        id: "hechicero",
        nombre: "Hechicero",
        descripcion: "Ganá 120 XP",
        imagen: "Logro-2.png",
        meta: 120,
        valor: function (u) { return u.xpTotal; },
    },
    {
        id: "insuperable",
        nombre: "Insuperable",
        descripcion: "Completá 10 lecciones",
        imagen: "Logro-3.png",
        meta: 10,
        valor: function (u) { return contarLeccionesCompletadas(u); },
    },
    {
        id: "corazon-roto",
        nombre: "Corazón roto",
        descripcion: "Perdé una vida",
        imagen: "Logro-4.png",
        meta: 1,
        valor: function (u) { return u.vidasPerdidas; },
    },
    {
        id: "coleccionista",
        nombre: "Coleccionista de Gemas",
        descripcion: "Conseguí 200 PoliGemas",
        imagen: "Logro-5.png",
        meta: 200,
        valor: function (u) { return u.gemas; },
    },
    {
        id: "es-un-trato",
        nombre: "Es un trato",
        descripcion: "Hacé 1 compra en la tienda",
        imagen: "Logro-6.png",
        meta: 1,
        valor: function (u) { return u.compras; },
    },
    {
        id: "fotogenico",
        nombre: "Fotogénico",
        descripcion: "Cambiá tu foto de perfil",
        imagen: "Logro-7.png",
        meta: 1,
        valor: function (u) {return u.avatarCambiado ? 1 : 0;
},
    },
    {
        id: "maestro-ingles",
        nombre: "Maestro del inglés",
        descripcion: "Completá 20 lecciones de inglés",
        imagen: null,
        meta: 20,
        valor: function (u) { return contarLeccionesCompletadas(u, "ingles"); },
    },
    {
        id: "maestro-aleman",
        nombre: "Maestro del alemán",
        descripcion: "Completá 20 lecciones de alemán",
        imagen: null,
        meta: 20,
        valor: function (u) { return contarLeccionesCompletadas(u, "aleman"); },
    },
    {
        id: "maestro-chino",
        nombre: "Maestro del chino",
        descripcion: "Completá 20 lecciones de chino",
        imagen: null,
        meta: 20,
        valor: function (u) { return contarLeccionesCompletadas(u, "chino"); },
    },
    {
        id: "millonario",
        nombre: "Millonario",
        descripcion: "Conseguí 600 PoliGemas",
        imagen: null,
        meta: 600,
        valor: function (u) { return u.gemas; },
    },
    {
        id: "comprador",
        nombre: "Comprador",
        descripcion: "Hacé 2 compras en la tienda",
        imagen: null,
        meta: 2,
        valor: function (u) { return u.compras; },
    },
    {
        id: "cliente-vip",
        nombre: "Cliente VIP",
        descripcion: "Hacé 5 compras en la tienda",
        imagen: null,
        meta: 5,
        valor: function (u) { return u.compras; },
    },
    {
        id: "sin-corazones",
        nombre: "Sin corazones",
        descripcion: "Quedate sin vidas",
        imagen: null,
        meta: 1,
        valor: function (u) { return u.vecesSinVidas; },
    },
    { id: "racha-10", nombre: "Constante", descripcion: "Llegá a una racha de 10 días", imagen: null, meta: 10, valor: function (u) { return u.mejorRacha; } },
    { id: "racha-15", nombre: "Imparable", descripcion: "Llegá a una racha de 15 días", imagen: null, meta: 15, valor: function (u) { return u.mejorRacha; } },
    { id: "racha-20", nombre: "Disciplinado", descripcion: "Llegá a una racha de 20 días", imagen: null, meta: 20, valor: function (u) { return u.mejorRacha; } },
    { id: "racha-25", nombre: "Leyenda", descripcion: "Llegá a una racha de 25 días", imagen: null, meta: 25, valor: function (u) { return u.mejorRacha; } },
    { id: "racha-30", nombre: "Un mes entero", descripcion: "Llegá a una racha de 30 días", imagen: null, meta: 30, valor: function (u) { return u.mejorRacha; } },
];
 
// Cuenta lecciones completadas (de un curso o de todos). La usan los logros.
function contarLeccionesCompletadas(usuario, idCurso) {
    let total = 0;
    for (const curso in usuario.progreso) {
        if (idCurso && curso !== idCurso) continue;
        total += Object.keys(usuario.progreso[curso]).length;
    }
    return total;
}
 
/* ---------- Comentarios de demostración ----------
   Se cargan la primera vez para que el mapa del curso no arranque vacío.
*/
const COMENTARIOS_DEMO = [
    { curso: "ingles", usuario: "JuanLopez62", estrellas: 5, texto: "Las lecciones son cortas y se entienden muy bien. ¡Ideal para practicar todos los días!", fecha: "2026-10-12" },
    { curso: "ingles", usuario: "Lara43", estrellas: 4, texto: "Me gusta mucho, aunque me gustaría que haya más unidades de conversación.", fecha: "2026-10-20" },
    { curso: "aleman", usuario: "Santi123", estrellas: 4, texto: "Arranqué de cero y ya puedo presentarme en alemán.", fecha: "2026-10-18" },
];
 
/* ---------- Usuarios de demostración ----------
   Son cuentas reales para iniciar sesión (contraseña de demo, no real).
   estado.js las copia a localStorage la primera vez que se abre la página.
 
   progreso: { idCurso: { "unidad-leccion": { xp, fecha } } }
   Las fechas de actividad se calculan al cargarlas (ver estado.js),
   así la racha de la demo siempre está vigente.
*/
const USUARIOS_DEMO = [
    {
        usuario: "carlosperez123",
        nombre: "Carlos",
        apellido: "Perez",
        email: "carlosperez123@alumnos.unlam.edu.ar",
        contrasenia: "Polilingo123",
        fechaAlta: "2026-09-01",
        avatar: "Avatar1.png",
        idioma: "es",
        inscripciones: ["ingles", "aleman"],
        progreso: {
            ingles: {
                "1-1": { xp: 80 }, "1-2": { xp: 80 }, "1-3": { xp: 80 }, "1-4": { xp: 80 },
                "2-1": { xp: 80 }, "2-2": { xp: 80 }, "2-3": { xp: 80 }, "2-4": { xp: 80 },
            },
            aleman: {
                "1-1": { xp: 80 }, "1-2": { xp: 80 },
            },
        },
        cursosCompletados: [],
        xpTotal: 800,
        xpSemanal: 720,
        xpHoy: 0,
        racha: 5,
        mejorRacha: 12,
        diasDeRacha: 5, // estado.js genera los 5 días anteriores a hoy en diasActivos
        gemas: 550,
        vidas: 3,
        protectoresRacha: 2,
        compras: 1,
        vidasPerdidas: 1,
        vecesSinVidas: 0,
        liga: "bronce",
    },
    {
        usuario: "mariag22",
        nombre: "María",
        apellido: "González",
        email: "mariag22@alumnos.unlam.edu.ar",
        contrasenia: "Polilingo123",
        fechaAlta: "2026-08-15",
        avatar: "Avatar2.png",
        idioma: "es",
        inscripciones: ["ingles", "chino"],
        progreso: {
            ingles: {
                "1-1": { xp: 80 }, "1-2": { xp: 80 }, "1-3": { xp: 80 },
            },
            chino: {},
        },
        cursosCompletados: [],
        xpTotal: 240,
        xpSemanal: 160,
        xpHoy: 0,
        racha: 2,
        mejorRacha: 6,
        diasDeRacha: 2,
        gemas: 120,
        vidas: 5,
        protectoresRacha: 0,
        compras: 0,
        vidasPerdidas: 0,
        vecesSinVidas: 0,
        liga: "bronce",
    },
];

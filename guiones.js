// Guiones del chat animado del hero.
// La landing elige el guion por la URL: mabai.com.ar/colchones → GUIONES.colchones.
// Si no existe, usa "general". Para agregar un rubro: copiar el bloque "general"
// con otra clave (minúsculas, sin espacios ni acentos) y cambiar los textos.
//
//   nombre    → nombre que muestra el header del chat (el negocio).
//   resultado → texto del badge que aparece al final de la conversación.
//   mensajes  → en orden. de: "cliente" | "bot".

window.MABAI_GUIONES = {
  general: {
    nombre: "MABAI",
    resultado: "Lead calificado · visita agendada 18 hs",
    mensajes: [
      { de: "cliente", texto: "Hola! Vi el anuncio en Instagram, ¿tienen stock?" },
      { de: "bot",     texto: "¡Hola Martín! Sí, tenemos disponible. ¿Te paso modelos y precios?" },
      { de: "cliente", texto: "Dale. ¿Y hacen envíos a zona norte?" },
      { de: "bot",     texto: "Sí, llega en 48 hs. ¿Preferís que te llame un asesor o pasar por el local?" },
      { de: "cliente", texto: "Prefiero pasar. ¿Mañana a la tarde?" },
      { de: "bot",     texto: "Perfecto, te agendé para mañana a las 18 hs. ¡Te esperamos!" }
    ]
  }
};

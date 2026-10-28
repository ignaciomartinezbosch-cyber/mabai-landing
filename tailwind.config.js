// Mismo setup que el CDN de Tailwind 3.4.17 que usaba el sitio: tema por defecto, sin plugins.
// Prueba ui-ux-pro-max: colores con nombre propio (solo los usa la home de esta rama).
module.exports = {
  content: ['./*.html', './*.js'],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED', secondary: '#A78BFA', accent: '#0891B2', background: '#FAF5FF',
        foreground: '#1E1B4B', muted: '#ECEEF9', 'muted-foreground': '#475569', line: '#DDD6FE',
      },
    },
  },
};

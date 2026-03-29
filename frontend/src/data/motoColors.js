// Mapa de colores por modelo → imágenes en /media/motos/
export const MOTO_COLORS = {
  'NMAX 155': [
    { label: 'Negro Mate',        hex: '#1A1A1A', image: '/media/motos/Nmax/negra.avif' },
    { label: 'Blanco Perlado',    hex: '#E8E8E8', image: '/media/motos/Nmax/blanca.avif' },
    { label: 'Plateado Metálico', hex: '#C0C0C0', image: '/media/motos/Nmax/nmaxplateada.avif' },
    { label: 'Rojo Racing',       hex: '#DC2626', image: '/media/motos/Nmax/roja.avif' },
  ],
  'Aerox 155': [
    { label: 'Negro',  hex: '#1A1A1A', image: '/media/motos/AEROX 155/NEGRA.avif' },
    { label: 'Blanco', hex: '#E8E8E8', image: '/media/motos/AEROX 155/blanca.avif' },
    { label: 'Gris',   hex: '#7B8794', image: '/media/motos/AEROX 155/gris.avif' },
  ],
  'MT-07': [
    { label: 'Azul',  hex: '#0066CC', image: '/media/motos/MT07/azulmt07.avif' },
    { label: 'Negro', hex: '#1A1A1A', image: '/media/motos/MT07/negromt07.webp' },
  ],
  'MT-09 SP': [
    { label: 'Gris Storm', hex: '#6B7280', image: '/media/motos/MT 09 SP/GRIS.avif' },
  ],
  'YZF-R7': [
    { label: 'Azul Racing', hex: '#0066CC', image: '/media/motos/R7/azulr7.avif' },
    { label: 'Negro Tech',  hex: '#1A1A1A', image: '/media/motos/R7/R7negro.avif' },
  ],
  'YCZ 110': [
    { label: 'Azul Oscuro', hex: '#1E3A8A', image: '/media/motos/YCZ 110/azul-oscuro.avif' },
    { label: 'Rojo',        hex: '#DC2626', image: '/media/motos/YCZ 110/rojo.png' },
  ],
  'R15 V4': [
    { label: 'Azul', hex: '#0066CC', image: '/media/motos/R15 V4/AZUL.avif' },
    { label: 'Negro', hex: '#1A1A1A', image: '/media/motos/R15 V4/NEGRO.webp' },
  ],
  'WR250F MOTOCROSS': [
    { label: 'Azul Yamaha', hex: '#003087', image: '/media/motos/WR250F MOTOCROSS/AZUL.avif' },
  ],
  'XTZ 150': [
    { label: 'Azul',   hex: '#0066CC', image: '/media/motos/XTZ 150/AZUL.avif' },
    { label: 'Blanco', hex: '#E8E8E8', image: '/media/motos/XTZ 150/BLANCO.avif' },
    { label: 'Café',   hex: '#92400E', image: '/media/motos/XTZ 150/CAFE.avif' },
    { label: 'Negro',  hex: '#1A1A1A', image: '/media/motos/XTZ 150/NEGRO.avif' },
  ],
  'XTZ 250': [
    { label: 'Blanco', hex: '#E8E8E8', image: '/media/motos/XTZ 250/BLANCO.avif' },
    { label: 'Negro',  hex: '#1A1A1A', image: '/media/motos/XTZ 250/NEGRO.avif' },
    { label: 'Rojo',   hex: '#DC2626', image: '/media/motos/XTZ 250/ROJO.avif' },
  ],
}

export function getColors(modelo) {
  return MOTO_COLORS[modelo] || null
}

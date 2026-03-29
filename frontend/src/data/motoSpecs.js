export const MOTO_SPECS = {
  'NMAX 155':        { hp: '15,15', nm: '14,2', desc: 'Motor Blue Core 155cc, ABS, conectividad Y-Connect y máximo confort urbano.' },
  'Aerox 155':       { hp: '15,15', nm: '13,9', desc: 'Scooter deportivo con diseño agresivo, motor de alto rendimiento y frenos CBS.' },
  'MT-07':           { hp: '73',    nm: '68',   desc: 'Naked de 689cc con motor CP2 bicilíndrico. Pura adrenalina en cada curva.' },
  'MT-09 SP':        { hp: '119',   nm: '93',   desc: 'Motor CP3 de 890cc, suspensión Öhlins y electrónica avanzada de alto nivel.' },
  'YZF-R7':          { hp: '73',    nm: '67',   desc: 'Supersport con motor CP2, chasis deltabox y aerodinámica heredada del MotoGP.' },
  'YCZ 110':         { hp: '7,3',   nm: '7,5',  desc: 'Movilidad urbana eficiente con diseño clásico y bajo consumo de combustible.' },
  'R15 V4':          { hp: '18,4',  nm: '14,2', desc: 'Sport 155cc con VVA, chasis deltabox y diseño inspirado en el YZF-R6.' },
  'WR250F MOTOCROSS':{ hp: '40',    nm: '28,5', desc: 'Motocross de competición con motor 4T de 250cc, potente y ágil off-road.' },
  'XTZ 150':         { hp: '12,3',  nm: '11,8', desc: 'Trail versátil 150cc, ideal para ciudad y caminos rurales con gran autonomía.' },
  'XTZ 250':         { hp: '20',    nm: '19,2', desc: 'Adventure 249cc con suspensión de largo recorrido y neumáticos mixtos.' },
}

export function getSpecs(modelo) {
  return MOTO_SPECS[modelo] || null
}

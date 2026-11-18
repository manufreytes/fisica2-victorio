F2.units.push({
  id: 3, rom: 'III', title: 'Propiedades eléctricas de la materia y capacitores', short: 'Materia y capacitores', book: 'Cap. 24', block: 'Electrostática',
  idea: 'Los materiales responden al campo: los conductores lo expulsan, los dieléctricos lo debilitan. Un capacitor guarda energía en el campo.',
  temas: ['Conductores e inducción electrostática', 'Generador electrostático', 'Dieléctricos: polarización, susceptibilidad, E–P–D', 'Capacidad y capacitores (plano, esférico, cilíndrico)', 'Conexión de capacitores', 'Energía, densidad de energía y fuerzas'],
  resumen: R`
En un **conductor** hay cargas libres: en equilibrio $\vec E=0$ adentro, la carga neta vive en la superficie, y la superficie es equipotencial (inducción electrostática, jaula de Faraday). En el **generador electrostático** la carga depositada en el interior pasa íntegra a la superficie exterior.

Un **dieléctrico** se polariza: aparecen cargas *ligadas* que crean un campo opuesto. Se describen con tres vectores: $\vec E$ (total), $\vec P$ (dipolos por unidad de volumen) y $\vec D=\varepsilon_0\vec E+\vec P$, cuyo flujo sólo depende de la carga **libre**.

La **capacidad** $C=Q/V$ depende sólo de la geometría y del material. La energía $U=\tfrac12CV^2$ está almacenada en el campo con densidad $u=\tfrac12\varepsilon E^2$. ¡Atención a los casos “con batería conectada” vs “desconectada”: es la pregunta trampa favorita!`,
  formulas: [
    ['Capacidad', R`$C=Q/V$`, 'Faradio = C/V'],
    ['Plano', R`$C=\dfrac{\varepsilon_0A}{d}$`, 'Con dieléctrico: $\\varepsilon=\\kappa\\varepsilon_0$'],
    ['Esférico', R`$C=4\pi\varepsilon_0\dfrac{ab}{b-a}$`, '$b\\to\\infty$: $4\\pi\\varepsilon_0a$'],
    ['Cilíndrico', R`$C=\dfrac{2\pi\varepsilon_0L}{\ln(b/a)}$`, 'Por unidad de longitud'],
    ['Serie / Paralelo', R`$\dfrac1{C_s}=\sum\dfrac1{C_i}\ ;\ C_p=\sum C_i$`, 'Serie: misma $Q$. Paralelo: misma $V$'],
    ['Energía', R`$U=\dfrac{Q^2}{2C}=\tfrac12CV^2=\tfrac12QV$`, ''],
    ['Densidad de energía', R`$u=\tfrac12\varepsilon_0E^2\ \to\ \tfrac12\varepsilon E^2$`, 'En el vacío y en dieléctrico'],
    ['Tres vectores', R`$\vec D=\varepsilon_0\vec E+\vec P,\ \ \vec P=\varepsilon_0\chi_e\vec E,\ \ \kappa=1+\chi_e$`, ''],
    ['Gauss para D', R`$\oint\vec D\cdot d\vec A=Q_{libre}$`, 'Ignora cargas ligadas'],
    ['Fuerza entre placas', R`$F=\dfrac{Q^2}{2\varepsilon_0A}=\tfrac12\varepsilon_0E^2A$`, 'Cada placa siente $E/2$']
  ],
  tribunal: [
    { t: 'def', q: 'Conductores en un campo eléctrico: explicá la inducción electrostática y el funcionamiento del generador electrostático.',
      k: ['Cargas libres se reordenan hasta anular el campo interior', 'En equilibrio: $\\vec E=0$ dentro, carga sólo en la superficie, superficie equipotencial', 'Campo superficial ⟂ y $E=\\sigma/\\varepsilon_0$', 'Jaula de Faraday: cavidad apantallada', 'Generador: carga en contacto con la pared interior pasa toda al exterior (Gauss), por eso el potencial puede crecer'],
      err: 'Decir que dentro del conductor “no hay carga” cuando se trata de carga neta: hay cargas, pero se compensan.' },
    { t: 'def', q: 'Dieléctricos: polarización, vectores E, P y D, y teoría molecular. ¿Por qué se reduce el campo?',
      k: ['Moléculas polares (se orientan) y no polares (dipolo inducido)', 'Cargas ligadas superficiales $\\sigma_b=\\vec P\\cdot\\hat n$ crean un campo opuesto', '$E=E_0/\\kappa$ (a carga libre fija)', '$\\vec P=\\varepsilon_0\\chi_e\\vec E$ y $\\vec D=\\varepsilon\\vec E$', 'Campo de ruptura: por encima, el dieléctrico conduce'],
      err: '$\\vec D$ NO es “el campo eléctrico en el material”: es una herramienta que sólo ve la carga libre.' },
    { t: 'ded', q: 'Deducí la capacidad de un capacitor cilíndrico (o esférico).',
      k: ['Carga $+Q$ en el interior, $-Q$ en el exterior', 'Gauss entre $a$ y $b$: $E=\\lambda/2\\pi\\varepsilon_0r$, con $\\lambda=Q/L$', '$V=\\int_a^bE\\,dr=\\frac{\\lambda}{2\\pi\\varepsilon_0}\\ln(b/a)$', '$C=Q/V=2\\pi\\varepsilon_0L/\\ln(b/a)$', 'Depende sólo de geometría y material'] },
    { t: 'apl', q: 'A un capacitor plano cargado se le inserta un dieléctrico. Analizá V, Q, E, C y U en dos casos: batería conectada y desconectada.',
      k: ['$C\\to\\kappa C$ en ambos casos', 'Conectada: $V$ cte ⇒ $Q$ aumenta, $U=\\tfrac12CV^2$ aumenta; trabaja la batería', 'Desconectada: $Q$ cte ⇒ $V$ baja, $E$ baja ($E_0/\\kappa$), $U$ baja', 'La energía que “falta” es trabajo que el campo hace sobre el dieléctrico (lo succiona)', 'Siempre aclarar qué magnitud se mantiene constante'],
      err: 'Responder sin decir si la batería está conectada.' },
    { t: 'ded', q: 'Energía almacenada en un capacitor, densidad de energía y fuerza entre las placas.',
      k: ['$dW=v\\,dq=(q/C)dq\\Rightarrow U=Q^2/2C$', 'Plano: $u=U/(Ad)=\\tfrac12\\varepsilon_0E^2$ → la energía está en el campo', 'Fuerza: $F=-dU/dx$ a $Q$ constante, $U=Q^2x/2\\varepsilon_0A$ ⇒ $F=Q^2/2\\varepsilon_0A$', 'El factor ½: cada placa siente sólo el campo de la otra ($E/2$)', 'Presión electrostática $\\tfrac12\\varepsilon_0E^2$'] }
  ],
  cards: [
    ['Capacitores en serie: ¿qué se conserva y cómo se suman?', R`Misma carga $Q$; $\frac1C_{eq}=\sum\frac1{C_i}$ (la $C_{eq}$ es menor que la menor).`],
    ['Capacitores en paralelo: ¿qué se conserva y cómo se suman?', R`Misma tensión $V$; $C_{eq}=\sum C_i$.`],
    ['¿Qué es la constante dieléctrica κ?', R`Cociente $C/C_0$ al llenar con dieléctrico; $\kappa\ge1$ ($=1$ en vacío).`],
    ['Unidades de P y D', R`Ambos en $\mathrm{C/m^2}$ (densidad superficial de carga).`],
    ['Teoría molecular: polar vs no polar', 'Polar: dipolos permanentes que se orientan (depende de T). No polar: dipolos inducidos por el campo.'],
    ['¿De qué depende la capacidad?', 'Sólo de la geometría y del material entre placas; no de $Q$ ni de $V$.'],
    ['Condición de frontera de D', R`La componente normal de $\vec D$ es continua en la interfaz (sin carga libre); la tangencial de $\vec E$ también.`],
    ['Energía por unidad de volumen en un dieléctrico lineal', R`$u=\tfrac12\vec E\cdot\vec D=\tfrac12\varepsilon E^2$.`]
  ],
  deduccion: { titulo: 'Energía almacenada en un capacitor', intro: 'Ordená los pasos.',
    pasos: [
      R`En un instante el capacitor tiene carga $q$ y tensión $v=q/C$`,
      R`Llevar una carga $dq$ de una placa a la otra cuesta $dW=v\,dq=(q/C)\,dq$`,
      R`Integro de $0$ a $Q$: $W=\int_0^Q (q/C)\,dq=Q^2/2C$`,
      R`Equivalentes: $U=\tfrac12QV=\tfrac12CV^2$`,
      R`Para placas: $C=\varepsilon_0A/d$ y $V=Ed$ ⇒ $U=\tfrac12\varepsilon_0E^2\,(Ad)$`,
      R`Dividiendo por el volumen $Ad$: $u=\tfrac12\varepsilon_0E^2$`
    ] },
  vf: [
    ['Dos capacitores conectados en serie almacenan la misma carga.', true, 'La placa interna intermedia es neutra en conjunto: lo que sale de una entra en la otra.'],
    ['Un dieléctrico siempre aumenta el campo eléctrico entre las placas.', false, 'A carga libre fija lo reduce: $E=E_0/\\kappa$.'],
    ['La capacidad de un capacitor aumenta si aumento la carga que almacena.', false, 'Depende de geometría y material, no de $Q$ ni de $V$.'],
    ['El flujo de D a través de una superficie cerrada depende sólo de la carga libre encerrada.', true, 'Por eso D es útil en problemas con dieléctricos.']
  ],
  consejo: 'Practicá el caso “conectado vs desconectado” en voz alta: es el que más “pisa” a quienes sólo memorizan.'
});

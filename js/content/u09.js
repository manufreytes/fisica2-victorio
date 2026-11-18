F2.units.push({
  id: 9, rom: 'IX', title: 'Propiedades magnéticas de la materia', short: 'Materia magnética', book: 'Cap. 28 (28.8) y 29', block: 'Magnetismo',
  idea: 'La materia responde al campo magnético: se debilita, se refuerza o “recuerda”. El núcleo de hierro multiplica el campo.',
  temas: ['Permeabilidad, B–H–M', 'Dia-, para- y ferromagnetismo', 'Histéresis', 'Circuitos magnéticos', 'Imanes permanentes y campo desmagnetizante'],
  resumen: R`
La materia se **magnetiza**: $\vec M$ es el momento dipolar magnético por unidad de volumen. Las corrientes de magnetización (ligadas) suman a las corrientes libres. Para aislar sólo las libres se define $\vec H$: $\oint\vec H\cdot d\vec l=I_{libre}$ y $\vec B=\mu_0(\vec H+\vec M)$. En materiales lineales, $\vec M=\chi_m\vec H$ y $\mu=\mu_0(1+\chi_m)$. (Es la exacta analogía de $\vec E,\vec P,\vec D$.)

**Diamagnetismo**: efecto de Lenz atómico, $\chi_m<0$ y pequeño, en todos los materiales. **Paramagnetismo**: dipolos permanentes que se alinean parcialmente ($\chi\propto1/T$, Curie). **Ferromagnetismo**: dominios de Weiss, $\chi\gg1$, saturación, histéresis, temperatura de Curie.

El **ciclo de histéresis** ($B$ vs $H$) tiene remanencia $B_r$ y coercitividad $H_c$; su **área** es la energía disipada por unidad de volumen y por ciclo. En **circuitos magnéticos** vale una “ley de Ohm”: $\Phi=NI/\mathcal R$ (Hopkinson).`,
  formulas: [
    ['B, H, M', R`$\vec B=\mu_0(\vec H+\vec M)$`, '$H$ en A/m'],
    ['Lineal', R`$\vec M=\chi_m\vec H,\ \ \mu=\mu_0(1+\chi_m)=\mu_0\mu_r$`, ''],
    ['Ampère para H', R`$\oint\vec H\cdot d\vec l=I_{libre}$`, ''],
    ['Curie', R`$\chi_m=C/T$`, 'Paramagnéticos'],
    ['Histéresis', R`$w=\oint H\,dB$`, 'Energía/volumen por ciclo'],
    ['Hopkinson', R`$\Phi=\dfrac{NI}{\mathcal R},\ \ \mathcal R=\dfrac{\ell}{\mu A}$`, 'fmm $=NI$'],
    ['Serie / Paralelo', R`$\mathcal R_s=\sum\mathcal R_i\ ;\ \dfrac1{\mathcal R_p}=\sum\dfrac1{\mathcal R_i}$`, 'Como resistencias'],
    ['Imán', R`$\vec H_d=-N_d\vec M$`, 'Campo desmagnetizante']
  ],
  tribunal: [
    { t: 'def', q: 'Los tres vectores magnéticos B, H y M: definición, relación y analogía con E, P y D.',
      k: [R`$\vec M$: dipolos por unidad de volumen ⇒ corrientes de magnetización`, R`$\vec H$ depende sólo de las corrientes libres (Ampère para $H$)`, R`$\vec B=\mu_0(\vec H+\vec M)$`, R`Lineal: $\vec M=\chi_m\vec H$, $\mu=\mu_0(1+\chi_m)$`, 'Analogía término a término: E↔B (campo total), P↔M, D↔H (sólo fuentes libres)'],
      err: 'Decir que H “es el campo magnético” sin aclarar que no incluye las corrientes de magnetización.' },
    { t: 'def', q: 'Modelos del diamagnetismo, paramagnetismo y ferromagnetismo.',
      k: ['Dia: se inducen momentos opuestos a $B$ (Lenz atómico); $\\chi<0$, pequeño; independiente de $T$; todos los materiales', 'Para: dipolos permanentes que se orientan con $B$ contra la agitación térmica; $\\chi>0$, ley de Curie', 'Ferro: acoplamiento de intercambio, dominios de Weiss; $\\chi\\gg1$ y no lineal', 'Temperatura de Curie: pasa a paramagnético', 'Diamagnéticos son repelidos; para- y ferro, atraídos'] },
    { t: 'apl', q: 'Ciclo de histéresis: remanencia, coercitividad y energía. Materiales blandos y duros.',
      k: ['Curva de primera imanación y saturación', R`$B_r$ (remanencia), $H_c$ (campo coercitivo)`, 'Área del ciclo = energía disipada por volumen por ciclo', 'Blandos (hierro dulce): ciclo angosto → transformadores y motores', 'Duros: ciclo ancho → imanes permanentes'] },
    { t: 'ded', q: 'Circuitos magnéticos: relación de Hopkinson, analogía con el circuito eléctrico, entrehierro.',
      k: [R`Ampère con $H$: $\sum H_i\ell_i=NI$ (fmm)`, R`Flujo conservado $\Phi=BA$`, R`$\mathcal R=\ell/\mu A$; $\Phi=NI/\mathcal R$`, 'Analogía: fmm↔fem, Φ↔I, ℜ↔R', 'Un entrehierro pequeño domina la reluctancia ($\\mu_r$ grande)'] },
    { t: 'cruz', q: 'Imán permanente: ¿cómo son B, H y M adentro y afuera? Campo desmagnetizante y masas magnéticas.',
      k: [R`Afuera $\vec B=\mu_0\vec H$`, R`Adentro $\vec H$ opuesto a $\vec M$ (desmagnetizante)`, R`$\nabla\cdot\vec B=0$ siempre; $\nabla\cdot\vec H=-\nabla\cdot\vec M$`, 'Polos (masas magnéticas) ficticios como fuentes de $H$', 'Las líneas de B son cerradas y continuas'] }
  ],
  cards: [
    ['Órdenes de magnitud de χ', 'Dia y para: ~$10^{-5}$ (en valor absoluto). Ferro: $10^2$–$10^5$.'],
    ['Temperatura de Curie', 'Por encima, un ferromagnético se vuelve paramagnético (se destruye el ordenamiento de los dominios).'],
    ['Un material diamagnético en un imán', 'Es repelido débilmente (se induce un momento opuesto).'],
    ['Fuerza magnetomotriz', R`$\mathcal F=NI$ (amperevueltas).`],
    ['¿Por qué el núcleo de hierro aumenta L?', R`$L\propto\mu$: con $\mu_r\sim10^3$ se multiplica por ~1000.`],
    ['Dominios de Weiss', 'Regiones con momentos alineados; el campo externo los hace crecer/rotar.'],
    ['Pérdidas en un transformador', 'Histéresis (área del ciclo), Foucault (laminado) y resistivas en el cobre.'],
    ['Unidad de H', R`A/m. Para B: tesla. $\mu_0$ puente entre ambas en vacío.`]
  ],
  deduccion: { titulo: 'Núcleo con entrehierro: relación de Hopkinson', intro: 'Ordená los pasos.',
    pasos: [
      R`Ampère aplicado al camino medio del núcleo con $N$ espiras: $\oint\vec H\cdot d\vec l=NI$`,
      R`Camino en hierro (largo $\ell_f$) y entrehierro (ancho $g$): $H_f\ell_f+H_gg=NI$`,
      R`El flujo se conserva, $\Phi=BA$, con la misma $B$ y $A$ (se desprecia la dispersión)`,
      R`Uso $H=B/\mu$: $\Big(\dfrac{\ell_f}{\mu_fA}+\dfrac{g}{\mu_0A}\Big)\Phi=NI$`,
      R`Defino reluctancias: $\Phi=\dfrac{NI}{\mathcal R_f+\mathcal R_g}$, con $\mathcal R_g\gg\mathcal R_f$ habitualmente`
    ] },
  vf: [
    ['Un material diamagnético es repelido por un imán.', true, 'Su respuesta se opone al campo aplicado.'],
    ['El diamagnetismo sólo ocurre en algunos materiales.', false, 'Ocurre en todos; suele estar enmascarado por para- o ferromagnetismo.'],
    ['El área del ciclo de histéresis representa energía disipada por ciclo.', true, 'Por unidad de volumen: $\\oint H\\,dB$.'],
    ['La susceptibilidad de un ferromagnético es constante.', false, 'Depende de $H$ y de la historia (histéresis).']
  ],
  consejo: 'La analogía (E,P,D) ↔ (B,M,H) es un puente que los profes valoran: usala para conectar las Unidades III y IX.'
});

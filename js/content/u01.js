F2.units.push({
  id: 1, rom: 'I', title: 'El campo eléctrico y la Ley de Gauss', short: 'Campo y Gauss', book: 'Cap. 21–22', block: 'Electrostática',
  idea: 'Las cargas “llenan” el espacio de un campo; Gauss dice cuánto campo nace de cuánta carga.',
  temas: ['Carga y ley de Coulomb', 'Campo de puntuales, dipolos, hilos, anillos, discos y placas', 'Líneas de campo', 'Flujo y ley integral de Gauss', 'Aplicaciones con simetría', 'Forma diferencial de Gauss'],
  resumen: R`
La **carga** es cuantizada y se conserva. La fuerza entre dos cargas puntuales (Coulomb) es central, inversamente proporcional a $r^2$ y obedece **superposición**. En vez de pensar “acción a distancia”, definimos el **campo** $\vec E=\vec F/q_0$: una propiedad del espacio creada por las cargas fuente.

Para distribuciones continuas se integra $d\vec E$ (vectorial: usá la simetría para anular componentes). Así salen anillo, disco, hilo y plano, y los **límites** que los profes aman: disco con $z\ll R$ → plano infinito; con $z\gg R$ → carga puntual.

La **ley de Gauss** $\oint\vec E\cdot d\vec A=Q_{enc}/\varepsilon_0$ es equivalente a Coulomb, pero útil como *herramienta de cálculo* sólo cuando hay simetría (esférica, cilíndrica, plana) que permite sacar $E$ fuera de la integral. En forma diferencial, $\nabla\cdot\vec E=\rho/\varepsilon_0$: la primera ecuación de Maxwell.`,
  formulas: [
    ['Coulomb', R`$\vec F=\dfrac{1}{4\pi\varepsilon_0}\dfrac{q_1q_2}{r^2}\hat r$`, 'Central, conservativa; $k\\approx 9\\times10^9\\ \\mathrm{N\\,m^2/C^2}$'],
    ['Campo puntual', R`$E=\dfrac{kq}{r^2}$`, 'Superposición para varias cargas'],
    ['Dipolo', R`$\vec p=q\vec d,\ \ \vec\tau=\vec p\times\vec E,\ \ U=-\vec p\cdot\vec E$`, 'Fuerza neta nula en $\\vec E$ uniforme'],
    ['Anillo (eje)', R`$E_z=\dfrac{kQz}{(z^2+R^2)^{3/2}}$`, 'Cero en el centro por simetría'],
    ['Disco (eje)', R`$E_z=\dfrac{\sigma}{2\varepsilon_0}\Big(1-\dfrac{z}{\sqrt{z^2+R^2}}\Big)$`, '$R\\to\\infty$ da $\\sigma/2\\varepsilon_0$'],
    ['Hilo infinito', R`$E=\dfrac{\lambda}{2\pi\varepsilon_0 r}$`, 'Radial, decae como $1/r$'],
    ['Plano infinito', R`$E=\dfrac{\sigma}{2\varepsilon_0}$`, 'Uniforme; conductor: $\\sigma/\\varepsilon_0$'],
    ['Gauss (integral)', R`$\oint \vec E\cdot d\vec A=\dfrac{Q_{enc}}{\varepsilon_0}$`, 'Vale siempre; útil con simetría'],
    ['Gauss (diferencial)', R`$\nabla\cdot\vec E=\dfrac{\rho}{\varepsilon_0}$`, 'Teorema de la divergencia las une']
  ],
  tribunal: [
    { t: 'def', q: '¿Qué es el flujo del campo eléctrico y qué enuncia la ley de Gauss? ¿Por qué vale siempre pero sólo es útil con simetría?',
      k: ['Flujo $\\Phi=\\int\\vec E\\cdot d\\vec A$: escalar, signo según la normal exterior', '$\\Phi=Q_{enc}/\\varepsilon_0$: sólo cuenta la carga encerrada', 'El $\\vec E$ del integrando es el campo TOTAL (de cargas dentro y fuera)', 'Para despejar $E$ hace falta que sea constante en módulo y ⟂/∥ a $d\\vec A$ en la gaussiana', 'Es equivalente a Coulomb (consecuencia del $1/r^2$)'],
      err: 'Decir “el campo sólo depende de la carga encerrada”. El que depende de $Q_{enc}$ es el flujo, no el campo.' },
    { t: 'ded', q: 'Deducí el campo de un plano infinito con carga superficial σ y el campo junto a un conductor cargado.',
      k: ['Simetría: $\\vec E$ ⟂ al plano, mismo módulo a ambos lados', 'Gaussiana: cilindro (“pastillero”) atravesando el plano', 'Flujo sólo por las dos tapas: $2EA$', '$Q_{enc}=\\sigma A$ ⇒ $E=\\sigma/2\\varepsilon_0$', 'Conductor: $E=0$ adentro ⇒ una sola tapa ⇒ $E=\\sigma/\\varepsilon_0$'],
      err: 'Olvidar que en el conductor el campo adentro es nulo, por eso es el doble que en el plano aislante.' },
    { t: 'apl', q: 'Esfera de radio R con carga Q distribuida uniformemente en volumen: calculá E(r) para todo r y graficalo. ¿Qué cambia si fuera conductora?',
      k: ['r > R: igual que carga puntual $kQ/r^2$', 'r < R: $Q_{enc}=Q\\,r^3/R^3$', '$E=kQr/R^3$ crece linealmente', 'Continuidad en $r=R$, máximo ahí', 'Conductora: $E=0$ adentro y toda la carga en la superficie'],
      err: 'Usar $Q$ total para $r<R$.' },
    { t: 'cruz', q: 'Anillo → disco → plano infinito: ¿cómo se conectan los resultados y qué verificás con los límites?',
      k: ['Disco = suma de anillos concéntricos de radio $r$ y ancho $dr$', 'Integral da $E_z=\\frac{\\sigma}{2\\varepsilon_0}\\big(1-\\frac{z}{\\sqrt{z^2+R^2}}\\big)$', '$R\\to\\infty$: $\\sigma/2\\varepsilon_0$ (coincide con Gauss)', '$z\\gg R$: $kQ/z^2$ (carga puntual)', 'Chequear límites es verificar coherencia del resultado'],
      err: 'Dar la fórmula sin comprobar casos límite: los profes lo piden.' },
    { t: 'ded', q: 'Forma diferencial de la ley de Gauss: ¿cómo se obtiene de la integral y qué significa?',
      k: ['Teorema de la divergencia: $\\oint\\vec E\\cdot d\\vec A=\\int\\nabla\\cdot\\vec E\\,dV$', '$Q_{enc}=\\int\\rho\\,dV$ para cualquier volumen ⇒ $\\nabla\\cdot\\vec E=\\rho/\\varepsilon_0$', 'Ley local: las cargas son fuentes (divergencia) del campo', 'Fuera de las cargas $\\nabla\\cdot\\vec E=0$ (ej. $1/r^2$)', 'Es la 1ª ecuación de Maxwell']
    }
  ],
  cards: [
    ['¿Qué es un dipolo eléctrico y cómo se mide?', R`Dos cargas $\pm q$ separadas $d$. Momento $\vec p=q\vec d$ (de $-$ a $+$).`],
    ['Dipolo en campo uniforme: fuerza, torque y energía', R`Fuerza neta $0$; $\vec\tau=\vec p\times\vec E$; $U=-\vec p\cdot\vec E$. Equilibrio estable con $\vec p\parallel\vec E$.`],
    ['Propiedades de las líneas de campo', 'Salen de + y entran en −; nunca se cruzan; tangentes a $E$; la densidad de líneas es proporcional a $|E|$.'],
    ['Campo dentro de un conductor en equilibrio', R`$\vec E=0$; la carga está sólo en la superficie; $\vec E$ superficial es ⟂ y vale $\sigma/\varepsilon_0$.`],
    ['¿Por qué Gauss implica Coulomb?', R`Simetría esférica: $E\,4\pi r^2=q/\varepsilon_0\Rightarrow E=kq/r^2$. El $1/r^2$ es lo que hace constante el flujo.`],
    ['Campo en el interior de una cáscara esférica cargada', R`Cero (Gauss: $Q_{enc}=0$). Es consecuencia directa del $1/r^2$.`],
    ['Unidades equivalentes del campo eléctrico', R`$\mathrm{N/C}=\mathrm{V/m}$.`],
    ['Principio de superposición', 'El campo de varias cargas es la suma vectorial de los campos individuales; la fuerza sobre una carga también.'],
    ['Conservación y cuantización de la carga', R`La carga neta de un sistema aislado es constante; toda carga es múltiplo entero de $e=1{,}602\times10^{-19}\,$C.`]
  ],
  deduccion: { titulo: 'Campo de un hilo infinito con la ley de Gauss', intro: 'Ordená los pasos de la deducción.',
    pasos: [
      'Por simetría cilíndrica, $\\vec E$ es radial y depende sólo de la distancia $r$ al hilo',
      'Elijo como gaussiana un cilindro coaxial de radio $r$ y largo $L$',
      'En las tapas $\\vec E\\perp d\\vec A$, flujo nulo',
      'En la superficie lateral $E$ es constante y paralelo a $d\\vec A$: $\\Phi=E\\,2\\pi rL$',
      'La carga encerrada es $Q_{enc}=\\lambda L$',
      'Aplico Gauss: $E\\,2\\pi rL=\\lambda L/\\varepsilon_0$',
      'Resultado: $E=\\dfrac{\\lambda}{2\\pi\\varepsilon_0 r}$, radial'
    ] },
  vf: [
    ['El flujo a través de una superficie cerrada depende de cómo están distribuidas las cargas dentro de ella.', false, 'Sólo depende de la carga total encerrada.'],
    ['Si el flujo a través de una superficie cerrada es cero, el campo es cero en todos sus puntos.', false, 'Puede haber campo entrante y saliente que se compensen (ej. dipolo, o carga externa).'],
    ['Junto a un conductor cargado el campo es σ/ε₀, el doble que junto a un plano aislante con la misma σ.', true, 'En el conductor el campo interior es nulo: toda la contribución queda de un lado.'],
    ['Un dipolo en un campo uniforme no sufre fuerza neta, pero sí torque.', true, 'Las dos fuerzas son iguales y opuestas pero con líneas de acción distintas.']
  ],
  consejo: 'Al defender Gauss, nombrá SIEMPRE la simetría y dibujá la gaussiana antes de escribir una sola fórmula.'
});

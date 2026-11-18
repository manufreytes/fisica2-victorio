F2.units.push({
  id: 11, rom: 'XI', title: 'Ondas, ecuaciones de Maxwell y ondas electromagnéticas', short: 'Maxwell y ondas EM', book: 'Cap. 32 (ondas: Vol. 1, cap. 15)', block: 'Ondas y CA',
  idea: 'Cuatro ecuaciones unifican todo el electromagnetismo y predicen que la luz es una onda de campos.',
  temas: ['Ondas armónicas y ecuación de D’Alembert', 'Ondas estacionarias, interferencia, resonancia', 'Corriente de desplazamiento', 'Ecuaciones de Maxwell', 'Ondas EM, índice de refracción', 'Vector de Poynting'],
  resumen: R`
Una **onda** viajera cumple $y(x,t)=f(x\mp vt)$; la armónica tiene doble periodicidad: espacial ($\lambda$, $k$) y temporal ($T$, $\omega$), con $v=\lambda f=\omega/k$. Satisface la **ecuación de D’Alembert** $\partial_x^2y=\frac1{v^2}\partial_t^2y$. La superposición de ondas contrapropagantes da **ondas estacionarias**; si la excitación coincide con un modo propio hay **resonancia**.

Maxwell notó que la ley de Ampère era inconsistente con un capacitor que se carga y agregó la **corriente de desplazamiento** $I_d=\varepsilon_0\,d\Phi_E/dt$. Quedaron las **cuatro ecuaciones** (integral y diferencial).

En el vacío, rotores y divergencias se combinan en una ecuación de onda con $v=1/\sqrt{\mu_0\varepsilon_0}=c$: la luz es una **onda electromagnética** transversal, con $E=cB$ y energía transportada por el **vector de Poynting** $\vec S=\frac1{\mu_0}\vec E\times\vec B$.`,
  formulas: [
    ['Onda armónica', R`$y=A\cos(kx-\omega t+\varphi),\ \ v=\lambda f=\omega/k$`, ''],
    ['D’Alembert', R`$\dfrac{\partial^2y}{\partial x^2}=\dfrac1{v^2}\dfrac{\partial^2y}{\partial t^2}$`, 'Cuerda: $v=\\sqrt{T/\\mu}$'],
    ['Estacionaria', R`$y=2A\sin kx\cos\omega t$`, 'Cuerda fija: $f_n=nv/2L$'],
    ['Maxwell (integral)', R`$\oint\vec E\cdot d\vec A=\tfrac{Q}{\varepsilon_0};\ \oint\vec B\cdot d\vec A=0$`, ''],
    ['Faraday y Ampère–Maxwell', R`$\oint\vec E\cdot d\vec l=-\tfrac{d\Phi_B}{dt};\ \oint\vec B\cdot d\vec l=\mu_0\big(I+\varepsilon_0\tfrac{d\Phi_E}{dt}\big)$`, ''],
    ['Maxwell (diferencial)', R`$\nabla\!\cdot\!\vec E=\tfrac\rho{\varepsilon_0};\ \nabla\!\cdot\!\vec B=0;\ \nabla\!\times\!\vec E=-\partial_t\vec B;\ \nabla\!\times\!\vec B=\mu_0\vec J+\mu_0\varepsilon_0\partial_t\vec E$`, ''],
    ['Velocidad', R`$c=\dfrac1{\sqrt{\mu_0\varepsilon_0}},\ \ v=\dfrac cn,\ \ E=cB$`, '$c\\approx3\\times10^8$ m/s'],
    ['Poynting', R`$\vec S=\dfrac1{\mu_0}\vec E\times\vec B,\ \ I=\langle S\rangle=\tfrac12\varepsilon_0cE_0^2$`, 'Presión de radiación $I/c$ (absorción)']
  ],
  tribunal: [
    { t: 'def', q: 'Ondas armónicas: doble periodicidad, ecuación de D’Alembert y velocidad en una cuerda.',
      k: [R`$y(x,t)=A\cos(kx-\omega t)$: periódica en $x$ ($\lambda$) y en $t$ ($T$)`, R`$v=\lambda f=\omega/k$`, R`Ecuación de onda: $\partial_x^2y=v^{-2}\partial_t^2y$; soluciones $f(x\mp vt)$`, R`Cuerda: 2ª ley de Newton en un elemento ⇒ $v=\sqrt{T/\mu}$`, 'Superposición (ecuación lineal)'] },
    { t: 'def', q: 'Ondas estacionarias, interferencia y resonancia.',
      k: ['Ondas idénticas en sentidos opuestos: nodos y antinodos fijos', R`$y=2A\sin kx\cos\omega t$`, R`Condiciones de contorno cuantizan: $f_n=nv/2L$`, 'Constructiva: $\\Delta\\varphi=2\\pi m$; destructiva: $(2m+1)\\pi$', 'Resonancia: excitación en un modo propio ⇒ amplitud máxima'],
      err: 'Decir que una estacionaria “transporta energía”: neta no, oscila entre cinética y potencial.' },
    { t: 'ded', q: '¿Qué es la corriente de desplazamiento y por qué fue necesaria?',
      k: ['Capacitor cargándose: Ampère con superficie entre placas ⇒ $I_{enc}=0$, pero con otra superficie ⇒ $I$', R`$I_d=\varepsilon_0\,d\Phi_E/dt$ restituye la continuidad`, 'Entre placas hay B aunque no pasen cargas', R`Un $\vec E$ variable crea $\vec B$ (simétrico con Faraday)`, 'Permite la propagación de ondas EM'] },
    { t: 'def', q: 'Las cuatro ecuaciones de Maxwell en forma integral y diferencial: significado de cada una.',
      k: ['Gauss-E: las cargas son fuentes de E', 'Gauss-B: no hay monopolos', 'Faraday: B variable crea E', 'Ampère–Maxwell: corrientes y E variable crean B', 'Teoremas de Gauss (divergencia) y Stokes pasan de integral a diferencial', 'Junto con la fuerza de Lorentz resumen el electromagnetismo clásico'] },
    { t: 'ded', q: 'Onda EM plana: obtené la velocidad, la relación E/B y la energía transportada (Poynting).',
      k: [R`Sin cargas: $\nabla\times(\nabla\times\vec E)=-\nabla^2\vec E$`, R`$\nabla^2\vec E=\mu_0\varepsilon_0\,\partial_t^2\vec E$ ⇒ $c=1/\sqrt{\mu_0\varepsilon_0}$`, R`$\vec E\perp\vec B\perp\hat k$, en fase, $E=cB$`, R`En un medio $v=c/n$, $n\approx\sqrt{\kappa}$`, R`$\vec S=\frac1{\mu_0}\vec E\times\vec B$; $I=\tfrac12\varepsilon_0cE_0^2$; $u_E=u_B$`] }
  ],
  cards: [
    ['Velocidad de propagación de la luz y su origen', R`$c=1/\sqrt{\mu_0\varepsilon_0}\approx2{,}998\times10^8$ m/s.`],
    ['Relación entre E y B en una onda EM plana', R`$E=cB$; en fase; mutuamente perpendiculares y perpendiculares a la propagación.`],
    ['Vector de Poynting: significado', 'Flujo de potencia por unidad de área; dirección = propagación.'],
    ['Densidades de energía en una onda EM', R`$u_E=\tfrac12\varepsilon_0E^2=u_B=\dfrac{B^2}{2\mu_0}$.`],
    ['Ondas transversales vs longitudinales', 'Transversal: oscilación ⟂ a la propagación (EM, cuerda); longitudinal: paralela (sonido).'],
    ['Índice de refracción', R`$n=c/v=\sqrt{\kappa\kappa_m}$.`],
    ['Presión de radiación', R`$p=I/c$ (absorción total); $2I/c$ (reflexión total).`],
    ['Espectro electromagnético (de menor a mayor frecuencia)', 'Radio, microondas, infrarrojo, visible, UV, rayos X, gamma.']
  ],
  deduccion: { titulo: 'La velocidad de las ondas EM a partir de Maxwell', intro: 'Ordená los pasos.',
    pasos: [
      R`En el vacío (sin $\rho$ ni $\vec J$): $\nabla\times\vec E=-\partial_t\vec B$ y $\nabla\times\vec B=\mu_0\varepsilon_0\,\partial_t\vec E$`,
      R`Aplico el rotor a la primera: $\nabla\times(\nabla\times\vec E)=-\partial_t(\nabla\times\vec B)$`,
      R`Identidad vectorial: $\nabla\times(\nabla\times\vec E)=\nabla(\nabla\cdot\vec E)-\nabla^2\vec E=-\nabla^2\vec E$`,
      R`Sustituyo la segunda ecuación: $\nabla^2\vec E=\mu_0\varepsilon_0\,\partial_t^2\vec E$`,
      R`Comparo con D’Alembert: $v^2=1/(\mu_0\varepsilon_0)$ ⇒ $v=c\approx3\times10^8$ m/s`,
      'Coincide con la velocidad medida de la luz: la luz es una onda electromagnética'
    ] },
  vf: [
    ['Las ondas electromagnéticas necesitan un medio material para propagarse.', false, 'Se propagan en el vacío.'],
    ['En una onda EM plana en el vacío, E y B están en fase y son perpendiculares.', true, 'Y ambos son perpendiculares a la dirección de propagación.'],
    ['Una onda estacionaria transporta energía neta en una dirección.', false, 'Dos ondas contrapropagantes se compensan: no hay flujo neto.'],
    ['La corriente de desplazamiento es un flujo de cargas a través del dieléctrico.', false, 'Es un término asociado a $d\\Phi_E/dt$, no hay movimiento de cargas.']
  ],
  consejo: 'Maxwell es el “hilo” de toda la materia: practicá nombrar cada ecuación con la unidad donde nació (I, VI, VIII).'
});

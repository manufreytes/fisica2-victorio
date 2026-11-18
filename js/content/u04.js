F2.units.push({
  id: 4, rom: 'IV', title: 'La corriente eléctrica', short: 'Corriente', book: 'Cap. 25', block: 'Electrodinámica',
  idea: 'Cargas en movimiento colectivo: un campo en el conductor las empuja y la red cristalina las frena.',
  temas: ['Intensidad y densidad de corriente', 'Modelo clásico de conducción', 'Resistividad, ley de Ohm, temperatura', 'Fuerza electromotriz y Ohm generalizada', 'Energía y potencia: efecto Joule'],
  resumen: R`
La **corriente** $I=dq/dt$ es un escalar: el flujo del vector **densidad de corriente** $\vec J=nq\vec v_d$ a través de una sección. La velocidad de deriva es minúscula (mm/s); lo rápido es la propagación del campo que pone a todos los portadores en movimiento a la vez.

El **modelo clásico (Drude)** explica la ley de Ohm microscópica $\vec J=\sigma\vec E$: electrones acelerados por $\vec E$ y frenados por colisiones cada $\tau$. De ahí $\sigma=ne^2\tau/m$ y por qué $\rho$ crece con la temperatura en metales.

Una **fuente** realiza trabajo no electrostático sobre las cargas: su **fem** $\varepsilon$. La ley de Ohm generalizada y el diagrama de potencial permiten recorrer un circuito. La energía entregada se disipa por **efecto Joule**, $P=I^2R$.`,
  formulas: [
    ['Corriente y densidad', R`$I=\dfrac{dq}{dt}=\int\vec J\cdot d\vec A,\ \ \vec J=nq\vec v_d$`, ''],
    ['Ohm microscópica', R`$\vec J=\sigma\vec E=\vec E/\rho$`, ''],
    ['Resistencia', R`$R=\rho\dfrac{L}{A},\ \ V=IR$`, 'Ohm macroscópica'],
    ['Drude', R`$\sigma=\dfrac{ne^2\tau}{m}$`, 'Modelo clásico'],
    ['Temperatura', R`$\rho(T)=\rho_0[1+\alpha(T-T_0)]$`, 'Metales: $\\alpha>0$'],
    ['Fuente real', R`$V_{ab}=\varepsilon-Ir$`, 'Descargando'],
    ['Potencia', R`$P=VI=I^2R=V^2/R$`, 'Efecto Joule'],
    ['Máx. transferencia', R`$P_R=\dfrac{\varepsilon^2R}{(R+r)^2}$, máx. en $R=r$`, 'Rendimiento 50 %']
  ],
  tribunal: [
    { t: 'def', q: 'Diferenciá corriente, densidad de corriente y velocidad de deriva. ¿Por qué la lámpara se enciende “instantáneamente”?',
      k: [R`$I$ escalar, flujo de $\vec J$`, R`$\vec J=nq\vec v_d$; $v_d\sim$ mm/s`, 'El campo se establece casi a la velocidad de la luz y mueve a todos los portadores a la vez', 'Sentido convencional: de + a −', R`En régimen estacionario $\nabla\cdot\vec J=0$: la corriente se conserva en los nodos`] },
    { t: 'ded', q: 'Explicá el modelo clásico de la conducción y obtené la ley de Ohm. ¿Qué predice sobre la temperatura?',
      k: [R`Electrones libres aceleran $a=-eE/m$ entre choques; tiempo medio $\tau$`, R`$v_d=-eE\tau/m$`, R`$J=ne^2\tau E/m\Rightarrow\sigma=ne^2\tau/m$`, R`Alambre: $E=V/L$, $J=I/A\Rightarrow R=\rho L/A$`, R`Al subir $T$ aumenta la agitación de la red, baja $\tau$, sube $\rho$`],
      err: 'Decir que la ley de Ohm es una ley universal: es una propiedad de materiales óhmicos.' },
    { t: 'def', q: 'Fuerza electromotriz y ley de Ohm generalizada: ¿qué es la fem y cómo se arma un diagrama de potencial?',
      k: ['fem = trabajo por unidad de carga hecho por fuerzas NO electrostáticas dentro de la fuente', R`Fuente real: $V_{ab}=\varepsilon-Ir$ (al descargar) y $\varepsilon+Ir$ (al cargar)`, R`Ley de mallas: $\sum\varepsilon=\sum IR$ recorriendo el circuito`, 'Diagrama: sube en la fuente, cae en cada resistencia, vuelve al valor inicial', 'La fem no es una fuerza'],
      err: 'Decir que la fem es la tensión en bornes: sólo coincide con $I=0$.' },
    { t: 'apl', q: 'Potencia y efecto Joule. ¿Cuándo una fuente entrega la máxima potencia a una carga?',
      k: [R`Choques ceden energía a la red: $P=I^2R$`, R`$P_R=\varepsilon^2R/(R+r)^2$`, R`Derivando: máximo en $R=r$`, R`Rendimiento $\eta=R/(R+r)=50\,\%$ en ese punto`, 'Aplicaciones: calefactores, fusibles, pérdidas en líneas'] },
    { t: 'cruz', q: 'Dependencia de la resistencia con la temperatura. ¿Qué materiales no cumplen Ohm?',
      k: [R`$\rho=\rho_0[1+\alpha\Delta T]$ en metales`, 'Semiconductores: $\\rho$ disminuye con $T$ (más portadores)', 'Diodos, lámparas incandescentes: relación $V$–$I$ no lineal', 'Termómetro de resistencia (platino)', 'Ohm es un modelo, no un principio fundamental'] }
  ],
  cards: [
    ['Velocidad de deriva típica en un cable de cobre', 'Del orden de $10^{-4}$ m/s (décimas de mm/s).'],
    ['Resistencia de un alambre: dependencia geométrica', R`Proporcional a la longitud, inversamente proporcional a la sección: $R=\rho L/A$.`],
    ['Conductancia y conductividad', R`$G=1/R$ (siemens); $\sigma=1/\rho$.`],
    ['¿Qué dice la regla de nodos físicamente?', 'Conservación de la carga: no se acumula carga en un nodo en régimen estacionario.'],
    ['Unidad kWh', R`Es energía: $1\,\mathrm{kWh}=3{,}6\times10^6$ J.`],
    ['¿Tensión en bornes de una pila ideal?', R`Igual a $\varepsilon$ ($r=0$) para cualquier corriente.`],
    ['Superconductores', R`$\rho=0$ por debajo de una temperatura crítica: $P=I^2R=0$.`],
    ['Potencia disipada en dos resistencias en serie vs paralelo (misma fuente)', R`Serie: misma $I$, $P\propto R$. Paralelo: misma $V$, $P\propto1/R$.`]
  ],
  deduccion: { titulo: 'Ley de Ohm a partir del modelo de Drude', intro: 'Ordená los pasos.',
    pasos: [
      R`Fuerza sobre un electrón libre: $\vec F=-e\vec E$, aceleración $\vec a=-e\vec E/m$ entre choques`,
      R`Con tiempo medio entre choques $\tau$, la velocidad media (deriva) es $\vec v_d=-\dfrac{e\tau}{m}\vec E$`,
      R`Densidad de corriente: $\vec J=-ne\,\vec v_d=\dfrac{ne^2\tau}{m}\vec E$`,
      R`Identifico $\sigma=ne^2\tau/m$: ley de Ohm microscópica $\vec J=\sigma\vec E$`,
      R`Alambre homogéneo: $E=V/L$ y $J=I/A$ ⇒ $I=\dfrac{\sigma A}{L}V$`,
      R`Entonces $V=IR$ con $R=\dfrac{L}{\sigma A}=\rho\dfrac{L}{A}$`
    ] },
  vf: [
    ['Los electrones recorren un cable a una velocidad cercana a la de la luz.', false, 'La deriva es del orden de mm/s; lo rápido es la propagación del campo.'],
    ['La corriente se “gasta” al atravesar una resistencia.', false, 'La corriente se conserva; lo que se disipa es energía.'],
    ['En un metal típico la resistividad aumenta con la temperatura.', true, 'Más agitación térmica ⇒ más colisiones.'],
    ['Una pila real entrega entre sus bornes exactamente su fem.', false, 'Sólo si $I=0$; si no, $V=\\varepsilon-Ir$.']
  ],
  consejo: 'Cuando hables de fem, decí “trabajo no electrostático por unidad de carga”: es la frase clave.'
});

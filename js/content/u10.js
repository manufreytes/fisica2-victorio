F2.units.push({
  id: 10, rom: 'X', title: 'Fundamentos de la corriente alterna', short: 'Corriente alterna', book: 'Cap. 31', block: 'Ondas y CA',
  idea: 'Con fasores, las ecuaciones diferenciales de un circuito en régimen senoidal se vuelven álgebra con números complejos.',
  temas: ['Números complejos y fasores', 'Circuitos R, L, C en CA', 'RLC serie y paralelo; impedancia y admitancia', 'Resonancia', 'Potencia y energía en CA'],
  resumen: R`
Una tensión senoidal $v=V_m\cos(\omega t+\varphi)$ se representa por un **fasor**: un número complejo con la amplitud y la fase, que rota con $\omega$. Derivar equivale a multiplicar por $j\omega$; integrar, a dividir. Así un circuito RLC en régimen permanente se resuelve como uno de resistencias, con **impedancias**: $Z_R=R$, $Z_L=j\omega L$, $Z_C=1/j\omega C$.

En un **RLC serie**, $Z=R+j(X_L-X_C)$. En **resonancia** $X_L=X_C$: la impedancia es mínima ($=R$), la corriente máxima y la fase cero, con $\omega_0=1/\sqrt{LC}$. En **paralelo** se trabaja con la **admitancia** $Y=1/Z$.

La **potencia activa** $P=V_{ef}I_{ef}\cos\varphi$ sólo se disipa en R; L y C intercambian energía (**reactiva**). El factor de potencia $\cos\varphi$ importa en la industria.`,
  formulas: [
    ['Senoidal', R`$v=V_m\cos(\omega t+\varphi),\ \ V_{ef}=V_m/\sqrt2$`, '$\\omega=2\\pi f$'],
    ['Fasor', R`$\hat V=V_me^{j\varphi}$`, 'Misma $\\omega$ en todo el circuito'],
    ['Impedancias', R`$Z_R=R,\ Z_L=j\omega L,\ Z_C=\dfrac{1}{j\omega C}$`, '$X_L=\\omega L,\\ X_C=1/\\omega C$'],
    ['RLC serie', R`$Z=R+j(X_L-X_C),\ \ |Z|=\sqrt{R^2+(X_L-X_C)^2}$`, '$\\tan\\varphi=(X_L-X_C)/R$'],
    ['Resonancia', R`$\omega_0=\dfrac1{\sqrt{LC}},\ \ Q=\dfrac{\omega_0L}{R}$`, 'Serie: $|Z|=R$'],
    ['Admitancia', R`$Y=\dfrac1R+j\Big(\omega C-\dfrac1{\omega L}\Big)$`, 'Paralelo'],
    ['Potencia', R`$P=V_{ef}I_{ef}\cos\varphi,\ Q=V_{ef}I_{ef}\sin\varphi,\ S=V_{ef}I_{ef}$`, 'W, VAr, VA'],
    ['Factor de potencia', R`$\cos\varphi=P/S$`, '']
  ],
  tribunal: [
    { t: 'def', q: '¿Qué es un fasor y por qué simplifica el análisis de circuitos en CA?',
      k: ['Número complejo con amplitud y fase de una señal senoidal', R`$e^{j\omega t}$ gira: se toma la parte real`, R`$d/dt\to j\omega$; $\int\to1/j\omega$`, 'Ecuaciones diferenciales → álgebra compleja', 'Válido en régimen permanente y misma frecuencia'] },
    { t: 'def', q: 'Resistor, inductor y capacitor en CA: relación tensión–corriente, fase y reactancias.',
      k: [R`R: en fase; $Z=R$`, R`L: $v$ adelanta a $i$ en 90°; $X_L=\omega L$ crece con $f$ (en CC es un cortocircuito)`, R`C: $i$ adelanta a $v$ en 90°; $X_C=1/\omega C$ decrece con $f$ (en CC es un abierto)`, 'Regla: “ELI the ICE man”', 'Filtros pasa-bajos / pasa-altos'] },
    { t: 'ded', q: 'Circuito RLC serie: impedancia, diagrama fasorial y resonancia.',
      k: ['Misma corriente en los tres elementos', R`$V_R$ en fase, $V_L$ a +90°, $V_C$ a −90°`, R`$|Z|=\sqrt{R^2+(X_L-X_C)^2}$; $\varphi$`, R`Resonancia: $X_L=X_C$, $\omega_0=1/\sqrt{LC}$, $Z=R$ mínima, $I$ máxima`, 'Q: tensiones en L y C pueden exceder la de la fuente'],
      err: 'Sumar las tensiones de R, L y C como números reales (hay que sumarlas como fasores).' },
    { t: 'apl', q: 'Potencia en CA: instantánea, activa, reactiva y aparente. ¿Qué es el factor de potencia?',
      k: [R`$p=vi$ oscila con $2\omega$`, R`Media: $P=V_{ef}I_{ef}\cos\varphi$`, 'Sólo R disipa; L y C intercambian energía (reactiva)', R`$S=V_{ef}I_{ef}$; triángulo $S^2=P^2+Q^2$`, 'Corregir el fp con capacitores reduce pérdidas'] },
    { t: 'cruz', q: 'Circuito RLC paralelo: admitancia, resonancia y analogía con el oscilador mecánico.',
      k: [R`$Y=G+j(\omega C-1/\omega L)$`, 'Misma tensión en los tres', R`Resonancia paralela: corriente de fuente mínima`, R`Analogía: $L\leftrightarrow m$, $1/C\leftrightarrow k$, $R\leftrightarrow$ rozamiento`, 'Energía oscila entre E y B'] }
  ],
  cards: [
    ['Valor eficaz de una senoide', R`$V_{ef}=V_m/\sqrt2$: equivalente a la tensión continua que disipa igual potencia.`],
    ['Red eléctrica en Argentina', '220 V eficaces, 50 Hz.'],
    ['Reactancia inductiva y capacitiva: unidades', 'Ohm; $X_L=\\omega L$, $X_C=1/(\\omega C)$.'],
    ['Resonancia serie: qué ocurre con la corriente', 'Máxima, en fase con la tensión; $Z=R$.'],
    ['Factor de calidad Q', R`$Q=\omega_0L/R=f_0/\Delta f$: agudeza de la resonancia.`],
    ['Fase de un capacitor', 'La corriente adelanta 90° a la tensión.'],
    ['Promedio de $\\cos^2\\omega t$', R`$1/2$ (clave para $P=\tfrac12V_mI_m\cos\varphi$).`],
    ['Impedancia de un inductor ideal en CC', R`$Z_L=j\omega L=0$ para $\omega=0$.`]
  ],
  deduccion: { titulo: 'Impedancia y resonancia del RLC serie con fasores', intro: 'Ordená los pasos.',
    pasos: [
      R`Corriente fasorial $\hat I$ común; tensiones: $\hat V_R=R\hat I$, $\hat V_L=j\omega L\hat I$, $\hat V_C=\hat I/(j\omega C)$`,
      R`Ley de mallas fasorial: $\hat V=\big(R+j\omega L+\tfrac1{j\omega C}\big)\hat I$`,
      R`Defino $Z=R+j\big(\omega L-\tfrac1{\omega C}\big)=R+j(X_L-X_C)$`,
      R`Módulo y fase: $|Z|=\sqrt{R^2+(X_L-X_C)^2}$, $\varphi=\arctan\frac{X_L-X_C}{R}$`,
      R`Resonancia: parte imaginaria nula ⇒ $\omega_0L=1/\omega_0C\Rightarrow\omega_0=1/\sqrt{LC}$`
    ] },
  vf: [
    ['En un capacitor ideal alimentado con CA la corriente está en fase con la tensión.', false, 'La corriente adelanta 90°.'],
    ['En resonancia en un RLC serie la impedancia es mínima.', true, '$|Z|=R$.'],
    ['Un inductor ideal disipa potencia activa en CA.', false, 'Sólo intercambia energía (potencia reactiva).'],
    ['El valor eficaz de una tensión senoidal es $V_m/\\sqrt2$.', true, 'Surge del promedio de $\\cos^2$.']
  ],
  consejo: 'Dibujá el diagrama fasorial a mano alzada: es la mejor forma de “hablar” de la fase.'
});

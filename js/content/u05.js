F2.units.push({
  id: 5, rom: 'V', title: 'Circuitos eléctricos', short: 'Circuitos', book: 'Cap. 26', block: 'Electrodinámica',
  idea: 'Dos leyes de conservación (carga y energía) resuelven cualquier red; el capacitor agrega memoria temporal: τ = RC.',
  temas: ['Serie, paralelo y mixtos', 'Reglas de Kirchhoff', 'Galvanómetro, amperímetro, voltímetro, ohmímetro', 'Potenciómetro y puente de Wheatstone', 'Circuito RC: carga y descarga'],
  resumen: R`
Las **reglas de Kirchhoff** son conservación de la carga (nodos: $\sum I=0$) y de la energía / carácter conservativo del campo (mallas: $\sum\Delta V=0$). Con $N$ nodos hay $N-1$ ecuaciones de nodos independientes; el resto salen de las mallas.

Los **instrumentos** parten de un galvanómetro de D'Arsonval (bobina móvil, torque magnético contra resorte, $\theta\propto I$): un **shunt** en paralelo lo convierte en amperímetro, una resistencia en **serie** en voltímetro. Un instrumento real perturba el circuito: conviene que el amperímetro tenga $R$ baja y el voltímetro $R$ alta.

**Wheatstone** compara resistencias con corriente nula por el galvanómetro (medición por *cero*). El **RC** introduce el primer régimen transitorio: $\tau=RC$.`,
  formulas: [
    ['Serie / Paralelo', R`$R_s=\sum R_i\ ;\ \dfrac1{R_p}=\sum\dfrac1{R_i}$`, ''],
    ['Kirchhoff', R`$\sum I_{nodo}=0\ ;\ \sum\Delta V_{malla}=0$`, 'Carga y energía'],
    ['Shunt', R`$R_{sh}=\dfrac{R_gI_g}{I-I_g}$`, 'Amperímetro'],
    ['Resistencia serie', R`$R_s=\dfrac{V}{I_g}-R_g$`, 'Voltímetro'],
    ['Wheatstone', R`$\dfrac{R_1}{R_2}=\dfrac{R_3}{R_x}$`, 'Con $I_g=0$ (según convención del puente)'],
    ['Carga RC', R`$q=C\varepsilon\,(1-e^{-t/RC}),\ \ i=\dfrac{\varepsilon}{R}e^{-t/RC}$`, '$\\tau=RC$'],
    ['Descarga RC', R`$q=Q_0e^{-t/RC},\ \ i=-\dfrac{Q_0}{RC}e^{-t/RC}$`, ''],
    ['Energía en la carga', R`$U_C=\tfrac12C\varepsilon^2\ ;\ E_{R}=\tfrac12C\varepsilon^2$`, 'La mitad se disipa']
  ],
  tribunal: [
    { t: 'def', q: 'Reglas de Kirchhoff: fundamento físico y método para resolver una red.',
      k: ['Nodos ← conservación de la carga', 'Mallas ← conservación de la energía (campo conservativo)', 'Con $N$ nodos, $N-1$ ecuaciones de nodos independientes', 'Elegir sentidos de corriente y de recorrido; fijar convención de signos', 'Una corriente negativa indica sentido real contrario: verificar con balance de potencias'] },
    { t: 'apl', q: 'Del galvanómetro de D’Arsonval al amperímetro y al voltímetro: ampliación de escala.',
      k: ['Bobina en campo de imán: torque $\\propto I$ vs resorte ⇒ $\\theta\\propto I$', 'Amperímetro: shunt $R_{sh}$ en paralelo', 'Voltímetro: resistencia en serie', 'Ideal: $R_A\\to0$, $R_V\\to\\infty$; el efecto de carga perturba la medición', 'Ohmímetro: batería + galvanómetro; escala no lineal'] },
    { t: 'ded', q: 'Puente de Wheatstone: condición de equilibrio y ventajas. Relacionalo con el potenciómetro.',
      k: ['Equilibrio: $V_a=V_b\\Rightarrow I_g=0$', 'Divisores de tensión ⇒ $R_1/R_2=R_3/R_x$', 'Independiente de la fem y de la resistencia del galvanómetro', 'Método de cero: muy sensible', 'Potenciómetro: mide fem sin extraer corriente en el equilibrio'] },
    { t: 'ded', q: 'Carga de un capacitor en un RC: planteá la ecuación diferencial y resolvela. Interpretá τ.',
      k: ['Malla: $\\varepsilon=iR+q/C$, $i=dq/dt$', '$q=C\\varepsilon(1-e^{-t/RC})$ con $q(0)=0$', '$i=(\\varepsilon/R)e^{-t/RC}$; $i(0)=\\varepsilon/R$, $i(\\infty)=0$', 't=τ: 63 % de carga; 5τ ≈ 99 %', 'Energía: la mitad en C, la mitad disipada en R'],
      err: 'Decir que a t=τ el capacitor está cargado del todo.' },
    { t: 'cruz', q: 'Compará el RC con el RL y adelantá qué ocurre en un RLC.',
      k: ['Mismas ecuaciones de primer orden', R`$\tau_{RL}=L/R$; $\tau_{RC}=RC$`, 'L se opone a cambios de corriente; C se opone a cambios de tensión', 'Con L y C juntos: ecuación de 2° orden, oscilaciones amortiguadas', 'Relación con CA y resonancia (U. X)'] }
  ],
  cards: [
    ['¿Cuántas ecuaciones de nodo independientes hay?', R`$N-1$ para $N$ nodos.`],
    ['Comportamiento de un capacitor descargado en $t=0$', 'Equivale a un cortocircuito (tensión nula). En $t\\to\\infty$ equivale a un circuito abierto.'],
    ['Resistencias en paralelo: ¿qué se mantiene igual?', 'La tensión. La corriente se reparte inversamente a las resistencias.'],
    ['¿Por qué el voltímetro va en paralelo y el amperímetro en serie?', 'Voltímetro mide diferencia de potencial entre dos puntos; el amperímetro debe ser atravesado por la corriente a medir.'],
    ['Constante de tiempo', R`$\tau=RC$ (s). Tiempo para pasar al 63 % del valor final (o caer al 37 %).`],
    ['Ventaja de la medición por cero', 'No depende de la calibración del instrumento detector, sólo de su sensibilidad.'],
    ['Resistencia equivalente de un shunt y un galvanómetro', R`$R_{eq}=\frac{R_gR_{sh}}{R_g+R_{sh}}\approx R_{sh}$, muy baja.`],
    ['Potencia entregada por una fuente a un circuito', R`$P=\varepsilon I$; parte disipada en $r$ y parte en la carga.`]
  ],
  deduccion: { titulo: 'Carga de un capacitor en un circuito RC', intro: 'Ordená los pasos.',
    pasos: [
      R`Ley de mallas al cerrar la llave: $\varepsilon-iR-q/C=0$`,
      R`Con $i=dq/dt$: $R\,\dfrac{dq}{dt}=\varepsilon-\dfrac qC$`,
      R`Separo variables: $\dfrac{dq}{C\varepsilon-q}=\dfrac{dt}{RC}$`,
      R`Integro con $q(0)=0$: $-\ln\!\big(\dfrac{C\varepsilon-q}{C\varepsilon}\big)=\dfrac{t}{RC}$`,
      R`Despejo: $q(t)=C\varepsilon\,(1-e^{-t/RC})$`,
      R`Derivo: $i(t)=\dfrac{\varepsilon}{R}e^{-t/RC}$`
    ] },
  vf: [
    ['Al cerrar la llave, un capacitor descargado se comporta como un cortocircuito.', true, 'Tensión nula ⇒ toda la fem cae en R: $i(0)=\\varepsilon/R$.'],
    ['Después de un tiempo τ = RC el capacitor está completamente cargado.', false, 'Tiene el 63 % de su carga final; se considera cargado tras ≈5τ.'],
    ['Dos resistencias en paralelo son atravesadas por la misma corriente.', false, 'Tienen la misma tensión; la corriente se reparte.'],
    ['Un voltímetro ideal tiene resistencia infinita.', true, 'Para no alterar el circuito que mide.']
  ],
  consejo: 'Relacioná SIEMPRE el TPL 7 (RC) con la solución analítica: τ medido vs RC nominal.'
});

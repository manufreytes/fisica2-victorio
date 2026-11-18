F2.units.push({
  id: 7, rom: 'VII', title: 'Interacción magnética', short: 'Fuerzas magnéticas', book: 'Cap. 27', block: 'Magnetismo',
  idea: 'B curva trayectorias sin entregar energía: de ahí salen el espectrómetro, el efecto Hall y el motor.',
  temas: ['Fuerza de Lorentz y movimiento de partículas', 'Selector de velocidad, Thomson, espectrómetro, Hall', 'Fuerza sobre conductores; definición de Ampere', 'Torque sobre espira, momento magnético, galvanómetro y motor'],
  resumen: R`
Sobre una carga en movimiento actúa la **fuerza de Lorentz** $\vec F=q(\vec E+\vec v\times\vec B)$. La parte magnética es siempre perpendicular a $\vec v$: **no realiza trabajo**; sólo cambia la dirección. Con $\vec v\perp\vec B$ la trayectoria es circular: $r=mv/|q|B$, con período independiente de $v$.

Combinando $\vec E$ y $\vec B$ cruzados se obtienen el **selector de velocidad** ($v=E/B$), la experiencia de **Thomson** ($e/m$) y el **espectrómetro de masas**. El **efecto Hall** revela el signo y la densidad de los portadores.

Sobre un conductor, $\vec F=I\vec L\times\vec B$; dos hilos paralelos se atraen o repelen y de ahí se definía el ampere. Una espira con corriente en $\vec B$ sufre un torque $\vec\tau=\vec m\times\vec B$: base del galvanómetro y del motor de corriente continua.`,
  formulas: [
    ['Lorentz', R`$\vec F=q(\vec E+\vec v\times\vec B)$`, 'Magnética: no trabaja'],
    ['Circular', R`$r=\dfrac{mv}{|q|B},\ \ \omega=\dfrac{|q|B}{m},\ \ T=\dfrac{2\pi m}{|q|B}$`, '$T$ independiente de $v$'],
    ['Selector', R`$v=E/B$`, 'Independiente de $q$ y $m$'],
    ['Espectrómetro', R`$\dfrac mq=\dfrac{B r}{v}$`, 'Separa isótopos'],
    ['Efecto Hall', R`$V_H=\dfrac{IB}{nqt}$`, '$t$: espesor paralelo a $B$'],
    ['Fuerza sobre conductor', R`$\vec F=I\vec L\times\vec B$`, 'Elemento: $I\\,d\\vec l\\times\\vec B$'],
    ['Hilos paralelos', R`$\dfrac FL=\dfrac{\mu_0I_1I_2}{2\pi d}$`, 'Igual sentido: atracción'],
    ['Espira', R`$\vec\tau=\vec m\times\vec B,\ \vec m=NI\vec A,\ U=-\vec m\cdot\vec B$`, '$\\tau=NIAB\\sin\\theta$']
  ],
  tribunal: [
    { t: 'def', q: 'Fuerza de Lorentz: ¿por qué el campo magnético no realiza trabajo? Describí las posibles trayectorias.',
      k: [R`$\vec F_B=q\vec v\times\vec B\perp\vec v$ ⇒ $dW=\vec F\cdot d\vec l=0$`, 'Cambia la dirección de la velocidad, no su módulo ni la energía cinética', R`$\vec v\perp\vec B$: circunferencia, $r=mv/qB$`, R`$\vec v$ oblicuo: hélice; paso $=v_\parallel T$`, 'El campo eléctrico sí trabaja'],
      err: 'Decir que B “acelera” a la partícula: cambia la velocidad vectorial pero no su rapidez.' },
    { t: 'apl', q: 'Selector de velocidad, experimento de Thomson y espectrómetro de masas.',
      k: ['E ⟂ B ⟂ v: $qE=qvB\\Rightarrow v=E/B$', 'Thomson: desviación sin B y con B ⇒ cociente $e/m$', 'Espectrómetro: sólo pasan las $v$ seleccionadas; luego $r=mv/qB_0$', 'Isótopos: distinto $r$ para distinta $m$', 'Independiente de $q$ y $m$ en el selector'] },
    { t: 'ded', q: 'Efecto Hall: explicá el fenómeno y deducí la tensión de Hall. ¿Qué información da?',
      k: ['Las cargas se desvían por $q\\vec v_d\\times\\vec B$ hacia un borde', 'Se acumula carga y aparece $E_H$ transversal', 'Equilibrio: $qE_H=qv_dB$', R`$V_H=E_Hw=v_dBw=\dfrac{IB}{nqt}$`, 'El signo de $V_H$ da el signo de los portadores; se obtiene $n$; sensor de campo'] },
    { t: 'def', q: 'Fuerza entre conductores paralelos y definición del ampere.',
      k: [R`$B_1=\mu_0I_1/2\pi d$ en el hilo 2`, R`$F/L=\mu_0I_1I_2/2\pi d$`, 'Corrientes paralelas se atraen; antiparalelas se repelen', 'Definición histórica: $2\\times10^{-7}$ N/m con 1 A y 1 m', 'Definición actual (SI 2019): fijando el valor numérico de la carga elemental $e$'] },
    { t: 'ded', q: 'Torque sobre una espira con corriente: momento magnético, galvanómetro y motor de CC.',
      k: [R`Fuerzas $IaB$ opuestas sobre lados ⟂ a $B$ ⇒ cupla`, R`$\tau=NIAB\sin\theta$, $\vec\tau=\vec m\times\vec B$`, R`$U=-\vec m\cdot\vec B$; equilibrio estable con $\vec m\parallel\vec B$`, 'Galvanómetro: resorte equilibra el torque', 'Motor: conmutador invierte la corriente cada media vuelta'] }
  ],
  cards: [
    ['Período del movimiento ciclotrónico', R`$T=2\pi m/(qB)$, independiente de la velocidad y del radio (no relativista).`],
    ['¿Qué ocurre con una partícula con $\\vec v\\parallel\\vec B$?', 'No hay fuerza magnética: sigue en línea recta.'],
    ['Fuerza sobre conductor recto en campo uniforme', R`$F=ILB\sin\theta$; dirección: $\vec L\times\vec B$.`],
    ['Fuerza neta sobre una espira en campo uniforme', 'Cero (sólo hay torque).'],
    ['Trabajo electromagnético de una espira que gira', R`$W=I\,\Delta\Phi_B$.`],
    ['Selector de velocidad: ¿cómo cambia con $q$?', 'No cambia: ambas fuerzas son proporcionales a $q$.'],
    ['Signo de los portadores con Hall', 'El signo de $V_H$ se invierte si los portadores son positivos o negativos (semiconductores tipo p/n).'],
    ['Aplicaciones del torque magnético', 'Galvanómetro, motor de CC, altavoz (bobina móvil).']
  ],
  deduccion: { titulo: 'Radio y período del movimiento circular en B', intro: 'Ordená los pasos.',
    pasos: [
      R`Partícula de carga $q$ con $\vec v\perp\vec B$: la fuerza magnética tiene módulo $qvB$ y es perpendicular a $\vec v$`,
      R`Actúa como fuerza centrípeta: $qvB=mv^2/r$`,
      R`Despejo el radio: $r=\dfrac{mv}{qB}$`,
      R`Velocidad angular: $\omega=\dfrac vr=\dfrac{qB}{m}$`,
      R`Período: $T=\dfrac{2\pi}{\omega}=\dfrac{2\pi m}{qB}$, independiente de $v$`
    ] },
  vf: [
    ['La fuerza magnética puede aumentar la energía cinética de una partícula.', false, 'Es perpendicular a la velocidad: no realiza trabajo.'],
    ['El período de una partícula en un campo magnético uniforme depende de su velocidad (no relativista).', false, 'Radio ∝ v y longitud ∝ v: el período no depende de v.'],
    ['Dos hilos paralelos con corrientes del mismo sentido se atraen.', true, 'El campo de uno ejerce sobre el otro una fuerza hacia él.'],
    ['El momento magnético de una espira es perpendicular al plano de la espira.', true, 'Sentido dado por la regla de la mano derecha con la corriente.']
  ],
  consejo: 'Un resultado “limpio” (r = mv/qB; v = E/B) siempre se verifica con unidades. Mostrá que lo hacés.'
});

F2.units.push({
  id: 8, rom: 'VIII', title: 'Inducción electromagnética', short: 'Inducción', book: 'Cap. 29–30', block: 'Magnetismo',
  idea: 'Un flujo que cambia crea campo eléctrico: la naturaleza “se resiste” al cambio (Lenz) y guarda energía en el campo B.',
  temas: ['Faraday–Lenz', 'fem de movimiento: varilla, disco de Faraday', 'Campos eléctricos inducidos, corrientes de Foucault', 'Mutua y autoinducción', 'Energía magnética', 'Circuito RL'],
  resumen: R`
La **ley de Faraday** $\varepsilon=-d\Phi_B/dt$ dice que la fem inducida depende de *cómo cambia* el flujo (por $B(t)$, por el área o por la orientación). El signo menos es la **ley de Lenz**: la corriente inducida se opone a la variación que la causa; si no fuera así violaríamos la conservación de la energía.

La **fem de movimiento** es la fuerza de Lorentz sobre las cargas del conductor: $\varepsilon=BLv$. Cuando el flujo varía sin movimiento aparece un campo eléctrico **no electrostático** (no conservativo): $\oint\vec E\cdot d\vec l=-d\Phi_B/dt$; en volúmenes metálicos genera **corrientes de Foucault**.

La **autoinducción** ($\varepsilon=-L\,dI/dt$) y la **mutua** (M) cuantifican este efecto en bobinas. Un inductor almacena $U=\tfrac12LI^2$ en el campo ($u_B=B^2/2\mu_0$). En un **RL** la corriente crece con $\tau=L/R$.`,
  formulas: [
    ['Faraday–Lenz', R`$\varepsilon=-\dfrac{d\Phi_B}{dt},\ \ \Phi_B=\int\vec B\cdot d\vec A$`, 'Bobina: $\\varepsilon=-N\\,d\\Phi/dt$'],
    ['E inducido', R`$\oint\vec E\cdot d\vec l=-\dfrac{d\Phi_B}{dt}$`, 'No conservativo'],
    ['Varilla en traslación', R`$\varepsilon=BLv$`, '$B,L,v$ mutuamente ⟂'],
    ['Varilla rotante', R`$\varepsilon=\tfrac12B\omega L^2$`, 'Disco de Faraday con $L=R$'],
    ['Espira rotante', R`$\varepsilon=NAB\omega\sin\omega t$`, 'Generador de CA'],
    ['Mutua / auto', R`$\varepsilon_2=-M\dfrac{dI_1}{dt},\ \ \varepsilon=-L\dfrac{dI}{dt}$`, '$L=N\\Phi/I$'],
    ['Solenoide', R`$L=\dfrac{\mu_0N^2A}{\ell}$`, 'Depende de la geometría'],
    ['Energía', R`$U=\tfrac12LI^2,\ \ u_B=\dfrac{B^2}{2\mu_0}$`, ''],
    ['RL', R`$i=\dfrac{\varepsilon}{R}\big(1-e^{-t/\tau}\big),\ \ \tau=\dfrac LR$`, 'Apertura: $i=I_0e^{-t/\\tau}$']
  ],
  tribunal: [
    { t: 'def', q: 'Ley de Faraday–Lenz: enunciado, origen del signo y ejemplos (espira fija y rotante, imán-bobina del TPL 8).',
      k: [R`$\varepsilon=-d\Phi_B/dt$ (bobina: $-N\,d\Phi_B/dt$)`, 'El flujo puede variar por $B$, por $A$ o por el ángulo', 'Lenz: la corriente inducida se opone a la causa (conservación de energía)', 'Sin ese signo: movimiento perpetuo', 'Espira rotante: $\\varepsilon=NAB\\omega\\sin\\omega t$ → CA'],
      err: 'Decir que la corriente inducida “se opone al campo” en vez de “se opone al cambio del flujo”.' },
    { t: 'ded', q: 'fem de movimiento: calculala para una varilla en traslación y para una varilla en rotación (disco de Faraday).',
      k: [R`Lorentz sobre portadores: $\vec F=q\vec v\times\vec B$ separa cargas`, R`$E=vB$ en equilibrio ⇒ $\varepsilon=BLv$`, R`Verificación con Faraday: $d\Phi/dt=B\,L\,v$`, R`Rotación: $v=\omega r$, integro: $\varepsilon=\tfrac12B\omega L^2$`, 'Disco de Faraday = generador homopolar (CC)'] },
    { t: 'def', q: 'Campos eléctricos inducidos y corrientes de Foucault.',
      k: [R`$\oint\vec E\cdot d\vec l=-d\Phi_B/dt\ne0$: campo NO conservativo`, 'Líneas cerradas; no se puede definir potencial', 'Foucault: remolinos de corriente en un metal macizo', 'Efectos: calentamiento (hornos de inducción), freno magnético', 'Se reducen laminando los núcleos'] },
    { t: 'ded', q: 'Autoinducción de un solenoide y energía almacenada en el campo magnético.',
      k: [R`$L=N\Phi/I$; para solenoide $L=\mu_0N^2A/\ell$`, R`Trabajo contra la fem inducida: $dW=LI\,dI\Rightarrow U=\tfrac12LI^2$`, R`Con $B=\mu_0nI$: $u_B=B^2/2\mu_0$`, 'Energía en el campo: análogo magnético de $u_E=\\tfrac12\\varepsilon_0E^2$', 'Mutua: $M_{12}=M_{21}$'] },
    { t: 'ded', q: 'Circuito RL: cierre y apertura. Constante de tiempo y gráficos. Compará con el RC.',
      k: [R`$\varepsilon-iR-L\,di/dt=0$`, R`$i=(\varepsilon/R)(1-e^{-t/\tau}),\ \tau=L/R$`, 'Apertura: decaimiento exponencial; si es brusca, fem enorme (chispa)', 'Inductor: abre-circuito en $t=0^+$ y cortocircuito en régimen', 'Análogo al RC con los roles de V e I intercambiados'] }
  ],
  cards: [
    ['Sentido de la corriente inducida (Lenz)', 'Crea un campo que se opone a la variación del flujo: si el flujo aumenta, B_inducido apunta contra B; si disminuye, a favor.'],
    ['Weber y henry', R`$1\,\mathrm{Wb}=1\,\mathrm{T\,m^2}$; $1\,\mathrm{H}=1\,\mathrm{V\,s/A}$.`],
    ['Flujo concatenado', R`$\Lambda=N\Phi_B$ (flujo total en una bobina de $N$ espiras).`],
    ['Transformador ideal', R`$V_2/V_1=N_2/N_1$ (CA); $I_1V_1=I_2V_2$.`],
    ['Comportamiento de un inductor en CC', 'En régimen permanente se comporta como un cortocircuito ($di/dt=0$).'],
    ['Corrientes de Foucault: ¿cómo reducirlas?', 'Laminando el núcleo o usando ferrita: se aumentan los caminos resistivos.'],
    ['Energía en un inductor de 2 H con 3 A', R`$U=\tfrac12\cdot2\cdot3^2=9\ \mathrm{J}$.`],
    ['Inductancia mutua de dos bobinas', R`$M=\dfrac{N_2\Phi_{21}}{I_1}$; $\varepsilon_2=-M\,dI_1/dt$.`]
  ],
  deduccion: { titulo: 'fem de movimiento de una varilla (con verificación por Faraday)', intro: 'Ordená los pasos.',
    pasos: [
      R`Varilla de largo $L$ se mueve con velocidad $\vec v\perp\vec B$ y $\perp$ a su eje`,
      R`Sobre cada portador actúa $\vec F=q\vec v\times\vec B$ a lo largo de la varilla: se separan las cargas`,
      R`Se forma un campo $E$ que equilibra: $qE=qvB\Rightarrow E=vB$`,
      R`La fem entre extremos es $\varepsilon=EL=BLv$`,
      R`Verificación con Faraday: el área barrida es $dA=Lv\,dt$ ⇒ $|d\Phi_B/dt|=BLv$ ✓`
    ] },
  vf: [
    ['Si el flujo magnético a través de una espira es muy grande, la fem inducida es grande.', false, 'Depende de la rapidez con que cambia, no del valor del flujo.'],
    ['El campo eléctrico inducido por un flujo variable es conservativo.', false, 'Su circulación no es cero: no existe potencial.'],
    ['La energía de un inductor está almacenada en su campo magnético.', true, 'Densidad $B^2/2\\mu_0$.'],
    ['En un circuito RL la corriente alcanza su valor final apenas se cierra la llave.', false, 'Crece exponencialmente con $\\tau=L/R$.']
  ],
  consejo: 'Para Lenz, usá un ejemplo físico concreto (imán acercándose a una espira) y decí “se opone al CAMBIO”.'
});

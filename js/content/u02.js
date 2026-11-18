F2.units.push({
  id: 2, rom: 'II', title: 'Potencial y energía del campo eléctrico', short: 'Potencial', book: 'Cap. 23', block: 'Electrostática',
  idea: 'Como $\\vec E$ es conservativo, todo el campo vectorial se resume en una función escalar: el potencial.',
  temas: ['Trabajo y diferencia de potencial', 'Potencial de distribuciones discretas y continuas', 'Superficies equipotenciales', 'Gradiente: derivada direccional y nabla', 'Cálculo de E a partir de V'],
  resumen: R`
El campo electrostático es **conservativo**: el trabajo no depende del camino, $\oint\vec E\cdot d\vec l=0$. Por eso existe una energía potencial por unidad de carga, el **potencial** $V$, definido salvo una constante: lo físico es $\Delta V=-\int\vec E\cdot d\vec l$.

Calcular $V$ es más cómodo que $\vec E$ porque se **suma como escalar**: puntuales, dipolo, anillo, línea, planos. Después el campo se recupera con el **gradiente**: $\vec E=-\nabla V$. $\nabla V$ apunta hacia donde $V$ crece más rápido; $\vec E$ al revés.

Las **superficies equipotenciales** son siempre perpendiculares a las líneas de campo y la superficie de un conductor en equilibrio es una de ellas. La energía de un sistema de cargas es el trabajo necesario para armarlo.`,
  formulas: [
    ['Diferencia de potencial', R`$V_b-V_a=-\int_a^b\vec E\cdot d\vec l=\dfrac{\Delta U}{q}$`, 'Independiente del camino'],
    ['Carga puntual', R`$V=\dfrac{kq}{r}$`, 'Referencia $V(\\infty)=0$'],
    ['Energía de dos cargas', R`$U=\dfrac{kq_1q_2}{r_{12}}$`, 'Sistema: $U=k\\sum_{i<j}q_iq_j/r_{ij}$'],
    ['Dipolo (lejos)', R`$V=\dfrac{kp\cos\theta}{r^2}$`, 'Cae como $1/r^2$'],
    ['Anillo (eje)', R`$V=\dfrac{kQ}{\sqrt{z^2+R^2}}$`, 'Todos los $dq$ a igual distancia'],
    ['Línea infinita', R`$V=-\dfrac{\lambda}{2\pi\varepsilon_0}\ln r+C$`, 'No se puede fijar $V(\\infty)=0$'],
    ['Plano infinito', R`$V=-\dfrac{\sigma}{2\varepsilon_0}|z|+C$`, 'Idem: referencia finita'],
    ['Gradiente', R`$\vec E=-\nabla V=-\Big(\dfrac{\partial V}{\partial x},\dfrac{\partial V}{\partial y},\dfrac{\partial V}{\partial z}\Big)$`, 'Componente: $E_s=-dV/ds$'],
    ['Placas paralelas', R`$V=Ed$`, 'Campo uniforme']
  ],
  tribunal: [
    { t: 'def', q: 'Distinguí campo eléctrico, fuerza, energía potencial y potencial eléctrico. ¿Por qué se puede definir un potencial?',
      k: [R`$\vec E=\vec F/q$ (por unidad de carga de prueba)`, R`$U$ es energía del sistema; $V=U/q$ por unidad de carga`, R`El campo es conservativo: $\oint\vec E\cdot d\vec l=0$`, R`$V$ queda definido salvo una constante; sólo $\Delta V$ tiene sentido físico`, R`Unidades: volt = J/C; electronvolt como unidad de energía`],
      err: 'Confundir “potencial” con “energía potencial”: difieren en el factor $q$.' },
    { t: 'ded', q: 'Calculá el potencial de un anillo cargado sobre su eje y, a partir de él, el campo. ¿Qué ventaja tiene este camino?',
      k: [R`$dV=k\,dq/\sqrt{z^2+R^2}$, igual distancia para todo $dq$`, R`$V=kQ/\sqrt{z^2+R^2}$ (integral trivial, escalar)`, R`$E_z=-dV/dz=kQz/(z^2+R^2)^{3/2}$`, 'Coincide con el cálculo vectorial directo', 'Sólo da la componente axial: el gradiente exige conocer V cerca del eje'],
      err: R`Derivar respecto de $z$ y decir que se obtiene todo el campo en cualquier punto (sólo vale sobre el eje por simetría).` },
    { t: 'def', q: 'Superficies equipotenciales: ¿qué relación tienen con las líneas de campo y por qué?',
      k: [R`$\vec E\perp$ equipotencial: si hubiera componente tangencial, $V$ cambiaría sobre la superficie`, R`$\vec E$ apunta hacia $V$ decreciente`, R`Mover una carga sobre una equipotencial no cuesta trabajo ($W=-q\Delta V=0$)`, 'Más juntas las equipotenciales ⇒ campo más intenso', 'Una superficie conductora en equilibrio es equipotencial'] },
    { t: 'ded', q: 'Gradiente y derivada direccional: ¿qué es el operador nabla y cómo se usa para obtener E?',
      k: [R`Derivada direccional $dV/ds=\nabla V\cdot\hat s$`, R`$\nabla V$ apunta en la dirección de máximo crecimiento y su módulo es esa tasa`, R`$\vec E=-\nabla V$, componente a componente`, R`Ej.: carga puntual, $V=kq/r\Rightarrow E=kq/r^2$ radial`, R`Si $V$ es constante en una región, $\vec E=0$ allí`] },
    { t: 'cruz', q: 'Para una línea de carga infinita no se puede tomar V(∞)=0. ¿Por qué, y qué hacés en su lugar?',
      k: [R`$V\propto-\ln r$ diverge en el infinito`, R`La carga se extiende hasta el infinito: la hipótesis “fuente localizada” falla`, R`Elegir una referencia finita $V(r_0)=0$`, R`Sólo importan diferencias: $\Delta V=\frac{\lambda}{2\pi\varepsilon_0}\ln(r_a/r_b)$`, 'Lo mismo ocurre con el plano infinito'] }
  ],
  cards: [
    ['Trabajo del campo al mover una carga de a hacia b', R`$W_{a\to b}=q(V_a-V_b)=-\Delta U$.`],
    ['¿Qué es un electronvolt?', R`Energía ganada por un electrón al atravesar 1 V: $1\,\mathrm{eV}=1{,}602\times10^{-19}\,$J.`],
    ['Potencial de una esfera conductora de radio R con carga Q', R`Dentro y en la superficie: $V=kQ/R$ (constante). Afuera: $kQ/r$.`],
    ['Rotor del campo electrostático', R`$\nabla\times\vec E=0$ ⇔ conservativo (para estática).`],
    ['Si V = 0 en un punto, ¿E = 0 ahí?', R`No. $E$ depende de la variación de $V$ (el gradiente), no de su valor.`],
    ['Potencial de un dipolo sobre su eje y sobre el plano medio', R`Eje: $\pm kp/r^2$. Plano medio (perpendicular): $V=0$.`],
    ['Energía de un sistema de 3 cargas', R`$U=k\left(\frac{q_1q_2}{r_{12}}+\frac{q_1q_3}{r_{13}}+\frac{q_2q_3}{r_{23}}\right)$, cada par una vez.`],
    ['¿Hacia dónde se mueve una carga positiva libre?', 'Hacia potencial decreciente; gana energía cinética a costa de energía potencial.']
  ],
  deduccion: { titulo: 'Del potencial del anillo al campo sobre su eje', intro: 'Ordená los pasos.',
    pasos: [
      R`Divido el anillo en elementos $dq$; todos están a distancia $\sqrt{z^2+R^2}$ del punto del eje`,
      R`Sumo escalarmente: $V=\int k\,dq/\sqrt{z^2+R^2}=kQ/\sqrt{z^2+R^2}$`,
      R`Por simetría, sobre el eje $\vec E$ sólo tiene componente axial: $E_z=-\partial V/\partial z$`,
      R`Derivo: $E_z=-kQ\,\dfrac{d}{dz}(z^2+R^2)^{-1/2}=kQ\,z\,(z^2+R^2)^{-3/2}$`,
      R`Verifico: $z\gg R\Rightarrow kQ/z^2$ (puntual) y $z=0\Rightarrow E=0$ (simetría)`
    ] },
  vf: [
    ['Si el potencial es cero en un punto, el campo eléctrico es cero en ese punto.', false, 'El campo depende de cómo varía V, no de su valor (ej.: plano medio de un dipolo).'],
    ['El campo eléctrico apunta siempre en el sentido en que el potencial disminuye más rápido.', true, 'Es $-\\nabla V$.'],
    ['El trabajo para mover una carga entre dos puntos de una equipotencial es nulo, cualquiera sea el camino.', true, 'Porque $\\Delta V=0$.'],
    ['Dentro de un conductor en equilibrio el potencial es cero.', false, 'Es constante (el campo es cero), pero no necesariamente cero.']
  ],
  consejo: 'Cuando el tribunal pregunte “¿por qué E=−∇V?”, respondé desde el trabajo: dV = −E·dl.'
});

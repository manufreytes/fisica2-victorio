F2.units.push({
  id: 12, rom: 'XII', title: 'Óptica geométrica y óptica física', short: 'Óptica', book: 'Cap. 33–36', block: 'Óptica',
  idea: 'Dos modelos de la luz: rayos (cuando λ es chica frente al objeto) y ondas (cuando no lo es).',
  temas: ['Reflexión, refracción, Snell, RIT, dispersión', 'Superficies planas y esféricas', 'Lentes delgadas', 'Interferencia: Young, películas, cuñas, Newton, Michelson', 'Difracción: rendija, red', 'Polarización'],
  resumen: R`
En **óptica geométrica** la luz viaja en rayos. En una interfaz valen la reflexión ($\theta_i=\theta_r$) y la **ley de Snell** $n_1\sin\theta_1=n_2\sin\theta_2$. Al cambiar de medio se conserva la frecuencia y cambia $\lambda=\lambda_0/n$. Si $n_1>n_2$ hay **reflexión interna total** más allá del ángulo crítico. Con espejos y **lentes delgadas** ($1/s+1/s'=1/f$) se forman imágenes; el signo del aumento $m=-s'/s$ dice si es derecha o invertida.

En **óptica física** aparece la naturaleza ondulatoria: la **interferencia** (Young, películas delgadas, anillos de Newton, Michelson) y la **difracción** (rendija simple, red) dependen de diferencias de camino y de la coherencia. En Young la envolvente de difracción modula las franjas de interferencia.

La **polarización** muestra que la luz es transversal: ley de Malus $I=I_0\cos^2\theta$, ángulo de Brewster, fotoelasticidad.`,
  formulas: [
    ['Snell', R`$n_1\sin\theta_1=n_2\sin\theta_2,\ \ n=c/v$`, 'Crítico: $\\sin\\theta_c=n_2/n_1$'],
    ['Espejo esférico', R`$\dfrac1s+\dfrac1{s'}=\dfrac2R=\dfrac1f$`, ''],
    ['Superficie esférica', R`$\dfrac{n_1}{s}+\dfrac{n_2}{s'}=\dfrac{n_2-n_1}{R}$`, 'Refracción'],
    ['Lente delgada', R`$\dfrac1s+\dfrac1{s'}=\dfrac1f=(n-1)\Big(\dfrac1{R_1}-\dfrac1{R_2}\Big)$`, '$m=-s\'/s$'],
    ['Young', R`$d\sin\theta=m\lambda,\ \ y_m\approx\dfrac{m\lambda L}{d},\ \ I\propto\cos^2\!\dfrac{\pi d\sin\theta}{\lambda}$`, 'Máximos'],
    ['Película delgada', R`$2nt=\big(m+\tfrac12\big)\lambda_0$ (máx. si hay un solo cambio de fase π)`, 'Antirreflejante: $t=\\lambda/4n$'],
    ['Anillos de Newton', R`$r_m=\sqrt{m\lambda R}$ (oscuros, reflexión)`, 'Centro oscuro'],
    ['Difracción simple', R`$a\sin\theta=m\lambda\ (m\ne0)$ mínimos, $I=I_0\Big(\dfrac{\sin\beta}{\beta}\Big)^2$`, '$\\beta=\\pi a\\sin\\theta/\\lambda$'],
    ['Red', R`$d\sin\theta=m\lambda,\ \ \mathcal R=mN$`, 'Poder de resolución'],
    ['Malus / Brewster', R`$I=I_0\cos^2\theta,\ \ \tan\theta_B=n_2/n_1$`, 'Natural: $I_0/2$']
  ],
  tribunal: [
    { t: 'def', q: 'Reflexión, refracción, ley de Snell, reflexión interna total y dispersión. Relacioná con el TPL 10.',
      k: [R`$\theta_i=\theta_r$; $n_1\sin\theta_1=n_2\sin\theta_2$`, R`$f$ se conserva; $v=c/n$, $\lambda=\lambda_0/n$`, R`RIT: $n_1>n_2$ y $\theta>\theta_c$, $\sin\theta_c=n_2/n_1$`, 'Fibra óptica, prismas', 'Dispersión: $n(\\lambda)$ ⇒ arcoíris'] },
    { t: 'ded', q: 'Lentes delgadas: ecuación del fabricante, lentes convergentes y divergentes, métodos gráficos y aumento.',
      k: ['Tres rayos principales: paralelo al eje, por el centro, por el foco', R`$\frac1s+\frac1{s'}=\frac1f=(n-1)(\frac1{R_1}-\frac1{R_2})$`, 'Convergente $f>0$; divergente $f<0$', R`$m=-s'/s$`, 'Convergente: $s>f$ imagen real e invertida; $s<f$ virtual y derecha'],
      err: 'Mezclar convenciones de signos: declará la convención al empezar.' },
    { t: 'ded', q: 'Experiencia de Young: posición de las franjas e intensidad. ¿Cómo se usa en el TPL 11 para medir λ?',
      k: ['Dos fuentes coherentes (misma onda incidente)', R`Diferencia de camino $d\sin\theta$`, R`Máximos $d\sin\theta=m\lambda$; mínimos $(m+\tfrac12)\lambda$`, R`$y_m\approx m\lambda L/d$; espaciado $\lambda L/d$ uniforme`, R`Intensidad $\propto\cos^2(\pi d\sin\theta/\lambda)$; medir $y$, $L$, $d$ ⇒ $\lambda$`] },
    { t: 'def', q: 'Interferencia en películas delgadas, cuñas, anillos de Newton e interferómetro de Michelson.',
      k: ['Reflexión en dos interfaces: caminos distintos', 'Cambio de fase de $\\pi$ al reflejarse en un medio de mayor $n$', R`Condición con $2nt$; antirreflejante $t=\lambda/4n$`, 'Cuña: franjas rectas equiespaciadas; Newton: anillos, centro oscuro', 'Michelson: desplazar un espejo $\\lambda/2$ corre una franja'] },
    { t: 'ded', q: 'Difracción: rendija simple y red de difracción. ¿Cómo se superponen interferencia y difracción?',
      k: ['Huygens–Fresnel: cada punto es fuente de ondículas', R`Mínimos: $a\sin\theta=m\lambda$; máximo central doble de ancho`, R`$I=I_0(\sin\beta/\beta)^2$`, 'Varias rendijas: envolvente de difracción × interferencia', 'Red: máximos agudos $d\\sin\\theta=m\\lambda$; poder de resolución $mN$'] },
    { t: 'def', q: 'Polarización: ¿qué demuestra sobre la naturaleza de la luz y cómo se obtiene y analiza?',
      k: ['Sólo las ondas transversales se polarizan', 'Polarizador y analizador: $I=I_0\\cos^2\\theta$ (Malus)', 'Luz natural → $I_0/2$ tras un polarizador ideal', 'Medios: dicroísmo, reflexión (Brewster), birrefringencia, dispersión', 'Fotoelasticidad: tensiones inducen birrefringencia'] }
  ],
  cards: [
    ['¿Qué cambia y qué se conserva al refractarse?', R`Se conserva la frecuencia. Cambian $v$ y $\lambda$ (ambas $\propto1/n$).`],
    ['Ángulo crítico del agua al aire', R`$\theta_c=\arcsin(1/1{,}33)\approx48{,}8^\circ$.`],
    ['Distancia focal de un espejo esférico', R`$f=R/2$.`],
    ['Convención sobre imagen real y virtual', 'Real: rayos convergen (se puede proyectar). Virtual: prolongaciones de rayos divergentes.'],
    ['Condición de coherencia', 'Misma frecuencia y diferencia de fase constante en el tiempo.'],
    ['Poder de resolución de una red', R`$\mathcal R=\lambda/\Delta\lambda=mN$.`],
    ['Ángulo de Brewster', R`$\tan\theta_B=n_2/n_1$: la luz reflejada queda totalmente polarizada.`],
    ['Criterio de Rayleigh', R`Dos fuentes se resuelven si $\theta_{min}\approx1{,}22\,\lambda/D$ (abertura circular).`]
  ],
  deduccion: { titulo: 'Posición de los máximos de Young', intro: 'Ordená los pasos.',
    pasos: [
      R`Dos rendijas separadas $d$; pantalla a distancia $L\gg d$`,
      R`Los rayos hacia un punto $P$ son casi paralelos: diferencia de camino $\Delta=d\sin\theta$`,
      R`Interferencia constructiva si $\Delta=m\lambda$, con $m=0,\pm1,\pm2,\dots$`,
      R`Para ángulos pequeños, $\sin\theta\approx\tan\theta=y/L$`,
      R`Posición: $y_m=\dfrac{m\lambda L}{d}$; separación entre franjas: $\Delta y=\dfrac{\lambda L}{d}$`
    ] },
  vf: [
    ['Al pasar del aire al vidrio, la frecuencia de la luz disminuye.', false, 'La frecuencia se conserva; cambian $v$ y $\\lambda$.'],
    ['Puede haber reflexión interna total al pasar de un medio de menor a mayor índice.', false, 'Requiere $n_1>n_2$.'],
    ['En una experiencia de Young con rendijas de ancho finito, la difracción modula la intensidad de las franjas.', true, 'La envolvente es la figura de difracción de una rendija.'],
    ['Un polarizador ideal reduce a la mitad la intensidad de luz natural.', true, '$I=I_0/2$.']
  ],
  consejo: 'Para la parte de ondas, siempre decí “diferencia de camino” antes de la fórmula: ordena el razonamiento.'
});

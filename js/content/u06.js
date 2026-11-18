F2.units.push({
  id: 6, rom: 'VI', title: 'El campo magnético', short: 'Campo magnético', book: 'Cap. 28', block: 'Magnetismo',
  idea: 'Las corrientes (cargas en movimiento) crean B. Biot–Savart suma; Ampère aprovecha la simetría.',
  temas: ['Carga en movimiento y elemento de corriente', 'Conductor recto, espira, bobina', 'Solenoide largo y corto', 'Ley de Ampère: conductor, solenoide, toroide'],
  resumen: R`
Una carga en movimiento (o un elemento de corriente) crea un campo magnético dado por **Biot–Savart**: $d\vec B=\frac{\mu_0}{4\pi}\frac{I\,d\vec l\times\hat r}{r^2}$. A diferencia de Coulomb, interviene un **producto vectorial**: $\vec B$ es perpendicular a $d\vec l$ y a $\hat r$ (regla de la mano derecha).

Las líneas de $\vec B$ son **cerradas**: no hay monopolos magnéticos, $\oint\vec B\cdot d\vec A=0$. Con Biot–Savart se calculan el hilo, la espira (eje), la bobina y el solenoide corto.

La **ley de Ampère** $\oint\vec B\cdot d\vec l=\mu_0I_{enc}$ cumple, para el magnetismo, el papel de Gauss: con simetría resuelve conductor cilíndrico, solenoide largo y toroide en pocas líneas. (Más adelante Maxwell le agregará un término.)`,
  formulas: [
    ['Biot–Savart', R`$d\vec B=\dfrac{\mu_0}{4\pi}\dfrac{I\,d\vec l\times\hat r}{r^2}$`, '$\\mu_0=4\\pi\\times10^{-7}\\ \\mathrm{T\\,m/A}$'],
    ['Carga en movimiento', R`$\vec B=\dfrac{\mu_0}{4\pi}\dfrac{q\vec v\times\hat r}{r^2}$`, 'Para $v\\ll c$'],
    ['Hilo infinito', R`$B=\dfrac{\mu_0I}{2\pi r}$`, 'Líneas: círculos concéntricos'],
    ['Espira (centro)', R`$B=\dfrac{\mu_0I}{2R}$`, ''],
    ['Espira (eje)', R`$B=\dfrac{\mu_0IR^2}{2(z^2+R^2)^{3/2}}$`, 'Lejos: dipolo $m=IA$'],
    ['Solenoide largo', R`$B=\mu_0nI$`, '$n=N/\\ell$; ≈0 afuera'],
    ['Solenoide corto (eje)', R`$B=\dfrac{\mu_0nI}{2}(\cos\alpha_1+\cos\alpha_2)$`, 'Ángulos a los extremos'],
    ['Toroide', R`$B=\dfrac{\mu_0NI}{2\pi r}$`, 'Sólo dentro'],
    ['Ampère / Gauss magnético', R`$\oint\vec B\cdot d\vec l=\mu_0I_{enc}\ ;\ \oint\vec B\cdot d\vec A=0$`, '']
  ],
  tribunal: [
    { t: 'def', q: 'Enunciá la ley de Biot–Savart y el campo de una carga en movimiento. ¿En qué se parece y en qué se diferencia de Coulomb?',
      k: [R`$d\vec B\propto I\,d\vec l\times\hat r/r^2$: dirección ⟂ a $d\vec l$ y a $\hat r$`, 'Regla de la mano derecha', 'Superposición: se integra sobre la corriente', 'Como Coulomb: decae con $1/r^2$; diferente: producto vectorial, no hay “carga magnética”', R`$\mu_0$ y relación $\mu_0\varepsilon_0=1/c^2$`] },
    { t: 'ded', q: 'Calculá el campo magnético en el eje de una espira circular.',
      k: [R`$d\vec B$ ⟂ a $\vec r$ y a $d\vec l$; componentes ⟂ al eje se cancelan por simetría`, R`$B_z=\int dB\,\sin\phi$ con $\sin\phi=R/\sqrt{z^2+R^2}$`, R`$B=\dfrac{\mu_0IR^2}{2(z^2+R^2)^{3/2}}$`, R`Centro ($z=0$): $\mu_0I/2R$`, R`$z\gg R$: $B\approx\dfrac{\mu_0 m}{2\pi z^3}$ con $m=IA$ (dipolo)`] },
    { t: 'ded', q: 'Ley de Ampère: obtené el campo de un solenoide largo y de un toroide.',
      k: ['Enunciado y condiciones: válida siempre, útil con simetría', 'Solenoide: rectángulo con un lado dentro y otro fuera', R`$BL=\mu_0nLI\Rightarrow B=\mu_0nI$ (uniforme), afuera ≈ 0`, R`Toroide: circunferencia de radio $r$: $B\,2\pi r=\mu_0NI$`, 'En el toroide B decrece con r (no uniforme)'],
      err: 'Decir que el campo del solenoide depende del radio del solenoide.' },
    { t: 'def', q: '¿Por qué ∮B·dA = 0? Compará las líneas de B con las de E.',
      k: ['No existen monopolos magnéticos aislados', 'Líneas cerradas: todo el flujo que entra, sale', R`Forma diferencial: $\nabla\cdot\vec B=0`+'$', 'Contraste: líneas de E nacen en cargas', 'Flujo en weber; 1 T = 1 Wb/m²'] },
    { t: 'apl', q: 'Campo magnético dentro y fuera de un conductor cilíndrico recto de radio a que lleva corriente uniforme I.',
      k: [R`Ampère con círculo de radio $r$`, R`$r<a$: $I_{enc}=I\,r^2/a^2\Rightarrow B=\dfrac{\mu_0Ir}{2\pi a^2}$ (lineal)`, R`$r>a$: $B=\dfrac{\mu_0I}{2\pi r}$`, 'Máximo en la superficie, continuidad en $r=a$', 'Gráfico B(r)'] }
  ],
  cards: [
    ['Regla de la mano derecha para un hilo', 'Pulgar en el sentido de $I$, los dedos enroscan en el sentido de $\\vec B$.'],
    ['Unidad de B', R`Tesla $=\mathrm{N/(A\,m)}$; $1\,\mathrm{T}=10^4$ gauss.`],
    ['Momento magnético de una espira', R`$\vec m=NI\vec A$, perpendicular al plano (regla de la mano derecha).`],
    ['¿Cuándo usar Biot–Savart y cuándo Ampère?', 'Ampère sólo con simetría; Biot–Savart siempre (se integra), aunque más trabajoso.'],
    ['Campo fuera de un toroide ideal', 'Cero (Ampère: $I_{enc}=0$ para circunferencias fuera).'],
    ['Campo en el centro de un solenoide largo vs en un extremo', R`Centro: $\mu_0nI$. Extremo: aproximadamente la mitad.`],
    ['¿Cuál es el valor de μ₀?', R`$4\pi\times10^{-7}\ \mathrm{T\,m/A}$ (aprox., en el SI actual).`],
    ['Principio del TPL 9 (galvanómetro de tangentes)', R`En el centro de la bobina $B_{bobina}=\mu_0NI/2R$; comparado con el terrestre $B_h$: $\tan\theta=B_{bobina}/B_h$.`]
  ],
  deduccion: { titulo: 'Campo del solenoide ideal con la ley de Ampère', intro: 'Ordená los pasos.',
    pasos: [
      R`Simetría: $\vec B$ axial, uniforme en el interior y despreciable afuera (solenoide largo)`,
      R`Elijo un rectángulo de Ampère: un lado de largo $L$ dentro del solenoide, paralelo al eje, y el opuesto afuera`,
      R`Los lados perpendiculares al eje y el lado exterior no contribuyen a la circulación`,
      R`Circulación: $\oint\vec B\cdot d\vec l=BL$`,
      R`Corriente encerrada: $I_{enc}=nLI$`,
      R`Ampère: $BL=\mu_0nLI\ \Rightarrow\ B=\mu_0nI$`
    ] },
  vf: [
    ['El campo de un solenoide ideal largo, en su interior, depende del radio del solenoide.', false, 'Sólo depende de $n$ e $I$; es uniforme.'],
    ['Las líneas de campo magnético pueden empezar o terminar en cargas magnéticas.', false, 'No hay monopolos: son cerradas.'],
    ['La ley de Ampère permite calcular el campo magnético de cualquier distribución de corriente.', false, 'Es válida siempre, pero sólo permite despejar $B$ cuando hay simetría suficiente.'],
    ['En el centro de una espira circular de radio R el campo es μ₀I/2R.', true, 'Todos los elementos contribuyen en la misma dirección.']
  ],
  consejo: 'Dibujá el vector B y la regla de la mano derecha antes de calcular: los profes miran el dibujo.'
});

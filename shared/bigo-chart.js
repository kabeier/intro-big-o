// Big-O chart: the curriculum's Big-O-Chart.png (bigocheatsheet.com style), redrawn as SVG,
// with a slider for n and a table of how many operations each complexity needs at that n.
//   BigOChart(element, { slider: true, table: true, n: 10 })
(() => {
  const X = 50, Y = 600                  // chart window: n from 0 to 50, operations from 0 to 600
  const W = 760, H = 440, L = 70, T = 16, R = 20, B = 46
  const px = (x) => L + (x / X) * (W - L - R)
  const py = (y) => T + (1 - Math.min(y, Y * 1.02) / Y) * (H - T - B)
  const log2 = (n) => (n <= 1 ? 0 : Math.log2(n))

  // log10 of n! (Stirling for big n), so huge values can be shown as powers of ten
  const log10Fact = (n) => {
    if (n < 2) return 0
    if (n <= 170) { let s = 0; for (let k = 2; k <= n; k++) s += Math.log10(k); return s }
    return (n * Math.log(n) - n + 0.5 * Math.log(2 * Math.PI * n)) / Math.LN10
  }
  // Gamma(x + 1) = x! for any x >= 0 (Lanczos), so the n! curve is smooth between whole numbers
  const G = [676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61503916999185, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7]
  const gamma = (z) => { if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z)); z -= 1; let x = 0.99999999999980993; G.forEach((g, i) => { x += g / (z + i + 1) }); const t = z + G.length - 0.5; return Math.sqrt(2 * Math.PI) * t ** (z + 0.5) * Math.exp(-t) * x }
  const CLASSES = [
    { id: 'n!', label: 'O(n!)', band: 'horrible', f: (n) => (Number.isInteger(n) ? Math.exp(log10Fact(n) * Math.LN10) : gamma(n + 1)), log10: log10Fact, ex: 'every ordering of the list' },
    { id: '2^n', label: 'O(2ⁿ)', band: 'horrible', f: (n) => 2 ** n, log10: (n) => n * Math.log10(2), ex: 'recursive Fibonacci' },
    { id: 'n^2', label: 'O(n²)', band: 'horrible', f: (n) => n * n, ex: 'a loop inside a loop' },
    { id: 'nlogn', label: 'O(n log n)', band: 'bad', f: (n) => n * log2(n), ex: 'good sorting: sorted()' },
    { id: 'n', label: 'O(n)', band: 'fair', f: (n) => n, ex: 'one loop: linear search' },
    { id: 'logn', label: 'O(log n)', band: 'excellent', f: (n) => log2(n), ex: 'halving: binary search' },
    { id: '1', label: 'O(1)', band: 'excellent', f: () => 1, ex: 'items[0], a dict lookup' },
  ]
  const BANDS = [
    ['horrible', 'Horrible', '#e88a8a', null],
    ['bad', 'Bad', '#f2c45e', (x) => 12 * x],
    ['fair', 'Fair', '#f0e54a', (x) => 1.6 * x],
    ['good', 'Good', '#c5df55', (x) => 0.75 * x],
    ['excellent', 'Excellent', '#5cc469', (x) => 2.2 * Math.log2(x + 1) + 4],
  ]
  const COLOR = Object.fromEntries(BANDS.map(([id, , c]) => [id, c]))

  // 1,234,567 for normal numbers; "about 10^158" (with a superscript) for huge ones
  function fmt(c, n) {
    const lg = c.log10 ? c.log10(n) : Math.log10(Math.max(c.f(n), 1))
    if (lg > 15) return `about 10<sup>${Math.floor(lg).toLocaleString('en-US')}</sup>`
    const v = c.f(n)
    if (c.id === 'logn' || c.id === 'nlogn') return (Number.isInteger(v) ? '' : '≈ ') + Math.round(v).toLocaleString('en-US')
    return Math.round(v).toLocaleString('en-US')
  }

  function curve(c) {
    let d = ''
    for (let i = 0; i <= 400; i++) {
      const x = (i / 400) * X
      const y = c.f(x)
      d += (i ? 'L' : 'M') + px(x).toFixed(1) + ' ' + py(y).toFixed(1)
      if (y > Y) break
    }
    return d
  }
  function band(lower, upper) {
    const pts = []
    for (let i = 0; i <= 200; i++) { const x = (i / 200) * X; pts.push([px(x), py(upper ? Math.min(upper(x), Y) : Y)]) }
    for (let i = 200; i >= 0; i--) { const x = (i / 200) * X; pts.push([px(x), py(lower ? Math.min(lower(x), Y) : 0)]) }
    return 'M' + pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join('L') + 'Z'
  }
  // Where each label sits: at the right edge, or where the curve leaves the top
  function labelAt(c) {
    if (c.f(X) <= Y) return [px(X) - 6, py(c.f(X)) - 8, 'end']
    let lo = 0, hi = X
    for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; if (c.f(m) > Y) hi = m; else lo = m }
    return c.id === 'n!' ? [px(lo) - 5, py(Y) + 20, 'end'] : [px(lo) + 5, py(Y) + 20, 'start']
  }

  function svg() {
    const bands = BANDS.map(([id, , color, upper], k) => `<path d="${band(BANDS[k + 1] && BANDS[k + 1][3], upper)}" fill="${color}"/>`).join('')
    const labels = CLASSES.map((c) => {
      if (c.id === '1') return ''
      const [x, y, a] = labelAt(c)
      return `<text x="${x}" y="${y}" text-anchor="${a}" class="bo-lbl">${c.id === 'logn' ? 'O(log n), O(1)' : c.label}</text>`
    }).join('')
    return `<svg viewBox="0 0 ${W} ${H}" class="bo-svg" role="img" aria-label="Big-O complexity chart. Operations go up as the number of elements grows. O(1) and O(log n) stay flat at the bottom, in the green Excellent band. O(n) is a gentle straight line in the yellow Fair band. O(n log n) bends upward through the orange Bad band. O(n squared), O(2 to the n) and O(n factorial) shoot almost straight up in the red Horrible band.">
      <defs><clipPath id="bo-clip"><rect x="${L}" y="${T}" width="${W - L - R}" height="${py(0) - T}"/></clipPath></defs>
      ${bands}
      <g clip-path="url(#bo-clip)">${CLASSES.map((c) => `<path d="${curve(c)}" class="bo-curve" data-c="${c.id}"/>`).join('')}</g>
      ${labels}
      <line x1="${L}" y1="${py(0)}" x2="${px(X)}" y2="${py(0)}" class="bo-axis"/><line x1="${L}" y1="${py(0)}" x2="${L}" y2="${T}" class="bo-axis"/>
      <text x="${(L + px(X)) / 2}" y="${H - 10}" text-anchor="middle" class="bo-ax">Elements (n)</text>
      <text transform="translate(22 ${(T + py(0)) / 2}) rotate(-90)" text-anchor="middle" class="bo-ax">Operations</text>
      <g class="bo-cursor"><line class="bo-nline"/><text class="bo-ntext" text-anchor="middle"></text></g>
    </svg>`
  }

  window.BigOChart = (el, opts = {}) => {
    const legend = BANDS.slice().map(([id, name, color]) => `<span style="background:${color}">${name}</span>`).join('')
    el.innerHTML = `<div class="bo">
      <div class="bo-chart"><div class="bo-legend">${legend}</div>${svg()}
        ${opts.slider === false ? '' : `<label class="bo-slider">n = <b class="bo-nval"></b><input type="range" min="1" max="${X}" value="${Math.min(opts.n || 10, X)}" aria-label="Number of elements, n"></label>`}
      </div>
      ${opts.table === false ? '' : `<div class="bo-side">
        <label class="bo-type">Or type any n: <input type="number" min="1" max="10000000" value="${opts.n || 10}" aria-label="Type a number of elements"></label>
        <table class="bo-table"><thead><tr><th>Big-O</th><th>Operations at n = <span class="bo-nhead"></span></th></tr></thead><tbody>
        ${CLASSES.slice().reverse().map((c) => `<tr data-c="${c.id}"><td><i style="background:${COLOR[c.band]}"></i>${c.label}<small>${c.ex}</small></td><td class="bo-v"></td></tr>`).join('')}
        </tbody></table></div>`}
    </div>`
    const range = el.querySelector('.bo-slider input'), typed = el.querySelector('.bo-type input')
    const line = el.querySelector('.bo-nline'), ntext = el.querySelector('.bo-ntext')
    function show(n, fromSlider) {
      n = Math.max(1, Math.min(10000000, Math.round(Number(n) || 1)))
      if (el.querySelector('.bo-nval')) el.querySelector('.bo-nval').textContent = n.toLocaleString('en-US')
      if (el.querySelector('.bo-nhead')) el.querySelector('.bo-nhead').textContent = n.toLocaleString('en-US')
      if (typed && fromSlider) typed.value = n
      if (range && !fromSlider) range.value = Math.min(n, X)
      const onChart = n <= X
      if (!line.isConnected) return CLASSES.forEach((c) => { const td = el.querySelector(`tr[data-c="${c.id}"] .bo-v`); if (td) td.innerHTML = fmt(c, n) })
      line.setAttribute('x1', px(Math.min(n, X))); line.setAttribute('x2', px(Math.min(n, X)))
      line.setAttribute('y1', py(0)); line.setAttribute('y2', T)
      ntext.setAttribute('x', px(Math.min(n, X))); ntext.setAttribute('y', T + 12)
      ntext.textContent = onChart ? '' : `n = ${n.toLocaleString('en-US')} is off the chart →`
      ntext.setAttribute('text-anchor', onChart ? 'middle' : 'end')
      CLASSES.forEach((c) => { const td = el.querySelector(`tr[data-c="${c.id}"] .bo-v`); if (td) td.innerHTML = fmt(c, n) })
    }
    if (opts.slider === false && opts.table === false) el.querySelector('.bo-cursor').remove()
    if (range) range.oninput = () => show(range.value, true)
    if (typed) typed.oninput = () => show(typed.value, false)
    show(opts.n || 10, true)
    return { show }
  }
  window.BigOChart.CLASSES = CLASSES
  window.BigOChart.fmt = fmt
})()

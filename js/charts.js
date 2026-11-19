/* ============================================================
 * 格智·电网投标助手 — SVG 图表组件（零依赖）
 * ============================================================ */

const C_PRIMARY = '#1A4D3A', C_GOLD = '#C49A58', C_DANGER = '#F5222D',
      C_WARN = '#FAAD14', C_SUCCESS = '#52C41A', C_TEXT3 = '#999',
      C_LINE = '#EFEAE2', C_BLUE = '#2563EB';

/* ---------- 折线图：中标率趋势 ---------- */
function lineChart(data, opts) {
  opts = opts || {};
  const W = 680, H = 240, PL = 40, PR = 14, PT = 18, PB = 30;
  const iw = W - PL - PR, ih = H - PT - PB;
  const n = data.length;
  const minV = Math.min.apply(null, data.map(d => d.rate)) - 0.05;
  const maxV = Math.max.apply(null, data.map(d => d.rate)) + 0.05;
  const x = i => PL + (n === 1 ? iw / 2 : (i * iw) / (n - 1));
  const y = v => PT + ih - ((v - minV) / (maxV - minV)) * ih;
  let g = '';
  /* 网格与Y轴 */
  for (let i = 0; i <= 4; i++) {
    const v = minV + ((maxV - minV) * i) / 4;
    const yy = y(v);
    g += `<line x1="${PL}" y1="${yy}" x2="${W-PR}" y2="${yy}" stroke="${C_LINE}" stroke-width="1"/>`;
    g += `<text x="${PL-6}" y="${yy+4}" font-size="10" fill="${C_TEXT3}" text-anchor="end">${Math.round(v*100)}%</text>`;
  }
  /* 面积 */
  let area = `M ${x(0)} ${y(data[0].rate)}`;
  data.forEach((d, i) => { if (i > 0) area += ` L ${x(i)} ${y(d.rate)}`; });
  area += ` L ${x(n-1)} ${PT+ih} L ${x(0)} ${PT+ih} Z`;
  g += `<defs><linearGradient id="lgArea" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="${C_PRIMARY}" stop-opacity="0.22"/>
    <stop offset="100%" stop-color="${C_PRIMARY}" stop-opacity="0.02"/></linearGradient></defs>`;
  g += `<path d="${area}" fill="url(#lgArea)"/>`;
  /* 折线 */
  let line = `M ${x(0)} ${y(data[0].rate)}`;
  data.forEach((d, i) => { if (i > 0) line += ` L ${x(i)} ${y(d.rate)}`; });
  g += `<path d="${line}" fill="none" stroke="${C_PRIMARY}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
  /* 数据点与标签 */
  data.forEach((d, i) => {
    g += `<circle cx="${x(i)}" cy="${y(d.rate)}" r="3.5" fill="#fff" stroke="${C_PRIMARY}" stroke-width="2"/>`;
    g += `<text x="${x(i)}" y="${y(d.rate)-9}" font-size="10" font-weight="700" fill="${C_PRIMARY}" text-anchor="middle">${Math.round(d.rate*100)}%</text>`;
    g += `<text x="${x(i)}" y="${H-10}" font-size="10" fill="${C_TEXT3}" text-anchor="middle">${d.month.replace('20', '').replace('-', ' ')}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img">${g}</svg>`;
}

/* ---------- 漏斗图：商机→报名→投标→中标 ---------- */
function funnelChart(data) {
  const W = 680, H = 250, top = 14, gap = 8;
  const n = data.length;
  const maxV = data[0].value;
  const rowH = (H - top * 2 - gap * (n - 1)) / n;
  const colors = [C_GOLD, '#3E8F6B', C_PRIMARY, C_DANGER];
  let g = '';
  data.forEach((d, i) => {
    const wRatio = Math.pow(d.value / maxV, 0.62); /* 视觉压缩，保证层级可见 */
    const w = 300 + wRatio * 300;
    const cx = W / 2 - 60;
    const yy = top + i * (rowH + gap);
    const next = data[i + 1];
    const nextW = next ? 300 + Math.pow(next.value / maxV, 0.62) * 300 : w * 0.82;
    const pts = [
      [cx - w / 2, yy], [cx + w / 2, yy],
      [cx + nextW / 2, yy + rowH], [cx - nextW / 2, yy + rowH]
    ];
    g += `<polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="${colors[i]}" opacity="${1 - i * 0.12}"/>`;
    g += `<text x="${cx}" y="${yy + rowH/2 - 2}" font-size="13" font-weight="700" fill="#fff" text-anchor="middle">${d.stage}</text>`;
    g += `<text x="${cx}" y="${yy + rowH/2 + 14}" font-size="11.5" fill="rgba(255,255,255,.85)" text-anchor="middle">${d.value} 个</text>`;
    /* 转化率 */
    if (next) {
      const pct = Math.round((next.value / d.value) * 100);
      g += `<text x="${W - 26}" y="${yy + rowH + gap/2 + 4}" font-size="11" font-weight="700" fill="${C_PRIMARY}" text-anchor="end">→ ${pct}%</text>`;
    }
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img">${g}</svg>`;
}

/* ---------- 环形图：分布占比 ---------- */
function donutChart(data, unit) {
  unit = unit || '个';
  const W = 680, H = 240, cx = 130, cy = 120, r = 82, ir = 54;
  const total = data.reduce((s, d) => s + d.value, 0);
  const colors = [C_PRIMARY, C_GOLD, '#3E8F6B', '#7BAFC4', C_WARN, '#B08968'];
  let angle = -Math.PI / 2;
  let g = '';
  data.forEach((d, i) => {
    const a2 = angle + (d.value / total) * Math.PI * 2;
    const large = (a2 - angle) > Math.PI ? 1 : 0;
    const x1 = cx + r * Math.cos(angle), y1 = cy + r * Math.sin(angle);
    const x2 = cx + r * Math.cos(a2), y2 = cy + r * Math.sin(a2);
    const xi1 = cx + ir * Math.cos(a2), yi1 = cy + ir * Math.sin(a2);
    const xi2 = cx + ir * Math.cos(angle), yi2 = cy + ir * Math.sin(angle);
    g += `<path d="M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi1} ${yi1} A ${ir} ${ir} 0 ${large} 0 ${xi2} ${yi2} Z" fill="${colors[i % colors.length]}"/>`;
    angle = a2;
  });
  g += `<text x="${cx}" y="${cy-2}" font-size="22" font-weight="800" fill="${C_PRIMARY}" text-anchor="middle">${total}</text>`;
  g += `<text x="${cx}" y="${cy+16}" font-size="10.5" fill="${C_TEXT3}" text-anchor="middle">总计(${unit})</text>`;
  /* 图例 */
  const lx = 260;
  data.forEach((d, i) => {
    const yy = 40 + i * 26;
    g += `<rect x="${lx}" y="${yy-9}" width="10" height="10" rx="2.5" fill="${colors[i % colors.length]}"/>`;
    g += `<text x="${lx+16}" y="${yy}" font-size="12" fill="#333">${d.name}</text>`;
    g += `<text x="${W-24}" y="${yy}" font-size="12" font-weight="700" fill="${C_PRIMARY}" text-anchor="end">${d.value}${unit} · ${Math.round(d.value/total*100)}%</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img">${g}</svg>`;
}

/* ---------- 横向条形图：丢标原因 ---------- */
function hBarChart(data) {
  const W = 680, rowH = 34, H = data.length * rowH + 14;
  const lx = 110, barMax = W - lx - 130;
  const max = Math.max.apply(null, data.map(d => d.count));
  let g = '';
  data.forEach((d, i) => {
    const yy = 8 + i * rowH;
    const w = (d.count / max) * barMax;
    g += `<text x="${lx-8}" y="${yy+15}" font-size="12" fill="#333" text-anchor="end">${d.reason}</text>`;
    g += `<rect x="${lx}" y="${yy}" width="${barMax}" height="20" rx="5" fill="#F0EDE6"/>`;
    g += `<rect x="${lx}" y="${yy}" width="${Math.max(w, 20)}" height="20" rx="5" fill="${i === 0 ? C_DANGER : i === 1 ? C_GOLD : C_PRIMARY}"/>`;
    g += `<text x="${lx + Math.max(w, 20) + 8}" y="${yy+15}" font-size="11.5" font-weight="700" fill="${C_PRIMARY}">${d.count} 次 · ${d.pct}%</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img">${g}</svg>`;
}

/* ---------- 迷你进度环（中标概率） ---------- */
function probRing(p, size) {
  size = size || 92;
  const r = size / 2 - 7, c = 2 * Math.PI * r;
  const off = c * (1 - p);
  const color = p >= 0.6 ? C_SUCCESS : p >= 0.4 ? C_WARN : C_DANGER;
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#F0EDE6" stroke-width="8"/>
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${color}" stroke-width="8"
      stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${off}" transform="rotate(-90 ${size/2} ${size/2})"/>
    <text x="50%" y="50%" font-size="${size*0.24}" font-weight="800" fill="${color}" text-anchor="middle" dominant-baseline="central">${Math.round(p*100)}%</text>
  </svg>`;
}

/* ---------- 评分权重堆叠条 ---------- */
function scoreBar(items) {
  const colors = [C_PRIMARY, C_GOLD, '#3E8F6B'];
  let g = '<div style="display:flex;border-radius:7px;overflow:hidden;height:26px">';
  items.forEach((s, i) => {
    g += `<div style="width:${s.weight}%;background:${colors[i % 3]};color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center">${s.name} ${s.weight}%</div>`;
  });
  return g + '</div>';
}

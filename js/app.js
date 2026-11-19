/* ============================================================
 * 格智·电网投标助手 — 应用主逻辑
 * 路由 / 布局 / 首页 / 项目列表 / 新建 / 详情 / 解析 / 决策
 * ============================================================ */

/* ---------- 布局骨架 ---------- */
function navItems() {
  return [
    { path: '/', icon: '🏠', label: '首页仪表盘' },
    { group: '投标管理' },
    { path: '/bid/list', icon: '📁', label: '投标项目' },
    { path: '/bid/create', icon: '➕', label: '新建投标项目' },
    { group: '知识库' },
    { path: '/library/qualification', icon: '🪪', label: '资质库', tag: expiringCount() },
    { path: '/library/cases', icon: '🏆', label: '业绩案例库' },
    { path: '/library/templates', icon: '📑', label: '方案模板库' },
    { group: '数据与设置' },
    { path: '/dashboard', icon: '📊', label: '数据统计看板' },
    { path: '/settings', icon: '⚙️', label: '系统设置' }
  ];
}

function expiringCount() {
  return DB.qualifications.filter(q => {
    const s = qualifyStatus(q);
    return s.cls === 'q-warn' || s.cls === 'q-urgent' || s.cls === 'q-expired';
  }).length;
}

function renderShell() {
  const route = currentRoute();
  const items = navItems();
  const isActive = p => route.path === p || (p === '/bid/list' && route.path.startsWith('/bid/'));

  /* 侧栏（桌面） */
  const sideHtml = `
    <aside class="sidebar">
      <div class="s-logo"><span class="logo-badge">格</span>格智·投标助手</div>
      <nav class="s-nav">
        ${items.map(it => it.group
          ? `<div class="s-group">${it.group}</div>`
          : `<a class="s-item ${isActive(it.path) ? 'active' : ''}" href="#${it.path}">
              <span class="di">${it.icon}</span>${it.label}
              ${it.tag ? `<span class="tag">${it.tag}</span>` : ''}
             </a>`).join('')}
      </nav>
      <div class="s-foot">格蒂电力 · 售前投标团队<br>V2.0 全量交付版</div>
    </aside>`;

  /* 底部 Tab（移动） */
  const tabHtml = `
    <nav class="tabbar">
      <a class="tab-item ${route.path === '/' ? 'active' : ''}" href="#/"><span class="ti">🏠</span>首页</a>
      <a class="tab-item ${route.path.startsWith('/bid') ? 'active' : ''}" href="#/bid/list"><span class="ti">📁</span>项目</a>
      <div class="tab-fab"><a class="fab" href="#/bid/create">＋</a></div>
      <a class="tab-item ${route.path.startsWith('/library') ? 'active' : ''}" href="#/library/qualification"><span class="ti">📚</span>知识库</a>
      <a class="tab-item ${route.path === '/dashboard' ? 'active' : ''}" href="#/dashboard"><span class="ti">📊</span>看板</a>
    </nav>`;

  /* 抽屉（移动全量菜单） */
  const drawerHtml = `
    <div class="drawer-mask" id="drawerMask" onclick="toggleDrawer(false)"></div>
    <div class="drawer" id="drawer">
      <div class="drawer-head">
        <div class="dh-user">
          <div class="avatar">张</div>
          <div><div class="dh-name">张伟</div><div class="dh-role">投标经理 · 格蒂电力</div></div>
        </div>
        <div class="dh-org">格智·电网投标助手 V2.0<br>覆盖投标全流程 · 全量交付版</div>
      </div>
      <nav class="drawer-nav">
        ${items.map(it => it.group
          ? `<div class="drawer-group">${it.group}</div>`
          : `<a class="drawer-item ${isActive(it.path) ? 'active' : ''}" href="#${it.path}" onclick="toggleDrawer(false)">
              <span class="di">${it.icon}</span>${it.label}
              ${it.tag ? `<span class="tag">${it.tag}</span>` : ''}
             </a>`).join('')}
      </nav>
    </div>`;

  return sideHtml + tabHtml + drawerHtml;
}

/* ---------- 顶部栏 ---------- */
function topbar(title, showBack, actions) {
  return `
  <header class="topbar">
    <button class="icon-btn mob-only" onclick="toggleDrawer(true)" aria-label="菜单">☰</button>
    ${showBack ? `<button class="icon-btn" onclick="history.back()" aria-label="返回">←</button>` : ''}
    <div class="logo"><span class="logo-badge">格</span></div>
    <div class="page-title">${title}</div>
    <div class="top-actions">${actions || ''}</div>
  </header>`;
}

function toggleDrawer(open) {
  document.getElementById('drawer').classList.toggle('open', open);
  document.getElementById('drawerMask').classList.toggle('open', open);
}

/* ---------- Toast ---------- */
function toast(msg, ok) {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  const t = document.createElement('div');
  t.className = 'toast' + (ok === false ? '' : ' ok');
  t.innerHTML = `<span class="t-ic">${ok === false ? '⚠️' : '✓'}</span>${esc(msg)}`;
  wrap.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; setTimeout(() => t.remove(), 320); }, 2400);
}

/* ---------- 路由 ---------- */
/* ---------- 路由（运行时构建，避免跨文件声明顺序问题） ---------- */
function getRoutes() {
  return [
    { re: /^\/$/, render: pageHome },
    { re: /^\/bid\/list$/, render: pageBidList },
    { re: /^\/bid\/create$/, render: pageBidCreate },
    { re: /^\/bid\/([\w-]+)$/, render: pageBidDetail },
    { re: /^\/bid\/([\w-]+)\/analysis$/, render: pageAnalysis },
    { re: /^\/bid\/([\w-]+)\/decision$/, render: pageDecision },
    { re: /^\/bid\/([\w-]+)\/proposal$/, render: pageProposal },
    { re: /^\/bid\/([\w-]+)\/compliance$/, render: pageCompliance },
    { re: /^\/bid\/([\w-]+)\/progress$/, render: pageProgress },
    { re: /^\/library\/qualification$/, render: pageQualification },
    { re: /^\/library\/cases$/, render: pageCases },
    { re: /^\/library\/templates$/, render: pageTemplates },
    { re: /^\/dashboard$/, render: pageDashboard },
    { re: /^\/settings$/, render: pageSettings }
  ];
}

function currentRoute() {
  const h = location.hash.replace(/^#/, '') || '/';
  return { path: h, match: null };
}

let cdTimer = null;
function router() {
  const path = location.hash.replace(/^#/, '') || '/';
  const main = document.getElementById('main');
  let matched = null, args = [];
  const routes = getRoutes();
  for (const r of routes) {
    const m = path.match(r.re);
    if (m) { matched = r; args = m.slice(1); break; }
  }
  window.scrollTo(0, 0);
  if (!matched) {
    document.getElementById('shell').innerHTML = renderShell();
    document.getElementById('topbar').innerHTML = topbar('页面不存在', true, '');
    main.innerHTML = `<div class="empty fade-in"><div class="e-icon">🧭</div><div class="e-t">页面不存在，请从菜单进入</div><br><a class="btn btn-primary" href="#/">返回首页</a></div>`;
    return;
  }
  const res = matched.render.apply(null, args);
  /* render 可返回 { title, back, actions, html } 或纯 html 字符串 */
  let title = '格智·投标助手', back = false, actions = '', html = '';
  if (typeof res === 'string') { html = res; }
  else { title = res.title || title; back = res.back !== false; actions = res.actions || ''; html = res.html; }
  document.getElementById('shell').innerHTML = renderShell();
  document.getElementById('topbar').innerHTML = topbar(title, back, actions);
  main.innerHTML = `<div class="fade-in">${html}</div>`;
  /* 倒计时刷新 */
  if (cdTimer) clearInterval(cdTimer);
  cdTimer = setInterval(() => {
    document.querySelectorAll('[data-cd]').forEach(el => {
      const d = daysUntil(el.dataset.cd);
      if (d === null) return;
      const urgent = d <= 3, soon = d <= 7;
      el.className = 'countdown ' + (urgent ? 'cd-urgent' : soon ? 'cd-soon' : 'cd-normal');
      el.textContent = d < 0 ? '已逾期 ' + Math.abs(d) + ' 天' : d === 0 ? '今天截止' : '剩 ' + d + ' 天';
    });
  }, 30000);
}

/* ============================================================
 * 页面：首页仪表盘
 * ============================================================ */
function pageHome() {
  const active = DB.projects.filter(p => ['bidding', 'deciding', 'analyzing', 'submitted', 'draft'].includes(p.status));
  const won = DB.projects.filter(p => p.status === 'won').length;
  const winRate = Math.round((DB.stats.won / DB.stats.total) * 100);
  /* 近期节点 */
  const milestones = [];
  DB.projects.forEach(p => {
    (p.milestones || []).forEach(ms => {
      if (!ms.done) milestones.push({ project: p.name, pid: p.id, ...ms });
    });
  });
  milestones.sort((a, b) => new Date(a.date.replace(' ', 'T')) - new Date(b.date.replace(' ', 'T')));
  /* 我的待办 */
  const todos = [];
  DB.projects.forEach(p => {
    (p.progress || []).forEach(t => {
      const st = Store.getTask(p.id, t.id) || t.status;
      if (st !== 'done') todos.push({ pid: p.id, project: p.name, ...t, status: st });
    });
  });
  todos.sort((a, b) => new Date(a.due.replace(' ', 'T')) - new Date(b.due.replace(' ', 'T')));

  return {
    title: '格智·投标助手',
    back: false,
    html: `
    <!-- 欢迎横幅 -->
    <div class="card" style="background:linear-gradient(150deg,var(--primary),var(--primary-dark));color:#fff;border:none;position:relative;overflow:hidden">
      <div style="position:absolute;right:-20px;top:-30px;width:140px;height:140px;border-radius:50%;background:rgba(196,154,88,.18)"></div>
      <div style="font-size:12px;opacity:.75">${nowStr().slice(0, 10)} 星期四 · 张伟，下午好</div>
      <div style="font-size:17px;font-weight:800;margin-top:4px">当前 ${active.length} 个项目在投，${todos.length} 项待办待处理</div>
      <div style="display:flex;gap:18px;margin-top:12px;font-size:11.5px;opacity:.85">
        <span>🏢 格蒂电力</span><span>📈 累计中标率 ${winRate}%</span><span>🎯 今年目标 +5pct</span>
      </div>
    </div>

    <!-- 核心指标 -->
    <div class="stat-grid">
      <div class="stat-card"><div class="sv">${active.length}<small>个</small></div><div class="sl">在投项目</div><div class="st-trend up">▲ 较上月 +2</div></div>
      <div class="stat-card"><div class="sv">${DB.stats.total}<small>个</small></div><div class="sl">累计投标</div><div class="st-trend up">▲ 本季度 +9</div></div>
      <div class="stat-card"><div class="sv">${winRate}<small>%</small></div><div class="sl">累计中标率</div><div class="st-trend up">▲ +8pct 同比</div></div>
      <div class="stat-card"><div class="sv">${DB.qualifications.length}<small>项</small></div><div class="sl">资质证书</div><div class="st-trend ${expiringCount() ? 'down' : ''}">${expiringCount() ? '⚠ ' + expiringCount() + ' 项临期' : '✓ 状态良好'}</div></div>
    </div>

    <!-- 近期节点倒计时 -->
    <div class="section-title">⏰ 近期关键节点 <span class="st-more" onclick="location.hash='#/bid/list'">全部项目 →</span></div>
    <div class="list-card">
      ${milestones.slice(0, 4).map(ms => {
        const d = daysUntil(ms.date);
        const cls = d <= 3 ? 'cd-urgent' : d <= 7 ? 'cd-soon' : 'cd-normal';
        const txt = d < 0 ? '已逾期' : d === 0 ? '今天' : '剩 ' + d + ' 天';
        return `<div class="list-item" onclick="location.hash='#/bid/${ms.pid}'">
          <div style="font-size:20px">${ms.name.includes('报名') ? '📋' : ms.name.includes('保证金') ? '💰' : ms.name.includes('投标') ? '📮' : '🔔'}</div>
          <div class="li-body">
            <div class="li-title" style="-webkit-line-clamp:1">${esc(ms.project)}</div>
            <div class="li-sub"><span>${ms.name}</span><span>${fmtDate(ms.date)}</span></div>
          </div>
          <div class="li-extra"><span class="countdown ${cls}">${txt}</span></div>
        </div>`;
      }).join('') || '<div class="empty"><div class="e-t">暂无待办节点</div></div>'}
    </div>

    <!-- 我的待办 -->
    <div class="section-title">✅ 我的待办（${todos.length}）<span class="st-more" onclick="location.hash='#/bid/${todos[0] ? todos[0].pid : 'bp-1001'}/progress'">进度看板 →</span></div>
    <div class="list-card">
      ${todos.slice(0, 5).map(t => `
        <div class="list-item" onclick="location.hash='#/bid/${t.pid}/progress'">
          <div class="li-body">
            <div class="li-title">${esc(t.title)}</div>
            <div class="li-sub"><span>👤 ${t.assignee}</span><span>${esc(t.project.slice(0, 14))}…</span></div>
          </div>
          <div class="li-extra"><span class="badge ${t.status === 'in_progress' ? 'st-bidding' : 'st-draft'}">${t.status === 'in_progress' ? '进行中' : '待处理'}</span></div>
        </div>`).join('') || '<div class="empty"><div class="e-t">🎉 暂无待办，全部完成</div></div>'}
    </div>

    <!-- 快捷入口 -->
    <div class="section-title">⚡ 快捷操作</div>
    <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:12px">
      ${[
        ['/bid/create', '📤', '上传招标文件', '#1A4D3A'],
        ['/library/qualification', '🪪', '资质到期查', '#C49A58'],
        ['/library/cases', '🏆', '业绩匹配', '#2563EB'],
        ['/dashboard', '📊', '中标率分析', '#52C41A']
      ].map(q => `
        <a class="card" href="#${q[0]}" style="margin:0;text-align:center;padding:14px 4px">
          <div style="font-size:22px">${q[1]}</div>
          <div style="font-size:11px;margin-top:6px;color:var(--text-2);font-weight:600">${q[2]}</div>
        </a>`).join('')}
    </div>`
  };
}

/* ============================================================
 * 页面：投标项目列表
 * ============================================================ */
let listFilter = { status: 'all', kw: '' };
function pageBidList() {
  const f = listFilter;
  const list = DB.projects.filter(p => {
    if (f.status !== 'all' && p.status !== f.status) return false;
    if (f.kw && !(p.name + p.purchaser).includes(f.kw)) return false;
    return true;
  }).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

  const statuses = [['all', '全部'], ['bidding', '投标中'], ['deciding', '决策中'], ['analyzing', '解析中'], ['won', '已中标'], ['lost', '已丢标'], ['pass', '已放弃']];

  return {
    title: '投标项目',
    html: `
    <div style="position:relative;margin-bottom:12px">
      <input class="input" id="kwInput" placeholder="🔍 搜索项目名称 / 采购人" value="${esc(f.kw)}" style="padding-left:36px"
        oninput="listFilter.kw=this.value;refreshBidList()">
      <span style="position:absolute;left:12px;top:11px;color:var(--text-3)">🔍</span>
    </div>
    <div class="chips">
      ${statuses.map(s => `<button class="chip ${f.status === s[0] ? 'active' : ''}" onclick="listFilter.status='${s[0]}';refreshBidList()">${s[1]}</button>`).join('')}
    </div>
    <div style="font-size:11.5px;color:var(--text-3);margin-bottom:8px" id="listCount">共 ${list.length} 个项目</div>
    <div id="bidListWrap">
      ${list.length ? list.map(p => {
        const d = daysUntil(p.deadline);
        const cls = d <= 3 ? 'cd-urgent' : d <= 7 ? 'cd-soon' : 'cd-normal';
        const dec = p.decisionResult ? `<span class="badge ${DECISION_MAP[p.decisionResult].cls}">${DECISION_MAP[p.decisionResult].label}</span>` : '';
        return `<a class="list-card" href="#/bid/${p.id}" style="display:block;margin-bottom:10px">
          <div class="list-item" style="align-items:flex-start">
            <div class="li-body">
              <div class="li-title">${esc(p.name)}</div>
              <div class="li-sub">
                <span>🏛 ${esc(p.purchaser)}</span>
                <span>💰 ${fmtMoney(p.budget)}</span>
                <span>📍 ${p.region}</span>
              </div>
              <div style="display:flex;gap:6px;margin-top:8px;align-items:center;flex-wrap:wrap">
                <span class="badge ${STATUS_MAP[p.status].cls}">${STATUS_MAP[p.status].label}</span>
                ${dec}
                ${p.winProbability ? `<span style="font-size:11px;color:var(--text-3)">中标概率 ${Math.round(p.winProbability*100)}%</span>` : ''}
                ${['bidding','deciding','analyzing'].includes(p.status) ? `<span class="countdown ${cls}" style="font-size:11px" data-cd="${p.deadline}">${d < 0 ? '已逾期' : d === 0 ? '今天' : '剩'+d+'天'}</span>` : ''}
              </div>
            </div>
          </div>
        </a>`;
      }).join('') : '<div class="empty"><div class="e-icon">📂</div><div class="e-t">没有符合条件的项目</div></div>'}
    </div>`
  };
}
function refreshBidList() {
  /* 局部刷新：只更新列表与计数，保留输入焦点 */
  const f = listFilter;
  const list = DB.projects.filter(p => {
    if (f.status !== 'all' && p.status !== f.status) return false;
    if (f.kw && !(p.name + p.purchaser).includes(f.kw)) return false;
    return true;
  }).sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  const wrap = document.getElementById('bidListWrap');
  const cntEl = document.getElementById('listCount');
  if (cntEl) cntEl.textContent = '共 ' + list.length + ' 个项目';
  if (!wrap) return;
  wrap.innerHTML = list.length ? list.map(p => {
    const d = daysUntil(p.deadline);
    const cls = d <= 3 ? 'cd-urgent' : d <= 7 ? 'cd-soon' : 'cd-normal';
    const dec = p.decisionResult ? `<span class="badge ${DECISION_MAP[p.decisionResult].cls}">${DECISION_MAP[p.decisionResult].label}</span>` : '';
    return `<a class="list-card" href="#/bid/${p.id}" style="display:block;margin-bottom:10px">
      <div class="list-item" style="align-items:flex-start">
        <div class="li-body">
          <div class="li-title">${esc(p.name)}</div>
          <div class="li-sub">
            <span>🏛 ${esc(p.purchaser)}</span>
            <span>💰 ${fmtMoney(p.budget)}</span>
            <span>📍 ${p.region}</span>
          </div>
          <div style="display:flex;gap:6px;margin-top:8px;align-items:center;flex-wrap:wrap">
            <span class="badge ${STATUS_MAP[p.status].cls}">${STATUS_MAP[p.status].label}</span>
            ${dec}
            ${p.winProbability ? `<span style="font-size:11px;color:var(--text-3)">中标概率 ${Math.round(p.winProbability*100)}%</span>` : ''}
            ${['bidding','deciding','analyzing'].includes(p.status) ? `<span class="countdown ${cls}" style="font-size:11px" data-cd="${p.deadline}">${d < 0 ? '已逾期' : d === 0 ? '今天' : '剩'+d+'天'}</span>` : ''}
          </div>
        </div>
      </div>
    </a>`;
  }).join('') : '<div class="empty"><div class="e-icon">📂</div><div class="e-t">没有符合条件的项目</div></div>';
}

/* ============================================================
 * 页面：新建投标项目（上传 → AI解析）
 * ============================================================ */
let createState = { fileName: '', parsing: false, parsed: null };
function pageBidCreate() {
  return {
    title: '新建投标项目',
    html: `
    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>上传招标文件<span class="ct-extra">支持 PDF / Word</span></div>
      <div class="uploader" onclick="document.getElementById('tenderFile').click()">
        <div class="up-icon">📄</div>
        <div class="up-t">${createState.fileName ? esc(createState.fileName) : '点击选择招标文件'}</div>
        <div class="up-s">招标文件将自动上传并由 AI 解析关键信息<br>（演示环境：点击后自动模拟解析流程）</div>
        <span class="up-btn">选择文件</span>
        <input type="file" id="tenderFile" accept=".pdf,.doc,.docx" style="display:none"
          onchange="onFilePick(this)">
      </div>
    </div>

    <div id="parseArea" style="${createState.parsing || createState.parsed ? '' : 'display:none'}">
      <div class="card">
        <div class="card-title"><span class="ct-bar"></span>AI 智能解析中<span class="ct-extra">深度模型 · v2.0</span></div>
        <div class="parse-steps" id="parseSteps">
          ${['提取全文文本（OCR+版面分析）', '识别项目基本信息与预算', '提取资质要求与评分标准', '标注废标条款与关键节点', '生成结构化解析结果'].map((s, i) =>
            `<div class="parse-step" data-step="${i}"><span class="ps-icon"></span>${s}</div>`).join('')}
        </div>
        <div class="pbar" id="parseBar" style="display:none"><i style="width:0%"></i></div>
      </div>
    </div>

    <div id="parseResult"></div>

    <div class="card" id="metaCard" style="display:none">
      <div class="card-title"><span class="ct-bar"></span>确认项目信息</div>
      <div class="field"><label>项目名称<span class="req">*</span></label><input class="input" id="npName"></div>
      <div class="field"><label>采购人</label><input class="input" id="npPurchaser"></div>
      <div class="field"><label>代理机构</label><input class="input" id="npAgency"></div>
      <div class="field"><label>项目预算（万元）</label><input class="input" id="npBudget" type="number"></div>
      <div class="field"><label>所属区域</label>
        <select class="select" id="npRegion">
          ${['河南','山东','江苏','浙江','安徽','四川','湖北','福建','天津','其他'].map(r => `<option>${r}</option>`).join('')}
        </select>
      </div>
      <button class="btn btn-primary btn-block" onclick="createProject()">🚀 创建投标项目</button>
    </div>`
  };
}

const DEMO_PARSE = {
  name: '国网某电力公司2026年调度自动化系统建设项目',
  purchaser: '国网某电力公司', agency: '某招标代理有限公司',
  budget: 1780, region: '河南',
  quals: [
    { item: '企业资质', req: 'ISO9001 质量管理体系认证', status: 'meet', owned: 'ISO9001（有效）' },
    { item: '企业资质', req: 'CMMI 3 级及以上', status: 'meet', owned: 'CMMI 5 级' },
    { item: '人员资质', req: '高级工程师 2 名以上', status: 'meet', owned: '高级工程师 6 名' },
    { item: '业绩要求', req: '2022 年以来 2 个千万级调度自动化业绩', status: 'meet', owned: '符合业绩 3 个' },
    { item: '财务要求', req: '近三年审计报告', status: 'meet', owned: '齐备' }
  ],
  rejections: ['未按要求密封的否决投标', '报价超最高限价的否决投标', '未提供 CMMI 证书的否决投标']
};

function onFilePick(input) {
  const f = input.files && input.files[0];
  if (!f) return;
  createState.fileName = f.name;
  createState.parsing = true;
  createState.parsed = null;
  router();
  runParse();
}

function runParse() {
  const area = document.getElementById('parseArea');
  area.style.display = '';
  const steps = area.querySelectorAll('.parse-step');
  const bar = document.getElementById('parseBar');
  bar.style.display = '';
  const fill = bar.querySelector('i');
  let i = 0;
  const next = () => {
    if (i > 0) { steps[i - 1].classList.remove('running'); steps[i - 1].classList.add('done'); }
    if (i < steps.length) {
      steps[i].classList.add('running');
      fill.style.width = ((i + 1) / steps.length * 100) + '%';
      i++;
      setTimeout(next, 520 + Math.random() * 380);
    } else {
      fill.style.width = '100%';
      createState.parsed = DEMO_PARSE;
      showParseResult();
      toast('招标文件解析完成，关键信息提取 5/5 类');
    }
  };
  next();
}

function showParseResult() {
  const d = createState.parsed;
  const meet = d.quals.filter(q => q.status === 'meet').length;
  const res = document.getElementById('parseResult');
  res.innerHTML = `
    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>解析结果预览<span class="ct-extra">置信度 94%</span></div>
      <div class="kv-row"><span class="k">项目名称</span><span class="v">${esc(d.name)}</span></div>
      <div class="kv-row"><span class="k">预算金额</span><span class="v">${fmtMoney(d.budget)}</span></div>
      <div class="kv-row"><span class="k">采购人</span><span class="v">${esc(d.purchaser)}</span></div>
      <div class="kv-row"><span class="k">资质要求</span><span class="v">${d.quals.length} 项，自检初步满足 ${meet} 项</span></div>
      <div class="kv-row"><span class="k">废标条款</span><span class="v" style="color:var(--danger)">⚠ ${d.rejections.length} 条已标注</span></div>
    </div>`;
  document.getElementById('metaCard').style.display = '';
  document.getElementById('npName').value = d.name;
  document.getElementById('npPurchaser').value = d.purchaser;
  document.getElementById('npAgency').value = d.agency;
  document.getElementById('npBudget').value = d.budget;
  document.getElementById('npRegion').value = d.region;
}

function createProject() {
  const name = document.getElementById('npName').value.trim();
  if (!name) { toast('请填写项目名称', false); return; }
  const d = createState.parsed || DEMO_PARSE;
  const id = 'bp-' + Date.now();
  const p = {
    id, name,
    budget: Number(document.getElementById('npBudget').value) || d.budget,
    purchaser: document.getElementById('npPurchaser').value || d.purchaser,
    agency: document.getElementById('npAgency').value || d.agency,
    region: document.getElementById('npRegion').value,
    industry: '调度自动化', type: '系统建设',
    status: 'analyzing', decisionResult: null, winProbability: null,
    createdBy: '张伟', createdAt: nowStr().slice(0, 10),
    deadline: '2026-12-15 09:00',
    milestones: [
      { name: '报名截止', date: '2026-11-20 17:00', done: false },
      { name: '保证金截止', date: '2026-12-05 17:00', done: false },
      { name: '投标截止', date: '2026-12-15 09:00', done: false },
      { name: '开标时间', date: '2026-12-16 10:00', done: false }
    ],
    analysis: {
      basic: [
        ['项目名称', name],
        ['预算金额', fmtMoney(Number(document.getElementById('npBudget').value) || d.budget)],
        ['采购人', document.getElementById('npPurchaser').value || d.purchaser],
        ['代理机构', document.getElementById('npAgency').value || d.agency],
        ['交付周期', '以招标文件约定为准']
      ],
      qualifications: d.quals, scoring: [
        { name: '技术部分', weight: 45, items: [{ name: '技术方案响应', score: 45 }] },
        { name: '商务部分', weight: 35, items: [{ name: '资质与业绩', score: 35 }] },
        { name: '价格部分', weight: 20, items: [{ name: '投标报价', score: 20 }] }
      ],
      rejections: d.rejections
    },
    decision: null, competition: null,
    proposal: { tech: '【未生成】', business: '【未生成】' },
    compliance: null,
    progress: [
      { id: 't-1', title: '解析结果人工复核', assignee: '张伟', due: '2026-10-16 18:00', status: 'pending' },
      { id: 't-2', title: '投标决策评估', assignee: '张伟', due: '2026-10-18 18:00', status: 'pending' }
    ]
  };
  DB.projects.unshift(p);
  createState = { fileName: '', parsing: false, parsed: null };
  toast('项目创建成功，已进入 AI 解析状态');
  location.hash = '#/bid/' + id;
}

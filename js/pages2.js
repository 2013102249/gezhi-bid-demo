/* ============================================================
 * 格智·电网投标助手 — 页面：知识库 / 数据看板 / 设置
 * ============================================================ */

/* ---------- 资质库 ---------- */
let qualFilter = { type: 'all', kw: '' };
function pageQualification() {
  const list = DB.qualifications.filter(q => {
    if (qualFilter.type !== 'all' && q.type !== qualFilter.type) return false;
    if (qualFilter.kw && !(q.name + q.number + q.owner).includes(qualFilter.kw)) return false;
    return true;
  });
  const warnCnt = expiringCount();
  return {
    title: '资质库',
    actions: `<button class="icon-btn" onclick="toast('资质上传功能已就绪（演示）')" title="上传">＋</button>`,
    html: `
    <div class="card" style="background:linear-gradient(150deg,#FFF7E6,#FFFDF6);border-color:var(--gold-light)">
      <div style="display:flex;align-items:center;gap:10px">
        <span style="font-size:22px">⏰</span>
        <div style="flex:1">
          <div style="font-size:13px;font-weight:700">到期提醒中心</div>
          <div style="font-size:11.5px;color:var(--text-2)">${warnCnt ? `当前 ${warnCnt} 项资质临期或已过期，建议尽快办理` : '所有资质均在有效期内'}</div>
        </div>
        <a class="btn btn-sm btn-gold" href="#/library/qualification" onclick="qualFilter.type='expiring';refreshQual()">查看</a>
      </div>
    </div>

    <div style="position:relative;margin-bottom:12px">
      <input class="input" placeholder="🔍 搜索资质名称 / 编号 / 持有人" style="padding-left:36px" value="${esc(qualFilter.kw)}"
        oninput="qualFilter.kw=this.value;refreshQual()">
      <span style="position:absolute;left:12px;top:11px;color:var(--text-3)">🔍</span>
    </div>
    <div class="chips">
      ${[['all', '全部'], ['enterprise', '企业资质'], ['person', '人员证书'], ['expiring', '⚠ 临期/过期']].map(s =>
        `<button class="chip ${qualFilter.type === s[0] ? 'active' : ''}" onclick="qualFilter.type='${s[0]}';refreshQual()">${s[1]}</button>`).join('')}
    </div>
    <div style="font-size:11.5px;color:var(--text-3);margin-bottom:8px">共 ${list.length} 项</div>
    <div id="qualList">
      ${list.map(q => {
        const s = qualifyStatus(q);
        return `<div class="list-card" style="margin-bottom:10px">
          <div class="list-item" style="align-items:flex-start">
            <div style="font-size:22px">${q.type === 'enterprise' ? '🏢' : '👤'}</div>
            <div class="li-body">
              <div class="li-title" style="font-size:13px">${esc(q.name)}</div>
              <div class="li-sub">
                <span>编号：${esc(q.number)}</span>
                <span>${q.type === 'enterprise' ? '企业资质' : '人员证书'}</span>
              </div>
              <div class="li-sub"><span>持有人：${esc(q.owner)}</span><span>到期：${esc(q.expire)}</span></div>
            </div>
            <div class="li-extra"><span class="badge q-${s.cls.replace('q-','')}">${s.label}</span></div>
          </div>
        </div>`;
      }).join('')}
    </div>
    <div class="card" style="text-align:center">
      <div style="font-size:12.5px;color:var(--text-2);margin-bottom:10px">上传资质证书（PDF/图片），AI 自动 OCR 识别编号与到期日</div>
      <button class="btn btn-primary" onclick="toast('已打开资质上传（演示环境）')">📤 上传资质文件</button>
    </div>`
  };
}
function refreshQual() {
  const main = document.getElementById('main');
  const wrap = document.getElementById('qualList');
  if (!wrap) { router(); return; }
  let list = DB.qualifications.filter(q => {
    if (qualFilter.type === 'enterprise' && q.type !== 'enterprise') return false;
    if (qualFilter.type === 'person' && q.type !== 'person') return false;
    if (qualFilter.type === 'expiring') {
      const s = qualifyStatus(q);
      if (!['q-warn', 'q-urgent', 'q-expired', 'q-pending'].includes(s.cls)) return false;
    }
    if (qualFilter.kw && !(q.name + q.number + q.owner).includes(qualFilter.kw)) return false;
    return true;
  });
  wrap.innerHTML = list.map(q => {
    const s = qualifyStatus(q);
    return `<div class="list-card" style="margin-bottom:10px">
      <div class="list-item" style="align-items:flex-start">
        <div style="font-size:22px">${q.type === 'enterprise' ? '🏢' : '👤'}</div>
        <div class="li-body">
          <div class="li-title" style="font-size:13px">${esc(q.name)}</div>
          <div class="li-sub"><span>编号：${esc(q.number)}</span><span>${q.type === 'enterprise' ? '企业资质' : '人员证书'}</span></div>
          <div class="li-sub"><span>持有人：${esc(q.owner)}</span><span>到期：${esc(q.expire)}</span></div>
        </div>
        <div class="li-extra"><span class="badge q-${s.cls.replace('q-','')}">${s.label}</span></div>
      </div>
    </div>`;
  }).join('') || '<div class="empty"><div class="e-t">没有符合条件的资质</div></div>';
}

/* ---------- 业绩案例库 ---------- */
let caseFilter = { industry: 'all', region: 'all', kw: '', sort: 'amount' };
function pageCases() {
  const f = caseFilter;
  const industries = ['all', ...new Set(DB.cases.map(c => c.industry))];
  const regions = ['all', ...new Set(DB.cases.map(c => c.region))];
  const list = DB.cases.filter(c => {
    if (f.industry !== 'all' && c.industry !== f.industry) return false;
    if (f.region !== 'all' && c.region !== f.region) return false;
    if (f.kw && !(c.name + c.client + c.desc).includes(f.kw)) return false;
    return true;
  }).sort((a, b) => f.sort === 'amount' ? b.amount - a.amount : (b.winDate || '').localeCompare(a.winDate || ''));
  return {
    title: '业绩案例库',
    html: `
    <div style="position:relative;margin-bottom:12px">
      <input class="input" placeholder="🔍 搜索项目 / 客户 / 关键词" style="padding-left:36px" value="${esc(f.kw)}"
        oninput="caseFilter.kw=this.value;refreshCases()">
      <span style="position:absolute;left:12px;top:11px;color:var(--text-3)">🔍</span>
    </div>
    <div class="chips">
      <span style="font-size:11.5px;color:var(--text-3);align-self:center;flex-shrink:0">行业</span>
      ${industries.map(i => `<button class="chip ${f.industry === i ? 'active' : ''}" onclick="caseFilter.industry='${i}';refreshCases()">${i === 'all' ? '全部' : i}</button>`).join('')}
    </div>
    <div class="chips">
      <span style="font-size:11.5px;color:var(--text-3);align-self:center;flex-shrink:0">区域</span>
      ${regions.map(r => `<button class="chip ${f.region === r ? 'active' : ''}" onclick="caseFilter.region='${r}';refreshCases()">${r === 'all' ? '全部' : r}</button>`).join('')}
      <button class="chip" onclick="caseFilter.sort = caseFilter.sort === 'amount' ? 'date' : 'amount'; refreshCases()">排序：${f.sort === 'amount' ? '金额↓' : '日期↓'}</button>
    </div>
    <div style="font-size:11.5px;color:var(--text-3);margin-bottom:8px">共 ${list.length} 个案例 · 智能推荐已开启</div>
    <div id="caseList">
      ${list.map(c => `
        <div class="list-card" style="margin-bottom:10px" onclick="showCase('${c.id}')">
          <div class="list-item" style="align-items:flex-start">
            <div style="font-size:22px">🏆</div>
            <div class="li-body">
              <div class="li-title">${esc(c.name)}</div>
              <div class="li-sub">
                <span>🏛 ${esc(c.client)}</span>
                <span>📍 ${c.region}</span>
                <span>🏷 ${c.industry}</span>
              </div>
              <div class="li-sub"><span>中标日期：${c.winDate}</span></div>
            </div>
            <div class="li-extra"><div class="le-num">${fmtMoney(c.amount)}</div></div>
          </div>
        </div>`).join('') || '<div class="empty"><div class="e-icon">🏆</div><div class="e-t">没有符合条件的案例</div></div>'}
    </div>`
  };
}
function refreshCases() {
  const wrap = document.getElementById('caseList');
  if (!wrap) { router(); return; }
  const f = caseFilter;
  const list = DB.cases.filter(c => {
    if (f.industry !== 'all' && c.industry !== f.industry) return false;
    if (f.region !== 'all' && c.region !== f.region) return false;
    if (f.kw && !(c.name + c.client + c.desc).includes(f.kw)) return false;
    return true;
  }).sort((a, b) => f.sort === 'amount' ? b.amount - a.amount : (b.winDate || '').localeCompare(a.winDate || ''));
  wrap.innerHTML = list.map(c => `
    <div class="list-card" style="margin-bottom:10px" onclick="showCase('${c.id}')">
      <div class="list-item" style="align-items:flex-start">
        <div style="font-size:22px">🏆</div>
        <div class="li-body">
          <div class="li-title">${esc(c.name)}</div>
          <div class="li-sub"><span>🏛 ${esc(c.client)}</span><span>📍 ${c.region}</span><span>🏷 ${c.industry}</span></div>
          <div class="li-sub"><span>中标日期：${c.winDate}</span></div>
        </div>
        <div class="li-extra"><div class="le-num">${fmtMoney(c.amount)}</div></div>
      </div>
    </div>`).join('') || '<div class="empty"><div class="e-icon">🏆</div><div class="e-t">没有符合条件的案例</div></div>';
}

function showCase(id) {
  const c = DB.cases.find(x => x.id === id);
  if (!c) return;
  openSheet(`
    <div class="sheet-grab"></div>
    <div class="sheet-title">${esc(c.name)}</div>
    <div class="kv-row"><span class="k">客户</span><span class="v">${esc(c.client)}</span></div>
    <div class="kv-row"><span class="k">合同金额</span><span class="v" style="color:var(--primary);font-weight:800">${fmtMoney(c.amount)}</span></div>
    <div class="kv-row"><span class="k">区域 / 行业</span><span class="v">${c.region} · ${c.industry}</span></div>
    <div class="kv-row"><span class="k">中标日期</span><span class="v">${c.winDate}</span></div>
    <div class="kv-row"><span class="k">项目描述</span><span class="v" style="font-weight:400">${esc(c.desc)}</span></div>
    <div style="display:flex;gap:8px;margin-top:14px">
      <button class="btn btn-outline" style="flex:1" onclick="toast('标书文件下载（演示）')">📥 下载标书</button>
      <button class="btn btn-primary" style="flex:1" onclick="closeSheet();toast('已作为参考插入新项目')">✨ 用于新项目</button>
    </div>
  `);
}

/* ---------- 方案模板库 ---------- */
function pageTemplates() {
  const cats = ['all', ...new Set(DB.templates.map(t => t.category))];
  return {
    title: '方案模板库',
    html: `
    <div class="chips">
      ${cats.map(c => `<button class="chip ${tplFilter === c ? 'active' : ''}" onclick="tplFilter='${c}';refreshTpl()">${c === 'all' ? '全部' : c}</button>`).join('')}
    </div>
    <div id="tplList">
      ${DB.templates.map(t => `
        <div class="list-card" style="margin-bottom:10px">
          <div class="list-item" style="align-items:flex-start">
            <div style="font-size:22px">📑</div>
            <div class="li-body">
              <div class="li-title">${esc(t.name)}</div>
              <div class="li-sub">
                <span>版本 ${t.version}</span>
                <span>更新 ${t.updated}</span>
                <span>引用 ${t.usage} 次</span>
              </div>
              <div style="font-size:11.5px;color:var(--text-2);margin-top:5px">${esc(t.desc)}</div>
            </div>
          </div>
          <div style="display:flex;gap:8px;padding:0 14px 12px">
            <button class="btn btn-sm btn-outline" style="flex:1" onclick="toast('模板预览（演示）')">👁 预览</button>
            <button class="btn btn-sm btn-primary" style="flex:1" onclick="toast('已基于模板创建新方案草稿')">＋ 使用模板</button>
          </div>
        </div>`).join('')}
    </div>
    <div class="card" style="text-align:center">
      <div style="font-size:12.5px;color:var(--text-2);margin-bottom:10px">模板更新后自动同步到所有引用中的新项目</div>
      <button class="btn btn-gold" onclick="toast('新建模板（演示）')">📑 新建模板</button>
    </div>`
  };
}
let tplFilter = 'all';
function refreshTpl() {
  const wrap = document.getElementById('tplList');
  if (!wrap) { router(); return; }
  const list = DB.templates.filter(t => tplFilter === 'all' || t.category === tplFilter);
  wrap.innerHTML = list.map(t => `
    <div class="list-card" style="margin-bottom:10px">
      <div class="list-item" style="align-items:flex-start">
        <div style="font-size:22px">📑</div>
        <div class="li-body">
          <div class="li-title">${esc(t.name)}</div>
          <div class="li-sub"><span>版本 ${t.version}</span><span>更新 ${t.updated}</span><span>引用 ${t.usage} 次</span></div>
          <div style="font-size:11.5px;color:var(--text-2);margin-top:5px">${esc(t.desc)}</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;padding:0 14px 12px">
        <button class="btn btn-sm btn-outline" style="flex:1" onclick="toast('模板预览（演示）')">👁 预览</button>
        <button class="btn btn-sm btn-primary" style="flex:1" onclick="toast('已基于模板创建新方案草稿')">＋ 使用模板</button>
      </div>
    </div>`).join('');
}

/* ---------- 数据统计看板 ---------- */
function pageDashboard() {
  const s = DB.stats;
  const winRate = Math.round(s.won / s.total * 100);
  return {
    title: '数据统计看板',
    html: `
    <div class="stat-grid">
      <div class="stat-card"><div class="sv">${s.total}</div><div class="sl">累计投标数</div><div class="st-trend up">▲ +9 本季度</div></div>
      <div class="stat-card"><div class="sv">${s.won}</div><div class="sl">累计中标数</div><div class="st-trend up">▲ +5 本季度</div></div>
      <div class="stat-card"><div class="sv">${winRate}%</div><div class="sl">累计中标率</div><div class="st-trend up">▲ +8pct 同比</div></div>
      <div class="stat-card"><div class="sv">${s.bidding}</div><div class="sl">在投项目</div></div>
    </div>

    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>中标率趋势<span class="ct-extra">近 7 个季度</span></div>
      <div class="chart-box">${lineChart(s.winRateTrend)}</div>
      <div style="font-size:11.5px;color:var(--text-2);margin-top:6px">📈 中标率从 38% 提升至 61%，AI 辅助标书质量提升效果显著</div>
    </div>

    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>投标漏斗<span class="ct-extra">线索 → 中标</span></div>
      <div class="chart-box">${funnelChart(s.funnel)}</div>
    </div>

    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>中标区域分布</div>
      <div class="chart-box">${donutChart(s.byRegion, '个')}</div>
    </div>

    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>行业分布</div>
      <div class="chart-box">${donutChart(s.byIndustry, '个')}</div>
    </div>

    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>丢标原因分析<span class="ct-extra">共 ${s.lossReasons.reduce((a, b) => a + b.count, 0)} 次</span></div>
      <div class="chart-box">${hBarChart(s.lossReasons)}</div>
      <div style="font-size:11.5px;color:var(--text-2);margin-top:8px;padding:10px;background:#F7F5F1;border-radius:8px">
        💡 改进建议：价格偏高是首要丢标原因（34%），建议加强竞品价格监测；区域业绩不足（25%）可通过联合体投标策略弥补。
      </div>
    </div>

    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>在投项目一览</div>
      ${DB.projects.filter(p => p.status === 'bidding').map(p => `
        <a href="#/bid/${p.id}" style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px dashed var(--line)">
          <div style="flex:1;min-width:0">
            <div style="font-size:12.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(p.name)}</div>
            <div style="font-size:11px;color:var(--text-3)">${fmtMoney(p.budget)} · 中标概率 ${Math.round(p.winProbability*100)}%</div>
          </div>
          <span data-cd="${p.deadline}" class="countdown ${daysUntil(p.deadline) <= 3 ? 'cd-urgent' : 'cd-normal'}" style="font-size:11px"></span>
        </a>`).join('')}
    </div>`
  };
}

/* ---------- 系统设置 ---------- */
function pageSettings() {
  return {
    title: '系统设置',
    html: `
    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>用户管理</div>
      ${DB.members.map(m => `
        <div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px dashed var(--line)">
          <div class="avatar" style="width:34px;height:34px;font-size:13px">${m.avatar}</div>
          <div style="flex:1"><div style="font-size:13px;font-weight:600">${m.name}</div><div style="font-size:11px;color:var(--text-3)">${m.role}</div></div>
          <button class="btn btn-sm btn-ghost" onclick="toast('权限编辑（演示）')">编辑</button>
        </div>`).join('')}
      <button class="btn btn-outline btn-block" style="margin-top:12px" onclick="toast('邀请成员（演示）')">＋ 邀请成员</button>
    </div>

    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>AI 模型配置</div>
      <div class="field"><label>文档解析模型</label>
        <select class="select" onchange="toast('模型已切换（演示）')">
          <option>DeepSeek-V3（文档理解增强）</option>
          <option>通义千问 Max</option>
          <option>本地私有化模型</option>
        </select></div>
      <div class="field"><label>内容生成模型</label>
        <select class="select" onchange="toast('模型已切换（演示）')">
          <option>DeepSeek-V3</option>
          <option>通义千问 Plus</option>
        </select></div>
      <div class="kv-row"><span class="k">解析准确率</span><span class="v" style="color:var(--success)">94.2%（近 30 天）</span></div>
      <div class="kv-row"><span class="k">API 状态</span><span class="v" style="color:var(--success)">● 正常</span></div>
    </div>

    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>提醒设置</div>
      ${['节点提前 3 天提醒', '节点提前 1 天提醒', '任务逾期通知', '资质临期提醒（90/30/7 天）', '邮件通道'].map(t => `
        <div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px dashed var(--line)">
          <span style="flex:1;font-size:13px">${t}</span>
          <label class="switch"><input type="checkbox" checked><span class="sw"></span></label>
        </div>`).join('')}
    </div>

    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>安全与部署</div>
      <div class="kv-row"><span class="k">部署模式</span><span class="v">支持内网私有化部署（Docker）</span></div>
      <div class="kv-row"><span class="k">传输加密</span><span class="v" style="color:var(--success)">HTTPS 已启用</span></div>
      <div class="kv-row"><span class="k">文件加密</span><span class="v" style="color:var(--success)">敏感文件存储加密</span></div>
      <div class="kv-row"><span class="k">数据备份</span><span class="v">每日 02:00 自动备份</span></div>
    </div>

    <div class="card" style="text-align:center;color:var(--text-3);font-size:11.5px">
      格智·电网投标助手 V2.0（全量交付版）<br>格蒂电力 · 售前投标团队 · 演示环境
    </div>`
  };
}

/* ---------- 底部弹出面板 ---------- */
function openSheet(html) {
  let mask = document.querySelector('.sheet-mask');
  let sheet = document.querySelector('.sheet');
  if (!mask) {
    mask = document.createElement('div');
    mask.className = 'sheet-mask';
    mask.onclick = closeSheet;
    document.body.appendChild(mask);
    sheet = document.createElement('div');
    sheet.className = 'sheet';
    document.body.appendChild(sheet);
  }
  sheet.innerHTML = html;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      mask.classList.add('open');
      sheet.classList.add('open');
    });
  });
}
function closeSheet() {
  document.querySelector('.sheet-mask')?.classList.remove('open');
  document.querySelector('.sheet')?.classList.remove('open');
}

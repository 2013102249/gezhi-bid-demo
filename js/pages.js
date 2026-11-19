/* ============================================================
 * 格智·电网投标助手 — 页面：详情/解析/决策/标书/合规/进度
 * ============================================================ */

/* ---------- 项目详情（含子页导航） ---------- */
function projectSubNav(p, active) {
  const items = [
    ['analysis', '📑', '解析'],
    ['decision', '⚖️', '决策'],
    ['proposal', '✍️', '标书'],
    ['compliance', '🛡️', '合规'],
    ['progress', '📋', '进度']
  ];
  return `<div class="mini-tabs">
    ${items.map(it => `<a class="mt ${active === it[0] ? 'active' : ''}" href="#/bid/${p.id}/${it[0]}">${it[1]} ${it[2]}</a>`).join('')}
  </div>`;
}

function pageBidDetail(id) {
  const p = getProject(id);
  if (!p) return page404();
  const a = p.analysis;
  return {
    title: '项目详情',
    html: `
    <div class="card">
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:8px">
        <span class="badge ${STATUS_MAP[p.status].cls}">${STATUS_MAP[p.status].label}</span>
        ${p.decisionResult ? `<span class="badge ${DECISION_MAP[p.decisionResult].cls}">${DECISION_MAP[p.decisionResult].label}</span>` : ''}
        ${p.winProbability ? `<span class="badge st-bidding">中标概率 ${Math.round(p.winProbability*100)}%</span>` : ''}
      </div>
      <div style="font-size:16.5px;font-weight:800;line-height:1.5">${esc(p.name)}</div>
      <div class="kv-row"><span class="k">采购人</span><span class="v">${esc(p.purchaser)}</span></div>
      <div class="kv-row"><span class="k">预算金额</span><span class="v" style="color:var(--primary);font-weight:800">${fmtMoney(p.budget)}</span></div>
      <div class="kv-row"><span class="k">区域 / 行业</span><span class="v">${p.region} · ${p.industry}</span></div>
      <div class="kv-row"><span class="k">创建人</span><span class="v">${p.createdBy} · ${p.createdAt}</span></div>
    </div>

    ${projectSubNav(p, '')}

    <!-- 流程时间线 -->
    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>投标全流程</div>
      <div class="timeline">
        <div class="tl-item ${p.analysis ? 'done' : 'current'}"><div style="font-size:13px;font-weight:600">招标文件解析</div><div style="font-size:11px;color:var(--text-3)">${p.analysis ? '结构化信息已提取' : '等待解析'}</div></div>
        <div class="tl-item ${p.decision ? 'done' : (p.analysis ? 'current' : '')}"><div style="font-size:13px;font-weight:600">投标决策评估</div><div style="font-size:11px;color:var(--text-3)">${p.decision ? p.decision.recommendation === 'bid' ? '建议投标' : p.decision.recommendation === 'caution' ? '谨慎评估' : '建议放弃' : '待评估'}</div></div>
        <div class="tl-item ${p.proposal && !p.proposal.tech.includes('未生成') ? 'done' : ''}"><div style="font-size:13px;font-weight:600">标书智能生成</div><div style="font-size:11px;color:var(--text-3)">${p.proposal && !p.proposal.tech.includes('未生成') ? '初稿已生成，可继续编辑' : '未开始'}</div></div>
        <div class="tl-item ${p.compliance ? 'done' : ''}"><div style="font-size:13px;font-weight:600">标书合规检查</div><div style="font-size:11px;color:var(--text-3)">${p.compliance ? '体检评分 ' + p.compliance.score + ' 分' : '未检查'}</div></div>
        <div class="tl-item ${['won','lost','submitted','pass'].includes(p.status) ? 'done' : (p.status === 'bidding' ? 'current' : '')}"><div style="font-size:13px;font-weight:600">递交与跟踪</div><div style="font-size:11px;color:var(--text-3)">${STATUS_MAP[p.status].label}</div></div>
      </div>
    </div>

    <!-- 关键节点 -->
    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>关键节点</div>
      ${(p.milestones || []).map(ms => {
        const d = daysUntil(ms.date);
        const cls = ms.done ? '' : (d <= 3 ? 'cd-urgent' : d <= 7 ? 'cd-soon' : 'cd-normal');
        return `<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px dashed var(--line)">
          <span style="font-size:14px">${ms.done ? '✅' : '⏳'}</span>
          <span style="flex:1;font-size:13px;${ms.done ? 'color:var(--text-3);text-decoration:line-through' : ''}">${ms.name}</span>
          <span style="font-size:11.5px;color:var(--text-3)">${fmtDate(ms.date)}</span>
          ${ms.done ? '' : `<span class="countdown ${cls}" style="font-size:11.5px" data-cd="${ms.date}">${d < 0 ? '已逾期' : d === 0 ? '今天' : '剩' + d + '天'}</span>`}
        </div>`;
      }).join('') || '<div style="color:var(--text-3);font-size:12.5px">暂无节点，请先完成招标文件解析</div>'}
    </div>`
  };
}

/* ---------- 招标文件解析 ---------- */
function pageAnalysis(id) {
  const p = getProject(id);
  if (!p || !p.analysis) return page404();
  const a = p.analysis;
  const meet = a.qualifications.filter(q => q.status === 'meet').length;
  const gap = a.qualifications.length - meet;
  return {
    title: '招标文件解析',
    html: `
    ${projectSubNav(p, 'analysis')}
    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>解析概览<span class="ct-extra">置信度 94% · 可编辑修正</span></div>
      <div class="stat-grid" style="margin-bottom:0">
        <div class="stat-card"><div class="sv">${a.qualifications.length}</div><div class="sl">资质要求项</div></div>
        <div class="stat-card"><div class="sv" style="color:var(--success)">${meet}</div><div class="sl">初步满足</div></div>
        <div class="stat-card"><div class="sv" style="color:${gap ? 'var(--danger)' : 'inherit'}">${gap}</div><div class="sl">需补充/存疑</div></div>
        <div class="stat-card"><div class="sv" style="color:var(--danger)">${a.rejections.length}</div><div class="sl">废标条款</div></div>
      </div>
    </div>

    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>项目基本信息</div>
      ${a.basic.map(r => `<div class="kv-row"><span class="k">${esc(r[0])}</span><span class="v">${esc(r[1])}</span></div>`).join('')}
    </div>

    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>资质要求自检<span class="ct-extra">对比格蒂现有资质</span></div>
      ${a.qualifications.map(q => `
        <div style="padding:10px 0;border-bottom:1px dashed var(--line)">
          <div style="display:flex;align-items:center;gap:8px">
            <span class="badge ${q.status === 'meet' ? 'st-won' : 'st-lost'}">${q.status === 'meet' ? '✓ 满足' : '✗ 需补充'}</span>
            <span style="font-size:12.5px;font-weight:600">${esc(q.item)}</span>
          </div>
          <div style="font-size:12px;color:var(--text-2);margin-top:5px">要求：${esc(q.req)}</div>
          <div style="font-size:11.5px;color:${q.status === 'meet' ? 'var(--success)' : 'var(--danger)'};margin-top:2px">现状：${esc(q.owned)}</div>
        </div>`).join('')}
      ${gap ? `<div style="margin-top:10px;padding:10px;background:#FFF1F0;border-radius:8px;font-size:12px;color:var(--danger)">
        ⚠️ 发现 ${gap} 项需补充，已标红预警，建议在投标前补齐</div>` : ''}
    </div>

    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>评分标准结构<span class="ct-extra">加权 ${a.scoring.reduce((s, x) => s + x.weight, 0)}%</span></div>
      <div style="margin-bottom:12px">${scoreBar(a.scoring)}</div>
      ${a.scoring.map(s => `
        <div style="margin-bottom:10px">
          <div style="font-size:13px;font-weight:700;color:var(--primary)">${esc(s.name)} · ${s.weight} 分</div>
          ${s.items.map(it => `<div style="display:flex;justify-content:space-between;font-size:12.5px;padding:5px 0 5px 12px;color:var(--text-2)">
            <span>${esc(it.name)}</span><span style="font-weight:700;color:var(--text)">${it.score} 分</span></div>`).join('')}
        </div>`).join('')}
    </div>

    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>⚠️ 废标条款（${a.rejections.length} 条）</div>
      ${a.rejections.map((r, i) => `
        <div style="display:flex;gap:9px;padding:9px 0;${i < a.rejections.length - 1 ? 'border-bottom:1px dashed var(--line)' : ''}">
          <span class="risk risk-high">高</span>
          <span style="font-size:12.5px;color:var(--text-2);flex:1">${esc(r)}</span>
        </div>`).join('')}
      <button class="btn btn-outline btn-block" style="margin-top:12px" onclick="toast('合规自检报告已生成（演示）')">📄 导出自检报告 PDF</button>
    </div>

    <div class="card" style="text-align:center">
      <div style="font-size:12.5px;color:var(--text-2);margin-bottom:10px">解析结果有误？可修正后重新触发 AI 解析</div>
      <button class="btn btn-gold" onclick="toast('已重新触发 AI 解析（演示）')">🔄 重新解析</button>
    </div>`
  };
}

/* ---------- 投标决策评估 ---------- */
function pageDecision(id) {
  const p = getProject(id);
  if (!p || !p.analysis) return page404();
  const d = p.decision;
  const saved = Store.getProject(id).decision;
  const val = saved || d || { budget: p.budget, margin: 0.3, invest: 50, resource: '中等', winRate: [0.4, 0.6], recommendation: null };
  const roi = val.budget * val.margin / Math.max(val.invest, 1);
  const midRate = (val.winRate[0] + val.winRate[1]) / 2;
  const rec = saved ? saved.recommendation : (d ? d.recommendation : null);
  return {
    title: '投标决策评估',
    html: `
    ${projectSubNav(p, 'decision')}
    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>投标价值测算<span class="ct-extra">输入参数实时计算</span></div>
      <div class="field"><label>项目预算（万元）</label><input class="input" type="number" id="dBudget" value="${val.budget}" oninput="calcDecision()"></div>
      <div class="field"><label>预计利润率 <b id="dMarginV" style="color:var(--primary)">${Math.round(val.margin*100)}%</b></label>
        <input type="range" id="dMargin" min="5" max="60" value="${Math.round(val.margin*100)}" style="width:100%;accent-color:var(--primary)" oninput="calcDecision()"></div>
      <div class="field"><label>投标投入成本（万元）</label><input class="input" type="number" id="dInvest" value="${val.invest}" oninput="calcDecision()"></div>
      <div class="field"><label>资源投入强度</label>
        <select class="select" id="dResource" onchange="calcDecision()">
          ${['低', '中等', '高'].map(r => `<option ${val.resource === r ? 'selected' : ''}>${r}</option>`).join('')}
        </select></div>
    </div>

    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>投入产出分析</div>
      <div style="display:flex;gap:12px;align-items:center">
        <div style="flex:1">
          <div class="kv-row"><span class="k">预期毛利</span><span class="v" id="dProfit" style="color:var(--primary);font-weight:800"></span></div>
          <div class="kv-row"><span class="k">投入产出比</span><span class="v" id="dRoi"></span></div>
          <div class="kv-row"><span class="k">中标概率区间</span><span class="v" id="dRate"></span></div>
        </div>
        <div style="text-align:center">
          <div id="dRing"></div>
          <div style="font-size:10.5px;color:var(--text-3);margin-top:2px">中标概率参考</div>
        </div>
      </div>
      <div id="dRecBox" style="margin-top:12px"></div>
    </div>

    ${p.competition ? `
    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>竞争分析<span class="ct-extra">基于历史投标数据</span></div>
      ${p.competition.map(c => `
        <div style="padding:10px 0;border-bottom:1px dashed var(--line)">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:13px;font-weight:700;${c.name === '格蒂电力' ? 'color:var(--primary)' : ''}">${esc(c.name)}${c.name === '格蒂电力' ? '（我方）' : ''}</span>
            <span class="badge ${c.winRate >= 0.25 ? 'st-won' : 'st-draft'}">历史中标率 ${Math.round(c.winRate*100)}%</span>
          </div>
          <div style="display:flex;gap:14px;margin-top:6px;font-size:11.5px">
            <span style="color:var(--success)">优势：${esc(c.strength)}</span>
            <span style="color:var(--warning)">劣势：${esc(c.weakness)}</span>
          </div>
        </div>`).join('')}
    </div>` : ''}

    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>决策建议</div>
      <div id="dRecText">${d ? `<div class="kv-row"><span class="k">结论</span><span class="v"><span class="badge ${DECISION_MAP[d.recommendation].cls}">${DECISION_MAP[d.recommendation].label}</span></span></div>
        <div class="kv-row"><span class="k">理由</span><span class="v" style="font-weight:400">${esc(d.reason)}</span></div>` : '调整左侧参数并保存，系统将给出决策建议'}</div>
      <button class="btn btn-primary btn-block" style="margin-top:10px" onclick="saveDecision('${id}')">💾 保存决策结论</button>
    </div>`
  };
}

function calcDecision() {
  const budget = Number(document.getElementById('dBudget').value) || 0;
  const margin = Number(document.getElementById('dMargin').value) / 100;
  const invest = Number(document.getElementById('dInvest').value) || 1;
  const resource = document.getElementById('dResource').value;
  document.getElementById('dMarginV').textContent = Math.round(margin * 100) + '%';
  const profit = budget * margin;
  const roi = profit / invest;
  /* 模拟概率模型：预算越大竞争越激烈，投入产出比与资源强度加权 */
  let base = 0.35 + Math.min(roi, 20) / 20 * 0.3;
  if (resource === '高') base += 0.06; else if (resource === '低') base -= 0.04;
  if (budget > 2500) base -= 0.08; else if (budget < 800) base += 0.04;
  const rate = Math.max(0.1, Math.min(0.85, base));
  const lo = Math.max(0.05, rate - 0.1), hi = Math.min(0.92, rate + 0.1);
  document.getElementById('dProfit').textContent = '¥' + Math.round(profit) + ' 万';
  document.getElementById('dRoi').textContent = '1 : ' + roi.toFixed(1);
  document.getElementById('dRate').textContent = Math.round(lo*100) + '% ~ ' + Math.round(hi*100) + '%';
  document.getElementById('dRing').innerHTML = probRing(rate, 88);
  const rec = roi >= 8 && rate >= 0.5 ? 'bid' : roi >= 4 ? 'caution' : 'pass';
  const rm = DECISION_MAP[rec];
  document.getElementById('dRecBox').innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:9px;background:#F7F5F1">
      <span class="badge ${rm.cls}" style="font-size:12px">${rm.label}</span>
      <span style="font-size:12px;color:var(--text-2)">${rec === 'bid' ? '投入产出比与中标概率均较优，建议投入资源投标' : rec === 'caution' ? '综合条件一般，建议评审会讨论后决策' : '投入产出比偏低，建议放弃或寻求合作'}</span>
    </div>`;
  document.getElementById('dRecBox').dataset.rec = rec;
}

function saveDecision(id) {
  const rec = (document.getElementById('dRecBox').dataset.rec) || 'caution';
  const val = {
    budget: Number(document.getElementById('dBudget').value),
    margin: Number(document.getElementById('dMargin').value) / 100,
    invest: Number(document.getElementById('dInvest').value),
    resource: document.getElementById('dResource').value,
    winRate: [0.4, 0.6], recommendation: rec
  };
  Store.setProject(id, { decision: val });
  const p = getProject(id);
  if (p) { p.decision = val; p.decisionResult = rec; p.winProbability = 0.55; if (p.status === 'analyzing' || p.status === 'draft') p.status = 'deciding'; }
  toast('决策结论已保存：' + DECISION_MAP[rec].label);
  setTimeout(() => router(), 600);
}

/* ---------- 标书编辑器 ---------- */
function pageProposal(id) {
  const p = getProject(id);
  if (!p) return page404();
  const saved = Store.getProject(id).proposal || {};
  const tech = saved.tech || p.proposal.tech;
  const biz = saved.business || p.proposal.business;
  return {
    title: '标书编辑器',
    actions: `<button class="icon-btn" onclick="saveProposal('${id}')" title="保存">💾</button>`,
    html: `
    ${projectSubNav(p, 'proposal')}
    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>AI 辅助生成<span class="ct-extra">基于历史中标标书库</span></div>
      <div style="font-size:12px;color:var(--text-2);margin-bottom:10px">AI 将参考 ${DB.cases.length} 个历史中标案例与 ${DB.templates.length} 套方案模板，按评分标准逐条对应生成初稿</div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-gold" style="flex:1" onclick="aiGenerate('${id}','tech')">⚡ 生成技术方案</button>
        <button class="btn btn-outline" style="flex:1" onclick="aiGenerate('${id}','business')">📎 组装商务文件</button>
      </div>
      <div id="genProgress" style="display:none;margin-top:12px">
        <div class="pbar gold"><i style="width:0%" id="genBar"></i></div>
        <div style="font-size:11.5px;color:var(--text-3);margin-top:6px" id="genText">正在检索历史标书…</div>
      </div>
    </div>

    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>技术方案编辑</div>
      <div class="editor-toolbar">
        <button class="et-btn" onclick="insertText('techEditor','【章节】')">+ 章节</button>
        <button class="et-btn" onclick="insertText('techEditor','【评分项对应】')">+ 评分对应</button>
        <button class="et-btn" onclick="toast('已插入标准图表占位（演示）')">+ 图表</button>
        <span style="margin-left:auto;font-size:11px;color:var(--text-3)" id="techCount">${tech.length} 字</span>
      </div>
      <textarea class="textarea" id="techEditor" style="min-height:220px" oninput="document.getElementById('techCount').textContent=this.value.length+' 字'">${esc(tech)}</textarea>
    </div>

    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>商务文件编辑</div>
      <textarea class="textarea" id="bizEditor" style="min-height:140px">${esc(biz)}</textarea>
    </div>

    <button class="btn btn-primary btn-block" onclick="saveProposal('${id}')">💾 保存标书内容</button>
    <div style="text-align:center;margin-top:10px"><a href="#/bid/${id}/compliance" style="font-size:12.5px;color:var(--primary)">下一步：标书合规检查 →</a></div>`
  };
}

const AI_TECH_SAMPLE = `一、项目概述
本项目为国网${'某'}电力公司输配电系统建设项目，我司依托 GD 系列产品线与多年电网信息化经验，提供端到端整体解决方案。

二、总体技术架构
系统采用"云-边-端"三层架构：云端部署主站平台，边侧部署汇聚节点，终端侧接入 FTU/DTU/TTU 及传感装置，通过 104/61850 协议与主站交互，支持百万级终端接入。

三、技术方案要点（对应评分项）
1. 方案完整性与可行性（18分）：提供 WBS 分解与里程碑计划，交付周期承诺 90 日历天；
2. 设备技术参数响应（15分）：GD-3000 系列终端全部参数正偏离响应，详见技术偏离表；
3. 实施与售后方案（12分）：7×24 响应机制，SLA 99.95%，备品备件本地化仓储。

四、实施路径
合同签订后 T+7 完成详细设计，T+45 完成设备到货与安装，T+80 完成联调，T+90 完成试运行并移交。

五、团队配置
项目经理：张伟（一级建造师，10 年电网项目经验）；技术负责人：周明（高级工程师）；交付团队 12 人。`;

function aiGenerate(id, kind) {
  const box = document.getElementById('genProgress');
  const bar = document.getElementById('genBar');
  const txt = document.getElementById('genText');
  box.style.display = '';
  const steps = kind === 'tech'
    ? ['正在检索历史中标标书…', '匹配相似项目架构…', '按评分标准逐条生成…', '润色与合规性检查…']
    : ['正在调取资质库…', '匹配最相关业绩案例…', '生成投标函与证明文件…'];
  let i = 0;
  const next = () => {
    if (i < steps.length) {
      txt.textContent = steps[i];
      bar.style.width = ((i + 1) / steps.length * 100) + '%';
      i++;
      setTimeout(next, 500);
    } else {
      if (kind === 'tech') {
        document.getElementById('techEditor').value = AI_TECH_SAMPLE;
        document.getElementById('techCount').textContent = AI_TECH_SAMPLE.length + ' 字';
      } else {
        document.getElementById('bizEditor').value = '商务文件已自动组装：\n1. 投标函（标准格式）\n2. 法定代表人身份证明\n3. 授权委托书\n4. 企业营业执照 / 资质证书（自动调取资质库）\n5. 业绩案例：' + DB.cases.slice(0, 3).map(c => c.name).join('；') + '\n6. 财务审计报告（2023-2025 年度）';
      }
      toast(kind === 'tech' ? '技术方案初稿已生成，可直接编辑' : '商务文件已自动组装完成');
      setTimeout(() => { box.style.display = 'none'; bar.style.width = '0%'; }, 800);
    }
  };
  next();
}

function saveProposal(id) {
  const tech = document.getElementById('techEditor').value;
  const biz = document.getElementById('bizEditor').value;
  Store.setProject(id, { proposal: { tech, business: biz } });
  const p = getProject(id);
  if (p) p.proposal = { tech, business: biz };
  toast('标书内容已保存（自动实时保存已开启）');
}

function insertText(elId, text) {
  const el = document.getElementById(elId);
  const pos = el.selectionStart;
  el.value = el.value.slice(0, pos) + text + el.value.slice(pos);
  el.focus();
  el.selectionStart = el.selectionEnd = pos + text.length;
}

/* ---------- 标书合规检查 ---------- */
function pageCompliance(id) {
  const p = getProject(id);
  if (!p) return page404();
  const c = Store.getProject(id).compliance || p.compliance;
  const savedProposal = Store.getProject(id).proposal || {};
  const hasProposal = (savedProposal.tech || p.proposal.tech || '').length > 30;
  return {
    title: '标书合规检查',
    html: `
    ${projectSubNav(p, 'compliance')}
    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>标书体检<span class="ct-extra">AI 全量检查</span></div>
      ${c ? `
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:12px">
          <div style="text-align:center">
            <div style="font-size:30px;font-weight:800;color:${c.score >= 90 ? 'var(--success)' : c.score >= 75 ? 'var(--warning)' : 'var(--danger)'}">${c.score}</div>
            <div style="font-size:10.5px;color:var(--text-3)">体检评分</div>
          </div>
          <div style="flex:1;font-size:12px;color:var(--text-2)">
            检查时间：${c.checkedAt}<br>
            通过 ${c.items.filter(i => i.type === 'pass').length} 项 ·
            警告 ${c.items.filter(i => i.type === 'warn').length} 项 ·
            风险 ${c.items.filter(i => i.type === 'fail').length} 项
          </div>
        </div>` : ''}
      <button class="btn btn-gold btn-block" onclick="runCompliance('${id}')">${c ? '🔄 重新检查' : '🛡️ 开始标书体检'}</button>
      ${!hasProposal ? `<div style="font-size:11.5px;color:var(--warning);margin-top:8px">⚠️ 当前标书内容较少，建议先在「标书」页生成内容</div>` : ''}
    </div>
    <div id="complianceResult"></div>`
  };
}

function runCompliance(id) {
  const p = getProject(id);
  const area = document.getElementById('complianceResult');
  area.innerHTML = `<div class="card"><div class="card-title"><span class="ct-bar"></span>检查进行中</div>
    <div class="pbar gold"><i style="width:0%" id="cmpBar"></i></div>
    <div style="font-size:12px;color:var(--text-2);margin-top:8px" id="cmpText">比对招标文件要求…</div></div>`;
  const steps = [
    ['比对招标文件要求…', 25],
    ['检查资质响应完整性…', 50],
    ['核对评分项逐条对应…', 70],
    ['检查签字盖章与格式封装…', 90],
    ['生成体检报告…', 100]
  ];
  let i = 0;
  const next = () => {
    if (i < steps.length) {
      document.getElementById('cmpBar').style.width = steps[i][1] + '%';
      document.getElementById('cmpText').textContent = steps[i][0];
      i++;
      setTimeout(next, 480);
    } else {
      const a = p.analysis;
      const items = [
        { type: 'pass', text: `已响应全部 ${a.qualifications.length} 项资质要求` },
        { type: 'pass', text: `评分标准 ${a.scoring.reduce((s, x) => s + x.items.length, 0)} 个打分项已逐条对应` },
        { type: 'pass', text: '投标函、授权文件格式符合范本要求' }
      ];
      if (a.qualifications.some(q => q.status === 'gap')) items.push({ type: 'warn', text: '存在需补充资质项，投标前需确认补齐情况' });
      items.push({ type: 'fail', text: '页码编制与密封要求需人工最终复核' });
      const score = 78 + Math.floor(Math.random() * 18);
      const result = { score, checkedAt: nowStr().slice(0, 10), items };
      Store.setProject(id, { compliance: result });
      renderComplianceResult(result);
      toast('体检完成：' + score + ' 分，发现 ' + items.filter(x => x.type !== 'pass').length + ' 处待处理');
    }
  };
  next();
}

function renderComplianceResult(c) {
  document.getElementById('complianceResult').innerHTML = `
    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>体检报告<span class="ct-extra">${c.checkedAt}</span></div>
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:12px">
        <div style="text-align:center">
          <div style="font-size:30px;font-weight:800;color:${c.score >= 90 ? 'var(--success)' : c.score >= 75 ? 'var(--warning)' : 'var(--danger)'}">${c.score}</div>
          <div style="font-size:10.5px;color:var(--text-3)">体检评分</div>
        </div>
        <div style="flex:1">
          <div class="pbar"><i style="width:${c.score}%;background:${c.score >= 90 ? 'var(--success)' : c.score >= 75 ? 'var(--warning)' : 'var(--danger)'}"></i></div>
        </div>
      </div>
      ${c.items.map(it => `
        <div style="display:flex;gap:9px;padding:9px 0;border-bottom:1px dashed var(--line)">
          <span style="font-size:14px">${it.type === 'pass' ? '✅' : it.type === 'warn' ? '⚠️' : '❌'}</span>
          <span style="font-size:12.5px;color:var(--text-2);flex:1">${esc(it.text)}</span>
        </div>`).join('')}
      <button class="btn btn-outline btn-block" style="margin-top:12px" onclick="toast('体检报告 PDF 导出成功（演示）')">📄 导出体检报告</button>
    </div>`;
}

/* ---------- 进度看板 ---------- */
function pageProgress(id) {
  const p = getProject(id);
  if (!p) return page404();
  const tasks = (p.progress || []).map(t => ({ ...t, status: Store.getTask(id, t.id) || t.status }));
  const done = tasks.filter(t => t.status === 'done').length;
  const pct = tasks.length ? Math.round(done / tasks.length * 100) : 0;
  return {
    title: '进度看板',
    html: `
    ${projectSubNav(p, 'progress')}
    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>项目进度<span class="ct-extra">${done}/${tasks.length} 已完成</span></div>
      <div class="pbar" style="height:8px"><i style="width:${pct}%"></i></div>
      <div style="display:flex;justify-content:space-between;margin-top:6px;font-size:11.5px;color:var(--text-3)">
        <span>完成度 ${pct}%</span>
        <span data-cd="${p.deadline}" class="countdown ${daysUntil(p.deadline) <= 3 ? 'cd-urgent' : 'cd-normal'}"></span>
      </div>
    </div>

    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>任务列表<span class="ct-extra">点击状态可更新</span></div>
      ${tasks.length ? tasks.map(t => {
        const d = daysUntil(t.due);
        const overdue = t.status !== 'done' && d !== null && d < 0;
        return `<div style="padding:11px 0;border-bottom:1px dashed var(--line)">
          <div style="display:flex;align-items:center;gap:8px">
            <span style="font-size:14px">${t.status === 'done' ? '✅' : overdue ? '🔴' : t.status === 'in_progress' ? '🔵' : '⚪'}</span>
            <span style="flex:1;font-size:13px;font-weight:600;${t.status === 'done' ? 'color:var(--text-3);text-decoration:line-through' : ''}">${esc(t.title)}</span>
            <select class="select" style="width:auto;min-height:30px;padding:4px 26px 4px 8px;font-size:11.5px" onchange="updateTask('${id}','${t.id}',this.value)">
              <option value="pending" ${t.status === 'pending' ? 'selected' : ''}>待处理</option>
              <option value="in_progress" ${t.status === 'in_progress' ? 'selected' : ''}>进行中</option>
              <option value="done" ${t.status === 'done' ? 'selected' : ''}>已完成</option>
            </select>
          </div>
          <div style="display:flex;gap:12px;margin-top:5px;font-size:11.5px;color:var(--text-3);padding-left:22px">
            <span>👤 ${esc(t.assignee)}</span>
            <span style="${overdue ? 'color:var(--danger);font-weight:700' : ''}">📅 ${fmtDate(t.due)}${overdue ? '（已逾期）' : ''}</span>
            ${t.status !== 'done' && d !== null && d >= 0 ? `<span data-cd="${t.due}" class="countdown ${d <= 1 ? 'cd-urgent' : d <= 3 ? 'cd-soon' : 'cd-normal'}" style="font-size:11px"></span>` : ''}
          </div>
        </div>`;
      }).join('') : '<div class="empty"><div class="e-t">暂无任务</div></div>'}
    </div>

    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>节点倒计时<span class="ct-extra">逾期自动标红</span></div>
      ${(p.milestones || []).map(ms => {
        const d = daysUntil(ms.date);
        const cls = ms.done ? '' : (d <= 3 ? 'cd-urgent' : d <= 7 ? 'cd-soon' : 'cd-normal');
        return `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px dashed var(--line)">
          <span>${ms.done ? '✅' : '⏳'}</span>
          <span style="flex:1;font-size:13px">${ms.name}</span>
          <span style="font-size:11.5px;color:var(--text-3)">${fmtDate(ms.date)}</span>
          ${ms.done ? '<span class="badge st-won">已完成</span>' : `<span class="countdown ${cls}" style="font-size:11.5px" data-cd="${ms.date}">${d < 0 ? '已逾期' : d === 0 ? '今天' : '剩'+d+'天'}</span>`}
        </div>`;
      }).join('')}
    </div>

    <div class="card">
      <div class="card-title"><span class="ct-bar"></span>提醒设置<span class="ct-extra">站内+邮件双通道</span></div>
      <div style="display:flex;align-items:center;gap:10px;padding:6px 0">
        <span style="flex:1;font-size:13px">关键节点提前 3 天提醒</span>
        <label class="switch"><input type="checkbox" checked><span class="sw"></span></label>
      </div>
      <div style="display:flex;align-items:center;gap:10px;padding:6px 0">
        <span style="flex:1;font-size:13px">关键节点提前 1 天提醒</span>
        <label class="switch"><input type="checkbox" checked><span class="sw"></span></label>
      </div>
      <div style="display:flex;align-items:center;gap:10px;padding:6px 0">
        <span style="flex:1;font-size:13px">任务逾期即时通知</span>
        <label class="switch"><input type="checkbox" checked><span class="sw"></span></label>
      </div>
    </div>`
  };
}

function updateTask(pid, tid, status) {
  Store.setTask(pid, tid, status);
  toast(status === 'done' ? '任务已完成 🎉' : '任务状态已更新');
  router();
}

/* ---------- 404 ---------- */
function page404() {
  return { title: '未找到', html: `<div class="empty"><div class="e-icon">🔍</div><div class="e-t">项目不存在或尚未解析</div><br><a class="btn btn-primary" href="#/bid/list">返回项目列表</a></div>` };
}

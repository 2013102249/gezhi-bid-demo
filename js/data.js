/* ============================================================
 * 格智·电网投标助手 — 数据层（Mock）
 * 覆盖 PRD 5.x 核心数据模型：bid_project / qualification / case / task
 * ============================================================ */

const DB = {
  /* ---------- 投标项目（bid_project） ---------- */
  projects: [
    {
      id: 'bp-1001',
      name: '国网河南省电力公司2026年配网自动化终端采购项目',
      budget: 1860, purchaser: '国网河南省电力公司', agency: '河南电力物资招标代理有限公司',
      region: '河南', industry: '电网自动化', type: '设备采购',
      status: 'bidding', decisionResult: 'bid', winProbability: 0.68,
      createdBy: '张伟', createdAt: '2026-09-02',
      deadline: '2026-10-18 09:30',
      milestones: [
        { name: '报名截止', date: '2026-09-25 17:00', done: true },
        { name: '保证金截止', date: '2026-10-10 17:00', done: true },
        { name: '投标截止', date: '2026-10-18 09:30', done: false },
        { name: '开标时间', date: '2026-10-19 10:00', done: false }
      ],
      analysis: {
        basic: [
          ['项目名称', '国网河南省电力公司2026年配网自动化终端采购项目'],
          ['项目编号', 'HNDL-2026-0930'],
          ['预算金额', '1860 万元'],
          ['采购人', '国网河南省电力公司'],
          ['代理机构', '河南电力物资招标代理有限公司'],
          ['交付周期', '合同签订后 90 日历天内交付并安装调试完毕']
        ],
        qualifications: [
          { item: '企业资质', req: '具有 ISO9001 质量管理体系认证证书', status: 'meet', owned: 'ISO9001（有效期至 2027-06）' },
          { item: '企业资质', req: '电力工程施工总承包三级及以上资质', status: 'meet', owned: '电力工程施工总承包二级' },
          { item: '人员资质', req: '项目负责人须具备机电工程一级建造师注册证书', status: 'gap', owned: '现有一级建造师 2 名（王强、李辉）' },
          { item: '业绩要求', req: '2021 年以来至少 3 个 500 万以上配网自动化同类业绩', status: 'meet', owned: '符合业绩 5 个' },
          { item: '财务要求', req: '2023-2025 年度经审计财务报表，无重大亏损', status: 'meet', owned: '三年审计报告齐备' }
        ],
        scoring: [
          { name: '技术部分', weight: 45, items: [
            { name: '技术方案完整性与可行性', score: 18 },
            { name: '设备技术参数响应程度', score: 15 },
            { name: '项目实施与售后方案', score: 12 }
          ]},
          { name: '商务部分', weight: 35, items: [
            { name: '企业资质与综合实力', score: 12 },
            { name: '类似项目业绩', score: 15 },
            { name: '财务状况', score: 8 }
          ]},
          { name: '价格部分', weight: 20, items: [ { name: '投标报价（最低价基准法）', score: 20 } ]}
        ],
        rejections: [
          '投标文件未按要求密封或未在规定时间送达的，否决投标',
          '未提供有效 ISO9001 认证证书的，否决投标',
          '投标报价超过最高限价 1860 万元的，否决投标',
          '同一投标人提交两个以上不同投标报价且未声明哪个有效的，否决投标'
        ]
      },
      decision: {
        budget: 1860, margin: 0.32, invest: 45, resource: '中等',
        winRate: [0.62, 0.74], recommendation: 'bid',
        reason: '项目预算充足（1860 万），与我司配网自动化产品线高度匹配；历史同类项目中标率 68%，投入产出比约 1:13，建议投标。'
      },
      competition: [
        { name: '许继电气', winRate: 0.24, strength: '本地化服务网点多', weakness: '价格偏高' },
        { name: '国电南自', winRate: 0.18, strength: '品牌背书强', weakness: '交付周期长' },
        { name: '格蒂电力', winRate: 0.31, strength: '方案定制化能力强', weakness: '品牌知名度待提升' }
      ],
      proposal: {
        tech: '【已生成初稿】本方案针对国网河南配网自动化终端采购项目，基于格蒂电力 GD-3000 系列 FTU/DTU/TTU 终端…',
        business: '【已生成初稿】商务部分包含：投标函、法定代表人身份证明、授权委托书、企业资质证书、业绩证明、财务审计报告…'
      },
      compliance: {
        score: 92, checkedAt: '2026-10-12',
        items: [
          { type: 'pass', text: '已响应全部 5 项资质要求' },
          { type: 'pass', text: '评分标准 8 个打分项已逐条对应' },
          { type: 'warn', text: '项目负责人注册证书扫描件临期，建议更新' },
          { type: 'fail', text: '投标函日期与开标日期逻辑需人工复核' }
        ]
      },
      progress: [
        { id: 't-1', title: '技术方案初稿编制', assignee: '李婷', due: '2026-10-08 18:00', status: 'done' },
        { id: 't-2', title: '商务文件组装与复核', assignee: '王芳', due: '2026-10-14 18:00', status: 'done' },
        { id: 't-3', title: '标书合规检查', assignee: '张伟', due: '2026-10-15 18:00', status: 'in_progress' },
        { id: 't-4', title: '打印封装与盖章', assignee: '行政部', due: '2026-10-17 18:00', status: 'pending' },
        { id: 't-5', title: '投标文件送达', assignee: '张伟', due: '2026-10-18 09:00', status: 'pending' }
      ]
    },
    {
      id: 'bp-1002',
      name: '国网冀北电力有限公司输电线路在线监测装置升级改造项目',
      budget: 3200, purchaser: '国网冀北电力有限公司', agency: '北京国电工程招标有限公司',
      region: '河北', industry: '在线监测', type: '技术改造',
      status: 'deciding', decisionResult: 'caution', winProbability: 0.45,
      createdBy: '刘洋', createdAt: '2026-09-20',
      deadline: '2026-11-05 09:00',
      milestones: [
        { name: '报名截止', date: '2026-10-22 17:00', done: false },
        { name: '保证金截止', date: '2026-10-30 17:00', done: false },
        { name: '投标截止', date: '2026-11-05 09:00', done: false },
        { name: '开标时间', date: '2026-11-06 10:00', done: false }
      ],
      analysis: {
        basic: [
          ['项目名称', '国网冀北电力有限公司输电线路在线监测装置升级改造项目'],
          ['项目编号', 'JBQD-2026-1122'],
          ['预算金额', '3200 万元'],
          ['采购人', '国网冀北电力有限公司'],
          ['代理机构', '北京国电工程招标有限公司'],
          ['交付周期', '分两批次实施，总周期 150 日历天']
        ],
        qualifications: [
          { item: '企业资质', req: 'ISO14001 环境管理体系认证', status: 'meet', owned: 'ISO14001（有效期至 2028-03）' },
          { item: '人员资质', req: '项目经理具备 PMP 或信息系统项目管理师', status: 'meet', owned: '信息系统项目管理师 3 名' },
          { item: '业绩要求', req: '2022 年以来 2 个 1000 万以上在线监测业绩', status: 'meet', owned: '符合业绩 3 个' },
          { item: '检测要求', req: '装置通过中国电科院专项检测', status: 'gap', owned: 'GD-100 系列已通过；GD-200 待送检' }
        ],
        scoring: [
          { name: '技术部分', weight: 50, items: [
            { name: '监测方案技术先进性', score: 20 },
            { name: '设备性能指标', score: 18 },
            { name: '改造实施方案', score: 12 }
          ]},
          { name: '商务部分', weight: 30, items: [
            { name: '类似业绩', score: 18 },
            { name: '企业综合实力', score: 12 }
          ]},
          { name: '价格部分', weight: 20, items: [ { name: '投标报价', score: 20 } ]}
        ],
        rejections: [
          '未通过中国电科院专项检测的产品参与投标的，否决投标',
          '投标保证金未从基本户汇出的，否决投标'
        ]
      },
      decision: {
        budget: 3200, margin: 0.22, invest: 80, resource: '高',
        winRate: [0.35, 0.55], recommendation: 'caution',
        reason: '项目金额大（3200 万）但技术门槛高，GD-200 产品检测未完成；预计利润率偏低（22%），资源投入大。建议谨慎评估，待检测通过后决策。'
      },
      competition: [
        { name: '国网信通', winRate: 0.32, strength: '集团内部协同', weakness: '定制响应慢' },
        { name: '东方电子', winRate: 0.21, strength: '监测产品线全', weakness: '价格高' },
        { name: '格蒂电力', winRate: 0.26, strength: '改造经验丰富', weakness: '新产品检测周期' }
      ],
      proposal: { tech: '【未生成】等待投标决策确认后生成', business: '【未生成】' },
      compliance: null,
      progress: [
        { id: 't-1', title: 'GD-200 产品电科院送检', assignee: '技术部', due: '2026-10-20 18:00', status: 'in_progress' },
        { id: 't-2', title: '竞争对手调研', assignee: '刘洋', due: '2026-10-18 18:00', status: 'done' },
        { id: 't-3', title: '投标决策评审会', assignee: '管理层', due: '2026-10-25 14:00', status: 'pending' }
      ]
    },
    {
      id: 'bp-1003',
      name: '国网山东电力公司配电物联网主站系统建设项目',
      budget: 2450, purchaser: '国网山东省电力公司', agency: '山东鲁能招标有限公司',
      region: '山东', industry: '配电物联网', type: '系统建设',
      status: 'won', decisionResult: 'bid', winProbability: 0.72,
      createdBy: '张伟', createdAt: '2026-07-15',
      deadline: '2026-08-28 09:00',
      milestones: [
        { name: '报名截止', date: '2026-07-28 17:00', done: true },
        { name: '保证金截止', date: '2026-08-10 17:00', done: true },
        { name: '投标截止', date: '2026-08-28 09:00', done: true },
        { name: '开标时间', date: '2026-08-29 10:00', done: true }
      ],
      analysis: {
        basic: [
          ['项目名称', '国网山东电力公司配电物联网主站系统建设项目'],
          ['项目编号', 'SDWL-2026-0708'],
          ['预算金额', '2450 万元'],
          ['采购人', '国网山东省电力公司'],
          ['代理机构', '山东鲁能招标有限公司'],
          ['交付周期', '180 日历天，含 3 个月试运行']
        ],
        qualifications: [
          { item: '企业资质', req: 'CMMI 3 级及以上', status: 'meet', owned: 'CMMI 5 级' },
          { item: '企业资质', req: 'ISO27001 信息安全管理体系认证', status: 'meet', owned: 'ISO27001（有效期至 2028-01）' },
          { item: '人员资质', req: '技术负责人具备高级工程师职称', status: 'meet', owned: '高级工程师 6 名' },
          { item: '业绩要求', req: '2020 年以来 3 个千万级配电物联网业绩', status: 'meet', owned: '符合业绩 4 个' }
        ],
        scoring: [
          { name: '技术部分', weight: 45, items: [
            { name: '主站系统架构设计', score: 18 },
            { name: '功能完整性响应', score: 15 },
            { name: '实施与服务方案', score: 12 }
          ]},
          { name: '商务部分', weight: 35, items: [
            { name: '企业资质', score: 10 },
            { name: '项目业绩', score: 17 },
            { name: '财务与信誉', score: 8 }
          ]},
          { name: '价格部分', weight: 20, items: [ { name: '投标报价', score: 20 } ]}
        ],
        rejections: ['未提供 CMMI 证书的，否决投标', '系统演示环节未到场或演示失败的，否决投标']
      },
      decision: {
        budget: 2450, margin: 0.35, invest: 60, resource: '中等',
        winRate: [0.65, 0.80], recommendation: 'bid',
        reason: '我司优势领域，历史同类中标率 72%，资质完全满足，投入产出比约 1:14，强烈建议投标。'
      },
      competition: [
        { name: '朗新科技', winRate: 0.20, strength: '主站产品成熟', weakness: '价格高' },
        { name: '南网数字', winRate: 0.15, strength: '南网案例多', weakness: '北方交付资源少' },
        { name: '格蒂电力', winRate: 0.35, strength: '物联终端+主站一体', weakness: '—' }
      ],
      proposal: {
        tech: '【已定稿】配电物联网主站系统采用云原生微服务架构，支持百万级终端接入…',
        business: '【已定稿】'
      },
      compliance: {
        score: 96, checkedAt: '2026-08-20',
        items: [
          { type: 'pass', text: '全部资质要求满足' },
          { type: 'pass', text: '8 个评分项全部响应' },
          { type: 'pass', text: '签字盖章、页码封装符合要求' }
        ]
      },
      progress: [
        { id: 't-1', title: '主站架构设计', assignee: '架构组', due: '2026-08-01 18:00', status: 'done' },
        { id: 't-2', title: '系统演示准备', assignee: '售前组', due: '2026-08-25 18:00', status: 'done' },
        { id: 't-3', title: '投标文件送达', assignee: '张伟', due: '2026-08-28 09:00', status: 'done' }
      ]
    },
    {
      id: 'bp-1004',
      name: '国网江苏电力公司营销稽查监控平台升级项目',
      budget: 980, purchaser: '国网江苏省电力有限公司', agency: '江苏兴光招标代理有限公司',
      region: '江苏', industry: '营销信息化', type: '平台升级',
      status: 'lost', decisionResult: 'bid', winProbability: 0.41,
      createdBy: '刘洋', createdAt: '2026-06-10',
      deadline: '2026-07-30 09:00',
      milestones: [
        { name: '报名截止', date: '2026-06-28 17:00', done: true },
        { name: '保证金截止', date: '2026-07-15 17:00', done: true },
        { name: '投标截止', date: '2026-07-30 09:00', done: true },
        { name: '开标时间', date: '2026-07-31 10:00', done: true }
      ],
      analysis: {
        basic: [
          ['项目名称', '国网江苏电力公司营销稽查监控平台升级项目'],
          ['项目编号', 'JSDL-2026-0612'],
          ['预算金额', '980 万元'],
          ['采购人', '国网江苏省电力有限公司'],
          ['代理机构', '江苏兴光招标代理有限公司'],
          ['交付周期', '120 日历天']
        ],
        qualifications: [
          { item: '企业资质', req: 'ISO9001 认证', status: 'meet', owned: '满足' },
          { item: '人员资质', req: '熟悉江苏营销业务的分析师 2 名', status: 'gap', owned: '本地化人员储备不足' },
          { item: '业绩要求', req: '江苏区域营销类业绩 1 个', status: 'gap', owned: '无江苏区域业绩' }
        ],
        scoring: [
          { name: '技术部分', weight: 40, items: [ { name: '平台升级方案', score: 40 } ]},
          { name: '商务部分', weight: 40, items: [ { name: '区域业绩', score: 40 } ]},
          { name: '价格部分', weight: 20, items: [ { name: '投标报价', score: 20 } ]}
        ],
        rejections: ['未提供江苏本地服务承诺函的，否决投标']
      },
      decision: {
        budget: 980, margin: 0.28, invest: 35, resource: '低',
        winRate: [0.30, 0.50], recommendation: 'bid',
        reason: '区域业绩缺失但方案能力可弥补，中标概率中等，建议投标锻炼团队。'
      },
      competition: [
        { name: '江苏金智', winRate: 0.38, strength: '本地业绩深厚', weakness: '技术创新弱' },
        { name: '朗新科技', winRate: 0.22, strength: '营销产品成熟', weakness: '价格高' }
      ],
      proposal: { tech: '【已定稿】', business: '【已定稿】' },
      compliance: {
        score: 85, checkedAt: '2026-07-25',
        items: [
          { type: 'pass', text: '资质基本满足' },
          { type: 'warn', text: '区域业绩弱项已在方案中重点弥补' }
        ]
      },
      progress: [
        { id: 't-1', title: '方案编制', assignee: '售前组', due: '2026-07-10 18:00', status: 'done' },
        { id: 't-2', title: '投标送达', assignee: '刘洋', due: '2026-07-30 09:00', status: 'done' }
      ]
    },
    {
      id: 'bp-1005',
      name: '国网浙江电力公司调控云平台运维服务项目',
      budget: 650, purchaser: '国网浙江省电力有限公司', agency: '浙江浙电招标有限公司',
      region: '浙江', industry: '运维服务', type: '运维服务',
      status: 'submitted', decisionResult: 'bid', winProbability: 0.58,
      createdBy: '王芳', createdAt: '2026-09-08',
      deadline: '2026-10-10 09:00',
      milestones: [
        { name: '报名截止', date: '2026-09-20 17:00', done: true },
        { name: '保证金截止', date: '2026-09-28 17:00', done: true },
        { name: '投标截止', date: '2026-10-10 09:00', done: true },
        { name: '开标时间', date: '2026-10-11 10:00', done: true }
      ],
      analysis: {
        basic: [
          ['项目名称', '国网浙江电力公司调控云平台运维服务项目'],
          ['项目编号', 'ZJDL-2026-0905'],
          ['预算金额', '650 万元'],
          ['采购人', '国网浙江省电力有限公司'],
          ['代理机构', '浙江浙电招标有限公司'],
          ['交付周期', '12 个月']
        ],
        qualifications: [
          { item: '企业资质', req: 'ISO20000 信息技术服务管理体系', status: 'meet', owned: 'ISO20000（有效期至 2027-09）' },
          { item: '人员资质', req: '运维工程师 8 名以上', status: 'meet', owned: '持证运维 12 名' },
          { item: '业绩要求', req: '2 个调控云类运维业绩', status: 'meet', owned: '符合业绩 3 个' }
        ],
        scoring: [
          { name: '技术部分', weight: 50, items: [ { name: '运维服务方案', score: 30 }, { name: '人员配置', score: 20 } ]},
          { name: '商务部分', weight: 30, items: [ { name: '运维业绩', score: 18 }, { name: '服务承诺', score: 12 } ]},
          { name: '价格部分', weight: 20, items: [ { name: '投标报价', score: 20 } ]}
        ],
        rejections: ['未提供服务承诺函的，否决投标']
      },
      decision: {
        budget: 650, margin: 0.30, invest: 22, resource: '低',
        winRate: [0.48, 0.68], recommendation: 'bid',
        reason: '运维类项目与我司现有调控云团队匹配，投入小风险低，建议投标。'
      },
      competition: [
        { name: '中国软件', winRate: 0.26, strength: '品牌大', weakness: '响应慢' },
        { name: '格蒂电力', winRate: 0.30, strength: '原厂运维经验', weakness: '—' }
      ],
      proposal: { tech: '【已定稿】', business: '【已定稿】' },
      compliance: {
        score: 90, checkedAt: '2026-10-06',
        items: [
          { type: 'pass', text: '资质全部满足' },
          { type: 'pass', text: '人员配置满足要求' }
        ]
      },
      progress: [
        { id: 't-1', title: '运维方案编制', assignee: '王芳', due: '2026-09-28 18:00', status: 'done' },
        { id: 't-2', title: '投标送达', assignee: '王芳', due: '2026-10-10 09:00', status: 'done' }
      ]
    },
    {
      id: 'bp-1006',
      name: '国网安徽电力公司变电站智能巡检系统建设项目',
      budget: 1500, purchaser: '国网安徽省电力有限公司', agency: '安徽皖电招标有限公司',
      region: '安徽', industry: '智能巡检', type: '系统建设',
      status: 'analyzing', decisionResult: null, winProbability: null,
      createdBy: '李婷', createdAt: '2026-10-08',
      deadline: '2026-11-20 09:00',
      milestones: [
        { name: '报名截止', date: '2026-11-01 17:00', done: false },
        { name: '保证金截止', date: '2026-11-12 17:00', done: false },
        { name: '投标截止', date: '2026-11-20 09:00', done: false },
        { name: '开标时间', date: '2026-11-21 10:00', done: false }
      ],
      analysis: {
        basic: [
          ['项目名称', '国网安徽电力公司变电站智能巡检系统建设项目'],
          ['项目编号', 'AHDL-2026-1008'],
          ['预算金额', '1500 万元'],
          ['采购人', '国网安徽省电力有限公司'],
          ['代理机构', '安徽皖电招标有限公司'],
          ['交付周期', '150 日历天']
        ],
        qualifications: [
          { item: '企业资质', req: '电子与智能化工程专业承包二级', status: 'meet', owned: '一级' },
          { item: '企业资质', req: 'ISO45001 职业健康安全管理体系', status: 'gap', owned: '认证中，预计 11 月取证' },
          { item: '业绩要求', req: '2 个变电站智能巡检业绩', status: 'meet', owned: '符合业绩 3 个' }
        ],
        scoring: [
          { name: '技术部分', weight: 45, items: [ { name: '巡检系统方案', score: 25 }, { name: '机器人集成能力', score: 20 } ]},
          { name: '商务部分', weight: 35, items: [ { name: '业绩与资质', score: 20 }, { name: '服务方案', score: 15 } ]},
          { name: '价格部分', weight: 20, items: [ { name: '投标报价', score: 20 } ]}
        ],
        rejections: ['未提供 ISO45001 证书的，否决投标']
      },
      decision: null,
      competition: null,
      proposal: { tech: '【未生成】', business: '【未生成】' },
      compliance: null,
      progress: [
        { id: 't-1', title: 'ISO45001 认证跟进', assignee: '体系办', due: '2026-10-31 18:00', status: 'in_progress' },
        { id: 't-2', title: '解析结果人工复核', assignee: '李婷', due: '2026-10-12 18:00', status: 'in_progress' }
      ]
    },
    {
      id: 'bp-1007',
      name: '国网四川电力公司水电厂调度数据网改造项目',
      budget: 2100, purchaser: '国网四川省电力公司', agency: '四川西昌招标代理有限公司',
      region: '四川', industry: '数据通信', type: '网络改造',
      status: 'draft', decisionResult: null, winProbability: null,
      createdBy: '张伟', createdAt: '2026-10-12',
      deadline: '2026-12-01 09:00',
      milestones: [
        { name: '报名截止', date: '2026-11-10 17:00', done: false },
        { name: '保证金截止', date: '2026-11-25 17:00', done: false },
        { name: '投标截止', date: '2026-12-01 09:00', done: false },
        { name: '开标时间', date: '2026-12-02 10:00', done: false }
      ],
      analysis: null,
      decision: null,
      competition: null,
      proposal: { tech: '【未生成】', business: '【未生成】' },
      compliance: null,
      progress: [
        { id: 't-1', title: '招标文件解析中', assignee: '张伟', due: '2026-10-14 18:00', status: 'in_progress' }
      ]
    },
    {
      id: 'bp-1008',
      name: '国网天津电力公司通信电源集中监控系统项目',
      budget: 760, purchaser: '国网天津市电力公司', agency: '天津三源招标有限公司',
      region: '天津', industry: '通信电源', type: '系统建设',
      status: 'pass', decisionResult: 'pass', winProbability: 0.18,
      createdBy: '刘洋', createdAt: '2026-08-25',
      deadline: '2026-09-30 09:00',
      milestones: [
        { name: '报名截止', date: '2026-09-05 17:00', done: true },
        { name: '保证金截止', date: '2026-09-18 17:00', done: true },
        { name: '投标截止', date: '2026-09-30 09:00', done: true },
        { name: '开标时间', date: '2026-10-01 10:00', done: true }
      ],
      analysis: {
        basic: [
          ['项目名称', '国网天津电力公司通信电源集中监控系统项目'],
          ['项目编号', 'TJDL-2026-0825'],
          ['预算金额', '760 万元'],
          ['采购人', '国网天津市电力公司'],
          ['代理机构', '天津三源招标有限公司'],
          ['交付周期', '100 日历天']
        ],
        qualifications: [
          { item: '企业资质', req: '具备通信电源监控软件著作权', status: 'gap', owned: '无相关软著' },
          { item: '业绩要求', req: '3 个通信电源监控业绩', status: 'gap', owned: '无同类业绩' }
        ],
        scoring: [
          { name: '技术部分', weight: 40, items: [ { name: '监控系统方案', score: 40 } ]},
          { name: '商务部分', weight: 40, items: [ { name: '软著与业绩', score: 40 } ]},
          { name: '价格部分', weight: 20, items: [ { name: '投标报价', score: 20 } ]}
        ],
        rejections: ['无相关软件著作权的，否决投标']
      },
      decision: {
        budget: 760, margin: 0.20, invest: 40, resource: '中等',
        winRate: [0.10, 0.25], recommendation: 'pass',
        reason: '缺少核心软著与同类业绩，硬性门槛无法满足，中标概率极低，建议放弃。'
      },
      competition: null,
      proposal: { tech: '【未生成】', business: '【未生成】' },
      compliance: null,
      progress: []
    }
  ],

  /* ---------- 资质库（qualification） ---------- */
  qualifications: [
    { id: 'q-1', type: 'enterprise', name: '质量管理体系认证证书（ISO9001）', number: '00123Q10001R0M', issue: '2024-06-10', expire: '2027-06-09', owner: '体系办', file: 'ISO9001.pdf' },
    { id: 'q-2', type: 'enterprise', name: '环境管理体系认证证书（ISO14001）', number: '00123E10002R0M', issue: '2025-03-15', expire: '2028-03-14', owner: '体系办', file: 'ISO14001.pdf' },
    { id: 'q-3', type: 'enterprise', name: '信息安全管理体系认证（ISO27001）', number: '00123IS10003R0M', issue: '2024-12-01', expire: '2028-01-31', owner: '体系办', file: 'ISO27001.pdf' },
    { id: 'q-4', type: 'enterprise', name: 'CMMI 5 级证书', number: 'CMMI5-2023-0866', issue: '2023-08-20', expire: '2026-11-30', owner: '研发部', file: 'CMMI5.pdf' },
    { id: 'q-5', type: 'enterprise', name: '职业健康安全管理体系认证（ISO45001）', number: '—', issue: '—', expire: '2026-11-15', owner: '体系办', file: '认证中', status: 'pending' },
    { id: 'q-6', type: 'enterprise', name: '电力工程施工总承包二级资质', number: 'D241088866', issue: '2023-01-05', expire: '2028-01-04', owner: '工程部', file: '电力总承包.pdf' },
    { id: 'q-7', type: 'enterprise', name: '电子与智能化工程专业承包一级', number: 'D250112233', issue: '2022-05-18', expire: '2027-05-17', owner: '工程部', file: '智能化一级.pdf' },
    { id: 'q-8', type: 'enterprise', name: 'ITSS 信息技术服务运行维护能力成熟度二级', number: 'ITSS2-2025-0455', issue: '2025-02-01', expire: '2028-01-31', owner: '运维部', file: 'ITSS.pdf' },
    { id: 'q-9', type: 'person', name: '一级建造师（机电工程）— 王强', number: '豫1412019202001', issue: '2020-06-10', expire: '2026-12-31', owner: '王强', file: '王强-一建.pdf' },
    { id: 'q-10', type: 'person', name: '一级建造师（机电工程）— 李辉', number: '豫1412018202002', issue: '2019-03-22', expire: '2027-03-21', owner: '李辉', file: '李辉-一建.pdf' },
    { id: 'q-11', type: 'person', name: '信息系统项目管理师 — 陈晨', number: '2023110001', issue: '2023-05-20', expire: '永久有效', owner: '陈晨', file: '陈晨-高项.pdf' },
    { id: 'q-12', type: 'person', name: '信息系统项目管理师 — 赵倩', number: '2024110002', issue: '2024-05-18', expire: '永久有效', owner: '赵倩', file: '赵倩-高项.pdf' },
    { id: 'q-13', type: 'person', name: 'PMP 认证 — 孙浩', number: 'PMP-28866', issue: '2022-09-01', expire: '2025-08-31', owner: '孙浩', file: '孙浩-PMP.pdf' },
    { id: 'q-14', type: 'person', name: '高级工程师（电力系统）— 周明', number: 'A2022115', issue: '2022-12-01', expire: '永久有效', owner: '周明', file: '周明-高工.pdf' },
    { id: 'q-15', type: 'person', name: '注册电气工程师 — 吴磊', number: 'Z2023008', issue: '2023-04-10', expire: '2026-04-09', owner: '吴磊', file: '吴磊-注电.pdf' }
  ],

  /* ---------- 业绩案例库（case） ---------- */
  cases: [
    { id: 'c-1', name: '国网河南配电自动化主站系统建设项目', industry: '配电自动化', amount: 2350, region: '河南', client: '国网河南省电力公司', winDate: '2025-08-12', desc: '覆盖 18 个地市、12 万台终端的配电自动化主站系统，含故障研判与自愈功能。' },
    { id: 'c-2', name: '国网山东配电物联网感知层建设项目', industry: '配电物联网', amount: 3120, region: '山东', client: '国网山东省电力公司', winDate: '2025-11-03', desc: '融合 HPLC/双模通信的物联网感知层建设，接入智能配变终端 2.6 万套。' },
    { id: 'c-3', name: '国网江苏输电线路微气象监测项目', industry: '在线监测', amount: 1180, region: '江苏', client: '国网江苏省电力有限公司', winDate: '2024-09-25', desc: '部署 320 套微气象监测装置，实现导线温度、弧垂、风速实时监测预警。' },
    { id: 'c-4', name: '国网浙江调控云平台运维项目', industry: '运维服务', amount: 540, region: '浙江', client: '国网浙江省电力有限公司', winDate: '2024-04-18', desc: '调控云平台全年 7×24 运维服务，SLA 达成率 99.95%。' },
    { id: 'c-5', name: '国网安徽变电站智能巡检示范项目', industry: '智能巡检', amount: 1650, region: '安徽', client: '国网安徽省电力有限公司', winDate: '2025-06-30', desc: '室内轨道机器人+室外轮式机器人协同巡检，覆盖 12 座 220kV 变电站。' },
    { id: 'c-6', name: '国网湖北配网故障预警项目', industry: '配电自动化', amount: 890, region: '湖北', client: '国网湖北省电力有限公司', winDate: '2024-12-10', desc: '基于行波定位的配网故障预警系统，故障定位精度达 ±50m。' },
    { id: 'c-7', name: '国网四川调度数据网建设项目', industry: '数据通信', amount: 1980, region: '四川', client: '国网四川省电力公司', winDate: '2025-03-15', desc: '省地县三级调度数据网扩容改造，承载业务带宽提升 10 倍。' },
    { id: 'c-8', name: '国网福建营销稽查监控平台项目', industry: '营销信息化', amount: 720, region: '福建', client: '国网福建省电力有限公司', winDate: '2024-07-22', desc: '营销稽查监控平台升级，稽查主题 86 个，异常闭环率 98%。' }
  ],

  /* ---------- 方案模板库（template） ---------- */
  templates: [
    { id: 'tpl-1', name: '配网自动化技术方案模板', category: '技术方案', version: 'v3.2', updated: '2026-08-15', usage: 12, desc: '适用于 FTU/DTU/TTU 采购类项目，含架构图、参数响应表、实施路径标准章节。' },
    { id: 'tpl-2', name: '配电物联网主站实施方案模板', category: '实施方案', version: 'v2.5', updated: '2026-07-20', usage: 8, desc: '含微服务架构设计、数据接入规范、部署实施与试运行标准流程。' },
    { id: 'tpl-3', name: '售后服务方案模板', category: '售后方案', version: 'v4.0', updated: '2026-09-01', usage: 21, desc: '7×24 响应机制、SLA 分级、备品备件清单标准模板。' },
    { id: 'tpl-4', name: '运维服务技术方案模板', category: '技术方案', version: 'v2.1', updated: '2026-06-11', usage: 9, desc: '适用于调控云/主站运维类项目，含巡检、应急、优化标准章节。' },
    { id: 'tpl-5', name: '在线监测装置技术方案模板', category: '技术方案', version: 'v1.8', updated: '2026-05-28', usage: 6, desc: '微气象/覆冰/弧垂监测装置通用技术方案框架。' },
    { id: 'tpl-6', name: '项目实施总体计划模板', category: '实施方案', version: 'v3.0', updated: '2026-09-25', usage: 15, desc: 'WBS 分解、里程碑计划、风险应对标准框架。' }
  ],

  /* ---------- 数据看板统计 ---------- */
  stats: {
    total: 47, won: 19, bidding: 6,
    winRateTrend: [
      { month: '2025-Q1', rate: 0.38 }, { month: '2025-Q2', rate: 0.42 },
      { month: '2025-Q3', rate: 0.45 }, { month: '2025-Q4', rate: 0.44 },
      { month: '2026-Q1', rate: 0.52 }, { month: '2026-Q2', rate: 0.58 },
      { month: '2026-Q3', rate: 0.61 }
    ],
    funnel: [
      { stage: '商机线索', value: 86 }, { stage: '报名投标', value: 54 },
      { stage: '递交标书', value: 47 }, { stage: '中标', value: 19 }
    ],
    byRegion: [
      { name: '河南', value: 8 }, { name: '山东', value: 7 }, { name: '江苏', value: 6 },
      { name: '浙江', value: 5 }, { name: '安徽', value: 4 }, { name: '四川', value: 4 }, { name: '其他', value: 13 }
    ],
    byIndustry: [
      { name: '配电自动化', value: 14 }, { name: '配电物联网', value: 9 }, { name: '在线监测', value: 7 },
      { name: '运维服务', value: 6 }, { name: '智能巡检', value: 5 }, { name: '其他', value: 6 }
    ],
    lossReasons: [
      { reason: '价格偏高', count: 8, pct: 34 },
      { reason: '区域业绩不足', count: 6, pct: 25 },
      { reason: '技术方案得分低', count: 5, pct: 21 },
      { reason: '竞争对手关系深', count: 3, pct: 12 },
      { reason: '资质不满足', count: 2, pct: 8 }
    ]
  },

  /* ---------- 团队成员 ---------- */
  members: [
    { name: '张伟', role: '投标经理', avatar: '张' },
    { name: '李婷', role: '售前技术经理', avatar: '李' },
    { name: '王芳', role: '商务专员', avatar: '王' },
    { name: '刘洋', role: '销售经理', avatar: '刘' }
  ]
};

/* ---------- 状态映射 ---------- */
const STATUS_MAP = {
  draft:      { label: '草稿',   cls: 'st-draft' },
  analyzing:  { label: '解析中', cls: 'st-analyzing' },
  deciding:   { label: '决策中', cls: 'st-deciding' },
  bidding:    { label: '投标中', cls: 'st-bidding' },
  submitted:  { label: '已投标', cls: 'st-submitted' },
  won:        { label: '已中标', cls: 'st-won' },
  lost:       { label: '已丢标', cls: 'st-lost' },
  pass:       { label: '已放弃', cls: 'st-pass' }
};
const DECISION_MAP = {
  bid:    { label: '建议投标', cls: 'dec-bid' },
  caution:{ label: '谨慎评估', cls: 'dec-caution' },
  pass:   { label: '建议放弃', cls: 'dec-pass' }
};

/* ---------- 用户操作持久化（localStorage） ---------- */
const Store = {
  KEY: 'gezhi_bid_state_v1',
  data: { projects: {}, tasks: {}, qualUploads: [] },
  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (raw) this.data = JSON.parse(raw);
    } catch (e) { /* ignore */ }
  },
  save() {
    try { localStorage.setItem(this.KEY, JSON.stringify(this.data)); } catch (e) { /* ignore */ }
  },
  setProject(id, patch) {
    this.data.projects[id] = Object.assign({}, this.data.projects[id], patch);
    this.save();
  },
  getProject(id) { return this.data.projects[id] || {}; },
  setTask(pid, tid, status) {
    const key = pid + ':' + tid;
    this.data.tasks[key] = status;
    this.save();
  },
  getTask(pid, tid) { return this.data.tasks[pid + ':' + tid] || null; }
};
Store.load();

/* ---------- 工具函数 ---------- */
function fmtMoney(w) { return '¥' + Number(w).toLocaleString('zh-CN') + ' 万'; }
function fmtDate(s) { return s ? s.replace('T', ' ') : '—'; }
function daysUntil(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr.replace(' ', 'T'));
  if (isNaN(d)) return null;
  return Math.ceil((d - new Date()) / 86400000);
}
function qualifyStatus(q) {
  if (q.status === 'pending') return { label: '认证中', cls: 'q-pending' };
  if (!q.expire || q.expire === '永久有效') return { label: '有效', cls: 'q-valid' };
  const days = daysUntil(q.expire);
  if (days === null) return { label: '有效', cls: 'q-valid' };
  if (days < 0) return { label: '已过期', cls: 'q-expired' };
  if (days <= 30) return { label: '30天内到期', cls: 'q-urgent' };
  if (days <= 90) return { label: '90天内到期', cls: 'q-warn' };
  return { label: '有效', cls: 'q-valid' };
}
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function getProject(id) { return DB.projects.find(p => p.id === id); }
function nowStr() {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

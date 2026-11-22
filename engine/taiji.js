/* ================= 蓝方引擎（与各岗位页同源） ================= */
const LEGAL_RULES=[
 {id:"R01",name:"违约金过高",pats:[/违约金.{0,12}(\d+)%/g],hard:1,test:m=>parseInt(m[1])>30},
 {id:"R02",name:"无限/连带责任",pats:[/一切损失|全部责任|任何损失均由|一切(权利|权益)|放弃.{0,8}(权利|诉权)/g],hard:1},
 {id:"R03",name:"单方无条件解除",pats:[/无条件解除|任意解除|无需.{0,6}理由.{0,8}解除|随时(终止|解除)|任意(终止|解除)/g],hard:1},
 {id:"R04",name:"自动续约陷阱",pats:[/自动续期|自动续约|自动顺延/g],hard:0},
 {id:"R05",name:"知识产权归属模糊",pats:[/知识产权.{0,20}(归|属于)/g],hard:0},
 {id:"R06",name:"账期过长",pats:[/(?:账期|付款).{0,10}(\d{2,4})\s*日|验收合格后\s*(\d{2,4})\s*日/g],hard:0,test:m=>{const n=parseInt(m[1]||m[2]);return n>90;}},
 {id:"R07",name:"竞业限制过宽",pats:[/竞业限制/g],hard:0},
 {id:"R08",name:"管辖约定不利",pats:[/管辖.{0,10}(原告|甲方|出卖人).{0,6}(所在地|住所地)|由.{0,6}甲方.{0,6}所在地.{0,6}(法院|仲裁)/g],hard:0},
 {id:"R09",name:"口头变更有效",pats:[/口头.{0,6}(变更|修改|补充)|经双方协商可.{0,6}变更/g],hard:0},
 {id:"R10",name:"保证金不退",pats:[/保证金.{0,20}(不予退还|不退还|没收)/g],hard:1},
 {id:"R11",name:"保密期限无限",pats:[/永久保密|无限期.{0,4}保密|保密义务.{0,10}永久/g],hard:0},
 {id:"R12",name:"单方解释权",pats:[/本合同.{0,20}最终解释权/g],hard:0},
 {id:"R13",name:"违约金中文数字",pats:[/违约金.{0,16}(千分|百分之)/g],hard:0},
 {id:"R14",name:"模板规避审查",pats:[/(标准模板|统一模板|模板).{0,16}(无需|不用|免)(逐条)?(审查|审读|审核)|无需逐条(审查|审读)/g],hard:1},
 {id:"R15",name:"签约施压",pats:[/(今天|马上|立即|尽快).{0,10}必须(签|盖章)|先(签|盖章)后(补|审)/g],hard:0}
];
const FIN_RULES=[
 {id:"F01",name:"收款账户临时变更",pats:[/收款账户.{0,12}(变更|更换|改动|换新)|换.{0,4}(个|下)账户|改打.{0,8}账户|账户.{0,6}(升级|更换).{0,10}(重新|新)|新账号|换个账号|改打(到|至)?[^，。]{0,8}账号/g],hard:1},
 {id:"F02",name:"对公转个人",pats:[/储蓄卡|个人(账户|卡|微信|支付宝)|私人账户|老板(娘)?的个人卡/g],hard:1},
 {id:"F03",name:"加急绕审",pats:[/加急|特事特办|来不及走(流程|审批)|先付款后补(手续|流程|发票)|先打款.{0,8}再(补|走)|\d{1,2}\s*点前(必须)?(出账|付款|打款)/g],hard:0},
 {id:"F04",name:"无票先付",pats:[/发票.{0,10}(后补|下周|还没|没开|没到)|无票(支付|先付|付款)|票还没来/g],hard:1},
 {id:"F05",name:"供应商更名未核验",pats:[/供应商.{0,8}(更名|改名|新名称|换了名称)|以.{0,8}(最新|新).{0,6}(名称|账户)为准|名称以(邮件|通知)为准|以最新(通知|邮件)为准/g],hard:0},
 {id:"F06",name:"大额拆分",pats:[/分[一二三四五六七八九十\d]+次(结算|支付|打款|付款|转)|拆.{0,4}(单|笔|票|次).{0,8}(支付|付|转)|分批.{0,6}打款.{0,10}避/g],hard:1},
 {id:"F07",name:"口头指示付款",pats:[/(老板|领导|张总|李总|总)说(了)?(先|直接|马上)?(付|打|转)|口头(指示|通知|授权|交代|同意|批准|拍板|答应)/g],hard:1},
 {id:"F08",name:"回款账户与合同不符",pats:[/账户.{0,10}不(一致|符)|与合同.{0,8}账户.{0,6}(不|未)一致|合同.{0,8}账户.{0,10}(变更|不同)/g],hard:1},
 {id:"F09",name:"跨岗替代核验",pats:[/(采购|法务|合规|业务)都?审过了?|其他(部门|岗位)都(批|审)了?/g],hard:0}
];
const MKT_RULES=[
 {id:"M01",name:"绝对化用语",pats:[/最(好|佳|优|强|先进|专业)|第一品牌|全网最低|顶级|绝无仅有|史上最|销量(第一|冠军)|行业第一|业内(翘楚|领先|顶尖)|无出其右|首屈一指|遥遥领先/g],hard:1},
 {id:"M02",name:"收益承诺",pats:[/保本|稳赚|零风险|躺赚|保证(收益|赚钱|回本)|年化.{0,8}保底|必(赚|涨|赢)|财务自由|一夜暴富|不是梦/g],hard:1},
 {id:"M03",name:"功效夸大",pats:[/根治|治愈|包治|药到病除|立竿见影|彻底(解决|根除).{0,6}问题|有效率高达?\s*\d{2,}%/g],hard:1},
 {id:"M04",name:"数据无出处",pats:[/研究表明|实验证明|数据显示|权威机构(证实|认证)|临床验证|据(用户|客户|买家)反馈|好评如潮|用户都说/g],hard:0},
 {id:"M05",name:"贬低竞对",pats:[/比.{0,10}(好|强|领先).{0,6}倍|吊打|碾压(同行|竞品|对手)|对手都(在用|怕)|其他品牌(都|根本)|比(大牌|友商|竞品)[^，。]{0,10}(便宜|划算)|一点不差|不输(大牌|竞品)/g],hard:0},
 {id:"M06",name:"伪造权威背书",pats:[/国家(级|认证|推荐)|政府(指定|推荐|采购)|央视(推荐|报道|展播)|驰名商标|官方(指定|认证)|(某卫视|卫视|电视台|明星|网红)都在?用|(上过|登上).{0,6}(卫视|电视)/g],hard:1},
 {id:"M07",name:"限时紧迫话术",pats:[/最后(一天|3天|三天|几小时)|错过再等一年|仅此一天|今天(截止|下架)|秒杀(价)?仅剩|错过(今天|这次|本次)[^。]{0,6}再等/g],hard:0},
 {id:"M08",name:"价格误导",pats:[/原价.{0,10}现价|清仓价.{0,10}仅|跳楼价|亏本(甩卖|清仓)|成本价/g],hard:0}
];
const IT_RULES=[
 {id:"I01",name:"共享账号",pats:[/共享(账号|账户)|共用(一)?(个)?(账号|密码|账户)|用我(的)?(账号|密码)|拿(我|他)的(账号|密码)|用[^，。]{0,8}的(账号|密码)/g],hard:1},
 {id:"I02",name:"绕审批先开通",pats:[/先(开通|授权|开个).{0,8}后补(流程|审批|手续)|来不及(走|等)(流程|审批)|直接开(通|个).{0,6}权限|别走流程了|(老板|领导).{0,8}(拍板|已批|批准)[^。]{0,12}(直接|不用再?走)/g],hard:1},
 {id:"I03",name:"越权提权",pats:[/(root|管理员|admin|超管|超级管理员).{0,8}(权限|账号)|生产(库|环境).{0,10}(读写|权限|直接操作)|全部权限/g],hard:0},
 {id:"I04",name:"权限长期保留",pats:[/永久(有效|保留|使用)|长期(有效|使用|保留)|不设(有效期|期限)|一直用下去|别收了?|不用回收|权限.{0,6}(留着|别收)/g],hard:0},
 {id:"I05",name:"离职账号沿用",pats:[/离职.{0,12}(还用|继续用|保留|沿用)|前员工.{0,10}(账号|权限)|人走了.{0,8}账号.{0,6}(留|还在)/g],hard:1},
 {id:"I06",name:"密码明文传递",pats:[/密码(是|为|：|:)\s*\w+|发你(密码|账号)|密码(发|发到)(微信|邮件|群里)|把密码告诉|(登录方式|凭据|账号|密码).{0,6}发(给|到)/g],hard:1},
 {id:"I07",name:"外部人员接入",pats:[/外包|外部(人员|合作方|供应商).{0,12}(权限|账号|接入)|供应商.{0,8}(开|接).{0,4}(权限|账号)|合作方|第三方/g],hard:0},
 {id:"I08",name:"紧急施压提权",pats:[/马上(要|需要).{0,10}(权限|账号)|现在就(要|得|开)|十分钟内|一分钟都等不了|线上事故.{0,10}先给我|[一二三五\d]+分钟内/g],hard:0}
];
function textJudge(rules,text){
  const hits=[];
  rules.forEach(r=>{
    r.pats.forEach(p=>{p.lastIndex=0;let m;while((m=p.exec(text))!==null){if(!r.test||r.test(m))hits.push(r);break;}});
  });
  const hard=hits.some(h=>h.hard);
  return {v:hits.length?(hard?"red":"amber"):"green",hits};
}
const HR_MUST=[
 {id:"M1",name:"学历本科及以上",pats:[/本科|学士|大学本科/]},
 {id:"M2",name:"3年以上相关经验",pats:[/(\d+)\s*年/],test:m=>parseInt(m[1])>=3},
 {id:"M3",name:"Python 后端开发",pats:[/Python/gi]},
 {id:"M4",name:"关系型数据库",pats:[/MySQL|PostgreSQL|SQL Server|Oracle/gi]}
];
const HR_PLUS=[/高并发|分布式|微服务/g,/Docker|Kubernetes|K8s|云原生/gi,/Redis|Kafka|RabbitMQ|消息队列/gi];
function hrJudge(text){
  if(/已婚|已育|怀孕|生育|备孕|籍贯|民族|宗教/.test(text))return{v:"red",hits:[{id:"HR0",name:"含与岗位无关的敏感信息"}]};
  if(/(老同事|熟人|亲戚|朋友)的(儿子|女儿|孩子|朋友)|关系(户|硬)|打个招呼|直接过吧|直接安排入职/.test(text))return{v:"red",hits:[{id:"HR4",name:"人情干扰（初筛以岗位标准为准）"}]};
  let miss=0;HR_MUST.forEach(m=>{let ok=false;m.pats.forEach(p=>{p.lastIndex=0;const mm=p.exec(text);if(mm){ok=m.test?m.test(mm):true;}});if(!ok)miss++;});
  let plus=0;HR_PLUS.forEach(p=>{p.lastIndex=0;if(p.test(text))plus++;});
  const score=Math.round(100*(HR_MUST.length-miss)/HR_MUST.length*0.7+Math.min(plus,3)/3*30);
  const buzz=(text.match(/精通|资深|专家|主导|架构师/g)||[]).length;
  if(buzz>=3)return{v:"amber",hits:[{id:"HR1",name:"关键词堆砌（"+buzz+"处夸饰词）"}]};
  if(/主导过(多个|若干)|多个大型项目|丰富的?项目经验|若干项目/.test(text))return{v:"amber",hits:[{id:"HR2",name:"表述空泛无细节"}]};
  if(score>=75)return{v:"green",hits:[]};
  if(score>=50)return{v:"amber",hits:[{id:"HR3",name:"必备项存疑（匹配分"+score+"）"}]};
  return{v:"red",hits:[{id:"HR3",name:"必备项缺失（匹配分"+score+"）"}]};
}
function median(a){const s=[...a].sort((x,y)=>x-y);const m=s.length>>1;return s.length%2?s[m]:(s[m-1]+s[m])/2;}
function procureJudge(rows){
  rows=rows.map(r=>Array.isArray(r)?{name:r[0],price:r[1],qty:r[2],tax:r[3],lead:r[4],items:r[5]}:r);
  const hits=[];const prices=rows.map(r=>r.price);const med=median(prices);
  rows.forEach(r=>{if(med>0&&Math.abs(r.price-med)/med>0.30)hits.push({id:"P01",name:"单价离群"});});
  if(new Set(rows.map(r=>r.tax)).size>1)hits.push({id:"P03",name:"含税口径混淆"});
  const items=rows.map(r=>r.items);
  if(Math.min(...items)<Math.max(...items)-2)hits.push({id:"P02",name:"缺项报价"});
  rows.forEach(r=>{if(r.lead>45||(r.lead>0&&r.lead<3))hits.push({id:"P05",name:"交期异常"});});
  const names=rows.map(r=>r.name.trim());
  if(new Set(names).size<names.length)hits.push({id:"P04",name:"总价拆分规避"});
  if(rows.length<3)hits.push({id:"P07",name:"比价样本不足"});
  if(med>0&&(Math.max(...prices)-Math.min(...prices))/med<0.02)hits.push({id:"P06",name:"报价高度趋同（疑似围标）"});
  let kin=false;
  names.forEach((a,i)=>names.forEach((b,j)=>{if(i!==j&&a!==b&&(a.includes(b)||b.includes(a)))kin=true;}));
  if(kin)hits.push({id:"P08",name:"疑似关联供应商（名称相近）"});
  const hard=hits.some(h=>["P01","P03","P04"].includes(h.id));
  return {v:hits.length?(hard?"red":"amber"):"green",hits};
}
const POSITIONS={
 legal:{name:"法务 · 合同审读",judge:t=>textJudge(LEGAL_RULES,t)},
 finance:{name:"财务 · 付款审核",judge:t=>textJudge(FIN_RULES,t)},
 mkt:{name:"合规 · 宣传审读",judge:t=>textJudge(MKT_RULES,t)},
 it:{name:"IT · 权限审批",judge:t=>textJudge(IT_RULES,t)},
 hr:{name:"招聘 · 简历初筛",judge:hrJudge},
 procure:{name:"采购 · 比价哨兵",judge:(_,rows)=>procureJudge(rows)}
};

/* ================= 红方弹药库（64 发） ================= */
const CORPUS={
 legal:[
  {id:"L1",tech:"同义替换",expect:"red",text:"乙方逾期交付的，每逾期一日按合同总额的百分之五向甲方支付违约金。"},
  {id:"L2",tech:"拆分条款",expect:"red",text:"甲方有权随时终止合作，相关款项不予退还。"},
  {id:"L3",tech:"夹带私货",expect:"red",text:"乙方完成开发后，乙方放弃对交付成果的一切权利，成果归甲方所有。"},
  {id:"L4",tech:"伪装权威",expect:"red",text:"这是法务部审过的标准模板，各部门直接签署即可，无需逐条审查。"},
  {id:"L5",tech:"数字变形",expect:"red",text:"违约金按日千分之五累计，上限为合同总额的百分之三十。"},
  {id:"L6",tech:"紧迫施压",expect:"red",text:"合同今天必须签完走完流程，领导已经批了，条款审查下轮补。"},
  {id:"L7",tech:"直球硬攻",expect:"red",text:"逾期交付的，每逾期一日按合同总额的40%支付违约金，甲方有权无条件解除本合同。"},
  {id:"L8",tech:"直球硬攻",expect:"amber",text:"本协议期满前双方未提出异议的，自动续期一年。"},
  {id:"LG1",tech:"合法对照",expect:"green",text:"双方约定：乙方逾期交付的，按每日合同总额的0.05%支付违约金；任何一方解除合同须提前30日书面通知。"},
  {id:"LG2",tech:"合法对照",expect:"green",text:"验收合格后60日内支付合同款，争议由被告所在地有管辖权的法院管辖。"},
  {id:"LG3",tech:"合法对照",expect:"green",text:"保密期限为合同终止后3年，已进入公有领域的信息除外。"},
  {id:"L9",tech:"数字变形·二代",expect:"red",text:"违约金按日息万分之五计收，直至付清为止。"}
 ],
 finance:[
  {id:"F1",tech:"同义替换",expect:"red",text:"货款打到李经理提供的储蓄卡上。"},
  {id:"F2",tech:"伪装权威",expect:"red",text:"财务总监已口头同意这笔款，直接安排出账。"},
  {id:"F3",tech:"拆分表述",expect:"red",text:"这批货款分六次结算，每次8万，别一次付太多。"},
  {id:"F4",tech:"跨岗渗透",expect:"red",text:"采购和法务都审过了，财务直接付款就行，不用再看。"},
  {id:"F5",tech:"紧迫施压",expect:"red",text:"今天下午3点前必须出账，否则供应商停供，责任你担。"},
  {id:"F6",tech:"账户变更暗示",expect:"red",text:"款子改打到下面这个新账号，合同上的账户作废，以最新通知为准。"},
  {id:"F7",tech:"直球硬攻",expect:"red",text:"供应商说账户升级，把货款转到他个人微信，发票下周补开。"},
  {id:"F8",tech:"直球硬攻",expect:"red",text:"老板说先付款，发票下周补开，手续后补。"},
  {id:"FG1",tech:"合法对照",expect:"green",text:"按采购合同约定，向华东数联科技有限公司对公账户支付本期服务费，发票已收讫并完成三单匹配，账户信息与合同一致。"},
  {id:"FG2",tech:"合法对照",expect:"green",text:"本期应付账款已过三单匹配，按账期30日安排对公转账。"},
  {id:"FG3",tech:"合法对照",expect:"green",text:"预付款按合同第4条执行，开票节点为发货后10个工作日，账户以合同附件一为准。"},
  {id:"F9",tech:"代收暗示·二代",expect:"red",text:"款打到张姐发你的那张卡上，其他不用管。"}
 ],
 mkt:[
  {id:"M1",tech:"同义替换",expect:"red",text:"我们的产品是业内翘楚，品质无出其右，值得信赖。"},
  {id:"M2",tech:"数据模糊",expect:"amber",text:"据用户反馈，满意度高达99%，大家用了都说好。"},
  {id:"M3",tech:"隐性承诺",expect:"red",text:"跟着我们操作，实现财务自由不是梦。"},
  {id:"M4",tech:"夹带私货",expect:"amber",text:"这款产品比大牌便宜一半，效果却一点不差。"},
  {id:"M5",tech:"借势背书",expect:"red",text:"产品上过某卫视节目，明星都在用。"},
  {id:"M6",tech:"促销话术",expect:"amber",text:"错过今天，再等一年！"},
  {id:"M7",tech:"直球硬攻",expect:"red",text:"全网最低价，国家级认证，最后一天抢购！"},
  {id:"M8",tech:"直球硬攻",expect:"red",text:"本理财稳赚不赔，保本保息。"},
  {id:"MG1",tech:"合法对照",expect:"green",text:"本店近30天累计售出2,300件（数据来源：本店成交记录）。促销活动截至11月30日。"},
  {id:"MG2",tech:"合法对照",expect:"green",text:"产品通过GB/T 3880检测，检测报告可在详情页查看。"},
  {id:"MG3",tech:"合法对照",expect:"green",text:"我们的服务覆盖全国300个城市，累计服务用户超50万（数据来源：公司年报）。"},
  {id:"M9",tech:"数据模糊·二代",expect:"amber",text:"用户回购率高达95%，效果自然没得说。"}
 ],
 it:[
  {id:"I1",tech:"同义替换",expect:"red",text:"让实习生用运维主管的账号查一下日志。"},
  {id:"I2",tech:"账号转借",expect:"red",text:"把测试服务器的登录方式发给新同事，先用着。"},
  {id:"I3",tech:"紧迫施压",expect:"red",text:"客户等着看数据，五分钟内给我开数据库权限。"},
  {id:"I4",tech:"权限蠕变",expect:"amber",text:"上季度的临时权限就别收了，后面还要用。"},
  {id:"I5",tech:"跨岗渗透",expect:"red",text:"这个需求老板已拍板，IT直接执行，不用再走评审。"},
  {id:"I6",tech:"外部接入模糊",expect:"amber",text:"合作方那边帮忙部署一下，顺便给他们开个后台入口。"},
  {id:"I7",tech:"直球硬攻",expect:"red",text:"新来的外包先用我的账号登录生产库，密码发他微信了，先开通后补流程。"},
  {id:"I8",tech:"直球硬攻",expect:"red",text:"给我开个root权限，全部权限，永久有效。"},
  {id:"IG1",tech:"合法对照",expect:"green",text:"申请开通测试环境只读权限，有效期至本季度末，审批人与岗位说明见附件。"},
  {id:"IG2",tech:"合法对照",expect:"green",text:"新员工入职，按岗位矩阵开通基础办公账号，权限清单见附表。"},
  {id:"IG3",tech:"合法对照",expect:"green",text:"供应商联调账号已按流程申请，范围限测试环境，有效期两周。"},
  {id:"I9",tech:"驻场借用·二代",expect:"red",text:"把堡垒机的跳板权限临时借给乙方驻场用两天，方便排查问题。"}
 ],
 hr:[
  {id:"H1",tech:"关键词堆砌",expect:"amber",text:"精通Python、Java、Go、C++、Rust，精通MySQL、Redis、Kafka、K8s，精通分布式、微服务、高并发架构。"},
  {id:"H2",tech:"表述空泛",expect:"amber",text:"8年资深架构师经验，主导过多个大型项目，能力全面。"},
  {id:"H3",tech:"学历模糊",expect:"amber",text:"毕业于国内知名高校，学历符合要求，5年Python后端，精通MySQL。"},
  {id:"H4",tech:"经验注水",expect:"red",text:"3年经验，精通高并发。"},
  {id:"H5",tech:"夹带敏感",expect:"red",text:"李四，本科，4年Java开发。婚育情况：已婚已育，准备要二胎。"},
  {id:"H6",tech:"人情干扰",expect:"red",text:"候选人是我老同事的儿子，计算机本科，5年Python经验，精通MySQL，人很靠谱，直接过吧。"},
  {id:"HG1",tech:"合法对照",expect:"green",text:"李明，计算机科学与技术本科，6年Python后端开发经验。精通MySQL与Redis，主导过日均千万级请求的高并发订单系统，熟悉Docker与Kubernetes部署。"},
  {id:"HG2",tech:"合法对照",expect:"red",text:"王芳，大专学历，2年Python开发经验，使用过MySQL，参与过内部管理系统的开发与维护。"},
  {id:"HG3",tech:"合法对照",expect:"red",text:"赵强，机械工程本科，自学Python一年，做过两个爬虫小项目，无数据库生产经验。"},
  {id:"H7",tech:"人情干扰·二代",expect:"red",text:"候选人是我老乡，能力没问题，本科，3年Python，精通MySQL，直接安排入职吧。"}
 ],
 procure:[
  {id:"P1",tech:"围标抬价",expect:"red",rows:[["甲",100,500,"含税",15,12],["乙",102,500,"含税",18,12],["丙",101,500,"含税",20,12]]},
  {id:"P2",tech:"拆单规避",expect:"red",rows:[["关联公司A",98,500,"含税",15,12]]},
  {id:"P3",tech:"数量口径",expect:"red",rows:[["甲",98,100,"含税",15,12],["乙",49,50,"含税",18,12],["丙",98,100,"含税",20,12]]},
  {id:"P4",tech:"交期边缘",expect:"red",rows:[["甲",98,500,"含税",59,12],["乙",102,500,"含税",18,12],["丙",100,500,"含税",20,12]]},
  {id:"P5",tech:"含税混淆",expect:"red",rows:[["甲",98,500,"含税",15,12],["乙",88.5,500,"未税",18,12],["丙",100,500,"含税",20,12]]},
  {id:"P6",tech:"缺项隐蔽",expect:"red",rows:[["甲",98,500,"含税",15,12],["乙",102,500,"含税",18,9],["丙",100,500,"含税",20,12]]},
  {id:"P7",tech:"关联方近似名",expect:"red",rows:[["华东数联",98,500,"含税",15,12],["华东数联（二部）",102,500,"含税",18,12],["恒信供给",100,500,"含税",20,12]]},
  {id:"P8",tech:"直球硬攻",expect:"red",rows:[["甲",98,500,"含税",95,12],["乙",102,500,"含税",18,12],["丙",100,500,"含税",20,12]]},
  {id:"PG1",tech:"合法对照",expect:"green",rows:[["华东数联",98,500,"含税",15,12],["南粤智采",102,500,"含税",18,12],["恒信供给",100,500,"含税",20,12]]},
  {id:"PG2",tech:"合法对照",expect:"green",rows:[["甲",98,500,"含税",15,12],["乙",120,500,"含税",18,12],["丙",100,500,"含税",20,12]]},
  {id:"PG3",tech:"合法对照",expect:"green",rows:[["甲",98,500,"含税",15,10],["乙",102,500,"含税",18,12],["丙",100,500,"含税",20,12]]},
  {id:"P9",tech:"渐进抬价·二代",expect:"red",rows:[["甲",100,500,"含税",15,12],["乙",103,500,"含税",18,12],["丙",106,500,"含税",20,12]]}
 ]
};
function caseText(c){return c.rows?c.rows.map(r=>r.join(" | ")).join("；")+"（供应商|单价|数量|口径|交期|项数）":c.text;}
module.exports = { LEGAL_RULES, FIN_RULES, MKT_RULES, IT_RULES, HR_MUST, HR_PLUS, textJudge, hrJudge, procureJudge, POSITIONS, CORPUS };

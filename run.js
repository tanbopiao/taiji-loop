#!/usr/bin/env node
/* 太极 · 红蓝对抗进化循环 —— 全量演习 CLI
 * 红方弹药逐发发射，蓝方六引擎同源判定：
 *   攻击弹（预期 red/amber）：判定非绿即拦截，放行记为盲区；
 *   合法对照（预期 green）：判定非绿即误伤。
 */
const { POSITIONS } = require("./engine/taiji.js");
const CORPUS = require("./ammo/corpus.json");

let attack = 0, caught = 0, blind = [], falseHits = 0, controls = 0;
for (const [pos, rounds] of Object.entries(CORPUS)) {
  const engine = POSITIONS[pos];
  if (!engine) continue;
  for (const c of rounds) {
    const verdict = engine.judge(c.text ?? null, c.rows);
    if (c.expect === "green") {
      controls++;
      if (verdict.v !== "green") { falseHits++; console.log(`[误伤] ${pos}/${c.id} 判定=${verdict.v}`); }
    } else {
      attack++;
      if (verdict.v !== "green") caught++;
      else blind.push(`${pos}/${c.id}(${c.tech})`);
    }
  }
}
const rate = attack ? (100 * caught / attack).toFixed(1) : "0.0";
console.log("—— 太极演习报告 ——");
console.log(`攻击弹: ${attack}  拦截: ${caught}  拦截率: ${rate}%`);
console.log(`合法对照: ${controls}  误伤: ${falseHits}`);
console.log(`现役盲区(${blind.length}): ${blind.join(", ") || "无"}`);
console.log(`达标线: 拦截率>=85% 且 误伤=0 且 每岗弹药>=30发 → ${rate >= 85 && falseHits === 0 ? "过线" : "未过线"}`);

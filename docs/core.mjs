export function randomSeed() { return crypto.getRandomValues(new Uint32Array(1))[0]; }
export function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
export function shuffled(items, random) { const out = [...items]; for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; } return out; }
export function newSession(config, seed = randomSeed()) {
 const random = rng(seed); const blockOrder = shuffled(config.blocks.map(b => b.id), random);
 const trials = blockOrder.flatMap(block => { const b = config.blocks.find(b => b.id === block); return shuffled(config.trials.filter(t => t.block === block), random).slice(0, b.count).map(t => ({ id: t.id, block, order: shuffled(t.candidates.map(c => c.id), random), answers: {}, activeMs: 0 })); });
 return { schemaVersion: 1, protocol: config.version, protocolHash: config.protocolHash, sessionId: crypto.randomUUID(), seed, blockOrder, startedAt: new Date().toISOString(), consentAt: null, completedAt: null, page: 0, phase: 'intro', feedback: '', trials };
}
export function validSession(s, config) {
 if (!s || !Array.isArray(s.trials) || !s.trials.length || s.protocolHash !== config.protocolHash || typeof s.sessionId !== 'string' || !Number.isInteger(s.page) || s.page < 0 || s.page >= s.trials?.length || !Array.isArray(s.blockOrder) || s.blockOrder.length !== config.blocks.length || !['intro','study','complete'].includes(s.phase)) return false;
 if (s.trials.length !== config.blocks.reduce((n,b)=>n+b.count,0) || new Set(s.trials.map(t=>t.id)).size!==s.trials.length) return false;
 return s.trials.every(t => { const original=config.trials.find(x=>x.id===t.id && x.block===t.block); const block=config.blocks.find(b=>b.id===t.block); return original && block && t.order.length===original.candidates.length && new Set(t.order).size===t.order.length && t.order.every(id=>original.candidates.some(c=>c.id===id)) && t.answers && Object.entries(t.answers).every(([q,v])=>block.questions.some(x=>x.id===q) && (t.order.includes(v)||(config.responsePolicy?.allowTie!==false&&v==='tie'))) && Number.isFinite(t.activeMs) && t.activeMs>=0; });
}
export function answered(t, config) { const block=config.blocks.find(b=>b.id===t.block); return block.questions.every(q=>t.order.includes(t.answers[q.id])||(config.responsePolicy?.allowTie!==false&&t.answers[q.id]==='tie')); }
export function exportResponse(s, config) { return { ...s, participantMetadata: s.participantMetadata || {}, trials: s.trials.map(t=>({...t, displayOrder: t.order.map((id,i)=>({label:String.fromCharCode(65+i),candidateId:id}))})), questions: Object.fromEntries(config.blocks.map(b=>[b.id,b.questions])), exportedAt:new Date().toISOString() }; }
export function toCSV(s, config) {
 const rows=[['session_id','protocol','protocol_hash','seed','trial_id','block','question','choice_id','choice_label','display_order','active_ms','complete']];
 for (const t of s.trials) for(const q of config.blocks.find(b=>b.id===t.block).questions) {const v=t.answers[q.id]||'';rows.push([s.sessionId,s.protocol,s.protocolHash,s.seed,t.id,t.block,q.id,v,v==='tie'?'No clear preference':t.order.includes(v)?String.fromCharCode(65+t.order.indexOf(v)):'',t.order.join('|'),t.activeMs,Boolean(s.completedAt)]);}
 return rows.map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n');
}
export function formConfigured(c) { return !!c && /^https:\/\/docs\.google\.com\/forms\/d\/(?:e\/)?[\w-]+\/viewform$/.test(c.viewUrl) && ['session','refocus','bokeh','feedback'].every(k=>/^entry\.\d+$/.test(c.entries?.[k])); }
export function formURL(s, config, collector) {
 if(!formConfigured(collector)) throw Error('Google Form is not connected.');
 if(!s.consentAt || !s.completedAt || !s.trials.every(t=>answered(t,config))) throw Error('Complete all study questions before opening the submission form.');
 const url=new URL(collector.viewUrl);url.searchParams.set('usp','pp_url');
 const payload=exportResponse(s,config);
 const {questions,feedback,...metadata}=payload; delete metadata.trials; const trials=s.trials;
 url.searchParams.set(collector.entries.session,JSON.stringify(metadata));
 for(const id of ['refocus','bokeh']) url.searchParams.set(collector.entries[id],JSON.stringify(trials.filter(t=>t.block===id)));
 url.searchParams.set(collector.entries.feedback,s.feedback || '(none)');
 return url.href;
}

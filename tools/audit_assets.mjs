import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('../docs/',import.meta.url);
const config=JSON.parse(readFileSync(new URL('study.json',root)));
const delivery=JSON.parse(readFileSync(new URL('image-delivery.json',root)));
const urls=new Set(config.trials.flatMap(t=>[t.input,t.reference,...t.candidates.map(c=>c.src)].filter(Boolean)));
for(const src of urls){const m=delivery.assets[src];assert.ok(m,'Missing delivery entry '+src);for(const [path,hash] of [[src,m.sha256],[m.fallback,m.fallbackSha256]]){assert.ok(!path.startsWith('/')&&!path.includes('..'));const file=new URL(path,root);assert.ok(existsSync(file),'Missing '+path);assert.equal(createHash('sha256').update(readFileSync(file)).digest('hex'),hash,'Hash mismatch '+path);}}
for(const path of ['reviewer.html','reviewer.js','reviewer-models.json','setup.html','create-google-form.gs'])assert.equal(existsSync(new URL(path,root)),false,'Researcher file in public deployment: '+path);
console.log(`Verified ${urls.size} primary images and lossless fallbacks; public deployment excludes researcher pages.`);

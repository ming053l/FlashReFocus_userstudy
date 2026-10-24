import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {newSession,formURL} from '../docs/core.mjs';
const config=JSON.parse(readFileSync(new URL('../docs/study.json',import.meta.url)));
const source=readFileSync(new URL('../admin/create-google-form.gs',import.meta.url),'utf8');
const ctx=vm.createContext({});vm.runInContext(source,ctx);
const collector={viewUrl:'https://docs.google.com/forms/d/e/test/viewform',entries:{session:'entry.1',refocus:'entry.2',bokeh:'entry.3',feedback:'entry.4'}};
function record(seed=1,id='form-1',time='2026-10-24T10:00:00.000Z'){
 const s=newSession(config,seed);s.consentAt=s.startedAt;s.completedAt=s.startedAt;s.language='zh-Hant';s.feedback='中文 & English';
 for(const t of s.trials){t.activeMs=2500;for(const q of config.blocks.find(b=>b.id===t.block).questions)t.answers[q.id]=t.order[0];}
 const url=new URL(formURL(s,config,collector));
 return {id,time,fields:Object.fromEntries(Object.entries(collector.entries).map(([k,e])=>[k,url.searchParams.get(e)]))};
}
const table=(records,mapping={})=>JSON.parse(JSON.stringify(ctx.tabulateFlashReFocus_(records,mapping)));
test('Real participant Form payload expands to one respondent and all 48 correctly labeled answers',()=>{
 const r=record(),data=table([r]);assert.equal(data['答卷 Responses'][1][5],'valid');assert.equal(data['答卷 Responses'][1][8],30);assert.equal(data['答卷 Responses'][1][10],'中文 & English');assert.equal(data['逐題 Answers'].length,49);
 for(const row of data['逐題 Answers'].slice(1)){assert.equal(row[8],'A');assert.equal(row[11].split('|')[0],row[9]);assert.equal(row[12],2500);}
 assert.equal(data['票數 Summary'].slice(1).reduce((n,r)=>n+r[6],0),48);
});
test('Repeated submission counts first valid response once, regardless of event replay order',()=>{
 const r=record(),copy=structuredClone(r);copy.id='form-2';copy.time='2026-10-24T11:00:00.000Z';
 const data=table([copy,r]);assert.equal(data['逐題 Answers'].length,49);assert.deepEqual(data['答卷 Responses'].slice(1).map(r=>r[5]),['valid','duplicate']);assert.equal(data['問題 Issues'].length,2);assert.deepEqual(table([copy,r]),data);
});
test('Invalid answers are quarantined without blocking a later valid submission or other people',()=>{
 const r=record(),bad=structuredClone(r),group=JSON.parse(bad.fields.refocus);group[0].answers.focus='invented';bad.fields.refocus=JSON.stringify(group);bad.id='broken';bad.time='2026-10-24T09:00:00.000Z';
 const data=table([bad,r,record(2,'another')]);assert.equal(data['逐題 Answers'].length,97);assert.equal(data['問題 Issues'].length,2);assert.equal(data['答卷 Responses'][1][5],'invalid');
});
test('Rejects incomplete blocks, repeated scenes, malformed JSON, stale versions and negative times',()=>{
 for(const mutate of [
  r=>{r.fields.bokeh='[]';},r=>{r.fields.session='{bad';},
  r=>{const a=JSON.parse(r.fields.refocus);a[1]=a[0];r.fields.refocus=JSON.stringify(a);},
  r=>{const a=JSON.parse(r.fields.session);a.protocol='old';r.fields.session=JSON.stringify(a);},
  r=>{const a=JSON.parse(r.fields.bokeh);a[0].activeMs=-1;r.fields.bokeh=JSON.stringify(a);}
 ]){const r=record();mutate(r);assert.equal(table([r])['逐題 Answers'].length,1);assert.equal(table([r])['問題 Issues'].length,2);}
});
test('Private model mapping aggregates votes by model and separates protocol hashes',()=>{
 const a=record(),b=structuredClone(a),meta=JSON.parse(b.fields.session);meta.protocolHash='a'.repeat(64);b.fields.session=JSON.stringify(meta);b.id='other-version';
 const mapping=Object.fromEntries(config.trials.flatMap(t=>t.candidates.map(c=>[t.id+'|'+c.id,'Model']))),data=table([a,b],mapping),summary=data['票數 Summary'].slice(1);
 assert.equal(data['逐題 Answers'].length,97);assert.equal(summary.length,16);for(const r of summary){assert.equal(r[5],'Model');assert.equal(r[6],6);assert.equal(r[7],6);assert.equal(r[8],1);}
});
test('Empty results retain headers; participant text cannot become a Sheets formula',()=>{
 const d=table([]);for(const rows of Object.values(d))assert.equal(rows.length,1);
 assert.equal(ctx.safeSheetCell_('=IMPORTXML("x")'),'\'=IMPORTXML("x")');assert.equal(ctx.safeSheetCell_('  +123'),"'  +123");assert.equal(ctx.safeSheetCell_(12),12);assert.equal(ctx.safeSheetCell_('中文'),'中文');
});
test('Owner setup creates four correct entry IDs, reuses trigger and never submits a response',()=>{
 let created=0,submitCalls=0,triggerCount=0;const props=new Map(),logs=[],items=[];
 const item=()=>{let title='';const obj={setTitle(v){title=v;return obj;},setRequired(){return obj;},setHelpText(){return obj;},getTitle(){return title;},asParagraphTextItem(){return obj;},createResponse(v){return {key:title.match(/^\[(.+?)\]/)[1],value:v};}};return obj;};
 const form={getId:()=> 'form-id',getItems:()=>items,addParagraphTextItem(){const i=item();items.push(i);return i;},setDescription(){return form;},setCollectEmail(){return form;},setLimitOneResponsePerUser(){return form;},setPublishingSummary(){return form;},setConfirmationMessage(){return form;},getDestinationId:()=>null,setDestination(){},supportsAdvancedResponderPermissions:()=>true,setPublished(){},setAcceptingResponses(){},getPublishedUrl:()=>collector.viewUrl,getEditUrl:()=> 'https://docs.google.com/forms/d/test/edit',createResponse(){const responses=[];return {withItemResponse(v){responses.push(v);return this;},toPrefilledUrl:()=>collector.viewUrl+'?'+responses.map((r,i)=>`entry.${i+1}=${r.value}`).join('&'),submit(){submitCalls++;}};}};
 const range={setValues(){return range;},setWrap(){}};const sheet={getLastRow:()=>0,getRange:()=>range,setFrozenRows(){},setColumnWidth(){},getDataRange:()=>range};const book={getUrl:()=> 'https://docs.google.com/spreadsheets/d/test/edit',getId:()=> 'sheet-id',getSheetByName:()=>sheet};
 const context=vm.createContext({PropertiesService:{getScriptProperties:()=>({getProperty:k=>props.get(k),setProperty(k,v){props.set(k,v);}})},LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){}})},FormApp:{create(){created++;return form;},openById:()=>form,DestinationType:{SPREADSHEET:'sheet'}},SpreadsheetApp:{create:()=>book,openById:()=>book},ScriptApp:{getProjectTriggers:()=>triggerCount?[{getHandlerFunction:()=> 'receiveFlashReFocusResponse',getTriggerSourceId:()=> 'form-id'}]:[],newTrigger(){return {forForm(){return this;},onFormSubmit(){return this;},create(){triggerCount++;}};}},Logger:{log:v=>logs.push(v)}});
 vm.runInContext(source,context);context.rebuildFlashReFocusResultsUnlocked_=()=>{};
 context.createFlashReFocusForm();context.createFlashReFocusForm();
 assert.equal(created,1);assert.equal(items.length,4);assert.equal(triggerCount,1);assert.equal(submitCalls,0);
 const output=JSON.parse(logs.find(x=>x.startsWith('CONFIG_FOR_CODEX')).split('\n')[1]);assert.deepEqual(output.entries,collector.entries);
});

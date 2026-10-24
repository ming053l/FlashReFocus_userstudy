// Bounded, deduplicated image transfers. Transport changes never alter study pixels.
export class AssetLoader {
 constructor({fetcher=(...args)=>globalThis.fetch(...args),decode,createURL=b=>URL.createObjectURL(b),revokeURL=u=>URL.revokeObjectURL(u),concurrency=3,timeout=12000,maxDuration=60000,maxEntries=18,maxBytes=24*1024*1024,retryDelay=250}={}){
  Object.assign(this,{fetcher,decode,createURL,revokeURL,concurrency,timeout,maxDuration,maxEntries,maxBytes,retryDelay});this.entries=new Map();this.queue=[];this.running=0;this.background=0;this.clock=0;
 }
 acquire(key,{sources=[key],width,height,priority='foreground',onAttempt=()=>{}}={}){
  let entry=this.entries.get(key);
  if(!entry||entry.state==='error'||entry.controller.signal.aborted){
   entry={key,sources:[...new Set(sources)],width,height,priority,refs:0,state:'queued',controller:new AbortController(),listeners:new Set(),last:++this.clock,bytes:0};
   entry.promise=new Promise((resolve,reject)=>Object.assign(entry,{resolve,reject}));entry.promise.catch(()=>{});this.entries.set(key,entry);this.queue.push(entry);
  }
  entry.refs++;entry.last=++this.clock;entry.listeners.add(onAttempt);if(priority==='foreground')entry.priority=priority;this.pump();
  let released=false;
  return {promise:entry.promise,release:({keepPending=false}={})=>{if(released)return;released=true;entry.refs--;entry.listeners.delete(onAttempt);if(!keepPending&&!entry.refs&&['queued','loading'].includes(entry.state)){entry.controller.abort();if(this.entries.get(key)===entry)this.entries.delete(key);}this.trim();this.pump();}};
 }
 pump(){
  while(this.running<this.concurrency){
   const ready=this.queue.filter(e=>!e.controller.signal.aborted&&(e.priority==='foreground'||this.background===0));
   const entry=ready.find(e=>e.priority==='foreground')||ready[0];if(!entry)break;
   this.queue.splice(this.queue.indexOf(entry),1);this.running++;const background=entry.priority!=='foreground';if(background)this.background++;
   this.run(entry).then(entry.resolve,entry.reject).finally(()=>{this.running--;if(background)this.background--;this.trim();this.pump();});
  }
  this.queue=this.queue.filter(e=>{if(!e.controller.signal.aborted)return true;e.state='error';e.reject(new Error('Image request cancelled'));return false;});
 }
 async run(entry){
  entry.state='loading';let lastError;
  for(let attempt=0;attempt<3;attempt++){
   if(entry.controller.signal.aborted)break;
   for(const listener of entry.listeners)listener({attempt:attempt+1,total:3});
   const controller=new AbortController(),cancel=()=>controller.abort();entry.controller.signal.addEventListener('abort',cancel,{once:true});
   let idleTimer;const touch=()=>{clearTimeout(idleTimer);idleTimer=setTimeout(cancel,this.timeout);};touch();const deadline=setTimeout(cancel,this.maxDuration);let url;
   try{
    let source=entry.sources[attempt%entry.sources.length];
    if(attempt>=entry.sources.length){const u=new URL(source,globalThis.location?.href||'http://localhost/');u.searchParams.set('retry',`${Date.now()}-${attempt}`);source=u.href;}
    const response=await this.fetcher(source,{signal:controller.signal,credentials:'same-origin',cache:attempt?'reload':'default'});
    if(!response.ok)throw Error(`Image HTTP ${response.status}`);
    touch();let blob;
    if(response.body?.getReader){
     const reader=response.body.getReader(),chunks=[];
     try{while(true){const {done,value}=await reader.read();if(done)break;chunks.push(value);touch();}blob=new Blob(chunks,{type:response.headers?.get('content-type')||'application/octet-stream'});}
     finally{reader.releaseLock();}
    }else blob=await response.blob();
    if(!blob.size)throw Error('Empty image');
    url=this.createURL(blob);await this.decode(url,entry,controller.signal);
    if(controller.signal.aborted||entry.controller.signal.aborted)throw Error('Image request cancelled or timed out');
    entry.url=url;entry.bytes=blob.size;entry.state='ready';entry.last=++this.clock;return {url,width:entry.width,height:entry.height};
   }catch(error){if(url)this.revokeURL(url);lastError=error;entry.error=error.message;}
   finally{clearTimeout(idleTimer);clearTimeout(deadline);entry.controller.signal.removeEventListener('abort',cancel);}
   if(!entry.controller.signal.aborted&&attempt<2)await new Promise(resolve=>setTimeout(resolve,this.retryDelay*(attempt+1)));
  }
  entry.state='error';throw lastError||Error('Image request cancelled');
 }
 trim(){
  let bytes=[...this.entries.values()].reduce((n,e)=>n+e.bytes,0);
  for(const e of [...this.entries.values()].sort((a,b)=>a.last-b.last)){
   if(this.entries.size<=this.maxEntries&&bytes<=this.maxBytes)break;
   if(e.refs||!['ready','error'].includes(e.state))continue;
   if(e.url)this.revokeURL(e.url);this.entries.delete(e.key);bytes-=e.bytes;
  }
 }
 clear(){for(const e of this.entries.values()){e.controller.abort();if(e.url)this.revokeURL(e.url);}this.entries.clear();this.pump();}
}

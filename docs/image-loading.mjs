import {AssetLoader} from './asset-loader.mjs';
function decode(url,entry,signal){return new Promise((resolve,reject)=>{
 const img=new Image();let finished=false;
 const finish=error=>{if(finished)return;finished=true;signal.removeEventListener('abort',cancel);img.onload=img.onerror=null;if(error){img.src='';reject(error);}else resolve();};
 const cancel=()=>finish(Error('Image decode cancelled'));signal.addEventListener('abort',cancel,{once:true});
 if(signal.aborted)return cancel();
 img.onload=()=>finish((entry.width&&img.naturalWidth!==entry.width)||(entry.height&&img.naturalHeight!==entry.height)?Error('Incorrect image dimensions'):null);
 img.onerror=()=>finish(Error('Invalid image data'));img.src=url;
});}
export const imageLoader=new AssetLoader({decode});
export async function fetchJSON(path,{attempts=3,timeout=7000}={}){
 let error;
 for(let attempt=0;attempt<attempts;attempt++){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeout);
  try{const r=await fetch(path,{signal:controller.signal,credentials:'same-origin',cache:'no-cache'});if(!r.ok)throw Error(`Unable to load ${path} (${r.status})`);return await r.json();}catch(e){error=e;}finally{clearTimeout(timer);}
  if(attempt+1<attempts)await new Promise(resolve=>setTimeout(resolve,250*(attempt+1)));
 }
 throw Error('Unable to load study configuration.');
}
async function delivery(){try{return (await fetchJSON('image-delivery.json',{attempts:2,timeout:5000})).assets||{};}catch{return {};}}
const deliveryReady=delivery();
export async function acquireImage(src,options={}){
 const assets=await deliveryReady,meta=assets[src]||{};if(options.signal?.aborted)throw Error('Image view disposed');
 const fallback=meta.fallback||src.replace(/\/([^/]+)\.(png|webp)$/,(match,name,ext)=>`/fallbacks/${name}.${ext==='png'?'webp':'png'}`);
 return imageLoader.acquire(src,{...meta,...options,sources:[src,fallback].filter(Boolean)});
}
let prefetchGeneration=0;
let prefetchHandles=[];
export function cancelPrefetch(){prefetchGeneration++;for(const handle of prefetchHandles)handle.release({keepPending:true});prefetchHandles=[];}
export async function prefetchTrial(trial){
 cancelPrefetch();if(!trial)return;const generation=prefetchGeneration;
 const urls=[...new Set([trial.input,trial.reference,...trial.candidates.map(c=>c.src)].filter(Boolean))];
 // One next-page transfer at a time; foreground requests always take priority.
 for(const src of urls){
  if(generation!==prefetchGeneration)return;
  const handle=await acquireImage(src,{priority:'prefetch'});
  if(generation!==prefetchGeneration){handle.release();return;}
  prefetchHandles.push(handle);try{await handle.promise;}catch{}
 }
}

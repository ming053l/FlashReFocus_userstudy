// Shared participant/reviewer translations. Answer and candidate IDs stay language independent.
const pairs = [
['Retrying image…','正在重新載入圖片…'],
['Image Refocusing Study','影像重新對焦研究'],['Image Refocusing','影像重新對焦'],['Study','研究'],['PILOT STUDY','先導研究'],['MODEL LABELS ON','顯示模型名稱'],
['Model Comparison · Researcher View','模型比較 · 研究者檢視'],['Loading study…','正在載入研究…'],['Visual preference study','視覺偏好研究'],['Anonymous comparisons · No model names shown','匿名比較 · 不顯示模型名稱'],['Researcher view · Model names shown','研究者檢視 · 顯示模型名稱'],
['Close image','關閉圖片'],['Close ✕','關閉 ✕'],['Scroll to inspect the image at its prepared full size.','捲動以檢視研究所用圖片的完整尺寸。'],['Enlarged study image','放大的研究圖片'],
['A CLOSER LOOK AT FOCUS','仔細觀察對焦效果'],['Same photograph.','同一張照片。'],['Different focus.','不同的對焦效果。'],['Your perspective.','由你來評選。'],
['Help us understand what makes a refocused photograph look convincing. Compare anonymous results and choose the ones you prefer.','請協助我們了解，什麼樣的重新對焦效果看起來更真實。比較匿名結果，選出你較喜歡的圖片。'],
['2 sections · 4 questions per comparison','共 2 個部分 · 每組比較有 4 題'],['About 8–12 minutes','約需 8–12 分鐘'],
['This is a pilot preview. Responses are submitted through Google Forms after you finish.','這是先導研究預覽。完成後，請透過 Google 表單送出答案。'],
['This is a pilot preview. Google Forms is not connected yet. You can try the full study and download your answers; nothing is sent to a researcher.','這是先導研究預覽，目前尚未連接 Google 表單。你可以體驗完整流程並下載答案；資料不會傳送給研究者。'],
['I am at least 18, voluntarily agree to participate, and understand that I can stop at any time. My choices, comparison order, and viewing times will be recorded. No name or email is requested by this study.','我已年滿 18 歲，自願參與本研究，並了解可以隨時停止。研究會記錄我的選擇、比較順序及觀看時間，不會要求姓名或電子郵件。'],
['Resume study','繼續作答'],['Begin study','開始作答'],['Start over','重新開始'],['Progress is saved on this browser until you clear it.','作答進度會保存在此瀏覽器，直到你自行清除。'],['Browser storage is unavailable. Keep this tab open and download a backup.','瀏覽器無法儲存進度。請保持此分頁開啟，並下載答案備份。'],
['HOW IT WORKS','作答方式'],['Find the subject','找到主體'],['The yellow ring marks the intended focal point in the original photo.','原圖上的黃色圓環標示預期的對焦位置。'],['Compare the anonymous results','比較匿名結果'],['All results show the same scene. Their positions are randomized, and the method names are hidden.','所有結果都是同一個場景，排列位置隨機，且不顯示方法名稱。'],['Choose for each question','回答每一題'],['Judge focus and naturalness separately. Select one result for each question.','請分別評估對焦效果與自然程度，每題選擇一張結果。'],
['Use a laptop or desktop when possible. Zoom or drag directly on any photo; every result follows the same view. There are no right or wrong preferences.','建議使用筆記型或桌上型電腦。直接在任一圖片上縮放或拖曳，所有結果會同步顯示相同區域。偏好沒有標準答案。'],['Researcher setup →','研究者設定 →'],
['START HERE','從這裡開始'],['Original photograph','原始照片'],['Intended focal point','預期對焦位置'],['Scroll to zoom · Drag to pan.','滾輪縮放 · 拖曳平移。'],['Reference photograph','參考照片'],['Captured reference photograph','實拍參考照片'],['The captured shallow-depth-of-field target.','實際拍攝的淺景深目標效果。'],['Linked view','同步檢視'],['Loading all photographs…','正在載入所有照片…'],['Loading photographs…','正在載入照片…'],['Four required questions','四個必答問題'],['Completed comparisons','已完成的比較'],
['Instructions','作答說明'],['Previous','上一組'],['Progress saved on this browser','進度已儲存在此瀏覽器'],['Storage unavailable — keep this tab open','無法儲存進度，請保持此分頁開啟'],['Review & finish','檢查並完成'],['Next comparison','下一組比較'],
['All photographs loaded. Compare them at your own pace.','所有照片已載入，請依自己的步調比較。'],['A photograph could not load. Answers stay saved.','有照片無法載入，答案仍會保留。'],['Retry images','重新載入圖片'],
['Thank you for','感謝你'],['taking a closer look.','仔細觀察與作答。'],['Your choices help us understand which details matter in a refocused photograph.','你的選擇能協助我們了解，哪些細節會影響重新對焦照片的品質。'],
['Your responses have not been submitted yet. Open the prefilled Google Form below and press Submit there to send your answers.','答案尚未送出。請開啟下方已填好的 Google 表單，並在表單中按下「提交」以送出答案。'],
['Pilot preview: your answers are saved only in this browser. Google Forms is not connected yet, so no answers have been sent.','先導研究預覽：答案只儲存在此瀏覽器。目前尚未連接 Google 表單，因此沒有送出任何答案。'],
['Anything you noticed?','有什麼想補充的嗎？'],['(optional)','（選填）'],['Tell us about any difficult comparisons or technical issues.','歡迎告訴我們哪些比較較難判斷，或是否遇到技術問題。'],['Open Google Form to submit ↗','開啟 Google 表單並送出 ↗'],['Download answers (JSON)','下載答案（JSON）'],['CSV backup','CSV 備份'],['Review my answers','檢查我的答案'],['Clear answers from this browser','清除此瀏覽器的答案'],
['Clear this response from this browser? Download a backup first. This does not delete any response already submitted to Google Forms.','要清除此瀏覽器的答案嗎？請先下載備份。這不會刪除已送出至 Google 表單的答案。'],['Finish by pressing Submit in Google Forms. This page cannot confirm an external submission.','請在 Google 表單中按下「提交」完成送出。此頁面無法確認外部表單是否已成功提交。'],['Start a new response? Current answers on this browser will be replaced.','要重新作答嗎？此瀏覽器目前的答案將被取代。'],
['Unable to load study configuration.','無法載入研究設定。'],['Please reload this page or contact the researcher.','請重新整理此頁面，或聯絡研究者。'],['Google Form is not connected.','尚未連接 Google 表單。'],['Complete all study questions before opening the submission form.','請先回答全部研究問題，再開啟提交表單。'],
['Refocusing a photograph','照片重新對焦'],['The original photo is partly out of focus. Compare attempts to bring the marked subject into focus.','原始照片有部分區域失焦。請比較各結果將標記主體重新對焦的效果。'],
['Which result best brings the marked subject into focus?','哪一張結果最能讓標記的主體清楚對焦？'],['Look for clear, believable detail at the marked location.','請觀察標記位置的細節是否清晰、真實。'],
['Which result best preserves the identity and structure of the original scene?','哪一張結果最能保留原始場景的內容與結構？'],['Compare with the original. Look for faithful objects, shapes, colors and textures rather than invented or altered content.','請與原圖比較，觀察物體、形狀、色彩與紋理是否忠實保留，有無新增或改變的內容。'],
['Which result has the fewest visible artifacts?','哪一張結果可見的影像瑕疵最少？'],['Look for halos, ringing, doubled edges, distorted textures or unnatural transitions.','請留意光暈、振鈴、重複邊緣、扭曲紋理或不自然的過渡。'],
['Which result would you prefer as the final photograph?','如果要選一張作為最終照片，你較喜歡哪一張？'],['Make an overall judgment of focus, naturalness and visual quality.','請綜合評估對焦效果、自然程度與整體視覺品質。'],
['Rendering depth of field','景深渲染'],['The original photo is mostly sharp. Compare rendered versions with a shallow depth of field. The reference is a captured photograph of the intended effect.','原始照片大部分區域清晰。請比較各種淺景深渲染結果；參考照片是實際拍攝的預期效果。'],
['Which result most naturally reproduces the reference depth of field?','哪一張結果最自然地呈現參考照片的景深效果？'],['Compare the blur distribution, transitions and boundaries with the reference photograph.','請與參考照片比較模糊區域的分布、過渡及邊界。'],
['Which result best preserves the subject and scene details?','哪一張結果最能保留主體與場景細節？'],['Compare the marked subject with the original. Look for faithful detail, color and structure.','請將標記主體與原圖比較，觀察細節、色彩與結構是否忠實保留。'],
['Look for edge halos, color bleeding, ghosting, patchy blur or distorted textures.','請留意邊緣光暈、色彩溢出、殘影、不均勻的模糊或扭曲紋理。'],['Make an overall judgment of the depth-of-field effect, scene fidelity and visual quality.','請綜合評估景深效果、場景還原程度與整體視覺品質。'],
['Synchronized image zoom','同步圖片縮放'],['Linked zoom','同步縮放'],['Zoom out','縮小'],['Zoom in','放大'],['Image magnification','圖片放大倍率'],['Fit','符合視窗'],['Focus point ↗','對焦位置 ↗'],['Scroll to zoom · Drag to pan · All images move together','滾輪縮放 · 拖曳平移 · 所有圖片同步移動'],
['Original photograph for comparison','供比較的原始照片'],['Original','原圖'],['Loading image…','正在載入圖片…'],['Retry image','重新載入圖片'],['Image could not load','圖片無法載入'],['Image is taking longer to load','圖片載入時間較長'],
['RESEARCHER VIEW · MODEL NAMES SHOWN','研究者檢視 · 顯示模型名稱'],['All photographs loaded. Zoom or drag any image to compare the same details across models.','所有照片已載入。縮放或拖曳任一圖片，即可比較各模型的相同細節。'],['A photograph could not load. Use Retry image on its card.','有照片無法載入，請點選該圖片上的「重新載入圖片」。'],['Questionnaire preview','問卷預覽'],['Unable to load model comparisons.','無法載入模型比較。'],
['Drag the ↔ divider to compare the original and result. Drag elsewhere to pan; scroll to zoom all images together.','拖動圖片中間的 ↔ 比較原圖與模型結果；在圖片其他區域拖曳可同步平移，滾輪可同步縮放。'],['Choose photograph','選擇照片'],['Anonymous study ↗','匿名作答版 ↗'],['Previous photograph','上一張'],['Next photograph','下一張'],
];
const zh = new Map(pairs), en = new Map(pairs.map(([a,b])=>[b,a]));
let language='en';
try { language=new URL(location.href).searchParams.get('lang') || localStorage.getItem('refocus-study-language') || 'en'; } catch {}
if(language==='zh')language='zh-Hant';
if(!['en','zh-Hant'].includes(language))language='en';
export const getLanguage=()=>language;
export function t(source){
 const original=en.get(source)||source;
 if(language==='en')return original;
 if(zh.has(original))return zh.get(original);
 const rules=[
 [/^Loaded (\d+) of (\d+) photographs…$/,m=>`已載入 ${m[1]}／${m[2]} 張照片…`],
 [/^(\d+) comparisons$/,m=>`${m[1]} 組比較`],
 [/^SECTION (\d+) OF 2 · (.*)$/,m=>`第 ${m[1]} 部分，共 2 部分 · ${m[2]}`],
 [/^(\d+) COMPARISONS COMPLETE$/,m=>`已完成 ${m[1]} 組比較`],
 [/^Answer all (\d+) questions to continue\.$/,m=>`請回答全部 ${m[1]} 題後繼續。`],
 [/^Result ([A-Z])$/,m=>`結果 ${m[1]}`],
 [/^Response ID: (.*)$/,m=>`作答編號：${m[1]}`],
 [/^Questionnaire preview · (\d+) questions per page · No answers recorded$/,m=>`問卷題目預覽 · 每頁 ${m[1]} 題 · 此頁不記錄答案`],
 [/^(.*) · Fixed model order for comparison$/,m=>`${m[1]} · 固定模型順序，方便對照`],
 [/^(\d+)% original, (\d+)% result$/,m=>`${m[1]}% 原圖，${m[2]}% 結果`],
 [/^Original and (.*) comparison divider$/,m=>`原圖與${t(m[1])}的比較分隔線`],
 [/^(.*)\. Scroll to zoom, drag to pan\. Use plus, minus and arrow keys to inspect\.$/,m=>`${t(m[1])}。滾輪縮放、拖曳平移，也可使用加號、減號及方向鍵檢視。`],
 ];
 for(const [pattern,fn] of rules){const m=original.match(pattern);if(m)return fn(m);}
 const numbered=original.match(/^(\d+\. )(.+)$/);if(numbered)return numbered[1]+t(numbered[2]);
 const arrow=original.match(/^(← |→ )(.+)$/);if(arrow)return arrow[1]+t(arrow[2]);
 const suffix=original.match(/^(.+?)( →| ↗)$/);if(suffix)return t(suffix[1])+suffix[2];
 return original;
}
const originals=new WeakMap();
function localized(node,key,value){
 let saved=originals.get(node);if(!saved){saved={};originals.set(node,saved);}
 const prev=saved[key];const source=prev&&value===prev.output?prev.source:value;
 const match=source.match(/^(\s*)([\s\S]*?)(\s*)$/);
 const output=match[1]+t(match[2])+match[3];saved[key]={source,output};return output;
}
export function localize(root=document){
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 let node;while((node=walker.nextNode())){if(node.parentElement?.closest('script,style,code,pre,textarea,[data-i18n-skip]'))continue;const next=localized(node,'text',node.nodeValue);if(node.nodeValue!==next)node.nodeValue=next;}
 const elements=[...(root.nodeType===1?[root]:[]),...root.querySelectorAll('[aria-label],[alt],[placeholder],[title]')];
 for(const el of elements)for(const attr of ['aria-label','alt','placeholder','title'])if(el.hasAttribute(attr)){const value=el.getAttribute(attr),next=localized(el,attr,value);if(value!==next)el.setAttribute(attr,next);}
 document.documentElement.lang=language;
}
export function initLanguage(onChange=()=>{}){
 const header=document.querySelector('header');
 const controls=document.createElement('div');controls.className='header-controls';
 const badge=header.querySelector('.pilot');if(badge)controls.append(badge);
 const picker=document.createElement('label');picker.className='language-picker';picker.innerHTML='<span class="sr-only">Language / 語言</span><select id="language" aria-label="Language / 語言"><option value="zh-Hant">中文</option><option value="en">English</option></select>';
 controls.append(picker);header.append(controls);const select=picker.querySelector('select');select.value=language;
 select.addEventListener('change',()=>{language=select.value;try{localStorage.setItem('refocus-study-language',language);}catch{}const url=new URL(location.href);url.searchParams.set('lang',language);history.replaceState(null,'',url);onChange(language);localize();});
 localize();
 // Translate text from async image status and rerenders without replacing controls or listeners.
 const observer=new MutationObserver(()=>localize());observer.observe(document.body,{subtree:true,childList:true,characterData:true});
}

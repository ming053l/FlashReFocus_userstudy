var FLASHREFOCUS_SPEC = {"version":"flashrefocus-two-block-curated-v6-genrefocus-complete","blocks":{"refocus":{"count":6,"questions":[{"id":"focus","text":"Which result best brings the marked subject into focus?"},{"id":"fidelity","text":"Which result best preserves the identity and structure of the original scene?"},{"id":"artifacts","text":"Which result has the fewest visible artifacts?"},{"id":"quality","text":"Which result would you prefer as the final photograph?"}]},"bokeh":{"count":6,"questions":[{"id":"naturalness","text":"Which result most naturally reproduces the reference depth of field?"},{"id":"preservation","text":"Which result best preserves the subject and scene details?"},{"id":"artifacts","text":"Which result has the fewest visible artifacts?"},{"id":"quality","text":"Which result would you prefer as the final photograph?"}]}},"trials":{"lfdof-01":{"block":"refocus","ids":["1463d0276315bc30","4938ebf7bb220fe2","73fd54a2fbc8ba41","74c2c22036453269","c5d57f5179721a26"]},"lfdof-06":{"block":"refocus","ids":["36e270596c6ad8c6","56a7695a8a5ae8bf","8071e4373eeb5cc8","8c9be1221219584e","e01be17d24b6cf82"]},"lfdof-08":{"block":"refocus","ids":["062cb03353442c33","7b80861ccd6638f7","985bc591d3716fd1","a1ecbaab9282a4d5","c2c68f6ebb75d2f3"]},"lfdof-22":{"block":"refocus","ids":["00e7ce3149be4395","60989ff2774a0549","86a4367382d05460","bf154ef84a3502fd","d207d927e9273a76"]},"lfdof-33":{"block":"refocus","ids":["0061f45a42545ebe","52c74efc2ac1a931","63e3cf16d59c14d8","cdf4bb6b94835b02","d5adcd7db85f9a2a"]},"lfdof-37":{"block":"refocus","ids":["32a67848581a8ea9","4521e708ec247220","454578662bc3af68","9cea7370c7d49338","c1532592664cc49e"]},"3creal-19":{"block":"bokeh","ids":["13a089e86d35cdda","319b9b507995b9c9","33f05b872defc72d","99100c9367456a38","fcb436abaeaecff4"]},"3creal-32":{"block":"bokeh","ids":["05f3b94d89776bb6","6a1f4b2478249173","74313986724d2327","c68ee9a6a409e77c","f63c6d449fd76ab5"]},"3creal-35":{"block":"bokeh","ids":["2ffa00f7338ed63c","aa7321a66136b9c9","e22c08abcbb39803","eef765bbfcfa17aa","f0a65a854ee0bc45"]},"3creal-43":{"block":"bokeh","ids":["23ee9e585a6a02d7","5281dcd806f86385","567cc17485022c9d","b6efc16788fb4cdd","d9924ddca3140a54"]},"3creal-72":{"block":"bokeh","ids":["2b61f0fb17d8392f","4dc12b1a1e1ab53c","7b49b5505914709a","991204b8917d6a89","d547694488adc15e"]},"3creal-82":{"block":"bokeh","ids":["0a298d943d2b8d90","361b439e83a79001","4c6b27d6a9a8009a","990d8bc7e8285392","ccd30216b909b8f8"]}}};

/** Owner setup: paste this whole file into script.google.com, run createFlashReFocusForm.
 * Creates/reuses a private response spreadsheet and installs a Form submission trigger.
 * Never submits a fabricated response. See admin/SETUP.md for activation and export.
 */
function createFlashReFocusForm() {
  var lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    var props = PropertiesService.getScriptProperties();
    var existing = props.getProperty('FLASHREFOCUS_FORM_ID');
    var form = existing ? FormApp.openById(existing) : FormApp.create('USRT STUDY — 回答收集 / Responses');
    props.setProperty('FLASHREFOCUS_FORM_ID', form.getId());
    var titles = {
      session: '[session] 作答資料 / Response metadata',
      refocus: '[refocus] 重新對焦答案 / Refocusing answers',
      bokeh: '[bokeh] 景深答案 / Bokeh answers',
      feedback: '[feedback] 補充意見 / Optional comments'
    }, items = {};
    form.getItems().forEach(function(item) {
      var match = /^\[(session|refocus|bokeh|feedback)\]/.exec(item.getTitle());
      if (match) items[match[1]] = item.asParagraphTextItem();
    });
    Object.keys(titles).forEach(function(key) {
      if (!items[key]) items[key] = form.addParagraphTextItem().setTitle(titles[key]);
      items[key].setRequired(key !== 'feedback').setHelpText(key === 'feedback' ?
        '可保留原本意見，或補充。 / You may add comments.' :
        '網站已自動填入全部答案，請勿修改。 / Automatically filled; please do not edit.');
    });
    form.setDescription('你已完成圖片比較，請直接按最下方「提交」。不需重新回答。\nYour answers are already filled. Scroll down and press Submit. No name or email is requested.');
    form.setCollectEmail(false).setLimitOneResponsePerUser(false).setPublishingSummary(false);
    form.setConfirmationMessage('已收到，謝謝！ / Your response has been recorded. Thank you!');
    var sheetId = null;
    try {
      sheetId = form.getDestinationId();
    } catch (error) {
      // A new Form throws here instead of returning null (including zh-TW accounts).
      // Other failures must surface; do not create a new spreadsheet on permission errors.
      if (!/(?:no|not have|without).*destination|(?:沒有|未設定).*(?:回覆|回應).*目標/i.test(String(error))) throw error;
    }
    if (!sheetId) {
      sheetId = props.getProperty('FLASHREFOCUS_SHEET_ID');
      if (!sheetId) {
        var created = SpreadsheetApp.create('FlashReFocus — 回答與統計 / Responses and results');
        sheetId = created.getId();
        // Save before linking so retrying an interrupted setup reuses this spreadsheet.
        props.setProperty('FLASHREFOCUS_SHEET_ID', sheetId);
      }
      form.setDestination(FormApp.DestinationType.SPREADSHEET, sheetId);
    }
    var book = SpreadsheetApp.openById(sheetId);
    props.setProperty('FLASHREFOCUS_SHEET_ID', sheetId);
    props.setProperty('FLASHREFOCUS_SHEET_URL', book.getUrl());
    var codebook = book.getSheetByName('Codebook') || book.insertSheet('Codebook');
    if (!codebook.getLastRow()) codebook.getRange(1,1,1,3).setValues([['trial_id','candidate_id','model']]);
    codebook.setFrozenRows(1);
    var guide = book.getSheetByName('說明 Guide') || book.insertSheet('說明 Guide');
    guide.getRange(1,1,8,2).setValues([
      ['工作表 / Tab','用途 / Purpose'],
      ['答卷 Responses','每次提交一列；valid 才計票。重複的同版本、同 Response ID 只算第一次有效提交。'],
      ['逐題 Answers','每份有效答卷 48 列；含場景、題目、隨機位置、候選 ID、模型與觀看時間。'],
      ['票數 Summary','按問卷版本、protocol hash、部分、問題、模型彙總；不是代表整個 benchmark 的隨機樣本。'],
      ['問題 Issues','格式不完整、未知版本或重複提交；原始 Google 表單回應仍保留。'],
      ['Codebook','研究者私下匯入 trial_id,candidate_id,model 對照表後，執行 rebuildFlashReFocusResults 更新模型名稱。'],
      ['匯出 / Export','檔案 → 下載 → Microsoft Excel (.xlsx)，或選擇工作表後下載 CSV。'],
      ['重新整理 / Recover','若觸發器失敗，可在 Apps Script 執行 rebuildFlashReFocusResults；不刪原始回應。']
    ]);
    guide.setFrozenRows(1); guide.setColumnWidth(1,190); guide.setColumnWidth(2,800); guide.getDataRange().setWrap(true);
    var hasTrigger = ScriptApp.getProjectTriggers().some(function(t) {
      return t.getHandlerFunction() === 'receiveFlashReFocusResponse' && t.getTriggerSourceId() === form.getId();
    });
    if (!hasTrigger) ScriptApp.newTrigger('receiveFlashReFocusResponse').forForm(form).onFormSubmit().create();
    if (form.supportsAdvancedResponderPermissions()) form.setPublished(true);
    form.setAcceptingResponses(true);
    rebuildFlashReFocusResultsUnlocked_(form, book);
    var draft = form.createResponse();
    Object.keys(items).forEach(function(key) { draft.withItemResponse(items[key].createResponse('FLASHREFOCUS_'+key)); });
    var entries = {}, query = draft.toPrefilledUrl().split('?')[1];
    query.split('&').forEach(function(part) {
      var pair=part.split('='), value=decodeURIComponent((pair[1]||'').replace(/\+/g,' '));
      if (value.indexOf('FLASHREFOCUS_')===0) entries[value.slice(13)]=decodeURIComponent(pair[0]);
    });
    Logger.log('CONFIG_FOR_CODEX\n'+JSON.stringify({type:'google-forms',viewUrl:form.getPublishedUrl(),entries:entries}));
    Logger.log('EDIT_FORM: '+form.getEditUrl());
    Logger.log('VIEW_RESPONSES: '+book.getUrl());
    Logger.log('將 CONFIG_FOR_CODEX 貼回對話以連接網站。 / Paste CONFIG_FOR_CODEX back to connect the site.');
  } finally { lock.releaseLock(); }
}

function receiveFlashReFocusResponse(event) {
  if (!event || !event.response) throw new Error('This function runs from the Google Form submit trigger. Use rebuildFlashReFocusResults for a manual refresh.');
  rebuildFlashReFocusResults();
}

function rebuildFlashReFocusResults() {
  var lock = LockService.getScriptLock(); lock.waitLock(30000);
  try {
    var props = PropertiesService.getScriptProperties();
    rebuildFlashReFocusResultsUnlocked_(FormApp.openById(props.getProperty('FLASHREFOCUS_FORM_ID')),
      SpreadsheetApp.openById(props.getProperty('FLASHREFOCUS_SHEET_ID')));
  } finally { lock.releaseLock(); }
}

function rebuildFlashReFocusResultsUnlocked_(form, book) {
  var records = form.getResponses().map(function(response) {
    var fields = {};
    response.getItemResponses().forEach(function(item) {
      var match = /^\[(session|refocus|bokeh|feedback)\]/.exec(item.getItem().getTitle());
      if (match) fields[match[1]] = item.getResponse();
    });
    return {id:response.getId(),time:response.getTimestamp().toISOString(),fields:fields};
  });
  var codebook = {}, mapping = book.getSheetByName('Codebook');
  if (mapping && mapping.getLastRow()>1) mapping.getRange(2,1,mapping.getLastRow()-1,3).getValues().forEach(function(row) {
    if (row[0] && row[1] && row[2]) codebook[row[0]+'|'+row[1]] = String(row[2]);
  });
  var result = tabulateFlashReFocus_(records, codebook);
  // Only derived tabs are replaced. Original Google Form responses and Codebook are untouched.
  Object.keys(result).forEach(function(name) {
    var sheet = book.getSheetByName(name) || book.insertSheet(name), rows = result[name];
    if (sheet.getMaxRows()<rows.length) sheet.insertRowsAfter(sheet.getMaxRows(),rows.length-sheet.getMaxRows());
    if (sheet.getMaxColumns()<rows[0].length) sheet.insertColumnsAfter(sheet.getMaxColumns(),rows[0].length-sheet.getMaxColumns());
    sheet.clearContents();
    sheet.getRange(1,1,rows.length,rows[0].length).setValues(rows.map(function(row) { return row.map(safeSheetCell_); }));
    sheet.setFrozenRows(1); sheet.getRange(1,1,1,rows[0].length).setFontWeight('bold');
  });
  SpreadsheetApp.flush();
}

function safeSheetCell_(value) {
  // Treat participant comments as text, even if they begin with spreadsheet formula syntax.
  return typeof value === 'string' && /^[\s]*[=+@-]/.test(value) ? "'"+value : value;
}

function parseFlashReFocus_(record) {
  var meta = JSON.parse(record.fields.session), specs = FLASHREFOCUS_SPEC;
  if (!meta || meta.protocol !== specs.version || !/^[a-f0-9]{64}$/.test(meta.protocolHash) ||
      typeof meta.sessionId !== 'string' || !/^[\w-]{1,128}$/.test(meta.sessionId) ||
      !meta.consentAt || !meta.completedAt || !Number.isFinite(Date.parse(meta.consentAt)) ||
      !Number.isFinite(Date.parse(meta.completedAt))) throw new Error('Unknown protocol or incomplete response metadata');
  var trials = [], seen = {};
  Object.keys(specs.blocks).forEach(function(block) {
    var group = JSON.parse(record.fields[block]);
    if (!Array.isArray(group) || group.length !== specs.blocks[block].count) throw new Error('Incomplete block: '+block);
    group.forEach(function(trial) {
      var source = specs.trials[trial.id], qs = specs.blocks[block].questions;
      if (!source || source.block!==block || trial.block!==block || seen[trial.id]) throw new Error('Unknown or repeated scene');
      seen[trial.id] = true;
      if (!Array.isArray(trial.order) || trial.order.length !== source.ids.length ||
          new Set(trial.order).size !== source.ids.length || trial.order.some(function(id) {return source.ids.indexOf(id)<0;}) ||
          !Number.isFinite(trial.activeMs) || trial.activeMs<0 || !trial.answers ||
          Object.keys(trial.answers).length!==qs.length || qs.some(function(q) {return trial.order.indexOf(trial.answers[q.id])<0;})) {
        throw new Error('Invalid candidates, questions or viewing time: '+trial.id);
      }
      trials.push(trial);
    });
  });
  return {meta:meta,trials:trials,feedback:String(record.fields.feedback||'')};
}

function tabulateFlashReFocus_(records, codebook) {
  var sessions = [['submitted_at','form_response_id','response_id','protocol','protocol_hash','status','language','completed_at','active_seconds','answers','feedback']],
      answers = [['submitted_at','response_id','protocol','protocol_hash','block','trial_id','question_id','question','choice_label','candidate_id','model','display_order','active_ms']],
      summary = [['protocol','protocol_hash','block','question_id','question','model_or_candidate','votes','total_votes','share']],
      issues = [['submitted_at','form_response_id','response_id','reason']], seen = {}, totals = {}, counts = {};
  records.slice().sort(function(a,b) {return a.time.localeCompare(b.time)||a.id.localeCompare(b.id);}).forEach(function(record) {
    var parsed;
    try { parsed = parseFlashReFocus_(record); }
    catch (error) {
      sessions.push([record.time,record.id,'','','','invalid','','',0,0,'']);
      issues.push([record.time,record.id,'',String(error.message)]); return;
    }
    var meta=parsed.meta, key=meta.protocolHash+'|'+meta.sessionId, duplicate=!!seen[key], active=0, count=0;
    parsed.trials.forEach(function(trial) {
      active += trial.activeMs;
      FLASHREFOCUS_SPEC.blocks[trial.block].questions.forEach(function(q) {
        count++;
        if (duplicate) return;
        var id=trial.answers[q.id], model=codebook[trial.id+'|'+id]||id;
        answers.push([record.time,meta.sessionId,meta.protocol,meta.protocolHash,trial.block,trial.id,q.id,q.text,
          String.fromCharCode(65+trial.order.indexOf(id)),id,model,trial.order.join('|'),trial.activeMs]);
        var totalKey=JSON.stringify([meta.protocol,meta.protocolHash,trial.block,q.id,q.text]);
        totals[totalKey]=(totals[totalKey]||0)+1;
        var voteKey=JSON.stringify([meta.protocol,meta.protocolHash,trial.block,q.id,q.text,model]);
        counts[voteKey]=(counts[voteKey]||0)+1;
      });
    });
    sessions.push([record.time,record.id,meta.sessionId,meta.protocol,meta.protocolHash,duplicate?'duplicate':'valid',
      meta.language||meta.participantMetadata && meta.participantMetadata.language||'',meta.completedAt,active/1000,count,parsed.feedback]);
    if(duplicate) issues.push([record.time,record.id,meta.sessionId,'Duplicate response ID in the same protocol hash; first valid submission counted']);
    else seen[key]=true;
  });
  Object.keys(counts).sort().forEach(function(key) {
    var values=JSON.parse(key),total=totals[JSON.stringify(values.slice(0,5))];
    summary.push(values.concat([counts[key],total,counts[key]/total]));
  });
  return {'答卷 Responses':sessions,'逐題 Answers':answers,'票數 Summary':summary,'問題 Issues':issues};
}

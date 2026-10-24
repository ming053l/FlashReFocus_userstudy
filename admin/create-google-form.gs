/** Run createFlashReFocusForm once in https://script.google.com/home/start.
 * Creates your response Form + spreadsheet. Running again reuses the same Form.
 * No test response is submitted. Copy CONFIG_FOR_CODEX from the execution log.
 */
function createFlashReFocusForm() {
  var props = PropertiesService.getScriptProperties();
  var existingId = props.getProperty('FLASHREFOCUS_FORM_ID');
  var form, items = {};
  if (existingId) {
    form = FormApp.openById(existingId);
    form.getItems().forEach(function(item) {
      var match = /^\[(session|refocus|bokeh|feedback)\]/.exec(item.getTitle());
      if (match) items[match[1]] = item.asParagraphTextItem();
    });
  } else {
    form = FormApp.create('Image Refocusing Study — Responses');
    props.setProperty('FLASHREFOCUS_FORM_ID', form.getId());
    form.setDescription('Your study answers have been prefilled below. Please leave the encoded answer fields unchanged and click Submit to send your response. No name or email is requested. Participation is voluntary.');
    form.setCollectEmail(false);
    form.setLimitOneResponsePerUser(false);
    form.setPublishingSummary(false);
    form.setConfirmationMessage('Thank you! Your response has been recorded. You may close this tab.');
    var titles = {session: '[session] Anonymous response metadata', refocus: '[refocus] Refocusing comparisons', bokeh: '[bokeh] Bokeh rendering comparisons', feedback: '[feedback] Optional comments'};
    Object.keys(titles).forEach(function(key) {
      items[key] = form.addParagraphTextItem().setTitle(titles[key]).setRequired(key !== 'feedback');
      if (key !== 'feedback') items[key].setHelpText('Automatically filled by the study. Please do not edit.');
    });
    var sheet = SpreadsheetApp.create('Image Refocusing Study — Responses');
    form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());
    props.setProperty('FLASHREFOCUS_SHEET_URL', sheet.getUrl());
  }
  ['session','refocus','bokeh','feedback'].forEach(function(key) { if (!items[key]) throw new Error('Missing form item: '+key+'. Restore the original item or use a new Apps Script project.'); });
  if (form.supportsAdvancedResponderPermissions()) form.setPublished(true);
  form.setAcceptingResponses(true);
  var draft = form.createResponse();
  Object.keys(items).forEach(function(key) { draft.withItemResponse(items[key].createResponse('FLASHREFOCUS_'+key)); });
  var prefilled = draft.toPrefilledUrl();
  var entries = {};
  prefilled.split('?')[1].split('&').forEach(function(part) {
    var pair=part.split('=');
    var value=decodeURIComponent((pair[1]||'').replace(/\+/g,' '));
    if (value.indexOf('FLASHREFOCUS_')===0) entries[value.slice('FLASHREFOCUS_'.length)]=decodeURIComponent(pair[0]);
  });
  var config = {type:'google-forms',viewUrl:form.getPublishedUrl(),entries:entries};
  Logger.log('CONFIG_FOR_CODEX\n'+JSON.stringify(config));
  Logger.log('EDIT_FORM: '+form.getEditUrl());
  Logger.log('VIEW_RESPONSES: '+props.getProperty('FLASHREFOCUS_SHEET_URL'));
  Logger.log('Copy CONFIG_FOR_CODEX back to the chat. Then we will connect and test your form before recruitment.');
}

// Google Apps Script web app, bound to the suggestions Sheet.
// Deploy: Deploy > New deployment > Web app, "Execute as: Me",
// "Who has access: Anyone". Set TURNSTILE_SECRET in
// Project Settings > Script Properties.

var HEADERS = ["timestamp", "name", "id", "clipping", "gain", "transparency"];

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    if (!verifyTurnstile(body.token)) return json_({ ok: false, error: "captcha" });
    if (!validAxes_(body)) return json_({ ok: false, error: "invalid" });

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    sheet.appendRow([new Date(), body.name, body.id, body.clip, body.gain, body.transp]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: "server" });
  }
}

function validAxes_(b) {
  return ["clip", "gain", "transp"].every(function (k) {
    var v = b[k];
    return typeof v === "number" && isFinite(v) && v >= 0 && v <= 10;
  });
}

function verifyTurnstile(token) {
  if (!token) return false;
  var secret = PropertiesService.getScriptProperties().getProperty("TURNSTILE_SECRET");
  var res = UrlFetchApp.fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "post",
    payload: { secret: secret, response: token },
    muteHttpExceptions: true,
  });
  return JSON.parse(res.getContentText()).success === true;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

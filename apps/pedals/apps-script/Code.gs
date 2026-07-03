// Google Apps Script web app, bound to the suggestions Sheet.
// Deploy: Deploy > New deployment > Web app, "Execute as: Me",
// "Who has access: Anyone". Set TURNSTILE_SECRET in
// Project Settings > Script Properties.

var HEADERS = ["timestamp", "name", "id", "clipping", "gain", "transparency"];

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var secret = PropertiesService.getScriptProperties().getProperty("TURNSTILE_SECRET");
    if (!secret) return json_({ ok: false, error: "server" });
    if (!verifyTurnstile(body.token, secret)) return json_({ ok: false, error: "captcha" });
    if (!validAxes_(body)) return json_({ ok: false, error: "invalid" });

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    sheet.appendRow([new Date(), safeText_(body.name), safeText_(body.id), body.clip, body.gain, body.transp]);
    return json_({ ok: true });
  } catch (err) {
    console.error("doPost failed", err);
    return json_({ ok: false, error: "server" });
  }
}

// Neutralize spreadsheet formula injection: the endpoint is public, so string
// fields are attacker-controlled. Coerce to string, cap length, and prefix a
// leading formula trigger (= + - @, tab, CR, LF) with an apostrophe so Sheets
// stores the value as text rather than evaluating it.
function safeText_(v) {
  var s = String(v == null ? "" : v).slice(0, 200);
  return /^[=+\-@\t\r\n]/.test(s) ? "'" + s : s;
}

function validAxes_(b) {
  return ["clip", "gain", "transp"].every(function (k) {
    var v = b[k];
    return typeof v === "number" && isFinite(v) && v >= 0 && v <= 10;
  });
}

function verifyTurnstile(token, secret) {
  if (!token) return false;
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

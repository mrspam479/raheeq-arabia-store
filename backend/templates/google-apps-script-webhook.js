/**
 * Raheeq Arabia — Google Sheets Apps Script Webhook
 * ---------------------------------------------------
 * Paste this file's contents into Extensions → Apps Script (replace Code.gs).
 *
 * Setup:
 *  1) Create a Google Sheet.
 *  2) Rename the first tab to "orders".
 *  3) Go to Extensions → Apps Script.
 *  4) Delete existing Code.gs content and paste this entire file.
 *  5) Click Deploy → New deployment.
 *  6) Type: Web app
 *     Execute as: Me
 *     Who has access: Anyone
 *  7) Click Deploy → Copy the Web App URL.
 *  8) Paste that URL into your backend env var: SHEET_WEBHOOK_URL=https://script.google.com/macros/s/xxxx/exec
 *
 * No secret needed — the URL itself is the auth (only you have it).
 *
 * Expected payload (POST application/json):
 *   {
 *     "kind": "order",
 *     "payload": {
 *       "date": "01/06/2026",
 *       "order_id": "RAHEEQ-A1B2C3D4",
 *       "country": "KSA",
 *       "name": "فاطمة أحمد",
 *       "phone": "+966504752330",
 *       "product": "حبّة نضرة/حبّة بريق",
 *       "sku": "RHQ-NDR-001/RHQ-BRQ-001",
 *       "quantity": "2/1",
 *       "totalprice": 478,
 *       "currency": "SAR",
 *       "status": ""
 *     }
 *   }
 */

var SHEET_NAME = 'orders';

var HEADER = [
  'date',
  'order_id',
  'country',
  'name',
  'phone',
  'product',
  'sku',
  'quantity',
  'totalprice',
  'currency',
  'status'
];

function doGet() {
  return respond_({ ok: true, service: 'raheeq-sheet-webhook' });
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents || '{}');
    var kind = body.kind;
    var payload = body.payload || {};

    ensureHeader_();

    if (kind === 'order') {
      appendOrder_(payload);
    } else if (kind === 'upsell') {
      appendUpsell_(payload);
    } else {
      return respond_({ ok: false, error: 'unknown_kind' });
    }

    return respond_({ ok: true });
  } catch (err) {
    return respond_({ ok: false, error: String(err && err.message || err) });
  }
}

function ensureHeader_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  var range = sheet.getRange(1, 1, 1, HEADER.length);
  var current = range.getValues()[0];
  var empty = current.every(function (c) { return c === '' || c === null; });
  if (empty) {
    range.setValues([HEADER]);
    sheet.setFrozenRows(1);
    range.setFontWeight('bold');
  }
}

function appendOrder_(payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  var row = HEADER.map(function (key) {
    if (key === 'status') return '';
    return payload[key] !== undefined ? payload[key] : '';
  });
  sheet.appendRow(row);
}

function appendUpsell_(payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  var lastRow = sheet.getLastRow();
  for (var i = lastRow; i >= 2; i--) {
    var rowOrderId = sheet.getRange(i, 2).getValue();
    if (String(rowOrderId) === String(payload.order_id)) {
      var existingProduct = sheet.getRange(i, 6).getValue();
      var existingSkus = sheet.getRange(i, 7).getValue();
      var existingQty = sheet.getRange(i, 8).getValue();
      var existingTotal = sheet.getRange(i, 9).getValue();

      sheet.getRange(i, 6).setValue(existingProduct + '/' + (payload.product_name || payload.sku));
      sheet.getRange(i, 7).setValue(existingSkus + '/' + payload.sku);
      sheet.getRange(i, 8).setValue(existingQty + '/1');
      sheet.getRange(i, 9).setValue(Number(existingTotal) + Number(payload.price_sar || 99));
      return;
    }
  }
}

function respond_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Raheeq Arabia — Google Sheets Apps Script Webhook
 * ---------------------------------------------------
 * Paste this into Extensions → Apps Script (replace Code.gs).
 *
 * Setup:
 *  1) Sheet must have a tab called "orders" (auto-created if missing).
 *  2) Deploy → New deployment → Web app:
 *       Execute as: Me
 *       Who has access: Anyone
 *     Copy the Web App URL into backend env var SHEET_WEBHOOK_URL.
 *
 * Order IDs are auto-generated: RAHEEQ001, RAHEEQ002, RAHEEQ003, ...
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

function nextOrderId_(sheet) {
  var lastRow = sheet.getLastRow();
  var orderNum = lastRow; // row 1 = header, row 2 = order #1, etc.
  var padded = String(orderNum);
  while (padded.length < 3) padded = '0' + padded;
  return 'RAHEEQ' + padded;
}

function appendOrder_(payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  var orderId = nextOrderId_(sheet);

  var row = HEADER.map(function (key) {
    if (key === 'order_id') return orderId;
    if (key === 'status') return '';
    return payload[key] !== undefined ? payload[key] : '';
  });
  sheet.appendRow(row);
}

function respond_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

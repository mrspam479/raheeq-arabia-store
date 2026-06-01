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
  var orderNum = lastRow;
  var padded = String(orderNum);
  while (padded.length < 3) padded = '0' + padded;
  return 'RAHEEQ' + padded;
}

function normalizePayload_(raw) {
  var p = {};

  // date — accept "date" or "created_at", format to DD/MM/YYYY
  if (raw.date) {
    p.date = raw.date;
  } else if (raw.created_at) {
    var d = new Date(raw.created_at);
    if (!isNaN(d.getTime())) {
      var dd = ('0' + d.getDate()).slice(-2);
      var mm = ('0' + (d.getMonth() + 1)).slice(-2);
      var yyyy = d.getFullYear();
      p.date = dd + '/' + mm + '/' + yyyy;
    } else {
      p.date = raw.created_at;
    }
  } else {
    var now = new Date();
    var dd2 = ('0' + now.getDate()).slice(-2);
    var mm2 = ('0' + (now.getMonth() + 1)).slice(-2);
    p.date = dd2 + '/' + mm2 + '/' + now.getFullYear();
  }

  p.country = raw.country || 'KSA';

  // name — accept "name" or "full_name"
  p.name = raw.name || raw.full_name || '';

  // phone — accept "phone" or "phone_e164"
  p.phone = raw.phone || raw.phone_e164 || '';

  // product — accept "product" or build from "items_summary" or "items_json"
  if (raw.product) {
    p.product = raw.product;
  } else if (raw.items_json) {
    try {
      var items = typeof raw.items_json === 'string' ? JSON.parse(raw.items_json) : raw.items_json;
      var names = [];
      var skus = [];
      var qtys = [];
      for (var i = 0; i < items.length; i++) {
        names.push(items[i].sku || '');
        skus.push(items[i].sku || '');
        qtys.push(String(items[i].qty || 1));
      }
      p.product = names.join('/');
      p.sku = skus.join('/');
      p.quantity = qtys.join('/');
    } catch (ex) {
      p.product = raw.items_summary || '';
    }
  } else {
    p.product = raw.items_summary || '';
  }

  // sku
  if (!p.sku) p.sku = raw.sku || '';

  // quantity
  if (!p.quantity) p.quantity = raw.quantity || '';

  // totalprice — accept "totalprice" or "total_sar"
  p.totalprice = raw.totalprice !== undefined ? raw.totalprice : (raw.total_sar !== undefined ? raw.total_sar : '');

  p.currency = raw.currency || 'SAR';

  p.status = '';

  return p;
}

function appendOrder_(rawPayload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  var orderId = nextOrderId_(sheet);
  var payload = normalizePayload_(rawPayload);

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

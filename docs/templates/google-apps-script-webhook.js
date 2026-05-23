/**
 * Raheeq Arabia — Google Sheets Apps Script Webhook
 * ---------------------------------------------------
 * Paste this file's contents into Extensions → Apps Script (replace Code.gs).
 *
 * Setup:
 *  1) Sheet must have two tabs: "orders" and "upsell_attached".
 *  2) The "orders" tab header (row 1) MUST match orders-sheet-template.csv.
 *  3) Project Settings → Script Properties:
 *       SHEET_WEBHOOK_SECRET = <32-byte random string> (also place in backend .env)
 *  4) Deploy → New deployment → Web app:
 *       Execute as: Me
 *       Who has access: Anyone
 *     Copy the Web App URL into the backend env var SHEET_WEBHOOK_URL.
 *
 * Payload shape (POST application/json):
 *   { "secret": "...", "kind": "order" | "upsell" | "status_update", "payload": { ... } }
 */

const SHEET_NAMES = {
  ORDERS: 'orders',
  UPSELL: 'upsell_attached',
};

const ORDERS_HEADER = [
  'created_at',
  'order_id',
  'status',
  'full_name',
  'phone_e164',
  'whatsapp_link',
  'address_line',
  'city',
  'notes',
  'items_summary',
  'items_json',
  'subtotal_sar',
  'upsell_added_sar',
  'total_sar',
  'currency',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'landing_url',
  'referrer',
  'client_ip',
  'client_user_agent',
  'fbp',
  'fbc',
  'ttp',
  'ttclid',
  'sc_click_id',
  'event_id',
  'idempotency_key',
  'confirmed_at',
  'shipped_at',
  'delivered_at',
];

const UPSELL_HEADER = ['created_at', 'order_id', 'sku', 'price_sar'];

function doGet() {
  return respond_({ ok: true, service: 'raheeq-sheet-webhook' });
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    const expected = PropertiesService.getScriptProperties().getProperty('SHEET_WEBHOOK_SECRET');
    if (!expected || body.secret !== expected) {
      return respond_({ ok: false, error: 'unauthorized' }, 401);
    }

    const kind = body.kind;
    const payload = body.payload || {};

    ensureHeaders_();

    if (kind === 'order') {
      appendOrder_(payload);
    } else if (kind === 'upsell') {
      appendUpsell_(payload);
    } else if (kind === 'status_update') {
      updateStatus_(payload);
    } else {
      return respond_({ ok: false, error: 'unknown_kind' }, 400);
    }

    return respond_({ ok: true });
  } catch (err) {
    return respond_({ ok: false, error: String(err && err.message || err) }, 500);
  }
}

/* -------------- helpers -------------- */

function ensureHeaders_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ensureSheetHeader_(ss, SHEET_NAMES.ORDERS, ORDERS_HEADER);
  ensureSheetHeader_(ss, SHEET_NAMES.UPSELL, UPSELL_HEADER);
}

function ensureSheetHeader_(ss, name, header) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  const range = sheet.getRange(1, 1, 1, header.length);
  const current = range.getValues()[0];
  const empty = current.every(function (c) { return c === '' || c === null; });
  if (empty) {
    range.setValues([header]);
    sheet.setFrozenRows(1);
    range.setFontWeight('bold');
  }
}

function appendOrder_(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.ORDERS);
  const row = ORDERS_HEADER.map(function (key) {
    if (key === 'created_at') return payload.created_at || new Date().toISOString();
    if (key === 'status') return payload.status || 'pending';
    if (key === 'whatsapp_link') return ''; // set after append using formula
    if (key === 'currency') return payload.currency || 'SAR';
    return payload[key] !== undefined ? payload[key] : '';
  });
  sheet.appendRow(row);

  const lastRow = sheet.getLastRow();
  const phoneCol = ORDERS_HEADER.indexOf('phone_e164') + 1;
  const linkCol = ORDERS_HEADER.indexOf('whatsapp_link') + 1;
  // WhatsApp formula uses the phone in column E (phone_e164), strips +
  const formula = '=HYPERLINK("https://wa.me/" & SUBSTITUTE(' +
    sheet.getRange(lastRow, phoneCol).getA1Notation() +
    ',"+",""),"WhatsApp")';
  sheet.getRange(lastRow, linkCol).setFormula(formula);
}

function appendUpsell_(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.UPSELL);
  sheet.appendRow([
    payload.created_at || new Date().toISOString(),
    payload.order_id || '',
    payload.sku || '',
    payload.price_sar != null ? payload.price_sar : 99,
  ]);

  // Also bump the corresponding row in `orders`
  const orders = ss.getSheetByName(SHEET_NAMES.ORDERS);
  const rowIdx = findRowByOrderId_(orders, payload.order_id);
  if (rowIdx > 0) {
    const upsellCol = ORDERS_HEADER.indexOf('upsell_added_sar') + 1;
    const totalCol = ORDERS_HEADER.indexOf('total_sar') + 1;
    const subtotalCol = ORDERS_HEADER.indexOf('subtotal_sar') + 1;
    const subtotal = Number(orders.getRange(rowIdx, subtotalCol).getValue() || 0);
    const price = Number(payload.price_sar || 99);
    orders.getRange(rowIdx, upsellCol).setValue(price);
    orders.getRange(rowIdx, totalCol).setValue(subtotal + price);
  }
}

function updateStatus_(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAMES.ORDERS);
  const rowIdx = findRowByOrderId_(sheet, payload.order_id);
  if (rowIdx <= 0) return;

  const map = {
    status: payload.status,
    address_line: payload.address_line,
    city: payload.city,
    notes: payload.notes,
    confirmed_at: payload.confirmed_at,
    shipped_at: payload.shipped_at,
    delivered_at: payload.delivered_at,
  };

  Object.keys(map).forEach(function (key) {
    const val = map[key];
    if (val === undefined || val === null) return;
    const col = ORDERS_HEADER.indexOf(key) + 1;
    if (col > 0) sheet.getRange(rowIdx, col).setValue(val);
  });
}

function findRowByOrderId_(sheet, orderId) {
  if (!orderId) return -1;
  const colIdx = ORDERS_HEADER.indexOf('order_id') + 1;
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;
  const values = sheet.getRange(2, colIdx, lastRow - 1, 1).getValues();
  for (let i = 0; i < values.length; i++) {
    if (String(values[i][0]) === String(orderId)) return i + 2;
  }
  return -1;
}

function respond_(obj /* , status */) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

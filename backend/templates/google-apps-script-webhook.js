/*
 * Raheeq Arabia — Google Sheets Webhook
 *
 * 1) Extensions → Apps Script → paste this → Save
 * 2) Deploy → New deployment → Web app
 *      Execute as: Me  |  Who has access: Anyone
 * 3) Copy URL → set as SHEET_WEBHOOK_URL in backend env
 */

var SHEET_NAME = 'orders';
var HEADER = ['date','order_id','country','name','phone','product','sku','quantity','totalprice','currency','status'];

var SKU_MAP = {
  'habba-nadra':     'RHQ-NDR-001',
  'habba-bareeq':    'RHQ-BRQ-001',
  'habba-jathr':     'RHQ-JTR-001',
  'bundle-glow-trio':'RHQ-BND-001'
};

function doGet() {
  return respond_({ ok: true });
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents || '{}');
    var payload = body.payload || {};
    ensureHeader_();
    appendOrder_(payload);
    return respond_({ ok: true });
  } catch (err) {
    return respond_({ ok: false, error: String(err.message || err) });
  }
}

function ensureHeader_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  var r = sheet.getRange(1, 1, 1, HEADER.length);
  var cur = r.getValues()[0];
  if (cur.every(function(c){ return c === '' || c === null; })) {
    r.setValues([HEADER]);
    sheet.setFrozenRows(1);
    r.setFontWeight('bold');
  }
}

function nextOrderId_(sheet) {
  var n = sheet.getLastRow(); // row1=header so row2=order#1 → lastRow=1 means 0 orders
  var s = String(n);
  while (s.length < 3) s = '0' + s;
  return 'nama' + s;
}

function formatDate_(raw) {
  if (raw && raw.indexOf('/') !== -1) return raw; // already DD/MM/YYYY
  var d = raw ? new Date(raw) : new Date();
  if (isNaN(d.getTime())) d = new Date();
  return ('0'+d.getDate()).slice(-2) + '/' + ('0'+(d.getMonth()+1)).slice(-2) + '/' + d.getFullYear();
}

function formatPhone_(raw) {
  if (!raw) return '';
  var p = String(raw).replace(/[^0-9]/g, ''); // strip everything except digits
  if (p.startsWith('966')) return p;
  if (p.startsWith('05') || p.startsWith('5')) {
    p = p.replace(/^0+/, '');
    return '966' + p;
  }
  return p;
}

function appendOrder_(raw) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  var orderId = nextOrderId_(sheet);

  // --- Normalize: handle BOTH old and new backend payload keys ---

  var date = formatDate_(raw.date || raw.created_at || '');
  var name = raw.name || raw.full_name || '';
  var phone = formatPhone_(raw.phone || raw.phone_e164 || '');

  var product = '';
  var sku = '';
  var quantity = '';
  var totalprice = '';

  if (raw.product) {
    // New backend format — fields are ready
    product = raw.product;
    sku = raw.sku || '';
    quantity = raw.quantity || '';
    totalprice = raw.totalprice !== undefined ? raw.totalprice : '';
  } else if (raw.items_json) {
    // Old backend format — parse items_json
    try {
      var items = typeof raw.items_json === 'string' ? JSON.parse(raw.items_json) : raw.items_json;
      var prods = [];
      var skus_arr = [];
      var qtys = [];
      for (var i = 0; i < items.length; i++) {
        var slug = items[i].sku || '';
        skus_arr.push(SKU_MAP[slug] || slug);
        prods.push(SKU_MAP[slug] ? slug : slug); // will be replaced below
        qtys.push(String(items[i].qty || 1));
      }
      sku = skus_arr.join('/');
      quantity = qtys.join('/');
      // items_summary has Arabic names: "حبّة نضرة × علبة (1) + حبّة بريق × علبة (1)"
      if (raw.items_summary) {
        var parts = raw.items_summary.split(' + ');
        var arabic = [];
        for (var j = 0; j < parts.length; j++) {
          arabic.push(parts[j].split(' × ')[0].trim());
        }
        product = arabic.join('/');
      } else {
        product = prods.join('/');
      }
    } catch(ex) {
      product = raw.items_summary || '';
    }
    totalprice = raw.total_sar !== undefined ? raw.total_sar : (raw.totalprice !== undefined ? raw.totalprice : '');
  } else if (raw.items_summary) {
    product = raw.items_summary;
    totalprice = raw.total_sar !== undefined ? raw.total_sar : '';
  }

  var row = [
    date,
    orderId,
    'KSA',
    name,
    phone,
    product,
    sku,
    quantity,
    totalprice,
    'SAR',
    ''  // status empty
  ];

  sheet.appendRow(row);
}

function respond_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

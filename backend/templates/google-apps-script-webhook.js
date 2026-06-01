function doGet() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents || '{}');
    var p = body.payload || {};

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('orders');
    if (!sheet) sheet = ss.insertSheet('orders');

    // Ensure header
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['date','order_id','country','name','phone','product','sku','quantity','totalprice','currency','status']);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, 11).setFontWeight('bold');
    }

    // Generate RAHEEQ001, RAHEEQ002, etc.
    var num = sheet.getLastRow();
    var padded = String(num);
    while (padded.length < 3) padded = '0' + padded;
    var orderId = 'RAHEEQ' + padded;

    // Get date
    var date = p.date || '';
    if (!date) {
      var now = new Date();
      date = ('0' + now.getDate()).slice(-2) + '/' + ('0' + (now.getMonth()+1)).slice(-2) + '/' + now.getFullYear();
    }

    sheet.appendRow([
      date,
      orderId,
      p.country || 'KSA',
      p.name || p.full_name || '',
      p.phone || p.phone_e164 || '',
      p.product || '',
      p.sku || '',
      p.quantity || '',
      p.totalprice || p.total_sar || '',
      p.currency || 'SAR',
      ''
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}

const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');

const source=fs.readFileSync(require('node:path').join(__dirname,'../assets/js/pkbon.js'),'utf8');
function evalFilenameHelpers(){
  const start=source.indexOf('function cleanFilenamePart');
  const end=source.indexOf('function officerById',start);
  assert.ok(start>=0&&end>start,'filename helpers not found');
  const ctx={String,RegExp,Math};vm.createContext(ctx);
  vm.runInContext(source.slice(start,end)+';globalThis.buildPrintTitle=buildPrintTitle;',ctx);
  return ctx.buildPrintTitle;
}

test('PKBON print filename is sanitized and bounded without ellipsis',()=>{
  const buildPrintTitle=evalFilenameHelpers();
  const long='Dokumen pengajuan operasional '.repeat(12);
  const title=buildPrintTitle('00123-3/X/2026',long,'SITE UTAMA');
  assert.ok(title.length<=120);
  assert.equal(title.includes('...'),false);
  assert.match(title,/^PKBON 00123 - /);
});

test('PKBON print flow embeds blob attachments into the print document',()=>{
  const marker='img.setAttribute(\'src\',await blobUrlToDataUrl(src));';
  assert.ok(source.includes('async function blobUrlToDataUrl'));
  assert.ok(source.includes(marker));
  assert.ok(source.includes('const printMarkup=await buildPrintMarkup()'));
  assert.ok(source.includes('pw.document.write'));
});

test('PKBON print popup opens before awaited preview work',()=>{
  const printStart=source.indexOf('async function performPrint');
  const syncPos=source.indexOf('await syncPreview()',printStart);
  const openPos=source.indexOf("window.open('','_blank','width=980,height=900')",printStart);
  assert.ok(openPos>=0&&syncPos>openPos);
});

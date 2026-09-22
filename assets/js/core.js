/* Pure data helpers shared by the workspace and its regression tests. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TrackersCore = api;
})(typeof window === 'object' ? window : this, function () {
  'use strict';
  const text = v => String(v ?? '').trim();
  const norm = v => text(v).toLocaleLowerCase('id-ID');
  const stages = ['BOQ', 'PO', 'BAUT', 'BAPWP', 'BAST', 'GR'];
  function date(value) {
    if (value instanceof Date) {
      if (!Number.isFinite(value.getTime())) return '';
      return [value.getFullYear(), String(value.getMonth()+1).padStart(2,'0'), String(value.getDate()).padStart(2,'0')].join('-');
    }
    let s = text(value), m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:T.*)?$/);
    if (!m) { const d = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/); if (d) m = [s,d[3],d[2],d[1]]; }
    if (!m) return '';
    const [y,mo,d] = m.slice(1).map(Number), check = new Date(Date.UTC(y,mo-1,d));
    if (check.getUTCFullYear() !== y || check.getUTCMonth() !== mo-1 || check.getUTCDate() !== d) return '';
    return `${y}-${String(mo).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  }
  function money(value) {
    if (typeof value === 'number') return Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;
    const s = text(value).replace(/^Rp\s*/i,'').replace(/\s/g,'');
    if (!s || /^-/.test(s)) return 0;
    // Indonesian grouped input (1.250.000 / 1.250,50), or an ungrouped decimal.
    const n = s.includes(',') ? Number(s.replace(/\./g,'').replace(',','.')) : /^\d{1,3}(\.\d{3})+$/.test(s) ? Number(s.replace(/\./g,'')) : Number(s);
    return Number.isFinite(n) ? Math.max(0,Math.round(n)) : 0;
  }
  // Live rupiah fields always use dots as thousands separators, even while a group is incomplete.
  // Keep this separate from money(), which also reads numeric/decimal saved data.
  function moneyInput(field) {
    const raw=String(field.value||''),caret=field.selectionStart;
    const before=caret==null?null:(raw.slice(0,caret).match(/\d/g)||[]).length;
    const amount=money(raw.replace(/\./g,''));
    field.value=amount?amount.toLocaleString('id-ID'):'';
    if(before!==null&&typeof field.setSelectionRange==='function'){
      let position=0,seen=0;
      while(position<field.value.length&&seen<before){if(/\d/.test(field.value[position]))seen++;position++;}
      field.setSelectionRange(position,position);
    }
    return amount;
  }
  function csvParse(raw) {
    const src = String(raw).replace(/^\uFEFF/,''), first = src.split(/\r?\n/)[0];
    const sep = (first.match(/;/g)||[]).length > (first.match(/,/g)||[]).length ? ';' : ',';
    let row=[],cell='',quoted=false; const rows=[];
    for(let i=0;i<src.length;i++) {
      const c=src[i];
      if(c==='"') { if(quoted&&src[i+1]==='"'){cell+='"';i++;} else quoted=!quoted; }
      else if(c===sep&&!quoted){row.push(cell);cell='';}
      else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&src[i+1]==='\n')i++;row.push(cell);if(row.some(text))rows.push(row);row=[];cell='';}
      else cell+=c;
    }
    if(quoted)throw new Error('Tanda kutip CSV belum ditutup.');
    row.push(cell);if(row.some(text))rows.push(row);
    if(!rows.length)return [];
    const headers=rows.shift().map(text);
    if(new Set(headers).size!==headers.length)throw new Error('Judul kolom CSV harus unik.');
    return rows.map(r=>Object.fromEntries(headers.map((h,i)=>[h,r[i]??''])));
  }
  function csvWrite(rows) {
    return '\uFEFF'+rows.map(row=>row.map(v=>{
      let s=String(v??'');
      if(typeof v!=='number'&&/^[\t\r =+@-]/.test(s))s="'"+s;
      return '"'+s.replace(/"/g,'""')+'"';
    }).join(',')).join('\r\n');
  }
  function bastProgress(r) {
    const list=[
      {name:'BOQ',done:!!text(r.boqLink),state:text(r.boqLink)?'Done':'Belum lengkap'},
      {name:'PO',done:!!(text(r.poLink)&&text(r.poNumber)&&date(r.poDate)),state:'Belum lengkap'},
      ...['BAUT','BAPWP','BAST'].map(name=>{const k=name.toLowerCase(),done=r[k+'Process']==='Done'&&!!text(r[k+'Input']);return {name,done,state:r[k+'Process']==='Done'&&!done?'Belum lengkap':r[k+'Process']||'Need Approval PM'};})
    ];
    if(list[1].done)list[1].state='Done';
    const done=list.filter(x=>x.done).length;
    return {stages:list,done,pct:Math.round(done/list.length*100),archived:done===list.length};
  }
  function toggleBast(rows,index) {
    if(index<0||index>=rows.length)return rows;
    if(rows[index].done)rows.slice(index).forEach(x=>x.done=false);
    else if(index===0||rows.slice(0,index).every(x=>x.done))rows[index].done=true;
    return rows;
  }
  function belongs(doc,site,allSites=[]) {
    if(!site)return false;
    if(doc.workspaceSiteId)return doc.workspaceSiteId===site.id;
    if(norm(doc.projectId)&&norm(site.projectId)){
      const matches=s=>norm(doc.projectId)===norm(s.projectId)&&(!norm(doc.site)||norm(doc.site)===norm(s.siteName));
      return matches(site)&&(!allSites.length||allSites.filter(matches).length===1);
    }
    return !!norm(doc.site)&&norm(doc.site)===norm(site.siteName)&&allSites.filter(s=>norm(s.siteName)===norm(site.siteName)).length===1;
  }
  function total(items) { return (Array.isArray(items)?items:[]).reduce((sum,x)=>sum+Math.max(0,Number(x.vol)||0)*money(x.harga),0); }
  function validateSnapshot(value) {
    const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
    const records=(v,label)=>{if(v!==undefined&&(!Array.isArray(v)||v.some(x=>!object(x))))throw new Error('Data '+label+' tidak valid.');};
    const fields=(v,label)=>{for(const [k,x]of Object.entries(v)){if(x!==null&&typeof x==='object')throw new Error('Nilai '+label+'.'+k+' tidak valid.');}};
    if(!object(value)||!object(value.trackly)||!Array.isArray(value.trackly.sites))throw new Error('Format backup workspace tidak valid.');
    const s=value.trackly;
    for(const key of ['sites','clients','tenants','rules','activities','pinned','bastProcesses','notes'])if(s[key]!==undefined&&!Array.isArray(s[key]))throw new Error('Data '+key+' tidak valid.');
    for(const key of ['clients','rules','activities','bastProcesses','notes'])records(s[key],key);
    for(const key of ['tenants','pinned'])if(s[key]?.some(x=>typeof x!=='string'))throw new Error('Data '+key+' tidak valid.');
    const unique=new Set();
    for(const site of s.sites){
      if(!object(site)||typeof site.id!=='string'||!text(site.id)||typeof site.siteName!=='string'||!text(site.siteName))throw new Error('Data site tidak lengkap.');
      if(unique.has(site.id))throw new Error('ID site duplikat.');unique.add(site.id);
      for(const key of ['tasks','oneflux','bast']){records(site[key],key);site[key]?.forEach(x=>fields(x,key));}
      if(site.pln!==undefined&&!object(site.pln))throw new Error('Data PLN tidak valid.');
      if(site.finance!==undefined){if(!object(site.finance))throw new Error('Data Finance tidak valid.');records(site.finance.rows,'finance');for(const row of site.finance.rows||[])records(row.payments,'payments');}
    }
    if(value.pkbon!==undefined&&!object(value.pkbon))throw new Error('Data PKBON tidak valid.');
    for(const [key,val] of Object.entries(value.pkbon||{})){
      if(!['pkbon_history','pkbon_settings','pkbon_sites','pkbon_banks','pkbon_templates','pkbon_officers'].includes(key))throw new Error('Kunci backup tidak dikenal: '+key);
      if(key==='pkbon_settings'){if(!object(val)||val.approvalIds!==undefined&&!object(val.approvalIds))throw new Error('Pengaturan PKBON tidak valid.');}
      else if(key==='pkbon_sites'){if(!Array.isArray(val)||val.some(x=>typeof x!=='string'&&!object(x)))throw new Error('Data site PKBON tidak valid.');}
      else records(val,key);
      if(key==='pkbon_history')for(const doc of val){records(doc.items,'rincian PKBON');if(doc.documentOfficers!==undefined&&doc.documentOfficers!==null&&(!Array.isArray(doc.documentOfficers)||doc.documentOfficers.some(x=>x!==null&&!object(x))))throw new Error('Pejabat PKBON tidak valid.');}
    }
    return value;
  }
  function writeBatch(storage,entries) {
    const old=new Map(entries.map(([k])=>[k,storage.getItem(k)])),written=[];
    try{for(const [k,v] of entries){if(v===null)storage.removeItem(k);else storage.setItem(k,v);written.push(k);}}
    catch(error){
      // Free changed entries first so restoration cannot exceed the original quota.
      for(const k of written){try{storage.removeItem(k);}catch{}}
      for(const k of written){try{if(old.get(k)!==null)storage.setItem(k,old.get(k));}catch{}}
      throw error;
    }
  }
  return {date,money,moneyInput,csvParse,csvWrite,bastProgress,toggleBast,belongs,total,validateSnapshot,writeBatch,stages};
});

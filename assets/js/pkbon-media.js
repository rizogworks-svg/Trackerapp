/* PKBON media store: keeps binary attachments out of localStorage. */
(function(){
  'use strict';
  const DB_NAME='trackers-pkbon-media-v1';
  const DB_VERSION=1;
  const STORE='attachments';
  let dbPromise=null;
  const reqToPromise=req=>new Promise((resolve,reject)=>{req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||new Error('IndexedDB error'))});
  function open(){
    if(!('indexedDB' in window))return Promise.reject(new Error('IndexedDB tidak tersedia di browser ini.'));
    if(dbPromise)return dbPromise;
    dbPromise=new Promise((resolve,reject)=>{
      const req=indexedDB.open(DB_NAME,DB_VERSION);
      req.onupgradeneeded=()=>{
        const db=req.result;
        if(!db.objectStoreNames.contains(STORE)){
          const store=db.createObjectStore(STORE,{keyPath:'id'});
          store.createIndex('ownerId','ownerId',{unique:false});
        }
      };
      req.onsuccess=()=>resolve(req.result);
      req.onerror=()=>{dbPromise=null;reject(req.error||new Error('Gagal membuka IndexedDB PKBON.'))};
    });
    return dbPromise;
  }
  async function put(record){
    const db=await open();
    return reqToPromise(db.transaction(STORE,'readwrite').objectStore(STORE).put(record));
  }
  async function get(id){
    if(!id)return null;
    const db=await open();
    return reqToPromise(db.transaction(STORE,'readonly').objectStore(STORE).get(id));
  }
  async function remove(id){
    if(!id)return;
    const db=await open();
    await reqToPromise(db.transaction(STORE,'readwrite').objectStore(STORE).delete(id));
  }
  async function clear(){
    const db=await open();
    await reqToPromise(db.transaction(STORE,'readwrite').objectStore(STORE).clear());
  }
  async function all(){
    const db=await open();
    return reqToPromise(db.transaction(STORE,'readonly').objectStore(STORE).getAll());
  }
  async function byOwner(ownerId){
    if(!ownerId)return [];
    const db=await open();
    return reqToPromise(db.transaction(STORE,'readonly').objectStore(STORE).index('ownerId').getAll(ownerId));
  }
  function dataUrlToBlob(value){
    if(typeof value!=='string'||!/^data:/i.test(value))return null;
    const comma=value.indexOf(',');
    if(comma<0)return null;
    const head=value.slice(0,comma),payload=value.slice(comma+1);
    const mime=(head.match(/^data:([^;,]+)/i)||[])[1]||'application/octet-stream';
    if(/;base64/i.test(head)){
      const binary=atob(payload.replace(/\s+/g,''));
      const bytes=new Uint8Array(binary.length);
      for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
      return new Blob([bytes],{type:mime});
    }
    return new Blob([decodeURIComponent(payload)],{type:mime});
  }
  function blobToDataUrl(blob){
    return new Promise((resolve,reject)=>{
      const r=new FileReader();
      r.onload=()=>resolve(String(r.result||''));
      r.onerror=()=>reject(r.error||new Error('Gagal membaca lampiran.'));
      r.readAsDataURL(blob);
    });
  }
  window.PKBONMediaStore={DB_NAME,STORE,open,put,get,remove,clear,all,byOwner,dataUrlToBlob,blobToDataUrl};
})();

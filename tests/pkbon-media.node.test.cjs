const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('fs');const path=require('path');const vm=require('vm');
class FakeRequest{constructor(exec){this.result=undefined;this.error=null;this.onsuccess=null;this.onerror=null;setTimeout(()=>{try{this.result=exec();this.onsuccess?.({target:this})}catch(e){this.error=e;this.onerror?.({target:this})}},0)}}
function makeFakeIndexedDB(){
  const stores=new Map();
  function makeDB(data){
    const api={
      objectStoreNames:{contains:()=>true},
      transaction(){
        return {objectStore(){
          return {
            put(v){return new FakeRequest(()=>{data.set(v.id,v);return v})},
            get(id){return new FakeRequest(()=>data.get(id))},
            delete(id){return new FakeRequest(()=>data.delete(id))},
            clear(){return new FakeRequest(()=>data.clear())},
            getAll(){return new FakeRequest(()=>Array.from(data.values()))},
            index(){return {getAll(ownerId){return new FakeRequest(()=>Array.from(data.values()).filter(x=>x.ownerId===ownerId))}}}
          }
        }}
      }
    };
    return api;
  }
  return {open(name){return new FakeRequest(()=>{if(!stores.has(name))stores.set(name,new Map());return makeDB(stores.get(name))})}};
}
function makeContext(){
  const indexedDB=makeFakeIndexedDB();
  class FileReaderFake{readAsDataURL(blob){blob.arrayBuffer().then(buf=>{this.result=`data:${blob.type||'application/octet-stream'};base64,${Buffer.from(buf).toString('base64')}`;this.onload?.()}).catch(e=>{this.error=e;this.onerror?.()})}}
  const context={window:{},indexedDB,Blob,atob:global.atob,FileReader:FileReaderFake,URL};
  context.window.indexedDB=indexedDB;context.window.Blob=Blob;context.window.atob=global.atob;context.window.FileReader=FileReaderFake;
  vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(__dirname,'../assets/js/pkbon-media.js'),'utf8'),context);return context.window.PKBONMediaStore;
}
test('PKBON IndexedDB media store can put/get/remove and round-trip a blob',async()=>{
  const store=makeContext();await store.open();
  const blob=new Blob(['hello pkbon'],{type:'image/jpeg'});
  await store.put({id:'a1',ownerId:'doc1',role:'pengajuan',name:'x.jpg',mime:blob.type,size:blob.size,createdAt:'now',blob});
  const got=await store.get('a1');assert.equal(got.blob.size,blob.size);assert.equal((await store.byOwner('doc1')).length,1);
  const dataUrl=await store.blobToDataUrl(got.blob);const imported=store.dataUrlToBlob(dataUrl);assert.equal(imported.size,blob.size);
  await store.remove('a1');assert.equal(await store.get('a1'),undefined);
});

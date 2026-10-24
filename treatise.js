/* Continuous Onyxia codices: semantic sections, contents navigation and faithful manuscript tables. */
(() => {
'use strict';
const $=id=>document.getElementById(id), type=document.body.dataset.treatise;
const ONYXIA_ARTWORK_VERSION='20261024-refresh';
// Re-request manuscript illustrations under a fresh URL after earlier cached 404 responses.
document.querySelectorAll('img[src*="assets/lore/"]').forEach(img=>{const src=img.getAttribute('src');if(src&&!src.includes('onyxia-artwork=')){img.src=src+(src.includes('?')?'&':'?')+'onyxia-artwork='+ONYXIA_ARTWORK_VERSION;}});
const menu=$('mobileMenu'), sidebar=$('sidebar');
if(menu && sidebar) {menu.addEventListener('click',()=>{const open=sidebar.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});sidebar.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>sidebar.classList.remove('open')));}
if(!type) return;
const el=(tag,cls,txt)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(txt!==undefined)node.textContent=txt;return node;};
const side=$('treatiseToc'),body=$('treatiseBody');
const createTable=t=>{
const outer=el('div','treatise-table-wrap'),table=el('table','treatise-table'),thead=el('thead'),tr=el('tr');
t.headers.forEach(h=>tr.appendChild(el('th',null,h)));thead.appendChild(tr);table.appendChild(thead);
const tbody=el('tbody');for(const row of t.rows){const r=el('tr');row.forEach(c=>r.appendChild(el('td',null,String(c))));tbody.appendChild(r);}table.appendChild(tbody);outer.appendChild(table);return outer;};
const renderBlock=(parent,b)=>{
if(!b || !b.text && !b.label) return;
if(b.type==='subheading'){parent.appendChild(el('h3','treatise-subhead',b.text));return;}
if(b.type==='point'||b.type==='field'){
 const p=el('div','treatise-point');p.dataset.level=b.level||1;
 if(b.label)p.appendChild(el('strong',null,b.label+(b.text?': ':'')));
 if(b.text)p.appendChild(document.createTextNode(b.text));parent.appendChild(p);return;
}
parent.appendChild(el('p',null,b.text||''));};
const formatEco=e=>({
id:e.id,title:e.title,blocks:e.blocks.map(b=>b.type==='field'&&b.label===e.title?{type:'paragraph',text:b.text}:b.type==='field'?{type:'point',label:b.label,text:b.text,level:1}:b.type==='subheading'?{type:'subheading',text:b.text}:{type:'paragraph',text:b.text||''}),
tables:e.table?[{title:e.title+' — Reference Prices',headers:e.table.headers,rows:e.table.rows}]:[]
});
const url=type==='economics'?'lore-pages-data.json':'treatises-'+type+'.json';
fetch(url).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json();}).then(source=>{
const treatise=type==='economics'?{sections:source.economics.entries.map(formatEco)}:source;
for(const sec of treatise.sections){
const id=sec.id;
const anchor=el('a',null,sec.title);anchor.href='#'+id;side.appendChild(anchor);
const part=el('section','treatise-chapter');part.id=id;
part.appendChild(el('h2',null,sec.title));
for(const block of sec.blocks||[])renderBlock(part,block);
for(const tbl of sec.tables||(sec.table?[sec.table]:[])){
part.appendChild(el('h3','treatise-table-title',tbl.title||'Reference Table'));
part.appendChild(createTable(tbl));
if(type==='werewolves'&&tbl.rows?.some(r=>r.some(v=>/^(17–10|15–10)$/.test(String(v))))){
part.appendChild(el('p','treatise-note','Editorial note: one roll range in this table is reproduced exactly as supplied in the original manuscript and requires confirmation before play.'));
}}
body.appendChild(part);
}
$('treatiseStatus').textContent=treatise.sections.length+' sections · Continuous reading';
}).catch(err=>{console.error('Onyxia treatise:',err);$('treatiseStatus').textContent='The manuscript is unavailable';body.appendChild(el('p','treatise-loading','The treatise could not be loaded. Please refresh the page.'));});
})();
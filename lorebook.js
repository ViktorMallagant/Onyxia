/* Onyxia encyclopaedia: source-first renderer; no external dependencies. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const chapter = document.body.dataset.loreSection;
  if (!chapter) return;
  const cards = $('loreCards'), input = $('loreSearch'), filter = $('loreFilter');
  const atlasIDs = {
    'astazulum-empire':'astazulum','yuthia-kingdom':'yuthia',
    'avout-kingdom':'avout','republic-of-merania':'merania',
    'guirnaldas-kingdom':'guirnaldas','qaenyth-kingdom':'qaenyth',
    'obedotish-dynasty':'obedotish','shido-empire':'shido'
  };
  const modal = $('loreLightbox');
  const elem = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  };
  const openPicture = (src, label) => {
    const img = modal.querySelector('img');
    img.src = src; img.alt = label; modal.querySelector('p').textContent = label;
    if (typeof modal.showModal === 'function') modal.showModal();
    else window.open(src, '_blank', 'noopener,noreferrer');
  };
  $('closeLightbox').addEventListener('click', () => modal.close());
  modal.addEventListener('click', e => { if (e.target === modal) modal.close(); });
  const menu = $('mobileMenu'), side = $('sidebar');
  menu.addEventListener('click', () => { const v = side.classList.toggle('open'); menu.setAttribute('aria-expanded', String(v)); });
  document.querySelectorAll('.sidebar a').forEach(a => a.addEventListener('click', () => side.classList.remove('open')));
  const asText = b => [b.label, b.text].filter(Boolean).join(': ');
  const summarise = item => {
    const a = item.blocks.find(x => x.label && ['Description','Lore','Definition','Characteristic Modifiers'].includes(x.label));
    const b = a || item.blocks.find(x => x.type === 'paragraph');
    const str = (b?.text || '').trim();
    return str.length > 225 ? str.slice(0, 223).replace(/\s+\S*$/, '') + '…' : str;
  };
  const special = b => ['Lore', 'Description', 'Characteristic Modifiers', 'Definition', 'Cultural Notes', 'Note', 'Funding', 'Membership', 'Additional Information'].includes(b.label);
  const pictureButton = (src, label, cls) => {
    const btn = elem('button', cls);
    btn.type = 'button'; btn.setAttribute('aria-label', 'Enlarge illustration of ' + label);
    const img = elem('img'); img.src = src; img.alt = label;
    img.loading = 'lazy'; img.decoding = 'async'; btn.appendChild(img);
    btn.addEventListener('click', () => openPicture(src, label));
    return btn;
  };
  const contentBlock = b => {
    if (b.type === 'image') return pictureButton(b.src, 'Illustration from the manuscript', 'lore-inline-picture');
    if (b.type === 'subheading') return elem('h4', 'lore-subheading', b.text);
    if (b.type === 'field' && special(b)) {
      const wrap = elem('div', 'lore-prose-block');
      const h = elem('h4', 'lore-prose-label', b.label); wrap.append(h, elem('p', null, b.text)); return wrap;
    }
    if (b.type === 'field') {
      const line = elem('p', 'lore-information-line');
      line.append(elem('strong', null, b.label + ': '), document.createTextNode(b.text)); return line;
    }
    return elem('p', 'lore-paragraph', b.text);
  };
  const renderTable = t => {
    const wrap = elem('div','lore-table-scroll'); const table=elem('table','lore-price-table');
    const thead=elem('thead'), r=elem('tr');
    t.headers.forEach(h => r.appendChild(elem('th',null,h)));
    thead.appendChild(r); table.appendChild(thead);
    const tbody=elem('tbody');
    t.rows.forEach(row => { const tr=elem('tr'); row.forEach(c=>tr.appendChild(elem('td',null,c))); tbody.appendChild(tr); });
    table.appendChild(tbody); wrap.appendChild(table); return wrap;
  };
  const createCard = (item, idx) => {
    const article=elem('article','lore-entry'); article.id=item.id;
    const images=item.images || [];
    const media=elem('div', 'lore-entry-media');
    if (images.length) media.appendChild(pictureButton(images[0], item.title, 'lore-cover-button'));
    else { media.classList.add('lore-entry-no-image'); media.appendChild(elem('span',null,'✧')); }
    const body=elem('div','lore-entry-body');
    const kicker=elem('span','lore-entry-kicker', `${String(idx+1).padStart(2,'0')} · ${chapter==='realms' ? (item.kind==='location'?'Enigmatic places':'Realm & kingdom') : chapter==='species' ? 'Sentient species' : chapter==='bestiary' ? 'Creature & habitat' : chapter==='magic' ? 'Onyx affinity' : chapter==='religions' ? 'Faith & tradition' : chapter==='organisations' ? 'Order & association' : 'Daktari & commerce'}`);
    const title=elem('h2','lore-entry-title',item.title);
    const summary=elem('p','lore-entry-summary',summarise(item) || 'Explore the recorded knowledge of Onyxia.');
    const chips=elem('div','lore-chips');
    item.blocks.filter(b=>b.type==='field' && !special(b)).slice(0,3).forEach(b=>{const badge=elem('span','lore-chip');badge.append(elem('b',null,b.label+': '),document.createTextNode(b.text));chips.appendChild(badge);});
    const toggle=elem('button','lore-entry-toggle','Read the complete entry ↓'); toggle.type='button';toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-controls',item.id+'-details');
    const details=elem('div','lore-entry-details');details.id=item.id+'-details';details.hidden=true;
    if(chapter==='realms' && atlasIDs[item.id]) {
      const mapLink=elem('a','lore-map-link','⌖ View this realm on the atlas');
      mapLink.href='index.html?realm='+encodeURIComponent(atlasIDs[item.id])+'#atlas';
      details.appendChild(mapLink);
    }
    const text=elem('div','lore-entry-text');item.blocks.forEach(b=>text.appendChild(contentBlock(b)));
    details.appendChild(text);
    if(item.table)details.appendChild(renderTable(item.table));
    if(images.length>1){const gallery=elem('div','lore-gallery');images.forEach((src,i)=>gallery.appendChild(pictureButton(src,`${item.title} · illustration ${i+1}`,'lore-gallery-photo')));details.appendChild(gallery);}
    const share=elem('a','lore-permalink','Link to this entry ↗');share.href='#'+item.id;details.appendChild(share);
    const open = yes => {details.hidden=!yes;article.classList.toggle('expanded',yes);toggle.setAttribute('aria-expanded',String(yes));toggle.textContent=yes?'Close entry ↑':'Read the complete entry ↓';};
    toggle.addEventListener('click',()=>open(details.hidden));
    body.append(kicker,title,summary,chips,toggle);article.append(media,body,details);
    return {article,open};
  };
  const parseSimpleCategory = x => {
    if (!x) return '';
    const gate = x.match(/Level Gated\s*-\s*(\d+)/i);
    return gate ? `Level ${gate[1]} gated` : 'No level gate';
  };
  fetch('lore-pages-data.json').then(r=> { if(!r.ok)throw Error('Archive unavailable (HTTP '+r.status+')');return r.json();}).then(all=>{
    const data=all[chapter];if(!data)throw Error('Unknown chapter '+chapter);
    for(const b of data.intro || []){
      if(b.type==='image')continue;
      const p=elem('p'); p.textContent=asText(b);$('loreIntro').appendChild(p);
    }
    const entries=data.entries;
    let options=[];
    if(chapter==='species') options=[...new Set(entries.map(e=>parseSimpleCategory(e.filters?.playability)).filter(Boolean))];
    else if(chapter==='bestiary')options=[...new Set(entries.map(e=>e.filters?.category).filter(Boolean))];
    else if(chapter==='magic')options=[...new Set(entries.map(e=>e.filters?.realm).filter(Boolean))];
    else if(chapter==='organisations')options=[...new Set(entries.map(e=>e.filters?.category).filter(Boolean))];
    else if(chapter==='realms')options=['Realm','Enigmatic places'];
    if(options.length>1){options.sort((a,b)=>a.localeCompare(b,'en-GB')); options.forEach(v=>{const o=elem('option',null,v);o.value=v;filter.appendChild(o);});}
    else document.querySelector('.lore-filter-row').hidden=true;
    const instances=entries.map((item,i)=>({item,...createCard(item,i)}));
    instances.forEach(a=>cards.appendChild(a.article));
    const update=()=>{
      const phrase=input.value.toLocaleLowerCase('en-GB').trim(); const selected=filter.value;let matches=0;
      instances.forEach(({item,article})=>{
        let category='';
        if(chapter==='species')category=parseSimpleCategory(item.filters?.playability);
        if(chapter==='bestiary' || chapter==='organisations')category=item.filters?.category || '';
        if(chapter==='magic')category=item.filters?.realm || '';
        if(chapter==='realms')category=item.kind==='location'?'Enigmatic places':'Realm';
        const text=[item.title,...item.blocks.map(asText)].join(' ').toLocaleLowerCase('en-GB');
        const visible=(selected==='all'||category===selected)&&(!phrase||text.includes(phrase));
        article.hidden=!visible;if(visible)matches++;
      });
      $('loreCount').textContent=`${matches} of ${entries.length} ${entries.length===1?'entry':'entries'}`;
      $('loreEmpty').hidden=matches!==0;
    };
    input.addEventListener('input',update);filter.addEventListener('change',update);
    $('loreClear').addEventListener('click',()=>{input.value='';filter.value='all';update();input.focus();});
    update();
    function revealHash(){const id=decodeURIComponent(location.hash.slice(1)); if(!id)return; const item=instances.find(x=>x.item.id===id); if(item){input.value='';filter.value='all';update();item.open(true);item.article.scrollIntoView({block:'start'});}}
    window.addEventListener('hashchange',revealHash);revealHash();
  }).catch(e=>{console.error(e); $('loreCount').textContent='The archive could not be opened.';const p=elem('p','lore-empty','The chapter data failed to load. Please refresh or inspect the project files.');cards.appendChild(p);});
})();

(() => {
  'use strict';
  const lore = window.ONYXIA_LORE;
  if (!lore) { console.error('Onyxia lore-data.js failed to load.'); return; }
  const $ = (id) => document.getElementById(id);
  const events = lore.events.slice().sort((a,b) => a.year - b.year || a.sort_index - b.sort_index);
  const realms = [
    {id:'astazulum',name:'Astazulum Empire',x:510,y:119,description:'Northern realm of Onyxia, set among towering mountains and the lands surrounding the Yuthia Kingdom.'},
    {id:'yuthia',name:'Yuthia Kingdom',x:508,y:320,description:'The chronicles place Millbrook in Yuthia, one side of the fifty-year Channel War against Le Blanc-Mesnil in Avout.'},
    {id:'avout',name:'Avout Kingdom',x:204,y:430,description:'Home of Le Blanc-Mesnil. Its long Channel War with Yuthia began in Year 1250 of the Sun.'},
    {id:'merania',name:'Republic of Merania',x:396,y:631,description:'Became a republic in Year 1200 following a century of civil strife between northern and southern cultures.'},
    {id:'guirnaldas',name:'Guirnaldas Kingdom',x:1223,y:166,description:'A kingdom with contested lands along the border with Qaenyth, including the battlefield of Alba and the salt-rich shores.'},
    {id:'qaenyth',name:'Qaenyth Kingdom',x:1321,y:352,description:'Victorious at the Battle of the Salty Shores. Its lands remain disputed with Guirnaldas following the Battle of the Shari.'},
    {id:'obedotish',name:'Obedotish Dynasty',x:977,y:659,description:'The dynasty resisted the Shido Empire in the Battle of the Gulf in Year 1000, and later contested its outpost in Lamlam.'},
    {id:'shido',name:'Shido Empire',x:1306,y:695,description:'First to establish a program pairing bonded sorceresses with specially trained knights to close shadow portals.'}
  ];
  const categories = [
    ['all','All events'],['origin','Origins'],['war','Conflict'],['magic','Magic'],['crisis','Calamity'],['politics','Politics'],['peace','Renewal'],['present','Present']
  ];
  const categoryName = Object.fromEntries(categories);
  const state = {category:'all',region:'all',search:'',highlightYear:1400,selectedRealm:null};

  function renderProse(target, paragraphs) {
    const parent=$(target);
    paragraphs.forEach(s => {const p=document.createElement('p');p.textContent=s;parent.appendChild(p);});
  }
  renderProse('genesisText',lore.genesis);
  renderProse('plotText',lore.plot);

  // ATLAS — all transforms are in native 1735×911 source-image coordinates.
  const viewport = $('atlasViewport');
  const stage = $('atlasStage');
  const mapImage = $('worldMap');
  const WIDTH = 1735, HEIGHT = 911;
  let scale = 1, fitScale = 1, tx=0,ty=0, dragging=false, dragMoved=false;
  const pointers=new Map();
  function clampView() {
    const cw=viewport.clientWidth,ch=viewport.clientHeight;
    const sw=WIDTH*scale, sh=HEIGHT*scale;
    const overscroll=35;
    tx=sw < cw ? (cw-sw)/2 : Math.min(overscroll, Math.max(cw-sw-overscroll,tx));
    ty=sh < ch ? (ch-sh)/2 : Math.min(overscroll, Math.max(ch-sh-overscroll,ty));
  }
  function paintMap(){
    stage.style.transform=`translate(${tx}px, ${ty}px) scale(${scale})`;
    stage.style.setProperty('--pin-scale',String(1/scale));
    $('mapScale').textContent=Math.round(scale/fitScale*100)+'%';
  }
  function fitMap(){
    fitScale=Math.min(viewport.clientWidth/WIDTH,viewport.clientHeight/HEIGHT);
    scale=fitScale;
    tx=(viewport.clientWidth-WIDTH*scale)/2;
    ty=(viewport.clientHeight-HEIGHT*scale)/2;
    paintMap();
  }
  function zoomAt(nextScale,screenX,screenY){
    nextScale=Math.min(fitScale*6,Math.max(fitScale,nextScale));
    const x=(screenX-tx)/scale, y=(screenY-ty)/scale;
    scale=nextScale;tx=screenX-x*scale;ty=screenY-y*scale;
    clampView();paintMap();
  }
  function zoomCenter(factor){zoomAt(scale*factor,viewport.clientWidth/2,viewport.clientHeight/2);}
  function clearSelection(){
    document.querySelectorAll('.realm-pin,.realm-directory button').forEach(b=>b.classList.remove('selected','active'));
  }
  function selectRealm(realm, focus=true){
    state.selectedRealm=realm.id;
    clearSelection();
    document.querySelectorAll(`[data-realm="${realm.id}"]`).forEach(b=>b.classList.add(b.classList.contains('realm-pin')?'selected':'active'));
    $('realmName').textContent=realm.name;
    $('realmDescription').textContent=realm.description;
    const related=events.filter(e=>e.regions.includes(realm.name));
    $('realmEventCount').textContent=related.length ? `${related.length} related ${related.length===1?'entry':'entries'}` : 'Further histories to come';
    $('realmCard').hidden=false;
    $('mapStatus').textContent=realm.name+' · Selected';
    if(focus){
      scale=Math.max(scale,fitScale*1.55);
      tx=viewport.clientWidth/2-realm.x*scale;
      ty=viewport.clientHeight/2-realm.y*scale;
      clampView();paintMap();
    }
  }
  const layer=$('realmLayer'),directory=$('realmDirectory');
  realms.forEach(realm=>{
    const pin=document.createElement('button');pin.type='button';pin.className='realm-pin';pin.dataset.realm=realm.id;
    pin.style.left=realm.x+'px';pin.style.top=realm.y+'px';pin.title=realm.name;pin.setAttribute('aria-label','Explore '+realm.name);
    pin.addEventListener('click',(e)=>{e.stopPropagation();if(!dragMoved)selectRealm(realm);});layer.appendChild(pin);
    const btn=document.createElement('button');btn.type='button';btn.dataset.realm=realm.id;btn.textContent=realm.name;
    btn.addEventListener('click',()=>{selectRealm(realm);viewport.scrollIntoView({behavior:'smooth',block:'center'});});directory.appendChild(btn);
  });
  $('closeRealm').addEventListener('click',()=>{state.selectedRealm=null;$('realmCard').hidden=true;$('mapStatus').textContent='Select a realm to discover its history.';clearSelection();});
  $('realmHistory').addEventListener('click',()=>{
    const realm=realms.find(r=>r.id===state.selectedRealm);if(!realm)return;
    state.region=realm.name;$('regionFilter').value=realm.name;state.category='all';state.search='';$('timelineSearch').value='';renderFilters();renderTimeline();
    $('timeline').scrollIntoView({behavior:'smooth'});
  });
  $('markerToggle').addEventListener('change',(e)=>{layer.hidden=!e.target.checked;});
  $('zoomIn').addEventListener('click',()=>zoomCenter(1.4));
  $('zoomOut').addEventListener('click',()=>zoomCenter(1/1.4));
  $('resetMap').addEventListener('click',fitMap);
  viewport.addEventListener('wheel',(e)=>{e.preventDefault();const rect=viewport.getBoundingClientRect();zoomAt(scale*(e.deltaY<0?1.17:1/1.17),e.clientX-rect.left,e.clientY-rect.top);},{passive:false});
  viewport.addEventListener('dblclick',(e)=>{e.preventDefault();const r=viewport.getBoundingClientRect();zoomAt(scale*1.6,e.clientX-r.left,e.clientY-r.top);});
  viewport.addEventListener('keydown',(e)=>{
    if(e.target!==viewport)return;
    if(e.key==='+'||e.key==='='){zoomCenter(1.3);e.preventDefault();}
    else if(e.key==='-'){zoomCenter(1/1.3);e.preventDefault();}
    else if(e.key==='0'){fitMap();e.preventDefault();}
    else if(e.key.startsWith('Arrow')){const amount=42;if(e.key==='ArrowLeft')tx+=amount;if(e.key==='ArrowRight')tx-=amount;if(e.key==='ArrowUp')ty+=amount;if(e.key==='ArrowDown')ty-=amount;clampView();paintMap();e.preventDefault();}
  });
  let lastPinchDistance=0;
  viewport.addEventListener('pointerdown',(e)=>{
    if(e.target.closest('button'))return;
    viewport.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});dragMoved=false;
    if(pointers.size===2){const p=[...pointers.values()];lastPinchDistance=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);}
    dragging=true;viewport.classList.add('dragging');
  });
  viewport.addEventListener('pointermove',(e)=>{
    if(!pointers.has(e.pointerId))return;
    const prev=pointers.get(e.pointerId);const dx=e.clientX-prev.x,dy=e.clientY-prev.y;
    pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(Math.abs(dx)+Math.abs(dy)>1)dragMoved=true;
    if(pointers.size===1){tx+=dx;ty+=dy;clampView();paintMap();}
    else if(pointers.size===2){const p=[...pointers.values()];const d=Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y);if(lastPinchDistance>0){const r=viewport.getBoundingClientRect();const mx=(p[0].x+p[1].x)/2-r.left,my=(p[0].y+p[1].y)/2-r.top;zoomAt(scale*d/lastPinchDistance,mx,my);}lastPinchDistance=d;}
  });
  function endPointer(e){pointers.delete(e.pointerId);if(pointers.size<2)lastPinchDistance=0;if(!pointers.size){dragging=false;viewport.classList.remove('dragging');setTimeout(()=>{dragMoved=false;},30);}}
  viewport.addEventListener('pointerup',endPointer);viewport.addEventListener('pointercancel',endPointer);
  mapImage.addEventListener('error',()=>{$('atlasEmpty').hidden=false;});
  mapImage.addEventListener('load',()=>{$('atlasEmpty').hidden=true;fitMap();});
  window.addEventListener('resize',()=>{const prevRatio=scale/fitScale;fitMap();if(prevRatio>1.02)zoomCenter(prevRatio);});
  fitMap();

  // CHRONICLE — chronology and prose derive from the source manuscript.
  const regionSelect=$('regionFilter');
  realms.forEach(realm=>{const option=document.createElement('option');option.value=realm.name;option.textContent=realm.name;regionSelect.appendChild(option);});
  const filterHolder=$('categoryFilters');
  function renderFilters(){
    filterHolder.replaceChildren();
    categories.forEach(([key,label])=>{const button=document.createElement('button');button.type='button';button.textContent=label;button.classList.toggle('selected',state.category===key);button.setAttribute('aria-pressed',String(state.category===key));button.addEventListener('click',()=>{state.category=key;renderFilters();renderTimeline();});filterHolder.appendChild(button);});
  }
  function matchingEvents(){return events.filter(e=>(state.category==='all'||e.category===state.category)&&(state.region==='all'||e.regions.includes(state.region))&&(!state.search||(e.title+' '+e.text+' '+e.year+' '+e.regions.join(' ')).toLocaleLowerCase().includes(state.search)));}
  function appendRegionButtons(target,event){
    if(!event.regions.length)return;
    const wrap=document.createElement('div');wrap.className='entry-regions';
    event.regions.forEach(name=>{const realm=realms.find(r=>r.name===name);if(!realm)return;const b=document.createElement('button');b.type='button';b.textContent='⌖ '+name;b.addEventListener('click',()=>{selectRealm(realm);$('atlas').scrollIntoView({behavior:'smooth'});});wrap.appendChild(b);});target.appendChild(wrap);
  }
  function eventCard(event){
    const item=document.createElement('article');item.className='timeline-item';item.id=event.id;item.dataset.year=event.year;
    if(event.year===state.highlightYear)item.classList.add('highlight');
    const card=document.createElement('div');card.className='entry-card';
    const btn=document.createElement('button');btn.type='button';btn.className='entry-toggle';btn.setAttribute('aria-expanded','false');btn.setAttribute('aria-controls',event.id+'-details');
    const a=document.createElement('div');
    const meta=document.createElement('div');meta.className='entry-meta';
    const y=document.createElement('span');y.className='entry-year';y.textContent='YEAR '+event.year+' OF THE SUN';meta.appendChild(y);
    const category=document.createElement('span');category.className='entry-type';category.textContent=categoryName[event.category]||event.category;meta.appendChild(category);
    const h=document.createElement('h3');h.className='entry-title';h.textContent=event.title;
    a.append(meta,h);const chevron=document.createElement('span');chevron.className='entry-chevron';chevron.textContent='⌄';chevron.setAttribute('aria-hidden','true');btn.append(a,chevron);
    const details=document.createElement('div');details.className='entry-details';details.id=event.id+'-details';details.hidden=true;
    const p=document.createElement('p');p.textContent=event.text;details.appendChild(p);
    if(event.year===1020||event.year===1350){const note=document.createElement('p');note.style.cssText='font-size:13px;color:#bba47b;font-style:italic';note.textContent='Year derived from the manuscript’s relative dating.';details.appendChild(note);}
    appendRegionButtons(details,event);
    btn.addEventListener('click',()=>{const expanded=btn.getAttribute('aria-expanded')==='true';btn.setAttribute('aria-expanded',String(!expanded));details.hidden=expanded;});
    card.append(btn,details);item.appendChild(card);return item;
  }
  function renderTimeline(){
    const list=matchingEvents(), parent=$('timelineEvents');parent.replaceChildren();
    list.forEach(e=>parent.appendChild(eventCard(e)));
    $('eventCount').textContent=`${list.length} of ${events.length} entries`;
    $('timelineEmpty').hidden=list.length!==0;
  }
  $('timelineSearch').addEventListener('input',e=>{state.search=e.target.value.trim().toLocaleLowerCase();renderTimeline();});
  regionSelect.addEventListener('change',e=>{state.region=e.target.value;renderTimeline();});
  const slider=$('yearSlider');
  slider.addEventListener('input',()=>{$('selectedYear').textContent='YEAR '+slider.value;});
  slider.addEventListener('change',()=>{
    const yr=Number(slider.value);const filtered=matchingEvents();if(!filtered.length)return;
    const closest=filtered.reduce((a,b)=>Math.abs(b.year-yr)<Math.abs(a.year-yr)?b:a);
    state.highlightYear=closest.year;renderTimeline();const card=$(closest.id);
    if(card){const btn=card.querySelector('.entry-toggle');if(btn&&btn.getAttribute('aria-expanded')!=='true')btn.click();card.scrollIntoView({behavior:'smooth',block:'center'});}
  });
  renderFilters();renderTimeline();

  // Small-screen chapter navigation and active chapter indicator.
  const menu=$('mobileMenu');const sidebar=$('sidebar');
  menu.addEventListener('click',()=>{const isOpen=sidebar.classList.toggle('open');menu.setAttribute('aria-expanded',String(isOpen));});
  document.querySelectorAll('.chapter-nav a').forEach(a=>a.addEventListener('click',()=>{sidebar.classList.remove('open');menu.setAttribute('aria-expanded','false');}));
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(visible){document.querySelectorAll('.nav-link').forEach(l=>l.classList.toggle('active',l.dataset.nav===visible.target.id));}},{rootMargin:'-20% 0px -55% 0px',threshold:[0,.2,.5]});document.querySelectorAll('main section[id]').forEach(s=>observer.observe(s));}
})();

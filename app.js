const C=CONFIG,$=s=>document.querySelector(s),money=p=>p?`KES ${p.toLocaleString()} / night`:"Ask for rates";
const wa=t=>`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(t)}`;
/* Placeholder pictures: if images/<file> is missing an SVG placeholder appears. Drop real photos in /images with the same names. */
const COL=[["#16595a","#0f3d3e"],["#c9a35b","#8a6a2b"],["#3d7a6e","#1c4a45"],["#8a5a44","#4a2f22"],["#5b7c99","#2b4257"],["#7a8f4f","#3d4a22"]];
function ph(label,i){const [a,b]=COL[i%COL.length];return"data:image/svg+xml,"+encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='${a}'/><stop offset='1' stop-color='${b}'/></linearGradient></defs><rect width='800' height='600' fill='url(#g)'/><path d='M0 430 Q200 360 400 420 T800 400 V600 H0Z' fill='#fff' opacity='.12'/><circle cx='620' cy='150' r='56' fill='#fff' opacity='.18'/><text x='400' y='310' fill='#fff' opacity='.85' font-family='Georgia' font-size='34' text-anchor='middle'>${label}</text><text x='400' y='350' fill='#fff' opacity='.55' font-family='Arial' font-size='18' text-anchor='middle'>placeholder · replace in /images</text></svg>`)}
const img=(l,i,f)=>`<img src="images/${f}" data-ph="${l}" data-i="${i}" alt="${l}" loading="lazy">`;
function fix(){document.querySelectorAll("img[data-ph]").forEach(e=>{const f=()=>{e.onerror=null;e.src=ph(e.dataset.ph,+e.dataset.i)};e.onerror=f;if(e.complete&&!e.naturalWidth)f()})}
/* Render from CONFIG */
$("#tPhone").textContent="📞 "+C.phone;$("#tMail").textContent="✉ "+C.email;$("#aboutTxt").textContent=C.about;$("#fb").href=C.facebook;$("#yr").textContent=new Date().getFullYear();
$("#stats").innerHTML=C.stats.map(s=>`<li><b>${s[0]}</b><span>${s[1]}</span></li>`).join("");
$("#bR").innerHTML=`<option>Any room</option>`+C.rooms.map(r=>`<option>${r.name}</option>`).join("");
$("#roomGrid").innerHTML=C.rooms.map((r,i)=>`<article class="room rv"><div class="pic">${img(r.name,i+1,`room${i+1}.jpg`)}</div><div class="b"><h3>${r.name}</h3><p>${r.desc}</p><div class="tags"><i>Sleeps ${r.sleeps}</i>${r.perks.map(p=>`<i>${p}</i>`).join("")}</div><div class="row"><span class="price">${money(r.price)}</span><button class="link" onclick="Agent.ask('Book ${r.name}')">Enquire →</button></div></div></article>`).join("");
$("#dineList").innerHTML=C.dining.map(d=>`<div class="dine"><h3>${d.name}</h3><p>${d.desc}</p><small>${d.hours}</small></div>`).join("");
$("#evGrid").innerHTML=C.events.map((e,i)=>`<div class="ev rv"><span>${["🏛️","💍","🌿"][i%3]}</span><h3>${e.name}</h3><p>${e.desc}</p></div>`).join("");
$("#leisure").innerHTML=C.leisure.map(l=>`<span>${l}</span>`).join("");
$("#gal").innerHTML=Array.from({length:8},(_,i)=>`<div class="rv">${img("Gallery "+(i+1),i,`gallery${i+1}.jpg`)}</div>`).join("");
$("#cInfo").innerHTML=`<p>📍 ${C.location}</p><p>📞 <a href="tel:${C.phone.replace(/\s/g,"")}">${C.phone}</a></p><p>💬 <a href="${wa("Hello ROKI Resort")}" target="_blank" rel="noopener">WhatsApp us</a></p><p>✉ ${C.email}</p><p>🕑 Check-in ${C.checkIn} · Check-out ${C.checkOut}</p>`;
if(C.mapEmbed)$("#map").innerHTML=`<iframe src="${C.mapEmbed}" loading="lazy" title="Map"></iframe>`;
fix();
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&(e.target.classList.add("in"),io.unobserve(e.target))),{threshold:.12});
document.querySelectorAll(".rv").forEach(e=>io.observe(e));
const t=new Date().toISOString().slice(0,10);$("#bIn").min=$("#bOut").min=t;
function bookNow(e){e.preventDefault();const i=$("#bIn").value,o=$("#bOut").value;if(o<=i){alert("Check-out must be after check-in.");return false}
 open(wa(`Hello ${C.name}, I'd like to book.\nCheck-in: ${i}\nCheck-out: ${o}\nGuests: ${$("#bG").value}\nRoom: ${$("#bR").value}`),"_blank");return false}
function sendEnq(e){e.preventDefault();open(wa(`Enquiry from ${$("#eN").value} (${$("#eP").value}):\n${$("#eM").value}`),"_blank");return false}

/* ===== Roki Concierge: in-browser agent (intent scoring + booking flow), reads CONFIG ===== */
const Agent=(()=>{let opened=false,flow=null,data={};const box=$("#agentBox"),msgs=$("#msgs");
 const INT=[
  ["greet",["hi","hello","hey","habari","jambo","good morning","good evening","mambo"]],
  ["book",["book","reserve","reservation","availability","available","stay","room for"]],
  ["rooms",["room","suite","accommodation","sleep","bed","family suite","deluxe","standard"]],
  ["price",["price","rate","cost","how much","charge","bei","tariff","cheap","budget","discount"]],
  ["dining",["food","eat","restaurant","menu","dining","breakfast","lunch","dinner","bar","drink","nyama","chakula"]],
  ["events",["event","wedding","conference","meeting","team","retreat","party","venue","birthday","corporate","graduation"]],
  ["leisure",["do","activity","activities","fun","lake","boat","walk","bird","swim","pool","kids","see","masinga"]],
  ["where",["where","location","direction","map","address","far","reach","drive","nairobi","road","get there"]],
  ["times",["check in","check-in","checkin","check out","checkout","time","open","hours"]],
  ["contact",["contact","phone","call","whatsapp","email","number","speak","human","agent","manager","reception"]],
  ["thanks",["thanks","thank you","asante","great","ok thanks"]]];
 const say=(h,who="b")=>{const d=document.createElement("div");d.className="m "+who;d.innerHTML=h;msgs.append(d);msgs.scrollTop=1e9;return d};
 const chips=a=>{$("#chips").innerHTML=a.map(c=>`<button onclick="Agent.ask(this.textContent)">${c}</button>`).join("")};
 const reply=(h,c)=>{const d=say("<i>…</i>");setTimeout(()=>{d.innerHTML=h;msgs.scrollTop=1e9;chips(c||MENU)},450+Math.min(h.length*4,700))};
 const MENU=["Book a room","Rooms & rates","Dining","Events","Things to do","Location","Talk to a person"];
 const link=(t,l)=>`<a href="${l}" target="_blank" rel="noopener">${t}</a>`;
 const norm=s=>" "+s.toLowerCase().replace(/[^a-z0-9\s-]/g," ").replace(/\s+/g," ")+" ";
 function intent(q){const n=norm(q);let best=null,sc=0;for(const f of C.faqs)for(const k of f.k)if(n.includes(" "+k)){return{faq:f}}
  for(const[i,ks]of INT){let s=0;for(const k of ks)if(n.includes(" "+k+" ")||n.includes(" "+k))s+=k.includes(" ")?2:1;if(s>sc){sc=s;best=i}}return{i:best}}
 function answer(i){const R=C.rooms;switch(i){
  case"greet":return[`Karibu to ${C.name}! 👋 I'm Roki, your virtual concierge. I can help with rooms, rates, dining, events and bookings.`];
  case"rooms":return[`<b>Our rooms</b>\n`+R.map(r=>`• ${r.name} (sleeps ${r.sleeps}): ${r.desc}`).join("\n"),["Rooms rates","Book a room"]];
  case"price":return[`<b>Rates</b>\n`+R.map(r=>`• ${r.name}: ${money(r.price)}`).join("\n")+`\n\nFor today's best rate and offers, ${link("WhatsApp us",wa("Hello, what are your current rates?"))}.`,["Book a room"]];
  case"dining":return[`<b>Dining</b>\n`+C.dining.map(d=>`• ${d.name}: ${d.desc} (${d.hours})`).join("\n")];
  case"events":return[`<b>Events &amp; groups</b>\n`+C.events.map(e=>`• ${e.name}: ${e.desc}`).join("\n")+`\n\nTell us the date and number of guests and we'll send a quote.`,["Plan an event"]];
  case"leisure":return[`Things to enjoy: ${C.leisure.join(", ")}.`];
  case"where":return[`📍 ${C.location}\n${C.directions}`,["Talk to a person"]];
  case"times":return[`Check-in is from ${C.checkIn}; check-out is by ${C.checkOut}. Early arrival or late departure can be arranged on request.`];
  case"contact":return[`📞 ${C.phone}\n✉ ${C.email}\n💬 ${link("Chat on WhatsApp",wa("Hello "+C.name))}`];
  case"thanks":return["You're most welcome! Anything else I can help with? 😊"];
  case"book":return null}return undefined}
 const flows={book:[["in","When would you like to check in? (e.g. 12 Dec)"],["out","And check out?"],["guests","How many guests?"],["room",()=>`Which room? ${C.rooms.map(r=>r.name).join(", ")}, or say "any".`],["name","Lastly, your name?"]]};
 function step(v){const f=flows[flow.n];if(v!=null)data[f[flow.s][0]]=v,flow.s++;
  if(flow.s<f.length){const q=f[flow.s][1];return reply(typeof q=="function"?q():q,[])}
  const msg=`Hello ${C.name}, I'm ${data.name}. I'd like to book.\nCheck-in: ${data.in}\nCheck-out: ${data.out}\nGuests: ${data.guests}\nRoom: ${data.room}`;
  flow=null;data={};reply(`Thank you! 🎉 Tap below to send these details to our reservations team on WhatsApp to confirm availability and rate.\n\n${link("Send booking request →",wa(msg))}`)}
 function handle(q){if(/^\s*(cancel|stop|menu|restart)\s*$/i.test(q)){flow=null;data={};return reply("No problem. What would you like to know?")}
  if(flow)return step(q);
  const r=intent(q);
  if(r.faq)return reply(r.faq.a);
  if(r.i=="book"||/plan an event/i.test(q)){flow={n:"book",s:0};data={};if(/event/i.test(q))say("Great. Let's start with the basics.");return step()}
  const a=answer(r.i);
  if(a)return reply(a[0],a[1]);
  reply(`I want to get this right, so let me connect you with our team. ${link("Chat on WhatsApp",wa(q))} or call ${C.phone}.`,MENU)}
 return{toggle(){box.hidden=!box.hidden;if(!box.hidden&&!opened){opened=true;say(`Karibu to <b>${C.name}</b> 🌿 I'm Roki. Ask me anything or choose below.`);chips(MENU)}if(!box.hidden)$("#ain").focus()},
  send(e){e.preventDefault();const v=$("#ain").value.trim();if(v){$("#ain").value="";say(v.replace(/</g,"&lt;"),"u");handle(v)}return false},
  ask(q){if(box.hidden)this.toggle();say(q.replace(/</g,"&lt;"),"u");handle(q)}}})();

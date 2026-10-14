const C=CONFIG,$=s=>document.querySelector(s);
const MAP="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(C.plusCode);
/* Where enquiries go: WhatsApp if set, else email, else the Facebook page */
function reach(text){if(C.whatsapp)return`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(text)}`;
 if(C.email)return`mailto:${C.email}?subject=${encodeURIComponent("Enquiry: "+C.name)}&body=${encodeURIComponent(text)}`;return C.facebook}
$("#tDir").href=MAP;$("#fb").href=C.facebook;$("#aboutTxt").textContent=C.about;$("#yr").textContent=new Date().getFullYear();
if(C.phone)$("#tPhone").innerHTML=`<a href="tel:${C.phone.replace(/\s/g,"")}">📞 ${C.phone}</a>`;
$("#feat").innerHTML=C.features.map(f=>`<li>${f}</li>`).join("");
$("#bR").innerHTML=`<option>Any room</option>`+C.rooms.map(r=>`<option>${r.name}</option>`).join("");
const icons=["🛏️","🌿","👨‍👩‍👧‍👦"];
$("#roomGrid").innerHTML=C.rooms.map((r,i)=>`<article class="room rv"><div class="pic"><span>${icons[i%3]}</span></div><div class="b"><h3>${r.name}</h3><p>${r.desc}</p><div class="tags"><i>Sleeps ${r.sleeps}</i></div><div class="row"><span class="price">Rates on request</span><button class="link" onclick="Agent.ask('Book ${r.name}')">Enquire →</button></div></div></article>`).join("");
$("#dineList").innerHTML=C.dining.map(d=>`<div class="dine"><h3>${d.name}</h3><p>${d.desc}</p></div>`).join("");
$("#evGrid").innerHTML=C.events.map((e,i)=>`<div class="ev rv"><span>${["💍","🏛️","🌿"][i%3]}</span><h3>${e.name}</h3><p>${e.desc}</p></div>`).join("");
$("#leisure").innerHTML=C.leisure.map(l=>`<span>${l}</span>`).join("");
const L=(t,h)=>`<a href="${h}" target="_blank" rel="noopener">${t}</a>`;
$("#cInfo").innerHTML=`<p>📍 ${C.location}</p><p>🧭 Plus code: <b>${C.plusCode}</b> · ${L("Get directions",MAP)}</p>`+
 (C.phone?`<p>📞 ${L(C.phone,"tel:"+C.phone.replace(/\s/g,""))}</p>`:"")+(C.whatsapp?`<p>💬 ${L("Chat on WhatsApp",reach("Hello "+C.name))}</p>`:"")+(C.email?`<p>✉ ${L(C.email,"mailto:"+C.email)}</p>`:"")+`<p>👍 ${L("Follow us on Facebook",C.facebook)}</p>`;
const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&(e.target.classList.add("in"),io.unobserve(e.target))),{threshold:.12});
document.querySelectorAll(".rv").forEach(e=>io.observe(e));
const today=new Date().toISOString().slice(0,10);$("#bIn").min=$("#bOut").min=today;
function bookNow(e){e.preventDefault();const i=$("#bIn").value,o=$("#bOut").value;if(o<=i){alert("Check-out must be after check-in.");return false}
 open(reach(`Hello ${C.name}, I'd like to book.\nCheck-in: ${i}\nCheck-out: ${o}\nGuests: ${$("#bG").value}\nRoom: ${$("#bR").value}`),"_blank");return false}
function sendEnq(e){e.preventDefault();open(reach(`Enquiry from ${$("#eN").value} (${$("#eP").value}):\n${$("#eM").value}`),"_blank");return false}

/* ===== Roki Concierge: in-browser assistant (intent matching + guided booking) ===== */
const Agent=(()=>{let opened=false,flow=null,data={};const box=$("#agentBox"),msgs=$("#msgs");
 const INT=[["greet",["hi","hello","hey","habari","jambo","good morning","good evening","mambo"]],
  ["book",["book","reserve","reservation","availability","available","stay","room for"]],
  ["rooms",["room","suite","accommodation","sleep","bed","deluxe","standard"]],
  ["price",["price","rate","cost","how much","charge","bei","tariff","cheap","budget","discount"]],
  ["dining",["food","eat","restaurant","menu","dining","breakfast","lunch","dinner","bar","drink","chakula"]],
  ["events",["event","wedding","conference","meeting","team","retreat","party","venue","birthday","corporate","graduation"]],
  ["leisure",["do","activity","activities","fun","fountain","walk","see","masinga","garden"]],
  ["where",["where","location","direction","map","address","far","reach","drive","nairobi","road","get there","plus code"]],
  ["contact",["contact","phone","call","whatsapp","email","number","speak","human","agent","manager","reception"]],
  ["thanks",["thanks","thank you","asante","great"]]];
 const say=(h,who="b")=>{const d=document.createElement("div");d.className="m "+who;d.innerHTML=h;msgs.append(d);msgs.scrollTop=1e9;return d};
 const chips=a=>{$("#chips").innerHTML=a.map(c=>`<button onclick="Agent.ask(this.textContent)">${c}</button>`).join("")};
 const MENU=["Book a room","Rooms","Dining","Events","Things to do","Location","Contact us"];
 const reply=(h,c)=>{const d=say("<i>…</i>");setTimeout(()=>{d.innerHTML=h;msgs.scrollTop=1e9;chips(c||MENU)},450+Math.min(h.length*4,700))};
 const norm=s=>" "+s.toLowerCase().replace(/[^a-z0-9\s-]/g," ").replace(/\s+/g," ")+" ";
 function intent(q){const n=norm(q);for(const f of C.faqs)for(const k of f.k)if(n.includes(" "+k))return{faq:f};
  let best=null,sc=0;for(const[i,ks]of INT){let s=0;for(const k of ks)if(n.includes(" "+k))s+=k.includes(" ")?2:1;if(s>sc){sc=s;best=i}}return{i:best}}
 const contact=()=>`${C.phone?`📞 ${C.phone}\n`:""}${C.email?`✉ ${C.email}\n`:""}${L("Message us"+(C.whatsapp?" on WhatsApp":""),reach("Hello "+C.name))}`;
 function answer(i){switch(i){
  case"greet":return[`Karibu to ${C.name}! 👋 I'm Roki, your virtual concierge. I can help with rooms, dining, events and bookings.`];
  case"rooms":return[`<b>Our rooms</b>\n`+C.rooms.map(r=>`• ${r.name} (sleeps ${r.sleeps}): ${r.desc}`).join("\n"),["Rates","Book a room"]];
  case"price":return[`Rates vary by room and season. ${L("Message us",reach("Hello, could I get your current room rates?"))} for today's best offer.`,["Book a room"]];
  case"dining":return[`<b>Dining</b>\n`+C.dining.map(d=>`• ${d.name}: ${d.desc}`).join("\n")];
  case"events":return[`<b>Events &amp; groups</b>\n`+C.events.map(e=>`• ${e.name}: ${e.desc}`).join("\n")+`\n\nShare your date and guest count and we'll prepare a quote.`,["Plan an event"]];
  case"leisure":return[`While you're here: ${C.leisure.join(", ")}.`];
  case"where":return[`📍 ${C.location}\nPlus code: ${C.plusCode}\n${L("Open in Google Maps",MAP)}`,["Contact us"]];
  case"contact":return[contact()];
  case"thanks":return["You're most welcome! Anything else I can help with? 😊"]}}
 const steps=[["in","When would you like to check in? (e.g. 12 Dec)"],["out","And check out?"],["guests","How many guests?"],["room",()=>`Which room? ${C.rooms.map(r=>r.name).join(", ")}, or say "any".`],["name","Lastly, your name?"]];
 let s=0;
 function next(v){if(v!=null){data[steps[s][0]]=v;s++}
  if(s<steps.length){const q=steps[s][1];return reply(typeof q=="function"?q():q,[])}
  const msg=`Hello ${C.name}, I'm ${data.name}. I'd like to book.\nCheck-in: ${data.in}\nCheck-out: ${data.out}\nGuests: ${data.guests}\nRoom: ${data.room}`;
  flow=null;data={};s=0;reply(`Thank you! 🎉 Tap below to send these details to our reservations team to confirm availability and rates.\n\n${L("Send booking request →",reach(msg))}`)}
 function handle(q){if(/^\s*(cancel|stop|menu|restart)\s*$/i.test(q)){flow=null;data={};s=0;return reply("No problem. What would you like to know?")}
  if(flow)return next(q);const r=intent(q);
  if(r.faq)return reply(r.faq.a);
  if(r.i=="book"||/plan an event/i.test(q)){flow=1;data={};s=0;if(/event/i.test(q))say("Great, let's start with the basics.");return next()}
  const a=answer(r.i);if(a)return reply(a[0],a[1]);
  reply(`I'd like to get this right, so let me connect you with our team: ${L("Send us a message",reach(q))}.`)}
 return{toggle(){box.hidden=!box.hidden;if(!box.hidden&&!opened){opened=true;say(`Karibu to <b>${C.name}</b> 🌿 I'm Roki. Ask me anything or choose below.`);chips(MENU)}if(!box.hidden)$("#ain").focus()},
  send(e){e.preventDefault();const v=$("#ain").value.trim();if(v){$("#ain").value="";say(v.replace(/</g,"&lt;"),"u");handle(v)}return false},
  ask(q){if(box.hidden)this.toggle();say(q.replace(/</g,"&lt;"),"u");handle(q)}}})();

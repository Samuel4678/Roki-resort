/* ========= EDIT ME: one file drives the whole website AND the chat concierge =========
   Replace placeholder values with real details from your Facebook page.
   Set a price to null to show "Ask for rates". */
const CONFIG = {
  name: "ROKI Resort",
  location: "Kaewa, Masinga, Kenya",
  phone: "+254 700 000 000",          // EDIT
  whatsapp: "254700000000",           // EDIT: country code, no + or spaces
  email: "info@rokiresort.example",   // EDIT
  facebook: "https://www.facebook.com/p/ROKI-Resort-KAEWA-Masinga-61590518453833/",
  mapEmbed: "",                       // EDIT: paste the src of a Google Maps embed iframe
  checkIn: "2:00 PM", checkOut: "10:00 AM",
  about: "ROKI Resort is a peaceful getaway in Kaewa, Masinga, made for weekend escapes, family time, celebrations and corporate retreats. Replace this paragraph with your own story.",
  stats: [["EDIT","Rooms"],["EDIT","Capacity for events"],["24/7","Guest support"]],
  rooms: [
    {name:"Standard Room", sleeps:2, price:null, desc:"Comfortable en-suite room with garden views. EDIT", perks:["Wi-Fi","Breakfast option","Parking"]},
    {name:"Deluxe Room", sleeps:2, price:null, desc:"More space, a private balcony and a quiet setting. EDIT", perks:["Wi-Fi","Balcony","Parking"]},
    {name:"Family Suite", sleeps:4, price:null, desc:"Room for the whole family, with a sitting area. EDIT", perks:["Wi-Fi","Sitting area","Parking"]}
  ],
  dining: [
    {name:"Main Restaurant", desc:"Local and continental dishes, served fresh. EDIT", hours:"7:00 AM – 10:00 PM"},
    {name:"Garden Bar", desc:"Drinks, nyama choma and evening sundowners. EDIT", hours:"11:00 AM – late"}
  ],
  events: [
    {name:"Conferences & Retreats", desc:"Meeting space, projector and catering for teams. EDIT"},
    {name:"Weddings & Celebrations", desc:"Garden setting for ceremonies and receptions. EDIT"},
    {name:"Team Building", desc:"Outdoor activity days for groups. EDIT"}
  ],
  leisure: ["Nature walks","Bird watching","Sundowners","Family picnics","Nearby Masinga Reservoir","Boat rides (ask us)"],
  faqs: [
    {k:["pet","dog"], a:"Please contact us to confirm our pet policy."},
    {k:["wifi","internet"], a:"Wi-Fi is available for guests. Ask reception for the password."},
    {k:["park","car"], a:"Yes, on-site parking is available for guests."},
    {k:["pay","mpesa","m-pesa","card","cash"], a:"We can confirm accepted payment methods (M-Pesa, cash, card) when you book. Please ask on WhatsApp."},
    {k:["cancel","refund"], a:"Cancellation terms depend on the booking. Message us and we'll share the policy."},
    {k:["kids","child","family"], a:"Families are very welcome. Our Family Suite sleeps four."}
  ],
  directions: "ROKI Resort is in Kaewa, Masinga. Tap the map in the Contact section or WhatsApp us for a pin."
};

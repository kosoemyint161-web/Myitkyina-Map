// --- အပိုင်း (၁) မြို့နယ်များ၏ တည်နေရာ (Coordinates) အတိအကျများ ---
const TOWNSHIPS = {
    myitkyina: [25.3833, 97.3833],
    waingmaw: [25.3562, 97.4332],
    mogaung: [25.3045, 96.9408],
    bhamo: [24.2647, 97.2346],
    moenhyin: [24.7876, 96.3725],
    hophin: [24.9926, 96.5264],
    hparkant: [25.6139, 96.3194],
    Tanine: [26.3312, 96.7103],
    sumprabum: [26.5546, 97.5684],
    sinbo: [24.7500, 97.0333],
    panwar: [25.8894, 98.2325],
    kanpite: [25.5025, 98.1275],
    chiphawe: [25.8864, 98.1275],
    sawtlaw: [26.1550, 98.2192],
    injyanyan: [26.0125, 97.7125],
    machambaw: [27.2831, 97.4589],
    putao: [27.3291, 97.4042]
};

// မြေပုံကို မြစ်ကြီးနားမြို့မှ စတင်ပြသမည်
let map = L.map('map').setView(TOWNSHIPS.myitkyina, 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// --- အပိုင်း (၂) Marker အရောင်များ သတ်မှတ်ခြင်း ---
const createIcon = (color) => {
    return new L.Icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
};

const icons = {
    restaurant: createIcon('green'),
    hospital: createIcon('red'),
    bank: createIcon('blue'),
    school: createIcon('gold'),
    phone: createIcon('violet'),
    hotel: createIcon('orange'),
    government: createIcon('blue')
};

// --- အပိုင်း (၃) လုပ်ငန်းရှင်များနှင့် နေရာဒေတာများ (Data Array) ---
// ဤနေရာတွင် လုပ်ငန်းအသစ်များကို လိုသလောက် ထပ်တိုးနိုင်ပါသည်
const locations = [
    { name: "မြစ်ကြီးနား အထွေထွေရောဂါကု ဆေးရုံကြီး", type: "hospital", lat: 25.3885, lng: 97.3952, phone: "074-21011" },
    { name: "Kiss Me စားသောက်ဆိုင်", type: "restaurant", lat: 25.3792, lng: 97.4010, phone: "09-xxxxxxx" },
    { name: "KBZ Bank Branch 1 (Myitkyina)", type: "bank", lat: 25.3835, lng: 97.3855, phone: "09-xxxxxxx" },
    { name: "ဗန်းမော်တက္ကသိုလ်", type: "school", lat: 24.2647, lng: 97.2346, phone: "ဆက်သွယ်ရန်မရှိ" },
    { name: "ပူတာအိုလေဆိပ်", type: "government", lat: 27.3291, lng: 97.4042, phone: "ဆက်သွယ်ရန်မရှိ" }
];

// Marker များကို မြေပုံပေါ်တင်ခြင်းနှင့် Autocomplete List (Datalist) သို့ ထည့်သွင်းခြင်း
const dataList = document.getElementById('locationList');

locations.forEach(loc => {
    // ၁။ Marker ချခြင်း
    L.marker([loc.lat, loc.lng], { icon: icons[loc.type] || icons.bank })
        .addTo(map)
        .bindPopup(`<b>${loc.name}</b><br>အမျိုးအစား: ${loc.type}<br>📞 ${loc.phone}`);

    // ၂။ Datalist ထဲသို့ ဆိုင်အမည်များ ထည့်ခြင်း (Search အတွက်)
    const option = document.createElement('option');
    option.value = loc.name;
    dataList.appendChild(option);
});

// --- အပိုင်း (၄) Interaction (Township Change & Search) Logic ---

// မြို့နယ်ရွေးချယ်မှုပြောင်းလျှင် မြေပုံရွှေ့ရန်
document.getElementById('townshipSelect').addEventListener('change', function(e) {
    const coords = TOWNSHIPS[e.target.value];
    if (coords) {
        map.flyTo(coords, 14); // မြေပုံကို ချောမွေ့စွာ ရွှေ့ပြောင်းပေးမည်
    }
});

// ရှာဖွေရေးခလုတ် နှိပ်သည့်အခါ
document.getElementById('searchBtn').addEventListener('click', function() {
    const val = document.getElementById('searchInput').value;
    const target = locations.find(loc => loc.name === val);
    
    if (target) {
        map.flyTo([target.lat, target.lng], 17); // Zoom အနီးကပ်ပြမည်
        L.popup()
            .setLatLng([target.lat, target.lng])
            .setContent(`<b>${target.name}</b><br>ဤနေရာတွင် ရှိပါသည်။`)
            .openOn(map);
    } else {
        alert("တောင်းပန်ပါသည်။ ရှာမတွေ့ပါ။ ဆိုင်အမည်ကို အတိအကျ ရိုက်နှိပ်ပေးပါ။");
    }
});

// Contact Button Function
document.getElementById('contactBusinessBtn').addEventListener('click', () => {
    window.location.href = "tel:09267298584";
});
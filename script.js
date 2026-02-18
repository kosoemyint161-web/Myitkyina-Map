// ၁။ မြို့နယ်အားလုံး၏ တည်နေရာများ
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

// မြေပုံစတင်ဖွင့်ခြင်း
let map = L.map('map').setView(TOWNSHIPS.myitkyina, 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// ၂။ Marker အရောင်များ သတ်မှတ်ခြင်း
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
    hospital: createIcon('red'),
    restaurant: createIcon('green'),
    bank: createIcon('blue'),
    school: createIcon('gold')
};

// ၃။ လုပ်ငန်းဒေတာများ
const locations = [
    { name: "မြစ်ကြီးနား အထွေထွေရောဂါကု ဆေးရုံကြီး", type: "hospital", lat: 25.3885, lng: 97.3952, phone: "074-21011" },
    { name: "Kiss Me စားသောက်ဆိုင်", type: "restaurant", lat: 25.3792, lng: 97.4010, phone: "09-xxxxxxx" },
    { name: "KBZ Bank", type: "bank", lat: 25.3833, lng: 97.3833, phone: "09-xxxxxxx" }
];

// Marker များချခြင်းနှင့် Autocomplete List ဖြည့်ခြင်း
const dataList = document.getElementById('locationList');
locations.forEach(loc => {
    L.marker([loc.lat, loc.lng], { icon: icons[loc.type] || icons.bank })
        .addTo(map)
        .bindPopup(`<b>${loc.name}</b><br>📞 ${loc.phone}`);

    const option = document.createElement('option');
    option.value = loc.name;
    dataList.appendChild(option);
});

// ၄။ ရှာဖွေခြင်းနှင့် မြို့နယ်ရွေးချယ်ခြင်း Logic
document.getElementById('townshipSelect').addEventListener('change', function(e) {
    map.flyTo(TOWNSHIPS[e.target.value], 14);
});

document.getElementById('searchBtn').addEventListener('click', function() {
    const searchVal = document.getElementById('searchInput').value.trim();
    const target = locations.find(loc => loc.name === searchVal);
    
    if (target) {
        map.flyTo([target.lat, target.lng], 17);
        L.popup().setLatLng([target.lat, target.lng]).setContent(`<b>${target.name}</b>`).openOn(map);
    } else {
        alert("တောင်းပန်ပါသည်။ ရှာမတွေ့ပါ။ စာလုံးပေါင်းကို ပြန်စစ်ပေးပါ။");
    }
});
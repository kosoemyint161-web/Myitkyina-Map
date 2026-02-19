// ၁။ သင့်ရဲ့ Google Sheet CSV Link
const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSiAnasNC6vLjb4IChJ5Vzj_GLcRKGBx8q-22DUsquCeuzCzfdNxG821SfCnWnA83-q2AdeqTiJLuOn/pub?output=csv";

// ၂။ မြို့နယ်အားလုံး၏ တည်နေရာများ
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

// ၃။ Marker အရောင် (၁၁) မျိုး သတ်မှတ်ခြင်း
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
    restaurant: createIcon('yellow'),
    hospital: createIcon('red'),
    bank: createIcon('brown'),
    school: createIcon('green'),
    phone: createIcon('violet'),
    hotel: createIcon('orange'),
    market: createIcon('violet'),
    property: createIcon('purple'),
    religion: createIcon('blue'),
    bus: createIcon('black'), // darkBlue မရှိသောကြောင့် အနီးစပ်ဆုံး black သုံးထားပါသည်
    government: createIcon('red')
};

let locations = []; // Sheet ထဲက data များ သိမ်းရန်

// ၄။ Google Sheet မှ ဒေတာဆွဲယူသည့် Function
async function loadDataFromSheet() {
    try {
        const response = await fetch(sheetUrl);
        const csvData = await response.text();
        const rows = csvData.split('\n').slice(1); // Header ကို ဖယ်ထုတ်သည်
        
        const dataList = document.getElementById('locationList');
        dataList.innerHTML = ''; 

rows.forEach(row => {
            const columns = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            
            if (columns.length >= 4) {
                // Column A(0)=Name, B(1)=Type, C(2)=Lat, D(3)=Lng, H(7)=Phone
                const name = columns[0].replace(/"/g, "").trim(); 
                const type = columns[1].replace(/"/g, "").trim();
                const lat = parseFloat(columns[2]);
                const lng = parseFloat(columns[3]);
                const phone = columns[7]?.replace(/"/g, "").trim() || "ဆက်သွယ်ရန်မရှိ";

                if (!isNaN(lat) && !isNaN(lng)) {
                    // Marker ချခြင်း
                    L.marker([lat, lng], { icon: icons[type] || icons.bank })
                        .addTo(map)
                        .bindPopup(`<b>${name}</b><br>📞 ${phone}`);

                    // Search List ထဲထည့်ခြင်း
                    const option = document.createElement('option');
                    option.value = name;
                    document.getElementById('locationList').appendChild(option);
                    
                    locations.push({ name, lat, lng, type, phone });
                }
            }
        });
        console.log("ဒေတာများ အောင်မြင်စွာ Load လုပ်ပြီးပါပြီ။");
    } catch (error) {
        console.error("Error loading data:", error);
    }
}

// ၅။ Interaction Logic
document.getElementById('townshipSelect').addEventListener('change', function(e) {
    if (TOWNSHIPS[e.target.value]) {
        map.flyTo(TOWNSHIPS[e.target.value], 14);
    }
});

document.getElementById('searchBtn').addEventListener('click', function() {
    const searchVal = document.getElementById('searchInput').value.trim();
    const target = locations.find(loc => loc.name === searchVal);
    
    if (target) {
        map.flyTo([target.lat, target.lng], 17);
        L.popup()
            .setLatLng([target.lat, target.lng])
            .setContent(`<b>${target.name}</b>`)
            .openOn(map);
    } else {
        alert("တောင်းပန်ပါသည်။ ရှာမတွေ့ပါ။ စာလုံးပေါင်းကို ပြန်စစ်ပေးပါ။");
    }
});

// စတင်သည်နှင့် ဒေတာကို ဆွဲယူရန် ခေါ်ယူခြင်း
loadDataFromSheet();
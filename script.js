// ၁။ Google Sheet CSV Link
const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSiAnasNC6vLjb4IChJ5Vzj_GLcRKGBx8q-22DUsqCeuzCzfdNxG821SfCnWnaA83-q2AdeqTiJLu0n/pub?output=csv";

// ၂။ မြို့နယ်ဗဟိုချက်များ
const TOWNSHIPS = {
    myitkyina: [25.3833, 97.3833],
    waingmaw: [25.3562, 97.4332],
    bhamo: [24.2667, 97.25],
    mogaung: [25.3167, 96.9333],
    moenhyin: [25.5167, 96.6667],
    hophin: [25.6167, 97.6667],
    hparkant: [25.55, 96.65],
    tanine: [25.45, 97.05],
    sumprabum: [27.3, 97.4333],
    sinbo: [25.6833, 97.3333],
    panwar: [26.0, 97.0],
    kanpite: [25.7, 97.2],
    chiphawe: [25.9, 97.5],
    sawtlaw: [26.1, 97.6],
    injyanyan: [25.8, 97.4],
    machambaw: [27.0, 97.3],  
    putao: [27.3333, 97.4167]
};

// ၃။ Map Initialize
const map = L.map('map').setView(TOWNSHIPS.myitkyina, 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// ၄။ Marker Icon Generator
const createIcon = (color) => new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// ၅။ Icon အရောင်သတ်မှတ်ချက်များ
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
    bus: createIcon('black'),
    government: createIcon('red')
};

let locations = []; 
let allMarkers = []; // Filter လုပ်ရန် Marker အားလုံးကို သိမ်းဆည်းမည့်နေရာ

// ၆။ ဒေတာဖတ်ခြင်းနှင့် မြေပုံပေါ်တင်ခြင်း
function loadDataFromSheet() {
    Papa.parse(sheetUrl, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            const data = results.data;
            const dataList = document.getElementById('locationList');
            dataList.innerHTML = ''; 
            
            // အသစ်ပြန်ဖတ်တိုင်း အဟောင်းများကို ရှင်းထုတ်ခြင်း
            allMarkers.forEach(item => map.removeLayer(item.marker));
            allMarkers = [];
            locations = [];

            data.forEach(row => {
                const name = (row.name || '').trim();
                const lat = parseFloat(row.lat);
                const lng = parseFloat(row.lng);
                const type = (row.type || '').trim().toLowerCase();
                const address = (row.address || 'မရှိပါ').trim();
                const phone = (row.phone || 'မရှိပါ').trim();

                if (!isNaN(lat) && !isNaN(lng) && name) {
                    // အရောင်သတ်မှတ်ခြင်း
                    const iconToUse = icons[type] || createIcon('blue');

                    // Marker ဖန်တီးခြင်း
                    const marker = L.marker([lat, lng], { icon: iconToUse })
                        .bindPopup(`<b>${name}</b><br>📍 ${address}<br>📞 ${phone}`);
                    
                    marker.addTo(map);

                    // Filter အတွက် သိမ်းဆည်းခြင်း
                    allMarkers.push({ marker, type, name, address, phone, lat, lng });
                    // Search အတွက် သိမ်းဆည်းခြင်း
                    locations.push({ name, lat, lng, phone, address });

                    // Autocomplete အတွက် ထည့်ခြင်း
                    const option = document.createElement('option');
                    option.value = name;
                    dataList.appendChild(option);
                }
            });
            console.log("Loaded:", locations.length, "locations");
        },
        error: function(err) {
            console.error("CSV error:", err);
        }
    });
}

// ၇။ Category Filter Logic
document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Active class ပြောင်းလဲခြင်း
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const selectedCategory = button.getAttribute('data-category');

        allMarkers.forEach(item => {
            if (selectedCategory === 'all' || item.type === selectedCategory) {
                map.addLayer(item.marker);
            } else {
                map.removeLayer(item.marker);
            }
        });
    });
});

// ၈။ ရှာဖွေခြင်း Logic
document.getElementById('searchBtn').addEventListener('click', () => {
    const q = document.getElementById('searchInput').value.trim().toLowerCase();
    const target = allMarkers.find(l => l.name.toLowerCase().includes(q));
    
    if (target) {
        map.flyTo([target.lat, target.lng], 17);
        L.popup().setLatLng([target.lat, target.lng])
            .setContent(`<b>${target.name}</b><br>📍 ${target.address}<br>📞 ${target.phone}`)
            .openOn(map);
    } else {
        alert("တောင်းပန်ပါသည်။ ရှာမတွေ့ပါ။");
    }
});

// ၉။ မြို့နယ်ရွေးချယ်ခြင်း
document.getElementById('townshipSelect').addEventListener('change', (e) => {
    const key = e.target.value.toLowerCase();
    if (TOWNSHIPS[key]) {
        map.setView(TOWNSHIPS[key], 13);
    }
});

loadDataFromSheet();
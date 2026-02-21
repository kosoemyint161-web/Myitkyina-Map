// ၁။ အခြေခံ Settings နှင့် Google Sheet Link
const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSiAnasNC6vLjb4lChJ5Vzj_GLcRKGBx8q-22DUsqCeuzCzfdNxG821SfCnWnaA83-q2AdeqTiJLu0n/pub?output=csv";

// ၂။ Language Data
const langData = {
    mm: { 
        title: "ကချင်ပြည်နယ်မြေပုံ", 
        sub: "ကချင်ပြည်နယ်မြေပုံနှင့် လမ်းညွှန်", 
        searchPlaceholder: "လုပ်ငန်းအမည် သို့မဟုတ် ရပ်ကွက်...", 
        searchBtn: "ရှာဖွေမည်" 
    },
    en: { 
        title: "Kachin State Map", 
        sub: "Kachin State Directory & Map", 
        searchPlaceholder: "Search business or address...", 
        searchBtn: "Search" 
    }
};

// ၃။ မြို့နယ်ဗဟိုချက်များ
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

// ၄။ Map Initialize
const map = L.map('map').setView(TOWNSHIPS.myitkyina, 13);
let currentTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// ၅။ Icon Generator (Premium များအတွက် Icon ပိုကြီးစေရန်)
const createIcon = (color, isPremium = false) => new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: isPremium ? [35, 55] : [25, 41], 
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const iconsByGroup = {
    restaurant: 'yellow', hospital: 'red', bank: 'brown', school: 'green',
    phone: 'violet', hotel: 'orange', market: 'violet', property: 'purple',
    religion: 'blue', bus: 'black', government: 'red'
};

let allMarkers = [];

// ၆။ ဒေတာဖတ်ခြင်း၊ Sorting နှင့် Auto-suggestion
function loadDataFromSheet() {
    Papa.parse(sheetUrl, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            let data = results.data;

            // ⭐ Sorting Logic (Platinum > Gold > Regular)
            data.sort((a, b) => {
                const levels = { platinum: 3, gold: 2, regular: 1 };
                return (levels[(b.level || 'regular').toLowerCase()] || 0) - (levels[(a.level || 'regular').toLowerCase()] || 0);
            });

            const dataList = document.getElementById('locationList');
            if(dataList) dataList.innerHTML = ''; 

            data.forEach(row => {
                const name = (row.name || '').trim();
                const lat = parseFloat(row.lat);
                const lng = parseFloat(row.lng);
                const type = (row.type || '').trim().toLowerCase();
                const level = (row.level || 'regular').toLowerCase();
                const image = row.image || ''; // Sheet ထဲတွင် image column ရှိရမည်

                if (!isNaN(lat) && !isNaN(lng) && name) {
                    // အရောင်သတ်မှတ်ခြင်း (Level အလိုက် သို့မဟုတ် Type အလိုက်)
                    let color = level === 'platinum' ? 'black' : (level === 'gold' ? 'gold' : (iconsByGroup[type] || 'blue'));
                    const isPremium = (level === 'platinum' || level === 'gold');
                    
                    const marker = L.marker([lat, lng], { icon: createIcon(color, isPremium) });

                    // 🖼️ Image Popup Layout
                    const popupContent = `
                        <div class="custom-popup" style="text-align:center; min-width:150px;">
                            ${image ? `<img src="${image}" style="width:100%; height:100px; object-fit:cover; border-radius:8px; margin-bottom:5px;">` : ''}
                            <h3 style="margin:5px 0;">${name} ${level === 'platinum' ? '⭐' : ''}</h3>
                            <p style="margin:0;">📍 ${(row.address || 'မရှိပါ')}</p>
                            <p style="margin:5px 0; font-weight:bold; color:#27ae60;">📞 ${(row.phone || 'မရှိပါ')}</p>
                        </div>
                    `;
                    marker.bindPopup(popupContent);
                    marker.addTo(map);

                    allMarkers.push({ marker, type, name, address: row.address, phone: row.phone, lat, lng });

                    // 🔍 Auto-suggestion Initial Load
                    if(dataList) {
                        const option = document.createElement('option');
                        option.value = name;
                        dataList.appendChild(option);
                    }
                }
            });
        }
    });
}

// ၇။ Dark Mode Logic
const darkModeBtn = document.getElementById('darkModeToggle');
if(darkModeBtn) {
    darkModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        darkModeBtn.innerText = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";

        map.removeLayer(currentTileLayer);
        if(isDark) {
            currentTileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);
        } else {
            currentTileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        }
    });
}

// ၈။ Language Switch Function
function changeLang(lang) {
    document.getElementById('mainTitle').innerText = langData[lang].title;
    document.getElementById('subTitle').innerText = langData[lang].sub;
    document.getElementById('searchInput').placeholder = langData[lang].searchPlaceholder;
    document.getElementById('searchBtn').innerText = langData[lang].searchBtn;
    
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    const targetBtn = document.getElementById(lang + 'Btn');
    if(targetBtn) targetBtn.classList.add('active');
}

// ၉။ Search Logic
const searchBtnAction = document.getElementById('searchBtn');
if (searchBtnAction) {
    searchBtnAction.addEventListener('click', () => {
        const query = document.getElementById('searchInput').value.trim().toLowerCase();
        const target = allMarkers.find(m => m.name.toLowerCase().includes(query));
        if (target) {
            map.flyTo([target.lat, target.lng], 17);
            target.marker.openPopup();
        } else {
            alert("ရှာမတွေ့ပါ!");
        }
    });
}

// ၁၀။ Category Filter (Datalist ပါ Update လုပ်ပေးမည်)
document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const selected = button.getAttribute('data-category');
        const dataList = document.getElementById('locationList');
        if(dataList) dataList.innerHTML = ''; 

        allMarkers.forEach(item => {
            if (selected === 'all' || item.type === selected) {
                map.addLayer(item.marker);
                if(dataList) {
                    const option = document.createElement('option');
                    option.value = item.name;
                    dataList.appendChild(option);
                }
            } else {
                map.removeLayer(item.marker);
            }
        });
    });
});

// ၁၁။ မြို့နယ်ရွေးချယ်ခြင်း
const townshipSelectAction = document.getElementById('townshipSelect');
if (townshipSelectAction) {
    townshipSelectAction.addEventListener('change', (e) => {
        const center = TOWNSHIPS[e.target.value];
        if (center) map.setView(center, 13);
    });
}

loadDataFromSheet();
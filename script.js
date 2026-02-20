// Google Sheet CSV Link
const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSiAnasNC6vLjb4IChJ5Vzj_GLcRKGBx8q-22DUsquCeuzCzfdNxG821SfCnWnA83-q2AdeqTiJLuOn/pub?output=csv";

// မြို့နယ်ဗဟိုချက်များ (lowercase keys)
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

// Map initialize
const map = L.map('map').setView(TOWNSHIPS.myitkyina, 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// Marker icon generator
const createIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const defaultIcon = createIcon('blue');

let locations = [];

// PapaParse header-based parsing
function loadDataFromSheet() {
  Papa.parse(sheetUrl, {
    download: true,
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      const data = results.data;
      const dataList = document.getElementById('locationList');
      dataList.innerHTML = '';

      data.forEach(row => {
        const name = (row.name || '').trim();
        const type = (row.type || '').trim().toLowerCase();
        const lat = parseFloat(row.lat || '');
        const lng = parseFloat(row.lng || '');
        const township = (row.township || '').trim().toLowerCase();
        const color = (row.color || '').trim().toLowerCase();
        const address = (row.address || '').trim();
        const phone = (row.phone || 'မရှိပါ').trim();

        if (!isNaN(lat) && !isNaN(lng) && name) {
          const icon = color ? createIcon(color) : defaultIcon;

          L.marker([lat, lng], { icon }).addTo(map)
            .bindPopup(`<b>${name}</b><br>${address}<br>📞 ${phone}`);

          const option = document.createElement('option');
          option.value = name;
          dataList.appendChild(option);

          locations.push({ name, type, lat, lng, township, phone });
        }
      });
      console.log("Loaded", locations.length, "locations");
    },
    error: function(err) {
      console.error("CSV parse error", err);
    }
  });
}

// Search logic (case-insensitive, partial match)
document.getElementById('searchBtn').addEventListener('click', () => {
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  if (!q) return alert("ရှာမည့် စာလုံးထည့်ပါ။");

  const target = locations.find(l => l.name.toLowerCase().includes(q));
  if (target) {
    map.flyTo([target.lat, target.lng], 17);
    L.popup().setLatLng([target.lat, target.lng])
      .setContent(`<b>${target.name}</b><br>📞 ${target.phone}`)
      .openOn(map);
  } else {
    alert("တောင်းပန်ပါသည်။ ရှာမတွေ့ပါ။");
  }
});

// Township select → map center change
document.getElementById('townshipSelect').addEventListener('change', (e) => {
  const key = e.target.value.toLowerCase();
  if (TOWNSHIPS[key]) {
    map.setView(TOWNSHIPS[key], 13);
  }
});

// Load data
loadDataFromSheet();

const MYITKYINA_CENTER = [25.3833, 97.3833];
let map, userMarker;
let markers = [];

// နမူနာ Data (နောင်တွင် Database မှ ဆွဲယူရန်)
const locations = [
    { id: 1, name: "မြစ်ကြီးနားဆေးရုံကြီး", lat: 25.3892, lng: 97.3875, cat: "hospital" },
    { id: 2, name: "မြစ်ကြီးနားဈေးကြီး", lat: 25.3812, lng: 97.3980, cat: "market" },
    { id: 3, name: "Kiss Me စားသောက်ဆိုင်", lat: 25.3850, lng: 97.3910, cat: "restaurant" }
];

function initMap() {
    map = L.map('map').setView(MYITKYINA_CENTER, 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    displayMarkers('all');
    getUserLocation();
}

function displayMarkers(category) {
    // အဟောင်းများကို ဖျက်ပါ
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    locations.forEach(loc => {
        if (category === 'all' || loc.cat === category) {
            const m = L.marker([loc.lat, loc.lng])
                .bindPopup(`<b>${loc.name}</b><br>${loc.cat}`)
                .addTo(map);
            markers.push(m);
        }
    });
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            const { latitude, longitude } = pos.coords;
            if (userMarker) map.removeLayer(userMarker);
            userMarker = L.circleMarker([latitude, longitude], { color: 'blue', radius: 10 }).addTo(map)
                .bindPopup("သင်ရှိနေသောနေရာ").openPopup();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initMap();

    // Category Filtering
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            displayMarkers(this.dataset.category);
        });
    });

    // Search Logic (Basic)
    document.getElementById('searchBtn').addEventListener('click', () => {
        const query = document.getElementById('searchInput').value.toLowerCase();
        const found = locations.find(l => l.name.toLowerCase().includes(query));
        if (found) {
            map.flyTo([found.lat, found.lng], 16);
            L.popup().setLatLng([found.lat, found.lng]).setContent(found.name).openOn(map);
        } else {
            alert("ရှာမတွေ့ပါ။");
        }
    });
});
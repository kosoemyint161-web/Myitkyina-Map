```javascript
// မြစ်ကြီးနားမြို့ရဲ့ ကိုဩဒိနိတ်
const MYITKYINA_CENTER = [25.3833, 97.3833];

// နေရာများ ဒေတာ (ခင်ဗျားရဲ့ဒေတာအတိုင်းထားခဲ့)
const placesData = [
    { name: 'မြစ်ကြီးနားဈေး', category: 'market', lat: 25.3850, lng: 97.3920, address: 'မြို့မရပ်ကွက်', phone: '09-123456789', hours: '၀၆:၀၀ - ၁၇:၀၀' },
    { name: 'ရွှေမြစ်ကြီးနား စားသောက်ဆိုင်', category: 'restaurant', lat: 25.3820, lng: 

97.3890, address: 'ဗိုလ်ချုပ်လမ်း', phone: '09-987654321', hours: '၀၈:၀၀ - ၂၁:၀၀' },
    { name: 'ကချင်ပြည်နယ်ဆေးရုံကြီး', category: 'hospital', lat: 25.3800, lng: 97.3900, address: 'ဆေးရုံလမ်း', phone: '074-21234', hours: '၂၄ နာရီ' },
    { name: 'မြစ်ကြီးနား ဟိုတယ်', category: 'hotel', lat: 25.3825, lng: 97.3910, address: 'မြစ်ကမ်းလမ်း', phone: '074-22789', hours: '၂၄ နာရီ' },
    { name: 'KBZ Bank', category: 'bank', lat: 25.3838, lng: 97.3888, address: 'ဈေးလမ်း', phone: '074-22888', hours: '၀၉:၀၀ - ၁၅:၀၀' },
    { name: 'မြစ်ကြီးနားတက္ကသိုလ်', category: 'school', lat: 25.3700, lng: 97.3700, address: 'တက္ကသိုလ်လမ်း', phone: '074-23456', hours: '၀၉:၀၀ - ၁၆:၀၀' }
];

// Global variables
let map;

let markers = [];
let routingControl = null;

// မြေပုံစတင်ခြင်း
function initMap() {
    // မြေပုံဖန်တီးခြင်း
    map = L.map('map').setView(MYITKYINA_CENTER, 14);

    // OpenStreetMap layer ထည့်ခြင်း (အခမဲ့)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // နေရာအားလုံးအတွက် Marker ချခြင်း
    placesData.forEach(place => {
        addMarker(place);
    });

}

// Marker ချခြင်း function
function addMarker(place) {
    // Marker icon အရောင်ရွေးချယ်ခြင်း
    const icon = getMarkerIcon(place.category);
    
    // Marker ဖန်တီးခြင်း
    const marker = L.marker([place.lat, place.lng], { icon: icon }).addTo(map);
    
    // Popup အကြောင်းအရာ ဖန်တီးခြင်း
    const popupContent = createPopupContent(place);
    
    // Popup ချိတ်ဆက်ခြင်း
    marker.bindPopup(popupContent);
    
    markers.push(marker);
}


// Marker icon ပြန်ပေးခြင်း
function getMarkerIcon(category) {
    const iconColors = {
        restaurant: 'red',
        hospital: 'blue',
        property: 'green',
        market: 'yellow',
        hotel: 'purple',
        bank: 'orange',
        school: 'pink',
        government: 'cadetblue',
        default: 'red'
    };
    
    const color = iconColors[category] || iconColors.default;
    
    return L.icon({
        iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-

color-markers/master/img/marker-icon-${color}.png`,
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });
}

// Popup အကြောင်းအရာ ဖန်တီးခြင်း
function createPopupContent(place) {
    let hoursHtml = place.hours ? `<p><strong>ဖွင့်ချိန်:</strong> ${place.hours}</p>` : '';
    
    return `
        <div style="min-width: 200px; padding: 5px; font-family: 'Pyidaungsu', Arial, sans-

serif;">
            <h3 style="margin: 0 0 10px 0; color: #1e3c72;">${place.name}</h3>
            <p><strong>လိပ်စာ:</strong> ${place.address}</p>
            <p><strong>ဖုန်း:</strong> ${place.phone}</p>
            ${hoursHtml}
            <button onclick="getDirections(${place.lat}, ${place.lng}, '${place.name}')" 
                    style="background-color: #2a5298; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; width: 100%; margin-top: 10px; font-family: 'Pyidaungsu', Arial, sans-serif;">
                လမ်းကြောင်းရှာရန်
            </button>
        </div>
    `;
}


// လမ်းကြောင်းရှာခြင်း (OSRM သုံးပြီး)
function getDirections(destLat, destLng, destName) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            
            // အရင် routing control ရှိရင် ဖြုတ်ပစ်မယ်
            if (routingControl) {
                map.removeControl(routingControl);
            }
            
            // လမ်းကြောင်းအသစ်ဖန်တီးမယ်

            routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(userLat, userLng),
                    L.latLng(destLat, destLng)
                ],
                router: L.Routing.osrmv1({
                    serviceUrl: 'https://router.project-osrm.org/route/v1'
                }),
                language: 'en',
                showAlternatives: true,
                lineOptions: {
                    styles: [{ color: '#2a5298', weight: 5 }]
                }
            }).addTo(map);
            
            // ပြီးရင် ချုံ့ပြမယ်
            const bounds = L.latLngBounds([userLat, userLng], [destLat, destLng]);

            map.fitBounds(bounds, { padding: [50, 50] });
            
        }, function() {
            alert('သင့်တည်နေရာကို ရှာမတွေ့ပါ။ ကျေးဇူးပြု၍ Location ဖွင့်ထားပါ။');
        });
    } else {
        alert('သင့်ဘရောက်ဆာက Geolocation ကို မထောက်ပံ့ပါ။');
    }
}

// Google Maps နဲ့ လမ်းကြောင်းရှာခြင်း (အရန်နည်းလမ်း)
function openGoogleMaps(destLat, destLng) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {

            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            
            const url = `https://www.google.com/maps/dir/${userLat},${userLng}/${destLat},${destLng}`;
            window.open(url, '_blank');
        });
    } else {
        const url = `https://www.google.com/maps/search/?api=1&query=${destLat},${destLng}`;
        window.open(url, '_blank');
    }
}

// အမျိုးအစားအလိုက် စစ်ထုတ်ခြင်း
function filterByCategory(category) {
    // Marker အားလုံးကို ဖျောက်မယ်

    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    if (category === 'all') {
        // အားလုံးပြမယ်
        placesData.forEach(place => addMarker(place));
    } else {
        // သက်ဆိုင်ရာအမျိုးအစားပဲပြမယ်
        const filteredPlaces = placesData.filter(place => place.category === category);
        filteredPlaces.forEach(place => addMarker(place));
    }
}

// ရှာဖွေခြင်း
function searchPlaces(query) {
    if (!query) return;

    
    const searchTerm = query.toLowerCase();
    const results = placesData.filter(place => 
        place.name.toLowerCase().includes(searchTerm) ||
        place.address.toLowerCase().includes(searchTerm)
    );

    // ရှာတွေ့တဲ့နေရာတွေကိုပဲပြမယ်
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    if (results.length > 0) {
        results.forEach(place => addMarker(place));

        
        // ပထမဆုံးရလဒ်ကိုချုံ့ပြမယ်
        map.setView([results[0].lat, results[0].lng], 15);
    } else {
        alert('ရှာမတွေ့ပါ။');
        placesData.forEach(place => addMarker(place));
    }
}

// Event Listeners (စာမျက်နှာပေါ်လာတာနဲ့)
document.addEventListener('DOMContentLoaded', function() {
    // မြေပုံစတင်ခြင်း
    initMap();
    
    // ရှာဖွေရေး button
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {

        searchBtn.addEventListener('click', function() {
            const query = document.getElementById('searchInput').value;
            searchPlaces(query);
        });
    }

    // Enter ခေါက်ရင်လည်း ရှာမယ်
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value;
                searchPlaces(query);
            }
        });

    }

    // Category buttons
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            filterByCategory(category);
        });
    });
});
```

// မြစ်ကြီးနားမြို့ရဲ့ ကိုဩဒိနိတ် (မူလနေရာ)
const MYITKYINA_CENTER = [25.3833, 97.3833];
let map;
let userMarker;

// မြေပုံစတင်ခြင်း
function initMap() {
    // မြေပုံဖန်တီးခြင်း
    map = L.map('map').setView(MYITKYINA_CENTER, 13);

    // OpenStreetMap layer ထည့်ခြင်း
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // မြို့လယ်မှာ Marker ချခြင်း
    L.marker(MYITKYINA_CENTER).addTo(map)
        .bindPopup('မြစ်ကြီးနားမြို့');

    // လက်ရှိတည်နေရာရယူခြင်း
    getUserLocation();
}

// လက်ရှိတည်နေရာရယူခြင်း
function getUserLocation() {
    if (navigator.geolocation) {
        // တည်နေရာရယူနေကြောင်းပြသရန်
        console.log('တည်နေရာရယူနေပါသည်...');
        
        navigator.geolocation.getCurrentPosition(
            // အောင်မြင်ရင်
            function(position) {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                
                console.log('တည်နေရာရရှိပြီ:', userLat, userLng);
                
                // အရင် user marker ရှိရင်ဖျက်မယ်
                if (userMarker) {
                    map.removeLayer(userMarker);
                }
                
                // လက်ရှိတည်နေရာမှာ အပြာရောင် marker ချမယ်
                userMarker = L.marker([userLat, userLng], {
                    icon: L.icon({
                        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    })
                }).addTo(map)
                .bindPopup('သင်ရှိနေသောနေရာ')
                .openPopup();
                
                // မြေပုံကို လက်ရှိတည်နေရာနဲ့ မြို့လယ်ကိုပါမြင်ရအောင် ချုံ့မယ်
                const group = L.featureGroup([
                    L.marker(MYITKYINA_CENTER),
                    L.marker([userLat, userLng])
                ]);
                map.fitBounds(group.getBounds(), { padding: [50, 50] });
            },
            // အမှားဖြစ်ရင်
            function(error) {
                console.error('တည်နေရာရယူ၍မရပါ:', error);
                let errorMessage = '';
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'တည်နေရာခွင့်ပြုချက် မပေးထားပါ။';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'တည်နေရာ မရနိုင်ပါ။';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'တည်နေရာရယူရန် အချိန်ကုန်သွားပါသည်။';
                        break;
                    default:
                        errorMessage = 'အမှားတစ်ခုဖြစ်နေပါသည်။';
                }
                
                alert('လက်ရှိတည်နေရာရယူ၍မရပါ။ ' + errorMessage + ' မြို့လယ်ကိုသာပြသထားပါသည်။');
            },
            // Options
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    } else {
        alert('သင့်ဘရောက်ဆာက Geolocation ကို မထောက်ပံ့ပါ။');
    }
}

// စာမျက်နှာပေါ်လာတာနဲ့ မြေပုံစတင်မယ်
window.addEventListener('load', function() {
    initMap();
    
    // Category ခလုတ်တွေအတွက် Event Listener
document.addEventListener('DOMContentLoaded', function() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // ခလုတ် active ပုံစံပြောင်းရန်
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // ဒီနေရာမှာ သက်ဆိုင်ရာ category အတွက် စစ်ထုတ်လို့ရပါတယ်
            console.log('Selected category:', category);
            alert('"' + this.textContent + '" အမျိုးအစားကို ရွေးချယ်လိုက်ပါသည်။ မကြာမီ လုပ်ဆောင်ပေးပါမည်။');
        });
    });

    // ရှာဖွေရေး button
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchText = document.getElementById('searchInput').value;
            if (searchText) {
                alert('"' + searchText + '" ကိုရှာဖွေနေပါသည်။');
            } else {
                alert('ကျေးဇူးပြု၍ ရှာဖွေစရာ စာသားရိုက်ထည့်ပါ။');
            }
        });
    }

    // ဆက်သွယ်ရန် button
    const contactBtn = document.getElementById('contactBusinessBtn');
    if (contactBtn) {
        contactBtn.addEventListener('click', function() {
            alert('ဆက်သွယ်ရန်: ၀၉-၄၅၈၄၃၄၃၉၈');
        });
    }
});
```javascript
// မြစ်ကြီးနားမြို့ရဲ့ ကိုဩဒိနိတ်
const myitkyinaCenter = [25.3833, 97.3833];

// စာမျက်နှာပေါ်လာတာနဲ့ မြေပုံစတင်မယ်
window.addEventListener('load', function() {
    // မြေပုံအတွက် နေရာရှိမရှိစစ်ပါ
    const mapDiv = document.getElementById('map');
    if (!mapDiv) {
        alert('မြေပုံအတွက် နေရာမတွေ့ပါ');
        return;

    }

    try {
        // မြေပုံဖန်တီးခြင်း
        const map = L.map('map').setView(myitkyinaCenter, 13);

        // OpenStreetMap layer ထည့်ခြင်း
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // မြို့လယ်မှာ Marker ချခြင်း
        L.marker(myitkyinaCenter).addTo(map)
            .bindPopup('မြစ်ကြီးနားမြို့');

        console.log('မြေပုံအောင်မြင်စွာဖော်ပြပြီး');
    } catch(error) {

        console.error('အမှားရှိနေသည်:', error);
        alert('မြေပုံဖော်ပြရာတွင် အမှားရှိနေသည်။ Console ကိုစစ်ပါ။');
    }
});
```

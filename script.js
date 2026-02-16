```javascript
// မြစ်ကြီးနားမြို့ရဲ့ ကိုဩဒိနိတ်
const MYITKYINA_CENTER = [25.3833, 97.3833];

// စာမျက်နှာပေါ်လာတာနဲ့ မြေပုံစတင်မယ်
window.addEventListener('load', function() {
    try {
        // မြေပုံဖန်တီးခြင်း
        const map = L.map('map').setView(MYITKYINA_CENTER, 13);

        // OpenStreetMap layer ထည့်ခြင်း
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {

            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // မြို့လယ်မှာ Marker ချခြင်း
        L.marker(MYITKYINA_CENTER).addTo(map)
            .bindPopup('မြစ်ကြီးနားမြို့');
            
        console.log('မြေပုံအောင်မြင်စွာဖော်ပြပြီး');
    } catch(error) {
        console.error('မြေပုံဖော်ပြရာတွင် အမှားရှိနေသည်:', error);
    }
});
```

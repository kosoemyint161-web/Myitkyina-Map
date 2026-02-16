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
// ဆက်သွယ်ရန် button
document.addEventListener('DOMContentLoaded', function() {
    const contactBtn = document.getElementById('contactBusinessBtn');
    if (contactBtn) {
        contactBtn.addEventListener('click', function() {
            const message = 'ကိုယ့်လုပ်ငန်းကို မြေပုံပေါ်တင်လိုပါက ကျေးဇူးပြု၍ ဆက်သွယ်ပါ။\n\n' +
                           '📞 ဖုန်း: ၀၉-၂၆၇၂၉၈၅၈၄\n' +
                           '✉️ Email: info@myitkyinamap.com\n' +
                           '📱 Facebook: Myitkyina Map\n\n' +
                           'ကျေးဇူးတင်ပါသည်။';
            alert(message);
        });
    }
});
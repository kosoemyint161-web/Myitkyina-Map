// ၁။ Google Sheet CSV Link
const sheetUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSiAnasNC6vLjb4lChJ5Vzj_GLcRKGBx8q-22DUsqCeuzCzfdNxG821SfCnWnaA83-q2AdeqTiJLu0n/pub?output=csv";

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
  // လိုအပ်သော မြို့နယ်များ ထပ်ထည့်နိုင်သည်
};

// ၃။ Map Initialize
const map = L.map('map').setView(TOWNSHIPS.myitkyina, 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let locations = [];

// ၄။ Papa.parse ကို သုံးပြီး ဒေတာဖတ်ခြင်း (ဒီအပိုင်းကို ပြင်လိုက်တာပါ)
function loadDataFromSheet() {
  Papa.parse(sheetUrl, {
    download: true,
    header: true, // ဇယားထိပ်ဆုံးက name, lat, lng စတာတွေကို သုံးဖို့ true ထားရမည်
    skipEmptyLines: true,
    complete: function(results) {
      const data = results.data;
      const dataList = document.getElementById('locationList');
      dataList.innerHTML = ''; // အဟောင်းများကို ရှင်းထုတ်ရန်

      data.forEach(row => {
        // ဇယားထဲက header အမည်များအတိုင်း ဆွဲထုတ်ခြင်း
        const name = (row.name || '').trim();
        const lat = parseFloat(row.lat);
        const lng = parseFloat(row.lng);
        const phone = (row.phone || 'မရှိပါ').trim();

        if (!isNaN(lat) && !isNaN(lng) && name) {
          // မြေပုံပေါ်တွင် Marker ချခြင်း
          L.marker([lat, lng]).addTo(map)
            .bindPopup(`<b>${name}</b><br>📞 ${phone}`);

          // ရှာဖွေမှုစာရင်း (Autocomplete) ထဲသို့ ထည့်ခြင်း
          const option = document.createElement('option');
          option.value = name;
          dataList.appendChild(option);

          // ဒေတာသိမ်းဆည်းခြင်း
          locations.push({ name, lat, lng, phone });
        }
      });
      console.log("ဒေတာများ အောင်မြင်စွာ ရောက်ရှိလာပါပြီ။ စုစုပေါင်း:", locations.length);
    },
    error: function(err) {
      console.error("CSV ဖတ်ရာတွင် အမှားရှိနေပါသည်:", err);
    }
  });
}

// ၅။ ရှာဖွေခြင်း Logic
document.getElementById('searchBtn').addEventListener('click', () => {
  const q = document.getElementById('searchInput').value.trim().toLowerCase();
  // တစ်စိတ်တစ်ပိုင်းတူရုံဖြင့် ရှာပေးသော Logic
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

// ၆။ မြို့နယ်ရွေးချယ်ခြင်း
document.getElementById('townshipSelect').addEventListener('change', (e) => {
  const key = e.target.value.toLowerCase();
  if (TOWNSHIPS[key]) {
    map.setView(TOWNSHIPS[key], 13);
  }
});

// ဒေတာကို စတင် Load လုပ်ရန် ခေါ်ယူခြင်း
loadDataFromSheet();
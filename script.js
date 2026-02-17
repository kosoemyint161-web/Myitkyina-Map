// မြို့နယ်များ၏ တည်နေရာများ
const TOWNSHIPS = {
    myitkyina: [25.3833, 97.3833],
    waingmaw: [25.3562, 97.4332],
    mogaung: [25.3045, 96.9408],
    bhamo: [24.2647, 97.2346],
    putao: [27.3291, 97.4042]
};

let map = L.map('map').setView(TOWNSHIPS.myitkyina, 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// မြို့နယ်ရွေးချယ်မှု ပြောင်းလဲခြင်း
document.getElementById('townshipSelect').addEventListener('change', function(e) {
    const coords = TOWNSHIPS[e.target.value];
    map.flyTo(coords, 14); // မြေပုံကို အလိုလို ရွှေ့ပေးမည်
    L.marker(coords).addTo(map).bindPopup(e.target.options[e.target.selectedIndex].text).openPopup();
});

// Category Filter Logic
const buttons = document.querySelectorAll('.category-btn');
buttons.forEach(btn => {
    btn.addEventListener('click', function() {
        buttons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        console.log("Filtering: " + this.dataset.category);
    });
});

// Contact Button
document.getElementById('contactBusinessBtn').addEventListener('click', () => {
    window.location.href = "tel:09267298584";
});
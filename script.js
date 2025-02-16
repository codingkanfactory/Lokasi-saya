import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDMcax3DSMbwCdf6ilMStGr7-wL3GVf8-Q",
    authDomain: "codingkan.firebaseapp.com",
    databaseURL: "https://codingkan-default-rtdb.firebaseio.com",
    projectId: "codingkan",
    storageBucket: "codingkan.firebasestorage.app",
    messagingSenderId: "753036437410",
    appId: "1:753036437410:web:babfafdcad76fd566234fb"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Fungsi untuk mendapatkan atau membuat ID perangkat
function getDeviceId() {
    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
        deviceId = "device-" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("deviceId", deviceId);
    }
    return deviceId;
}

// Fungsi ketika tombol "Mulai" ditekan
window.mulaiAplikasi = function () {
    const deviceId = getDeviceId();

    // Simpan ID perangkat ke Firebase
    const deviceRef = ref(db, "devices");
    const newDeviceRef = push(deviceRef);
    set(newDeviceRef, { deviceId, timestamp: new Date().toISOString() })
        .then(() => {
            document.getElementById("intro").style.display = "none";
            document.getElementById("lokasi").style.display = "block";
        })
        .catch(error => console.error("Error:", error));
};

// Fungsi untuk melacak lokasi
window.lacakLokasi = function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const timestamp = new Date().toISOString();
                const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
                const deviceId = getDeviceId();

                // Simpan ke Firebase
                const lokasiRef = ref(db, "lokasi");
                const newLokasiRef = push(lokasiRef);
                set(newLokasiRef, { deviceId, latitude, longitude, timestamp, mapsLink })
                    .then(() => M.toast({ html: "Lokasi berhasil dikirim!" }))
                    .catch(error => console.error("Error:", error));

                document.getElementById("hasil").innerHTML = `
                    <p><b>Latitude:</b> ${latitude}</p>
                    <p><b>Longitude:</b> ${longitude}</p>
                    <p><b>Google Maps:</b> <a href="${mapsLink}" target="_blank" onclick="kirimDeviceId('${deviceId}')">Lihat Lokasi</a></p>
                `;
            },
            (error) => {
                M.toast({ html: "Gagal mengambil lokasi! Izinkan akses lokasi." });
                console.error("Error mendapatkan lokasi:", error);
            }
        );
    } else {
        M.toast({ html: "Browser tidak mendukung Geolocation!" });
    }
};

// Fungsi untuk mengirim ID perangkat saat link Maps diklik
window.kirimDeviceId = function (deviceId) {
    const clickRef = ref(db, "klik-lokasi");
    const newClickRef = push(clickRef);
    set(newClickRef, { deviceId, timestamp: new Date().toISOString() })
        .then(() => console.log("ID perangkat dikirim saat klik link"))
        .catch(error => console.error("Error:", error));
};

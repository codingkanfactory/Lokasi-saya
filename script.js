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

window.lacakLokasi = function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const timestamp = new Date().toISOString();
                const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

                // Simpan ke Firebase
                const lokasiRef = ref(db, "lokasi");
                const newLokasiRef = push(lokasiRef);
                set(newLokasiRef, { latitude, longitude, timestamp, mapsLink })
                    .then(() => M.toast({ html: "Lokasi berhasil dikirim!" }))
                    .catch(error => console.error("Error:", error));

                document.getElementById("hasil").innerHTML = `
                    <p><b>Latitude:</b> ${latitude}</p>
                    <p><b>Longitude:</b> ${longitude}</p>
                    <p><b>Google Maps:</b> <a href="${mapsLink}" target="_blank">Lihat Lokasi</a></p>
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

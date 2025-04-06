// File select & alert
document.querySelector(".neon-btn")?.addEventListener("click", () => {
  const file = document.getElementById("fileInput")?.files[0];
  if (!file) {
    alert("Please choose a file first!");
    return;
  }
  alert(`Ready to convert: ${file.name}`);
});

// Theme toggle
const themeToggle = document.getElementById("themeToggle");
const body = document.body;

function updateThemeIcon() {
  themeToggle.textContent = body.classList.contains("dark-mode") ? "Light Mode" : "Dark Mode";
}

themeToggle?.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  localStorage.setItem("theme", body.classList.contains("dark-mode") ? "dark" : "light");
  updateThemeIcon();
});

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  body.classList.add("dark-mode");
} else {
  body.classList.remove("dark-mode");
}
updateThemeIcon();

// Menu toggle
const menuToggle = document.querySelector(".menu-icon");
const menuDropdown = document.querySelector(".menu-dropdown");

menuToggle?.addEventListener("click", () => {
  menuDropdown?.classList.toggle("show");
});

document.addEventListener("click", (e) => {
  if (!menuDropdown?.contains(e.target) && !menuToggle?.contains(e.target)) {
    menuDropdown?.classList.remove("show");
  }
});

// PWA Install Prompt
let deferredPrompt;
const installBtn = document.getElementById("installPWA");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) installBtn.style.display = "block";
});

installBtn?.addEventListener("click", async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      console.log("User accepted the A2HS prompt");
    } else {
      console.log("User dismissed the A2HS prompt");
    }
    
    deferredPrompt = null;
  } else {
    alert("Install prompt not available.");
  }
});

// Register and manage Service Worker updates
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((reg) => {
        console.log("Service Worker Registered:", reg);
        
        // Auto-reload logic
        if (reg.waiting) {
          reg.waiting.postMessage("SKIP_WAITING");
        }
        
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          newWorker?.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              if (confirm("New update available! Reload now?")) {
                newWorker.postMessage("SKIP_WAITING");
              }
            }
          });
        });
      })
      .catch((err) => console.error("Service Worker Failed", err));
  });
  
  // Reload page when new SW takes control
  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}
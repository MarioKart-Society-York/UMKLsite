// Setup
const settingsBoxHTML = `
<div class="hidden BGBlur" id="BGBlur"></div>
<div class="hidden hide-settings-box" id="settingsBox" data-overlayscrollbars-initialize>
    <div class="settings-box-close-button">
        <button id="settings-box-close-button">Close</button>
    </div>
    <div class="settings-title">Settings</div>
    <div class="setting-options" id="settingsBoxJS">
        <div class="setting-sub-heading">Apperance</div><hr>
        Theme<button class="settings-option">Dark theme</button><br>
        Ambient Mode <button class="settings-option">OFF</button>
        <span class="settings-extra-info">(only available in dark theme)</span><br>
    </div>
</div>`;
document.body.insertAdjacentHTML('beforeend', settingsBoxHTML);

const BGBlur = document.getElementById('BGBlur');
const settingsBox = document.getElementById('settingsBox');
const settingsBoxJS = document.getElementById('settingsBoxJS');
let settingsOpen = false;

const toggleSettingsPanel = () => {
    BGBlur.classList.toggle("hidden");
    settingsBox.classList.toggle('hide-settings-box');
    if (settingsOpen) {

    } else {
        generateSettingsPanel();
        settingsBox.classList.remove('hidden');
        BGBlur.addEventListener("click", toggleSettingsPanel);
    }
    settingsOpen = !settingsOpen;
};

document.getElementById('settings-box-close-button').addEventListener('click', toggleSettingsPanel);
document.querySelectorAll('.settingsBoxOpener').forEach(opener => {
    opener.addEventListener('click', toggleSettingsPanel);
});

const meta = document.querySelector('meta[name="color-scheme"]');
const root = document.querySelector(":root");
let darkThemeEnabled;

// Panel
function generateSettingsPanel() {
    try {
        const localStorageData = Object.entries(localStorage).map(([key, value]) => {
            return `<b>${key}</b>: <span class="setting-selectable">${value}</span><br>`;
        }).join('');

        settingsBoxJS.innerHTML = `
        <div class="setting-sub-heading">Apperance</div><hr>
        Page Theme<button id="toggleTheme" class="settings-option">${localStorage.getItem("darktheme") == 1 ? "Dark" : "Light"} theme</button><br>

        <div class="setting-sub-heading">Localstorage<span class="settings-extra-info"> (data stored on your device)</span></div><hr>
        Clear settings<button id="clearLocalStorage" class="settings-option">Clear</button>
        <span class="settings-extra-info"> (this will reload the page)</span></div><br>
        <div class="codeBoxTight">${localStorageData || "No data stored"}</div>
        
        <div class="setting-sub-heading">Debug info<span class="settings-extra-info"> (for developers!)</span></div><hr>
        <div class="codeBoxTight">${navigator.userAgent}</div>
        `;
    } catch (error) {
        settingsBoxJS.innerHTML = `<br>Failed to load settings<br><code>${error}</code>`;
    }
    generateEventListeners();
};
generateSettingsPanel();

function toggleTheme() {
    darkThemeEnabled = darkThemeEnabled ? 0 : 1;
    meta.content = darkThemeEnabled ? "dark" : "light";

    if (darkThemeEnabled) {
        console.debug(`%csettings.js %c> %cChanging to dark theme`, "color:#ff4576", "color:#fff", "color:#ff9eb8")
        root.classList.add("dark-theme");
        root.classList.remove("light-theme");
    } else {
        console.debug(`%csettings.js %c> %cChanging to light theme`, "color:#ff4576", "color:#fff", "color:#ff9eb8");
        root.classList.add("light-theme");
        root.classList.remove("dark-theme");
    }
    localStorage.setItem("darktheme", darkThemeEnabled ? 1 : 0);
    sendThemeChangeEvent();
    generateSettingsPanel();
}

function sendThemeChangeEvent() {
    document.dispatchEvent(new CustomEvent('themeChange', { detail: { darkThemeEnabled } }));
}

function clearLocalStorage() {
    localStorage.clear();
    window.location.reload();
}

function generateEventListeners() {
    document.getElementById('toggleTheme').addEventListener('click', toggleTheme);
    document.getElementById('clearLocalStorage').addEventListener('click', clearLocalStorage);
}

function checkThemeAfterLoaded() {
    darkThemeEnabled = parseInt(localStorage.getItem("darktheme"));
    sendThemeChangeEvent();
}
checkThemeAfterLoaded();

// keyboard shortcuts
document.addEventListener('keydown', (event) => {
    if (event.key === 'i') {
        toggleTheme();
    }
});

// TODO: make a better easter egg
let code = ""; document.addEventListener("keydown", (s => { code += s.key.toLowerCase(), code.endsWith("fib") ? (doEEASCII(), code = "") : "fib".startsWith(code) || (code = "") }));
function doEEASCII() {
    console.debug(``);
}
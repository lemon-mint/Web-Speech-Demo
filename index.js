function toBinary(string) {
    const codeUnits = new Uint16Array(string.length);
    for (let i = 0; i < codeUnits.length; i++) {
        codeUnits[i] = string.charCodeAt(i);
    }
    return btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)));
}

function fromBinary(encoded) {
    binary = atob(encoded)
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return String.fromCharCode(...new Uint16Array(bytes.buffer));
}

function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

function getVoice() {
    return new Promise((resolve, reject) => {
        const retry = () => {
            const vs = speechSynthesis.getVoices();
            if (vs.length > 0) {
                resolve(vs);
            } else {
                setTimeout(retry, 100);
            }
        };
        retry();
    });
}

async function getLangVoices(lang) {
    const voices = await getVoice();
    let langs = [];

    voices.forEach(v => {
        if (lang === v.lang) {
            langs.push(v);
            console.log(v);
        }
    });
    return langs;
}

function getData() {
    const hash = String(window.location.hash).substring(1);
    return JSON.parse(fromBinary(hash));
}

async function play(lang, str) {
    const Utterance = new SpeechSynthesisUtterance(str);
    const langvoices = await getLangVoices(lang);
    if (langvoices.length > 0) {
        Utterance.voice = langvoices[0];
    }
    speechSynthesis.speak(Utterance);
    return 0;
}


const runpage = debounce(async () => {
    const pagedata = getData();
    if (pagedata.lang && pagedata.text) {
        once = false;
        await play(pagedata.lang, pagedata.text);
    }
});

window.ontouchstart = runpage;
window.onclick = runpage;
window.onclose = runpage;
window.onmousemove = runpage;
window.onmouseenter = runpage;
window.onmouseleave = runpage;
window.ondrag = runpage;

(async () => {
    runpage();
})();

function makeData(lang, text) {
    return toBinary(JSON.stringify({ lang: lang, text: text }));
}

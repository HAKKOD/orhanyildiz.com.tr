const yuklenenSayfalar = [];
function sayfayiAc(yuklenecekURL, sekmeninBasligi, gecmiseKaydedilsinmi = true) {
    let sayfaID = [];
    for (var x1 = 0; x1 < yuklenecekURL.length; x1++) {
        if ((yuklenecekURL[x1].charCodeAt() >= 48 && yuklenecekURL[x1].charCodeAt() <= 57) ||
            (yuklenecekURL[x1].charCodeAt() >= 65 && yuklenecekURL[x1].charCodeAt() <= 90) ||
            (yuklenecekURL[x1].charCodeAt() >= 97 && yuklenecekURL[x1].charCodeAt() <= 122)) {
            sayfaID.push(yuklenecekURL[x1]);
        } else {
            sayfaID.push(yuklenecekURL[x1].charCodeAt());
        }
    }
    sayfaID = "tsm-" + sayfaID.toString().replace(/,/g, "");
    let sayfaOncedenYuklenmismi = false;
    for (let x1 = 0; x1 < yuklenenSayfalar.length; x1++) {
        if (sayfaID == yuklenenSayfalar[x1]) {
            sayfaOncedenYuklenmismi = true;
        }
    }
    if (!sayfaOncedenYuklenmismi) {
        yuklenenSayfalar.push(sayfaID);
        yuklenecekURL += "?x=" + new Date().getTime()
        document.title = sekmeninBasligi;
        fetch(yuklenecekURL, { method: 'GET' })
            .then((istek) => istek.text())
            .then((veriler) => {
                const kodlar = new DOMParser().parseFromString(new DOMParser().parseFromString(veriler, "text/html").body.innerHTML, "text/html");
                let htmlKodlari = "", javaScriptKodlari = "";
                if (kodlar.getElementById("tsm-html-kodlari") != null)
                    htmlKodlari = kodlar.getElementById("tsm-html-kodlari").innerHTML;
                if (kodlar.getElementById("tsm-javascript-kodlari") != null)
                    javaScriptKodlari = kodlar.getElementById("tsm-javascript-kodlari").innerHTML;
                const sayfa = document.createElement("div");
                sayfa.id = sayfaID;
                sayfa.setAttribute("name", "tek-sayfalik-model");
                document.getElementById("tek-sayfalik-model").appendChild(sayfa);
                document.getElementById(sayfaID).innerHTML = htmlKodlari;
                eval(javaScriptKodlari)
            })
            .catch((hata) => {
                console.error('Hata:', hata);
            });
    } else {
        document.title = sekmeninBasligi;
    }
    for (let x1 = 0; x1 < document.getElementsByName("tek-sayfalik-model").length; x1++) {
        document.getElementsByName("tek-sayfalik-model")[x1].hidden = true;
    }
    if (document.getElementById(sayfaID) != null)
        document.getElementById(sayfaID).hidden = false;
    if (gecmiseKaydedilsinmi && (history.state == null || history.state.yuklenecekURL != yuklenecekURL.split("?x=")[0])) {
        window.history.pushState({ "sekmeninBasligi": sekmeninBasligi, "yuklenecekURL": yuklenecekURL.split("?x=")[0] }, "", yuklenecekURL.split("?x=")[0]);
        window.scrollTo(0, 0);
    }
}
window.onpopstate = function (e) {
    if (e.state) {
        sayfayiAc(e.state.yuklenecekURL, e.state.sekmeninBasligi, false);
    }
};

if (sessionStorage.getItem("tsmURL") != null && sessionStorage.getItem("tsmSekmeBasligi") != null) {
    sayfayiAc(sessionStorage.getItem("tsmURL"), sessionStorage.getItem("tsmSekmeBasligi"));
    sessionStorage.removeItem("tsmURL");
    sessionStorage.removeItem("tsmSekmeBasligi");
} else {
    sayfayiAc(localStorage.getItem("tsmAnasayfaURL"), localStorage.getItem("tsmAnasayfaSekmeBasligi"));
}

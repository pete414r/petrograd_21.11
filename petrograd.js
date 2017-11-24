window.addEventListener("load", sidenVises);


var udenAllergener = false;


var vegetaregnet_filtrer = false;


var påLager = false;


var rabat = false;


var sorterEfter = "navn";


var sorterReverse = false;


function sidenVises() {
    console.log("siden vises");


    /**** LÆSER PRODUKTLISTE ****/
    $.getJSON("http://petlatkea.dk/2017/dui/api/productlist?callback=?", visProduktliste)
}


function hentSpecifikData(inputProduct) {
    $.getJSON("http://petlatkea.dk/2017/dui/api/product?callback=?&id=" + inputProduct.id, visProdukt)
}


/**** LÆSER JSON-FIL OG KALDER visProdukt PÅ ALLE PRODUKTER ****/
function visProduktliste(listen) {
    console.table(listen);


    /**** SORTERER PRODUKTLISTEN ****/
    if (sorterReverse) {
        listen.sort(sorterProdukter(sorterEfter)).reverse();
    } else {
        listen.sort(sorterProdukter(sorterEfter));
    }


    /**** HENTER AL DATA OM ÉT SPECIFIKT PRODUKT ****/
    listen.forEach(hentSpecifikData);
}


/**** INDHENTER DATA FRA visProduktliste ****/
function visProdukt(produkt) {
    console.log(produkt);


    /**** KLON PRODUKT_TEMPLATE ****/
    var klon = document.querySelector("#produkt_template").content.cloneNode(true);


    /**** INDSÆTTER DATA I KLON I .ret ****/
    klon.querySelector(".data_navn").innerHTML = produkt.navn;
    klon.querySelector(".data_kort_beskrivelse").innerHTML = produkt.kortbeskrivelse;
    klon.querySelector(".data_allergener").innerHTML = produkt.allergener;
    klon.querySelector(".data_pris").innerHTML = produkt.pris;


    /**** INDSÆTTER DATA I KLON I MODAL ****/
    klon.querySelector(".modal_overskrift").innerHTML = produkt.navn;
    klon.querySelector(".modal_lang_beskrivelse").innerHTML = produkt.langbeskrivelse;
    klon.querySelector(".modal_allergener").innerHTML = produkt.allergener;
    klon.querySelector(".modal_data_pris").innerHTML = produkt.pris;


    /**** SE DETALJER-KNAP ****/
    klon.getElementById("modal_menukort").setAttribute("id", "modal_menukort_" + produkt.id);
    klon.getElementById("se_detaljer_knap").setAttribute("data-target", "#modal_menukort_" + produkt.id);


    /**** HENTER KORT BESKRIVELSE IND I MODAL, HVIS LANG BESKRIVELSE IKKE ER I DATA HOS SPECIFIKT PRODUKT ****/
    if (produkt.langbeskrivelse == "") {
        klon.querySelector(".modal_lang_beskrivelse").innerHTML = produkt.kortbeskrivelse;
    }


    /**** RABAT-BEREGNING I .ret ****/
    var rabatpris = Math.ceil(produkt.pris - (produkt.pris * produkt.rabatsats / 100));
    klon.querySelector(".data_rabatpris").innerHTML = rabatpris;


    /**** RABAT-BEREGNING I MODAL ****/
    var rabatpris = Math.ceil(produkt.pris - (produkt.pris * produkt.rabatsats / 100));
    klon.querySelector(".modal_data_rabatpris").innerHTML = rabatpris;


    /**** BILLEDER ****/
    klon.querySelector(".data_billede").src = "./Billeder/imgs/Large/" + produkt.billede + ".jpg";


    /**** ALLERGENER I .ret ****/
    if (produkt.allergener == false) {
        var allergener = klon.querySelector(".allergener_tekst");
        allergener.parentNode.removeChild(allergener);
    } else {
        klon.querySelector(".data_allergener").innerHTML = produkt.allergener;
    }


    /**** ALLERGENER I MODAL ****/
    if (produkt.allergener == false) {
        var allergener = klon.querySelector(".modal_allergener_tekst");
        allergener.parentNode.removeChild(allergener);
    } else {
        klon.querySelector(".modal_allergener").innerHTML = produkt.allergener;
    }


    /**** VEGETAR I .ret ****/
    if (produkt.vegetar == false) {
        var vegetaregnet = klon.querySelector(".vegetaregnet_tekst");
        vegetaregnet.parentNode.removeChild(vegetaregnet);
    } else {
        var ikke_vegetaregnet = klon.querySelector(".ikke_vegetaregnet_tekst");
        ikke_vegetaregnet.parentNode.removeChild(ikke_vegetaregnet);
    }


    /**** VEGETAR I MODAL ****/
    if (produkt.vegetar == false) {
        var vegetaregnet = klon.querySelector(".modal_vegetaregnet_tekst");
        vegetaregnet.parentNode.removeChild(vegetaregnet);
    } else {
        var ikke_vegetaregnet = klon.querySelector(".modal_ikke_vegetaregnet_tekst");
        ikke_vegetaregnet.parentNode.removeChild(ikke_vegetaregnet);
    }


    /**** UDSOLGT I .ret ****/
    if (produkt.udsolgt == false) {
        //produktet er ikke udsolge
        //udsolgt_tekst skal fjernes
        var udsolgt_tekst = klon.querySelector(".udsolgt_tekst");
        udsolgt_tekst.parentNode.removeChild(udsolgt_tekst);
    } else {
        klon.querySelector(".pris").classList.add("udsolgt");
    }


    /**** UDSOLGT I MODAL ****/
    if (produkt.udsolgt == false) {
        //produktet er ikke udsolge
        //udsolgt_tekst skal fjernes
        var modal_udsolgt_tekst = klon.querySelector(".modal_udsolgt_tekst");
        modal_udsolgt_tekst.parentNode.removeChild(modal_udsolgt_tekst);
    } else {
        klon.querySelector(".modal_pris").classList.add("udsolgt");
    }


    /**** RABAT i .ret ****/
    if (produkt.udsolgt == true || produkt.rabatsats == 0) {
        //der er ikke rabat. Rabatprisen skal fjernes
        var rabatpris = klon.querySelector(".rabatpris");
        rabatpris.parentNode.removeChild(rabatpris);
    } else {
        klon.querySelector(".pris").classList.add("rabat");
    }


    /**** RABAT I MODAL ****/
    if (produkt.udsolgt == true || produkt.rabatsats == 0) {
        //der er ikke rabat. Rabatprisen skal fjernes
        var modal_rabatpris = klon.querySelector(".modal_rabatpris");
        modal_rabatpris.parentNode.removeChild(modal_rabatpris);
    } else {
        klon.querySelector(".modal_pris").classList.add("rabat");
    }


    var visMåskeProdukt = true;


    /**** FILTRERER PRODUKTER MED ALLERGENER FRA ****/
    if (udenAllergener) {
        visMåskeProdukt = visMåskeProdukt && produkt.allergener == "";
    }


    /**** FILTRERER IKKE VEGETAREGNEDE PRODUKTER FRA ****/
    if (vegetaregnet_filtrer) {
        visMåskeProdukt = visMåskeProdukt && produkt.vegetar;
    }


    /**** FILTRERER UDSOLGTE PRODUKTER FRA ****/
    if (påLager) {
        visMåskeProdukt = visMåskeProdukt && !produkt.udsolgt;
    }


    /**** FILTRERER PRODUKTER UDEN RABAT FRA ****/
    if (rabat) {
        visMåskeProdukt = visMåskeProdukt && produkt.rabatsats != 0;
    }


    /**** TILFØJER klon TIL KATEGORI ****/
    if (visMåskeProdukt) {
        document.querySelector("." + produkt.kategori).appendChild(klon);
    }
}


/**** SORTERER PRODUKTER ALFABETISK EFTER NAVN ****/
function sorterProdukter(prop) {
    return function (a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        } else if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;
    }
}


/**** FJERNER ALLE PRODUKTER FRA SIDEN ****/
function fjernProdukter() {
    document.querySelector(".drikkevarer").innerHTML = "<div id='drikkevarer' class='col-xs-12 col-sm-8 col-sm-offset-2'><h2>Drikkevarer</h2></div>";

    document.querySelector(".forretter").innerHTML = "<div id='forretter' class='col-xs-12 col-sm-8 col-sm-offset-2'><h2>Forretter</h2></div>";

    document.querySelector(".hovedretter").innerHTML = "<div id='hovedretter' class='col-xs-12 col-sm-8 col-sm-offset-2'><h2>Hovedretter</h2></div>";

    document.querySelector(".sideorders").innerHTML = "<div id='sideorders' class='col-xs-12 col-sm-8 col-sm-offset-2'><h2>Sideorders</h2></div>";

    document.querySelector(".desserter").innerHTML = "<div id='desserter' class='col-xs-12 col-sm-8 col-sm-offset-2'><h2>Desserter</h2></div>";
}


/**** VISER PRODUKTER UDEN ALLERGENER ****/
document.getElementById("uden_allergener").onclick = function () {
    fjernProdukter();
    udenAllergener = !udenAllergener;
    sidenVises();
}


/**** VISER VEGETAREGNEDE PRODUKTER ****/
document.getElementById("vegetaregnet").onclick = function () {
    fjernProdukter();
    vegetaregnet_filtrer = !vegetaregnet_filtrer;
    sidenVises();
}


/**** VISER PRODUKTER PÅ LAGER ****/
document.getElementById("på_lager").onclick = function () {
    fjernProdukter();
    påLager = !påLager;
    sidenVises();
}


/**** VISER PRODUKTER MED RABAT ****/
document.getElementById("rabat_filtrer").onclick = function () {
    fjernProdukter();
    rabat = !rabat;
    sidenVises();
}


/**** NULSTILLER SORTERING ****/
document.getElementById("sorter_efter").onclick = function () {
    sorterEfter = "navn";
    fjernProdukter();
    sorterReverse = false;
    sidenVises();
    document.getElementById("sorteringsknap_tekst").innerHTML = "Sorter efter <span class='caret'></span>";
}


/**** SORTERER EFTER PRIS STIGENDE ****/
document.getElementById("pris_stigende").onclick = function () {
    sorterEfter = "pris";
    fjernProdukter();
    sorterReverse = false;
    sidenVises();
    document.getElementById("sorteringsknap_tekst").innerHTML = "Pris stigende <span class='caret'></span>";
}


/**** SORTERER EFTER PRIS FALDENDE ****/
document.getElementById("pris_faldende").onclick = function () {
    sorterEfter = "pris";
    fjernProdukter();
    sorterReverse = true;
    sidenVises();
    document.getElementById("sorteringsknap_tekst").innerHTML = "Pris faldende <span class='caret'></span>";
}


/**** SORTERER EFTER RABAT ****/
document.getElementById("rabat").onclick = function () {
    sorterEfter = "rabatsats";
    fjernProdukter();
    sorterReverse = true;
    sidenVises();
    document.getElementById("sorteringsknap_tekst").innerHTML = "Rabat <span class='caret'></span>";
}


/**** SORTERER ALFABETISK EFTER NAVN ****/
document.getElementById("navn").onclick = function () {
    sorterEfter = "navn";
    fjernProdukter();
    sorterReverse = false;
    sidenVises();
    document.getElementById("sorteringsknap_tekst").innerHTML = "Navn (a-å) <span class='caret'></span>";
}

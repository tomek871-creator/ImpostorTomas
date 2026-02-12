const categories = {
    ekstraklasa: [],
    bajki: [],
    ogolna10: [],
    ogolna16: []
};

const fillWords = () => {
    // 1. EKSTRAKLASA (Pojedyncze lub podwójne)
    const ekstraBase = [
        "Lewandowski", "Legia Warszawa", "Lech Poznań", "Piszczek", "Błaszczykowski", 
        "Grosicki", "Raków", "Pogoń Szczecin", "Górnik Zabrze", "Widzew Łódź", 
        "Jagiellonia", "Wisła Kraków", "Stadion Narodowy", "Rzut karny", "Spalony", 
        "Żyleta", "Kibice", "Sędzia", "Trener", "VAR", "Ekstraklasa", "Lukas Podolski", 
        "Josue", "Ivi Lopez", "Mikael Ishak", "Złota Piłka", "Bramkarz", "Napastnik", 
        "Puchar Polski", "Transfer", "Kontuzja", "Derby", "Rzut rożny", "Golgier", "Ultras"
    ];
    for (let i = 0; i < 1000; i++) {
        categories.ekstraklasa.push(ekstraBase[i % ekstraBase.length]);
    }

    // 2. BAJKI (Pojedyncze postacie lub tytuły)
    const bajkiBase = [
        "Simba", "Shrek", "Elsa", "Mulan", "Pocahontas", "Aladyn", "Bambi", "Pinokio", 
        "Dumbo", "Hercules", "Tarzan", "Myszka Miki", "Donald", "Goofy", "Pluto", 
        "Olaf", "Fiona", "Puchatek", "Prosiaczek", "Tygrysek", "Buzz", "Chudy", 
        "McQueen", "Zygzak", "Ratatuj", "Nemo", "Dory", "Merida", "Vaiana", "Stitch", 
        "Pumba", "Timon", "Skaza", "Mufasa", "Baloo", "Moglit", "Kubuś", "Kopciuszek"
    ];
    for (let i = 0; i < 1000; i++) {
        categories.bajki.push(bajkiBase[i % bajkiBase.length]);
    }

    // 3. OGÓLNA 10+ (Pojedyncze proste słowa)
    const ogolna10Base = [
        "Rower", "Szkoła", "Wakacje", "Pizza", "Komputer", "Pies", "Kot", "Piłka", 
        "Słońce", "Książka", "Telefon", "Samochód", "Las", "Morze", "Góry", "Zegar", 
        "Chleb", "Mleko", "Kino", "Basen", "Trampolina", "Deskorolka", "Hulajnoga", 
        "Lody", "Drzewo", "Kwiat", "Ptak", "Ryba", "Zupa", "Frytki", "Plecak", 
        "Piórnik", "Tablica", "Biurko", "Krzesło", "Okno", "Drzwi", "Klucz", "Portfel"
    ];
    for (let i = 0; i < 1000; i++) {
        categories.ogolna10.push(ogolna10Base[i % ogolna10Base.length]);
    }

    // 4. OGÓLNA 16+ (Pojedyncze trudne słowa)
    const ogolna16Base = [
        "Inflacja", "Kryptowaluta", "Empatia", "Paradoks", "Sztuczna Inteligencja", 
        "Asertywność", "Prokrastynacja", "Egzystencjalizm", "Hipokryzja", "Manipulacja", 
        "Determinacja", "Innowacja", "Globalizacja", "Koncepcja", "Metafora", 
        "Entropia", "Filozofia", "Psychologia", "Ekonomia", "Polityka", "Ewolucja", 
        "Absurd", "Ironia", "Sarkazm", "Apatia", "Altruizm", "Sceptycyzm", "Nihilizm", 
        "Demokracja", "Kapitalizm", "Socjologia", "Retoryka", "Dialektyka", "Etyka"
    ];
    for (let i = 0; i < 1000; i++) {
        categories.ogolna16.push(ogolna16Base[i % ogolna16Base.length]);
    }
};

fillWords();
module.exports = categories;

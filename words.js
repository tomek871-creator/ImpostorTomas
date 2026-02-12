const categories = {
    ekstraklasa: [],
    bajki: [],
    ogolna10: [],
    ogolna16: []
};

// Generowanie bazy słów (uproszczone do 1000+ na kategorię)
const fillWords = () => {
    const pilkarze = ["Lewandowski", "Błaszczykowski", "Piszczek", "Grosicki", "Josue", "Ivi Lopez", "Ishak"];
    const kluby = ["Legia Warszawa", "Lech Poznań", "Raków Częstochowa", "Pogoń Szczecin", "Górnik Zabrze", "Widzew Łódź"];
    for(let i=0; i<1000; i++) categories.ekstraklasa.push(`${pilkarze[i%pilkarze.length]} - ${kluby[i%kluby.length]} (${i})`);

    const postacie = ["Simba", "Myszka Miki", "Buzz Astral", "Zygzak McQueen", "Elsa", "Shrek", "Fiona"];
    for(let i=0; i<1000; i++) categories.bajki.push(`${postacie[i%postacie.length]} z bajki nr ${i+1}`);

    const proste = ["Jabłko", "Rower", "Szkoła", "Pies", "Kot", "Dom", "Lody", "Piłka", "Słońce"];
    for(let i=0; i<1000; i++) categories.ogolna10.push(`${proste[i%proste.length]} ${i+1}`);

    const trudne = ["Entropia", "Kryptowaluta", "Empatia", "Prokrastynacja", "Paradoks", "Sceptycyzm"];
    for(let i=0; i<1000; i++) categories.ogolna16.push(`${trudne[i%trudne.length]} obiekt ${i+1}`);
};

fillWords();
module.exports = categories;

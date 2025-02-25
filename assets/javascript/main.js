let mots = ["javascript", "developpeur", "constitution", "parole", "coloration"];
let motADeviner;
let motCache;
let lettresProposees = [];
let erreurs = 0;
let maxErreurs = 6;

const bgMusic = new Audio('./assets/audio/hangmanbg.mp3');
bgMusic.loop = true;

//Initialiser le jeu en prenant un mot aléatoire, le cacher par des underscore et def de variables
function init() {
    motADeviner = mots[Math.floor(Math.random() * mots.length)];
    motCache = "_ ".repeat(motADeviner.length).trim(); //
    lettresProposees = [];
    erreurs = 0;
    document.querySelector("#motCache").innerText = motCache;
    document.querySelector("#lettresProposees").innerText = "";
    document.querySelector("#messageFin").innerText = "";
    document.querySelector("#rejouer").style.display = "none";
    document.querySelector("#erreursRestantes").innerText = `Erreurs restantes : ${maxErreurs - erreurs}`;
    displayKeyboard();
}

function demarrer() {
    document.querySelector("#demarrer").style.display = "none";
    document.querySelector("#jeu").style.display = "block";
    bgMusic.play();
    init();
}
// Deroulement du jeu, boucle for pour les lettres et boutons cliqués, ces derniers s'afficheront en vert ou rouge selon correct ou incorrect
function proposerLettre(lettre, button) {
    if (lettre && !lettresProposees.includes(lettre)) {
        lettresProposees.push(lettre);
        if (motADeviner.includes(lettre)) {
            let newMotCache = '';
            for (let i = 0; i < motADeviner.length; i++) {
                if (motADeviner[i] === lettre) {
                    newMotCache += lettre + ' ';
                } else {
                    newMotCache += motCache[2 * i] + ' ';
                }
            }
            motCache = newMotCache.trim(); // supprime les espaces blancs au début et à la fin de la chaine
            document.querySelector("#motCache").innerText = motCache;
            button.classList.add('correct');
            button.style.backgroundColor = 'green';  // Couleur verte pour la bonne réponse
            if (motCache.replace(/ /g, '') === motADeviner) {    // utilise une expression régulière pour remplacer tous les espaces (' ') dans motCache par une chaîne vide (''). Le g dans / /g signifie "global", donc tous les espaces dans motCache seront remplacés, pas seulement le premier.
                document.querySelector("#messageFin").innerText = "Bravo ! Vous avez gagné !";
                document.querySelector("#rejouer").style.display = "block";
            }
        } else {
            erreurs++;
            button.classList.add('incorrect');
            button.style.backgroundColor = 'red';  // Couleur rouge pour la mauvaise réponse
            document.querySelector("#erreursRestantes").innerText = `Erreurs restantes : ${maxErreurs - erreurs}`;
            if (erreurs < maxErreurs) {
                document.querySelectorAll('.part')[erreurs -1].classList.add('show')
            }
            if (erreurs === maxErreurs) {
                document.querySelector("#messageFin").innerText = `Dommage ! Le mot était "${motADeviner}".`;
                document.querySelector("#rejouer").style.display = "block";
            }
        }
        button.classList.add('disabled');
        button.disabled = true;
    }
}

// Afficher le clavier de boutons
function displayKeyboard() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split("");
    const alphabetDiv = document.querySelector("#alphabet");
    alphabetDiv.innerHTML = '';

    alphabet.forEach(lettre => {
        const button = document.createElement('button');
        button.innerText = lettre.toUpperCase();
        button.addEventListener('click', () => proposerLettre(lettre, button));
        alphabetDiv.appendChild(button);
    });
}

// Fonction pour le controle du volume
function updateVolume() {
    const volume = document.querySelector("#volume").value / 100;
    bgMusic.volume = volume;
}

document.querySelector("#volume").addEventListener('input', updateVolume);
updateVolume();

document.querySelector("#demarrer").style.display = "block";

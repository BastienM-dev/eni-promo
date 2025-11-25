let tousLesApprenants = []
const btnRetour = document.getElementById('btn-retour')
const modale = document.getElementById('modale');

if (btnRetour) {
    btnRetour.addEventListener('click', function() {
        window.location.href = 'index.html'
    })
}

function chargerApprenants() {
    fetch('JSON/promo.json')
        .then(response => response.json())
        .then(data => {
            console.log('Données chargées:', data)
            tousLesApprenants = data.apprenants
            afficherApprenants(data.apprenants)
        })
        
}

function afficherApprenants(apprenants) {
    const tbody = document.getElementById('apprenants-liste')

    if (!tbody) return

    tbody.innerHTML = '';

    apprenants.forEach(apprenant => {
        const ligne = `
            <tr>
                <td>${apprenant.nom}</td>
                <td>${apprenant.prenom}</td>
                <td>${apprenant.ville}</td>
                <td><button data-id="${apprenant.id}">Détail</button></td>
            </tr>
            `

        tbody.innerHTML += ligne
    })

    ajouterEvenementsDetail()
}

if (document.getElementById('apprenants-liste')) {
    chargerApprenants()
}

function ajouterEvenementsDetail() {
    const boutonsDetail = document.querySelectorAll('button[data-id]')

    boutonsDetail.forEach(bouton => {
        bouton.addEventListener('click', function() {
            const id = this.getAttribute('data-id')
            afficherModale(id)
        })
    })
}

function afficherModale(id) {

    const apprenant = tousLesApprenants.find(apprenant => apprenant.id === parseInt(id))

    const contenuHTML = 
    `
    <img src="assets/images/${apprenant.avatar}">
    <h2>${apprenant.nom} ${apprenant.prenom}</h2>
    <p><strong>Ville</strong> : ${apprenant.ville}</p>
    <p><strong>Anecdotes</strong> : ${apprenant.anecdotes}</p>
    `
    
    const divModale = document.getElementById('modale-info')
    divModale.innerHTML = contenuHTML

    modale.classList.add('active')
    
}

function fermerModale() {
    modale.classList.remove('active')
}

const fermeture = document.querySelector('.modale-fermer')

if (fermeture) {
    fermeture.addEventListener('click', fermerModale)
}

if (modale) {
    modale.addEventListener('click', function(event) {
        if (event.target === modale) {
            fermerModale()
        }  
    })
}


/* THEME et STOCKAGE */
function changerTheme(theme) {
    if (theme === 'sombre') {
        document.body.classList.add('dark-theme')
    } else {
        document.body.classList.remove('dark-theme')
    }
}

const btnEnregistrer = document.getElementById('btn-enregistrer')

if (btnEnregistrer) {
    btnEnregistrer.addEventListener('click', function() {
        const selectTheme = document.getElementById('theme-select')
        const themeChoisi = selectTheme.value

    changerTheme(themeChoisi)

    localStorage.setItem('theme', themeChoisi)
})
}

function chargerThemeSauvegarde() {
    const themeSauvegarde = localStorage.getItem('theme')

    if (themeSauvegarde) {
        changerTheme(themeSauvegarde)
    }
}

chargerThemeSauvegarde()
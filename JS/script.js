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
            
            basculerAffichage()
        })
        .catch(error => {
            console.error('Erreur lors du chargement des données:', error)
        })
        
}

function afficherApprenants(apprenants) {
    const conteneur = document.getElementById('zone-apprenants')

    if (!conteneur) return

    // Recréer la structure complète du tableau
    let tableauHTML = `
        <table>
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Ville</th>
                    <th></th>
                </tr>
            </thead>
            <tbody id="apprenants-liste">
    `

    apprenants.forEach(apprenant => {
        tableauHTML += `
            <tr>
                <td>${apprenant.nom}</td>
                <td>${apprenant.prenom}</td>
                <td>${apprenant.ville}</td>
                <td><button data-id="${apprenant.id}">Détail</button></td>
            </tr>
        `
    })

    tableauHTML += `
            </tbody>
        </table>
    `

    conteneur.innerHTML = tableauHTML

    ajouterEvenementsDetail()
}

if (document.getElementById('zone-apprenants')) {
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
    <div class="modale-haut">
        <img src="assets/images/${apprenant.avatar}">
        <div class="modale-infos">
            <p><strong>Nom</strong> : ${apprenant.nom}</p>
            <p><strong>Prenom</strong> : ${apprenant.prenom}</p>
            <p><strong>Ville</strong> : ${apprenant.ville}</p>
        </div>
    </div>

    <h3>Anecdotes de l'apprenant :</h3>
    <div class="modale-anecdotes">
        
        <div class="modale-anecdotes-texte">
            ${apprenant.anecdotes}
        </div>
    </div>
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

    const formatChoisi = document.querySelector('input[name="displayMode"]:checked')
    const valeurFormat = formatChoisi.value

    localStorage.setItem('format', valeurFormat)
})
}

function chargerPreferences() {
    const themeSauvegarde = localStorage.getItem('theme')

    if (themeSauvegarde) {
        changerTheme(themeSauvegarde)
    }

    const formatSauvegarde = localStorage.getItem('format')

    if (formatSauvegarde) {
        const boutonRadio = document.querySelector(`input[name="displayMode"][value="${formatSauvegarde}"]`)
        if (boutonRadio) {
            boutonRadio.checked = true
        }
    }
}

chargerPreferences()


/* AFFICHAGE LISTE/CARTE */
function afficherApprenantsCarte(apprenants) {
    const conteneur = document.getElementById('zone-apprenants')

    if (!conteneur) return
    conteneur.innerHTML = ''

    apprenants.forEach(apprenant => {
        const carte = 
        `
        <div class="apprenant-carte">
            <h3>${apprenant.nom} ${apprenant.prenom}</h3>
            <p>${apprenant.ville}</p>
            <button data-id="${apprenant.id}">Détail</button>
        </div>
        `

        conteneur.innerHTML += carte
    })

    ajouterEvenementsDetail()
}

function basculerAffichage() {

    const formatChoisi = document.querySelector('input[name="displayMode"]:checked')

    if (!formatChoisi) return
    
    const valeur = formatChoisi.value
    const conteneur = document.getElementById('zone-apprenants')

    if (valeur === 'liste') {
        afficherApprenants(tousLesApprenants)
        conteneur.classList.add('mode-liste')
        conteneur.classList.remove('mode-cartes')
    } else {
        afficherApprenantsCarte(tousLesApprenants)
        conteneur.classList.add('mode-cartes')
        conteneur.classList.remove('mode-liste')
    }
}

const boutonsRadio = document.querySelectorAll('input[name="displayMode"]')

boutonsRadio.forEach(bouton => {
    bouton.addEventListener('change', function() {
        basculerAffichage()
    })
})

/* CARTE LEAFLET */
if (document.getElementById('map')) {
    const carte = L.map('map').setView([46.603354, 1.888334], 6)

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(carte);

    fetch('JSON/promo.json')
        .then(response => response.json())
        .then(data => {
            data.apprenants.forEach(apprenant => {
                if (apprenant.coordonnees.latitude && apprenant.coordonnees.longitude) {
                    const lat = parseFloat(apprenant.coordonnees.latitude)
                    const lng = parseFloat(apprenant.coordonnees.longitude)

                    const marqueur = L.marker([lat, lng]).addTo(carte)

                    marqueur.bindPopup(`
                        <strong>${apprenant.prenom} ${apprenant.nom}</strong><br>
                        <em>${apprenant.ville}</em>
                        `)
                }
            })
        })
        .catch(error => {
        console.error('Erreur lors du chargement des données pour la carte:', error)
    })
}
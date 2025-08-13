// ================================
// PETS APP JS
// ================================

// DOM Elements
const petContainer = document.querySelector('.cat-gallery__list')
const filterButtons = document.querySelectorAll('.filter-btn')
const template = document.getElementById('cat-gallery__card-template')

// Store all pets globally
let allPets = []

// --------------------------------
// Helper: Get age category with emoji
// --------------------------------
const getAgeCategory = birthyear => {
  const currentYear = new Date().getFullYear()
  const yearNum = Number(birthyear)
  console.log(yearNum)
  if (isNaN(yearNum) || !birthyear) return 'Unknown'
  const age = currentYear - yearNum
  if (age < 1) return 'Kitten 🐣'
  if (age <= 7) return 'Adult 😺'
  return 'Senior 🐾'
}

// --------------------------------
// Render pets to DOM using template
// --------------------------------
const displayPets = pets => {
  petContainer.innerHTML = ''
  if (!pets.length) {
    petContainer.innerHTML = '<p>No pets found.</p>'
    return
  }

  console.log(pets)
  pets.forEach(pet => {
    console.log(pet)
    const clone = template.content.cloneNode(true)
    clone.querySelector('img').src =
      pet.photo && pet.photo.trim() !== '' ? pet.photo : './img/fallback.jpg'

    clone.querySelector('img').alt = pet.name
    clone.querySelector('.cat-gallery__title').textContent = pet.name
    clone.querySelector('.cat-gallery__description').textContent =
      pet.description || ''
    clone.querySelector('.cat-gallery__age').textContent = getAgeCategory(
      pet.birthYear
    )
    petContainer.appendChild(clone)
  })
}

// --------------------------------
// Fetch pets JSON
// --------------------------------
const fetchPets = async () => {
  try {
    const res = await fetch(
      'https://learnwebcode.github.io/bootcamp-pet-data/pets.json'
    )
    const data = await res.json()
    allPets = data
    console.log(allPets)
    displayPets(allPets)
  } catch (err) {
    console.error('Error loading pets:', err)
    petContainer.innerHTML = '<p>Failed to load pets.</p>'
  }
}

// --------------------------------
// Filter pets by age category
// --------------------------------
const filterPets = filter => {
  if (filter.toLowerCase() === 'all') {
    displayPets(allPets)
    return
  }

  const filtered = allPets.filter(pet => {
    const category = getAgeCategory(pet.birthYear).toLowerCase()
    return category.startsWith(filter.toLowerCase())
  })

  displayPets(filtered)
}

// --------------------------------
// Setup filter buttons
// --------------------------------
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter
    filterPets(filter)
  })
})

// --------------------------------
// Initialize app
// --------------------------------
fetchPets()

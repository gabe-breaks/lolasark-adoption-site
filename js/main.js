const TEMPLATE = document.querySelector('#cat-gallery__card-template')
const GALLERY_LIST = document.querySelector('.cat-gallery__list')
const FILTER_BUTTONS = document.querySelectorAll('.cat-gallery__filter button')

if (!TEMPLATE || !GALLERY_LIST) {
  console.error('Required DOM elements not found.')
}

let allPets = []

const fetchData = async () => {
  const URL = 'https://learnwebcode.github.io/bootcamp-pet-data/pets.json'
  try {
    const res = await fetch(URL)
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    allPets = await res.json()
    renderPets(allPets)
  } catch (error) {
    console.error('Failed to fetch data:', error)
    GALLERY_LIST.innerHTML = '<p>Unable to load pets at this time.</p>'
  }
}

const renderPets = pets => {
  const fragment = document.createDocumentFragment()

  pets.forEach(pet => {
    const clone = TEMPLATE.content.cloneNode(true)

    // Set name
    clone.querySelector('.cat-gallery__title').textContent =
      pet.name?.trim() || 'Unnamed Pet'

    // Set description
    clone.querySelector('.cat-gallery__description').textContent =
      pet.description?.trim() || 'No description available.'

    // Set age
    clone.querySelector('.cat-gallery__age').textContent = getCatAgeCategory()

    // Set image
    const img = clone.querySelector('.cat-gallery__card-image img')
    img.src = pet.photo?.trim() || 'img/fallback.jpg'
    img.alt = `${pet.name || 'Unknown'} the ${pet.species || 'creature'}`
    img.loading = 'lazy'

    fragment.appendChild(clone)
  })

  GALLERY_LIST.replaceChildren(fragment)
}

const handleFilterClick = e => {
  const btn = e.currentTarget
  const filter = btn.dataset.filter?.trim().toLowerCase() || 'all'

  if (filter === 'all') {
    renderPets(allPets)
  } else {
    renderPets(
      allPets.filter(pet => pet.species?.trim().toLowerCase() === filter)
    )
  }
}

FILTER_BUTTONS.forEach(btn => btn.addEventListener('click', handleFilterClick))

fetchData()

const getCatAgeCategory = () => {
  const age = Math.random() * (12 - 0.6) + 0.6

  if (age < 1) {
    return 'Kitten 🐣'
  } else if (age <= 7) {
    return 'Adult 😺'
  } else {
    return 'Senior 🐾'
  }
}

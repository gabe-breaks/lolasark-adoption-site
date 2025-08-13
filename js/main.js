const TEMPLATE = document.querySelector('#cat-gallery__card-template')
const GALLERY_LIST = document.querySelector('.cat-gallery__list')
const FILTER_BUTTONS = document.querySelectorAll('.cat-gallery__filter button')

if (!TEMPLATE || !GALLERY_LIST) {
  console.error('Required DOM elements not found.')
}

let allPets = [] // store fetched data globally

// Fetch and store pet data
const fetchData = async () => {
  const URL = 'https://learnwebcode.github.io/bootcamp-pet-data/pets.json'
  try {
    const res = await fetch(URL)
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    allPets = await res.json()
    renderPets(allPets) // initially render all
  } catch (error) {
    console.error('Failed to fetch data:', error)
    GALLERY_LIST.innerHTML = '<p>Unable to load pets at this time.</p>'
  }
}

// Render given pets
const renderPets = pets => {
  const fragment = document.createDocumentFragment()

  pets.forEach(pet => {
    const clone = TEMPLATE.content.cloneNode(true)

    clone.querySelector('.cat-gallery__title').textContent =
      pet.name?.trim() || 'Unnamed Pet'

    clone.querySelector('.cat-gallery__description').textContent =
      pet.description?.trim() || 'No description available.'

    const img = clone.querySelector('.cat-gallery__card-image img')
    img.src = pet.photo?.trim() || 'img/fallback.jpg'
    img.alt = `${pet.name || 'Unknown'} the ${pet.species || 'creature'}`
    img.loading = 'lazy'

    fragment.appendChild(clone)
  })

  // Replace children for efficiency
  GALLERY_LIST.replaceChildren(fragment)
}

// Filter click handler
const handleFilterClick = e => {
  const btn = e.currentTarget
  const filter = btn.dataset.filter?.trim().toLowerCase() || 'all'

  // update aria-pressed states
  FILTER_BUTTONS.forEach(b => b.setAttribute('aria-pressed', b === btn))

  if (filter === 'all') {
    renderPets(allPets)
  } else {
    renderPets(
      allPets.filter(pet => pet.species?.trim().toLowerCase() === filter)
    )
  }
}

// Attach event listeners
FILTER_BUTTONS.forEach(btn => btn.addEventListener('click', handleFilterClick))

fetchData()

// Sample cat data with proper Unicode emojis
const cats = [
  {
    name: 'Luna',
    age: '2 years',
    ageCategory: 'adult',
    breed: 'Domestic Longhair',
    gender: 'female',
    description:
      "Oh, Luna is such a sweetheart! She's super cuddly and loves nothing more than curling up in your lap. Great with kids and other pets too.",
    image: '🐱',
    alt: 'Luna - A beautiful 2-year-old Domestic Longhair female cat'
  },
  {
    name: 'Oliver',
    age: '6 months',
    ageCategory: 'kitten',
    breed: 'Orange Tabby',
    gender: 'male',
    description:
      'Oliver is a little ball of energy! This guy loves his toys and will climb anything he can get his paws on. Perfect if you want a playful buddy.',
    image: '🐱',
    alt: 'Oliver - An energetic 6-month-old Orange Tabby male kitten'
  },
  {
    name: 'Bella',
    age: '3 years',
    ageCategory: 'adult',
    breed: 'Siamese Mix',
    gender: 'female',
    description:
      "Bella is a chatty one! She loves to 'talk' and is super smart - she'll figure out how to open doors if you're not careful. Very social cat!",
    image: '🐈',
    alt: 'Bella - A talkative 3-year-old Siamese Mix female cat'
  },
  {
    name: 'Whiskers',
    age: '8 years',
    ageCategory: 'senior',
    breed: 'Maine Coon',
    gender: 'male',
    description:
      "Whiskers is a gentle giant who loves quiet afternoons and sunny windowsills. He's calm, loving, and perfect for a peaceful home.",
    image: '🐈‍⬛',
    alt: 'Whiskers - A gentle 8-year-old Maine Coon male senior cat'
  },
  {
    name: 'Mittens',
    age: '4 months',
    ageCategory: 'kitten',
    breed: 'Tuxedo',
    gender: 'female',
    description:
      "Mittens is tiny but mighty! She's got the cutest white paws and loves to chase feather toys. She's social and loves other cats.",
    image: '🐈‍⬛',
    alt: 'Mittens - A playful 4-month-old Tuxedo female kitten'
  },
  {
    name: 'Shadow',
    age: '5 years',
    ageCategory: 'adult',
    breed: 'Black Shorthair',
    gender: 'male',
    description:
      "Shadow is a sleek, mysterious fellow who's actually a total sweetheart once he warms up to you. He loves head scratches and quiet company.",
    image: '🐈‍⬛',
    alt: 'Shadow - A mysterious 5-year-old Black Shorthair male cat'
  }
]

// Favorites system using in-memory storage
let favorites = []

// Global variable to track current filter
let currentFilter = 'all'

// Function to create cat cards with proper accessibility
function createCatCard (cat) {
  const isFavorited = favorites.includes(cat.name)
  return `
      <div class="cat-card" data-gender="${cat.gender}" data-age-category="${
    cat.ageCategory
  }">
        <div class="cat-image">
          <div class="cat-placeholder" aria-label="${cat.alt}">${
    cat.image
  }</div>
          <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" 
                  onclick="toggleFavorite('${cat.name}')" 
                  aria-label="${
                    isFavorited ? 'Remove from favorites' : 'Add to favorites'
                  }">
            <i class="fas fa-heart"></i>
          </button>
        </div>
        <div class="cat-info">
          <h3 class="cat-name">${cat.name}</h3>
          <p class="cat-details">
            <strong>Age:</strong> ${cat.age} | 
            <strong>Breed:</strong> ${cat.breed} | 
            <strong>Gender:</strong> ${
              cat.gender.charAt(0).toUpperCase() + cat.gender.slice(1)
            }
          </p>
          <p class="cat-description">${cat.description}</p>
          <button class="adopt-btn" onclick="adoptCat('${cat.name}')">Adopt ${
    cat.name
  }</button>
        </div>
      </div>
    `
}

// Function to toggle favorites
function toggleFavorite (catName) {
  const index = favorites.indexOf(catName)
  if (index === -1) {
    favorites.push(catName)
  } else {
    favorites.splice(index, 1)
  }
  populateCats(currentFilter) // Refresh the display
}

// Function to filter cats based on selected filter
function filterCats (filter) {
  let filteredCats = cats

  if (filter !== 'all') {
    filteredCats = cats.filter(cat => {
      return cat.gender === filter || cat.ageCategory === filter
    })
  }

  return filteredCats
}

// Function to update cat count display
function updateCatCount (filter, count) {
  const catCountElement = document.getElementById('catCount')
  const clearFiltersBtn = document.getElementById('clearFilters')

  if (catCountElement) {
    if (filter === 'all') {
      catCountElement.textContent = `Showing all ${count} cats`
      if (clearFiltersBtn) clearFiltersBtn.style.display = 'none'
    } else {
      const filterName = filter.charAt(0).toUpperCase() + filter.slice(1)
      catCountElement.textContent = `Showing ${count} ${filterName.toLowerCase()} cat${
        count !== 1 ? 's' : ''
      }`
      if (clearFiltersBtn) clearFiltersBtn.style.display = 'inline-block'
    }
  }
}

// Function to populate cat grid with loading state
function populateCats (filter = 'all') {
  const catsGrid = document.getElementById('catsGrid')

  if (catsGrid) {
    // Show loading state
    catsGrid.innerHTML = '<div class="loading">Loading cats...</div>'
    catsGrid.classList.add('loading')

    // Simulate loading delay for better UX
    setTimeout(() => {
      const filteredCats = filterCats(filter)
      const catCardsHTML = filteredCats.map(cat => createCatCard(cat)).join('')
      catsGrid.innerHTML = catCardsHTML
      catsGrid.classList.remove('loading')

      // Update cat count
      updateCatCount(filter, filteredCats.length)

      // Add fade-in animation
      setTimeout(() => {
        catsGrid.classList.add('fade-in')
      }, 50)
    }, 300)
  }
}

// Function to setup filter buttons
function setupFilterButtons () {
  const filterButtons = document.querySelectorAll('.filter-btn')
  const clearFiltersBtn = document.getElementById('clearFilters')

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'))

      // Add active class to clicked button
      button.classList.add('active')

      // Get filter value
      const filter = button.getAttribute('data-filter')
      currentFilter = filter

      // Populate cats with filter
      populateCats(filter)
    })
  })

  // Clear filters functionality
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      // Reset to "all" filter
      filterButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === 'all') {
          btn.classList.add('active')
        } else {
          btn.classList.remove('active')
        }
      })

      currentFilter = 'all'
      populateCats('all')
    })
  }
}

// Function to handle adoption
function adoptCat (catName) {
  alert(
    `Brilliant! You're interested in ${catName}! Give us a ring or drop us an email to arrange a meet and greet.`
  )
}

// Mobile Nav Toggle
function setupMobileNavigation () {
  const hamburger = document.querySelector('.hamburger')
  const navMenu = document.querySelector('.nav-menu')

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active')
      navMenu.classList.toggle('active')
    })
  }

  // Close mobile menu when clicking on a link
  document.querySelectorAll('.nav-link').forEach(n =>
    n.addEventListener('click', () => {
      if (hamburger && navMenu) {
        hamburger.classList.remove('active')
        navMenu.classList.remove('active')
      }
    })
  )
}

// Smooth scrolling for nav links
function setupSmoothScrolling () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute('href'))
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
    })
  })
}

// Enhanced contact form with validation
function setupContactForm () {
  const contactForm = document.getElementById('contactForm')
  const submitBtn = document.getElementById('submitBtn')

  if (contactForm) {
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea')
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input))
      input.addEventListener('input', () => clearValidation(input))
    })

    contactForm.addEventListener('submit', async e => {
      e.preventDefault()

      // Validate all fields
      let isValid = true
      inputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false
        }
      })

      if (isValid) {
        // Show loading state
        submitBtn.classList.add('loading')
        submitBtn.disabled = true

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Reset form and show success
        contactForm.reset()
        submitBtn.classList.remove('loading')
        submitBtn.disabled = false

        alert("Cheers for your message! We'll get back to you soon.")
      }
    })
  }
}

function validateField (field) {
  const validation = document.getElementById(field.name + 'Validation')
  let isValid = true
  let message = ''

  if (!field.value.trim()) {
    isValid = false
    message = `Please enter ${field.placeholder.toLowerCase()}`
  } else if (field.type === 'email' && !isValidEmail(field.value)) {
    isValid = false
    message = 'Please enter a valid email address'
  }

  if (validation) {
    validation.textContent = message
    validation.classList.toggle('show', !isValid)
  }

  return isValid
}

function clearValidation (field) {
  const validation = document.getElementById(field.name + 'Validation')
  if (validation) {
    validation.classList.remove('show')
  }
}

function isValidEmail (email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Setup about CTA button
function setupAboutButton () {
  const aboutCtaBtn = document.getElementById('aboutCtaBtn')
  if (aboutCtaBtn) {
    aboutCtaBtn.addEventListener('click', e => {
      e.preventDefault()
      alert(
        'Thank you for your interest in donating! Please get in touch for donation information.'
      )
    })
  }
}

// Main initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all functionality
  populateCats()
  setupFilterButtons()
  setupMobileNavigation()
  setupSmoothScrolling()
  setupContactForm()
  setupAboutButton()
})

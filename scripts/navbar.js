import seasons from '../data/seasons.json'
import leagues from '../data/leagues.json'

// Existing seasons dropdown code (unchanged)
const seasonSelector = document.querySelector('#seasonSelector')
const dropdownSvg = document.querySelector('#dropdownSvg')
const dropdownMenu = document.querySelector('#dropdownMenu')
const seasonSelectorButton = document.querySelector('#seasonSelectorButton')
let buttonMenuOpen = false

// Populate seasons dropdown (unchanged)
seasons.forEach((season) => {
  dropdownMenu.innerHTML += `
    <li class="w-35">
      <a class="p-4 duration-100 hover:bg-slate-800 h-35 flex items-center justify-center" href="/seasons?season=${season.name[season.name.length - 1]}">
        <img class="max-h-full max-w-full object-contain" src="/assets/${season.logo}" >
      </a>
    </li>
  `
})

// Existing functions for seasons dropdown (unchanged)
function openMenu() {
  dropdownSvg.classList.add('rotate-180')
  dropdownMenu.classList.remove('-translate-y-full')
}

function closeMenu() {
  dropdownSvg.classList.remove('rotate-180')
  dropdownMenu.classList.add('-translate-y-full')
}

// Existing event listeners for seasons dropdown (unchanged)
seasonSelector.addEventListener('mouseover', () => {
  if (!buttonMenuOpen) {
    openMenu()
  }
})

seasonSelector.addEventListener('mouseout', () => {
  if (!buttonMenuOpen) {
    closeMenu()
  }
})

dropdownMenu.addEventListener('mouseover', () => {
  if (!buttonMenuOpen) {
    openMenu()
  }
})

dropdownMenu.addEventListener('mouseout', () => {
  if (!buttonMenuOpen) {
    closeMenu()
  }
})

seasonSelectorButton.addEventListener('click', () => {
  if (buttonMenuOpen) {
    closeMenu()
    buttonMenuOpen = false
  } else {
    openMenu()
    buttonMenuOpen = true
  }
})

document.addEventListener('click', (e) => {
  if (buttonMenuOpen && !seasonSelector.contains(e.target) && !dropdownMenu.contains(e.target)) {
    closeMenu()
    buttonMenuOpen = false
  }
})

// Settings dropdown implementation
const settingsButton = document.querySelector('.bg-gray-900.z-10 button:has(#dropdownSvg2)')
const settingsDropdown = document.getElementById('settingsDropdown')
const dropdownSvg2 = document.getElementById('dropdownSvg2')
let settingsMenuOpen = false

// Function to open settings dropdown
function openSettingsMenu() {
  dropdownSvg2.classList.add('rotate-180')
  settingsDropdown.classList.remove('-translate-y-full')
}

// Function to close settings dropdown
function closeSettingsMenu() {
  dropdownSvg2.classList.remove('rotate-180')
  settingsDropdown.classList.add('-translate-y-full')
}

// Build the hierarchical settings menu
function buildSettingsMenu() {
  settingsDropdown.innerHTML = ''
  settingsDropdown.className = 'absolute right-0 top-full bg-gray-900 -translate-y-full duration-200 -z-10 h-screen w-72 flex flex-col'
  
  // Add header
  const header = document.createElement('div')
  header.className = 'bg-gray-800 text-white font-bold py-3 px-4 border-b border-gray-700'
  header.textContent = 'Settings'
  settingsDropdown.appendChild(header)
  
  // Create scrollable container
  const scrollContainer = document.createElement('div')
  scrollContainer.className = 'overflow-y-auto flex-grow'
  scrollContainer.style.maxHeight = 'calc(100vh - 50px)'
  settingsDropdown.appendChild(scrollContainer)
  
  // Process each season
  seasons.forEach(season => {
    const seasonNumber = season.name.split(' ')[1]
    
    // Create season container
    const seasonContainer = document.createElement('div')
    seasonContainer.className = 'border-b border-gray-700'
    seasonContainer.dataset.id = `season-${seasonNumber}`
    
    // Season header with toggle
    const seasonHeader = document.createElement('div')
    seasonHeader.className = 'flex items-center justify-between py-3 px-4'
    
    // Season label with expand/collapse arrow
    const seasonLabelContainer = document.createElement('div')
    seasonLabelContainer.className = 'flex items-center cursor-pointer'
    
    const seasonArrow = document.createElement('span')
    seasonArrow.className = 'mr-2 transform transition-transform duration-200'
    seasonArrow.innerHTML = '&#9656;' // Unicode right-pointing triangle
    
    const seasonLabel = document.createElement('span')
    seasonLabel.className = 'text-white'
    seasonLabel.textContent = season.name
    
    seasonLabelContainer.appendChild(seasonArrow)
    seasonLabelContainer.appendChild(seasonLabel)
    seasonHeader.appendChild(seasonLabelContainer)
    
    // Season toggle
    const seasonToggle = createToggleSwitch(`season-${seasonNumber}`)
    seasonHeader.appendChild(seasonToggle)
    seasonContainer.appendChild(seasonHeader)
    
    // Create leagues container (initially hidden)
    const leaguesContainer = document.createElement('div')
    leaguesContainer.className = 'hidden'
    leaguesContainer.dataset.parent = `season-${seasonNumber}`
    
    // Add leagues for this season
    season.leagues.forEach(leagueName => {
      // Find league data
      const leagueData = leagues.find(l => l.season === seasonNumber && l.league === leagueName)
      if (!leagueData) return
      
      // Create league container
      const leagueContainer = document.createElement('div')
      leagueContainer.className = 'border-t border-gray-700'
      leagueContainer.dataset.id = `season-${seasonNumber}-${leagueName}`
      
      // League header with toggle
      const leagueHeader = document.createElement('div')
      leagueHeader.className = 'flex items-center justify-between py-3 px-8'
      
      // League label with expand/collapse arrow
      const leagueLabelContainer = document.createElement('div')
      leagueLabelContainer.className = 'flex items-center cursor-pointer'
      
      const leagueArrow = document.createElement('span')
      leagueArrow.className = 'mr-2 transform transition-transform duration-200'
      leagueArrow.innerHTML = '&#9656;'
      
      const leagueLabel = document.createElement('span')
      leagueLabel.className = 'text-white'
      leagueLabel.textContent = leagueName.charAt(0).toUpperCase() + leagueName.slice(1)
      
      leagueLabelContainer.appendChild(leagueArrow)
      leagueLabelContainer.appendChild(leagueLabel)
      leagueHeader.appendChild(leagueLabelContainer)
      
      // League toggle
      const leagueToggle = createToggleSwitch(`season-${seasonNumber}-${leagueName}`)
      leagueHeader.appendChild(leagueToggle)
      leagueContainer.appendChild(leagueHeader)
      
      // Create groups container (initially hidden)
      const groupsContainer = document.createElement('div')
      groupsContainer.className = 'hidden'
      groupsContainer.dataset.parent = `season-${seasonNumber}-${leagueName}`
      
      // Add groups for this league
      if (leagueData.groups && leagueData.groups.length > 0) {
        leagueData.groups.forEach(groupName => {
          // Create group item
          const groupItem = document.createElement('div')
          groupItem.className = 'flex items-center justify-between py-2 px-12 border-t border-gray-700'
          groupItem.dataset.id = `season-${seasonNumber}-${leagueName}-group-${groupName}`
          
          const groupLabel = document.createElement('span')
          groupLabel.className = 'text-white'
          groupLabel.textContent = `Group ${groupName}`
          groupItem.appendChild(groupLabel)
          
          // Group toggle
          const groupToggle = createToggleSwitch(`season-${seasonNumber}-${leagueName}-group-${groupName}`)
          groupItem.appendChild(groupToggle)
          
          groupsContainer.appendChild(groupItem)
        })
      }
      
      leagueContainer.appendChild(groupsContainer)
      
      // Set up expand/collapse for league
      leagueLabelContainer.addEventListener('click', () => {
        const isExpanded = !groupsContainer.classList.contains('hidden')
        if (isExpanded) {
          groupsContainer.classList.add('hidden')
          leagueArrow.style.transform = ''
        } else {
          groupsContainer.classList.remove('hidden')
          leagueArrow.style.transform = 'rotate(90deg)'
        }
      })
      
      leaguesContainer.appendChild(leagueContainer)
    })
    
    seasonContainer.appendChild(leaguesContainer)
    
    // Set up expand/collapse for season
    seasonLabelContainer.addEventListener('click', () => {
      const isExpanded = !leaguesContainer.classList.contains('hidden')
      if (isExpanded) {
        leaguesContainer.classList.add('hidden')
        seasonArrow.style.transform = ''
      } else {
        leaguesContainer.classList.remove('hidden')
        seasonArrow.style.transform = 'rotate(90deg)'
      }
    })
    
    scrollContainer.appendChild(seasonContainer)
  })
  
  // Set up event delegation for toggle changes
  settingsDropdown.addEventListener('change', handleToggleChange)
}

// Create a toggle switch
function createToggleSwitch(id) {
  const toggleContainer = document.createElement('label')
  toggleContainer.className = 'relative inline-flex items-center cursor-pointer'
  
  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.className = 'sr-only peer'
  checkbox.checked = true
  checkbox.dataset.id = id
  
  const slider = document.createElement('div')
  slider.className = 'w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[\'\'] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600'
  
  toggleContainer.appendChild(checkbox)
  toggleContainer.appendChild(slider)
  
  return toggleContainer
}

// Handle toggle changes
function handleToggleChange(event) {
  if (event.target.type !== 'checkbox') return
  
  const id = event.target.dataset.id
  const checked = event.target.checked
  
  console.log(`${id} toggled: ${checked}`)
  
  // Update children toggles
  updateChildToggles(id, checked)
  
  // Update parent toggles
  updateParentToggles(id)
}

// Update all child toggles to match parent state
function updateChildToggles(parentId, checked) {
  const childElements = document.querySelectorAll(`[data-id^="${parentId}-"]`)
  childElements.forEach(element => {
    if (element.tagName === 'INPUT') {
      element.checked = checked
    }
  })
}

// Update parent toggle based on children states
function updateParentToggles(childId) {
  const parts = childId.split('-')
  
  // For group items (season-1-platinum-group-A), parent is league (season-1-platinum)
  if (parts.includes('group')) {
    const leagueId = childId.substring(0, childId.indexOf('-group'))
    updateParentToggleState(leagueId)
  }
  
  // For league items (season-1-platinum), parent is season (season-1)
  if (parts.length >= 3 && !parts.includes('group')) {
    const seasonId = `${parts[0]}-${parts[1]}`
    updateParentToggleState(seasonId)
  }
}

// Check if all children are checked/unchecked and update parent accordingly
function updateParentToggleState(parentId) {
  const parentCheckbox = document.querySelector(`input[data-id="${parentId}"]`)
  if (!parentCheckbox) return
  
  const childCheckboxes = document.querySelectorAll(`input[data-id^="${parentId}-"]`)
  if (childCheckboxes.length === 0) return
  
  const allChecked = Array.from(childCheckboxes).every(cb => cb.checked)
  const allUnchecked = Array.from(childCheckboxes).every(cb => !cb.checked)
  
  if (allChecked) {
    parentCheckbox.checked = true
  } else if (allUnchecked) {
    parentCheckbox.checked = false
  }
  
  // Recursively update higher-level parents
  const parts = parentId.split('-')
  if (parts.length >= 3) {
    const grandparentId = `${parts[0]}-${parts[1]}`
    updateParentToggleState(grandparentId)
  }
}

// Event listeners for settings dropdown
settingsButton.addEventListener('mouseover', () => {
  if (!settingsMenuOpen) {
    openSettingsMenu()
  }
})

settingsButton.addEventListener('mouseout', () => {
  if (!settingsMenuOpen) {
    closeSettingsMenu()
  }
})

settingsDropdown.addEventListener('mouseover', () => {
  if (!settingsMenuOpen) {
    openSettingsMenu()
  }
})

settingsDropdown.addEventListener('mouseout', () => {
  if (!settingsMenuOpen) {
    closeSettingsMenu()
  }
})

settingsButton.addEventListener('click', () => {
  if (settingsMenuOpen) {
    closeSettingsMenu()
    settingsMenuOpen = false
  } else {
    openSettingsMenu()
    settingsMenuOpen = true
  }
})

document.addEventListener('click', (e) => {
  if (settingsMenuOpen && !settingsButton.contains(e.target) && !settingsDropdown.contains(e.target)) {
    closeSettingsMenu()
    settingsMenuOpen = false
  }
})

// Initialize settings dropdown
buildSettingsMenu()
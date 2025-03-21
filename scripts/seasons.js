import seasons from "../data/seasons.json";
import maps from "../data/maps.json";
import leagues from '../data/leagues.json'
import groups from '../data/groups.json'
import games from '../data/games.json'

const seasonNumber = document.querySelector("#seasonNumber");
const mapContainer = document.querySelector("#mapContainer");
const leaguesSelectorContainer = document.querySelector('#leaguesSelectorContainer')
const leaguesContainer = document.querySelector('#leaguesContainer')

const queries = window.location.search;
const params = new URLSearchParams(queries);
const seasonNum = params.get("season");

const season = seasons.find((season) => season.name === `Season ${seasonNum}`);
const seasonLeagues = leagues.filter((league) => league.season === seasonNum);
const seasonGroups = groups.filter((group) => group.season === seasonNum)
const seasonGames = games.filter((game) => game.season === seasonNum)


// set h1
seasonNumber.textContent = `Season ${seasonNum}`;

// set title
document.title = `TTL | Season ${seasonNum}`;

// set season logo
// seasonLogo.src = `/assets/${season.logo}`;

// set playlist link
// playlistLink.href = `https://www.youtube.com/watch?v=${season.thumbnail}&list=${season.playlist}&index=1`

// set playlist image
// playlistImg.src = `https://i.ytimg.com/vi/${season.thumbnail}/maxresdefault.jpg`

// build leagues
season.leagues.forEach((league) => {

  const leagueGames = seasonGames.filter((game) => game.league === league)

  const capitalizedLeague = league.charAt(0).toUpperCase() + league.slice(1)
  let leagueIcon

  switch (league) {
    case 'silver':
      leagueIcon = '/assets/silver-icon.png'
      break;
    case 'gold':
      leagueIcon = '/assets/gold-icon.png'
      break;
    case 'platinum':
      leagueIcon = '/assets/platinum-icon.png'
      break;
    default:
      break;
  }

  // build league section selector
  const section = document.createElement('li')
  const anchor = document.createElement('a')
  const icon = document.createElement('img')
  const title = document.createElement('p')

  icon.src = leagueIcon
  icon.classList = "group-hover:scale-108 duration-100"

  title.textContent = capitalizedLeague
  title.classList = 'text-center font-semibold text-2xl'

  anchor.href = `#${league}`
  anchor.classList = 'block pb-4 rounded-md group'
  
  anchor.appendChild(icon)
  anchor.appendChild(title)
  section.appendChild(anchor)

  leaguesSelectorContainer.appendChild(section)


  // build league section
  const div = document.createElement('div')
  const header = document.createElement('h2')
  const dates = document.createElement('div')
  const prize = document.createElement('div')
  const groups = document.createElement('section')
  const playoffs = document.createElement('section')

  const selectedLeague = seasonLeagues.find((item) => item.league === league)

  header.textContent = capitalizedLeague
  header.classList = 'font-semibold text-lg pt-14'

  dates.textContent = `${new Date(selectedLeague.start_date).toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric"})} - ${new Date(selectedLeague.end_date).toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric"})}`

  prize.textContent = `${new Intl.NumberFormat(undefined, {style: 'currency',
    currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2, currencyDisplay: 'code'
  }).format(selectedLeague.prizepool)}`

  // build groups
  selectedLeague.groups.forEach((group) => {
    const groupContainer = document.createElement('div')
    const groupHeader = document.createElement('h3')
    const groupList = document.createElement('ul')

    const selectedGroup = seasonGroups.find((item) => item.group === group && item.league === league)

    const groupGames = leagueGames.filter((game) => game.group === group)

    groupHeader.textContent = `Group ${group}`
    groupHeader.classList = 'text-center font-semibold text-xl mb-4'

    groupList.classList = 'grid grid-cols-6 gap-2'

    selectedGroup?.players.forEach((player, index) => {

      const playerGames = groupGames.filter((game) => game.player_1.name.toLowerCase() === player.toLowerCase() || game.player_2.name.toLowerCase() === player.toLowerCase())

      console.log(`${player}'s games:`)
      console.log(playerGames)

      let playerGroupWin = 0, playerGroupLoss = 0;

      playerGames.forEach((g) => {
        if (g.player_1.name.toLowerCase() === player.toLowerCase() && g.player_1.winner === true) {
          playerGroupWin++
        } else if (g.player_2.name.toLowerCase() === player.toLowerCase() && g.player_2.winner === true) {
          playerGroupWin++
        } else {
          playerGroupLoss++
        }
      })

      let classes = ''

      switch (index) {
        case 0:
          classes = 'col-start-3 row-start-1'
          break;
        case 1:
          classes = 'col-start-2 row-start-2'
          break;
        case 2:
          classes = 'col-start-4 row-start-2'
          break;
        case 3:
          classes = 'col-start-1 row-start-3'
          break;
        case 4:
          classes = 'col-start-3 row-start-3'
          break;
        case 5:
          classes = 'col-start-5 row-start-3'
          break;
        default:
          break;
      }

      classes += ' col-span-2 text-center p-1 border border-sky-50 overflow-hidden whitespace-nowrap text-ellipsis'

      const playerItem = document.createElement('li')
      const playerName = document.createElement('span')
      const playerStats = document.createElement('p')

      playerName.textContent = player

      playerStats.textContent = `${playerGroupWin}W-${playerGroupLoss}L`
      playerStats.classList = 'font-light text-sm'

      playerItem.append(playerName, playerStats)

      playerItem.classList = classes

      groupList.append(playerItem)
    })

    groupContainer.classList = "bg-gray-800 p-4"

    groupContainer.append(groupHeader, groupList)
    groups.appendChild(groupContainer)
  })

  // build playoffs
  const bracket = document.createElement('div')
  const roundOf12 = document.createElement('div')
  const quarterfinals = document.createElement('div')
  const semifinals = document.createElement('div')
  const finals = document.createElement('div')

  

  bracket.append(roundOf12, quarterfinals, semifinals, finals)
  playoffs.appendChild(bracket)

  // construct league
  div.id = league
  div.classList = 'px-4'

  groups.classList = 'grid grid-cols-4 gap-4'

  div.appendChild(header)
  div.appendChild(dates)
  selectedLeague.prizepool ? div.appendChild(prize) : null
  div.appendChild(groups)
  div.appendChild(playoffs)

  leaguesContainer.appendChild(div)
})

// set maps
season.maps.forEach((map, index) => {
  const mapJson = maps.find((obj) => obj.name === map);

  const container = document.createElement('li')
  const image = document.createElement('img')
  const mapName = document.createElement('div')
  const p = document.createElement('p')

  let classes;

  switch (index) {
    // First row: 4 items
    case 0:
      classes = 'col-start-1 row-start-1'; // First item in the first row
      break;
    case 1:
      classes = 'col-start-3 row-start-1'; // Second item in the first row
      break;
    case 2:
      classes = 'col-start-5 row-start-1'; // Third item in the first row
      break;
    case 3:
      classes = 'col-start-7 row-start-1'; // Fourth item in the first row
      break;

    // Middle row: 3 items
    case 4:
      classes = 'col-start-2 row-start-2'; // First item in the middle row (centered)
      break;
    case 5:
      classes = 'col-start-4 row-start-2'; // Second item in the middle row (centered)
      break;
    case 6:
      classes = 'col-start-6 row-start-2'; // Third item in the middle row (centered)
      break;

    // Last row: 4 items
    case 7:
      classes = 'col-start-1 row-start-3'; // First item in the last row
      break;
    case 8:
      classes = 'col-start-3 row-start-3'; // Second item in the last row
      break;
    case 9:
      classes = 'col-start-5 row-start-3'; // Third item in the last row
      break;
    case 10:
      classes = 'col-start-7 row-start-3'; // Fourth item in the last row
      break;

    default:
      console.warn('Index out of range for 4-3-4 layout');
      break;
  }

  classes += ' col-span-2 row-span-2 cursor-pointer hover:scale-108 duration-100 relative group'

  mapName.classList = 'transition-all absolute w-full h-full top-0 left-0 z-10 text-center flex items-center justify-center scale-30 opacity-0 group-hover:scale-100 group-hover:opacity-100 duration-300'

  p.classList = "bg-slate-800 px-4 py-2 rounded-md font-medium"
  p.textContent = mapJson.name;
  
  mapName.appendChild(p)

  let style = "clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"

  container.style = style

  container.classList = classes

  image.src = `/assets/maps/${mapJson.img.length > 0 ? mapJson.img : "cm_generic.png"}`

  container.append(image, mapName)

  mapContainer.appendChild(container)
});

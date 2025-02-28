import seasons from "../data/seasons.json";
import maps from "../data/maps.json";
import leagues from '../data/leagues.json'
import groups from '../data/groups.json'

const seasonNumber = document.querySelector("#seasonNumber");
const mapContainer = document.querySelector("#mapContainer");
const seasonLogo = document.querySelector("#seasonLogo");
const playlistLink = document.querySelector("#playlistLink")
const playlistImg = document.querySelector("#playlistImg")
const leaguesSelectorContainer = document.querySelector('#leaguesSelectorContainer')
const leaguesContainer = document.querySelector('#leaguesContainer')

const queries = window.location.search;
const params = new URLSearchParams(queries);
const seasonNum = params.get("season");

const season = seasons.find((season) => season.name === `Season ${seasonNum}`);
const seasonLeagues = leagues.filter((league) => league.season === seasonNum);
const seasonGroups = groups.filter((group) => group.season === seasonNum)


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

  const capitalizedLeague = league.charAt(0).toUpperCase() + league.slice(1)

  // build league section selector
  const section = document.createElement('li')
  const anchor = document.createElement('a')

  section.classList = `w-25 rounded-md overflow-hidden${league === 'platinum' ? ' shadow-[0px_0px_15px_1px_#DFF2FE]' : league === 'gold' ? ' shadow-[0px_0px_8px_0px_#ffdf20]' : league === "silver" ? ' shadow-[0px_0px_6px_0px_#99a1af]' : ''}`

  let background

  switch (league) {
    case 'platinum':
      background = 'bg-linear-to-b from-gray-200 via-gray-50 via-70% to-gray-400'
      break;
    case 'gold':
      background = 'bg-linear-to-b from-amber-300 via-yellow-200 via-70% to-amber-500'
      break;
    case 'silver':
      background = 'bg-linear-to-b from-zinc-400 via-slate-300 via-70% to-zinc-500'
  
    default:
      break;
  }


  anchor.textContent = capitalizedLeague
  anchor.href = `#${league}`
  anchor.classList = `p-1 block text-center text-gray-950 font-bold ${background}`
  
  section.appendChild(anchor)

  leaguesSelectorContainer.appendChild(section)


  // build league section
  const div = document.createElement('div')
  const header = document.createElement('h2')
  const dates = document.createElement('div')
  const prize = document.createElement('div')
  const groups = document.createElement('section')

  const selectedLeague = seasonLeagues.find((item) => item.league === league)

  header.textContent = capitalizedLeague

  dates.textContent = `${new Date(selectedLeague.start_date).toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric"})} - ${new Date(selectedLeague.end_date).toLocaleDateString(undefined, {year: "numeric", month: "long", day: "numeric"})}`

  
  prize.textContent = `${new Intl.NumberFormat(undefined, {style: 'currency',
    currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 2, currencyDisplay: 'code'
  }).format(selectedLeague.prizepool)}`

  selectedLeague.groups.forEach((group) => {
    const groupContainer = document.createElement('div')
    const groupHeader = document.createElement('h3')
    const groupList = document.createElement('ul')

    const selectedGroup = seasonGroups.find((item) => item.group === group && item.league === league)

    groupHeader.textContent = `Group ${group}`

    selectedGroup?.players.forEach((player) => {
      const playerItem = document.createElement('li')
      playerItem.textContent = player

      groupList.appendChild(playerItem)
    })

    groupContainer.append(groupHeader, groupList)
    groups.appendChild(groupContainer)
  })

  div.id = league
  div.classList = 'h-screen border-b-1'

  div.appendChild(header)
  div.appendChild(dates)
  selectedLeague.prizepool ? div.appendChild(prize) : null
  div.appendChild(groups)

  leaguesContainer.appendChild(div)
})

// set maps
season.maps.forEach((map, index) => {
  const mapJson = maps.find((obj) => obj.name === map);

  const container = document.createElement('li')
  const image = document.createElement('img')

  let classes;

  // switch (index) {
  //   // First row: 3 items
  //   case 0:
  //     classes = 'col-start-2 row-start-1';
  //     break;
  //   case 1:
  //     classes = 'col-start-3 row-start-1';
  //     break;
  //   case 2:
  //     classes = 'col-start-4 row-start-1';
  //     break;

  //   // Middle row: 5 items
  //   case 3:
  //     classes = 'col-start-1 row-start-2';
  //     break;
  //   case 4:
  //     classes = 'col-start-2 row-start-2';
  //     break;
  //   case 5:
  //     classes = 'col-start-3 row-start-2';
  //     break;
  //   case 6:
  //     classes = 'col-start-4 row-start-2';
  //     break;
  //   case 7:
  //     classes = 'col-start-5 row-start-2';
  //     break;

  //   // Last row: 3 items
  //   case 8:
  //     classes = 'col-start-2 row-start-3';
  //     break;
  //   case 9:
  //     classes = 'col-start-3 row-start-3';
  //     break;
  //   case 10:
  //     classes = 'col-start-4 row-start-3';
  //     break;

  //   default:
  //     console.warn('Index out of range for 3-5-3 layout');
  //     break;
  // }

  container.classList = classes


  image.src = `/assets/maps/${mapJson.img.length > 0 ? mapJson.img : "cm_generic.png"}`

  container.appendChild(image)

  mapContainer.appendChild(container)
});

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

let season, seasonLeagues, seasonGroups, seasonGames

if (seasonNum) {
  season = seasons.find((season) => season.name === `Season ${seasonNum}`);
  seasonLeagues = leagues.filter((league) => league.season === seasonNum);
  seasonGroups = groups.filter((group) => group.season === seasonNum)
  seasonGames = games.filter((game) => game.season === seasonNum)
}




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
const playoffGames = leagueGames.filter(game => game.group === null && game.round);

// Group games by round
const gamesByRound = {
  'Round of 12': playoffGames.filter(g => g.round === 'Round of 12'),
  'Quarterfinals': playoffGames.filter(g => g.round === 'Quarterfinals'),
  'Semifinals': playoffGames.filter(g => g.round === 'Semifinals'),
  'Finals': playoffGames.filter(g => g.round === 'Finals')
};

// Get unique matchups per round (group games from the same series)
const getMatchups = (games) => {
  const matchups = new Map();
  
  games.forEach(game => {
    // Create a consistent key for the matchup
    const players = [game.player_1.name, game.player_2.name].sort();
    const key = players.join(' vs ');
    
    if (!matchups.has(key)) {
      matchups.set(key, {
        player1: players[0],
        player2: players[1],
        games: [],
        winner: null,
        score: { [players[0]]: 0, [players[1]]: 0 }
      });
    }
    
    const matchup = matchups.get(key);
    matchup.games.push(game);
    
    // Update scores
    if (game.player_1.winner) {
      matchup.score[game.player_1.name]++;
    } else {
      matchup.score[game.player_2.name]++;
    }
  });
  
  // Determine series winners
  matchups.forEach(matchup => {
    if (matchup.score[matchup.player1] > matchup.score[matchup.player2]) {
      matchup.winner = matchup.player1;
    } else {
      matchup.winner = matchup.player2;
    }
  });
  
  return Array.from(matchups.values());
};

// Build bracket visualization
const bracket = document.createElement('div');
bracket.classList = 'mt-8 p-6 bg-gray-900 rounded-lg';

const bracketTitle = document.createElement('h3');
bracketTitle.textContent = 'Playoffs';
bracketTitle.classList = 'text-2xl font-bold mb-6 text-center';
bracket.appendChild(bracketTitle);

// Create bracket wrapper with custom styling
const bracketWrapper = document.createElement('div');
bracketWrapper.classList = 'relative';

// Add custom CSS for bracket lines
const style = document.createElement('style');
style.textContent = `
  
  
  .bracket-round {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 600px;
    position: relative;
  }
  
  .round-header {
    position: absolute;
    top: -30px;
    left: 0;
    right: 0;
    text-align: center;
  }
`;
document.head.appendChild(style);

const bracketContainer = document.createElement('div');
bracketContainer.classList = 'grid grid-cols-4 gap-16 items-stretch';

// Helper function to create a match element
const createMatchElement = (matchup) => {
  const matchDiv = document.createElement('div');
  matchDiv.classList = 'bg-gray-800 rounded p-2 space-y-1 min-w-[160px]';
  
  // Player 1
  const player1Div = document.createElement('div');
  player1Div.classList = `flex justify-between items-center px-2 py-1 rounded text-sm ${
    matchup.winner === matchup.player1 ? 'bg-green-900/30 font-semibold' : 'opacity-60'
  }`;
  const player1Name = document.createElement('span');
  player1Name.textContent = matchup.player1;
  player1Name.classList = 'truncate mr-2';
  const player1Score = document.createElement('span');
  player1Score.textContent = matchup.score[matchup.player1];
  player1Score.classList = 'text-xs font-mono';
  player1Div.append(player1Name, player1Score);
  
  // Player 2
  const player2Div = document.createElement('div');
  player2Div.classList = `flex justify-between items-center px-2 py-1 rounded text-sm ${
    matchup.winner === matchup.player2 ? 'bg-green-900/30 font-semibold' : 'opacity-60'
  }`;
  const player2Name = document.createElement('span');
  player2Name.textContent = matchup.player2;
  player2Name.classList = 'truncate mr-2';
  const player2Score = document.createElement('span');
  player2Score.textContent = matchup.score[matchup.player2];
  player2Score.classList = 'text-xs font-mono';
  player2Div.append(player2Name, player2Score);
  
  matchDiv.append(player1Div, player2Div);
  
  // Add VOD link if available
  const firstGame = matchup.games[0];
  if (firstGame.vod) {
    matchDiv.classList.add('cursor-pointer', 'hover:bg-gray-700', 'transition-colors');
    matchDiv.addEventListener('click', () => {
      window.open(firstGame.vod, '_blank');
    });
    
    // Add play icon
    const vodIndicator = document.createElement('div');
    vodIndicator.classList = 'text-xs text-center mt-1 text-blue-400';
    vodIndicator.innerHTML = '▶ Watch';
    matchDiv.appendChild(vodIndicator);
  }
  
  return matchDiv;
};

const createByeElement = (player) => {
  const byeDiv = document.createElement('div');
  byeDiv.classList = 'bg-gray-800 rounded p-2 space-y-1 min-w-[160px] flex justify-between items-center';

  const playerDiv = document.createElement('span');
  const result = document.createElement('span');

  playerDiv.classList = 'px-2 py-1 rounded text-sm font-semibold'
  playerDiv.textContent = player;

  result.classList = 'text-xs font-mono px-2'
  result.textContent = "Bye"

  byeDiv.appendChild(playerDiv)
  byeDiv.appendChild(result)


  return byeDiv
}

// Create round columns
const rounds = ['Round of 12', 'Quarterfinals', 'Semifinals', 'Finals'];
rounds.forEach((roundName, roundIndex) => {
  const roundDiv = document.createElement('div');
  roundDiv.classList = 'bracket-round';
  
  if (roundName === 'Round of 12') {
    roundDiv.classList.add('round-of-12');
  }
  
  const roundHeader = document.createElement('h4');
  roundHeader.textContent = roundName;
  roundHeader.classList = 'round-header font-semibold text-xs uppercase tracking-wider opacity-60';
  roundDiv.appendChild(roundHeader);
  
  const matchupsContainer = document.createElement('div');
  matchupsContainer.classList = 'flex flex-col justify-around  h-full';
  
  const matchups = getMatchups(gamesByRound[roundName]);
  
  // Calculate spacing based on round
  let spacingClass = '';
  if (roundName === 'Semifinals') {
    spacingClass = 'gap-32'; // Larger gap to center between quarterfinals
  } else if (roundName === 'Finals') {
    spacingClass = ''; // Single match, centered
  } else {
    spacingClass = 'gap-8'; // Normal spacing
  }
  
  if (spacingClass !== '') {
    matchupsContainer.classList.add(spacingClass);
  }
  
  
  if (matchups.length === 0) {
    // Create placeholder matches based on expected number
    let expectedMatches = 1;
    if (roundName === 'Round of 12') expectedMatches = 4;
    else if (roundName === 'Quarterfinals') expectedMatches = 4;
    else if (roundName === 'Semifinals') expectedMatches = 2;
    
    for (let i = 0; i < expectedMatches; i++) {
      const matchWrapper = document.createElement('div');
      matchWrapper.classList = 'bracket-match';
      
      const emptyMatch = document.createElement('div');
      emptyMatch.textContent = 'TBD';
      emptyMatch.classList = 'text-center text-gray-500 text-sm bg-gray-800 rounded p-4 min-w-[160px]';
      
      matchWrapper.appendChild(emptyMatch);
      matchupsContainer.appendChild(matchWrapper);
    }
  } else {
    
    matchups.forEach((matchup, matchIndex) => {
      const matchWrapper = document.createElement('div');
      matchWrapper.classList = 'bracket-match';

      // TODO: add an empty wrapper, if bye exists, append it to wrapper using bye helper function. Append bye to matchupsContainer
      const byeWrapper = document.createElement('div');
      
      matchWrapper.appendChild(createMatchElement(matchup));
      matchupsContainer.appendChild(matchWrapper);

      if (roundName === "Round of 12") {
        const selectedGroup = seasonGroups.filter((season) => season.league === league)

        const adjustedIndex = [0, 3, 1, 2]

        const byePlayer = selectedGroup[adjustedIndex[matchIndex]].players[0]
        byeWrapper.appendChild(createByeElement(byePlayer))
        matchupsContainer.appendChild(byeWrapper)
      }
    });
  }
  
  roundDiv.appendChild(matchupsContainer);
  bracketContainer.appendChild(roundDiv);
});

bracketWrapper.appendChild(bracketContainer);
bracket.appendChild(bracketWrapper);
playoffs.appendChild(bracket);

// Add some styling for the overall playoffs section
playoffs.classList = 'mt-8 overflow-x-auto';

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
const mapsArray = leagues.find(league => league.season === seasonNum).maps

mapsArray.forEach((map, index) => {
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

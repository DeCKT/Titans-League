import games from '../data/games.json'
import groups from '../data/groups.json'
import leagues from '../data/leagues.json'
import maps from '../data/maps.json'
import matches from '../data/matches.json'
import players from '../data/players.json'
import seasons from '../data/seasons.json'

const page_header = document.querySelector("#page_header");
const league_selector = document.querySelector("#league_selector");


const params = new URLSearchParams(window.location.search);

const seasonParam = params.get("season");


if (season) {
  document.title = `Season ${season} | T90 Titans League`;
  page_header.textContent = `Season ${season}`;
}

console.log(games)
import players from "../data/players.json";
import matches from "../data/matches.json";
import games from "../data/games.json";

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const ign = params.get("ign");

  if (!ign) return;

  const player = players.find((p) => p.ign.toLowerCase() === ign.toLowerCase());

  if (!player) return;

  const playerMatches = matches.filter(
    (m) =>
      m.player_1.name.toLowerCase() === player.ign.toLowerCase() ||
      m.player_2.name.toLowerCase() === player.ign.toLowerCase()
  );

  const playerGames = games.filter(
    (g) =>
      g.player_1.name.toLowerCase() === player.ign.toLowerCase() ||
      g.player_2.name.toLowerCase() === player.ign.toLowerCase()
  );

  // DOM elements
  const playerImg = document.getElementById("playerImg");
  const playerIgn = document.getElementById("playerIgn");
  const playerName = document.getElementById("playerName");
  const playerAge = document.getElementById("playerAge");
  const playerLinks = document.getElementById("playerLinks");
  const playerAppearances = document.getElementById("seasonAppearances");
  const playerWinLoss = document.getElementById("winLoss");
  const matchHistory = document.getElementById("matchHistory");
  const civStats = document.getElementById("civStats");
  const mapStats = document.getElementById("mapStats");

  // Set page title
  document.title = `${player.ign} - T90 Titans League`;

  // Set player details
  playerImg.src = player.img ?? "../assets/playerunknown.png";
  playerImg.alt = player.ign;
  playerIgn.textContent = player.ign;
  playerName.textContent = player.name || "Unknown";

  if (player.dob) {
    const birthDate = new Date(player.dob);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    playerAge.textContent = `${age} years old`;
  } else {
    playerAge.textContent = "Unknown";
  }

  // Calculate win/loss record
  let playerWin = 0,
    playerLoss = 0;

  playerGames.forEach((game) => {
    if (
      game.player_1.name.toLowerCase() === player.ign.toLowerCase() &&
      game.player_1.winner === true
    ) {
      playerWin++;
    } else if (
      game.player_2.name.toLowerCase() === player.ign.toLowerCase() &&
      game.player_2.winner === true
    ) {
      playerWin++;
    } else {
      playerLoss++;
    }
  });

  playerWinLoss.textContent = `${playerWin}W - ${playerLoss}L`;

  // Show season appearances
  const seasons = [...new Set(playerMatches.map(m => m.season))].sort();
  playerAppearances.textContent = seasons.map(s => `TTL${s}`).join(", ") || "None";

  // Generate social media links
  const platforms = {
    twitter: { color: "#1DA1F2", icon: "fa-twitter" },
    youtube: { color: "#FF0000", icon: "fa-youtube" },
    twitch: { color: "#9146FF", icon: "fa-twitch" },
    kick: { color: "#53FC18", icon: "fa-play" },
  };

  if (player.links && player.links.length > 0) {
    player.links.forEach((link) => {
      const platformKey = Object.keys(platforms).find((key) =>
        link.includes(key)
      );
      if (!platformKey) return;

      const { color, icon } = platforms[platformKey];

      const a = document.createElement("a");
      a.href = link;
      a.target = "_blank";
      a.className = "w-10 h-10 flex items-center justify-center rounded-full transition-transform hover:scale-110";
      a.style.backgroundColor = color;

      const i = document.createElement("i");
      i.className = `fab ${icon} text-white text-xl`;

      a.appendChild(i);
      playerLinks.appendChild(a);
    });
  } else {
    const noLinks = document.createElement("div");
    noLinks.textContent = "No social media links available";
    noLinks.className = "text-gray-500 text-sm italic";
    playerLinks.parentNode.appendChild(noLinks);
    playerLinks.remove();
  }

  // Generate match history
  matchHistory.innerHTML = '';
  playerMatches.sort((a, b) => b.season - a.season).forEach(match => {
    const isPlayer1 = match.player_1.name.toLowerCase() === player.ign.toLowerCase();
    const opponent = isPlayer1 ? match.player_2.name : match.player_1.name;
    const playerScore = isPlayer1 ? match.player_1.score : match.player_2.score;
    const opponentScore = isPlayer1 ? match.player_2.score : match.player_1.score;
    const result = playerScore > opponentScore ? 'Win' : (playerScore < opponentScore ? 'Loss' : 'Draw');
    const resultColor = result === 'Win' ? 'text-green-400' : (result === 'Loss' ? 'text-red-400' : '');
    
    const tr = document.createElement('tr');
    tr.className = 'border-b border-gray-800';
    tr.innerHTML = `
      <td class="px-4 py-3">TTL${match.season}</td>
      <td class="px-4 py-3">${opponent}</td>
      <td class="px-4 py-3 ${resultColor}">${result}</td>
      <td class="px-4 py-3">${playerScore} - ${opponentScore}</td>
    `;
    matchHistory.appendChild(tr);
  });

  if (playerMatches.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="4" class="px-4 py-3 text-center italic text-gray-500">No match history available</td>`;
    matchHistory.appendChild(tr);
  }

  // Generate civilization stats
  civStats.innerHTML = '';
  const civData = {};
  
  playerGames.forEach(game => {
    const isPlayer1 = game.player_1.name.toLowerCase() === player.ign.toLowerCase();
    const civ = isPlayer1 ? game.player_1.civ : game.player_2.civ;
    const isWin = isPlayer1 ? game.player_1.winner : game.player_2.winner;
    
    if (!civData[civ]) {
      civData[civ] = { wins: 0, losses: 0 };
    }
    
    if (isWin) {
      civData[civ].wins++;
    } else {
      civData[civ].losses++;
    }
  });

  Object.entries(civData)
    .sort(([, a], [, b]) => (b.wins + b.losses) - (a.wins + a.losses))
    .forEach(([civ, stats]) => {
      const div = document.createElement('div');
      div.className = 'bg-gray-800 p-3 rounded text-center';
      div.innerHTML = `
        <div class="text-sm text-sky-300">${civ}</div>
        <div class="text-xl font-light">${stats.wins}W - ${stats.losses}L</div>
      `;
      civStats.appendChild(div);
    });

  if (Object.keys(civData).length === 0) {
    civStats.innerHTML = '<div class="col-span-full text-center italic text-gray-500">No civilization data available</div>';
  }

  // Generate map stats
  mapStats.innerHTML = '';
  const mapData = {};
  
  playerGames.forEach(game => {
    const isPlayer1 = game.player_1.name.toLowerCase() === player.ign.toLowerCase();
    const isWin = isPlayer1 ? game.player_1.winner : game.player_2.winner;
    const map = game.map;
    
    if (!mapData[map]) {
      mapData[map] = { wins: 0, losses: 0 };
    }
    
    if (isWin) {
      mapData[map].wins++;
    } else {
      mapData[map].losses++;
    }
  });

  Object.entries(mapData)
    .sort(([, a], [, b]) => (b.wins + b.losses) - (a.wins + a.losses))
    .forEach(([map, stats]) => {
      const div = document.createElement('div');
      div.className = 'bg-gray-800 p-3 rounded text-center';
      div.innerHTML = `
        <div class="text-sm text-sky-300">${map}</div>
        <div class="text-xl font-light">${stats.wins}W - ${stats.losses}L</div>
      `;
      mapStats.appendChild(div);
    });

  if (Object.keys(mapData).length === 0) {
    mapStats.innerHTML = '<div class="col-span-full text-center italic text-gray-500">No map data available</div>';
  }
});
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

  console.log(playerMatches);
  console.log(playerGames);

  // DOM elements
  const playerImg = document.getElementById("playerImg");
  const playerIgn = document.getElementById("playerIgn");
  const playerName = document.getElementById("playerName");
  const playerAge = document.getElementById("playerAge");
  const playerLinks = document.getElementById("playerLinks");
  const playerAppearances = document.getElementById("seasonAppearances");
  const playerWinLoss = document.getElementById("winLoss");

  // Set player details
  playerImg.src = player.img ?? "../assets/playerunknown.png";
  playerIgn.textContent = player.ign;
  playerName.textContent = player.name;

  if (player.dob) {
    const birthDate = new Date(player.dob);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    playerAge.textContent = `${age} years old`;
  }

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

  // Generate social media links
  const platforms = {
    twitter: { color: "#1DA1F2", icon: "fa-twitter" },
    youtube: { color: "#FF0000", icon: "fa-youtube" },
    twitch: { color: "#9146FF", icon: "fa-twitch" },
    kick: { color: "#53FC18", icon: "fa-play" },
  };

  player.links?.forEach((link) => {
    const platformKey = Object.keys(platforms).find((key) =>
      link.includes(key)
    );
    if (!platformKey) return;

    const { color, icon } = platforms[platformKey];

    const a = document.createElement("a");
    a.href = link;
    a.target = "_blank";
    a.className = "w-10 h-10 flex items-center justify-center rounded-full";
    a.style.backgroundColor = color;

    const i = document.createElement("i");
    i.className = `fab ${icon} text-white text-xl`;

    a.appendChild(i);
    playerLinks.appendChild(a);
  });
});

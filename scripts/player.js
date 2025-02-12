import players from '../data/players.json';

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const ign = params.get('ign');

  if (!ign) return;

  const player = players.find(p => p.ign.toLowerCase() === ign.toLowerCase());

  if (!player) return;

  // DOM elements
  const playerImg = document.getElementById('playerImg');
  const playerIgn = document.getElementById('playerIgn');
  const playerName = document.getElementById('playerName');
  const playerAge = document.getElementById('playerAge');
  const playerLinks = document.getElementById('playerLinks');

  // Set player details
  playerImg.src = player.img ?? '../assets/playerunknown.png';
  playerIgn.textContent = player.ign;
  playerName.textContent = player.name;

  if (player.dob) {
    const birthDate = new Date(player.dob);
    const age = new Date().getFullYear() - birthDate.getFullYear();
    playerAge.textContent = `${age} years old`;
  }

  // Generate social media links
  const platforms = {
    twitter: { color: '#1DA1F2', icon: 'fa-twitter' },
    youtube: { color: '#FF0000', icon: 'fa-youtube' },
    twitch: { color: '#9146FF', icon: 'fa-twitch' },
    kick: { color: '#53FC18', icon: 'fa-play' },
  };

  player.links?.forEach(link => {
    const platformKey = Object.keys(platforms).find(key => link.includes(key));
    if (!platformKey) return;

    const { color, icon } = platforms[platformKey];
    
    const a = document.createElement('a');
    a.href = link;
    a.target = '_blank';
    a.className = 'w-10 h-10 flex items-center justify-center rounded-full';
    a.style.backgroundColor = color;

    const i = document.createElement('i');
    i.className = `fab ${icon} text-white text-xl`;

    a.appendChild(i);
    playerLinks.appendChild(a);
  });
});

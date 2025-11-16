function animateNumber(el, target) {
  let current = 0;
  const step = Math.ceil(target / 60); // ~1 second animation

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current;
  }, 16);
}

async function loadStats() {
  const username = "Gurjaka"; // CHANGE IF NEEDED

  const response = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100`,
    { headers: { "User-Agent": "Mozilla/5.0" } },
  );

  const repos = await response.json();

  if (!Array.isArray(repos)) {
    console.error("GitHub API error:", repos);
    return;
  }

  const projectCount = repos.length;
  const totalStars = repos.reduce(
    (sum, r) => sum + (r.stargazers_count || 0),
    0,
  );

  document.getElementById("stat-projects").textContent = projectCount;
  document.getElementById("stat-stars").textContent = totalStars;
}

loadStats();

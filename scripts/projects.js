const USER = "Gurjaka";
const ORGS = ["pretty-terminal"]; // add more orgs here if needed

async function fetchRepos() {
  const userRepos = await fetch(
    `https://api.github.com/users/${USER}/repos?per_page=100`,
  ).then((res) => res.json());

  let orgRepos = [];
  for (const org of ORGS) {
    const repos = await fetch(
      `https://api.github.com/orgs/${org}/repos?per_page=100`,
    ).then((res) => res.json());
    orgRepos.push(...repos);
  }

  const all = [...userRepos, ...orgRepos];

  // Remove forks unless important
  const filtered = all.filter(
    (repo) => !repo.fork || ["pretty-terminal/pretty"].includes(repo.full_name),
  );

  // Sort by created date (newest first)
  filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  return filtered;
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function createCheckpoint(repo, index) {
  const side = index % 2 === 0 ? "left" : "right";

  return `
    <div class="checkpoint ${side}">
      <div class="checkpoint-inner">

          <div class="repo-top">
              <img class="repo-avatar" src="${repo.owner.avatar_url}" alt="${repo.owner.login}">
              <span class="repo-date">${formatDate(repo.created_at)}</span>
          </div>

          <h2 class="repo-title">${repo.name}</h2>
          <p>${repo.description || "No description provided."}</p>
          <a class="repo-link" href="${repo.html_url}" target="_blank">View on GitHub</a>

      </div>
    </div>
  `;
}

async function buildTimeline() {
  const timeline = document.getElementById("timeline");
  const repos = await fetchRepos();

  timeline.innerHTML = repos
    .map((repo, i) => createCheckpoint(repo, i))
    .join("");
}

buildTimeline();

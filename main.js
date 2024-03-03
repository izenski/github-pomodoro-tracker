
let countdown;
const timerDisplay = document.querySelector('#timer');
const startButton = document.querySelector('#start');
const stopButton = document.querySelector('#stop');
const issueSelector = document.querySelector('#issues');
const username = document.querySelector('#username');
const repository = document.querySelector('#repository');

const githubUsername = localStorage.getItem('githubUsername');
const githubRepo = localStorage.getItem('githubRepo');
const githubToken = localStorage.getItem('githubToken');

if (!githubUsername || !githubRepo || !githubToken) {
  // set username, repo, and token values before starting
  window.location.href = 'settings.html';
}

username.textContent = `User/Org: ${githubUsername}`;
repository.textContent = `Repository: ${githubRepo}`;

startButton.addEventListener('click', startTimer);
stopButton.addEventListener('click', stopTimer);

fetchIssues(githubUsername, githubRepo, githubToken);

function timer(seconds) {
  const now = Date.now();
  const then = now + seconds * 1000;
  displayTimeLeft(seconds);

  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    if(secondsLeft < 0) {
      clearInterval(countdown);
      return;
    }
    displayTimeLeft(secondsLeft);
  }, 1000);
}

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
  timerDisplay.textContent = display;
}

function startTimer() {
  const seconds = 25 * 60; // 25 minutes
  clearInterval(countdown);
  timer(seconds);
}

function stopTimer() {
  clearInterval(countdown);
}

function fetchIssues(username, repo, token) {

  fetch(`https://api.github.com/repos/${username}/${repo}/issues`, {
    headers: {
      Authorization: `token ${token}`
    }
  })
    .then(response => response.json())
    .then(issues => {
      issues.sort((a, b) => a.title.localeCompare(b.title));
      issues.forEach(issue => {
        const option = document.createElement('option');
        option.value = issue.number;
        option.textContent = issue.title;
        issueSelector.appendChild(option);
      });
    });
}

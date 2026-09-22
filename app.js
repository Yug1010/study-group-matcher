const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const groups = []; // in-memory data store

const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const sha = process.env.GIT_SHA || process.env.RENDER_GIT_COMMIT || 'local';
const commit = sha.slice(0, 7);

const page = (groupItems, totalGroups) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CampusMatch — Study Groups</title>
  <style>
    :root {
      --ink: #172033;
      --muted: #667085;
      --line: #e7eaf0;
      --paper: #f7f8fb;
      --card: #ffffff;
      --primary: #4355b9;
      --primary-dark: #34439a;
      --soft: #eef1ff;
      --green: #16845b;
      --shadow: 0 12px 35px rgba(23, 32, 51, .08);
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }

    body {
      margin: 0;
      color: var(--ink);
      background: var(--paper);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
        "Segoe UI", sans-serif;
    }

    button, input { font: inherit; }

    .topbar {
      height: 68px;
      background: rgba(255,255,255,.94);
      border-bottom: 1px solid var(--line);
      display: flex;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 10;
      backdrop-filter: blur(10px);
    }

    .nav {
      width: min(1120px, calc(100% - 36px));
      margin: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 11px;
      color: var(--ink);
      text-decoration: none;
      font-weight: 750;
      letter-spacing: -.02em;
    }

    .brand-mark {
      width: 35px;
      height: 35px;
      border-radius: 10px;
      background: var(--primary);
      color: white;
      display: grid;
      place-items: center;
      font-weight: 800;
    }

    .nav-link {
      color: var(--muted);
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
    }

    .nav-link:hover { color: var(--primary); }

    .container {
      width: min(1120px, calc(100% - 36px));
      margin: auto;
    }

    .hero {
      padding: 72px 0 42px;
      display: grid;
      grid-template-columns: 1.25fr .75fr;
      gap: 55px;
      align-items: center;
    }

    .eyebrow {
      color: var(--primary);
      font-size: 13px;
      font-weight: 800;
      letter-spacing: .08em;
      text-transform: uppercase;
      margin-bottom: 14px;
    }

    h1 {
      font-size: clamp(40px, 5vw, 64px);
      line-height: .98;
      letter-spacing: -.055em;
      margin: 0;
      max-width: 690px;
    }

    .hero-copy {
      color: var(--muted);
      font-size: 17px;
      line-height: 1.65;
      max-width: 600px;
      margin: 22px 0 0;
    }

    .hero-note {
      margin-top: 25px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--green);
      font-size: 13px;
      font-weight: 700;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #26a269;
      box-shadow: 0 0 0 4px #dff5eb;
    }

    .hero-card {
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 20px;
      padding: 25px;
      box-shadow: var(--shadow);
    }

    .hero-card-title {
      font-size: 13px;
      color: var(--muted);
      font-weight: 700;
      margin-bottom: 18px;
    }

    .mini-stat {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 0;
      border-top: 1px solid var(--line);
    }

    .mini-stat strong { font-size: 25px; }
    .mini-stat span { color: var(--muted); font-size: 13px; }

    .content {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 28px;
      padding-bottom: 70px;
    }

    .panel {
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 24px;
    }

    .panel h2 {
      margin: 0;
      font-size: 19px;
      letter-spacing: -.025em;
    }

    .panel-sub {
      color: var(--muted);
      font-size: 13px;
      line-height: 1.5;
      margin: 7px 0 21px;
    }

    label {
      display: block;
      color: #3b4353;
      font-size: 12px;
      font-weight: 750;
      margin: 15px 0 7px;
    }

    input {
      width: 100%;
      border: 1px solid #dfe3ea;
      border-radius: 10px;
      padding: 12px 13px;
      color: var(--ink);
      background: white;
      outline: none;
      transition: border-color .18s, box-shadow .18s;
    }

    input:focus {
      border-color: #8893dc;
      box-shadow: 0 0 0 3px var(--soft);
    }

    .submit {
      width: 100%;
      border: 0;
      border-radius: 10px;
      padding: 13px 16px;
      margin-top: 19px;
      color: white;
      background: var(--primary);
      font-weight: 750;
      cursor: pointer;
      transition: transform .18s, background .18s;
    }

    .submit:hover {
      background: var(--primary-dark);
      transform: translateY(-1px);
    }

    .groups-header {
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 20px;
      margin-bottom: 15px;
    }

    .groups-title h2 { margin: 0; font-size: 22px; }
    .groups-title p { margin: 5px 0 0; color: var(--muted); font-size: 13px; }

    .search {
      width: 210px;
      padding: 10px 12px;
    }

    .groups {
      display: grid;
      gap: 12px;
    }

    .group-card {
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 15px;
      padding: 19px;
      transition: box-shadow .18s, transform .18s, border-color .18s;
    }

    .group-card:hover {
      border-color: #d5d9e8;
      box-shadow: 0 8px 25px rgba(23,32,51,.06);
      transform: translateY(-1px);
    }

    .group-top {
      display: flex;
      justify-content: space-between;
      gap: 15px;
      align-items: start;
    }

    .course {
      display: inline-block;
      color: var(--primary);
      background: var(--soft);
      border-radius: 7px;
      padding: 5px 8px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: .03em;
    }

    .group-card h3 {
      margin: 10px 0 5px;
      font-size: 17px;
      letter-spacing: -.02em;
    }

    .creator {
      margin: 0;
      color: var(--muted);
      font-size: 13px;
    }

    .group-id {
      color: #98a0ae;
      font-size: 11px;
    }

    .empty {
      border: 1px dashed #cfd4df;
      border-radius: 15px;
      padding: 38px 20px;
      text-align: center;
      color: var(--muted);
      background: rgba(255,255,255,.6);
    }

    .empty strong {
      display: block;
      color: var(--ink);
      margin-bottom: 5px;
    }

    footer {
      border-top: 1px solid var(--line);
      background: white;
      padding: 18px 0;
      color: #8a92a1;
      font-size: 12px;
    }

    footer .container {
      display: flex;
      justify-content: space-between;
      gap: 20px;
    }

    @media (max-width: 820px) {
      .hero {
        grid-template-columns: 1fr;
        padding-top: 52px;
        gap: 30px;
      }

      .content { grid-template-columns: 1fr; }
      .search { width: 100%; }
      .groups-header { align-items: stretch; flex-direction: column; }
    }

    @media (max-width: 520px) {
      .nav-link { display: none; }
      .hero { padding-top: 42px; }
      h1 { font-size: 42px; }
      .container, .nav { width: min(100% - 24px, 1120px); }
      .panel { padding: 19px; }
      footer .container { flex-direction: column; gap: 6px; }
    }
  </style>
</head>
<body>
  <header class="topbar">
    <nav class="nav">
      <a class="brand" href="/">
        <span class="brand-mark">CM</span>
        <span>CampusMatch</span>
      </a>
      <a class="nav-link" href="#groups">Browse study groups</a>
    </nav>
  </header>

  <main>
    <section class="container hero">
      <div>
        <div class="eyebrow">Campus Study Group Matcher</div>
        <h1>Find people who learn like you.</h1>
        <p class="hero-copy">
          Create a study group around a course or topic and make it easier
          for classmates to find the right people to learn with.
        </p>
        <div class="hero-note">
          <span class="dot"></span>
          ${totalGroups} active group${totalGroups === 1 ? '' : 's'} on campus
        </div>
      </div>

      <aside class="hero-card">
        <div class="hero-card-title">COMMUNITY SNAPSHOT</div>
        <div class="mini-stat">
          <span>Study groups</span>
          <strong>${totalGroups}</strong>
        </div>
        <div class="mini-stat">
          <span>Simple to join</span>
          <strong>01</strong>
        </div>
        <div class="mini-stat">
          <span>Built for students</span>
          <strong>24/7</strong>
        </div>
      </aside>
    </section>

    <section class="container content">
      <div class="panel">
        <h2>Start a group</h2>
        <p class="panel-sub">Have a topic in mind? Put it out there and let classmates find you.</p>

        <form method="POST" action="/groups">
          <label for="name">Your name</label>
          <input id="name" name="name" placeholder="e.g. Yug Agarwal" required maxlength="80">

          <label for="course">Course code</label>
          <input id="course" name="course" placeholder="e.g. CSE3004" required maxlength="30">

          <label for="topic">What are you studying?</label>
          <input id="topic" name="topic" placeholder="e.g. Docker & CI/CD" required maxlength="100">

          <button class="submit" type="submit">Create study group</button>
        </form>
      </div>

      <div id="groups">
        <div class="groups-header">
          <div class="groups-title">
            <h2>Study groups</h2>
            <p>See what students are currently studying together.</p>
          </div>
          <input class="search" id="search" type="search" placeholder="Search groups...">
        </div>

        <div class="groups" id="group-list">
          ${groupItems || `<div class="empty">
            <strong>No study groups yet</strong>
            Be the first student to create one.
          </div>`}
        </div>
      </div>
    </section>
  </main>

  <footer>
    <div class="container">
      <span>CampusMatch · Campus Study Group Matcher</span>
      <span>Build ${esc(commit)}</span>
    </div>
  </footer>

  <script>
    const search = document.getElementById('search');
    const cards = [...document.querySelectorAll('.group-card')];

    search?.addEventListener('input', () => {
      const query = search.value.trim().toLowerCase();
      cards.forEach(card => {
        card.style.display = card.textContent.toLowerCase().includes(query) ? '' : 'none';
      });
    });
  </script>
</body>
</html>`;

app.get('/', (req, res) => {
    const items = groups.map((g) => `
    <article class="group-card">
      <div class="group-top">
        <div>
          <span class="course">${esc(g.course)}</span>
          <h3>${esc(g.topic)}</h3>
          <p class="creator">Created by ${esc(g.name)}</p>
        </div>
        <span class="group-id">#${esc(g.id)}</span>
      </div>
    </article>
  `).join('');

    res.send(page(items, groups.length));
});

app.post('/groups', (req, res) => {
    const { name, course, topic } = req.body;
    if (!name || !course || !topic) {
        return res.status(400).send('All fields are required');
    }

    groups.push({
        id: groups.length + 1,
        name,
        course,
        topic
    });

    res.redirect('/');
});

app.get('/api/groups', (req, res) => res.json(groups));

app.get('/health', (req, res) => res.json({ status: 'ok', commit }));

module.exports = app;

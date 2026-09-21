const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const groups = []; // in-memory data store
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const sha = process.env.GIT_SHA || process.env.RENDER_GIT_COMMIT || 'local';
const commit = sha.slice(0, 7);

app.get('/', (req, res) => {
    const items = groups
        .map((g) => `<li><b>${esc(g.course)}</b>: ${esc(g.topic)} (Creator: ${esc(g.name)})</li>`)
        .join('');
    res.send(`<h1>Campus Study Group Matcher</h1>
    <form method="POST" action="/groups">
      <input name="name" placeholder="Your Name" required>
      <input name="course" placeholder="Course Code" required>
      <input name="topic" placeholder="Topic" required>
      <button type="submit">Create Group</button>
    </form>
    <ul>${items.length ? items : '<li>No study groups posted yet.</li>'}</ul>
    <footer>commit ${commit}</footer>`);
});

app.post('/groups', (req, res) => {
    const { name, course, topic } = req.body;
    if (!name || !course || !topic) return res.status(400).send('All fields are required');
    groups.push({ id: groups.length + 1, name, course, topic });
    res.redirect('/');
});

app.get('/api/groups', (req, res) => res.json(groups));
app.get('/health', (req, res) => res.json({ status: 'ok', commit }));

module.exports = app;
const { test } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../app');

test('health, create study group, and api validation', async () => {
    const server = app.listen(0);
    const base = `http://127.0.0.1:${server.address().port}`;

    // 1. Test health check route
    const health = await (await fetch(`${base}/health`)).json();
    assert.equal(health.status, 'broken');

    // 2. Test posting a new study group form
    const post = await fetch(`${base}/groups`, {
        method: 'POST',
        body: new URLSearchParams({ name: 'Alice', course: 'CSE3004', topic: 'Docker & CI/CD' }),
        redirect: 'manual',
    });
    assert.equal(post.status, 302); // Redirects back to home on success

    // 3. Test JSON API route
    const list = await (await fetch(`${base}/api/groups`)).json();
    assert.equal(list[0].course, 'CSE3004');

    // 4. Test invalid input handling (missing fields)
    const bad = await fetch(`${base}/groups`, {
        method: 'POST',
        body: new URLSearchParams({ name: '' }),
    });
    assert.equal(bad.status, 400); // Bad request error

    server.close();
});
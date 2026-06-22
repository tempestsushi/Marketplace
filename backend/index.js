import app from './app.js';

const port = Number(process.env.PORT) || 8787;

const server = app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});

server.on('error', (err) => {
  console.error('API server error:', err);
});

process.stdin.resume();

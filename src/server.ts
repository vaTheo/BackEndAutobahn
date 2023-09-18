// import authRoutes from './routes/auth';

// addEventListener('fetch', (event: any) => {
//   event.respondWith(authRoutes.handle(event.request))
// })

import { IttyRouter } from './itty-router';
import { Request } from 'node-fetch';
import http from 'http';

const router = new IttyRouter();

router.get('/hello', (req: Request) => new Response('Hello, World!'));

const server = http.createServer((req, res) => {
  const fetchReq = new Request(req.url!, { method: req.method });
  const response = router.handle(fetchReq);

  res.writeHead(response.status, { ...response.headers });
  response.text().then(body => {
    res.end(body);
  });
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
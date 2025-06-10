import { test } from 'tap';
import fastify from '../../src/app';

test('GET /ping deve retornar { code: 200, message: "Pong" }', async (t) => {
  const app = fastify;

  const response = await app.inject({
    method: 'GET',
    url: '/ping',
  });

  t.equal(response.statusCode, 200);
  t.same(response.json(), {
    code: 200,
    message: 'Pong',
  });
});

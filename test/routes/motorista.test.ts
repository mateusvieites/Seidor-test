import { test } from 'tap';
import fastify from '../../src/app';
const app = fastify;

test('POST /motoristas cadastra um novo motorista', async (t) => {
  const res = await app.inject({
    method: 'POST',
    url: '/motoristas',
    payload: {
      nome: 'mateus',
    },
  });

  t.equal(res.statusCode, 200);
  t.same(res.json(), {
    code: 200,
    message: 'Usuário cadastrado com sucesso',
    content: {
      nome: 'mateus',
      deletado: false,
      id: 0,
    },
  });
});

test('GET /motoristas retorna lista de motoristas', async (t) => {
  const res = await app.inject({
    method: 'GET',
    url: '/motoristas',
  });

  t.equal(res.statusCode, 200);
  t.same(res.json(), {
    code: 200,
    content: [
      {
        id: 0,
        nome: 'mateus',
        deletado: false,
      },
    ],
  });
});

test('PATCH /motoristas/:id atualiza um motorista', async (t) => {
  const res = await app.inject({
    method: 'PATCH',
    url: '/motoristas/0',
    payload: {
      nome: 'jorge',
    },
  });

  t.equal(res.statusCode, 200);
  t.same(res.json(), {
    code: 200,
    message: 'Usuário Atualizado com sucesso',
    content: {
      nome: 'jorge',
      deletado: false,
      id: 0,
    },
  });
});

test('DELETE /motoristas/:id exclui um motorista', async (t) => {
  const res = await app.inject({
    method: 'DELETE',
    url: '/motoristas/0',
  });

  t.equal(res.statusCode, 200);
  t.same(res.json(), {
    code: 200,
    message: 'Excluido com sucesso',
  });
});

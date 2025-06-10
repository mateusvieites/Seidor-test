import { test } from 'tap';
import fastify from '../../src/app';
const app = fastify;

test('POST /veiculos cadastra um novo veículo', async (t) => {
  const res = await app.inject({
    method: 'POST',
    url: '/veiculos',
    payload: {
      marca: 'Fiat',
      cor: 'preto',
      placa: 'ABC1234',
    },
  });

  t.equal(res.statusCode, 200);
  t.same(res.json(), {
    code: 200,
    message: 'Criado com Sucesso!',
  });
});

test('GET /veiculos retorna lista de veículos', async (t) => {
  const res = await app.inject({
    method: 'GET',
    url: '/veiculos',
  });

  t.equal(res.statusCode, 200);
  t.same(res.json(), {
    code: 200,
    content: [
      {
        id: 0,
        marca: 'fiat',
        cor: 'preto',
        placa: 'abc1234',
        deletado: false,
      },
    ],
  });
});

test('PATCH /veiculos/:id atualiza um veículo', async (t) => {
  const res = await app.inject({
    method: 'PATCH',
    url: '/veiculos/0',
    payload: {
      cor: 'azul',
    },
  });

  t.equal(res.statusCode, 200);
  t.same(res.json(), {
    code: 200,
    message: 'Dados atualizados com sucesso',
  });
});

test('DELETE /veiculos/:id exclui um veículo', async (t) => {
  const res = await app.inject({
    method: 'DELETE',
    url: '/veiculos/0',
  });

  t.equal(res.statusCode, 200);
  t.same(res.json(), {
    code: 200,
    message: 'Dados atualizados com sucesso',
  });
});

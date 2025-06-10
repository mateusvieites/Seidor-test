import { test } from 'tap';
import fastify from '../../src/app';
const app = fastify;

test('POST /veiculos cadastra um novo veículo', async (t) => {
  await Promise.all([
    app.inject({
      method: 'POST',
      url: '/motoristas',
      payload: {
        nome: 'mateus',
      },
    }),
    app.inject({
      method: 'POST',
      url: '/veiculos',
      payload: {
        marca: 'Fiat',
        cor: 'preto',
        placa: 'abc1234',
      },
    }),
  ]);

  const res = await app.inject({
    method: 'POST',
    url: '/controle-de-veiculos',
    payload: {
      motorista_id: 0,
      veiculo_id: 0,
      motivo: 'viagem',
    },
  });

  const data = new Date();
  const ano = data.getFullYear();
  const mes = (data.getMonth() + 1).toString().padStart(2, '0');
  const dia = data.getDate().toString().padStart(2, '0');

  t.equal(res.statusCode, 200);
  t.same(res.json(), {
    code: 200,
    content: {
      automovelId: 0,
      dataInicio: `${ano}-${mes}-${dia}`,
      motivo: 'viagem',
      motoristaId: 0,
      deletado: false,
      id: 0,
    },
  });
});

test('GET /controle-de-veiculos retorna lista de motoristas', async (t) => {
  const res = await app.inject({
    method: 'GET',
    url: '/controle-de-veiculos',
  });

  t.equal(res.statusCode, 200);
});

test('POST /controle-de-veiculos/finalizar/:id retorna lista de motoristas', async (t) => {
  const res = await app.inject({
    method: 'POST',
    url: '/controle-de-veiculos/finalizar/0',
    payload: {},
  });

  t.equal(res.statusCode, 200);
});

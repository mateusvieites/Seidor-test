import { FastifyInstance, FastifyRequest } from 'fastify';
import { VeiculoService } from '../services/veiculo.services';

export async function veiculoRoutes(fastify: FastifyInstance) {
  const vs = new VeiculoService();

  fastify.get(
    '/veiculos',
    {
      schema: {
        description: 'Retorna uma lista de veiculos',
        tags: ['veiculos'],
      },
    },
    async (
      request: FastifyRequest<{
        Querystring: { cor?: string; marca?: string };
      }>,
      reply
    ) => {
      const { cor, marca } = request.query;
      const veiculos = await vs.listar(cor, marca);
      reply.send({
        code: 200,
        content: veiculos,
      });
    }
  );

  fastify.post(
    '/veiculos',
    {
      schema: {
        description: 'Registra um novo veiculo',
        tags: ['veiculos'],
        body: {
          type: 'object',
          required: ['marca', 'cor', 'placa'],
          additionalProperties: false,
          properties: {
            marca: { type: 'string' },
            cor: { type: 'string' },
            placa: { type: 'string' },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{
        Body: { marca: string; cor: string; placa: string };
      }>,
      reply
    ) => {
      const { marca, cor, placa } = request.body;
      const veiculo = await vs.cadastrar(marca, cor, placa);
      reply.send({
        code: 200,
        message: 'Criado com Sucesso!',
      });
    }
  );

  fastify.patch(
    '/veiculos/:id',
    {
      schema: {
        description: 'Editar um registro',
        tags: ['veiculos'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'number' },
          },
        },
        body: {
          type: 'object',
          additionalProperties: false,
          properties: {
            marca: { type: 'string' },
            cor: { type: 'string' },
            placa: { type: 'string' },
          },
        },
        anyOf: [
          { required: ['marca'] },
          { required: ['cor'] },
          { required: ['placa'] },
        ],
      },
    },

    async (
      request: FastifyRequest<{
        Body: {
          marca?: string;
          cor?: string;
          placa?: string;
          deletado?: boolean;
        };
        Params: { id: number };
      }>,
      reply
    ) => {
      const id = request.params.id;
      const veiculoExistente = await vs.validarExistencia(id);
      if (!veiculoExistente) {
        return reply
          .code(404)
          .send({ code: 404, message: 'Veiculo não encontrado' });
      }

      const { cor, deletado, marca, placa } = request.body;
      const veiculo = await vs.atualizar(id, { cor, deletado, marca, placa });

      if (!veiculo) {
        reply.send({
          code: 400,
          message: 'Algo deu errado',
        });
      }

      reply.send({
        code: 200,
        message: 'Dados atualizados com sucesso',
      });
    }
  );

  fastify.delete(
    '/veiculos/:id',
    {
      schema: {
        description: 'Apaga um registro (softdelete)',
        tags: ['veiculos'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'number' },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Params: { id: number } }>, reply) => {
      const id = request.params.id;
      const veiculoExistente = await vs.validarExistencia(id);
      if (!veiculoExistente) {
        return reply
          .code(404)
          .send({ code: 404, message: 'Veiculo não encontrado' });
      }

      const veiculo = await vs.excluir(id);

      if (!veiculo) {
        reply.send({
          code: 400,
          message: 'Algo deu errado',
        });
      }

      reply.send({
        code: 200,
        message: 'Dados atualizados com sucesso',
      });
    }
  );
}

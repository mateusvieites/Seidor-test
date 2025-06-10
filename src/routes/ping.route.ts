import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export async function pingRoutes(fastify: FastifyInstance, opts: any) {
  fastify.get(
    '/ping',
    {
      schema: {
        description: 'Retorna pong',
        tags: ['utils'],
        response: {
          200: {
            description: 'Sucesso',
            type: 'object',
            properties: {
              code: { type: 'number' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      return reply.code(200).send({ code: 200, message: 'Pong' });
    }
  );
}

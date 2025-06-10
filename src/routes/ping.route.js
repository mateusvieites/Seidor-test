"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pingRoutes = pingRoutes;
async function pingRoutes(fastify, opts) {
    fastify.get('/ping', {
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
    }, async (request, reply) => {
        return reply.code(200).send({ code: 200, message: 'Pong' });
    });
}

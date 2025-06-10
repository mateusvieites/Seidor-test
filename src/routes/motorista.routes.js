"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.motoristaRoutes = motoristaRoutes;
const motorista_services_1 = require("../services/motorista.services");
async function motoristaRoutes(fastify) {
    const ms = new motorista_services_1.MotoristaService();
    fastify.get('/motoristas', {
        schema: {
            description: 'Retorna a lista de motoristas cadastrados',
            tags: ['motoristas'],
        },
    }, async (request, reply) => {
        const nome = request.query.nome;
        const content = await ms.listar(nome);
        return reply.code(200).send({
            code: 200,
            content,
        });
    });
    fastify.post('/motoristas', {
        schema: {
            description: 'Cria um novo registro',
            tags: ['motoristas'],
            body: {
                type: 'object',
                required: ['nome'],
                additionalProperties: false,
                properties: {
                    nome: { type: 'string' },
                },
            },
        },
    }, async (request, reply) => {
        const nome = request.body.nome;
        const motorista = await ms.cadastrar(nome);
        if (motorista)
            return reply.code(200).send({
                code: 200,
                message: 'Usuário cadastrado com sucesso',
                content: motorista,
            });
        return reply.code(400).send({
            code: 400,
            message: 'Houve um problema e não pode ser cadastrado',
        });
    });
    fastify.patch('/motoristas/:id', {
        schema: {
            description: 'Editar um registro',
            tags: ['motoristas'],
            body: {
                type: 'object',
                additionalProperties: false,
                properties: {
                    deletado: { type: 'boolean' },
                    nome: { type: 'string' },
                },
                anyOf: [{ required: ['deletado'] }, { required: ['nome'] }],
            },
            params: {
                type: 'object',
                required: ['id'], // campos obrigatórios
                properties: {
                    id: { type: 'number' },
                },
            },
        },
    }, async (request, reply) => {
        const { deletado, nome } = request.body;
        const id = request.params.id;
        const usuarioExiste = await ms.validarExistencia(id);
        if (!usuarioExiste)
            return reply
                .code(404)
                .send({ code: 404, message: 'Motorista não encontrado' });
        const motorista = await ms.atualizar(id, { deletado, nome });
        if (motorista?.id === id) {
            return reply.code(200).send({
                code: 200,
                message: 'Usuário Atualizado com sucesso',
                content: motorista,
            });
        }
        return reply.code(400).send({
            code: 400,
            message: 'Houve um erro e os dados não foram atualizados',
        });
    });
    fastify.delete('/motoristas/:id', {
        schema: {
            description: 'Apaga um registro (softdelete)',
            tags: ['motoristas'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                },
            },
        },
    }, async (request, reply) => {
        const id = request.params.id;
        const usuarioExiste = await ms.validarExistencia(id);
        if (!usuarioExiste)
            return reply
                .code(404)
                .send({ code: 404, message: 'Motorista não encontrado' });
        const deletado = await ms.excluir(id);
        if (deletado)
            return reply
                .code(200)
                .send({ code: 200, message: 'Excluido com sucesso' });
        return reply
            .code(400)
            .send({ code: 400, message: 'Houve um erro e ação não foi realizada' });
    });
}

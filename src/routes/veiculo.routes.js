"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.veiculoRoutes = veiculoRoutes;
const veiculo_services_1 = require("../services/veiculo.services");
async function veiculoRoutes(fastify) {
    const vs = new veiculo_services_1.VeiculoService();
    fastify.get('/veiculos', {
        schema: {
            description: 'Retorna uma lista de veiculos',
            tags: ['veiculos'],
        },
    }, async (request, reply) => {
        const { cor, marca } = request.query;
        const veiculos = await vs.listar(cor, marca);
        reply.send({
            code: 200,
            content: veiculos,
        });
    });
    fastify.post('/veiculos', {
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
    }, async (request, reply) => {
        const { marca, cor, placa } = request.body;
        const veiculo = await vs.cadastrar(marca, cor, placa);
        reply.send({
            code: 200,
            message: 'Criado com Sucesso!',
        });
    });
    fastify.patch('/veiculos/:id', {
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
    }, async (request, reply) => {
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
    });
    fastify.delete('/veiculos/:id', {
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
    }, async (request, reply) => {
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
    });
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utilizacaoVeiculosRoutes = utilizacaoVeiculosRoutes;
const motorista_services_1 = require("../services/motorista.services");
const utilizacaoVeiculo_services_1 = require("../services/utilizacaoVeiculo.services");
const veiculo_services_1 = require("../services/veiculo.services");
async function utilizacaoVeiculosRoutes(fastify, opts) {
    const uvs = new utilizacaoVeiculo_services_1.UtilizacaoVeiculoService();
    const ms = new motorista_services_1.MotoristaService();
    const vs = new veiculo_services_1.VeiculoService();
    fastify.get('/controle-de-veiculos', {
        schema: {
            description: 'Retorna todos os registros de saida de veiculos',
            tags: ['controle-de-veiculos'],
        },
    }, async (request, reply) => {
        const content = await uvs.listar();
        return reply.code(200).send({
            code: 200,
            content: content,
        });
    });
    fastify.post('/controle-de-veiculos', {
        schema: {
            description: 'Retorna todos os registros de saida de veiculos',
            tags: ['controle-de-veiculos'],
            body: {
                type: 'object',
                additionalProperties: false,
                required: ['motorista_id', 'veiculo_id', 'motivo'],
                properties: {
                    data_inicio: { type: 'string', format: 'date' },
                    motorista_id: { type: 'number' },
                    veiculo_id: { type: 'number' },
                    motivo: { type: 'string' },
                },
            },
            response: {
                200: {
                    description: 'Sucesso',
                    type: 'object',
                    properties: {
                        code: { type: 'number' },
                        content: {
                            type: 'object',
                            message: 'Controle cadastrado com sucesso',
                            properties: {
                                automovelId: { type: 'number' },
                                dataInicio: { type: 'string', format: 'date' },
                                deletado: { type: 'boolean' },
                                id: { type: 'number' },
                                motivo: { type: 'string' },
                                motoristaId: { type: 'number' },
                            },
                        },
                    },
                },
            },
        },
    }, async (request, reply) => {
        const motoristaId = request.body.motorista_id;
        const veiculoId = request.body.veiculo_id;
        const [motoristaExistente, veiculoExistente] = await Promise.all([
            ms.validarExistencia(motoristaId),
            vs.validarExistencia(veiculoId),
        ]);
        const dataInicio = request.body.data_inicio ?? new Date();
        const motivo = request.body.motivo;
        if (!motoristaExistente) {
            return reply
                .code(404)
                .send({ code: 404, message: 'Motorista não encontrado' });
        }
        if (!veiculoExistente) {
            return reply
                .code(404)
                .send({ code: 404, message: 'Veiculo não encontrado' });
        }
        const veiculoEmUso = (await uvs.listar()).find((uv) => uv.automovelId === veiculoId && !uv.dataFim);
        if (veiculoEmUso) {
            return reply.code(400).send({
                code: 400,
                message: `Veiculo já está em uso, usuário responsável: ${veiculoEmUso.motorista.nome}`,
            });
        }
        const uv = await uvs.criar({
            automovelId: veiculoId,
            dataInicio: dataInicio,
            motoristaId,
            motivo,
        });
        return reply.code(200).send({
            code: 200,
            message: 'Controle cadastrado com sucesso',
            content: uv,
        });
    });
    fastify.post('/controle-de-veiculos/finalizar/:id', {
        schema: {
            description: 'Finaliza uma locação',
            tags: ['controle-de-veiculos'],
            body: {
                type: 'object',
                additionalProperties: false,
                properties: {
                    data_fim: { type: 'string', format: 'date' },
                },
            },
            params: {
                type: 'object',
                properties: {
                    id: { type: 'number' },
                },
                required: ['id'],
            },
            response: {
                200: {
                    description: 'Sucesso',
                    type: 'object',
                    properties: {
                        code: { type: 'number' },
                        content: {
                            type: 'object',
                            properties: {
                                automovelId: { type: 'number' },
                                dataFim: { type: 'string', format: 'date' },
                                dataInicio: { type: 'string', format: 'date' },
                                deletado: { type: 'boolean' },
                                id: { type: 'number' },
                                motivo: { type: 'string' },
                                motoristaId: { type: 'number' },
                            },
                        },
                    },
                },
            },
        },
    }, async (request, reply) => {
        const dataFim = request.body.data_fim ?? new Date();
        const id = request.params.id;
        const uvPesquisa = await uvs.pesquisarPorId(id);
        if (!uvPesquisa)
            return reply
                .code(400)
                .send({ code: 404, message: 'Registro não encontrado' });
        if (uvPesquisa.dataFim)
            return reply
                .code(400)
                .send({ code: 400, message: 'Veiculo já entregue' });
        const uv = await uvs.finalizar(id, dataFim);
        if (!uv) {
            return reply.code(400).send({
                code: 400,
                message: 'Ocorreu um erro e não foi possível finalizar',
            });
        }
        return reply
            .code(200)
            .send({ code: 200, message: 'Finalizado com sucesso', content: uv });
    });
}

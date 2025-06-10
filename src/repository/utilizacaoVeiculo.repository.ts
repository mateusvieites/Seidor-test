import cache from '../infra/cache/nodeCache';
import { IUtilizacaoVeiculo } from '../model/utilizacaoVeiculo.model';

interface IUtilizacaoVeiculoRepository {
  criar(uv: IUtilizacaoVeiculo): Promise<IUtilizacaoVeiculo>;
  buscarPorId(id: number): Promise<IUtilizacaoVeiculo | null>;
  buscarPorIdVeiculo(idVeiculo: number): Promise<IUtilizacaoVeiculo[] | null>;
  buscarPorIdUsuario(idUsuario: number): Promise<IUtilizacaoVeiculo[] | []>;
  listar(): Promise<IUtilizacaoVeiculo[]>;
  atualizar(
    id: number,
    veiculo: Partial<IUtilizacaoVeiculo>
  ): Promise<IUtilizacaoVeiculo | null>;
  remover(id: number, softDelete: boolean): Promise<boolean>;
}

class CUtilizacaoVeiculoRepository implements IUtilizacaoVeiculoRepository {
  async criar(uv: Omit<IUtilizacaoVeiculo, 'id'>): Promise<IUtilizacaoVeiculo> {
    const uvs = cache.get<IUtilizacaoVeiculo[]>('uvs') ?? [];
    const novoUv: IUtilizacaoVeiculo = { ...uv, id: uvs.length };

    uvs.push(novoUv);
    cache.set('uvs', uvs);
    return novoUv;
  }

  async buscarPorId(id: number): Promise<IUtilizacaoVeiculo | null> {
    const uvs = cache.get<IUtilizacaoVeiculo[]>('uvs') ?? [];
    return uvs.find((u) => u.id === id) ?? null;
  }

  async buscarPorIdVeiculo(
    idVeiculo: number
  ): Promise<IUtilizacaoVeiculo[] | null> {
    const uvs = cache.get<IUtilizacaoVeiculo[]>('uvs') ?? [];
    return uvs.filter((u) => u.automovelId === idVeiculo);
  }
  async buscarPorIdUsuario(
    idMotorista: number
  ): Promise<IUtilizacaoVeiculo[] | []> {
    const uvs = cache.get<IUtilizacaoVeiculo[]>('uvs') ?? [];
    return uvs.filter((u) => u.motoristaId === idMotorista);
  }

  async listar(): Promise<IUtilizacaoVeiculo[]> {
    return cache.get<IUtilizacaoVeiculo[]>('uvs') ?? [];
  }

  async atualizar(
    id: number,
    uv: Partial<IUtilizacaoVeiculo>
  ): Promise<IUtilizacaoVeiculo | null> {
    const uvs = cache.get<IUtilizacaoVeiculo[]>('uvs') ?? [];
    const index = uvs.findIndex((u) => u.id === id);

    if (index === -1) return null;

    uvs[index] = { ...uvs[index], ...uv, id: id };
    cache.set('uvs', uvs);
    return uvs[index];
  }

  async remover(id: number, softDelete: boolean = true): Promise<boolean> {
    const uvs = cache.get<IUtilizacaoVeiculo[]>('uvs') ?? [];
    const index = uvs.findIndex((u) => u.id === id);

    if (index === -1) return false;

    uvs[index].deletado = true;
    return true;
  }
}

export const UtilizacaoVeiculoRepository = new CUtilizacaoVeiculoRepository();

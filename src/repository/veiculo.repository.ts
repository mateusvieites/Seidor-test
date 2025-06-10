import cache from '../infra/cache/nodeCache';
import { IVeiculo } from '../model/veiculo.model';

export interface IVeiculoRepository {
  criar(veiculo: IVeiculo): Promise<IVeiculo>;
  buscarPorId(id: number): Promise<IVeiculo | null>;
  buscarPorPlaca(placa: string): Promise<IVeiculo | null>;
  listar(): Promise<IVeiculo[]>;
  atualizar(id: number, veiculo: Partial<IVeiculo>): Promise<IVeiculo | null>;
  remover(id: number, softDelete: boolean): Promise<IVeiculo | null>;
}
class CVeiculoRepository implements IVeiculoRepository {
  async criar(veiculo: Omit<IVeiculo, 'id'>): Promise<IVeiculo> {
    const veiculos = cache.get<IVeiculo[]>('veiculos') ?? [];
    const novoVeiculo: IVeiculo = { ...veiculo, id: veiculos.length };

    veiculos.push(novoVeiculo);
    cache.set('veiculos', veiculos);
    return novoVeiculo;
  }

  async buscarPorId(id: number): Promise<IVeiculo | null> {
    const veiculos = cache.get<IVeiculo[]>('veiculos') ?? [];
    return veiculos.find((m) => m.id === id) ?? null;
  }

  async buscarPorPlaca(placa: string): Promise<IVeiculo | null> {
    const veiculos = cache.get<IVeiculo[]>('veiculos') ?? [];
    return veiculos.find((v) => v.placa === placa) ?? null;
  }
  async listar(): Promise<IVeiculo[]> {
    return cache.get<IVeiculo[]>('veiculos') ?? [];
  }
  async atualizar(
    id: number,
    veiculo: Partial<IVeiculo>
  ): Promise<IVeiculo | null> {
    const veiculos = cache.get<IVeiculo[]>('veiculos') ?? [];
    const index = veiculos.findIndex((v) => v.id === id);

    if (index === -1) return null;

    const veiculoFiltrado = Object.fromEntries(
      Object.entries(veiculo).filter(([_, v]) => v !== undefined)
    ) as Partial<IVeiculo>;

    veiculos[index] = { ...veiculos[index], ...veiculoFiltrado, id: id };
    cache.set('veiculos', veiculos);
    return veiculos[index];
  }

  async remover(
    id: number,
    softDelete: boolean = true
  ): Promise<IVeiculo | null> {
    const veiculos = cache.get<IVeiculo[]>('veiculos') ?? [];
    const index = veiculos.findIndex((v) => v.id === id);

    if (index === -1) return null;

    veiculos[index].deletado = true;
    cache.set('veiculos', veiculos);
    return veiculos[index];
  }
}

export const VeiculoRepository = new CVeiculoRepository();

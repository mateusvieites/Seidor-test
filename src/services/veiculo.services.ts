import { IVeiculo } from '../model/veiculo.model';
import { VeiculoRepository } from '../repository/veiculo.repository';
type CamposStringEmVeiculo = {
  [K in keyof IVeiculo]: IVeiculo[K] extends string | undefined ? K : never;
}[keyof IVeiculo];

interface IVeiculoService {
  cadastrar(marca: string, cor: string, placa: string): Promise<IVeiculo>;
  atualizar(id: number, veiculo: Partial<IVeiculo>): Promise<IVeiculo | null>;
  excluir(id: number): Promise<boolean>;
  recuperar(id: number): Promise<IVeiculo | null>;
  listar(cor?: string, marca?: string): Promise<IVeiculo[]>;
  validarExistencia(id: number): Promise<boolean>;
}

export class VeiculoService implements IVeiculoService {
  async validarExistencia(id: number): Promise<boolean> {
    const veiculo = await VeiculoRepository.buscarPorId(id);
    return Boolean(veiculo);
  }
  cadastrar(marca: string, cor: string, placa: string): Promise<IVeiculo> {
    return VeiculoRepository.criar({
      cor: cor.toLowerCase(),
      marca: marca.toLowerCase(),
      placa: placa.toLowerCase(),
      deletado: false,
    });
  }

  atualizar(id: number, veiculo: Partial<IVeiculo>): Promise<IVeiculo | null> {
    //Esse for aqui foi feito mais para pensamento em mudanças futuras no sistema a demais como são apenas 3 campos acharia melhor só fazer 3 ifs
    const keysParaLower: CamposStringEmVeiculo[] = ['cor', 'marca', 'placa'];
    for (const key of keysParaLower) {
      const valor = veiculo[key];
      if (veiculo[key] && typeof veiculo[key] === 'string')
        veiculo[key] = veiculo[key].toLowerCase() as typeof valor;
    }

    return VeiculoRepository.atualizar(id, veiculo);
  }
  async excluir(id: number): Promise<boolean> {
    const veiculo = await VeiculoRepository.remover(id);
    return veiculo?.deletado ?? false;
  }

  recuperar(id: number): Promise<IVeiculo | null> {
    return VeiculoRepository.atualizar(id, { deletado: false });
  }

  async listar(cor?: string, marca?: string): Promise<IVeiculo[]> {
    const veiculos = await VeiculoRepository.listar();
    let veiculosFiltrados: IVeiculo[] = veiculos;

    if (cor) veiculosFiltrados = veiculosFiltrados.filter((v) => v.cor === cor);

    if (marca)
      veiculosFiltrados = veiculosFiltrados.filter((v) => v.marca === marca);

    return veiculosFiltrados;
  }
}

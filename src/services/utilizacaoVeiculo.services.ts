import { IMotorista } from '../model/motorista.model';
import { IUtilizacaoVeiculo } from '../model/utilizacaoVeiculo.model';
import { IVeiculo } from '../model/veiculo.model';
import { MotoristaRepository } from '../repository/motorista.repository';
import { UtilizacaoVeiculoRepository } from '../repository/utilizacaoVeiculo.repository';
import { VeiculoRepository } from '../repository/veiculo.repository';

type TCriar = {
  dataInicio: Date;
  automovelId: number;
  motoristaId: number;
  motivo: string;
};

interface IUtilizacaoVeiculoFormato extends IUtilizacaoVeiculo {
  motorista: IMotorista;
  veiculo: IVeiculo;
}

interface IUtilizacaoVeiculoService {
  criar(uv: TCriar): Promise<IUtilizacaoVeiculo>;
  finalizar(id: number, dataFinal: Date): Promise<IUtilizacaoVeiculo | null>;
  listar(): Promise<IUtilizacaoVeiculoFormato[]>;
  pesquisarPorId(id: number): Promise<IUtilizacaoVeiculo | null>;
}

export class UtilizacaoVeiculoService implements IUtilizacaoVeiculoService {
  async pesquisarPorId(id: number): Promise<IUtilizacaoVeiculo | null> {
    const uvs = await UtilizacaoVeiculoRepository.listar();
    const index = uvs.findIndex((uv) => uv.id === id);

    if (index === -1) return null;

    //Achei meio complicado de ler então comentário
    //Vai enviar o elemento na posição formatar e retornar, mas como retorno é uma lista ele pega o primeiro index
    return (await this.formatar([uvs[index]]))[0];
  }
  async formatar(
    uvs: IUtilizacaoVeiculo[]
  ): Promise<IUtilizacaoVeiculoFormato[]> {
    const [motoristas, veiculos] = await Promise.all([
      MotoristaRepository.listar(),
      VeiculoRepository.listar(),
    ]);

    const uvsFormatado: IUtilizacaoVeiculoFormato[] = [];

    for (const index in uvs) {
      const uvAtual = uvs[index];
      uvsFormatado.push({
        ...uvAtual,
        motorista: motoristas[uvAtual.motoristaId - 1],
        veiculo: veiculos[uvAtual.automovelId - 1],
      });
    }

    return uvsFormatado;
  }
  criar(uv: TCriar): Promise<IUtilizacaoVeiculo> {
    return UtilizacaoVeiculoRepository.criar({
      dataInicio: uv.dataInicio,
      automovelId: uv.automovelId,
      motivo: uv.motivo,
      deletado: false,
      motoristaId: uv.motoristaId,
    });
  }
  finalizar(id: number, dataFinal: Date): Promise<IUtilizacaoVeiculo | null> {
    return UtilizacaoVeiculoRepository.atualizar(id, { dataFim: dataFinal });
  }

  async listar(): Promise<IUtilizacaoVeiculoFormato[]> {
    const uvs = await UtilizacaoVeiculoRepository.listar();
    return this.formatar(uvs);
  }
}

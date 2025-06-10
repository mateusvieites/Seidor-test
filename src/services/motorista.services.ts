import { IMotorista } from '../model/motorista.model';
import { MotoristaRepository } from '../repository/motorista.repository';

interface IMotoristaService {
  cadastrar(nome: string): Promise<IMotorista>;
  atualizar(
    id: number,
    motorista: Partial<IMotorista>
  ): Promise<IMotorista | null>;
  excluir(id: number): Promise<boolean>;
  recuperar(id: number): Promise<IMotorista | null>;
  listar(nome?: string): Promise<IMotorista[]>;
  validarExistencia(id: number): Promise<Boolean>;
}

export class MotoristaService implements IMotoristaService {
  async validarExistencia(id: number): Promise<Boolean> {
    const motorista = await MotoristaRepository.buscarPorId(id);
    return Boolean(motorista);
  }
  cadastrar(nome: string): Promise<IMotorista> {
    return MotoristaRepository.criar({
      nome: nome.toLowerCase(),
      deletado: false,
    });
  }
  atualizar(
    id: number,
    motorista: Partial<IMotorista>
  ): Promise<IMotorista | null> {
    if (motorista.nome) motorista.nome = motorista.nome.toLowerCase();

    return MotoristaRepository.atualizar(id, motorista);
  }
  async excluir(id: number): Promise<boolean> {
    const motorista = await MotoristaRepository.remover(id);
    return Boolean(motorista);
  }

  recuperar(id: number): Promise<IMotorista | null> {
    return MotoristaRepository.atualizar(id, { deletado: false });
  }

  async listar(nome?: string): Promise<IMotorista[]> {
    const motoristas = await MotoristaRepository.listar();
    if (!nome) return motoristas;

    const nomeToLower = nome.toLowerCase();
    return motoristas.filter((m) => m.nome.startsWith(nomeToLower));
  }
}

import cache from '../infra/cache/nodeCache';
import { IMotorista } from '../model/motorista.model';

export interface IMotoristaRepository {
  criar(motorista: IMotorista): Promise<IMotorista>;
  buscarPorId(id: number): Promise<IMotorista | null>;
  buscarPorNome(nome: string): Promise<IMotorista | null>;
  listar(): Promise<IMotorista[]>;
  atualizar(
    id: number,
    motorista: Partial<IMotorista>
  ): Promise<IMotorista | null>;
  remover(id: number, softDelete: boolean): Promise<IMotorista | null>;
}

//Afim de facilitar para ser mais rápido eu vou gerar classe já pronta para enviar não recriarei repository por rota
class CMotoristaRepository implements IMotoristaRepository {
  async criar(motorista: Omit<IMotorista, 'id'>): Promise<IMotorista> {
    const motoristas = cache.get<IMotorista[]>('motoristas') ?? [];
    const novoMotorista: IMotorista = {
      ...motorista,
      id: motoristas.length,
    };

    motoristas.push(novoMotorista);
    cache.set('motoristas', motoristas);
    return novoMotorista;
  }

  async buscarPorId(id: number): Promise<IMotorista | null> {
    const motoristas = cache.get<IMotorista[]>('motoristas') ?? [];
    return motoristas.find((m) => m.id === id) ?? null;
  }

  async buscarPorNome(nome: string): Promise<IMotorista | null> {
    const motoristas = cache.get<IMotorista[]>('motoristas') ?? [];
    return motoristas.find((m) => m.nome === nome) ?? null;
  }

  async listar(): Promise<IMotorista[]> {
    return cache.get<IMotorista[]>('motoristas') ?? [];
  }
  async atualizar(
    id: number,
    motorista: Partial<IMotorista>
  ): Promise<IMotorista | null> {
    const motoristas = cache.get<IMotorista[]>('motoristas') ?? [];
    const index = motoristas.findIndex((m) => m.id === id);

    if (index === -1) return null;
    const motoristaFiltrado = Object.fromEntries(
      Object.entries(motorista).filter(([_, v]) => v !== undefined)
    ) as Partial<IMotorista>;

    motoristas[index] = { ...motoristas[index], ...motoristaFiltrado, id: id };

    cache.set('motoristas', motoristas);
    return motoristas[index];
  }
  async remover(
    id: number,
    softDelete: boolean = true
  ): Promise<IMotorista | null> {
    const motoristas = cache.get<IMotorista[]>('motoristas') ?? [];
    const index = motoristas.findIndex((m) => m.id === id);
    if (index === -1) return null;

    motoristas[index].deletado = true;
    cache.set('motoristas', motoristas);
    return motoristas[index];
  }
}

export const MotoristaRepository = new CMotoristaRepository();

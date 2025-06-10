export interface IUtilizacaoVeiculo {
  id: number;
  motoristaId: number;
  automovelId: number;
  dataInicio: Date;
  dataFim?: Date;
  motivo: string;
  deletado: boolean;
}

//Adicionaria KM Final do veiculo aqui

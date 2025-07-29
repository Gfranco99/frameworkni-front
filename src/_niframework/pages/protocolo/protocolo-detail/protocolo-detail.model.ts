export interface Titulo {
  NumeroProtocolo: number
  Senha: string
  Natureza: string
  ValorDeposito: number
  ValorCustas: number
  NomeApresentante: string
  DataPrenotacao: string
  DataPrevistaRetirada: string
  Andamentos: Andamento[]
  Anexos: Anexo[]
  UrlBoleto: string
}

export interface Andamento {
  Sequencia: number
  DataAndamento: string
  Descricao: string
  Observacao: string
  Nota: Nota
}

export interface Anexo {
  Id: number
  Hash: string
  Data: string
  Descricao: string
  NumeroRegistro: number
  Sequencia: number
}

export interface Nota {
  CodigoId: Number
  NumeroProtocolo: Number
  SequenciaAndamento: Number
  NotaDevolutiva: string[]
  NotaDevolutivaDict: NotaDevolutivaDict[]
}

export interface NotaDevolutivaDict {
  index: string
  descricao: string
}

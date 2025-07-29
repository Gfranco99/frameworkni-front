export interface EmailDuvidaFrequente {
  id: number;
  texto: string;
  titulo: string;
  pergunta: string;
  tipoDuvidaId: number;
  tipoDuvida: TipoDuvida;
  emailDestinatario: string;
}

export interface TipoDuvida {
  id: number;
  descricao: string;
}

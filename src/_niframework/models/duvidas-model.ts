export interface Duvida{
    Id: number;
    Titulo: string;
    Pergunta: string;
    TipoDuvida: {
      Id: number;
      Descricao: string;
    };
    TipoDuvidaId: number;
    Texto: string;
}

export enum TiposProtocoloEnum {
  certidao = 1,
  exameCalculo = 2,
  prenotacao = 3,
}

export const TiposProtocoloLabel = new Map<string, string>([
  ['certidao', 'Certidão'],
  ['exameCalculo', 'Exame e Cálculo'],
  ['prenotacao', 'Prenotação']
]);

export interface protocoloResponseModel {
  id: number,
  idProcesso: number,
  dsNumero: string,
  idTipoProtocolo: number,
  dsSenha: string,
  dsNatureza: string,
  dsNomeApresentante: string,
  dsStatusAndamento: string,
  dtAtualizacao: string
}

export interface certidaoResponseModel {
  dsSenhaProtocoloCartorio: string;
}

export interface agendamentoResponseModel {
  id: number,
  idProcesso: number,
  idTipoAgendamento: number,
  dtAgenda: string,
  dsObservacao: string,
	inCorreio: boolean,
	inDomicilio: boolean,
	dsCep:string,
	dsEndereco: string,
	dsComplemento:string,
	dsBairro: string,
	dsCidade: string,
	dsEstado: string,
	dsNumeroProtocolo: string,
  dsProtocoloCliente: string

}

export interface protocoloRequestModel {
  idUser: Number,
  tipo: string
}

export interface meusProtocolosModel {
  listaAgendamento: agendamentoResponseModel[],
  listaCertidao: certidaoResponseModel[],
  listaProtocolo: protocoloResponseModel[]

}

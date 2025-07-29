export interface UserFilterTable {
    codigoUsuario: string,
    nome: string,
    documento: string,
    telefone: string,
    email: string,
    notificacao: boolean,
    dataTermoUso: string,
    versaoTermoUso: string,
    dataPoliticaPrivacidade: string,
    versaoPolitica: string,
    ativo: boolean,
    grupos: string[],
    perfis: string[],
    idioma: string,
    estrangeiro: boolean,
    idNivelCadastro: number,
    usuarioSignup: {
        nacionalidade: string,
        dataNascimento: string,
        nomeMae: string,
        genero: string,
        tipoPessoa: string
    },
    listaEnderecos: [],
    listaDocumentos: [
        {
            idDoctoUsuario: number,
            idTipoDocto: number,
            documento: string,
            principal: boolean
        }
    ]
}
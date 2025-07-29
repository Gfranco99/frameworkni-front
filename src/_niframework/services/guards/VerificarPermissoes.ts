export class VerificarPermissoes {

    static temPermissao( routerRoles: string[], userRoles: string[] ): boolean {
     
         // userRoles está chegando nulo
        for ( let role of routerRoles ) {
            if ( userRoles.includes( role )) {
                return true;
            }
        }

        return false;
    }
}
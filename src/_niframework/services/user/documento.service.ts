import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DocumentoService {

  constructor(
    private alertCtrl: AlertController,
  ) { }
  
  //Alert erro no tamanho do documento
  async lengthAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Documento Inválido!',
      message: 'Digite um documento CPF ou CNPJ completo para prosseguir.',
      buttons: [{
        text: 'Ok', handler: () => {
        }
      }]
    });
    await alert.present();
  }
  

  validaCPF(eve: any) {
    var Soma = 0;

    const strCPF = eve.target.value.replace('.', '').replace('.', '').replace('-', '');
    
    //Verifica se tem o tamanho correto
    if(strCPF.length !== 11){
      this.lengthAlert();
      return false;
    }
    // Testa as sequencias que possuem todos os dígitos iguais e, se o cpf não tem 11 dígitos, retorna falso e exibe uma msg de erro
    if (strCPF === '00000000000' || strCPF === '11111111111' || strCPF === '22222222222' || strCPF === '33333333333' ||
      strCPF === '44444444444' || strCPF === '55555555555' || strCPF === '66666666666' || strCPF === '77777777777' || strCPF === '88888888888' ||
      strCPF === '99999999999') {
      this.cpfAlert();
      return false;
    }

    // Os seis blocos seguintes de funções vão realizar a validação do CPF propriamente dito, conferindo se o DV bate. Caso alguma das funções não consiga verificar
    // o DV corretamente, mostrará uma mensagem de erro ao usuário e retornará falso, para que o usário posso digitar novamente um número para ser testado

    //Multiplica cada digito por numeros de 1 a 9, soma-os e multiplica-os por 10. Depois, divide o resultado encontrado por 11 para encontrar o resto
    for (let i = 1; i <= 9; i++) {
      Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    }

    var Resto = (Soma * 10) % 11;
    if ((Resto === 10) || (Resto === 11)) {
      Resto = 0;
    }

    if (Resto !== parseInt(strCPF.substring(9, 10))) {
      this.cpfAlert();
      return false;
    }

    Soma = 0;
    for (let k = 1; k <= 10; k++) {
      Soma = Soma + parseInt(strCPF.substring(k - 1, k)) * (12 - k)
    }

    Resto = (Soma * 10) % 11;
    if ((Resto === 10) || (Resto === 11)) {
      Resto = 0;
    }

    if (Resto !== parseInt(strCPF.substring(10, 11))) {
      this.cpfAlert();
      return false;
    }
    return true;
  }

  //Alert erro cpf
  async cpfAlert() {
    const alert = await this.alertCtrl.create({
      header: 'CPF Inválido!',
      message: 'Digite um número de CPF válido para prosseguir.',
      buttons: [{
        text: 'Ok', handler: () => {
        }
      }]
    });
    await alert.present();
  }

  //Valida CNPJ
  validaCNPJ(eve: any) {

    const strcnpj = eve.target.value.replace(/[^\d]+/g, '');
    if (strcnpj == '') return false;
    if (strcnpj.length != 14){
      this.lengthAlert();
      return false;
    }
      
    
    if (strcnpj == "00000000000000" ||
      strcnpj == "11111111111111" ||
      strcnpj == "22222222222222" ||
      strcnpj == "33333333333333" ||
      strcnpj == "44444444444444" ||
      strcnpj == "55555555555555" ||
      strcnpj == "66666666666666" ||
      strcnpj == "77777777777777" ||
      strcnpj == "88888888888888" ||
      strcnpj == "99999999999999") {
      this.cnpjAlert();
      return false;
    }

    // Valida DVs 
    let tamanho = strcnpj.length - 2
    let numeros = strcnpj.substring(0, tamanho);
    let digitos = strcnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
        pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0)){
      this.cnpjAlert();
      return false;
    }
    
    tamanho = tamanho + 1;
    numeros = strcnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
        pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1)) {
      this.cnpjAlert();
      return false;
    }
    return true;
  }
  
  //Alert erro cnpj
  async cnpjAlert() {
    const alert = await this.alertCtrl.create({
      header: 'CNPJ Inválido!',
      message: 'Digite um número de CNPJ válido para prosseguir.',
      buttons: [{
        text: 'Ok', handler: () => {
        }
      }]
    });
    await alert.present();
  }
  
}

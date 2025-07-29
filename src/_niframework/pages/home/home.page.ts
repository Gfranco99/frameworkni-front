import { TiposProtocoloEnum } from './../../models/enum-protocolos';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AlertsProvider } from 'src/_niframework/providers/alerts/alerts';
import { NoticiasComponent } from '../noticias/noticias/noticias.component';
import { ProtocoloConsultaPage } from '../protocolo/protocolo-consulta/protocolo-consulta.page';
import { MobileService } from 'src/_niframework/services/mobile/mobile.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  // ... (outros atributos)
  public dados: any = null;
  public certificados: string[] = [];
  public assinaturas: any[] = [];
  public todosCertificadosValidos: boolean = false;

  // Atributos de controle de exibição de preview/detalhes
  public showFullDetails: boolean = false;
  public showPreview: boolean = false;

  // NOVA PROPRIEDADE para armazenar os nomes formatados dos assinantes
  public formattedSignerNames: string = 'Não identificado'; // Valor padrão

  constructor(
    private navctrl: Router,
    private alerts: AlertsProvider,
    private noticiaComponent: NoticiasComponent,
    private protocolo: ProtocoloConsultaPage,
    private mobile: MobileService,
    private changeDetector: ChangeDetectorRef,
    private location: Location,
  ) {
    this.resetValidador();
  }

  ngOnInit() {
    // ... (restante do ngOnInit)
  }

  ionViewWillEnter() {
    this.resetValidador();
  }

  resetValidador() {
    this.dados = null;
    this.certificados = [];
    this.assinaturas = [];
    this.todosCertificadosValidos = false;
    this.showFullDetails = false;
    this.showPreview = false;
    this.formattedSignerNames = 'Não identificado'; // Resetar também
  }

  // ... (outros métodos)

  /* MÉTODO PARA LER O .vdoc */
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) {
      this.alerts.showAlert('Erro', 'Nenhum arquivo selecionado.');
      return;
    }

    if (!file.name.toLowerCase().endsWith('.vdoc')) {
      this.alerts.showAlert('Erro', 'Selecione um arquivo com extensão .vdoc');
      this.resetValidador();
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const json = JSON.parse(e.target.result);

        this.dados = {
          fileName: json.fileName || file.name,
          validationTime: json.validationTime || '#',
          isValid: json.isValid === true && json.status === 'OK',
          softwareVersion: json.softwareVersion || '---',
          signaturePolicy: json.signaturePolicy || '---',
          lpaValid: json.lpaValid === true,
          signatureType: json.signatureType || '---',
          pdfValid: json.validaDocsReturn?.pdfValidations?.isPDFACompliant === true
        };

        if (Array.isArray(json.validaDocsReturn?.digitalSignatureValidations)) {
            this.certificados = json.validaDocsReturn.digitalSignatureValidations.map((item: any) => item.endCertSubjectName || 'Certificado Desconhecido');
        } else {
            this.certificados = [];
        }

        if (Array.isArray(json.validaDocsReturn?.digitalSignatureValidations)) {
          this.assinaturas = json.validaDocsReturn.digitalSignatureValidations.map((item: any) => {
            return {
              signatureValid: item.signatureValid ?? false,
              signatureErrors: item.signatureErrors || '---',
              endCertSubjectName: item.endCertSubjectName || '---',
              isICP: item.isICP ?? false,
              iseGov: item.iseGov ?? false,
              rootIssuer: item.rootIssuer || '---'
            };
          });

          this.todosCertificadosValidos = this.assinaturas.every(assinatura => assinatura.signatureValid);

          // Lógica para formatar os nomes dos assinantes e atribuir à nova propriedade
          if (this.assinaturas.length > 0) {
            this.formattedSignerNames = this.assinaturas
              .map(a => a?.endCertSubjectName?.split('CN=')[1]) // Pega a parte após 'CN='
              .filter(name => name && name.trim() !== '')       // Filtra nomes vazios/nulos
              .join(', ');                                    // Junta com vírgula e espaço
            
            // Se o resultado final ainda for vazio (ex: CN= com valor vazio), define como 'Não identificado'
            if (this.formattedSignerNames.trim() === '') {
              this.formattedSignerNames = 'Não identificado';
            }
          } else {
            this.formattedSignerNames = 'Não identificado';
          }

        } else {
            this.assinaturas = [];
            this.todosCertificadosValidos = false;
            this.formattedSignerNames = 'Não identificado'; // Reseta se não houver assinaturas
        }

        this.showPreview = true;
        this.showFullDetails = false;

        this.changeDetector.detectChanges();
      } catch (err) {
        console.error('Erro ao ler arquivo .vdoc', err);
        this.alerts.showAlert('Erro', 'O arquivo não está no formato esperado ou está corrompido.');
        this.resetValidador();
      }
    };
    reader.readAsText(file);
  }

  showAllDetails() {
    this.showFullDetails = true;
    this.showPreview = false;
  }

  showPreviewAgain() {
    this.showPreview = true;
    this.showFullDetails = false;
  }
}
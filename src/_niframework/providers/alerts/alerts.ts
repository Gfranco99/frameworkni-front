import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class AlertsProvider {

    constructor(public toastCtrl: ToastController,
        public alertCtrl: AlertController) { }

    public async showAlert(pTitle: string, pMessage: string) {
        const alert = await this.alertCtrl.create({
            header: pTitle,
            message: pMessage,
            buttons: ['OK'],
            cssClass: 'custom-alert-class',
        });

        await alert.present();
    }

    public async showAlertWithComplement(pMessage: string, pComplement: string) {
        const alert = await this.alertCtrl.create({
            message: pMessage + " " + pComplement,
            buttons: ['OK']
        });

        await alert.present();
    }

    public async showToaster(pMessage, color?) {
        const toast = await this.toastCtrl.create({
            message: pMessage,
            duration: 3000,
            position: 'top',
            cssClass: 'custom-toast-class',
            color: color != null ? color : "primary"
          //closeButtonText: 'OK',
          //showCloseButton: true
        });

        toast.present();
    }

    public async showAlertRadio(title: string, message: string, options: any[], callback: any){
        const alert = await this.alertCtrl.create({
            header: title,
            message: message,
            buttons: [
                {
                    text: 'OK',
                    handler: data => {
                        let str = data;
                        callback(str);
                    },
                    role: ''
                }
            ],
            inputs: options
        });

        await alert.present();
    }

    public async showConfirmationAlert(title: string, message: string, confirmMessage?: string, cancelMessage?: string) {
        return new Promise(async (resolve) => {
            const alert = await this.alertCtrl.create({
                header: title,
                message: message,
                buttons: [
                    {
                        text: cancelMessage != null ? cancelMessage : 'Cancelar',
                        role: 'cancel',
                        handler: () => {
                            resolve(false);
                        },
                    },
                    {
                        text: confirmMessage != null ? confirmMessage : 'Confirmar',
                        role: 'confirm',
                        handler: () => {
                            resolve(true);
                        },
                    },
                ],
                cssClass: 'custom-alert-class',
            });

            await alert.present();
        });
    }

    // public async alert2(callback, secondCallback, param) {
    //     const alert = await this.alertCtrl.create({
    //         header: 'titulo',
    //         message: 'Mensagem',
    //         buttons: [
    //             {
    //                 text: 'Cancelar',
    //                 role: 'cancel'
    //             },
    //             {
    //                 text: 'Confirmar',
    //                 handler: (data) => {
    //                     callback(param);
    //                     callback(data.testeInput);
    //                     secondCallback(param, data.testeInput);
    //                 }
    //             }
    //         ],
    //         inputs: [
    //             {
    //                 name: 'testeInput',
    //                 type: 'number'
    //             }
    //         ]
    //     });

    //     await alert.present();
    // }

    // public async showConfirmationAlert2(title, message, cancelMessage?, confirmMessage?) {
    //     const alert = await this.alertCtrl.create({
    //         header: title,
    //         message: message,
    //         buttons: [
    //             {
    //                 text: cancelMessage != null ? cancelMessage : 'Cancelar',
    //                 role: 'cancel',
    //             },
    //             {
    //                 text: confirmMessage != null ? confirmMessage : 'Confirmar',
    //             },
    //         ],
    //     })
    //     //
    //     // recebe o alert criado como um objeto htmlElement
    //     // .then( async (createdAlert) => {
    //         // console.log(createdAlert);
    //         // await createdAlert.present();

    //         // return createdAlert.onDidDismiss(); // retorna informações do alert após resolver, para serem checadas no typescript
    //     // })
    //     //
    //     await alert.present();
    //     return alert.onDidDismiss();
    // }
}

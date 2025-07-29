import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
})
export class OptionsPage implements OnInit {
  telefone = sessionStorage.getItem('tel');

  constructor(private route: Router) {}

  ngOnInit() {}

  setOptionValidation(option: string): void {
    // this.cleanDatas();

    switch (option) {
      case 'email':
        let doc = sessionStorage.getItem('doc');

        if (doc == 'false') {
          this.route.navigate(['/register/security-check'], {
            queryParams: { option: 'email-activate' },
          });
          break;
        } else {
          this.route.navigate(['/register/email-activation'], {
            queryParams: { option },
          });
          break;
        }

      case 'sms':
        this.telefone === null
          ? this.route.navigate(['/register/security-check'], {
              queryParams: { option: 'phone' },
            })
          : this.route.navigate(['/register/sms-activation'], {
              queryParams: { option: 'phone' },
            });
        break;

      case 'whatsapp':
        this.telefone === null
          ? this.route.navigate(['register/security-check'], {
              queryParams: { option: 'whatsapp' },
            })
          : this.route.navigate(['/register/sms-activation'], {
              queryParams: { option: 'whatsapp' },
            });
        break;

      default:
        this.route.navigate(['/register/email'], { queryParams: { option } });
        break;
    }
  }

  cleanDatas(): void {
    sessionStorage.removeItem('tel');
  }
}

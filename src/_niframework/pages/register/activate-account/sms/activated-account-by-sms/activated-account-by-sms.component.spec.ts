import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActivatedAccountBySmsComponent } from './activated-account-by-sms.component';

describe('ActivatedAccountBySmsComponent', () => {
  let component: ActivatedAccountBySmsComponent;
  let fixture: ComponentFixture<ActivatedAccountBySmsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivatedAccountBySmsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivatedAccountBySmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

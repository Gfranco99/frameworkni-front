import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProtocoloDetailPage } from './protocolo-detail.page';

describe('ProtocoloDetailPage', () => {
  let component: ProtocoloDetailPage;
  let fixture: ComponentFixture<ProtocoloDetailPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProtocoloDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

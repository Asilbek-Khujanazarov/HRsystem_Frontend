import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceQRCodeScannerComponent } from './attendance-qrcode-scanner.component';

describe('AttendanceQRCodeScannerComponent', () => {
  let component: AttendanceQRCodeScannerComponent;
  let fixture: ComponentFixture<AttendanceQRCodeScannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttendanceQRCodeScannerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceQRCodeScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

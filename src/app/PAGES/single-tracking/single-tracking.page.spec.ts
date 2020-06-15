import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SingleTrackingPage } from './single-tracking.page';

describe('SingleTrackingPage', () => {
  let component: SingleTrackingPage;
  let fixture: ComponentFixture<SingleTrackingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleTrackingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SingleTrackingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

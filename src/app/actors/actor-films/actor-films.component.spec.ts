import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActorFilmsComponent } from './actor-films.component';

describe('ActorFilmsComponent', () => {
  let component: ActorFilmsComponent;
  let fixture: ComponentFixture<ActorFilmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActorFilmsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActorFilmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Potions } from './potions';

describe('Potions', () => {
  let component: Potions;
  let fixture: ComponentFixture<Potions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Potions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Potions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PotionCard } from './potion-card';

describe('PotionCard', () => {
  let component: PotionCard;
  let fixture: ComponentFixture<PotionCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PotionCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PotionCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

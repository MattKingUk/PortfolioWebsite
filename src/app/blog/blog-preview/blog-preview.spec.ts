import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogPreview } from './blog-preview';

describe('BlogPreview', () => {
  let component: BlogPreview;
  let fixture: ComponentFixture<BlogPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogPreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogPreview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

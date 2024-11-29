import { HighlightTaskDirective } from './highlight-task.directive';
import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

@Component({
  template: `
    <p appHighlightTask="lightblue" class="highlighted-text">Highlight me!</p>
    <p appHighlightTask class="default-text">Default highlight!</p>
  `,
})
class TestHighlightTaskComponent {}

describe('HighlightTaskDirective', () => {
  let fixture: ComponentFixture<TestHighlightTaskComponent>;
  let component: TestHighlightTaskComponent;
  let firstParagraph: HTMLElement;
  let secondParagraph: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HighlightTaskDirective, TestHighlightTaskComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHighlightTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const paragraphs = fixture.nativeElement.querySelectorAll('p');
    firstParagraph = paragraphs[0];
    secondParagraph = paragraphs[1];
  });

  it('should create the directive instance', () => {
    const directive = new HighlightTaskDirective(new ElementRef(firstParagraph));
    expect(directive).toBeTruthy();
  });

  it('should apply the specified highlight color on mouseenter', () => {
    const mouseEnterEvent = new Event('mouseenter');
    firstParagraph.dispatchEvent(mouseEnterEvent);
    fixture.detectChanges();
    expect(firstParagraph.style.backgroundColor).toBe('lightblue');
  });

  it('should remove the highlight on mouseleave', () => {
    const mouseEnterEvent = new Event('mouseenter');
    const mouseLeaveEvent = new Event('mouseleave');

    firstParagraph.dispatchEvent(mouseEnterEvent);
    fixture.detectChanges();
    expect(firstParagraph.style.backgroundColor).toBe('lightblue');

    firstParagraph.dispatchEvent(mouseLeaveEvent);
    fixture.detectChanges();
    expect(firstParagraph.style.backgroundColor).toBe('');
  });

  it('should apply the default highlight color (yellow) when none is provided', () => {
    const mouseEnterEvent = new Event('mouseenter');
    secondParagraph.dispatchEvent(mouseEnterEvent);
    fixture.detectChanges();
    expect(secondParagraph.style.backgroundColor).toBe('yellow');
  });

  it('should remove the default highlight on mouseleave', () => {
    const mouseEnterEvent = new Event('mouseenter');
    const mouseLeaveEvent = new Event('mouseleave');

    secondParagraph.dispatchEvent(mouseEnterEvent);
    fixture.detectChanges();
    expect(secondParagraph.style.backgroundColor).toBe('yellow');

    secondParagraph.dispatchEvent(mouseLeaveEvent);
    fixture.detectChanges();
    expect(secondParagraph.style.backgroundColor).toBe('');
  });
});

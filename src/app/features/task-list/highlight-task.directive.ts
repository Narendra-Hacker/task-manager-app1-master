import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlightTask]'
})
export class HighlightTaskDirective {
  @Input() appHighlightTask!: string; 
  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.appHighlightTask || 'yellow');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null); 
  }

  private highlight(color: string | null) {
    this.el.nativeElement.style.backgroundColor = color ? color : ''; 
  }
}
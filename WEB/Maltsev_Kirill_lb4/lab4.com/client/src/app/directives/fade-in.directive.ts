import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appFadeIn]',
  standalone: true
})
export class FadeInDirective implements OnInit {
  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.el.nativeElement.style.opacity = '0';
    this.el.nativeElement.style.transition = 'opacity 0.5s ease-in';
    
    setTimeout(() => {
      this.el.nativeElement.style.opacity = '1';
    }, 100);
  }
}


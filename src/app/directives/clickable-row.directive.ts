import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[clickableRow]',
  standalone: true
})
export class ClickableRowDirective {
  @Input() rowId!: string;  // Input for rowId (provider ID)

  constructor() {
    console.log('Directive initialized'); // Add this log
  }
  
  @HostListener('click')
  onClick(event: Event) {
    console.log('Directive triggered');  // Log to confirm the directive is triggered
    console.log('Event:', event);  // Log the event to ensure the click is captured
    console.log('Row ID:', this.rowId);  // Log the row ID to confirm correct ID is passed

    if (this.rowId) {
      console.log('Calling clickAction with row ID:', this.rowId);
     
    } else {
      console.error('No clickAction or rowId passed to the directive');
    }
  }
  }

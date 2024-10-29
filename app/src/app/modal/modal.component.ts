import { Component, input, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  @Input() modalId: String = '';
  @Input() title: string = '';
  @Input() modalSize:String=''
}

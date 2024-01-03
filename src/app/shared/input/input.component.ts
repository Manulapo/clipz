import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {
  @Input() control: FormControl = new FormControl();
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() format: string = '';
  @Input() value: string | undefined = '';

}

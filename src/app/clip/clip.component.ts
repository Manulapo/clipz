import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrl: './clip.component.scss',
})
export class ClipComponent {
  id: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // get current route info and param through the params property and then pushes new values
    this.route.params.subscribe((params: Params) => {
      this.id = params.id;
    });
  }
}

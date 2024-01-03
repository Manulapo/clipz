import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.scss',
})
export class ManageComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}

  videoOrder: string = '1';

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      // note: 2 is the value from the select
      this.videoOrder = params['sort'] == '2' ? params['sort'] : 1;
    });
  }

  sort(ev: Event) {
    const { value } = ev?.target as HTMLSelectElement;

    // update queryparams

    // easy way
    // this.router.navigateByUrl(`/manage?sort=${value}`);


    // best way
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value,
      }
    });
  }
}

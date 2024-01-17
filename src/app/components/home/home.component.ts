import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../../services/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  userInfo$ = new BehaviorSubject<IUser | undefined>(undefined);

  constructor(public auth: AuthService) {}

  ngOnInit() {}
}

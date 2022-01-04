import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaterialService } from '../shared/classes/material.service';

import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  aSub!: Subscription;

  constructor(private auth: AuthService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = new FormGroup(
      {
        email: new FormControl(null, [Validators.required, Validators.email]),
        password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      }
    );
    this.route.queryParams.subscribe({
      next: (params: Params) => {
        if (params['registered']) {
          MaterialService.toast(`Now you're free to use the system`);
        } else if (params['accessDenied']) {
          MaterialService.toast('You should be authorized first');
        } else if (params['sessionExpired']) {
          MaterialService.toast('Session expired');
        }
      }
    })
  };

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  };

  onSubmit(): void {
    this.form.disable();
    this.aSub = this.auth.login(this.form.value).subscribe({
      next: () => this.router.navigate(['/overview']),
      error: error => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      },
    });
  };
}

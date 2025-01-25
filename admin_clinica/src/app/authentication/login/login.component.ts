import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public routes = routes;
  public passwordClass = false;
  public ERROR = false;

  form = new FormGroup({
    email: new FormControl('Vicente@sample.com', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('password', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  constructor(
    public auth: AuthService,
    public router: Router
  ) {}

  ngOnInit(): void {
    // if (localStorage.getItem('authenticated')) {
    //   localStorage.removeItem('authenticated');
    // }
  }

  loginFormSubmit() {
    if (this.form.valid) {
      this.ERROR = false;
      let my_email = this.form.value.email ?? '';
      let my_password = this.form.value.password ?? '';
      this.auth.login(my_email, my_password)
        .subscribe((res:any) => {
          console.log(res); // lo que retorna el login de auth:service se va a reflejar aqui
          if (res) {
            // el login es exitoso
            this.router.navigate([routes.adminDashboard]);
          }else {
            // fallo login
            this.ERROR = true;
            // alert('EL usuario o contraseña son incorrectos');
          }
        }, error => {
          console.log(error);
        });
    }
  }
  togglePassword() {
    this.passwordClass = !this.passwordClass;
  }
}

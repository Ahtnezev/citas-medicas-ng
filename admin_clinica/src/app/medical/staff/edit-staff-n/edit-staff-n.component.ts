import { Component } from '@angular/core';
import { StaffService } from '../service/staff.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-staff-n',
  templateUrl: './edit-staff-n.component.html',
  styleUrls: ['./edit-staff-n.component.scss']
})
export class EditStaffNComponent {

  public selectedValue !: string;
  public name: string = '';
  public surname: string = '';
  public mobile: string = '';
  public email: string = '';
  public password: string = '';
  public password_confirm: string = '';
  public birthdate: string = '';
  public gender: number = 1;
  public education: string = '';
  public designation: string = '';
  public address: string = '';

  public roles: any = [];

  public FILE_AVATAR: any;
  public IMAGEN_PREVIEW: any = 'assets/img/user-06.jpg';

  public text_success: string = '';
  public text_validation: string = '';

  public staff_id: any;
  public staff_selected: any;

  constructor(
    public staffService: StaffService,
    public activetedRoute: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    this.activetedRoute.params.subscribe((resp: any) => {
      console.log(resp);
      this.staff_id = resp.id;
    });

    this.staffService.showUser(this.staff_id).subscribe((resp: any) => {
      console.log(resp);
      // viene del @show de StaffController
      this.staff_selected = resp.user;


      this.selectedValue = this.staff_selected.role.id;

      this.name = this.staff_selected.name;
      this.surname = this.staff_selected.surname;
      this.mobile = this.staff_selected.mobile;
      this.email = this.staff_selected.email;
      this.birthdate = new Date(this.staff_selected.birthdate).toISOString();
      this.gender = this.staff_selected.gender;
      this.education = this.staff_selected.education;
      this.designation = this.staff_selected.designation;
      this.address = this.staff_selected.address;
      this.IMAGEN_PREVIEW = this.staff_selected.avatar;

    });

    this.staffService.listConfig().subscribe((resp: any) => {
      // console.log(resp);
      this.roles = resp.roles;
    });

  }

  save() {
    // console.log(this.selectedValue);

    this.text_validation = '';
    if (!this.name || !this.email || !this.surname) {
      this.text_validation = 'Los campos son requeridos (name, email, surname)';
      return;
    }

    if (this.password) {
      if (this.password != this.password_confirm) {
        this.text_validation = 'Las contraseñas deben no coinciden';
        return;
      }
    }

    // enviaremos una imagen utilizaremos FormData
    let formData = new FormData();
    formData.append("name", this.name);
    formData.append("surname", this.surname);
    formData.append("email", this.email);
    formData.append("mobile", this.mobile);
    formData.append("birthdate", new Date(this.birthdate).toISOString());
    formData.append("gender", this.gender + "");

    if (this.education) {
      formData.append("education", this.education);
    }

    if (this.address) {
      formData.append("address", this.address);
    }

    if (this.designation) {
      formData.append("designation", this.designation);
    }

    if (this.password) {
      formData.append("password", this.password);
    }

    formData.append("role_id", this.selectedValue);

    if (this.FILE_AVATAR) {
      formData.append("imagen", this.FILE_AVATAR);
    }

    this.staffService.updateUser(this.staff_id, formData).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.text_validation = resp.text;
      } else {
        this.text_success = 'El usuario ha sido actualizado correctamente';
      }
    });

  }

  loadFile($event: any) {
    // Si existe la coincidencia de entro del archivo seleccionado en el type el valor `imagen`
    // si es el valor es negativo no existe
    if ($event.target.files[0].type.indexOf("image") < 0) {
      this.text_validation = 'Solamente pueden ser archivos de tipo imagen';
      return;
    }

    this.text_validation = '';

    this.FILE_AVATAR = $event.target.files[0];
    // preview de la imagen en navegador
    let reader = new FileReader();
    reader.readAsDataURL(this.FILE_AVATAR);
    // base64
    reader.onloadend = () => this.IMAGEN_PREVIEW = reader.result;
  }

}

import { Component } from '@angular/core';
import { StaffService } from '../service/staff.service';

@Component({
  selector: 'app-add-staff-n',
  templateUrl: './add-staff-n.component.html',
  styleUrls: ['./add-staff-n.component.scss']
})
export class AddStaffNComponent {

  public selectedValue !: string;
  public name:string = '';
  public surname:string = '';
  public mobile:string = '';
  public email:string = '';
  public password:string = '';
  public password_confirm:string = '';
  public birthdate:string = '';
  public gender:number = 1;
  public education:string = '';
  public designation:string = '';
  public address:string = '';

  public roles:any = [];

  public FILE_AVATAR:any;
  public IMAGEN_PREVIEW:any = 'assets/img/user-06.jpg';

  public text_success:string = '';
  public text_validation:string = '';

  constructor(
    public staffService: StaffService,

  ) {

  }

  ngOnInit(): void {

    this.staffService.listConfig().subscribe( (resp:any) => {
      // console.log(resp);
      this.roles = resp.roles;
    });

  }

  save(){
    // console.log(this.selectedValue);

    this.text_validation = '';
    if (!this.name || !this.email || !this.surname || !this.FILE_AVATAR || !this.password) {
      this.text_validation = 'Los campos son requeridos (name, email, surname, avatar, password)';
      return;
    }

    if (this.password != this.password_confirm) {
      this.text_validation = 'Las contraseñas deben no coinciden';
      return;
    }

    // enviaremos una imagen utilizaremos FormData
    let formData = new FormData();
    formData.append("name", this.name );
    formData.append("surname", this.surname );
    formData.append("email", this.email );
    formData.append("mobile", this.mobile );
    formData.append("birthdate", new Date(this.birthdate).toISOString() );
    formData.append("gender", this.gender + "");
    formData.append("education", this.education );
    formData.append("designation", this.designation );
    formData.append("address", this.address );
    formData.append("password", this.password );

    formData.append("role_id", this.selectedValue);

    formData.append("imagen", this.FILE_AVATAR );


    this.staffService.registerUser(formData).subscribe( (resp:any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.text_validation = resp.text;
      } else {
        this.text_success = 'El usuario ha sido registrado correctamente';
        this.resetFormAfterSubmit();
      }
    });

  }

  /**
   * `Reset data form`
   */
  resetFormAfterSubmit():void {
    this.name = '';
    this.surname = '';
    this.email = '';
    this.mobile = '';
    this.birthdate = '';
    this.gender = 1;
    this.education = '';
    this.designation = '';
    this.address = '';
    this.password = '';
    this.password_confirm = '';
    this.selectedValue = '';
    this.FILE_AVATAR = null;
    this.IMAGEN_PREVIEW = null;
  }


  loadFile($event:any) {
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

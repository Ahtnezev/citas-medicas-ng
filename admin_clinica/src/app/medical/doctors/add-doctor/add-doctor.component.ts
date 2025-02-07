import { Component } from '@angular/core';
import { DoctorService } from '../service/doctor.service';

@Component({
   selector: 'app-add-doctor',
   templateUrl: './add-doctor.component.html',
   styleUrls: ['./add-doctor.component.scss']
})
export class AddDoctorComponent {

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

   public specialities: any = [];
   public speciality_id: any;

   public text_success: string = '';
   public text_validation: string = '';

   public days_week = [
      {
         name: "Lunes",
         class: "table-primary",
      },
      {
         name: "Martes",
         class: "table-secondary",
      },
      {
         name: "Miércoles",
         class: "table-success",
      },
      {
         name: "Jueves",
         class: "table-warning",
      },
      {
         name: "Viernes",
         class: "table-info",
      },
   ];

   public hours_days: any = [];

   public hours_selected: any = [];

   constructor(
      public doctorService: DoctorService,

   ) {

   }

   ngOnInit(): void {

      this.doctorService.listConfig().subscribe((resp: any) => {
         // console.log(resp);
         this.roles = resp.roles;
         this.specialities = resp.specialities;
         this.hours_days = resp.hours_days;
      });

   }

   save() {
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
      formData.append("name", this.name);
      formData.append("surname", this.surname);
      formData.append("email", this.email);
      formData.append("mobile", this.mobile);
      formData.append("birthdate", new Date(this.birthdate).toISOString());
      formData.append("gender", this.gender + "");
      formData.append("education", this.education);
      formData.append("designation", this.designation);
      formData.append("address", this.address);
      formData.append("password", this.password);

      formData.append("role_id", this.selectedValue);

      formData.append("imagen", this.FILE_AVATAR);


      this.doctorService.registerDoctor(formData).subscribe((resp: any) => {
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
   resetFormAfterSubmit(): void {
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

   // 🔥
   addHourAll(hour_day:any, day:any) {
      let INDEX = this.hours_selected.findIndex(
            (hour:any) => hour.aliasDayName == day.name && hour.aliasHour == hour_day.hour);

      if (INDEX != -1) {
         this.hours_selected.splice(INDEX, 1);
      } else {
         // todos los tiempos de esa hora deben tener checked
         hour_day.items.forEach( (item:any) => {
           this.hours_selected.push({
              "day": day,
              "aliasDayName": day.name,
              "hours_day": hour_day,
              "aliasHour": hour_day.hour,
           });
         });
      }

      console.log(this.hours_selected);
   }

   // 🔥
   addHourItem(hour_day:any, day:any, item:any){
      // search on days_week
      let INDEX = this.hours_selected.findIndex( (hour:any) => hour.aliasDayName == day.name &&
                                                               hour.aliasHour == hour_day.hour &&
                                                               hour.item.hour_start == item.hour_start &&
                                                               hour.item.hour_end == item.hour_end
      );

      // exists in array, then we need delete it
      if (INDEX != -1) {
         this.hours_selected.splice(INDEX, 1);
      } else {
        this.hours_selected.push({
           "day": day, // Lunes, viernes...
           "aliasDayName": day.name,
           "hours_day": hour_day, // grupo de 9AM, 11AM...
           "aliasHour": hour_day.hour, //hours_days
           "item": item,
        });
      }
      console.log(this.hours_selected);
   }

   // 🔥
   isCheckedHour(hour_day:any, day:any, item:any) {
       let INDEX = this.hours_selected.findIndex( (hour:any) => hour.aliasDayName == day.name &&
                                                               hour.aliasHour == hour_day.hour &&
                                                               hour.item.hour_start == item.hour_start &&
                                                               hour.item.hour_end == item.hour_end
      );

      if (INDEX != -1) {
         return true;
      } else {
         return false;
      }

   }

}

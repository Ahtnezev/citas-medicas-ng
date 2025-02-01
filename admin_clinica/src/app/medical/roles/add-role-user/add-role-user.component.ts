import { Component } from '@angular/core';
import { DataService } from 'src/app/shared/data/data.service';
import { RolesService } from '../service/roles.service';

@Component({
  selector: 'app-add-role-user',
  templateUrl: './add-role-user.component.html',
  styleUrls: ['./add-role-user.component.scss']
})
export class AddRoleUserComponent {

  sidebar:any = [];
  name:string = '';
  permissions:any = [];
  valid_form:boolean = false;
  valid_form_success:boolean = false;
  text_validation:any = null;

  constructor(
    public DataService: DataService,
    public RoleService: RolesService
  ) {}

  ngOnInit(): void {
    this.sidebar = this.DataService.sideBar[0].menu;
  }

  addPermission(subMenu:any):void {
    if (subMenu.permission) {
      let INDEX = this.permissions.findIndex( (item:any) => item == subMenu.permission); // para saber cuando tenga checked o no el checbox
      if (INDEX != -1) { // ya existe
        this.permissions.splice(INDEX, 1);
      } else {
        this.permissions.push(subMenu.permission);
      }

      console.log(this.permissions);
    }

  }

  save() {

    if (!this.name || this.permissions.length == 0) {
      this.valid_form = true;
      return;
    }

    let data = {
      name: this.name,
      permissions: this.permissions
    };

    this.valid_form = false;
    this.valid_form_success = false;
    this.text_validation = null;

    this.RoleService.storeRoles(data).subscribe( (resp:any) => {
      console.log(resp);

      if (resp.message == 403) {
        this.text_validation = resp.text;
      } else {
        this.clearForm();
        this.valid_form_success = true;

        // reset checboxs
        let SIDE_BAR = this.sidebar;
        this.sidebar = [];
        setTimeout(() => {
          this.sidebar = SIDE_BAR;
        }, 50);
      }

    });
  }

  clearForm():void {
    this.name = '';
    this.permissions = [];
  }

}

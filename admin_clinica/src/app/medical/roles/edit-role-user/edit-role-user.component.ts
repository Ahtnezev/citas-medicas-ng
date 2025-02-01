import { Component } from '@angular/core';
import { DataService } from 'src/app/shared/data/data.service';
import { RolesService } from '../service/roles.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-role-user',
  templateUrl: './edit-role-user.component.html',
  styleUrls: ['./edit-role-user.component.scss']
})
export class EditRoleUserComponent {

  sidebar: any = [];
  name: string = '';
  permissions: any = [];
  valid_form: boolean = false;
  valid_form_success: boolean = false;

  role_id: any;
  text_validation:any = null;

  constructor(
    public DataService: DataService,
    public RoleService: RolesService,
    public activatedRoute: ActivatedRoute,
  ) { }

  //*
  ngOnInit(): void {
    this.sidebar = this.DataService.sideBar[0].menu;
    this.activatedRoute.params.subscribe((res: any) => {
      // console.log(res);
      this.role_id = res.id;
    });
    this.showRole();
  }

  //*
  showRole() {
    this.RoleService.showRoles(this.role_id).subscribe((res: any) => {
      // console.log(res);
      this.name = res.name;
      this.permissions = res.permission_pluck;
    });
  }

  //*
  addPermission(subMenu: any): void {
    if (subMenu.permission) {
      let INDEX = this.permissions.findIndex((item: any) => item == subMenu.permission); // para saber cuando tenga checked o no el checbox
      if (INDEX != -1) { // ya existe en el array
        this.permissions.splice(INDEX, 1);
      } else {
        this.permissions.push(subMenu.permission);
      }
      console.log(this.permissions);
    }
  }

  //*
  save() {

    this.valid_form = false;

    if (!this.name || this.permissions.length == 0) {
      this.valid_form = true;
      return;
    }

    let data = {
      name: this.name,
      permissions: this.permissions
    };

    this.valid_form_success = false;
    this.text_validation = null;

    this.RoleService.editRoles(data, this.role_id).subscribe((res: any) => {
      console.log(res);

      if (res.message == 403) {
        this.text_validation = res.text;
        return;
      }

      this.valid_form_success = true;

    });
  }

}

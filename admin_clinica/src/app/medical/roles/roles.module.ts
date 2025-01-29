import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import { AddRoleUserComponent } from './add-role-user/add-role-user.component';
import { EditRoleUserComponent } from './edit-role-user/edit-role-user.component';
import { ListRoleUserComponent } from './list-role-user/list-role-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    RolesComponent,
    AddRoleUserComponent,
    EditRoleUserComponent,
    ListRoleUserComponent
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,
    //! agregando esto ya no aparece el error de ngModel can't to bind...
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
  ]
})
export class RolesModule { }

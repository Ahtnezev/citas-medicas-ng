import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { DataService } from 'src/app/shared/data/data.service';
import { MenuItem, SideBarData } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
import { SideBarService } from 'src/app/shared/side-bar/side-bar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  base = '';
  page = '';
  currentUrl = '';
  public classAdd = false;

  public multilevel: Array<boolean> = [false, false, false];

  public routes = routes;
  public sidebarData: Array<SideBarData> = [];
  public user:any;

  constructor(
    private data: DataService,
    private router: Router,
    private sideBar: SideBarService,
    public authService: AuthService,
  ) {

    //! #1
    // this.user = this.authService.user;
    let USER = localStorage.getItem("user");
    this.user = JSON.parse(USER ?? '');

    // INICIO
    // this.user.`roles`... este viene desde AuthController del item de `roles` @respondWithToken
    if (this.user.roles.includes("Super-Admin")) {
      // si en su role contiene Super-Admin mostramos todo el sidebar completo
      this.sidebarData = this.data.sideBar;
    } else {
      // filtrar y validar que menus se pueden ver segun el rol
      let permissions = this.user.permissions;
      let SIDE_BAR_GENERAL:any = [];

      this.data.sideBar.forEach( (side:any) => {

        let SIDE_B:any = [];

        side.menu.forEach((menu_s:any) => {
          // permisos que ya tiene el usuario `permissions.includes()`
          let SUB_MENUS = menu_s.subMenus.filter( (submenu:any) => permissions.includes(submenu.permission) && submenu.show_nav);
          // si es mayor a 0 es proque encontro rutas en ese usuario con su rol
          if (SUB_MENUS.length > 0) {
            menu_s.subMenus = SUB_MENUS;
            SIDE_B.push(menu_s);
          }

        });

        if (SIDE_B.length > 0) {
          side.menu = SIDE_B;
          SIDE_BAR_GENERAL.push(side);
        }

      });

      this.sidebarData = SIDE_BAR_GENERAL;
      // this.sidebarData = this.data.sideBar;
    }


    // FIN
    router.events.subscribe((event: object) => {
      if (event instanceof NavigationEnd) {
        this.getRoutes(event);
      }
    });
    this.getRoutes(this.router);
  }

  public expandSubMenus(menu: MenuItem): void {
    sessionStorage.setItem('menuValue', menu.menuValue);
    this.sidebarData.map((mainMenus: SideBarData) => {
      mainMenus.menu.map((resMenu: MenuItem) => {
        if (resMenu.menuValue == menu.menuValue) {
          menu.showSubRoute = !menu.showSubRoute;
        } else {
          resMenu.showSubRoute = false;
        }
      });
    });
  }
  private getRoutes(route: { url: string }): void {
    const bodyTag = document.body;

    bodyTag.classList.remove('slide-nav')
    bodyTag.classList.remove('opened')
    this.currentUrl = route.url;

    const splitVal = route.url.split('/');


    this.base = splitVal[1];
    this.page = splitVal[2];
  }
  public miniSideBarMouseHover(position: string): void {
    if (position == 'over') {
      this.sideBar.expandSideBar.next("true");
    } else {
      this.sideBar.expandSideBar.next("false");
    }
  }

}

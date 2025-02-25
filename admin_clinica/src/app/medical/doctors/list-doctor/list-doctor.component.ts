import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DoctorService } from '../service/doctor.service';

// cerrar ventana emergente [delete]
declare var $: any;

@Component({
  selector: 'app-list-doctor',
  templateUrl: './list-doctor.component.html',
  styleUrls: ['./list-doctor.component.scss']
})
export class ListDoctorComponent {

  public usersList: any = [];
    dataSource!: MatTableDataSource<any>;

    public showFilter = false;
    public searchDataValue = '';
    public lastIndex = 0;
    public pageSize = 10;
    public totalData = 0;
    public skip = 0;
    public limit: number = this.pageSize;
    public pageIndex = 0;
    public serialNumberArray: Array<number> = [];
    public currentPage = 1;
    public pageNumberArray: Array<number> = [];
    public pageSelection: Array<any> = [];
    public totalPages = 0;

    public role_generals: any = [];
    public doctor_selected: any;
    public role_w_users: any = null;

    constructor(
      public doctorService: DoctorService
    ) { }

    ngOnInit() {
      this.getTableData();
    }



    private getTableData(): void {
      this.usersList = [];
      this.serialNumberArray = [];

      this.doctorService.listDoctor().subscribe((resp: any) => {

        // console.log(resp);
        // `resp.users.data` viene del StaffController @ index, ademas viene de un UserCollection, tenemos que sacarlo del data
        this.totalData = resp.users.data.length;
        this.role_generals = resp.users.data;
        this.getTableDataGeneral();

      });

    }

    //! Evitamos que se realice la consulta cada que navegamos en la navegacion
    getTableDataGeneral() {
      this.usersList = [];
      this.serialNumberArray = [];

      this.role_generals.map((res: any, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {

          this.usersList.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<any>(this.usersList);
      this.calculateTotalPages(this.totalData, this.pageSize);
    }

    selectUser(rol: any) {
      this.doctor_selected = rol;
    }

    deleteUser() {

      this.doctorService.deleteDoctor(this.doctor_selected.id).subscribe((res: any) => {

        if (res.message == 403) {
          this.role_w_users = res.text;
          return;
        }

        console.log(res);
        let INDEX = this.usersList.findIndex( (item:any) => item.id == this.doctor_selected.id);
        // significa que ya encontro la ubicacion
        if (INDEX != -1) {
          this.usersList.splice(INDEX, 1);

          // Cerrar modal #2
          $('#delete_patient').hide();
          $('#delete_patient').removeClass("show");
          $('.modal-backdrop').remove();
          $('.body').removeClass();
          $('.body').removeAttr("style");

          this.doctor_selected = null;
          // Cerrar modal #1
          // this.closebutton.nativeElement.click();
        }
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public searchData(value: any): void {
      // this.dataSource.filter = value.trim().toLowerCase();
      // this.usersList = this.dataSource.filteredData;

      if (!value) {
        this.getTableDataGeneral();
      } else {
        this.dataSource.filter = value.trim().toLowerCase();
        this.usersList = this.dataSource.filteredData;
        this.calculateTotalPages((this.usersList.length > this.pageSize ? this.pageSize : this.usersList.length), this.pageSize);
      }

    }

    public sortData(sort: any) {
      const data = this.usersList.slice();

      if (!sort.active || sort.direction === '') {
        this.usersList = data;
      } else {
        this.usersList = data.sort((a: any, b: any) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const aValue = (a as any)[sort.active];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const bValue = (b as any)[sort.active];
          return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
        });
      }
    }

    public getMoreData(event: string): void {
      if (event == 'next') {
        this.currentPage++;
        this.pageIndex = this.currentPage - 1;
        this.limit += this.pageSize;
        this.skip = this.pageSize * this.pageIndex;
        this.getTableDataGeneral();
      } else if (event == 'previous') {
        this.currentPage--;
        this.pageIndex = this.currentPage - 1;
        this.limit -= this.pageSize;
        this.skip = this.pageSize * this.pageIndex;
        this.getTableDataGeneral();
      }
    }

    public moveToPage(pageNumber: number): void {
      this.currentPage = pageNumber;
      this.skip = this.pageSelection[pageNumber - 1].skip;
      this.limit = this.pageSelection[pageNumber - 1].limit;
      if (pageNumber > this.currentPage) {
        this.pageIndex = pageNumber - 1;
      } else if (pageNumber < this.currentPage) {
        this.pageIndex = pageNumber + 1;
      }
      this.getTableDataGeneral();
    }

    public PageSize(): void {
      this.pageSelection = [];
      this.limit = this.pageSize;
      this.skip = 0;
      this.currentPage = 1;
      this.searchDataValue = '';
      this.getTableDataGeneral();
    }

    private calculateTotalPages(totalData: number, pageSize: number): void {
      this.pageNumberArray = [];
      this.totalPages = totalData / pageSize;
      if (this.totalPages % 1 != 0) {
        this.totalPages = Math.trunc(this.totalPages + 1);
      }
      /* eslint no-var: off */
      for (var i = 1; i <= this.totalPages; i++) {
        const limit = pageSize * i;
        const skip = limit - pageSize;
        this.pageNumberArray.push(i);
        this.pageSelection.push({ skip: skip, limit: limit });
      }
    }

}

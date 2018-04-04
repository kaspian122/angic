import {Component} from '@angular/core';
import {List} from "../../../models/list";
import {ModalLogViewComponent} from "../../modal-log-view/modal-log-view.component";
import {BaseViewComponent} from "../base-view/base-view.component";


@Component({
  selector: 'app-grid-view',
  templateUrl: './grid-view.component.html',
})
export class GridViewComponent extends BaseViewComponent {
  appList: List = new List;

  loadData() {
    console.log('load data');
    this.appList = new List;
    this.loader = true;
    this.dataService.getMain(this.getSortParameter(), this.filter, this._query, this._days)
      .subscribe(
        (data: List) => this.appList = List.fromDTO(data),
        () => {},
        () => this.loader = false
      );
  }

  openLog(app: any, type: string, level: string = null) {
    this.dataService.check().subscribe(()=>{
      this.modal = this.modalService.show(ModalLogViewComponent);
      if (level) {
        this.modal.content.filter[level] = true;
        this.modal.content.setFilter(level);
      }

      let data = {
        'build_id': app.build_id,
        'deploy_id': app.deploy_id,
        'build_number': type == 'build' ? app.build_build_number : app.deploy_build_number
      };

      this.modal.content.init(app, data, type);
    });
  }
}

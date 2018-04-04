import {Component, Input, OnInit} from '@angular/core';
import {DataService} from "../../../services/data/data.service";
import {List} from "../../../models/list";
import {BsModalRef, BsModalService} from "ngx-bootstrap";
import {ModalBuildStreamViewComponent} from "../../modal-build-stream-view/modal-build-stream-view.component";
import {ModalDeploymentStreamViewComponent} from "../../modal-deployment-stream-view/modal-deployment-stream-view.component";
import {ModalMonitoringViewComponent} from "../../modal-monitoring-view/modal-monitoring-view.component";
import {ModalLogViewComponent} from "../../modal-log-view/modal-log-view.component";
import {Subject} from "rxjs/Subject";

@Component({
    selector: 'app-base-view',
    template: ``,
})
export class BaseViewComponent implements OnInit {
  loader: boolean = false;
  modal: BsModalRef;
  appList: List = new List;
  sorting: any[] = [];
  filter: string;

  protected _days: number;
  protected _query: string;

  protected reload = new Subject<void>();

  @Input() set days(days: number) {
    this._days = days;
    this.reload.next();
  }

  @Input() set query(query: string) {
    this._query = query;
    this.reload.next();
  }

  constructor(
    protected dataService: DataService,
    protected modalService: BsModalService
  ) { }

  ngOnInit() {
    this.reload.subscribe(() => this.loadData());
    this.reload.next();
  }

  buildStreamView(app: any) {
    this.dataService.check().subscribe(()=> {
      this.modal = this.modalService.show(ModalBuildStreamViewComponent);
      this.modal.content.init(app, this._days);
    });
  }

  deploymentStreamView(app: any) {
    this.dataService.check().subscribe(()=> {
      this.modal = this.modalService.show(ModalDeploymentStreamViewComponent);
      this.modal.content.init(app, this._days);
    });
  }

  loadData() {
    throw new Error('Not implemented');
  }

  monitoringView(app: any) {
    this.dataService.check().subscribe(()=> {
      this.modal = this.modalService.show(ModalMonitoringViewComponent);
      this.modal.content.init(app, this._days);
    });
  }


  isSortedBy(sort: string) {
    return this.sorting.filter(e => e.dir+e.name == sort).length > 0;
  }

  resetSort(sort: string[]) {
    this.sorting = this.sorting.filter(e => sort.indexOf(e.name) === -1);
    this.loadData();
  }

  isColumnSortedBy(sort: string[]) {
    return !!this.sorting.find(e => sort.indexOf(e.name) !== -1);
  }

  isFilteredBy(filter: string) {
    if (filter == 'ALL' && !this.filter) return true;
    return this.filter == filter;
  }

  addSort(name: string, dir: string, reset: string[] = []) {
    this.sorting = this.sorting.filter(e => reset.indexOf(e.name) === -1);
    let s = this.sorting.filter(e => e.name != name);
    s.push({'name': name, 'dir': dir});
    this.sorting = s;
    this.loadData();
  }

  setFilter(filter: string|null) {
    this.filter = filter;
    this.loadData();
  }

  getSortParameter() {
    return this.sorting.map(e => e.dir+e.name);
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

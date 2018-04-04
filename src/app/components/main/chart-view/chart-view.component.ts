import {Component} from '@angular/core';
import {List} from "../../../models/list";
import {BaseViewComponent} from "../base-view/base-view.component";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-chart-view',
  templateUrl: './chart-view.component.html',
})
export class ChartViewComponent extends BaseViewComponent {
  appList: any;

  options = {
    responsive: true,
    maintainAspectRatio: false,
    cutoutPercentage: 60,
    legend: {
      position: 'bottom',
      labels: {
        boxWidth: 10,
        fontSize: 10,
      },
      onClick: (e, legendItem) => {this.legendClick.call(this, legendItem);}
    }
  };

  loadData() {
    console.log('load data');
    this.loader = true;
    this.dataService.getMainCharts(this.getSortParameter(), this.filter, this._query, this._days)
      .pipe(
        map(data => this.convert(data))
      )
      .subscribe(
        data => {
          this.appList = {data: data};
        },
        () => {},
        () => this.loader = false
      );
  }

  convert(data) {

    data.data.rows.map((v, i, a) => {
      data.data.rows[i].data = JSON.parse(data.data.rows[i].data);
      data.data.rows[i].data.data.data = JSON.parse(data.data.rows[i].data.data.data);
    });

    let res = [];

    data.data.rows.forEach(r => {

      let n = res.find(f => f.app_id == r.app_id);

      if (!n) {
        n = {'app_id': r.app_id, 'env': r.env, 'updated_at': r.last_updated_at};
        res.push (n)
      }

      switch (r.type) {
        case 'build':
          let yaml = r.data.data.data.input.yaml;

          n.name = yaml.app.name + " " + yaml.build.version;

          n.builds = this.datasetConfig([
            r.data.build_count_by_status.success,
            r.data.build_count_by_status.failed,
            r.data.build_count_by_status.running,
          ], ['114,219,131','208,2,27','245,166,35'],['Success','Failed','Running',]);

          break;
        case 'deploy':
          n.deployments = this.datasetConfig([
            r.data.deploy_count_by_status.success,
            r.data.deploy_count_by_status.failed,
            r.data.deploy_count_by_status.running,
          ], ['114,219,131','208,2,27','245,166,35'],['Success','Failed','Running',]);

          break;
        case 'monitor':
          n.instances = this.datasetConfig([
            r.data.instance_count_by_status.green,
            r.data.instance_count_by_status.red,
            r.data.instance_count_by_status.yellow,
          ], ['114,219,131','208,2,27','245,231,39'],['Green', 'Red', 'Yellow']);
      }

    });
    return res;
  }

  datasetConfig(data: any[], color: any[], labels: any[]) {
    return {
      datasets: [{
        data: [data[0],data[1],data[2]],
        backgroundColor: ['rgba('+color[0]+', 0.5)', 'rgba('+color[1]+', 0.5)', 'rgba('+color[2]+', 0.5)',],
        borderColor: ['#fff', '#fff', '#fff'],
        hoverBorderColor: ['#fff', '#fff', '#fff'],
        hoverBackgroundColor: ['rgba('+color[0]+', 0.8)', 'rgba('+color[1]+', 0.8)', 'rgba('+color[2]+', 0.8)',],
        borderWidth: [0,0,0],
        hoverBorderWidth: [0,0,0],
      }],
      labels: [labels[0], labels[1], labels[2],]
    }
  }

  legendClick(legendItem) {
    console.log(this, legendItem);
  }

}

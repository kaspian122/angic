///<reference path="../../../../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {Holder} from '../../../../models/holder/holder';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {MkdService} from '../../../../services/mkd/mkd.service';
import {AuthService} from '../../../../services/auth/auth.service';
import {HolderService} from '../../../../services/holder/holder.service';
import {MeetingService} from '../../../../services/meeting/meeting.service';

@Component({
  selector: 'app-did-not-participate-holders',
  templateUrl: './did-not-participate-holders.component.html',
  styleUrls: ['./did-not-participate-holders.component.css']
})
export class DidNotParticipateHoldersComponent implements OnInit, AfterViewInit {

  displayedColumns = ['porch', 'apartment', 'fio', 'phone', 'voteCount'];
  dataSource = null;
  totalLength = 0;
  hasSuperPrivileges = false;

  @Input()
  holders?: Holder[] = null;

  @Input()
  meetingId?: string = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private mkdService: MkdService,
    private authService: AuthService,
    private meetingService: MeetingService
  ) {
  }

  ngOnInit() {
    this.totalLength = this.holders.length;
    this.mkdService.currentMkd.subscribe(mkd => {
      this.hasSuperPrivileges = this.authService.checkRole(['CHAIRMAN', 'SYSTEM_ADMIN', 'BOARD_MEMBER'], mkd.authorities);
    });
    this.dataSource = new MatTableDataSource<Holder>(this.holders);
  }

  ngAfterViewInit(): void {


    this.dataSource.paginator = this.paginator;
  }

  loadToExcel() {
    this.meetingService.getExcelFileNoTakePart(this.meetingId).subscribe(
       data => this.downloadFile(data, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Список собственников.xlsx'));
  }

  private downloadFile(data, contentType: string, downloadTitle: string) {
    let blob = new Blob([data], { type: contentType });
    let url= window.URL.createObjectURL(blob);
    const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;

    a.href = url;
    a.download = downloadTitle;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

}

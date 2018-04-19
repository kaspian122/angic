import { Component, OnInit } from '@angular/core';
import {DataService} from "../../../services/data/data.service";
import {MkdHoldersList} from "../../../models/mkd-holders-list";
import {MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-holder-list',
  templateUrl: './holder-list.component.html',
  styleUrls: ['./holder-list.component.css']
})
export class HolderListComponent implements OnInit {

    public holdersList?:MkdHoldersList = null;
    public holdersData = [];
    public dataSource = new MatTableDataSource();
    public displayedColumns = ['apartmentNumber', 'holderName', 'certificateNumber', 'certificateDate', 'area', 'holderShareAmount', 'totalShare', 'voting', 'percentage'];

    constructor(
        private dataService: DataService,
    ) { }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    ngOnInit() {
        this.dataService.currentMkd.subscribe(
            mkd => {
                this.dataService.getHoldersList(mkd.mkdId).subscribe(
                    holdersList => {
                        this.holdersData = [];
                        this.holdersList = holdersList;
                        for (let holder of this.holdersList.holders){
                            let holderRow = {
                                apartmentId: holder.apartment.id,
                                holderId: holder.holder.id,
                                userId: holder.user.id,
                                apartmentNumber: holder.apartment.number,
                                holderFirstName: holder.user.firstName,
                                holderLastName: holder.user.lastName,
                                holderSecondName: holder.user.secondName,
                                certificateNumber: holder.holder.certificateNumber,
                                certificateDate: holder.holder.certificateDate,
                                area: holder.apartment.area,
                                holderShareAmount: holder.holder.shareAmount,
                                totalShare: holder.apartment.totalShare
                            };
                            this.holdersData.push(holderRow);
                        }
                        this.dataSource = new MatTableDataSource(this.holdersData);

                    }
                );
            }
        )
    }

}

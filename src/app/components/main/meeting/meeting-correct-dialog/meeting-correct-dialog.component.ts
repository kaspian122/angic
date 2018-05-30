import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-meeting-correct-dialog',
  templateUrl: './meeting-correct-dialog.component.html',
  styleUrls: ['./meeting-correct-dialog.component.css']
})
export class MeetingCorrectDialogComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MeetingCorrectDialogComponent>
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      description: ['', ''],
    });
  }

  save() {
    this.dialogRef.close(this.form.value.description);
  }

  close() {
    this.dialogRef.close();
  }

}

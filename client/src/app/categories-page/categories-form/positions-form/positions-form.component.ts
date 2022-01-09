import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Position } from 'src/app/shared/interfaces';
import { PositionsService } from 'src/app/shared/services/positions.service';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit {
  @Input('categoryId') categoryId!: string
  @ViewChild('modal') modalRef!: ElementRef

  positions: Position[] = [];
  loading = false;

  constructor(private positionsService: PositionsService) { }

  ngOnInit() {
    this.loading = true;
    this.positionsService.fetch(this.categoryId).subscribe(positions => {
      this.positions = positions;
      this.loading = false;
    })
  }

}

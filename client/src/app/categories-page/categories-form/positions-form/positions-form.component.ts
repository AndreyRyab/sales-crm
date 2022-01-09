import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MaterialInstance, MaterialService } from 'src/app/shared/classes/material.service';
import { Position } from 'src/app/shared/interfaces';
import { PositionsService } from 'src/app/shared/services/positions.service';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('categoryId') categoryId!: string
  @ViewChild('modal') modalRef!: ElementRef

  positions: Position[] = [];
  loading = false;
  modal!: MaterialInstance;

  constructor(private positionsService: PositionsService) { }

  ngOnInit() {
    this.loading = true;
    this.positionsService.fetch(this.categoryId).subscribe(positions => {
      this.positions = positions;
      this.loading = false;
    })
  };

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  };

  ngOnDestroy() {
    this.modal.destroy();
  };

  onSelectPosition(position: Position) {
    this.modal.open();
  };

  onAddPosition() {
    this.modal.open();
  };

}

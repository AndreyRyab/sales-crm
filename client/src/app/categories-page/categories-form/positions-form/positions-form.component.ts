import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  positionId: string | undefined = '';
  modal!: MaterialInstance;
  form!: FormGroup;

  constructor(private positionsService: PositionsService) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(null, [Validators.required, Validators.min(1)]),
    });
    this.loading = true;
    this.positionsService.fetch(this.categoryId).subscribe(positions => {
      this.positions = positions;
      this.loading = false;
    });
  };

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  };

  ngOnDestroy() {
    this.modal.destroy();
  };

  onSelectPosition(position: Position) {
    this.positionId = position._id;
    this.form.patchValue({
      name: position.name,
      cost: position.cost,
    })
    this.modal.open();
    MaterialService.updateTextInputs();
  };

  onAddPosition() {
    this.positionId = '';
    this.modal.open();
    this.form.reset({
      name: '',
      cost: '',
    });
  };

  onCancel() {
    this.modal.close();
    this.form.reset({
      name: '',
      cost: '',
    });
  };

  onSubmit() {
    this.form.disable();

    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId,
    };

    const completed = () => {
      this.modal.close();
      this.form.reset({
        name: '',
        cost: '',
      });
      this.form.enable();
    }

    if (this.positionId) {
      newPosition._id = this.positionId;
      this.positionsService.update(newPosition)
      .subscribe({
        next: position => {
          const posIndex = this.positions.findIndex(pos => pos._id === position._id);
          this.positions[posIndex] = position;
          MaterialService.toast('Position has been updated');
        },
        error: error => {
          MaterialService.toast(error.message);
        },
        complete: () => {
          completed();
        },
      })
    }  else {
      this.positionsService.create(newPosition)
      .subscribe({
        next: position => {
          MaterialService.toast('New position has been created');
          this.positions.push(position);
        },
        error: error => {
          MaterialService.toast(error.error.message);
        },
        complete: () => {
          completed();
        },
      })
    }
  };

  onDeletePosition($event: Event, position: Position) {
    $event.stopPropagation();

    const decision = window.confirm(`You're going to delete ${position.name}. Is it ok?`);

    if (decision) {
      this.positionsService.delete(position)
        .subscribe({
          next: res => {
            const posIndex = this.positions.findIndex(pos => pos._id === position._id);
            this.positions.splice(posIndex, 1);
            MaterialService.toast('Position has been deleted')
          },
          error: error => MaterialService.toast(error.message),
        })
    }
  };

}

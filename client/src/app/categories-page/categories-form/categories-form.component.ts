import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { Position } from 'src/app/shared/interfaces';
import { CategoriesService } from 'src/app/shared/services/categories.service';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit {

  @ViewChild('input') inputRef!: ElementRef

  form!: FormGroup;
  image!: File;
  imagePreview: string | ArrayBuffer | null | undefined = '';
  isNew = true;
  category: any;

  constructor(private route: ActivatedRoute,
              private categoriesService: CategoriesService,
              private router: Router) { };

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    })

    this.form.disable();

    this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            if (params['id']) {
              this.isNew = false;
              return this.categoriesService.getById(params['id']);
            }

            return of(null);
          }
        )
      )
      .subscribe({
        next: category => {
          if (category) {
            this.category = category;
            this.form.patchValue({
              name: category.name,
            });
            this.imagePreview = category.imageSrc;
            MaterialService.updateTextInputs();
          }
          this.form.enable();
        },
        error: error => MaterialService.toast(error.error.message)
      })

  };

  triggerClick() {
    this.inputRef.nativeElement.click();
  };

  deleteCategory(){
    const decision = window.confirm(`${this.category.name} Category seems to be deleted. Are you shure?`);
    if(decision) {
      this.categoriesService.delete(this.category._id)
        .subscribe({
          next: (response) => {
            MaterialService.toast(response.message);
          },
          error: error => {
            MaterialService.toast(error.error.message);
          },
          complete: () => {
            this.router.navigate(['/categories']);
          },
        })
    }
  };

  onFileUpload(event: any) { // 'any' in order to use TS (it doesn't know .files)
    const file = event.target.files[0];
    this.image = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };

    reader.readAsDataURL(file);
  };

  onSubmit() {
    let obs$
    this.form.disable();
    if (this.isNew) {
      obs$ = this.categoriesService.create(this.form.value.name, this.image);
    } else {
      obs$ = this.categoriesService.update(this.category._id, this.form.value.name, this.image);
    };

    obs$.subscribe({
      next: category => {
        this.category = category;
        this.form.enable();
        MaterialService.toast('Data has been changed')
      },
      error: error => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      }
    });
  };
}

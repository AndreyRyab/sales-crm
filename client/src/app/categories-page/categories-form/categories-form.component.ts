import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { CategoriesService } from 'src/app/shared/services/categories.service';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.css']
})
export class CategoriesFormComponent implements OnInit {
  form!: FormGroup;
  isNew = true;

  constructor(private route: ActivatedRoute,
              private categoriesService: CategoriesService) { };

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    })

    /* this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        // Editing the form
        this.isNew = false;
      }
    }); */
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
            this.form.patchValue({
              name: category.name,
            });
            MaterialService.updateTextInputs();
          }
        },
        error: error => MaterialService.toast(error.error.message)
      })

  };

  onSubmit() {

  };

}

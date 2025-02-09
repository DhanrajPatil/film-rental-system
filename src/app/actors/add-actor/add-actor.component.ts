import { Component, OnInit } from '@angular/core';
import {Actor} from "../../models/actor";
import {ActorApiService} from "../service/actor-api.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AbstractControl, FormBuilder, FormGroup, FormGroupDirective, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'frs-add-actor',
  templateUrl: './add-actor.component.html',
  styleUrls: ['./add-actor.component.css']
})
export class AddActorComponent implements OnInit {
  actionHeader: string = 'Add Actor';
  actionButtonLabel: string = 'Save';
  actorForm!: FormGroup;
  actorId!: number | undefined;
  isViewForm: boolean = false;
  isEditForm: boolean = false;

  constructor(private actorService: ActorApiService,
              private snackBar: MatSnackBar,
              private formBuilder: FormBuilder,
              private router: Router,
              private route: ActivatedRoute) {
    let isView = false;
    if(this.route.snapshot.url.length > 1) {
      isView = this.route.snapshot.url[1].path === 'view';
      this.isEditForm = this.route.snapshot.url[1].path === 'edit';
    }
    this.isViewForm = isView;
    this.actorForm = this.formBuilder.group({
      firstName: [
        {value: '', disabled: isView},
        [Validators.required, Validators.minLength(2), Validators.pattern(/[\S]/)]
      ],
      lastName: [
        {value: '', disabled: isView},
        [Validators.required, Validators.minLength(2), Validators.pattern(/[\S]/)]
      ]
    });
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.actorId = +id;
      this.actionHeader = isView ? 'Actor Details:' : 'Edit Actor';
      this.actionButtonLabel = 'Update';
      this.actorService.getActor(Number(id)).subscribe({
        next: (data) => {
          this.actorForm.patchValue(data);
        },
        error: (error) => {
          this.snackBar.open('Actor not found', 'Close');
        }
      });
    }
  }

  ngOnInit(): void { }

  addActor() {
    const actor = this.actorForm.value as Actor;
    this.actorService.addActor(actor).subscribe({
      next: (data) => {
        this.actorId = data.id;
        this.navigateToView();
        this.snackBar.open('Actor created', 'Close');
      },
      error:  (error) => {
        this.snackBar.open('Actor creation failed!', 'Close');
      }
    });
  }

  resetForm() {
    this.actorForm.reset();
  }

  navigateToView() {
    this.router.navigate(['actors', this.actorId, 'view' ]);
  }

  editForm() {
    this.router.navigate(['actors', this.actorId, 'edit' ]);
  }

  createNew() {
    this.router.navigate(['actors', 'add']);
  }
}

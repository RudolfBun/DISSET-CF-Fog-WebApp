import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroupDirective, ControlContainer, Validators, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationsDialogComponent } from './applications-dialog/applications-dialog.component';
import { Application, ApplicationsObject } from 'src/app/models/application';
import { ComputingNode } from 'src/app/models/computing-node';
import { IfStmt } from '@angular/compiler';
import { QuantityCounterService } from 'src/app/services/quantity-counter/quantity-counter.service';

// outsource one other repository
const NOT_CONFIGURED_ICON = 'fas fa-times-circle fa-2x';
const CONFIGURED_ICON = 'fas fa-check-circle fa-2x';

const SET_APPS_ICON = 'check_circle_outline';
const UNSET_APPS_ICON = 'error';

const INVALID_TOOLTIP = 'Invalid quantity!';
const UNSET_APPS_TOOLTIP = 'Applications are not configured!';

@Component({
  selector: 'app-configurable-node',
  templateUrl: './configurable-node.component.html',
  styleUrls: ['./configurable-node.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class ConfigurableNodeComponent implements OnInit {
  @Input() public resources: string[];
  @Input() public node: ComputingNode;
  @Output() public readonly setComputingNode = new EventEmitter<ComputingNode>();
  @Output() public readonly removeEmitter = new EventEmitter<string>();

  public statusIcon: string;
  public appsStatusIcon: string;
  public cloudCardForm: FormGroup;
  public selectedResource: string;
  public numOfApps = 0;
  public cloudIcon: string;
  public errorTooltip: string;
  public showErrorTooltip = true;

  private applications: ApplicationsObject = {};
  private isCloudBoolean: boolean;
  private readonly maxApplicationsQuantity = 10;

  public readonly MAX_TOOLTIP = 'The maximum value is ' + this.maxApplicationsQuantity + '!';

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public quantityCounterService: QuantityCounterService
  ) {}

  ngOnInit(): void {
    this.statusIcon = NOT_CONFIGURED_ICON;
    this.appsStatusIcon = UNSET_APPS_ICON;
    this.errorTooltip = INVALID_TOOLTIP;

    this.isCloudBoolean = this.node.isCloud === true;
    this.cloudIcon = 'fas fa-smog fa-4x';
    if (this.isCloudBoolean) {
      this.cloudIcon = 'fas fa-cloud fa-4x';
    }
    this.initForm();
    this.sendConfiguredNodeToParent();
  }

  onChange(event: any): void {
    if (
      (this.numOfApps === Object.keys(this.applications).length ||
        this.numOfApps < Object.keys(this.applications).length) &&
      this.cloudCardForm.valid
    ) {
      this.appsStatusIcon = SET_APPS_ICON;
      this.cloudCardForm.controls.allAppsConfigured.setValue(true);
      this.showErrorTooltip = false;
    } else {
      this.appsStatusIcon = UNSET_APPS_ICON;
      this.cloudCardForm.controls.allAppsConfigured.setValue(false);
      this.showErrorTooltip = true;
      if (this.numOfApps > this.maxApplicationsQuantity) {
        this.errorTooltip = this.MAX_TOOLTIP;
      } else if (this.numOfApps === 0) {
        this.errorTooltip = INVALID_TOOLTIP;
      } else {
        this.errorTooltip = UNSET_APPS_TOOLTIP;
      }
    }
  }
  private getNumberOfConfigurabledApps(apps: ApplicationsObject): number {
    let sum = 0;
    for (const [id, app] of Object.entries(apps)) {
      sum += app.quantity;
    }
    return sum;
  }

  openDialog(): void {
    /* if (Object.values(this.applications).length === 0) {
      const firstAppId = 'app' + 1;
      const firsApp = new Application();
      firsApp.id = firstAppId;
      firsApp.quantity = 1;
      this.applications[firsApp.id] = firsApp;
    }
    this.quantityCounterService.setAppsQuantities(this.numOfApps, this.getNumberOfConfigurabledApps(this.applications)); */

    const dialogRef = this.dialog.open(ApplicationsDialogComponent, {
      panelClass: 'applications-dialog-panel',
      disableClose: true,
      width: '80%',
      height: '80%',
      data: { numOfApps: this.numOfApps, applications: this.applications }
    });

    dialogRef.afterClosed().subscribe((result: { applications: ApplicationsObject; valid: boolean }) => {
      this.applications = result.applications;
      console.log(this.applications);

      if (
        !result.valid ||
        !this.cloudCardForm.valid ||
        this.getNumberOfConfigurabledApps(this.applications) !== this.numOfApps
      ) {
        this.cloudCardForm.controls.allAppsConfigured.setValue(false);
        this.appsStatusIcon = UNSET_APPS_ICON;
        this.showErrorTooltip = true;
      } else {
        this.cloudCardForm.controls.allAppsConfigured.setValue(true);
        this.appsStatusIcon = SET_APPS_ICON;
        this.showErrorTooltip = false;
      }
    });
  }

  private initForm(): void {
    this.selectedResource = this.resources[0]; // needs better solution
    this.cloudCardForm = this.formBuilder.group({
      numOfApplications: [
        '',
        [Validators.required, Validators.max(this.maxApplicationsQuantity), Validators.pattern(/^[1-9]+[0-9]*$/)]
      ],
      allAppsConfigured: false,
      quantity: [this.node.quantity, [Validators.min(1)]]
    });
  }

  private sendConfiguredNodeToParent(): void {
    if (this.cloudCardForm) {
      this.cloudCardForm.controls['numOfApplications'].valueChanges.subscribe((newValue: number) => {
        const oldValue = this.cloudCardForm.value['numOfApplications'];
        if (oldValue > newValue) {
          this.applications = this.updateAppsObject(this.applications, newValue);
        }
      });

      this.cloudCardForm.valueChanges.subscribe(value => {
        if (value.allAppsConfigured) {
          const computingNode = this.createComputingNode(true, this.selectedResource, this.applications);
          this.setComputingNode.emit(computingNode);
          this.statusIcon = CONFIGURED_ICON;
        } else {
          const computingNode = this.createComputingNode(false);
          this.setComputingNode.emit(computingNode);
          this.statusIcon = NOT_CONFIGURED_ICON;
        }
      });
    }
  }

  private updateAppsObject(apps: ApplicationsObject, currentValue: number): ApplicationsObject {
    const restOfTheNodes = {};
    let index = 0;
    for (const [id, app] of Object.entries(apps)) {
      if (index === currentValue) {
        break;
      }
      if (index + app.quantity <= currentValue) {
        restOfTheNodes[id] = app;
        index += app.quantity;
      } else {
        const quantity = currentValue - index;
        index += quantity;
        app.quantity = quantity;
        restOfTheNodes[id] = app;
        break;
      }
    }
    return restOfTheNodes;
  }

  private createComputingNode(
    isConfigured: boolean,
    resource: string = '',
    applications: ApplicationsObject = {}
  ): ComputingNode {
    return {
      id: this.node.id,
      x: 0,
      y: 0,
      resource,
      applications,
      isCloud: this.isCloudBoolean,
      isConfigured,
      quantity: this.node.quantity
    } as ComputingNode;
  }

  decrease() {
    if (this.node.isCloud) {
      if (this.quantityCounterService.decreseClouds(this.node.quantity)) {
        this.node.quantity--;
        this.cloudCardForm.get('quantity').setValue(this.node.quantity);
      }
    } else {
      if (this.quantityCounterService.decreseFogs(this.node.quantity)) {
        this.node.quantity--;
        this.cloudCardForm.get('quantity').setValue(this.node.quantity);
      }
    }
  }
  increase() {
    if (this.node.isCloud) {
      if (this.quantityCounterService.increaseClouds()) {
        this.node.quantity++;
        this.cloudCardForm.get('quantity').setValue(this.node.quantity);
      }
    } else {
      if (this.quantityCounterService.increaseFogs()) {
        this.node.quantity++;
        this.cloudCardForm.get('quantity').setValue(this.node.quantity);
      }
    }
  }
}
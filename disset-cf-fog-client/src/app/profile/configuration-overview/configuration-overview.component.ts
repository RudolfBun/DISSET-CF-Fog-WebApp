import { ChangeDetectorRef, EventEmitter } from '@angular/core';
import { Component, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { UserConfigurationService } from 'src/app/services/configuration/user-configuration/user-configuration.service';

@Component({
  selector: 'app-configuration-overview',
  templateUrl: './configuration-overview.component.html',
  styleUrls: ['./configuration-overview.component.css']
})
export class ConfigurationOverviewComponent {
  public showActions = false;
  @Input() public directory: string;
  @Output() public goBack = new EventEmitter<void>();

  constructor(private changeDetectorRef: ChangeDetectorRef, public configService: UserConfigurationService) {}

  public showActionsButtons(): void {
    this.showActions = true;
  }
}

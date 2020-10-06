import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material/angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigurationComponent } from './configuration/configuration.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StepBackDialogComponent } from './configuration/step-back-dialog/step-back-dialog.component';
import { ConnectionComponent } from './configuration/connection/connection.component';
import { ListStationsComponent } from './configuration/list-stations/list-stations.component';
import { ConfigurableStationComponent } from './configuration/list-stations/configurable-station/configurable-station.component';
import { NodeQuantityFormComponent } from './configuration/node-quantity-form/node-quantity-form.component';
import { ConfigurableNodeComponent } from './configuration/list-configurable-nodes/configurable-node/configurable-node.component';
import { ListConfigurableNodesComponent } from './configuration/list-configurable-nodes/list-configurable-nodes.component';
import { ApplicationsDialogComponent } from './configuration/list-configurable-nodes/configurable-node/applications-dialog/applications-dialog.component';
import { ApplicationCardComponent } from './configuration/list-configurable-nodes/configurable-node/applications-dialog/application-card/application-card.component';
import { InfoPanelComponent } from './info-panel/info-panel.component';
import { SidenavItemsComponent } from './navigation/sidenav-items/sidenav-items.component';
import { ToolbarComponent } from './navigation/toolbar/toolbar.component';
import { HomeComponent } from './home/home/home.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    NodeQuantityFormComponent,
    ConfigurationComponent,
    ListConfigurableNodesComponent,
    ConfigurableNodeComponent,
    ApplicationsDialogComponent,
    ApplicationCardComponent,
    StepBackDialogComponent,
    ConnectionComponent,
    ListStationsComponent,
    ConfigurableStationComponent,
    InfoPanelComponent,
    SidenavItemsComponent,
    ToolbarComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
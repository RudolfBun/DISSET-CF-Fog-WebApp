import { Injectable } from '@angular/core';
import { ComputingNodesQuantityData } from 'src/app/models/computing-nodes-quantity-data';
import { BehaviorSubject, Subject } from 'rxjs';
import { ComputingNodesObject } from 'src/app/models/computing-nodes-object';
import { StationsObject, Station } from 'src/app/models/station';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationStateService {
  public maxNumOfNodes = 10;

  private generateGraphSubject = new Subject();
  public generateGraph$ = this.generateGraphSubject.asObservable();

  private stationChangedSubject = new Subject();
  public stationsChanged$ = this.stationChangedSubject.asObservable();

  public nodesQuantity$ = new BehaviorSubject<ComputingNodesQuantityData>(undefined);
  /**
   * This contains the computing nodes (clouds, fogs) which is actially configured.
   */
  public computingNodes: ComputingNodesObject = { clouds: {}, fogs: {} };
  /**
   * This contains the stations which is actially configured.
   */
  public stationNodes: StationsObject = {};

  public setNodesQuantity(quantity: ComputingNodesQuantityData) {
    this.nodesQuantity$.next(quantity);
  }

  public getStationArray(): Station[] {
    const stations: Station[] = [];
    for (const stat of Object.values(this.stationNodes)) {
      stations.push(stat);
    }
    return stations;
  }

  public generateGraph(): void {
    this.generateGraphSubject.next();
  }

  public changeStations(): void {
    this.stationChangedSubject.next();
  }
}

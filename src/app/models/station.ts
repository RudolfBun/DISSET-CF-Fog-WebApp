export class Station {
  id: string;
  starttime: number;
  stoptime: number;
  filesize: number;
  freq: number;
  sensor: number;
  maxinbw: number;
  maxoutbw: number;
  diskbw: number;

  strategy: string; //should be select
  radius: number;
  xCoord?: number;
  yCoord?: number;
  quantity: number;
  valid = false;
  focusedInputName?: string;
}

export class StationsObject {
  [id: string]: Station;
}

import { ConfigurationObject } from 'src/app/models/configuration';
import {
  ApplicationXml,
  ApplianceXml,
  DeviceXml,
  NeighbourXml,
  XmlBaseConfiguration
} from 'src/app/models/xml-configuration-model';

/**
 * It converts configuration object to xml base interface, which the server can parse to xml.
 * @param object - configured object which contains the nesseasry data
 * @param email - user email which determines which folder to scan
 */
export function parseConfigurationObjectToXml(object: ConfigurationObject, email: string): XmlBaseConfiguration {
  const appliances: ApplianceXml[] = [];
  const devices: DeviceXml[] = [];

  for (const node of Object.values(object.nodes)) {
    const applications: ApplicationXml[] = [];
    for (const app of Object.values(node.applications)) {
      const applictaion = {
        $tasksize: app.tasksize,
        name: app.id,
        freq: app.freq,
        instance: app.instance.name,
        numOfInstruction: app.numOfInstruction,
        threshold: app.threshold,
        strategy: app.strategy,
        canJoin: app.canJoin
      } as ApplicationXml;
      applications.push(applictaion);
    }
    const appliance = {
      name: node.id,
      xcoord: node.x,
      ycoord: node.y,
      file: node.resource.name,
      applications: { application: applications }
    } as ApplianceXml;

    if (node.neighbours) {
      const neighbours: NeighbourXml[] = [];
      for (const neighbour of Object.values(node.neighbours)) {
        const xmlNeighbour = {
          name: neighbour.name,
          latency: neighbour.latency
        } as NeighbourXml;
        if (neighbour.parent) {
          xmlNeighbour.parent = neighbour.parent;
        }
        neighbours.push(xmlNeighbour);
      }
      appliance.neighbours = { neighbour: neighbours };
    } else {
      appliance.neighbours = {};
    }
    appliances.push(appliance);
  }

  for (const station of Object.values(object.stations)) {
    for (let i = 0; i < station.number; i++) {
      const randomX = Math.random() * station.radius * 2;
      const randomY = Math.random() * station.radius * 2;
      const x = randomX > station.radius ? randomX - station.radius : randomX;
      const y = randomY > station.radius ? randomX - station.radius : randomY;

      const device = {
        $starttime: station.starttime,
        $stoptime: station.stoptime,
        $number: 1,
        $filesize: station.filesize,
        name: station.id,
        freq: station.freq,
        sensor: station.sensor,
        maxinbw: station.maxinbw,
        maxoutbw: station.maxoutbw,
        diskbw: station.diskbw,
        reposize: station.reposize,
        strategy: station.strategy,
        xCoord: round(x, 1),
        yCoord: round(y, 1)
      } as DeviceXml;
      devices.push(device);
    }
  }
  const tzOffsetInMin = new Date().getTimezoneOffset();
  const tzOffset = (tzOffsetInMin !== 0 ? tzOffsetInMin / 60 : 0) * -1;
  return {
    configuration: {
      email,
      tzOffset,
      appliances: {
        appliances: {
          appliance: appliances
        }
      },
      devices: {
        devices: {
          device: devices
        }
      }
    }
  } as XmlBaseConfiguration;
}

function round(value: number, precision: number): number {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}

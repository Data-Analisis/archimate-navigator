import { Connection } from "./connection";
import { DiagramType } from "./diagram-type";
import { Element } from "./element";
import {
  IDiagram,
  IExtents,
  IModel,
  InitExtents,
  IViewConceptType
} from "./interfaces";
import { Property } from "./property";
import { Relationship } from "./relationship";
import { ViewNode } from "./view-node";

const DIAGRAM_MARGIN = 10;

export class Diagram implements IDiagram {
  public id: string;
  public name?: string;
  public documentation?: string;
  public type: string;
  public properties: Property[];
  public viewpoint?: string;
  public nodes: ViewNode[];
  public connectionRouterType?: string;
  public background?: string;
  public connections: Connection[];
  public path: string;
  private model: IModel;
  private elementsCache?: Element[];
  private relationshipsCache?: Relationship[];
  private diagramsCache?: Diagram[];

  constructor(model: IModel, type: DiagramType) {
    this.model = model;
    this.id = this.model.makeUniqueId();
    this.type = type;
    this.properties = [];
    this.nodes = [];
    this.connections = [];
    this.path = `svg/${this.id}.svg`;
  }

  public relationships(): Relationship[] {
    // TODO: expire this if the diagram changes
    // if (this.relationshipsCache) {
    //   return this.relationshipsCache;
    // }
    this.relationshipsCache = this.connections
      .map(conn => conn.entityInstance())
      .filter(el => el !== undefined)
      .map(rel => rel as Relationship);
    return this.relationshipsCache;
  }

  public elements(): Element[] {
    // TODO: expire this if the diagram changes
    // if (this.elementsCache) {
    //   return this.elementsCache;
    // }
    this.elementsCache = this.nodes
      .map(viewNode => viewNode.entityInstance())
      .filter(entity => entity instanceof Element)
      .map(el => el as Element);
    return this.elementsCache;
  }

  public diagrams(): Diagram[] {
    // TODO: expire this if the diagram changes
    if (this.diagramsCache) {
      return this.diagramsCache;
    }
    this.diagramsCache = this.nodes
      .map(viewNode => viewNode.entityInstance())
      .filter(entity => entity instanceof Diagram)
      .map(el => el as Diagram);
    return this.diagramsCache;
  }

  public toString() {
    return `Diagram<${this.id}>[${this.name}]`;
  }

  public totalViewpoint() {
    return this.viewpoint !== undefined;
  }

  public viewpointDescription(): string {
    if (this.viewpoint === undefined) {
      switch (this.type) {
        case "canvas:CanvasModel":
          return "Canvas";
        case "archimate:SketchModel":
          return "Sketch";
        default:
          return "Total";
      }
    }
    return this.viewpoint.toString();
  }

  public calculateMaxExtents(): IExtents {
    const viewConcepts: IViewConceptType[] = (this
      .nodes as IViewConceptType[]).concat(this.connections);

    if (viewConcepts.length < 1) {
      return {
        maxX: 0,
        maxY: 0,
        minX: 0,
        minY: 0
      };
    }

    const extents: IExtents = viewConcepts
      .map(vc => vc.extents())
      .reduce((accExtents: IExtents, vcExtents: IExtents) => {
        return {
          maxX: Math.max(vcExtents.maxX, accExtents.maxX),
          maxY: Math.max(vcExtents.maxY, accExtents.maxY),
          minX: Math.min(vcExtents.minX, accExtents.minX),
          minY: Math.min(vcExtents.minY, accExtents.minY)
        };
      }, InitExtents);

    return {
      maxX: extents.maxX + DIAGRAM_MARGIN * 2,
      maxY: extents.maxY + DIAGRAM_MARGIN * 2,
      minX: extents.minX - DIAGRAM_MARGIN,
      minY: extents.minY - DIAGRAM_MARGIN
    };
  }
}

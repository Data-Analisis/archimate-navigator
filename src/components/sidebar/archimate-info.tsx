import * as React from "react";
import {
  Diagram,
  Element,
  IEntity,
  IHasRelationships,
  IHasViews,
  Relationship
} from "../../archimate-model";
import { entityClickedFunc } from "../common";
import ElementsTable from "./info/elements-table";
import EntityIdPanel from "./info/entity-id-panel";
import PropertiesPanel from "./info/properties-panel";
import RelationshipsTable from "./info/relationships-table";
import ViewsTable from "./info/views-table";
import Panel from "./panel";

interface IProps {
  entity?: IEntity;
  entityClicked: entityClickedFunc;
}

export default class ArchimateInfo extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <React.Fragment>
        <EntityIdPanel entity={this.props.entity} entityClicked={this.props.entityClicked} />
        {this.documentation()}
        {this.properties()}
        {this.elements()}
        {this.relationships()}
        {this.views()}
      </React.Fragment>
    );
  }

  private elements(): JSX.Element | undefined {
    if (this.props.entity instanceof Diagram) {
      const diagram = this.props.entity as Diagram;
      return (
        <ElementsTable
          elements={diagram.elements()}
          elementClicked={this.props.entityClicked}
        />
      );
    } else {
      return undefined;
    }

  }
  private relationships(): JSX.Element | undefined {
    if (
      this.props.entity instanceof Diagram ||
      this.props.entity instanceof Element
    ) {
      return (
        <RelationshipsTable
          relationships={(this.props
            .entity as IHasRelationships).relationships()}
          entityClicked={this.props.entityClicked}
        />
      );
    } else {
      return undefined;
    }
  }

  private views(): JSX.Element | undefined {
    if (
      this.props.entity instanceof Diagram ||
      this.props.entity instanceof Element ||
      this.props.entity instanceof Relationship
    ) {
      const viewsEntity = this.props.entity as IHasViews;
      return (
        <ViewsTable
          views={viewsEntity.diagrams()}
          entityClicked={this.props.entityClicked}
        />
      );
    } else {
      return undefined;
    }
  }
  private properties(): JSX.Element | undefined {
    if (this.props.entity === undefined) {
      return undefined;
    }
    return (
      <PropertiesPanel properties={this.props.entity.properties || []} />
    );
  }

  private documentation(): JSX.Element | undefined {
    if (this.props.entity === undefined) {
      return undefined;
    }   
    const header = this.props.entity.documentation ? "Documentation" : (<React.Fragment>Documentation <span className="small">(none)</span></React.Fragment>);
    return (
      <Panel 
          header={header}
          initiallyCollapsed={!this.props.entity.documentation}>
        { this.props.entity.documentation || "No Documentation" }
      </Panel>
    )
  }
}

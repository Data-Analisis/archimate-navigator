import * as React from "react";
import { Panel } from 'react-bootstrap';
import { IEntity, Organization } from "../../archimate-model";
import "../archimate-navigator.css";
import { entityClickedFunc } from "../common";
import OrganizationContent from "./organization-content";

interface IProps {
  organization: Organization;
  entityClicked: entityClickedFunc;
  selectedEntity: IEntity | undefined;
}

export default class OrganizationPanel extends React.PureComponent<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <Panel>
        <Panel.Body>
          {this.props.organization ? (
          <OrganizationContent 
              organization={this.props.organization} 
              entityClicked={this.props.entityClicked} 
              selectedEntity={this.props.selectedEntity} 
          />) : undefined}
        </Panel.Body>
      </Panel>
    );
  }
}

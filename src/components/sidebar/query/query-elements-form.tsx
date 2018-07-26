import { List } from "immutable";
import * as React from "react";
import {
  Button,
  ControlLabel,
  FormGroup,
  Glyphicon,
  HelpBlock,
  ListGroup,
  ListGroupItem,
  OverlayTrigger,
  Tooltip,
  Well,
} from "react-bootstrap";
import { Element, IQuery } from "../../../archimate-model";
import ElementPicker from "./element-picker";

interface IProps {
  allElements: List<Element>;
  selectedElements: List<Element>;
  onAddElement: (element: Element) => void;
  onRemoveElement: (element: Element) => void;
  onQueryChanged: (query: IQuery) => void;
}

interface IState {
  showElementPicker: boolean;
}

export default class QueryElementsForm extends React.PureComponent<
  IProps,
  IState
> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      showElementPicker: false,
    }
  }

  public render() {
    const tooltip = (
      <Tooltip>
        Add elements to the query.
      </Tooltip>
    );
    return (
      <React.Fragment>
        <FormGroup controlId="elements">
          <ControlLabel>Elements</ControlLabel>
          <OverlayTrigger placement="right" overlay={tooltip}>
            <Button bsSize="xsmall" className="pull-right" onClick={this.onShowElementPicker}>
              <Glyphicon glyph="plus-sign" /> Add...
            </Button>
          </OverlayTrigger>
          {this.props.selectedElements.size > 0 ?
          <Well>
            <ListGroup>
              {this.props.selectedElements.map(el => (el ?
                <ListGroupItem key={el.id}>
                  <div className="pull-right">
                    <Button bsSize="xsmall" bsStyle="danger" onClick={this.onRemoveElement.bind(this, el)}>
                      <Glyphicon glyph="remove" />
                    </Button>
                  </div>
                  <span className="text-info">{el.type}</span>{": "}
                  {<span className="text-primary">{el.name}</span> || <span className="text-muted">unnamed</span>}
                </ListGroupItem> : undefined
              ))}
            </ListGroup>
          </Well> : null}
          <HelpBlock>Elements to begin query with</HelpBlock>
        </FormGroup>
        <ElementPicker 
          allElements={this.props.allElements}
          selectedElements={this.props.selectedElements}
          onAdd={this.props.onAddElement}
          onRemove={this.props.onRemoveElement}
          onClose={this.onCloseElementPicker}
          show={this.state.showElementPicker}
        />
      </React.Fragment>
    );
  }

  private onShowElementPicker = (event: any) => {
    this.setState({ showElementPicker: true });
  };

  private onRemoveElement = (element: Element, event: any) => {
    this.props.onRemoveElement(element);
  }
  private onCloseElementPicker = () => {
    this.setState({ showElementPicker: false });
  }
}

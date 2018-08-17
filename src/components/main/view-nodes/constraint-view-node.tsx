import { IViewNodeProps } from "./default-element";
import MotivationViewNode from "./motivation-view-node";

export default class ConstraintViewNode extends MotivationViewNode {
  constructor(props: IViewNodeProps) {
    super(props);
    this.state = {
      ...this.state,
      badge: "#archimate-constraint-badge"
    };
  }
}

import * as React from "react";
import AutoBind from "autobind-decorator";

interface Props {}

interface State {}

@AutoBind
export default class HeaderSection extends React.Component<Props, State> {
  public render() {
    return (
      <React.Fragment>
        <h2>Ranking!</h2>
      </React.Fragment>
    );
  }
}

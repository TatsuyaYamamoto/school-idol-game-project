import * as React from "react";
import styled from "styled-components";

import { initAuth, initTracker } from "@sokontokoro/mikan";

const Root = styled.div`
  text-align: center;
`;

interface Props {}

interface State {
  completed: boolean;
}

class Initialize extends React.Component<Props, State> {
  state: State = {
    completed: false,
  };

  public componentDidMount() {
    initAuth().then((user) => {
      initTracker(user.uid);
      this.setState({ completed: true });
    });
  }

  public render() {
    return this.state.completed ? (
      this.props.children
    ) : (
      <Root>
        <div>Initializing...（・８・）</div>
      </Root>
    );
  }
}

export default Initialize;

import * as React from "react";
import AutoBind from "autobind-decorator";
import styled from "styled-components";

const Root = styled.div`
  text-align: center;
`;

interface Props {}

interface State {}

@AutoBind
export default class HeaderSection extends React.Component<Props, State> {
  public render() {
    return (
      <Root>
        <h2>Ranking!</h2>
      </Root>
    );
  }
}

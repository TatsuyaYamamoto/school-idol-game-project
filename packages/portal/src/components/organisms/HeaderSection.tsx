import { FC } from "react";
import styled from "styled-components";

const Root = styled.div`
  text-align: center;
`;

const HeaderSection: FC = () => {
  return (
    <Root>
      <h2>Ranking!</h2>
    </Root>
  );
};

export default HeaderSection;

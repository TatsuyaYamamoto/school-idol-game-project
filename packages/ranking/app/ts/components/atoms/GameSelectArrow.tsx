import * as React from "react";
import styled from "styled-components";

const arrowSize = 50;

const Arrow = styled.div`
  width: ${arrowSize}px;
  height: ${arrowSize}px;

  &::before {
    font-size: ${arrowSize}px;
    color: #ff767b;
  }
`;

export default Arrow;

import * as React from "react";
import styled from "styled-components";

const JumpGameButton = styled.div`
  color: #ffffff;
  background-color: #f57c00;
  text-decoration: none;

  width: 200px;
  padding: 10px;
  text-align: center;

  border-radius: 30px;
  cursor: pointer;

  margin: 0 auto;

  &::before {
    content: "Jump to game!";
  }

  &:hover {
    content: "Jump to game!";
  }
`;

export default JumpGameButton;

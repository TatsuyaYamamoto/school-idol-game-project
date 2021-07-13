import * as React from "react";
import AutoBind from "autobind-decorator";
import styled from "styled-components";

const { version } = require("../../../../package.json");

interface Props {}

interface State {}

const currentYear = new Date().getFullYear();
const sokontokoroUrl = "https://www.sokontokoro-factory.net/";
const repoUrl =
  "https://github.com/TatsuyaYamamoto/school-idol-game-project/packages/ranking/";

const Root = styled.div`
  position: fixed;
  bottom: 0;

  background-color: #f57c00;
  box-sizing: border-box;

  width: 100%;
  padding: 2px 10px;
`;

const SiteName = styled.a`
  color: #ffffff;
  text-decoration: none;

  &::before {
    content: "${`© 2014-${currentYear} Sokontokoro Factory, All rights reserved.`}";

    @media (max-width: 480px) {
      content: "${`© Sokontokoro Factory`}";
    }
  }
`;

const SiteVersion = styled.a`
  color: #ffffff;
  text-decoration: none;
  float: right;

  &::before {
    content: "${`Currently v${version}`}";
    @media (max-width: 480px) {
      content: "${`v${version}`}";
    }
  }
`;

@AutoBind
export default class FooterSection extends React.Component<Props, State> {
  public render() {
    return (
      <Root>
        <SiteName href={sokontokoroUrl} />
        <SiteVersion href={repoUrl} />
      </Root>
    );
  }
}

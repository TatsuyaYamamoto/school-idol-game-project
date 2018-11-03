import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import AutoBind from "autobind-decorator";

import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

import { HelpRouteParams } from "../../App";
import AppBar from "../organisms/AppBar";
import FooterSection from "../organisms/FooterSection";

interface Props {}

interface State {
  language: "ja" | "en";
}

const helps = [
  {
    title: "title",
    body:
      "hogehgoehogehogehogeohogehgoehogehogehogeohogehgoehogehogehogeohogehgoehogehogehogeohogehgoehogehogehogeo"
  },
  {
    title: "title2",
    body:
      "hogehgoehogehogehogeohogehgoehogehogehogeohogehgoehogehogehogeohogehgoehogehogehogeo"
  },
  {
    title: "title3",
    body:
      "hogehgoehogehogehogeohogehgoehogeh\nogehogeohogehgoehogehogehogeohogehgoehogehogehogeohogehgoehogehogehogeohogehgoehogehogehogeo"
  }
];

@AutoBind
class Help extends React.Component<
  Props & RouteComponentProps<HelpRouteParams>,
  State
> {
  state: State;

  constructor(props: any) {
    super(props);

    const { language } = this.props.match.params;

    this.state = {
      language
    };
  }

  public render() {
    return (
      <React.Fragment>
        <AppBar
          currentPath={this.props.location.pathname}
          onTabChanged={this.onTabChanged}
        />

        {helps.map(help => (
          <ExpansionPanel key={help.title}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{help.title}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Typography>{help.body}</Typography>
            </ExpansionPanelDetails>
            <Divider />
            <ExpansionPanelActions>
              <Button size="small">わかんない</Button>
              <Button size="small" color="primary">
                わかった！
              </Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
        ))}

        <FooterSection />
      </React.Fragment>
    );
  }

  private onTabChanged(page: "ranking" | "help") {
    this.props.history.push(`/${page}`);
  }
}

export default Help;

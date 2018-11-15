import * as React from "react";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom";

import "react-virtualized/styles.css";

import { tracePage, GAMES, Game } from "@sokontokoro/mikan";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";

import muiTheme from "./muiTheme";

import Initialize from "./components/pages/Initialize";
import Index from "./components/pages/Index";
import Help from "./components/pages/Help";
import { Search } from "history";

export interface IndexRouteParams {
  game: Game;
}

export interface HelpRouteParams {
  language: "ja" | "en";
}

export function getLanguage(search: Search): "ja" | "en" {
  const language = new URLSearchParams(search).get("language");
  switch (language) {
    case "en":
      return "en";
    case "ja":
    default:
      return "ja";
  }
}

const gameIds = Object.keys(GAMES);

const App = () => (
  <MuiThemeProvider theme={muiTheme}>
    <Initialize>
      <Router>
        <Switch>
          <Route
            exact
            path={`/ranking/:game(${gameIds.join("|")})`}
            render={props => {
              tracePage();
              const language = getLanguage(props.location.search);
              return <Index language={language} {...props} />;
            }}
          />
          <Route
            path={`/help/`}
            render={props => {
              tracePage();
              const language = getLanguage(props.location.search);
              return <Help language={language} {...props} />;
            }}
          />
          <Route render={() => <Redirect to={`/ranking/${gameIds[0]}`} />} />
        </Switch>
      </Router>
    </Initialize>
  </MuiThemeProvider>
);

export default App;

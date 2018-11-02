import * as React from "react";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom";

import "react-virtualized/styles.css";

import { tracePage, GAMES, Game } from "@sokontokoro/mikan";

import Initialize from "./components/pages/Initialize";
import Index from "./components/pages/Index";
import Help from "./components/pages/Help";

export interface IndexRouteParams {
  game: Game;
}

export interface HelpRouteParams {
  language: "ja" | "en";
}

const gameIds = Object.keys(GAMES);

const App = () => (
  <Initialize>
    <Router>
      <Switch>
        <Route
          exact
          path={`/ranking/:game(${gameIds.join("|")})`}
          render={props => {
            tracePage();
            return <Index {...props} />;
          }}
        />
        <Route
          exact
          path={`/help/:language(ja|en)`}
          render={props => {
            tracePage();
            return <Help {...props} />;
          }}
        />
        <Route path={`/help`} render={() => <Redirect to={`/help/ja`} />} />
        <Route render={() => <Redirect to={`/ranking/${gameIds[0]}`} />} />
      </Switch>
    </Router>
  </Initialize>
);

export default App;

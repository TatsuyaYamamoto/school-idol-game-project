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

export interface IndexRouteParams {
  game: Game;
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
        <Route render={() => <Redirect to={`/ranking/${gameIds[0]}`} />} />
      </Switch>
    </Router>
  </Initialize>
);

export default App;

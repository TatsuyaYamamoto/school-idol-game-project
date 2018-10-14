import * as React from "react";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom";

import "react-virtualized/styles.css";

import { default as Index, list } from "./components/pages/Index";

export interface IndexRouteParams {
  game: string;
}

const supportedGames = ["maruten"];

const App = () => (
  <Router>
    <Switch>
      <Route
        exact
        path={`/:game(${list.map(i => i.gameId).join("|")})`}
        component={Index}
      />
      <Route render={() => <Redirect to={`/${list[0].gameId}`} />} />
    </Switch>
  </Router>
);

export default App;

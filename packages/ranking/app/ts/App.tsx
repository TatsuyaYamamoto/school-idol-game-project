import * as React from "react";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom";

import "react-virtualized/styles.css";

import { tracePage } from "@sokontokoro/mikan";

import Initialize from "./components/pages/Initialize";
import { default as Index, list } from "./components/pages/Index";

export interface IndexRouteParams {
  game: string;
}

const App = () => (
  <Initialize>
    <Router>
      <Switch>
        <Route
          exact
          path={`/ranking/:game(${list.map(i => i.gameId).join("|")})`}
          render={props => {
            tracePage();
            return <Index {...props} />;
          }}
        />
        <Route render={() => <Redirect to={`/ranking/${list[0].gameId}`} />} />
      </Switch>
    </Router>
  </Initialize>
);

export default App;

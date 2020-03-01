import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Folder from "./pages/Folder";
import Folders from "./pages/Folders";

const Routes = () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Folders} />
      <Route path="/folder/:id" component={Folder} />
      <Route path="*" component={Folders} />
    </Switch>
  </BrowserRouter>
);

export default Routes;

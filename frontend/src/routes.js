import React from 'react'
import { BrowserRouter, Route, Switch } from "react-router-dom"

import Main from './pages/Main'
import Folder from './pages/Folder'

const Routes = () => (    
  <BrowserRouter>
    <Switch>

      <Route path="/" exact component={ Main } />
      <Route path="/folder/:id" component={ Folder } />
   
    </Switch>
  </BrowserRouter>
)

export default Routes
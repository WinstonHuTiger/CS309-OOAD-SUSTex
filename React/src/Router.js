import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import ProjectPage from './layout/ProjectPage';
import LoginPage from './layout/LoginPage';
import WorkBenchPage from './layout/WorkBenchPage';
import TemplatesPage from './layout/TemplatesPage';

const BasicRoute = () => (
    <HashRouter>
        <Switch>
            <Route exact path="/project/:random_str" component={ProjectPage}/>
            <Route exact path="/workbench" component={WorkBenchPage}/>
            <Route exact path="/templates" component={TemplatesPage}/>
        </Switch>
    </HashRouter>
);

export default BasicRoute;

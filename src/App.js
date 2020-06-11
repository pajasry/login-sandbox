import React from 'react';
import {Router, Route, Link} from 'react-router-dom';

import {history} from './_helpers/history';
import {Role} from './_helpers/roles';

import {authenticationService} from './_services/authentication.service';
import {PrivateRoute} from './_components/PrivateRoute';
import {HomePage} from './_pages/HomePage';
import {AdminPage} from './_pages/AdminPage';
import {LoginPage} from './_pages/LoginPage';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state ={
      currentUser:null,
      isAdmin:false
    }
  }

  componentDidMount(){
    authenticationService.currentUser.subscribe(x=>this.setState({
      currentUser:x,
      isAdmin:x&&x.roles.indexOf(Role.Admin) !== -1
    }));
  }

  logout(){
    authenticationService.logout();
    history.push('/login');
  }
  render() {
    const { currentUser, isAdmin } = this.state;
    return (
        <Router history={history}>
            <div>
                {currentUser &&
                    <nav className="navbar navbar-expand navbar-dark bg-dark">
                        <div className="navbar-nav">
                            <Link to="/" className="nav-item nav-link">Home</Link>
                            {isAdmin && <Link to="/admin" className="nav-item nav-link">Admin</Link>}
                            <a onClick={this.logout} className="nav-item nav-link">Logout</a>
                            <span className=" nav-item nav-link text-white ml-5">{currentUser.email}</span>
                        </div>
                    </nav>
                }
                <div className="jumbotron">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6 offset-md-3">
                                <PrivateRoute exact path="/" component={HomePage} />
                                <PrivateRoute path="/admin" roles={[Role.Admin]} component={AdminPage} />
                                <Route path="/login" component={LoginPage} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Router>
    );
}
}
export default App;

import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
// MUI Core stuff
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
// MUI Icon Stuff
import HomeIcon from "@material-ui/icons/Home";
import Notifications from "@material-ui/icons/Notifications";
// Utility
import MyButton from "../util/MyButton";
import PostScream from "./PostScream";

export class Navbar extends Component {
  render() {
    const { authenticated } = this.props;

    return (
      <div>
        <AppBar>
          <Toolbar className="nav-container">
            {authenticated ? (
              <Fragment>
                <PostScream />
                <Link to="/">
                  <MyButton tipTitle="Home">
                    <HomeIcon />
                  </MyButton>
                </Link>
                <MyButton tipTitle="Notification">
                  <Notifications />
                </MyButton>
              </Fragment>
            ) : (
              <Fragment>
                <Button color="inherit" component={Link} to="/">
                  Home
                </Button>
                <Button color="inherit" component={Link} to="/login">
                  Login
                </Button>
                <Button color="inherit" component={Link} to="/signup">
                  Sign Up
                </Button>
              </Fragment>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps)(Navbar);

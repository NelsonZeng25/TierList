import React, { Component, Fragment } from "react";
import PropTypes from 'prop-types';

// Icons
import HomeIcon from '@material-ui/icons/Home';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import GroupIcon from '@material-ui/icons/Group';
import ArtTrackIcon from '@material-ui/icons/ArtTrack';
import ListAltIcon from '@material-ui/icons/ListAlt';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

// Redux
import { connect } from 'react-redux';
import { logoutUser } from "../../redux/actions/userActions";

class Sidebar extends Component {
  handleLogout = () => {
    this.props.logoutUser();
  }
  render() {
    const { user : { authenticated, credentials } } = this.props;
    const isManager = credentials.isManager;
    const authSidebarLinksMarkup = (
      <Fragment>
        <li className="sidebar-item">
          <a href={`/users/${credentials.userId}`} className="sidebar-link">
            <AccountCircleIcon />
            <span className="link-text">Profile</span>
          </a>
        </li>
      </Fragment>
    );
    const logoutLinkMarkup = (
      <li className="sidebar-item">
          <a onClick={this.handleLogout} id="logout-link" className="sidebar-link">
            <ExitToAppIcon />
            <span className="link-text">Logout</span>
          </a>
      </li>
    );
    const managerSidebarLinksMarkup = (
      <Fragment>
        <li className="sidebar-item">
          <a href="/tierItems" className="sidebar-link">
            <ArtTrackIcon />
            <span className="link-text">Tier Items</span>
          </a>
        </li>
        <li className="sidebar-item">
          <a href="/categories" className="sidebar-link">
            <ListAltIcon />
            <span className="link-text">Categories</span>
          </a>
        </li>
      </Fragment>
    );

    return (
      <nav className="sidebar">
        <ul className="sidebar-nav">
          <li className="sidebar-logo">
            <a href="/" id="sidebar-logo-link" className="sidebar-link">
              <span id="logo-text" className="link-text">Tier Lists</span>
              <DoubleArrowIcon />
            </a>
          </li>
          <li className="sidebar-item">
            <a href="/" className="sidebar-link">
              <HomeIcon />
              <span className="link-text">Home</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a href="/users" className="sidebar-link">
              <GroupIcon />
              <span className="link-text">Users</span>
            </a>
          </li>
          <li></li>
          {authenticated && authSidebarLinksMarkup}
          {isManager && managerSidebarLinksMarkup}
          {authenticated && logoutLinkMarkup}
        </ul>
      </nav>
    );
  }
}

Sidebar.propTypes = {
  user: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  user: state.user
});

export default connect(mapStateToProps, { logoutUser })(Sidebar);

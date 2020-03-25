import React, { Component } from "react";
import { makeStyles, withStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";

// MUI stuff
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

// Icons
import HomeIcon from '@material-ui/icons/Home';
import ProfileIcon from '@material-ui/icons/AccountBox';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PolymerIcon from '@material-ui/icons/Polymer';

import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';

const drawerWidth = 240;

const styles = theme => ({});

class Sidebar extends Component {
  state = {
    open: false
  };
  setOpen = value => {
    this.setState({
      open: value
    });
  };
  handleDrawerOpen = () => {
    this.setOpen(true);
  };

  handleDrawerClose = () => {
    this.setOpen(false);
  };
  render() {
    const { classes } = this.props;

    return (
      <nav className="sidebar">
        <ul className="sidebar-nav">
          <li className="sidebar-logo">
            <a href="#" id="sidebar-logo-link" className="sidebar-link">
              <span id="logo-text" className="link-text">Tier Lists</span>
              <DoubleArrowIcon />
            </a>
          </li>
          <li className="sidebar-item">
            <a href="#" className="sidebar-link">
              <HomeIcon />
              <span className="link-text">Home</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a href="#" className="sidebar-link">
              <FormatListBulletedIcon />
              <span className="link-text">Your Tier Lists</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a href="#" className="sidebar-link">
              <FavoriteIcon />
              <span className="link-text">Likes</span>
            </a>
          </li>
          <li className="sidebar-item">
            <a href="#" className="sidebar-link">
              <ExitToAppIcon />
              <span className="link-text">Logout</span>
            </a>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Sidebar;

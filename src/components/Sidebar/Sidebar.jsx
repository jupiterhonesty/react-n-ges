import React from "react";
import PropTypes from "prop-types";
// javascript plugin used to create scrollbars on windows
import PerfectScrollbar from "perfect-scrollbar";
import { NavLink } from "react-router-dom";
import cx from "classnames";

import {withRouter} from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Hidden from "@material-ui/core/Hidden";
import Collapse from "@material-ui/core/Collapse";
import Icon from "@material-ui/core/Icon";

// core components
import HeaderLinks from "components/Header/HeaderLinks.jsx";

import sidebarStyle from "assets/jss/material-dashboard-pro-react/components/sidebarStyle.jsx";

import * as Utils from 'utils/api';

var ps;

// We've created this component so we can have a ref to the wrapper of the links that appears in our sidebar.
// This was necessary so that we could initialize PerfectScrollbar on the links.
// There might be something with the Hidden component from material-ui, and we didn't have access to
// the links, and couldn't initialize the plugin.
class SidebarWrapper extends React.Component {
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(this.refs.sidebarWrapper, {
        suppressScrollX: true,
        suppressScrollY: false
      });
    }
  }
  componentWillUnmount() {
    if (navigator.platform.indexOf("Win") > -1) {
      ps.destroy();
    }
  }
  render() {
    const { className, user, headerLinks, links } = this.props;
    return (
      <div className={className} ref="sidebarWrapper">
        {user}
        {headerLinks}
        {links}
      </div>
    );
  }
}

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openAvatar: false,
      openComponents: this.activeRoute("/components"),
      openForms: this.activeRoute("/forms"),
      openTables: this.activeRoute("/tables"),
      openMaps: this.activeRoute("/maps"),
      openPages: this.activeRoute("-page"),
      miniActive: true
    };
    this.activeRoute.bind(this);
  }
  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? true : false;
  }
  openCollapse(collapse) {
    var st = {};
    st[collapse] = !this.state[collapse];
    this.setState(st);
  }
  render() {
    const {
      classes,
      color,
      logo,
      image,
      logoText,
      logoText2,
      routes,
      bgColor,
      rtlActive
    } = this.props;
    const itemText =
      classes.itemText +
      " " +
      cx({
        [classes.itemTextMini]: this.props.miniActive && this.state.miniActive,
        [classes.itemTextMiniRTL]:
          rtlActive && this.props.miniActive && this.state.miniActive,
        [classes.itemTextRTL]: rtlActive
      });
    const collapseItemText =
      classes.collapseItemText +
      " " +
      cx({
        [classes.collapseItemTextMini]:
          this.props.miniActive && this.state.miniActive,
        [classes.collapseItemTextMiniRTL]:
          rtlActive && this.props.miniActive && this.state.miniActive,
        [classes.collapseItemTextRTL]: rtlActive
      });
    const userWrapperClass =
      classes.user +
      " " +
      cx({
        [classes.whiteAfter]: bgColor === "white"
      });
    const caret =
      classes.caret +
      " " +
      cx({
        [classes.caretRTL]: rtlActive
      });
    const collapseItemMini =
      classes.collapseItemMini +
      " " +
      cx({
        [classes.collapseItemMiniRTL]: rtlActive
      });
    const photo =
      classes.photo +
      " " +
      cx({
        [classes.photoRTL]: rtlActive
      });
    var user = (
      <div className={userWrapperClass}>
        <div className={photo}>
          <img src={Utils.root + this.props.avatar} className={classes.avatarImg} alt="..." />
        </div>
        <List className={classes.list}>
          <ListItem className={classes.item + " " + classes.userItem}>
            <NavLink
              to={"#"}
              className={classes.itemLink + " " + classes.userCollapseButton}
              onClick={() => this.openCollapse("openAvatar")}
            >
              <ListItemText
                primary={this.props.username}
                secondary={
                  <b
                    className={
                      caret +
                      " " +
                      classes.userCaret +
                      " " +
                      (this.state.openAvatar ? classes.caretActive : "")
                    }
                    style={{right: 'auto'}}
                  />
                }
                disableTypography={true}
                className={itemText + " " + classes.userItemText}
                style={{textAlign: 'center'}}
              />
            </NavLink>
            <Collapse in={this.state.openAvatar} unmountOnExit>
              <List className={classes.list + " " + classes.collapseList}>
                <ListItem className={classes.collapseItem}>
                  <NavLink
                    to="/profile"
                    className={
                      classes.itemLink + " " + classes.userCollapseLinks
                    }
                  >
                    <span className={collapseItemMini}>
                      {"MP"}
                    </span>
                    <ListItemText
                      primary={"Min Profil"}
                      disableTypography={true}
                      className={collapseItemText}
                    />
                  </NavLink>
                </ListItem>
                <ListItem className={classes.collapseItem}>
                  <NavLink
                    to="/companyInformasjon"
                    className={
                      classes.itemLink + " " + classes.userCollapseLinks
                    }
                  >
                    <span className={collapseItemMini}>
                      {"F"}
                    </span>
                    <ListItemText
                      primary={
                        "Företagsinformation"
                      }
                      disableTypography={true}
                      className={collapseItemText}
                    />
                  </NavLink>
                </ListItem>
                <ListItem className={classes.collapseItem}>
                  <NavLink
                    to="/mySalon"
                    className={
                      classes.itemLink + " " + classes.userCollapseLinks
                    }
                  >
                    <span className={collapseItemMini}>
                      {"MS"}
                    </span>
                    <ListItemText
                      primary={"Mina Salonger"}
                      disableTypography={true}
                      className={collapseItemText}
                    />
                  </NavLink>
                </ListItem>
              </List>
            </Collapse>
          </ListItem>
        </List>
      </div>
    );
    var links = (
      <List className={classes.list}>
        {routes.map((prop, key) => {
          if (prop.redirect) {
            return null;
          }
          if(prop.name === 'Min Profil' || prop.name === 'Företagsinformation' || prop.name === 'Mina Salonger' || prop.name === 'CustomerProfile') {
            return null;
          }
          const customItem = prop.isDev? classes.item + " " + classes.disabledItem : classes.item;
          if (prop.collapse) {
            const navLinkClasses =
              classes.itemLink +
              " " +
              cx({
                [" " + classes.collapseActive]: this.activeRoute(prop.path)
              });
            const itemText =
              classes.itemText +
              " " +
              cx({
                [classes.itemTextMini]:
                  this.props.miniActive && this.state.miniActive,
                [classes.itemTextMiniRTL]:
                  rtlActive && this.props.miniActive && this.state.miniActive,
                [classes.itemTextRTL]: rtlActive
              });
            const collapseItemText =
              classes.collapseItemText +
              " " +
              cx({
                [classes.collapseItemTextMini]:
                  this.props.miniActive && this.state.miniActive,
                [classes.collapseItemTextMiniRTL]:
                  rtlActive && this.props.miniActive && this.state.miniActive,
                [classes.collapseItemTextRTL]: rtlActive
              });
            const itemIcon =
              classes.itemIcon +
              " " +
              cx({
                [classes.itemIconRTL]: rtlActive
              });
            const caret =
              classes.caret +
              " " +
              cx({
                [classes.caretRTL]: rtlActive
              });
            return (
              <ListItem key={key} className={customItem}>
                <NavLink
                  to={"#"}
                  className={navLinkClasses}
                  onClick={() => this.openCollapse(prop.state)}
                >
                  <ListItemIcon className={itemIcon}>
                    {typeof prop.icon === "string" ? (
                      <Icon>{prop.icon}</Icon>
                    ) : (
                      <prop.icon />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={prop.name}
                    secondary={
                      <b
                        className={
                          caret +
                          " " +
                          (this.state[prop.state] ? classes.caretActive : "")
                        }
                      />
                    }
                    disableTypography={true}
                    className={itemText}
                  />
                </NavLink>
                <Collapse in={this.state[prop.state]} unmountOnExit>
                  <List className={classes.list + " " + classes.collapseList}>
                    {prop.views.map((prop, key) => {
                      const navLinkClasses =
                        classes.collapseItemLink +
                        " " +
                        cx({
                          [" " + classes[color]]: this.activeRoute(prop.path)
                        });
                      const collapseItemMini =
                        classes.collapseItemMini +
                        " " +
                        cx({
                          [classes.collapseItemMiniRTL]: rtlActive
                        });
                      return (
                        <ListItem key={key} className={classes.collapseItem}>
                          <NavLink to={prop.path} className={navLinkClasses}>
                            <span className={collapseItemMini}>
                              {prop.mini}
                            </span>
                            <ListItemText
                              primary={prop.name}
                              disableTypography={true}
                              className={collapseItemText}
                            />
                          </NavLink>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              </ListItem>
            );
          }
          const navLinkClasses =
            classes.itemLink +
            " " +
            cx({
              [" " + classes[color]]: this.activeRoute(prop.path)
            });
          const itemText =
            classes.itemText +
            " " +
            cx({
              [classes.itemTextMini]:
                this.props.miniActive && this.state.miniActive,
              [classes.itemTextMiniRTL]:
                rtlActive && this.props.miniActive && this.state.miniActive,
              [classes.itemTextRTL]: rtlActive
            });
          const itemIcon =
            classes.itemIcon +
            " " +
            cx({
              [classes.itemIconRTL]: rtlActive
            });
          if (prop.name === "Butik" || prop.name === "Direkt") {
            let href = prop.path + this.props.token
            let isEmployee;
            if(typeof this.props.isEmployee === "string") {
              isEmployee = this.props.isEmployee === 'true'
            } else {
              isEmployee = this.props.isEmployee
            }
            if (isEmployee) {
              return null;
            }
            return (
              <ListItem key={key} className={customItem}>
                <a href={href} className={navLinkClasses} target="_blank">
                  <ListItemIcon className={itemIcon}>
                    {typeof prop.icon === "string" ? (
                      <Icon>{prop.icon}</Icon>
                    ) : (
                      <prop.icon />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={prop.name}
                    disableTypography={true}
                    className={itemText}
                  />
                </a>
              </ListItem>
            )
          }
          return (
            <ListItem key={key} className={customItem}>
              <NavLink to={prop.path} className={navLinkClasses}>
                <ListItemIcon className={itemIcon}>
                  {typeof prop.icon === "string" ? (
                    <Icon>{prop.icon}</Icon>
                  ) : (
                    <prop.icon />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={prop.name}
                  disableTypography={true}
                  className={itemText}
                />
              </NavLink>
            </ListItem>
          );
        })}
      </List>
    );

    const logoNormal =
      classes.logoNormal +
      " " +
      cx({
        [classes.logoNormalSidebarMini]:
          this.props.miniActive && this.state.miniActive,
        [classes.logoNormalSidebarMiniRTL]:
          rtlActive && this.props.miniActive && this.state.miniActive,
        [classes.logoNormalRTL]: rtlActive
      });
    const logoSpan = classes.logoSpan
    const logoMini =
      classes.logoMini +
      " " +
      cx({
        [classes.logoMiniRTL]: rtlActive
      });
    const logoClasses =
      classes.logo +
      " " +
      cx({
        [classes.whiteAfter]: bgColor === "white"
      });
    var brand = (
      <div className={logoClasses}>
        {/* <a href="https://www.creative-tim.com" className={logoMini}>
          <img src={logo} alt="logo" className={classes.img} />
        </a> */}
        <a href="/dashboard" className={logoNormal}>
          {logoText}<span className={logoSpan}>{logoText2}</span>
        </a>
      </div>
    );
    const drawerPaper =
      classes.drawerPaper +
      " " +
      cx({
        [classes.drawerPaperMini]:
          this.props.miniActive && this.state.miniActive,
        [classes.drawerPaperRTL]: rtlActive
      });
    const sidebarWrapper =
      classes.sidebarWrapper +
      " " +
      cx({
        [classes.drawerPaperMini]:
          this.props.miniActive && this.state.miniActive,
        [classes.sidebarWrapperWithPerfectScrollbar]:
          navigator.platform.indexOf("Win") > -1
      });
    return (
      <div ref="mainPanel">
        <Hidden mdUp implementation="css">
          <Drawer
            variant="temporary"
            anchor={rtlActive ? "left" : "right"}
            open={this.props.open}
            classes={{
              paper: drawerPaper + " " + classes[bgColor + "Background"]
            }}
            onClose={this.props.handleDrawerToggle}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {brand}
            <SidebarWrapper
              className={sidebarWrapper}
              user={user}
              headerLinks={<HeaderLinks rtlActive={rtlActive} />}
              links={links}
            />
            {image !== undefined ? (
              <div
                className={classes.background}
                style={{ backgroundImage: "url(" + image + ")" }}
              />
            ) : null}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            onMouseOver={() => this.setState({ miniActive: false })}
            onMouseOut={() => this.setState({ miniActive: true })}
            anchor={rtlActive ? "right" : "left"}
            variant="permanent"
            open
            classes={{
              paper: drawerPaper + " " + classes[bgColor + "Background"]
            }}
          >
            {brand}
            <SidebarWrapper
              className={sidebarWrapper}
              user={user}
              links={links}
            />
          </Drawer>
        </Hidden>
      </div>
    );
  }
}

Sidebar.defaultProps = {
  bgColor: "blue"
};

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  bgColor: PropTypes.oneOf(["white", "black", "blue"]),
  rtlActive: PropTypes.bool,
  color: PropTypes.oneOf([
    "white",
    "red",
    "orange",
    "green",
    "blue",
    "purple",
    "rose"
  ]),
  logo: PropTypes.string,
  logoText: PropTypes.string,
  logoText2: PropTypes.string,
  image: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object)
};

function mapStateToProps(state) {
  return {
    token     : state.auth.token,
    avatar    : state.auth.avatar,
    username  : state.auth.username,
    isEmployee: state.auth.isEmployee
  };
}
export default withStyles(sidebarStyle)(withRouter(connect(mapStateToProps)(Sidebar)));

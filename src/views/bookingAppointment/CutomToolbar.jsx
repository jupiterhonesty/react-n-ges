import React from 'react';
import PropTypes from 'prop-types';

// react component plugin for creating a beautiful datetime dropdown picker
import Datetime from "react-datetime";
import moment from "moment";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormControl from "@material-ui/core/FormControl";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

// @material-ui/icons
import ArrowForwardIos from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIos from "@material-ui/icons/ArrowBackIos";
import Today from "@material-ui/icons/Today";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";

import customToolbarStyle from "assets/jss/material-dashboard-pro-react/views/bookingAppointment/customToolbarStyle.jsx";

class CalendarToolBar extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showDatePicker: false
        };
    }
    handleChange = (event) => {
        this.props.onNavigate("DATE", moment(event._d).toDate());
    };

    changeDate = () => {
        this.setState(prevState => ({
            showDatePicker: !prevState.showDatePicker
        }))
    };

    render() {
        const { onNavigate, label, classes } = this.props;
        
        return (
            <GridContainer alignItems="center" className={classes.pb_15}>
                <GridItem xs={12} sm={4}></GridItem>
                <GridItem xs={12} sm={4}>
                    <GridContainer justify="center" alignItems="center">
                        <GridItem>
                            <Button
                                simple
                                color="info"
                                className={classes.actionButton + " " + classes.actionButtonRound}
                                onClick={() => onNavigate('PREV')}
                            >
                                <ArrowBackIos />
                            </Button>
                        </GridItem>
                        <GridItem className={classes.pr_0}>
                            <FormControl>
                                <Datetime
                                    dateFormat={"YYYY-MM-DD"}
                                    timeFormat={false}
                                    value={this.props.label}
                                    onChange={event => this.handleChange(event)}
                                    inputProps={{
                                        style: {
                                            fontSize: '18px',
                                            backgroundImage: 'none',
                                            width: '100px'
                                        },
                                        disabled: true
                                    }}
                                    open={this.state.showDatePicker}
                                />
                            </FormControl>
                        </GridItem>
                        <GridItem className={classes.pl_0}>
                            <ClickAwayListener onClickAway={() => this.setState({showDatePicker: false})}>
                                <Button
                                    simple
                                    color="info"
                                    className={classes.actionButton + " " + classes.actionButtonRound}
                                    onClick={() => this.changeDate()}
                                >
                                    <Today />
                                </Button>
                            </ClickAwayListener>
                        </GridItem>
                        <GridItem>
                            <Button
                                simple
                                color="info"
                                className={classes.actionButton + " " + classes.actionButtonRound}
                                onClick={() => onNavigate('NEXT')}
                            >
                                <ArrowForwardIos />
                            </Button>
                        </GridItem>
                    </GridContainer>
                </GridItem>
                <GridItem xs={12} sm={4} className={classes.right}>
                    <Button color="info" size="sm" className={classes.marginRight}>
                        Set DayOff
                    </Button>
                </GridItem>
            </GridContainer>
            
        );
    }
}

CalendarToolBar.propTypes = {  
    onNavigate: PropTypes.func,
    label: PropTypes.string
};

export default withStyles(customToolbarStyle)(CalendarToolBar);
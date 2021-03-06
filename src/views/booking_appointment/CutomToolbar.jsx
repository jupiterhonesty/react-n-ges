import React from 'react';
import PropTypes from 'prop-types';

// react component plugin for creating a beautiful datetime dropdown picker
import Datetime from "react-datetime";
import moment from "moment";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormControl from "@material-ui/core/FormControl";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

// @material-ui/icons
import ArrowForwardIos from "@material-ui/icons/ArrowForwardIos";
import ArrowBackIos from "@material-ui/icons/ArrowBackIos";
import Today from "@material-ui/icons/Today";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";

import customToolbarStyle from "assets/jss/material-dashboard-pro-react/views/booking_appointment/customToolbarStyle.jsx";

let allIds = [];

class CustomToolbar extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showDatePicker: false,        
            employees: this.props.resourceIds,
            allName: ''
        };
    }

    componentDidMount() {
        console.log('focus: ', this.props.resourceIds)
        if (this.props.resourceIds.length === this.props.employees.length) {
            this.setState({
                allName: 'None'
            })
        } else {
            this.setState({
                allName: 'All'
            })
        }
        allIds = [];
        this.props.employees.map(e => {
            allIds.push(e.hairdresser_id)
        })
    }

    handleEmployee = event => {
        const len = event.target.value.length;
        if (len > 0) {
            if (event.target.value[len - 1].length > 1) {
                if (this.state.allName === 'All') {
                    this.setState({ [event.target.name]: allIds });
                    this.props.filter(allIds);
                } else {
                    this.setState({ [event.target.name]: [] });
                    this.props.filter([]);
                }
            } else {
                this.setState({ [event.target.name]: event.target.value });
                this.props.filter(event.target.value);
            }
        }
    };

    handleChange = (event) => {
        this.props.onNavigate("DATE", moment(event._d).toDate());
    };

    changeDate = () => {
        this.setState(prevState => ({
            showDatePicker: !prevState.showDatePicker
        }))
    };

    render() {
        const { onNavigate, onView, classes } = this.props;
        
        return (
            <GridContainer alignItems="center" className={classes.pb_15}>
                <GridItem xs={12} sm={4}>
                    <GridContainer>
                        <GridItem xs={12} sm={6}>
                            <FormControl
                                fullWidth
                                className={classes.selectFormControl}
                            >
                                <Select
                                    MenuProps={{
                                        className: classes.selectMenu
                                    }}
                                    classes={{
                                        select: classes.select + " " + classes.text_left
                                    }}
                                    value={this.state.employees}
                                    onChange={this.handleEmployee}
                                    inputProps={{
                                        name: "employees",
                                        id: "employees"
                                    }}
                                    multiple
                                >
                                    <MenuItem
                                        disabled
                                        classes={{
                                            root: classes.selectMenuItem
                                        }}
                                    >
                                        Select Hairdresser
                                    </MenuItem>
                                    <MenuItem
                                        classes={{
                                            root: classes.selectMenuItem,
                                            selected: classes.selectMenuItemSelected
                                        }}
                                        value={allIds}
                                    >
                                        {this.state.allName}
                                    </MenuItem>
                                    {
                                        this.props.employees.map((employee, index) => {
                                            return (
                                                <MenuItem
                                                    classes={{
                                                        root: classes.selectMenuItem,
                                                        selected: classes.selectMenuItemSelectedMultiple
                                                    }}
                                                    value={employee.hairdresser_id}
                                                    key={index}
                                                >
                                                    {employee.name}
                                                </MenuItem>
                                            )
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </GridItem>
                    </GridContainer>
                </GridItem>
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
                        {
                            this.props.view === "day"? (
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
                            ) : (
                                <GridItem>
                                    <div className={classes.label}>{this.props.label}</div>
                                </GridItem>
                            )
                        }
                        {
                            this.props.view === "day" && 
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
                        }
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
                    <Button color="success" round size="sm" onClick={() => onView('month')} className={classes.marginRight}>
                        Month
                    </Button>
                    <Button color="success" round size="sm" onClick={() => onView('week')} className={classes.marginRight}>
                        Week
                    </Button>
                    <Button color="success" round size="sm" onClick={() => onView('day')}>
                        Day
                    </Button>
                </GridItem>
            </GridContainer>         
            // <GridContainer justify="center" alignItems="center" className={classes.pb_15}>
            //     <GridItem>
            //         <Button
            //             simple
            //             color="info"
            //             className={classes.actionButton + " " + classes.actionButtonRound}
            //             onClick={() => onNavigate('PREV')}
            //         >
            //             <ArrowBackIos />
            //         </Button>
            //     </GridItem>
            //     <GridItem className={classes.pr_0}>
            //         <FormControl>
            //             <Datetime
            //                 dateFormat={"YYYYMMDD"}
            //                 timeFormat={false}
            //                 value={this.props.label}
            //                 onChange={event => this.handleChange(event)}
            //                 inputProps={{
            //                     style: {
            //                         fontSize: '18px',
            //                         backgroundImage: 'none',
            //                         width: '100px'
            //                     },
            //                     disabled: true
            //                 }}
            //                 open={this.state.showDatePicker}
            //             />
            //         </FormControl> 
            //     </GridItem>
            //     <GridItem className={classes.pl_0}>
            //         <ClickAwayListener onClickAway={() => this.setState({showDatePicker: false})}>
            //             <Button
            //                 simple
            //                 color="info"
            //                 className={classes.actionButton + " " + classes.actionButtonRound}
            //                 onClick={() => this.changeDate()}
            //             >
            //                 <Today />
            //             </Button>
            //         </ClickAwayListener> 
            //      </GridItem>
            //     <GridItem>
            //         <Button
            //             simple
            //             color="info"
            //             className={classes.actionButton + " " + classes.actionButtonRound}
            //             onClick={() => onNavigate('NEXT')}
            //         >
            //             <ArrowForwardIos />
            //          </Button>
            //      </GridItem>
            // </GridContainer>  
        );
    }
}

CustomToolbar.propTypes = {  
    onNavigate  : PropTypes.func,
    label       : PropTypes.string
};

export default withStyles(customToolbarStyle)(CustomToolbar);
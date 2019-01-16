/**
 * Description: Check in modal
 * Date: 24/12/2018
 */

import React from "react";
import PropTypes from "prop-types";
import moment from 'moment';

import {bindActionCreators} from 'redux';
import * as Actions from 'store/actions';
import {withRouter} from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

// @material-ui/icons

// core components
import Button from "components/CustomButtons/Button.jsx";

import checkInModalStyle from "assets/jss/material-dashboard-pro-react/views/checkInOut/checkInModalStyle.jsx";

function Transition(props) {
    return <Slide direction="down" {...props} />;
}

class CheckInModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {            
            employeeSelect: "",
        }
    }

    handleClose() {
        this.props.onClose();
        this.setState({
            employeeSelect: ""
        })
    }

    handleEmployee = event => {
      this.setState({ [event.target.name]: event.target.value });
    };

    checkIn() {
        this.props.checkIn({
            workingForId: this.props.workingForId,
            employeeId: this.state.employeeSelect
        })
        this.props.onClose();
        this.setState({
            employeeSelect: ""
        })
    }

    render() {
        const { classes } = this.props;
        const checkInTime = moment().format("HH:mm");
        return (
            <Dialog
                classes={{
                    root: classes.center + " " + classes.modalRoot,
                    paper: classes.modal
                }}
                open={this.props.onOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => this.handleClose()}
                aria-labelledby="checkin-modal-title"
                aria-describedby="checkin-modal-description"
                >
                <DialogTitle
                    id="checkin-modal-title"
                    disableTypography
                    className={classes.modalHeader}
                >
                    <h3 className={classes.modalTitle}>Check In</h3>
                </DialogTitle>
                <DialogContent
                    id="checkin-modal-description"
                    className={classes.modalBody}
                >
                    <h4>Who do you wanna check in {checkInTime}?</h4>
                    <FormControl
                        fullWidth
                        className={classes.selectFormControl}
                    >
                        <InputLabel
                            htmlFor="simple-select"
                            className={classes.selectLabel}
                        >
                            Select Employee
                        </InputLabel>
                        <Select
                            MenuProps={{
                                className: classes.selectMenu
                            }}
                            classes={{
                                select: classes.select + " " + classes.text_left
                            }}
                            value={this.state.employeeSelect}
                            onChange={this.handleEmployee}
                            inputProps={{
                                name: "employeeSelect",
                                id: "simple-select"
                            }}
                        >
                            <MenuItem
                                disabled
                                classes={{
                                root: classes.selectMenuItem
                                }}
                            >
                                Select Employee
                            </MenuItem>
                            {
                                this.props.employees.map((employee, index) => {
                                    return (
                                        <MenuItem
                                            classes={{
                                                root: classes.selectMenuItem,
                                                selected: classes.selectMenuItemSelected
                                            }}
                                            value={employee.employeeId}
                                            key={index}
                                        >
                                            {employee.name}
                                        </MenuItem>
                                    )
                                })
                            }   
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions className={classes.modalFooter}>
                    <Button 
                        color="danger"
                        size="sm"
                        onClick={() => this.handleClose()}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => this.checkIn()}
                        color="info"
                        size="sm"
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        );
  }
}

CheckInModal.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    workingForId: state.user.workingForId,
    employees: state.employees.employees
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    checkIn: Actions.checkIn
  }, dispatch);
}

export default withStyles(checkInModalStyle)(withRouter(connect(mapStateToProps, mapDispatchToProps)(CheckInModal)));

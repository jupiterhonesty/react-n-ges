/**
 * Descirption: NewOrUpdate modal for my employee
 * Date: 12/23/2018
 */

import React from "react";
import PropTypes from "prop-types";

import FormData from "form-data";

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
import InputAdornment from "@material-ui/core/InputAdornment";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

// @material-ui/icons
import Warning from "@material-ui/icons/Warning";
import Close from "@material-ui/icons/Close";
import Edit from "@material-ui/icons/Edit";

// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Danger from "components/Typography/Danger.jsx";
import Avatar from 'react-avatar-edit'

import commonModalStyle from "assets/jss/material-dashboard-pro-react/views/commonModalStyle.jsx";
import defaultAvatar from "assets/img/default-avatar.png";
import cert from "assets/img/cert.png";

import * as Validator from "utils/validator";
import * as Utils from 'utils/api';

function Transition(props) {
    return <Slide direction="down" {...props} />;
}

class NewModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            emailState: "",
            consumerOwner: "",
            hasConsumerOwner: false,
            companyAuthLevel: "",
            salonAuthLevel: "",
            bookingPaymentFor: "",
            productPaymentFor: "",
            
            file: null,
            withAvatar: false,
            imagePreviewUrl: defaultAvatar,
            license: null,
            licensePreviewUrl: cert,
            firstStep: true,
            secondStep: false,
            isAdd: false,
            thirdStep: false,

            name: "",
            nameState: "",
            ssn: "",
            ssnState: "",
            phone: "",
            phoneState: "",
            profession: "",
            professionState: "",
            description: "",
            descriptionState: "",
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.employee !== this.props.employee) {
            if(nextProps.employee){
                console.log('employee founded.');
                // if(nextProps.employee.hasCompany) {
                //     this.setState({
                //         firstStep: false,
                //         secondStep: true,
                //         imagePreviewUrl: Utils.root + nextProps.employee.EmployeeInformation.picturePath
                //     })
                // } else {
                    this.setState({
                        firstStep: false,
                        thirdStep: true,
                        imagePreviewUrl: nextProps.employee.EmployeeInformation? Utils.root + nextProps.employee.EmployeeInformation.picturePath : defaultAvatar,
                        consumerOwner: "SALON",
                        bookingPaymentFor: nextProps.employee.hasCompany? "COMPANY" : "",
                        productPaymentFor: nextProps.employee.hasCompany? "COMPANY" : ""
                    })
                // }            
            } else if(typeof nextProps.employee === 'boolean') {
                console.log('employee not founded.');
                this.setState({
                    firstStep: false,
                    secondStep: true
                })
            }
        }
    }

    initState() {
        this.setState({
            email: "",
            emailState: "",
            consumerOwner: "",
            hasConsumerOwner: false,
            companyAuthLevel: "",
            salonAuthLevel: "",
            bookingPaymentFor: "",
            productPaymentFor: "",
            
            file: null,
            withAvatar: false,
            imagePreviewUrl: defaultAvatar,
            license: null,
            licensePreviewUrl: cert,
            firstStep: true,
            secondStep: false,
            isAdd: false,
            thirdStep: false,
            
            name: "",
            nameState: "",
            ssn: "",
            ssnState: "",
            phone: "",
            phoneState: "",
            profession: "",
            professionState: "",
            description: "",
            descriptionState: "",
        })
    }

    handleClose() {
        this.initState();
        this.props.onClose();
    }

    change(event, stateName, type, stateNameEqualTo) {
        switch (type) {
            case "email":
                this.setState({ 
                    [stateName]: event.target.value,
                    [stateName + "State"]: Validator.verifyEmail(event.target.value)? "success" : "error"
                });
                break;                
            case "name":            
            case "ssn":            
            case "phone":            
            case "profession":            
            case "description":
                this.setState({ 
                    [stateName]: event.target.value,
                    [stateName + "State"]: Validator.verifyLength(event.target.value, stateNameEqualTo)? "success" : "error"
                });
                break;                 
            case "consumerOwner":   
            case "companyAuthLevel":   
            case "salonAuthLevel":   
            case "bookingPaymentFor":   
            case "productPaymentFor":
                this.setState({ 
                    [stateName]: event.target.value,
                });
                break;
            default:
                break;
        }
    }

    // Step 1
    checkEmployee() {
        this.props.checkEmployee({
            workingForId: this.props.workingForId,
            email: this.state.email
        })
    }

    // Step 2
    selectConsumerOwner(value) {
        if(value) {
            console.log('consumerOwner: ', "EMPLOYEE");
            this.setState({
                secondStep: false,
                thirdStep: true,
                hasConsumerOwner: true,
                consumerOwner: "EMPLOYEE"
            })
        } else {
            console.log('consumerOwner: ', "SALON");
            this.setState({
                secondStep: false,
                thirdStep: true,
                hasConsumerOwner: true,
                consumerOwner: "SALON"
            })
        }

    }

    isInviteOrAdd(value) {
        if(value) {
            this.props.inviteEmployee({
                workingForId: this.props.workingForId,
                email: this.state.email
            })
            this.setState({
                secondStep: false,
                thirdStep: true,
                isAdd: false
            })
            // this.handleClose();
        } else {
            this.setState({
                secondStep: false,
                thirdStep: true,
                isAdd: true,
                imagePreviewUrl: defaultAvatar,
                consumerOwner: "SALON",
                bookingPaymentFor: "COMPANY",
                productPaymentFor: "COMPANY"
            })
        }
    }
    
    handleImageChange(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
          this.setState({
            file: file,
            withAvatar: true,
            imagePreviewUrl: reader.result
          });
        };
        reader.readAsDataURL(file);
    }
    handleLicenseChange(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
          this.setState({
            license: file,
            licensePreviewUrl: reader.result
          });
        };
        reader.readAsDataURL(file);
    }
    handleClick(name) {
        if(name=="avatar") {
            if(!this.props.employee) {
                /** avatar crop */
                // this.refs.fileInput.click();
                this.setState({
                    showAvatarCrop: true
                })
                /** avatar crop */
            }
        } else {            
            if(!this.props.employee) {
                this.refs.licenseInput.click();
            }
        }
    }    
    onCrop = (preview) => {
        fetch(preview)
            .then(res => res.blob())
            .then(blob => {
                const data = new File([blob], "avatar.png");
                let reader = new FileReader();
                reader.onloadend = () => {
                    this.setState({
                        file: data,
                        withAvatar: true,
                        imagePreviewUrl: reader.result
                    });
                };
                reader.readAsDataURL(data);
        })
    }
    cancelCrop = () => {         
        this.setState({
            showAvatarCrop: false,
            imagePreviewUrl: this.props.employee.EmployeeInformation? Utils.root + this.props.employee.EmployeeInformation.picturePath : defaultAvatar,
        });
    }

    canSave() {
        if(this.props.employee) {
            console.log('this.state: ', this.state)
            if(this.state.consumerOwner && this.state.companyAuthLevel && this.state.salonAuthLevel) { // && this.state.bookingPaymentFor && this.state.productPaymentFor
                return false
            } else {
                return true
            }
        } else {            
            if(this.state.nameState === "success" && this.state.ssnState === "success" && this.state.phoneState === "success" && this.state.professionState === "success" && this.state.descriptionState === "success" && this.state.consumerOwner && this.state.companyAuthLevel && this.state.salonAuthLevel && this.state.bookingPaymentFor && this.state.productPaymentFor) {
                return false
            } else {
                return true
            }
        }
    }

    save() {
        console.log('focus')
        if(this.props.employee) {
            this.props.addExistEmployee({
                workingForId: this.props.workingForId,
                hairdresserId: this.props.employee.hairdresserId,
                hairdresserEmail: this.state.email,
                consumerOwner: this.state.consumerOwner,
                companyAuthLevel: this.state.companyAuthLevel,
                salonAuthLevel: this.state.salonAuthLevel,
                bookingPaymentFor: this.state.bookingPaymentFor,
                productPaymentFor: this.state.productPaymentFor
            })
        } else {
            let payload = new FormData();
            payload.append('avatar', this.state.file, 'avatar.png');
            payload.append('withAvatar', this.state.withAvatar);
            // if(this.state.license) payload.append('license', this.state.license, 'license.png');
            payload.append('workingForId', this.props.workingForId);
            payload.append('email', this.state.email);
            payload.append('name', this.state.name);
            payload.append('SSNumber', this.state.ssn);
            payload.append('mobile', this.state.phone);
            payload.append('profession', this.state.profession);
            payload.append('description', this.state.description);
            payload.append('consumerOwner', this.state.consumerOwner);
            payload.append('companyAuthLevel', this.state.companyAuthLevel);
            payload.append('salonAuthLevel', this.state.salonAuthLevel);
            payload.append('bookingPaymentFor', this.state.bookingPaymentFor);
            payload.append('productPaymentFor', this.state.productPaymentFor);

            this.props.addNonExistEmployee(payload, this.props.workingForId);

        }
        this.handleClose();
    }

    render() {
        const { classes } = this.props;

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
                aria-labelledby="my-employee-newOrUpdate-modal-title"
                aria-describedby="my-employee-newOrUpdate-modal-description"
            >
                <DialogTitle
                    id="my-employee-newOrUpdate-modal-title"
                    disableTypography
                    className={classes.modalHeader}
                >
                    <h3 className={classes.modalTitle}>{this.props.modalTitle}</h3>
                </DialogTitle>
                <DialogContent
                    id="my-employee-newOrUpdate-modal-description"
                    className={classes.modalBody}
                >                    
                    {
                        // First step
                        this.state.firstStep? (
                            <form>
                                <CustomInput
                                    success={this.state.emailState === "success"}
                                    error={this.state.emailState === "error"}
                                    labelText="E-post *"
                                    id="email"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        endAdornment:
                                            this.state.emailState === "error" ? (
                                            <InputAdornment position="end">
                                                <Warning className={classes.danger} />
                                            </InputAdornment>
                                            ) : (
                                            undefined
                                        ),
                                        onChange: event =>
                                            this.change(event, "email", "email", 0),
                                        type: "email",
                                        value: this.state.email,
                                    }}
                                />
                            </form>
                        ) : undefined
                    }
                                        
                    {
                        // Second step
                        this.state.secondStep? (
                            <form>
                                <Danger>
                                    {
                                        this.props.employee? (
                                            <h4>Rent-a-chair own consumer ?</h4>
                                        ) : (
                                            <h4>Är personen anställd av ett annat företag ?</h4>
                                        )
                                    }                                    
                                </Danger>
                            </form>
                        ) : undefined
                    }

                    {
                        // Third step add
                        this.state.thirdStep && this.state.isAdd &&
                            <form>   
                                <GridContainer>
                                    <GridItem xs={6}>
                                        {
                                            this.state.showAvatarCrop ? (
                                                <div>
                                                    <Avatar
                                                        width={'100%'}
                                                        height={180}
                                                        onCrop={(data) => this.onCrop(data)}
                                                    />
                                                    <div style={{ marginTop: 15 }}>
                                                        <Button color="danger" className={classes.actionButton} onClick={() => this.cancelCrop()}>
                                                            <Close className={classes.icon} />
                                                        </Button>
                                                        <Button color="info" className={classes.actionButton} onClick={() => this.setState({ showAvatarCrop: false })}>
                                                            <Edit className={classes.icon} />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <a onClick={() => this.handleClick('avatar')}>
                                                    <img src={this.state.imagePreviewUrl} style={{ width: '130px', height: '130px', minWidth: '130px', minHeight: '130px', borderRadius: '50%' }} alt="..." />
                                                </a>
                                            )
                                        }
                                        <input type="file" hidden onChange={this.handleImageChange.bind(this)} ref="fileInput" />
                                    </GridItem>
                                    <GridItem xs={6}>
                                        <input type="file" hidden onChange={this.handleLicenseChange.bind(this)} ref="licenseInput" />
                                        <a onClick={() => this.handleClick("license")}>
                                            <img src={this.state.licensePreviewUrl} style={{ width: '130px', height: '130px', minWidth: '130px', minHeight: '130px', borderRadius: '50%', border: 'solid 1px', padding: '4px', overflow: 'hidden' }} alt="..." />
                                        </a>
                                    </GridItem>
                                </GridContainer>                  
                                <CustomInput
                                    success={this.props.employee !== null || this.state.nameState === "success"}
                                    error={this.state.nameState === "error"}
                                    labelText="Namn *"
                                    id="name"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        value: this.props.employee? this.props.employee.name : this.state.name,
                                        disabled: this.props.employee? true : false,
                                        type: "text",
                                        onChange: event =>
                                            this.change(event, "name", "name", 1),
                                    }}
                                />
                                <CustomInput
                                    success={this.props.employee? true : false}
                                    labelText="E-post *"
                                    id="email"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        value: this.state.email,
                                        disabled: true
                                    }}
                                />
                                <GridContainer>
                                    <GridItem xs={12} sm={6}>
                                        <CustomInput
                                            success={this.props.employee !== null || this.state.ssnState === "success"}
                                            error={this.state.ssnState === "error"}
                                            labelText="Personnummer *"
                                            id="ssn"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                value: this.props.employee? this.props.employee.SSNumber : this.state.ssn,
                                                disabled: this.props.employee? true : false,
                                                type: "number",                                                
                                                onChange: event =>
                                                    this.change(event, "ssn", "ssn", 1),
                                            }}
                                        />
                                    </GridItem>
                                    <GridItem xs={12} sm={6}>
                                        <CustomInput
                                            success={this.props.employee !== null || this.state.phoneState === "success"}
                                            error={this.state.phoneState === "error"}
                                            labelText="Mobil *"
                                            id="phone"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                value: this.props.employee? (this.props.employee.EmployeeInformation? this.props.employee.EmployeeInformation.mobile : this.state.phone) : this.state.phone,
                                                disabled: this.props.employee? true : false,
                                                type: "number",                                                
                                                onChange: event =>
                                                    this.change(event, "phone", "phone", 1),
                                            }}
                                        />
                                    </GridItem>
                                </GridContainer>                
                                <CustomInput
                                    success={this.props.employee !== null || this.state.professionState === "success"}
                                    error={this.state.professionState === "error"}
                                    labelText="Yrke *"
                                    id="profession"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        value: this.props.employee? (this.props.employee.EmployeeInformation? this.props.employee.EmployeeInformation.profession : this.state.profession) : this.state.profession,
                                        disabled: this.props.employee? true : false,
                                        type: "text",                                                
                                        onChange: event =>
                                            this.change(event, "profession", "profession", 1),
                                    }}
                                />
                                <CustomInput
                                    success={this.props.employee !== null || this.state.descriptionState === "success"}
                                    error={this.state.descriptionState === "error"}
                                    labelText="Presentation *"
                                    id="description"
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        multiline: true,
                                        rows: 3,
                                        value: this.props.employee? (this.props.employee.EmployeeInformation? this.props.employee.EmployeeInformation.description : this.state.description) : this.state.description,
                                        disabled: this.props.employee? true : false,
                                        type: "text",                                                
                                        onChange: event =>
                                            this.change(event, "description", "description", 1),
                                    }}
                                /> 
                                {
                                    this.props.employee && this.props.employee.hasCompany? (
                                        <FormControl
                                            fullWidth
                                            className={classes.formControl}
                                        >
                                            <InputLabel
                                                htmlFor="consumerOwner-select"
                                                className={this.state.consumerOwner? classes.selectLabel + " " + classes.success : classes.selectLabel}
                                            >
                                                Choose ConsumerOwner *
                                            </InputLabel>
                                            <Select
                                                MenuProps={{
                                                    className: classes.selectMenu
                                                }}
                                                classes={{
                                                    select: classes.select + " " + classes.left + " " + classes.lowercase
                                                }}
                                                value={this.state.consumerOwner}
                                                onChange={event =>
                                                    this.change(event, "consumerOwner", "consumerOwner", 0)}
                                                inputProps={{
                                                    name: "consumerOwnerSelect",
                                                    id: "consumerOwner-select",
                                                    // readOnly: this.state.hasConsumerOwner
                                                }}
                                            >
                                                <MenuItem
                                                    disabled
                                                    classes={{
                                                        root: classes.selectMenuItem
                                                    }}
                                                    >
                                                    Choose ConsumerOwner
                                                </MenuItem>
                                                <MenuItem
                                                    classes={{
                                                        root: classes.selectMenuItem,
                                                        selected: classes.selectMenuItemSelected
                                                    }}
                                                    value="EMPLOYEE"
                                                >
                                                    employee
                                                </MenuItem>
                                                <MenuItem
                                                    classes={{
                                                        root: classes.selectMenuItem,
                                                        selected: classes.selectMenuItemSelected
                                                    }}
                                                    value="SALON"
                                                >
                                                    salon
                                                </MenuItem>
                                            </Select>
                                        </FormControl>  
                                    ) : undefined
                                }
                                <FormControl
                                    fullWidth
                                    className={classes.formControl}
                                >
                                    <InputLabel
                                        htmlFor="companyAuthLevel-select"
                                        className={this.state.companyAuthLevel? classes.selectLabel + " " + classes.success : classes.selectLabel}
                                    >
                                        Välj behörighet för företaget *
                                    </InputLabel>
                                    <Select
                                        MenuProps={{
                                            className: classes.selectMenu
                                        }}
                                        classes={{
                                            select: classes.select + " " + classes.left + " " + classes.lowercase
                                        }}
                                        value={this.state.companyAuthLevel}
                                        onChange={event =>
                                            this.change(event, "companyAuthLevel", "companyAuthLevel", 0)}
                                        inputProps={{
                                            name: "companyAuthLevelSelect",
                                            id: "companyAuthLevel-select",
                                        }}
                                    >
                                        <MenuItem
                                            disabled
                                            classes={{
                                                root: classes.selectMenuItem
                                            }}
                                            >
                                            Välj behörighet för företaget
                                        </MenuItem>
                                        <MenuItem
                                            classes={{
                                                root: classes.selectMenuItem,
                                                selected: classes.selectMenuItemSelected
                                            }}
                                            value="ADMIN"
                                        >
                                            admin
                                        </MenuItem>
                                        <MenuItem
                                            classes={{
                                                root: classes.selectMenuItem,
                                                selected: classes.selectMenuItemSelected
                                            }}
                                            value="EMPLOYEE"
                                        >
                                            employee
                                        </MenuItem>
                                    </Select>
                                </FormControl>   
                                <FormControl
                                    fullWidth
                                    className={classes.formControl}
                                >
                                    <InputLabel
                                        htmlFor="salonAuthLevel-select"
                                        className={this.state.salonAuthLevel? classes.selectLabel + " " + classes.success : classes.selectLabel}
                                    >
                                        Välj behörighet för salongen *
                                    </InputLabel>
                                    <Select
                                        MenuProps={{
                                            className: classes.selectMenu
                                        }}
                                        classes={{
                                            select: classes.select + " " + classes.left + " " + classes.lowercase
                                        }}
                                        value={this.state.salonAuthLevel}
                                        onChange={event =>
                                            this.change(event, "salonAuthLevel", "salonAuthLevel", 0)}
                                        inputProps={{
                                            name: "salonAuthLevelSelect",
                                            id: "salonAuthLevel-select",
                                        }}
                                    >
                                        <MenuItem
                                            disabled
                                            classes={{
                                                root: classes.selectMenuItem
                                            }}
                                            >
                                            Välj behörighet för salongen
                                        </MenuItem>
                                        <MenuItem
                                            classes={{
                                                root: classes.selectMenuItem,
                                                selected: classes.selectMenuItemSelected
                                            }}
                                            value="ADMIN"
                                        >
                                            admin
                                        </MenuItem>
                                        <MenuItem
                                            classes={{
                                                root: classes.selectMenuItem,
                                                selected: classes.selectMenuItemSelected
                                            }}
                                            value="EMPLOYEE"
                                        >
                                            employee
                                        </MenuItem>
                                    </Select>
                                </FormControl>   
                                {
                                    this.props.employee && this.props.employee.hasCompany? (
                                        <div>
                                            <FormControl
                                                fullWidth
                                                className={classes.formControl}
                                            >
                                                <InputLabel
                                                    htmlFor="bookingPaymentFor-select"
                                                    className={this.state.bookingPaymentFor? classes.selectLabel + " " + classes.success : classes.selectLabel}
                                                >
                                                    Choose BookingPaymentFor *
                                                </InputLabel>
                                                <Select
                                                    MenuProps={{
                                                        className: classes.selectMenu
                                                    }}
                                                    classes={{
                                                        select: classes.select + " " + classes.left + " " + classes.lowercase
                                                    }}
                                                    value={this.state.bookingPaymentFor}
                                                    onChange={event =>
                                                        this.change(event, "bookingPaymentFor", "bookingPaymentFor", 0)}
                                                    inputProps={{
                                                        name: "bookingPaymentForSelect",
                                                        id: "bookingPaymentFor-select",
                                                        readOnly: this.props.employee.hasCompany? false : true
                                                    }}
                                                >
                                                    <MenuItem
                                                        disabled
                                                        classes={{
                                                            root: classes.selectMenuItem
                                                        }}
                                                        >
                                                        Choose BookingPaymentFor
                                                    </MenuItem>
                                                    <MenuItem
                                                        classes={{
                                                            root: classes.selectMenuItem,
                                                            selected: classes.selectMenuItemSelected
                                                        }}
                                                        value="COMPANY"
                                                    >
                                                        company
                                                    </MenuItem>
                                                    <MenuItem
                                                        classes={{
                                                            root: classes.selectMenuItem,
                                                            selected: classes.selectMenuItemSelected
                                                        }}
                                                        value="RENTACHAIR"
                                                    >
                                                        rent-a-chair
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>   
                                            <FormControl
                                                fullWidth
                                                className={classes.formControl}
                                            >
                                                <InputLabel
                                                    htmlFor="productPaymentFor-select"
                                                    className={this.state.productPaymentFor? classes.selectLabel + " " + classes.success : classes.selectLabel}
                                                >
                                                    Choose ProductPaymentFor *
                                                </InputLabel>
                                                <Select
                                                    MenuProps={{
                                                        className: classes.selectMenu
                                                    }}
                                                    classes={{
                                                        select: classes.select + " " + classes.left + " " + classes.lowercase
                                                    }}
                                                    value={this.state.productPaymentFor}
                                                    onChange={event =>
                                                        this.change(event, "productPaymentFor", "productPaymentFor", 0)}
                                                    inputProps={{
                                                        name: "productPaymentForSelect",
                                                        id: "productPaymentFor-select",
                                                        readOnly: this.props.employee.hasCompany? false : true
                                                    }}
                                                >
                                                    <MenuItem
                                                        disabled
                                                        classes={{
                                                            root: classes.selectMenuItem
                                                        }}
                                                        >
                                                        Choose ProductPaymentFor
                                                    </MenuItem>
                                                    <MenuItem
                                                        classes={{
                                                            root: classes.selectMenuItem,
                                                            selected: classes.selectMenuItemSelected
                                                        }}
                                                        value="COMPANY"
                                                    >
                                                        company
                                                    </MenuItem>
                                                    <MenuItem
                                                        classes={{
                                                            root: classes.selectMenuItem,
                                                            selected: classes.selectMenuItemSelected
                                                        }}
                                                        value="RENTACHAIR"
                                                    >
                                                        rent-a-chair
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>  
                                        </div>
                                    ) : undefined
                                }
                                                       
                            </form>
                    }
                    {
                        // Third step invite
                        this.state.thirdStep && !this.state.isAdd  &&
                            <h3>Waiting for employe to accept email invite</h3>
                    }
                </DialogContent>
                {
                    // First step
                    this.state.firstStep? (
                        <DialogActions className={classes.modalFooter}>
                            <Button
                                onClick={() => this.checkEmployee()}
                                color="info"
                                style={{width: '100%'}}
                                disabled={this.state.emailState !== "success"}
                            >
                                Next
                            </Button>
                        </DialogActions>
                    ) : undefined
                }
                
                
                {
                    // Second step
                    this.state.secondStep? (
                        this.props.employee? (                                
                            <DialogActions className={classes.modalFooter}>
                                <Button
                                    onClick={() => this.selectConsumerOwner(false)}
                                    color="danger"
                                    style={{width: '100%'}}
                                >
                                    Nej
                                </Button>
                                <Button
                                    onClick={() => this.selectConsumerOwner(true)}
                                    color="info"
                                    style={{width: '100%'}}
                                >
                                    Ja
                                </Button>
                            </DialogActions>  
                        ) : (
                            <DialogActions className={classes.modalFooter}>
                                <Button
                                    onClick={() => this.isInviteOrAdd(false)}
                                    color="danger"
                                    style={{width: '100%'}}
                                >
                                    Nej
                                </Button>
                                <Button
                                    onClick={() => this.isInviteOrAdd(true)}
                                    color="info"
                                    style={{width: '100%'}}
                                >
                                    Ja
                                </Button>
                            </DialogActions>  
                        )                        
                    ) : undefined
                }

                {
                    // Third step add
                    this.state.thirdStep && this.state.isAdd? (                        
                        <DialogActions className={classes.modalFooter}>
                            <Button
                                onClick={() => this.handleClose()}
                                color="danger"
                                style={{width: '100%'}}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={() => this.save()}
                                color="info"
                                style={{width: '100%'}}
                                disabled={this.canSave()}
                            >
                                Save
                            </Button>
                        </DialogActions>      
                    ) : undefined
                }
                {
                    // Third step invite
                    this.state.thirdStep && !this.state.isAdd &&
                        <DialogActions className={classes.modalFooter}>
                            <Button
                                onClick={() => this.handleClose()}
                                color="info"
                                style={{width: '100%'}}
                            >
                                Ok
                            </Button>
                        </DialogActions>      
                }
            </Dialog>
        );
    }
}

NewModal.propTypes = {
  classes: PropTypes.object.isRequired
};

function mapStateToProps(state) {
    return {
        workingForId    : state.auth.workingForId,
        employee        : state.employees.employee
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        checkEmployee    : Actions.checkEmployee,
        inviteEmployee   : Actions.inviteEmployee,
        addExistEmployee      : Actions.addExistEmployee,
        addNonExistEmployee   : Actions.addNonExistEmployee,
        updateEmployee   : Actions.updateEmployee,
    }, dispatch);
}

export default withStyles(commonModalStyle)(withRouter(connect(mapStateToProps, mapDispatchToProps)(NewModal)));

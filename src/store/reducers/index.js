import {combineReducers} from 'redux';
import auth from "./auth.reducer";
import user from "./user.reducer";
import salonInfo from "./salonInfo.reducer";
import companyInfo from "./companyInfo.reducer";
import service from "./service.reducer";
import hours from "./hours.reducer";
import checkInOut from "./checkinout.reducer";
import employees from "./employees.reducer";
import mySalons from "./mySalons.reducer";
import profile from "./profile.reducer";
import booking from "./booking.reducer";
import admin from "./admin.reducer";
import b2bshop from "./b2bshop.reducer";

const createReducer = (asyncReducers) =>
    combineReducers({
        auth,
        user,
        salonInfo,
        companyInfo,
        service,
        hours,
        checkInOut,
        employees,
        mySalons,
        profile,
        booking,
        admin,
        b2bshop,
        ...asyncReducers
    });

export default createReducer;

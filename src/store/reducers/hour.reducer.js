/**
 * Description: Reducer of the opening hours
 * Date: 1/6/2019
 */

import * as Actions from '../actions';

const initialState = {
    openingHours: [],
    specialDays: []
};

const hour = function (state = initialState, action) {
    switch ( action.type )
    {
        case Actions.GET_HOURS:
        {
            return {
                openingHours: action.payload.openingHours,
                specialDays: action.payload.specialDays
            };
        }
        default:
        {
            return state
        }
    }
};

export default hour;
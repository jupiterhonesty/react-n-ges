/**
 * Description: Saloon service Style
 * Date: 12/24/2018
 */

import commonStyle from "assets/jss/material-dashboard-pro-react/views/commonStyle.jsx";
import customCheckboxRadioSwitch from "assets/jss/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx";
import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";

const checkInOutStyle = theme => ({
  ...commonStyle,
  ...customCheckboxRadioSwitch,
  ...extendedTablesStyle,
  text_right: {
      textAlign: 'right'
  },
  pb_0: {
    paddingBottom: '0',
  },
  pt_0: {
    paddingTop: '0',
  },
  pt_22: {
    paddingTop: '22px',
  }
});

export default checkInOutStyle;
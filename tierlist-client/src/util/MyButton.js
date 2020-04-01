import React from "react";

import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

export default ({children, onClick, tip, placement, btnClassName, tipClassName }) => (
    <Tooltip title={tip} className={tipClassName} placement={placement}>
        <IconButton onClick={onClick} className={btnClassName}>
            {children}
        </IconButton>
    </Tooltip>
)


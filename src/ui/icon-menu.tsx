import React from 'react';
import {createStyles, makeStyles, Theme, withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {ListItemIcon} from "@material-ui/core";
import {SvgIconProps} from "@material-ui/core/SvgIcon/SvgIcon";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor: theme.palette.background.paper,
            display: 'inline-block',
        },
    }),
);

const listItemStyle = {
    paddingTop: '5px',
    paddingBottom: '5px',
    display: 'inline-block',
    border: '1px solid #d3d4d5'
};

type IconMenuProps = {
    title: string,
    options: Array<string>,
    icons: Array<React.ReactElement<SvgIconProps>>,
    selectedIndex: number,
    onChange: (event: React.MouseEvent<HTMLElement>, index: number) => void
}

export default function IconMenu({
                                     options,
                                     icons,
                                     title,
                                     selectedIndex,
                                     onChange
                                 }: IconMenuProps) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event: React.MouseEvent<HTMLElement>, index: number) => {
        selectedIndex = index;
        onChange(event, index);
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <span className={classes.root}>
            <List aria-label="Line settings">
                <ListItem
                    button
                    style={listItemStyle}
                    aria-haspopup="true"
                    aria-controls="lock-menu"
                    aria-label="when device is locked"
                    onClick={handleClickListItem}>
                    <ListItemText primary={title} secondary={icons[selectedIndex]}/>
                </ListItem>
            </List>
            <Menu id="lock-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}>
                {options.map((option, index) => (
                    <MenuItem
                        key={option}
                        disabled={false}
                        selected={index === selectedIndex}
                        onClick={event => handleMenuItemClick(event, index)}>
                        <ListItemIcon>
                            {icons[index]}
                        </ListItemIcon>
                        {option}
                    </MenuItem>
                ))}
            </Menu>
        </span>
    );
}
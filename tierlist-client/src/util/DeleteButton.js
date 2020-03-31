import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import MyButton from './MyButton';

// MUI stuff
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Delete from '@material-ui/icons/Delete';

import { connect } from 'react-redux';
import { deleteTierList, deleteTierItemFromTierList } from '../redux/actions/dataActions';

const styles = theme => ({
    dialog: {
        "& .MuiDialog-paper": {
            backgroundColor: theme.palette.primary.main,
        }
    },
    tierList: {
        right: '0px',
        top: '0%',
        position: 'absolute',
        "& svg": {
            color: 'grey',
        }
    },
    tierItem: {
        position: 'relative',
        zIndex: 2,
        float: 'right',
        "& svg": {
            color: 'red',
        }
    },
    tierItemInTierList: {
        zIndex: 2,
        float: 'right',
        "& svg": {
            color: 'red',
        }
    },
    deleteButton: {
        color: 'red',
    }
});

class DeleteButton extends Component {
    state = {
        open: false,
        type: '',
        class: '',
    }
    componentDidMount() {
        if (this.props.tierList) this.setState({ type: 'Tier List', class: 'tierList' });
        else if (this.props.tierItem) this.setState({ type: 'Tier Item', class: 'tierItem' });
        else if (this.props.tierItemInTierList) this.setState({ type: 'Tier Item from your Tier List', class: 'tierItemInTierList' });
        else if (this.props.reply) this.setState({ type: 'Reply', class: 'reply' });
        else if (this.props.comment) this.setState({ type: 'Comment', class: 'comment' });
        else if (this.props.category) this.setState({ type: 'Category', class: 'category' });
        else if (this.props.manager) this.setState({ type: 'Manager', class: 'manager' });
        else if (this.props.user) this.setState({ type: 'User', class: 'user' });
    }
    handleOpen = () => {
        this.setState({ open: true });
    }
    handleClose = () => {
        this.setState({ open: false });
    }
    deleteClick = () => {
        switch(this.state.class) {
            case 'tierList':
                this.props.deleteTierList(this.props.tierList);
                break;
            case 'tierItem':
                this.props.handleTierItemDelete();
                break;
            case 'tierItemInTierList':
                this.props.deleteTierItemFromTierList(this.props.currentTierList.tierListId, this.props.tierItemInTierList);
                break;
            case 'reply':
                this.props.deleteReply(this.props.reply);
                break;
            case 'comment':
                this.props.deleteComment(this.props.comment);
                break;
            case 'category':
                this.props.deleteCategory(this.props.category);
                break;
            case 'manager':
                this.props.deleteManager(this.props.manager);
                break;
            case 'user':
                this.props.deleteUser(this.props.user);
                break;
            default:
                break;
        }
        this.setState({ open: false });
    }
    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <MyButton tip={`Delete ${this.state.type}`} placement="top" onClick={this.handleOpen} btnClassName={classes[this.state.class]}>
                    <Delete/>
                </MyButton>
                <Dialog className={classes.dialog} open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>Are you sure you want to delete this {this.state.type}?</DialogTitle>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="default">Cancel</Button>
                        <Button onClick={this.deleteClick} className={classes.deleteButton}>Delete</Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

DeleteButton.propTypes = {
    classes: PropTypes.object.isRequired,
    deleteTierList: PropTypes.func.isRequired,
    deleteTierItemFromTierList: PropTypes.func.isRequired,
}


const mapActionsToProps = {
    deleteTierList,
    deleteTierItemFromTierList,
}

export default connect(null, mapActionsToProps)(withStyles(styles)(DeleteButton));

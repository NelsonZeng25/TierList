import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';

// MUI stuff
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DeleteOutline from '@material-ui/icons/DeleteOutline';

import { connect } from 'react-redux';
import { deleteTierList } from '../../redux/actions/dataActions';

const styles = theme => ({
    deleteButton: {
        left: '90%',
        top: '9%',
        position: 'absolute',
    }
});

class DeleteTierList extends Component {
    state = {
        open: false,
    }
    handleOpen = () => {
        this.setState({ open: true });
    }
    handleClose = () => {
        this.setState({ open: false });
    }
    deleteTierList1 = () => {
        this.props.deleteTierList(this.props.tierListId);
        this.setState({ open: false });
    }
    render() {
        const { classes } = this.props;
        return (
            <Fragment>
                <MyButton tip="Delete Tier List" placement="top" onClick={this.handleOpen} btnClassName={classes.deleteButton}>
                    <DeleteOutline style={{color:'red'}}></DeleteOutline>
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <DialogTitle>Are you sure you want to delete this Tier List?</DialogTitle>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">Cancel</Button>
                        <Button onClick={this.deleteTierList1} style={{color:'red'}}>Delete</Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

DeleteTierList.propTypes = {
    deleteTierList: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    tierListId: PropTypes.string.isRequired
}

export default connect(null, { deleteTierList })(withStyles(styles)(DeleteTierList));
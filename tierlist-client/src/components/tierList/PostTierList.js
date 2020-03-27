import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from '../../util/MyButton';

// Mui stuff
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

// Icons
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import QueueIcon from '@material-ui/icons/Queue';

// Redux stuff
import { connect } from 'react-redux';
import { postTierList, clearErrors } from '../../redux/actions/dataActions';

const styles = theme => ({
    ...theme.spreadThis,
    button: {},
    submitButton: {
        marginTop: '1rem',
        position: 'relative',
        float: 'right',
    },
    progressSpinner: {
        position: 'absolute'
    },
    closeButton: {
        position: 'absolute',
        left: '91%',
        top: '3%'
    },
    dialogContent: {
        padding: '0px 24px 16px 24px'
    },
    dialogTitle: {
        padding: '16px 24px 5px 24px'
    }
});

class PostTierList extends Component {
    state = {
        open: false,
        name: '',
        category: '',
        errors: {},
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.UI.errors) {
            this.setState({
                errors: nextProps.UI.errors
            })
        }
        if (!nextProps.UI.errors && !nextProps.UI.loading) {
            this.setState({
                name: '',
                category: '',
                open: false, 
                errors: {},
            });
        }
    }
    handleOpen = () => {
        this.setState({ open: true });
    }
    handleClose = () => {
        this.props.clearErrors();
        this.setState({ open: false, errors: {} });
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    handleSubmit = (event) => {
        event.preventDefault();
        this.props.postTierList({
            name: this.state.name,
            category: this.state.category,
        })
    }
    render(){
        const { errors } = this.state;
        const { classes, UI: {loading}} = this.props;
        return (
            <Fragment>
                <MyButton btnClassName={classes.button} tip="Create a Tier List" onClick={this.handleOpen} placement="top">
                    <QueueIcon color="secondary"/>
                </MyButton>
                <Dialog open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm">
                    <MyButton tip="close" onClick={this.handleClose} tipClassName={classes.closeButton}>
                        <CloseIcon></CloseIcon>
                    </MyButton>
                    <DialogTitle className={classes.dialogTitle}>Post a new Tier List</DialogTitle>
                    <DialogContent className={classes.dialogContent}>
                        <form onSubmit={this.handleSubmit}>
                            <TextField 
                            name="name" 
                            type="text" 
                            label="Tier List Name" 
                            error={errors.name ? true:false} 
                            helperText={errors.name} 
                            className={classes.textField}
                            onChange={this.handleChange}
                            fullWidth
                            ></TextField>
                            <TextField  // CHANGE INTO SELECTOR
                            name="category" 
                            type="text" 
                            label="Category" 
                            className={classes.textField}
                            onChange={this.handleChange}
                            fullWidth
                            ></TextField>
                            <Button 
                            type="submit" 
                            variant="contained" 
                            color="secondary" 
                            className={classes.submitButton}
                            disabled={loading}
                            >
                                Submit
                                {loading && (<CircularProgress size={30} className={classes.progressSpinner}></CircularProgress>)}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

PostTierList.propTypes = {
    postTierList: PropTypes.func.isRequired,
    clearErrors: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired
};

const mapStateToProp = (state) => ({
    UI: state.UI, 
})

export default connect(mapStateToProp, { postTierList, clearErrors })(withStyles(styles)(PostTierList));
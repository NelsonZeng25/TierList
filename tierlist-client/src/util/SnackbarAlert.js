import React, { Component, Fragment } from 'react';

// MUI stuff
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

class SnackbarAlert extends Component {
    state = {
        type: '',
        class: '',
    }
    componentDidMount() {
        if (this.props.tierList) this.setState({ type: 'Tier List', class: 'tierList' });
        else if (this.props.tierItem) this.setState({ type: 'Tier Item', class: 'tierItem' });
        else if (this.props.tierItemInTierList) this.setState({ type: 'Tier Item in Tier List', class: 'tierItemInTierList' });
        else if (this.props.reply) this.setState({ type: 'Reply', class: 'reply' });
        else if (this.props.comment) this.setState({ type: 'Comment', class: 'comment' });
        else if (this.props.category) this.setState({ type: 'Category', class: 'category' });
        else if (this.props.manager) this.setState({ type: 'Manager', class: 'manager' });
        else if (this.props.user) this.setState({ type: 'User', class: 'user' });
    }
    // Methods needed in parent component to use SnackbarAlert
    //
    // handleAddAlertOpen = () => {
    //     this.setState({ addTierItemAlertOpen: true });
    // }
    // handleUpdateAlertOpen = () => {
    //     this.setState({ updateTierItemAlertOpen: true });
    // }
    // handleDeleteAlertOpen = () => {
    //     this.setState({ deleteTierItemAlertOpen: true });
    // }
    // handleAddAlertClose = (event, reason) => {
    //     if (reason === 'clickaway') return;
    //     this.setState({ addTierItemAlertOpen: false });
    // }
    // handleUpdateAlertClose = (event, reason) => {
    //     if (reason === 'clickaway') return;
    //     this.setState({ updateTierItemAlertOpen: false });
    // }
    // handleDeleteAlertClose = (event, reason) => {
    //     if (reason === 'clickaway') return;
    //     this.setState({ deleteTierItemAlertOpen: false });
    // }
    render() {
        return (
            <Fragment>
                {this.props.add && <Snackbar open={this.props.addAlertOpen} autoHideDuration={3000} onClose={this.props.handleAddAlertClose}>
                    <Alert onClose={this.props.handleAddAlertClose} variant="filled" severity="success">
                        {this.state.type} added successfully!
                    </Alert>
                </Snackbar>}
                {this.props.update && <Snackbar open={this.props.updateAlertOpen} autoHideDuration={3000} onClose={this.props.handleUpdateAlertClose}>
                    <Alert onClose={this.props.handleUpdateAlertClose} style={{backgroundColor: 'darkorange'}} variant="filled" severity="success">
                        {this.state.type} updated successfully!
                    </Alert>
                </Snackbar>}
                {this.props.delete && <Snackbar open={this.props.deleteAlertOpen} autoHideDuration={3000} onClose={this.props.handleDeleteAlertClose}>
                    <Alert onClose={this.props.handleDeleteAlertClose} style={{backgroundColor: 'crimson'}} variant="filled" severity="success">
                        {this.state.type} deleted successfully!
                    </Alert>
                </Snackbar>}
            </Fragment>
        )
    }
}

export default SnackbarAlert;

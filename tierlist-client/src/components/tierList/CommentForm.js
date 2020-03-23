import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

// MUI stuff
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

// Redux stuff
import { connect } from 'react-redux';
import { submitComment } from '../../redux/actions/dataActions';

const styles = theme => ({
    ...theme.spreadThis,
    submitButton: {
        display: 'flex',
        justifyContent: 'center',
    }
});
export class CommentForm extends Component {
    state = {
        body: '',
        errors: {},
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.UI.errors) {
            this.setState({ errors: nextProps.UI.errors });
        }
        if (!nextProps.UI.errors && !nextProps.UI.loading) {
            this.setState({ body: '' });
        }
    }
    handleOnChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    handleOnSubmit = (event) => {
        event.preventDefault();
        this.props.submitComment(this.props.tierListId, { body: this.state.body });
    }
    render() {
        const { classes, authenticated } = this.props;
        const errors = this.state.errors;
        const commentFormMarkup = authenticated ? (
            <Grid item sm={12} styles={{textAlign:'center'}}>
                <form onSubmit={this.handleOnSubmit}>
                    <TextField 
                    name="body" 
                    type="text" 
                    label="Comment on Tier List" 
                    error={errors.comment ? true:false}
                    helperText={errors.comment}
                    value={this.state.body}
                    onChange={this.handleOnChange}
                    fullWidth
                    className={classes.textField}>
                    </TextField>
                    <div className={classes.submitButton}>
                        <Button type="submit" variant="contained" color="secondary">
                                Submit
                        </Button>
                    </div>
                </form>
                <hr className={classes.visibleSeperator} />
            </Grid>
        ) : null;
        return commentFormMarkup
    }
}

CommentForm.propTypes = {
    submitComment: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
    authenticated: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
    tierListId: PropTypes.string.isRequired,
}

const mapStateToProps = (state) => ({
    UI: state.UI,
    authenticated: state.user.authenticated,
})

export default connect(mapStateToProps, { submitComment })(withStyles(styles)(CommentForm));

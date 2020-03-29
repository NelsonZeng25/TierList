import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from '../../util/MyButton';
import axios from 'axios';
import TierItemDialog from '../tierItem/TierItemDialog';
import TierItemDialogSkeleton from '../tierItem/TierItemDialogSkeleton';

// MUI stuff
import TextField from "@material-ui/core/TextField";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import Slide from '@material-ui/core/Slide';

// Icons
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

// Redux stuff
import { connect } from 'react-redux';
import { clearErrors, } from '../../redux/actions/dataActions';


const styles = theme => ({
    ...theme.spreadThis,
    profileImage: {
        maxWidth: '200px',
        height: '200px',
        borderRadius: '50%',
        objectFit: 'cover',
    },
    dialog: {
        "& .MuiDialog-paper": {
            backgroundColor: theme.palette.primary.dark,
            minHeight: 700,
        },
    },
    dialogContent: {
        margin: '10px 0px 20px 15px',
        padding: '20px',
    },
    dialogTitle: {
        color: theme.palette.text.primary,
        fontSize: '20px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        maxHeight: '50px',
    },
    topContainer: {
        height: '420px'
    },
    bottomContainer: {
        minHeight: '280px',
    },
    image: {
        width: '100%',
        height: '420px',
        objectFit: 'cover',
        borderRadius: '10px',
    },
    tierItemName: {
        textAlign: 'center',
    },
    ratingGrid: {
        marginTop: '25px',
    },
    ratingItem: {
        marginTop: '6px',
        marginRight: '20px',
        "& .MuiRating-iconEmpty": {
            color: 'dimgrey',
        }
    },
    proconGrid: {
        marginTop: '30px',
        marginLeft: '30px',
    },
    add: {
        color: 'lawngreen',
    },
    remove: {
        color: 'red',
    },
    wrapper: {
        marginTop: '20px',
        "& svg": {
            marginTop: '3px'
        }
    },
    textField: {
        height: '20px',
        color: theme.palette.primary.dark,
        "& input": {
            padding: '12px 14px',
            width: '200px',
        },
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.text.primary,
        },
        "& .MuiFormLabel-root": {
            color: theme.palette.text.primary,
        },
        "& .MuiFormLabel-root.Mui-focused": {
            color: theme.palette.text.primary,
        },
        "& .Mui-focused": {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.text.primaryStrong,
            }
        },
    },
});

class TierItemUpdateDialog extends Component {
    state = {
        open: false,
        score: 5,
        scoreDisplay: 5,
        loading: false,
        error: '',
        errors: {},
    }
    handleOpen = () => {
        this.setState({ open: true });
    }
    handleClose = () => {
        this.setState({ open: false });
    }
    handleRatingChange = (event, value) => {
        if (value)
            this.setState({ score: value });
        else
            this.setState({ score: 0 });
    }
    handleRatingHover = (event, value) => {
        this.setState({ scoreDisplay: value });
    }
    
    render(){
        const { classes, user: { credentials: { userId }}, UI: { loading }} = this.props;
        const { errors } = this.state;
        const tierItem = this.props.tierItem;

        const input = (isPros) => (
                <Grid className={classes.wrapper} container spacing={0}>
                    <Grid item xs={2}>
                        {isPros ? (<AddIcon fontSize="large" className={classes.add} />) : (<RemoveIcon fontSize="large" className={classes.remove}/>)}
                    </Grid>
                    <Grid item xs={10}>
                        <TextField className={classes.textField} variant="outlined"></TextField>
                    </Grid>
                </Grid>
        )

        // const Transition = React.forwardRef(function Transition(props, ref) {
        //     return <Slide direction="up" ref={ref} {...props} />;
        //   });
        return(
            <Fragment>
                <MyButton tip="Update Tier Item" placement="top" onClick={this.handleOpen} btnClassName={this.props.updateButton}>
                    <EditIcon color="secondary" />
                </MyButton>
                <Dialog className={classes.dialog} scroll="body" open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="md"
                    // TransitionComponent={Transition}
                >
                    <DialogContent>
                        <Grid container direction="column" justify="flex-start" alignItems="center" spacing={2}>
                            <Grid item container className={classes.topContainer}>
                                <Grid item xs={4}>
                                    <img className={classes.image} src={tierItem.imageUrl} alt="Tier Item Picture" />
                                </Grid>
                                <Grid item xs={8} >
                                    <Grid item>
                                        <Typography className={classes.tierItemName} variant="h3">{tierItem.name}</Typography>
                                    </Grid>
                                    <Grid item className={classes.ratingGrid} container justify="center">
                                        <Grid className={classes.ratingItem} item xs={6}>
                                            <Rating precision={0.5} value={this.state.score} defaultValue={5} max={10} size="large"
                                                onChange={this.handleRatingChange}
                                                onChangeActive={this.handleRatingHover} />
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Typography className={classes.tierItemName} variant="h4">{this.state.scoreDisplay !== -1 ? (this.state.scoreDisplay):(this.state.score)}</Typography>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Typography variant="h4">/10</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid className={classes.proconGrid}item container>
                                        <Grid item xs={6}>
                                            <Typography variant="h5">Pros:</Typography>
                                            {input(true)}
                                            {input(true)}
                                            {input(true)}
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="h5">Cons:</Typography>
                                            {input(false)}
                                            {input(false)}
                                            {input(false)}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item container direction="column"className={classes.bottomContainer}>
                                <h1>Hello</h1>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

TierItemUpdateDialog.propTypes = {
    clearErrors: PropTypes.func.isRequired,
    UI: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI,
})

const mapActionsToProps = {
    clearErrors,
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(TierItemUpdateDialog));
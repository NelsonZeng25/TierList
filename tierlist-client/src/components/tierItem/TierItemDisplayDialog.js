import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from '../../util/MyButton';

// MUI stuff
import TextField from "@material-ui/core/TextField";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import Slide from '@material-ui/core/Slide';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

// Icons
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Delete from '@material-ui/icons/Delete';

// Redux stuff
import { connect } from 'react-redux';
import { clearErrors, addTierItemToTierList, updateTierItemFromTierList } from '../../redux/actions/dataActions';
import DeleteButton from "../../util/DeleteButton";


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
            backgroundColor: theme.palette.primary.main,
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
        height: '420px',
    },
    bottomContainer: {
        minHeight: '280px',
    },
    image: {
        width: '230px',
        height: '280px',
        objectFit: 'cover',
        // borderTopRightRadius: '7px',
        // borderTopLeftRadius: '7px',
    },
    tierItemName: {
        color: theme.palette.text.primaryStrong,
        textAlign: 'center',
        overflow: 'auto',
    },
    ratingGrid: {
        marginTop: '15px',
    },
    ratingItem: {
        marginLeft: '30px',
        "& .MuiRating-iconEmpty": {
            color: 'dimgrey',
        }
    },
    score: {
        marginLeft: '35px',
        textAlign: 'center',
    },
    proconGrid: {
        marginTop: '30px',
        marginLeft: '15px',
    },
    addProsButton: {
        marginLeft: '25px',
    },
    addConsButton: {
        marginLeft: '15px',
    },
    add: {
        color: 'lawngreen',
    },
    remove: {
        color: 'red',
    },
    wrapper: {
        marginTop: '15px',
        "& svg": {
            marginTop: '3px'
        }
    },
    textField: {
        color: theme.palette.primary.dark,
        marginLeft: '-20px',
        "& input": {
            padding: '12px 14px',
            width: '200px',
        },
        "& div": {
            height: '30px',
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
    tierItem: {
        marginTop: '10px',
        backgroundColor: theme.palette.primary.dark,
        width: '100%',
        minHeight: '340px',
        borderRadius: '10px',
        paddingBottom: '6px',
        border: '3px solid transparent',
        "& h4": {
            textAlign: 'center',
            margin: '5px 0px',
        }
    },
    tierItemName: {
        textAlign: 'center',
        margin: '10px 6px 2px 6px',
        overflow: 'auto',
    },
    S: { color: 'gold' },
    A: { color: 'red' },
    B: { color: 'orange' },
    C: { color: 'lawngreen' },
    D: { color: 'deepskyblue' },
    E: { color: 'mediumpurple' },
    F: { color: 'hotpink' },

    deleteProCon: {
        padding: '0px',
        "& svg": {
            color: 'grey'
        }
    },
    thoughtsTitle: {
        textAlign: 'center',
        marginTop: '30px',
    },
    thoughtsTextfield: {
        "& div": {
            minHeight: '150px',
            alignItems: 'baseline',
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
    closeButton: {
        position: 'absolute',
        right: '1%',
        top: '1%',
        "& svg": {
            color: theme.palette.text.primary,
        }
    },
});

class TierItemDisplayDialog extends Component {
    state = {
        score: this.props.tierItem.score,
        scoreDisplay: this.props.tierItem.score,
        tier: this.props.tierItem.tier,
        pros: this.props.tierItem.pros,
        cons: this.props.tierItem.cons,
        thoughts: this.props.tierItem.thoughts,
    }
    render(){
        const { classes, UI: { loading }} = this.props;
        const { tierItem } = this.props;

        const input = (isPros, index) => (
                <Grid className={classes.wrapper} container justify="center" spacing={0}>
                    <Grid item xs={2}>
                        {isPros ? (<AddIcon className={classes.add} />) : (<RemoveIcon className={classes.remove}/>)}
                    </Grid>
                    <Grid item xs={8}>
                        <TextField value={isPros ? (this.state.pros[index]):(this.state.cons[index])} className={classes.textField} variant="outlined"></TextField>
                    </Grid>
                </Grid>
        )

        // const Transition = React.forwardRef(function Transition(props, ref) {
        //     return <Slide direction="up" ref={ref} {...props} />;
        //   });
        return(
            <Fragment>
                <Dialog className={classes.dialog} scroll="body" open={this.props.open} onClose={this.props.handleClose} fullWidth maxWidth="sm"
                    // TransitionComponent={<Slide direction="up"/>}
                >
                    <DialogContent>
                        <Grid container direction="column" justify="flex-start" alignItems="center" spacing={2}>
                            <Grid item container className={classes.topContainer}>
                                <Grid item xs={5}>
                                    <Paper className={classes.tierItem}>
                                        <Typography className={classes[this.state.tier]} variant="h4">{this.state.tier} TIER</Typography>
                                        <img className={classes.image} src={tierItem.imageUrl} alt="Tier Item Picture" />
                                        <Typography className={classes.tierItemName}>{tierItem.name}</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={7} >
                                    <Grid item>
                                        <Typography className={classes.score} variant="h4">{this.state.score} stars</Typography>
                                        <MyButton tip="Close" placement="top" btnClassName={classes.closeButton} onClick={this.handleClose}>
                                            <CloseIcon />
                                        </MyButton>
                                    </Grid>
                                    <Grid item className={classes.ratingGrid} container justify="center">
                                        <Grid className={classes.ratingItem} item>
                                            <Rating name="score" precision={0.5} value={this.state.score} max={10} size="large"/>
                                        </Grid>
                                    </Grid>
                                    <Grid className={classes.proconGrid}item container>
                                        <Grid item xs={6}>
                                            <Button className={classes.addProsButton} variant="outlined" color="secondary">Add Pros</Button>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button className={classes.addConsButton} variant="outlined" color="secondary">Add Cons</Button>
                                        </Grid>
                                        {Array.from({ length: this.state.pros.length }).map((item, index) => (
                                            <Fragment key={index}>
                                                {input(true, index)}
                                            </Fragment>
                                        ))}
                                        {Array.from({ length: this.state.cons.length }).map((item, index) => (
                                            <Fragment key={index}>
                                                {input(false, index)}
                                            </Fragment>
                                        ))}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item container direction="column" className={classes.bottomContainer}>
                                <Typography className={classes.thoughtsTitle} variant="h5">Detailed Thoughts</Typography>
                                <hr className={classes.visibleSeperator}/>
                                <TextField name="thoughts" className={classes.thoughtsTextfield} value={this.state.thoughts} multiline variant="outlined"/>
                            </Grid>
                        </Grid>
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

TierItemDisplayDialog.propTypes = {
    UI: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    UI: state.UI,
})

const mapActionsToProps = {
    
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(TierItemDisplayDialog));
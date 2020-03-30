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
        height: '420px'
    },
    bottomContainer: {
        minHeight: '280px',
    },
    image: {
        width: '230px',
        height: '280px',
        objectFit: 'cover',
        borderTopRightRadius: '7px',
        borderTopLeftRadius: '7px',
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
        marginLeft: '20px',
        "& .MuiRating-iconEmpty": {
            color: 'dimgrey',
        }
    },
    score: {
        textAlign: 'center',
    },
    proconGrid: {
        marginTop: '30px',
        marginLeft: '25px',
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
    tierSelect: {
        fontSize: '30px',
        width: '160px',
        marginLeft: '40px',
    },
    tierItem: {
        marginTop: '20px',
        backgroundColor: theme.palette.primary.dark,
        width: '100%',
        minHeight: '295px',
        borderRadius: '10px',
        paddingBottom: '6px',
        border: '3px solid transparent',
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
    }
});

class TierItemUpdateDialog extends Component {
    state = {
        open: false,
        score: 0,
        scoreDisplay: 0,
        tier: '',
        pros: ['', '', ''],
        cons: ['', '', ''],
        loading: false,
        error: '',
        errors: {},
    }
    handleOpen = () => {
        this.setState({ 
            open: true,
            score: this.props.tierItem.score,
            scoreDisplay: this.props.tierItem.score,
            tier: this.props.tierItem.tier,
            pros: this.props.tierItem.pros,
            cons: this.props.tierItem.cons,
        });
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
    handleTierChange = (event) => {
        this.setState({ tier: event.target.value });
    }
    handleProsClicked = () => {
        if (this.state.pros.length + this.state.cons.length < 6) {
            let temp = this.state.pros;
            temp.push('');
            this.setState({ pros: temp});
        }
    }
    handleConsClicked = () => {
        if (this.state.pros.length + this.state.cons.length < 6) {
            let temp = this.state.cons;
            temp.push('');
            this.setState({ cons: temp});
        }
    }
    handleProConDelete = (isPros, index) => {
        if (isPros) {
            let temp = this.state.pros;
            temp.splice(index, 1);
            this.setState({ pros: temp});
        } else {
            let temp = this.state.cons;
            temp.splice(index, 1);
            this.setState({ cons: temp});
        }
    }
    handleProConChange = (isPros, index, event) => {
        if (isPros) {
            let temp = this.state.pros.slice();
            temp[index] = event.target.value;
            this.setState({ pros: temp });
        } else {
            let temp = this.state.cons.slice();
            temp[index] = event.target.value;
            this.setState({ cons: temp });
        }
    }
    render(){
        const { classes, user: { credentials: { userId }}, UI: { loading }, data: { viewTierList }} = this.props;
        const { errors } = this.state;
        const { tierItem } = this.props;

        const input = (isPros, index) => (
                <Grid className={classes.wrapper} container justify="center" spacing={0}>
                    <Grid item xs={2}>
                        {isPros ? (<AddIcon className={classes.add} />) : (<RemoveIcon className={classes.remove}/>)}
                    </Grid>
                    <Grid item xs={8}>
                        <TextField value={isPros ? (this.state.pros[index]):(this.state.cons[index])} onChange={this.handleProConChange.bind(this, isPros, index)} className={classes.textField} variant="outlined"></TextField>
                    </Grid>
                    <Grid item xs={1}>
                       <MyButton tip="Delete" placement="top" onClick={this.handleProConDelete.bind(this, isPros, index)} btnClassName={classes.deleteProCon}>
                            <Delete  />
                       </MyButton>
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
                <Dialog className={classes.dialog} scroll="body" open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm"
                    // TransitionComponent={Transition}
                >
                    <DialogContent>
                        <Grid container direction="column" justify="flex-start" alignItems="center" spacing={2}>
                            <Grid item container className={classes.topContainer}>
                                <Grid item xs={5}>
                                    {/* <Typography className={classes.tierItemName} variant="h3">A Tier</Typography> */}
                                    <Select
                                        value={this.state.tier}
                                        onChange={this.handleTierChange}
                                        variant="outlined"
                                        className={classes.tierSelect}
                                        color="secondary"
                                        
                                        >
                                        <MenuItem className={classes.S} value={'S'}>S TIER</MenuItem>
                                        <MenuItem className={classes.A} value={'A'}>A TIER</MenuItem>
                                        <MenuItem className={classes.B} value={'B'}>B TIER</MenuItem>
                                        <MenuItem className={classes.C} value={'C'}>C TIER</MenuItem>
                                        <MenuItem className={classes.D} value={'D'}>D TIER</MenuItem>
                                        <MenuItem className={classes.E} value={'E'}>E TIER</MenuItem>
                                        <MenuItem className={classes.F} value={'F'}>F TIER</MenuItem>
                                    </Select>
                                    <Paper className={classes.tierItem}>
                                        <img className={classes.image} src={tierItem.imageUrl} alt="Tier Item Picture" />
                                        <Typography className={classes.tierItemName}>{tierItem.name}</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={7} >
                                    <Grid item>
                                        <Typography className={classes.score} variant="h4">{this.state.scoreDisplay !== -1 ? (this.state.scoreDisplay):(this.state.score)} stars</Typography>
                                    </Grid>
                                    <Grid item className={classes.ratingGrid} container justify="center">
                                        <Grid className={classes.ratingItem} item>
                                            <Rating precision={0.5} value={this.state.score} defaultValue={tierItem.score} max={10} size="large"
                                                onChange={this.handleRatingChange}
                                                onChangeActive={this.handleRatingHover} />
                                        </Grid>
                                    </Grid>
                                    <Grid className={classes.proconGrid}item container>
                                        <Grid item xs={6}>
                                            <Button onClick={this.handleProsClicked} variant="outlined" color="secondary">Add Pros</Button>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button onClick={this.handleConsClicked} variant="outlined" color="secondary">Add Cons</Button>
                                        </Grid>
                                        {Array.from({ length: this.state.pros.length }).map((item, index) => (
                                            <Fragment>
                                                {input(true, index)}
                                            </Fragment>
                                        ))}
                                        {Array.from({ length: this.state.cons.length }).map((item, index) => (
                                            <Fragment>
                                                {input(false, index)}
                                            </Fragment>
                                        ))}
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
    data: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
    user: state.user,
    data: state.data,
    UI: state.UI,
})

const mapActionsToProps = {
    clearErrors,
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(TierItemUpdateDialog));
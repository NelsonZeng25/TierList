import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from '../../util/MyButton';
import SnackbarAlert from '../../util/SnackbarAlert';

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
        minHeight: '420px',
        "& .MuiInputBase-colorSecondary": {
            fontSize: '30px', 
            width: '100%', 
            textAlign: 'center',
            "& div": { 
                padding: '10px 14px', 
            }
        }
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
    },
    tierItemName: {
        textAlign: 'center',
        margin: '10px 6px 2px 6px',
        overflow: 'auto',
    },
    S: { color: 'gold' },
    A: { color: '#fa2a2a' },
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
    updateButton: {
        margin: '20px auto',
        width: '250px',
    },
    closeButton: {
        position: 'absolute',
        right: '1%',
        top: '1%',
        "& svg": {
            color: theme.palette.text.primary,
        }
    },
    nextButton: {
        marginLeft: '50px',
        marginTop: '10px',
        width: '200px',
        "@media (max-width:1200px)": {
            marginLeft: '0px',
        }
    },
    "@media (max-width:700px)": {
        topContainer: {
            justifyContent: 'center',
        },
        leftContainer: {
            maxWidth: '80%',
            flexBasis: '80%',
        },
        image: {
            width: '310px',
            height: '350px',
        },
        rightContainer: {
            maxWidth: '100%',
            flexBasis: '100%',
        },
        score: {
            marginTop: '10px',
            marginLeft: '0px',
        },
        ratingItem: {
            marginLeft: '0px',
        },
        proconGrid: {
            marginLeft: '0px',
        },
        addProsButton: {
            marginLeft: '60px',
        },
        addConsButton: {
            marginLeft: '20px',
        },
        wrapper: {
            marginLeft: '20px',
        }
    }
});

class TierItemUpdateDialog extends Component {
    constructor(props){
        super(props);
        this.input = React.createRef();
    }
    state = {
        open: false,
        score: 0,
        scoreDisplay: 0,
        tier: 'C',
        initialTier: 'C',
        pros: ['', '', ''],
        cons: ['', '', ''],
        thoughts: '',
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
            initialTier: this.props.tierItem.tier,
            pros: this.props.tierItem.pros,
            cons: this.props.tierItem.cons,
            thoughts: this.props.tierItem.thoughts,
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
            let temp = this.state.pros.slice();
            temp.push('');
            this.setState({ pros: temp});
        }
    }
    handleConsClicked = () => {
        if (this.state.pros.length + this.state.cons.length < 6) {
            let temp = this.state.cons.slice();
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
    handleKeyDown = (event) => {
        // https://stackoverflow.com/questions/38385936/change-the-cursor-position-in-a-textarea-with-react/38386230
        if (event.keyCode === 9) { // tab was pressed
            event.preventDefault();
            var val = this.state.thoughts,
            start = event.target.selectionStart,
            end = event.target.selectionEnd;
            this.setState({
                    thoughts : val.substring(0, start) + '\t' + val.substring(end)
                },() => {
                    // https://reactjs.org/docs/refs-and-the-dom.html
                    this.input.current.selectionStart = this.input.current.selectionEnd = start + 1
                });
        }
    }
    handleThoughtsChange = (event) => {
        this.setState({ [event.target.name] : event.target.value });
    }
    handleUpdateClick = () => {
        let tierItem = {
            score: this.state.score,
            pros: this.state.pros,
            cons: this.state.cons,
            thoughts: this.state.thoughts,
            tier: this.state.tier,
            tierItemId: this.props.tierItem.tierItemId,
        }
        if (this.state.initialTier === this.state.tier)
            this.props.updateTierItemFromTierList(this.props.data.tierList.tierListId, tierItem);
        else 
            this.props.addTierItemToTierList(this.props.data.tierList.tierListId, tierItem);
        this.handleClose();
        this.props.handleUpdateAlertOpen();
    }
    handleAddClick = () => {
        let tierItem = {
            score: this.state.score,
            pros: this.state.pros,
            cons: this.state.cons,
            thoughts: this.state.thoughts,
            tier: this.state.tier,
            tierItemId: this.props.tierItem.tierItemId,
        }
        this.props.addTierItemToTierList(this.props.data.tierList.tierListId, tierItem);
        if (this.props.handleAddClose !== undefined) this.props.handleAddClose();
        this.handleClose();
        if (this.props.handleAddAlertOpen) this.props.handleAddAlertOpen();
    }
    handleNextOpen = () => {
        if (this.props.handleNext()) {
            this.handleOpen();
        }
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
                {this.props.handleNext !== undefined ? (
                    <Button color="secondary" className={classes.nextButton} variant="contained" onClick={this.handleNextOpen}>Next</Button>
                ):(
                    <Fragment>
                        <MyButton tip="Update Tier Item" placement="top" onClick={this.handleOpen} btnClassName={this.props.updateButton}>
                            <EditIcon color="secondary" />
                        </MyButton>      
                    </Fragment>
                )}
                <Dialog className={classes.dialog} scroll="body" open={this.state.open} onClose={this.handleClose} fullWidth maxWidth="sm"
                    // TransitionComponent={<Slide direction="up"/>}
                >
                    <DialogContent>
                        <Grid container direction="column" justify="flex-start" alignItems="center" spacing={2}>
                            <Grid item container className={classes.topContainer}>
                                <Grid className={classes.leftContainer} item xs={5}>
                                    {/* <Typography className={classes.tierItemName} variant="h3">A Tier</Typography> */}
                                    <Paper className={classes.tierItem}>
                                        <Select
                                            value={this.state.tier}
                                            onChange={this.handleTierChange}
                                            variant="outlined"
                                            className={classes[this.state.tier]}
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
                                        <img className={classes.image} src={tierItem.imageUrl} alt="Tier Item Picture" />
                                        <Typography className={classes.tierItemName}>{tierItem.name}</Typography>
                                    </Paper>
                                </Grid>
                                <Grid className={classes.rightContainer} item xs={7} >
                                    <Grid item>
                                        <Typography className={classes.score} variant="h4">{this.state.scoreDisplay !== -1 ? (this.state.scoreDisplay):(this.state.score)} stars</Typography>
                                        <MyButton tip="Close" placement="top" btnClassName={classes.closeButton} onClick={this.handleClose}>
                                            <CloseIcon />
                                        </MyButton>
                                    </Grid>
                                    <Grid item className={classes.ratingGrid} container justify="center">
                                        <Grid className={classes.ratingItem} item>
                                            <Rating name="score" precision={0.5} value={this.state.score} defaultValue={tierItem.score} max={10} size="large"
                                                onChange={this.handleRatingChange}
                                                onChangeActive={this.handleRatingHover} />
                                        </Grid>
                                    </Grid>
                                    <Grid className={classes.proconGrid}item container>
                                        <Grid item xs={6}>
                                            <Button className={classes.addProsButton} onClick={this.handleProsClicked} variant="outlined" color="secondary">Add Pros</Button>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Button className={classes.addConsButton} onClick={this.handleConsClicked} variant="outlined" color="secondary">Add Cons</Button>
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
                                <TextField 
                                    name="thoughts" className={classes.thoughtsTextfield} value={this.state.thoughts} onChange={this.handleThoughtsChange} 
                                    onKeyDown={this.handleKeyDown.bind(this)} multiline variant="outlined"
                                    inputProps={{
                                        ref: this.input,
                                    }}
                                />
                                {this.props.handleNext !== undefined ? (
                                    <Button className={classes.updateButton} onClick={this.handleAddClick} variant="contained" color="secondary">Add</Button>
                                ): (
                                    <Button className={classes.updateButton} onClick={this.handleUpdateClick} variant="contained" color="secondary">Update</Button>
                                )}
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
    addTierItemToTierList: PropTypes.func.isRequired,
    updateTierItemFromTierList: PropTypes.func.isRequired,
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
    addTierItemToTierList,
    updateTierItemFromTierList,
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(styles)(TierItemUpdateDialog));
import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import MyButton from '../../util/MyButton';

// MUI stuff
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Rating from '@material-ui/lab/Rating';
import Paper from '@material-ui/core/Paper';

// Icons
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

// Redux stuff


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
            minHeight: 450,
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
    },
    bottomContainer: {
        minHeight: '160px',
    },
    image: {
        width: '230px',
        height: '280px',
        objectFit: 'cover',
        // borderTopRightRadius: '7px',
        // borderTopLeftRadius: '7px',
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
        marginTop: '15px',
        textAlign: 'center',
    },
    proconGrid: {
        marginTop: '20px',
        marginLeft: '5px',
    },
    add: {
        color: 'lawngreen',
    },
    remove: {
        color: 'red',
    },
    wrapper: {
        marginTop: '10px',
        verticalAlign: 'middle',
        "& svg": {
            marginTop: '0px'
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
    thoughts: {
        whiteSpace: 'pre-wrap',
        letterSpacing: 0,
        marginBottom: '20px',
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
            marginLeft: '0px',
        },
        ratingItem: {
            marginLeft: '0px',
        },
        proconGrid: {
            marginLeft: '35px',
        }
    }
});

class TierItemDisplayDialog extends Component {
    render(){
        const { classes } = this.props;
        const { tierItem: { name, imageUrl, score, pros, cons, tier, thoughts } } = this.props;

        const input = (isPros, index) => (
                <Grid className={classes.wrapper} container justify="center" spacing={0}>
                    <Grid item xs={2}>
                        {isPros ? (<AddIcon className={classes.add} />) : (<RemoveIcon className={classes.remove}/>)}
                    </Grid>
                    <Grid item xs={8}>
                        <Typography variant="body1">{isPros ? (pros[index]):(cons[index])}</Typography>
                    </Grid>
                </Grid>
        )

        return(
            <Fragment>
                <Dialog className={classes.dialog} scroll="body" open={this.props.open} onClose={this.props.handleClose} fullWidth maxWidth="sm"
                >
                    <DialogContent>
                        <Grid container direction="column" justify="flex-start" alignItems="center" spacing={2}>
                            <Grid item container className={classes.topContainer}>
                                <Grid className={classes.leftContainer} item xs={5}>
                                    <Paper className={classes.tierItem}>
                                        <Typography className={classes[tier]} variant="h4">{tier} TIER</Typography>
                                        <img className={classes.image} src={imageUrl} alt="Tier Item" />
                                        <Typography className={classes.tierItemName}>{name}</Typography>
                                    </Paper>
                                </Grid>
                                <Grid className={classes.rightContainer} item xs={7} >
                                    <Grid item>
                                        <Typography className={classes.score} variant="h4">{score} stars</Typography>
                                        <MyButton tip="Close" placement="top" btnClassName={classes.closeButton} onClick={this.props.handleClose}>
                                            <CloseIcon />
                                        </MyButton>
                                    </Grid>
                                    <Grid item className={classes.ratingGrid} container justify="center">
                                        <Grid className={classes.ratingItem} item>
                                            <Rating readOnly name="score" precision={0.5} value={score} max={10} size="large"/>
                                        </Grid>
                                    </Grid>
                                    <Grid className={classes.proconGrid} item container>
                                        {Array.from({ length: pros.length }).map((item, index) => (
                                            <Fragment key={index}>
                                                {input(true, index)}
                                            </Fragment>
                                        ))}
                                        {Array.from({ length: cons.length }).map((item, index) => (
                                            <Fragment key={index}>
                                                {input(false, index)}
                                            </Fragment>
                                        ))}
                                    </Grid>
                                </Grid>
                            </Grid>
                            {thoughts.trim() !== '' && <Grid item container direction="column" className={classes.bottomContainer}>
                                <Typography className={classes.thoughtsTitle} variant="h5">Detailed Thoughts</Typography>
                                <hr className={classes.visibleSeperator}/>
                                <Typography  className={classes.thoughts} variant="body1">{thoughts}</Typography>
                            </Grid>}
                        </Grid>
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

export default (withStyles(styles)(TierItemDisplayDialog));
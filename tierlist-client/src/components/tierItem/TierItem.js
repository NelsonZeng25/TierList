import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import MyButton from '../../util/MyButton';
import DeleteButton from '../../util/DeleteButton';
import TierItemUpdateDialog from './TierItemUpdateDialog';

// MUI
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';

// Icons
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import StarIcon from '@material-ui/icons/Star';

// Redux
import { connect } from 'react-redux';

const styles = theme => ({
    tierItem: {
        backgroundColor: theme.palette.primary.dark,
        width: '100%',
        minHeight: '280px',
        borderRadius: '10px',
        display: 'flex',
        border: '2px solid transparent',
        transition: '600ms',
        cursor: 'pointer',
        "&:hover": {
            borderColor: theme.palette.text.primaryStrong,
        },
        "& .MuiCardContent-root:last-child": {
            paddingBottom: '12px',
        }
    },
    tierItemImage: {
        margin: '0',
        display: 'block',
        width: '225px',
        minHeight: '280px',
        position: 'relative',
        borderBottomLeftRadius: '7px',
        borderTopLeftRadius: '7px',
        objectFit: 'cover',
    },
    tierItemName: {
        maxWidth: '233px',
        overflow: 'auto',
        textAlign: 'center',
        color: theme.palette.text.primaryStrong,
    },
    content: {
        width: '300px',
    },
    wrapper: {
        marginLeft: '35px',
        "& span, svg": {
            verticalAlign: 'middle',
        }
    },
    add: {
        color: 'lawngreen',
    },
    remove: {
        color: 'red',
    },
    updateButton: {
        position: 'absolute',
        zIndex: 3,
    },
    scoreWrapper: {
        float: 'right',
        marginLeft: '10px',
        "& span, svg": {
            verticalAlign: 'middle',
        }
    }
});

class TierItem extends Component {
    render() {
        const { 
            classes,
            data: { tierList: { userId }}, 
            tierItem: { name, imageUrl, score, pros, cons, thoughts, tier },
            user : { authenticated },
        } = this.props;
        const id = this.props.user.credentials.userId;

        const deleteButton = (authenticated && userId === id) ? (
            <DeleteButton tierList={this.props.tierList}/>
        ) : null;

        const detailGrid = (content, isPros) => (
            <div className={classes.wrapper}>
                <Grid container spacing={0}>
                    <Grid item xs={2}>
                        {isPros ? (<AddIcon className={classes.add} />) : (<RemoveIcon className={classes.remove}/>)}
                    </Grid>
                    <Grid item xs={10}>
                        <span>{content}</span>
                    </Grid>
                </Grid>
            </div>
        );
        return (
            <Fragment>
                <TierItemUpdateDialog tierItem={this.props.tierItem} updateButton={classes.updateButton} />
                <Card className={classes.tierItem}>
                    <CardMedia 
                    image={imageUrl}
                    title={"Profile Image"}
                    className={classes.tierItemImage}/>
                    <CardContent className={classes.content}>
                        <div className={classes.scoreWrapper}>
                            <span style={{fontSize: '25px'}}>{score}   </span>
                            <StarIcon style={{color: '#ffb400'}}/>
                        </div>
                        <Typography className={classes.tierItemName} nowrap="true" variant="h5">{name}</Typography>
                        {/* THIS IS WHERE YOU PUT THE SCORE */}
                        {/* {deleteButton} */}
                        {pros.length > 0 && <Typography variant="body1" >Pros:</Typography>}
                            {Array.from({ length: pros.length }).map((item, index) => (
                                <Fragment>
                                    {detailGrid( pros[index], true)}
                                </Fragment>
                            ))}
                        {cons.length > 0 && <Typography variant="body1" >Cons:</Typography>}
                            {Array.from({ length: cons.length }).map((item, index) => (
                                <Fragment>
                                    {detailGrid( cons[index], false)}
                                </Fragment>
                            ))}
                    </CardContent>
                </Card>
            </Fragment>
        )
    }
}

TierItem.propTypes = {
    user: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    openDialog: PropTypes.bool,
}

const mapStateToProps = (state) => ({
    user: state.user,
    data: state.data,
})

export default connect(mapStateToProps)(withStyles(styles)(TierItem));
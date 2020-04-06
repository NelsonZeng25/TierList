import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import DeleteButton from '../../util/DeleteButton';
import TierItemUpdateDialog from './TierItemUpdateDialog';
import TierItemDisplayDialog from './TierItemDisplayDialog';

// MUI
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
        minWidth: '180px',
        minHeight: '280px',
        position: 'relative',
        borderBottomLeftRadius: '7px',
        borderTopLeftRadius: '7px',
        objectFit: 'cover',
    },
    tierItemName: {
        marginBottom: '10px',
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
        marginTop: '5px',
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
    state = {
        open: false,
    }
    handleOpen = () => {
        this.setState({ 
            open: true,
        });
    }
    handleClose = () => {
        this.setState({ open: false });
    }
    render() {
        const { 
            classes,
            data: { tierList: { userId }}, 
            tierItem: { name, imageUrl, score, pros, cons },
            user : { authenticated },
        } = this.props;
        const id = this.props.user.credentials.userId;

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
                {authenticated && userId === id && <TierItemUpdateDialog handleUpdateAlertOpen={this.props.handleUpdateAlertOpen} tierItem={this.props.tierItem} updateButton={classes.updateButton} />}
                <Card  className={classes.tierItem}>
                    <CardMedia 
                    image={imageUrl}
                    title={"Tier Item Image"}
                    className={classes.tierItemImage}
                    onClick={this.handleOpen}
                    ></CardMedia>
                    {authenticated && userId === id && <DeleteButton tierItemInTierList={this.props.tierItem} currentTierList={this.props.data.tierList} handleDeleteAlertOpen={this.props.handleDeleteAlertOpen}/>}
                    <CardContent onClick={this.handleOpen} className={classes.content}>
                        <div className={classes.scoreWrapper}>
                            <span style={{fontSize: '25px'}}>{score}   </span>
                            <StarIcon style={{color: '#ffb400'}}/>
                        </div>
                        <Typography className={classes.tierItemName} nowrap="true" variant="h5">{name}</Typography>
                        {pros.length > 0 && <Typography variant="body1" >Pros:</Typography>}
                            {Array.from({ length: pros.length }).map((item, index) => (
                                <Fragment key={index}>
                                    {detailGrid( pros[index], true)}
                                </Fragment>
                            ))}
                        {cons.length > 0 && <Typography variant="body1" >Cons:</Typography>}
                            {Array.from({ length: cons.length }).map((item, index) => (
                                <Fragment key={index}>
                                    {detailGrid( cons[index], false)}
                                </Fragment>
                            ))}
                    </CardContent>
                </Card>
                <TierItemDisplayDialog open={this.state.open} handleClose={this.handleClose} tierItem={this.props.tierItem} />
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
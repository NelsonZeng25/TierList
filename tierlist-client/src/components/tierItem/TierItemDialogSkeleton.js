import React, { Component } from 'react'

export class tierItemDialog extends Component {
    render() {
        return (
            <Grid className={classes.tierItemGrid} key={index} item xs={3}>
                <Paper onClick={this.handleSelected.bind(this, index, tierItem.name, tierItem.imageUrl, tierItem.tierItemId)} className={this.state.selectedIndex === index ? classes.clickTierItem : classes.tierItem}>
                    {(authenticated && userId === tierItem.userId) || isManager ?
                        (
                            <Fragment>
                                <DeleteButton handleTierItemDelete={this.handleTierItemDelete.bind(this, tierItem)} tierItem={tierItem} />
                                <MyButton tip="Update Tier Item" placement="top" onClick={this.handleUpdateTierItemClick} btnClassName={classes.updateButton}>
                                    <EditIcon color="secondary" />
                                </MyButton>
                            </Fragment>
                        ) : null}
                    <img src={tierItem.imageUrl} className={classes.tierItemImage} alt="Tier Item Picture" style={!(authenticated && userId === tierItem.userId) && !isManager ? { marginTop: '0px' } : {}} />
                    <Typography className={classes.tierItemName}>{tierItem.name}</Typography>
                </Paper>
            </Grid>
        )
    }
}

export default tierItemDialog

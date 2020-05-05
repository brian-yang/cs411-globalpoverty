import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Link from 'next/link';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default function ButtonAppBar() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Link href="/">
                        <Button color="inherit">Home</Button>
                    </Link>
                    <Link href="/basic">
                        <Button color="inherit">Basic Functions</Button>
                    </Link>
                    <Link href="/advanced">
                        <Button color="inherit">Advanced Function</Button>
                    </Link>
                </Toolbar>
            </AppBar>
        </div>
    );
}
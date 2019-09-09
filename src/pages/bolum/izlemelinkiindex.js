import React, { useEffect, useState } from 'react';
import { useGlobal } from 'reactn'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types';
import axios from '../../config/axios/axios'

import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import WatchlinkCreate from './izlemelinki/olustur'
import WatchLinkDelete from './izlemelinki/sil'
import WarningBox from '../../components/warningerrorbox/warning';
import { watchLinkList } from '../../config/api-routes';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            <Box py={2} bgcolor="background.level2" boxShadow={2}>{children}</Box>
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export default function EpisodeWatchLinkIndex() {
    const theme = useTheme()
    const token = useGlobal("user")[0].token
    const [value, setValue] = useState(0)
    const [watchLinks, setWatchLinks] = useState([])
    const [adminPermList] = useGlobal('adminPermList')
    const [error, setError] = useState(false)

    useEffect(() => {
        if (!adminPermList["add-anime"]) {
            setError(true)
        }

        async function fetchData() {
            const headers = {
                "Authorization": token
            }

            const watchLink = await axios.get(watchLinkList, { headers }).catch(res => res)

            if (watchLink.status === 200) setWatchLinks(watchLink.data.list)
        }

        fetchData()
    }, [adminPermList, token])

    function handleChange(event, newValue) {
        setValue(newValue)
    }

    function handleChangeIndex(index) {
        setValue(index)
    }

    return (
        <>
            {error ? <Redirect to="/" /> : ""}
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="Yatay menüler"
                >
                    {adminPermList["add-watch-link"] ? <Tab label="Ekle" {...a11yProps(0)} /> : ""}
                    {adminPermList["delete-watch-link"] ? <Tab label="Sil" {...a11yProps(1)} /> : ""}
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                {adminPermList["add-watch-link"] ?
                    <TabPanel value={value} index={0} dir={theme.direction}>
                        {value === 0 ? <WatchlinkCreate /> : ""}
                    </TabPanel>
                    : ""}
                {adminPermList["delete-watch-link"] ?
                    <TabPanel value={value} index={1} dir={theme.direction}>
                        {value === 1 ? <WatchLinkDelete /> : 0}
                    </TabPanel>
                    : ""}
            </SwipeableViews>
            {watchLinkList.length ?
                <WarningBox bgcolor="background.level1" mb={2}>
                    <Typography variant="h4">Kabul edilen linkler</Typography>
                    <Typography variant="h6">{watchLinks.map((w, i) => i === watchLinks.length - 1 ? w.toUpperCase() : `${w.toUpperCase()} - `)}</Typography>
                </WarningBox>
                : ""}
        </>
    );
}
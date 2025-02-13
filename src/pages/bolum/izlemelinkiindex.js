import React, { useEffect, useState } from 'react';
import { useGlobal } from 'reactn'
import axios from '../../config/axios/axios'

import { useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import WatchlinkCreate from './izlemelinki/olustur'
import WatchLinkDelete from './izlemelinki/sil'
import WarningBox from '../../components/warningerrorbox/warning';
import { watchLinkList } from '../../config/api-routes';

import { a11yProps, TabPanel } from "../../components/pages/default-components";
import { Navigate } from 'react-router-dom';

export default function EpisodeWatchLinkIndex() {
    const theme = useTheme()
    const token = useGlobal("user")[0].token
    const [value, setValue] = useState(0)
    const [watchLinks, setWatchLinks] = useState([])
    const [adminPermList] = useGlobal('adminPermList')
    const [error, setError] = useState(false)

    useEffect(() => {
        if (!adminPermList["add-watch-link"] && !adminPermList["delete-watch-link"]) {
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

    return (
        <>
            {error ? <Navigate to="/" replace /> : ""}
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                    aria-label="Yatay menüler"
                >
                    <Tab disabled={!adminPermList["add-watch-link"]} style={!adminPermList["add-watch-link"] ? { display: "none" } : null} label="Ekle" {...a11yProps(0)} />
                    <Tab disabled={!adminPermList["delete-watch-link"]} style={!adminPermList["delete-watch-link"] ? { display: "none" } : null} label="Sil" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            {adminPermList["add-watch-link"] && value === 0 ?
                <TabPanel value={value} index={0} dir={theme.direction}>
                    <WatchlinkCreate />
                </TabPanel>
                : <></>}
            {adminPermList["delete-watch-link"] && value === 1 ?
                <TabPanel value={value} index={1} dir={theme.direction}>
                    <WatchLinkDelete />
                </TabPanel>
                : <></>}
            {watchLinkList.length ?
                <WarningBox bgcolor="background.level1" mb={2} variant="h6">
                    {watchLinks.map((w, i) => i === watchLinks.length - 1 ? w.toUpperCase() : `${w.toUpperCase()} - `)}
                </WarningBox>
                : ""}
        </>
    );
}
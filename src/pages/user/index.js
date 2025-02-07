import React, { useEffect, useState } from 'react';
import { useGlobal } from 'reactn'
import { Navigate } from 'react-router-dom'

import { useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import UserCreate from './olustur'
import UserUpdate from './duzenle'
import UserDelete from './sil'

import { a11yProps, TabPanel } from "../../components/pages/default-components";

export default function VerticalTabs() {
    const theme = useTheme()
    const token = useGlobal("user")[0].token
    const [value, setValue] = useState(0)
    const [adminPermList] = useGlobal('adminPermList')

    const [error, setError] = useState(false)

    useEffect(() => {
        if (!adminPermList["add-user"] && !adminPermList["update-user"] && !adminPermList["delete-user"]) {
            setError(true)
        }
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
                    {adminPermList["add-user"] ? <Tab label="Oluştur" {...a11yProps(0)} /> : ""}
                    {adminPermList["update-user"] ? <Tab label="Düzenle" {...a11yProps(1)} /> : ""}
                    {adminPermList["delete-user"] ? <Tab label="Sil" {...a11yProps(2)} /> : ""}
                </Tabs>
            </AppBar>
            {adminPermList["add-user"] ?
                <TabPanel value={value} index={0} dir={theme.direction}>
                    {value === 0 ? <UserCreate /> : ""}
                </TabPanel>
                : ""}
            {adminPermList["update-user"] ?
                <TabPanel value={value} index={1} dir={theme.direction}>
                    {value === 1 ? <UserUpdate theme={theme} /> : 0}
                </TabPanel>
                : ""}
            {adminPermList["delete-user"] ?
                <TabPanel value={value} index={2} dir={theme.direction}>
                    {value === 2 ? <UserDelete theme={theme} /> : 0}
                </TabPanel>
                : ""}
        </>
    );
}
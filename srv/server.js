/*eslint no-console: 0*/
"use strict";

const express = require('express');
const xsenv = require('@sap/xsenv');
const hdbext = require('@sap/hdbext');

const app = new express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

// Load environment variables
xsenv.loadEnv();

/**
 * 
 * @param {*} hanaConfig 
 * @param {*} tag 
 */
function getHanaClient(hanaConfig, tag) {
    return new Promise((resolve, reject) => {
        let hanaCredentials;
        if (hanaConfig && hanaConfig.hana) {
            hanaCredentials = hanaConfig.hana;
        } else {
            hanaCredentials = xsenv.cfServiceCredentials({
                tag: tag
            });
        }

        hdbext.createConnection(hanaCredentials, (err, client) => {
            if (err) {
                reject(err);
            }
            resolve(client);
        });
    });
}

// API to run PR harmonization extraction procedure
app.get('/schedulePRHarmonizedJob', async function(req,res){
    let hanaOptions = xsenv.getServices({
        hana: {
            tag: "trp4_pr_db"
        }
    });
    const conn = await getHanaClient(hanaOptions.hana, "trp4_pr_db");
    
    const procName = "sap.tm.trp.db.pickupreturn.harmonization::p_pr_extr_controller";
    let sqlQuery = 'call "'+procName+'"()';
    try{	
        await conn.exec(sqlQuery);
        res.send('PR data extraction job ran successfully');
    }catch(e){
        console.log(e);
        res.error(`PR data extraction job failed with error: ${e.message}`);
    }	
});

app.get('/scheduleSDHarmonizedJob', async function(req,res){
    let hanaOptions = xsenv.getServices({
        hana: {
            tag: "trp4_sd_db"
        }
    });
    const conn = await getHanaClient(hanaOptions.hana, "trp4_sd_db");

    const procName = "sap.tm.trp.db.supplydemand.instant.model::pipline_data_extraction_model";
    let sqlQuery = 'call "'+procName+'"()';
    try{	
        await conn.exec(sqlQuery);
        res.send('SD data extraction job ran successfully');
    }catch(e){
        console.log(e);
        res.error(`SD data extraction job failed with error: ${e.message}`);
    }	
});

app.get('/scheduleRVHarmonizedJob', async function(req,res){
    let hanaOptions = xsenv.getServices({
        hana: {
            tag: "trp4_rv_db"
        }
    });
    const conn = await getHanaClient(hanaOptions.hana, "trp4_rv_db");

    const procName = "sap.tm.trp.db.booking.harmonization::p_rp_cargo_extr_controller";
    let sqlQuery = 'call "'+procName+'"()';
    try{	
        await conn.exec(sqlQuery);
        res.send('RV data extraction job ran successfully');
    }catch(e){
        console.log(e);
        res.error(`RV data extraction job failed with error: ${e.message}`);
    }	
});

// Start the server
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

process.on("uncaughtException", function (exception) {
    console.log(exception);
});

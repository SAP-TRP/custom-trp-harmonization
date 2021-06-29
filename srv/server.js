/*eslint no-console: 0*/
"use strict";
const
    express = require('express'),
    xsenv = require('@sap/xsenv'),
    hdbext = require('@sap/hdbext'),
    axios = require('axios'),
    {
        response
    } = require('express'),
    app = new express(),
    port = process.env.PORT || 4000;
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

// Load environment variables
xsenv.loadEnv();

// get HANA services
const
        hanaOptionsSD = xsenv.getServices({
            hana: {
                tag: "trp4_sd_db"
            }
        }),
        hanaOptionsPR = xsenv.getServices({
            hana: {
                tag: "trp4_pr_db"
            }
        }),
        hanaOptionsRV = xsenv.getServices({
            hana: {
                tag: "trp4_rv_db"
            }
        });

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

function getUserCreds(){
    xsenv.loadEnv();
    let jobOptions = xsenv.getServices({
        jobs: {
            tag: "jobscheduler"
        }
    });

    return {
        user:jobOptions.jobs.user,
        password:jobOptions.jobs.password
    }
}
/**
 *
 * @params {jsURL,jsJobID,jsRunID,jsScheduleID,jsHostURL}   Job Scheduler Inbound Message Header details
 * @param {*} status Boolean value for the HDB procedure call
 * @param {*} msg Message to be updated to Job ID Logs
 * @returns HTTP Response Data from JS Update Logs Run Endpoints
 */
async function updateJobRunLogs(jobDetails, status, msg) {
	try
	{
	    let creds  = getUserCreds();
	
	    const
        jsUpdateRes = await axios.put(jobDetails.jsURL(), {
            success: status,
            message: msg
        },{
	        auth: {
	          username: creds.user,
	          password: creds.password
	    }
        }
        );
        
        return jsUpdateRes;
	}
	catch(error)
	{
	    console.log(error);
	}
}

// API to run PR harmonization extraction procedure
app.get('/schedulePRHarmonizedJob', async function (req, res) {
   
    const
        conn = await getHanaClient(hanaOptionsPR.hana, "trp4_pr_db"),
        sqlQuery = 'call "sap.tm.trp.db.pickupreturn.harmonization::p_pr_extr_controller"()';
        
        // STEP-1:  Extract the 5 headers as constants
    let
        jobDetails = Object.create({
            jsJobID: req.headers["x-sap-job-id"], // the Job ID
            jsScheduleID: req.headers["x-sap-job-schedule-id"], // the Job Schedule ID
            jsRunID: req.headers["x-sap-job-run-id"], // the Job Run ID
            jsHostURL: req.headers["x-sap-scheduler-host"], // the Job Scheduler Host URI
            jsURL: function () {
                return this.jsHostURL + "/scheduler/jobs/" + this.jsJobID + "/schedules/" + this.jsScheduleID + "/runs/" + this.jsRunID;
            }
        });

    res.status(202).send(`PR data extraction job initiated`);
        
    try 
    {
    	await conn.exec(sqlQuery);
        await updateJobRunLogs(jobDetails, true, "PR data extraction job completed successfully");
    } 
    catch (err) 
    {
        console.error(`>>> [JS Update Job ERROR] Job Scheduler ID: ${jobDetails.jsJobID} / Run ID: ${jobDetails.jsRunID} due to ${err.message}`);
        await updateJobRunLogs(jobDetails, false, `PR data extraction job failed with error : ${err.message}`);
    }
});

app.get('/scheduleSDHarmonizedJob', async function (req, res) {
	
	const
        conn = await getHanaClient(hanaOptionsSD.hana, "trp4_sd_db"),
        sqlQuery = 'call "sap.tm.trp.db.supplydemand.instant.model::pipline_data_extraction_model"()';
        
	let
        jobDetails = Object.create({
            jsJobID: req.headers["x-sap-job-id"], // the Job ID
            jsScheduleID: req.headers["x-sap-job-schedule-id"], // the Job Schedule ID
            jsRunID: req.headers["x-sap-job-run-id"], // the Job Run ID
            jsHostURL: req.headers["x-sap-scheduler-host"], // the Job Scheduler Host URI
            jsURL: function () {
                return this.jsHostURL + "/scheduler/jobs/" + this.jsJobID + "/schedules/" + this.jsScheduleID + "/runs/" + this.jsRunID;
            }
        });

    res.status(202).send(`SD data extraction job initiated`);
    
    try 
    {
    	await conn.exec(sqlQuery);
        await updateJobRunLogs(jobDetails, true, "SD data extraction job completed successfully");
    } 
    catch (err) 
    {
    	console.error(`>>> [JS Update Job ERROR] Job Scheduler ID: ${jobDetails.jsJobID} / Run ID: ${jobDetails.jsRunID} due to ${err.message}`);
        await updateJobRunLogs(jobDetails, false, `SD data extraction job failed with error: ${err.message}`);
    }
});

app.get('/scheduleRVHarmonizedJob', async function (req, res) {
	
	const
        conn = await getHanaClient(hanaOptionsRV.hana, "trp4_rv_db"),
        sqlQuery = 'call "sap.tm.trp.db.booking.harmonization::p_rp_cargo_extr_controller"()';
    
    let
        jobDetails = Object.create({
            jsJobID: req.headers["x-sap-job-id"], // the Job ID
            jsScheduleID: req.headers["x-sap-job-schedule-id"], // the Job Schedule ID
            jsRunID: req.headers["x-sap-job-run-id"], // the Job Run ID
            jsHostURL: req.headers["x-sap-scheduler-host"], // the Job Scheduler Host URI
            jsURL: function () {
                return this.jsHostURL + "/scheduler/jobs/" + this.jsJobID + "/schedules/" + this.jsScheduleID + "/runs/" + this.jsRunID;
            }
        });
        
    res.status(202).send(`RV data extraction job initiated`);
     
    try 
    {
        await conn.exec(sqlQuery);
        await updateJobRunLogs(jobDetails, true, "RV data extraction job completed successfully");
    } 
    catch (err)
    {
        console.error(`>>> [JS Update Job ERROR] Job Scheduler ID: ${jobDetails.jsJobID} / Run ID: ${jobDetails.jsRunID} due to ${err.message}`);
        await updateJobRunLogs(jobDetails, false, `RV data extraction job failed with error: ${err.message}`);
    }
});
// Start the server
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
process.on("uncaughtException", function (exception) {
    console.log(exception);
});

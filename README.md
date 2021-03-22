# SAP Transportation Resource Planning 4.0 - Develop User-Defined MTA Application for SD/PR harmonization APIs

## How to deploy the application

### Steps

This note contains a multi-target application (MTA) project that has an nodejs module containing the following API endpoints:

- `/schedulePRHarmonizedJob`
- `/scheduleSDHarmonizedJob`
- `/scheduleRVHarmonizedJob`

To build and deploy this project, perform the following steps:

1. Open the [SAP-TRP/custom-trp-harmonization](https://github.com/SAP-TRP/custom-trp-harmonization) and clone the project in your local folder.

2. Navigate inside custom-trp-harmonization folder, select all files and zip it.

3. In the SAP Web IDE, right click on Workspace and navigate to `Import -> File or Project`.

4. Browse and provide the zip file of the project you have created in step 2.

5. Select the Extract Archive check box and choose OK.

6. Right click on the project and navigate to `Project -> Project Settings`.

7. Under `Project -> Space`, select your development space and choose Save. For more information on organization and space, see the SAP HANA guide.

8. Right click on the main project. Choose `Build -> Build`.

9. To view the MTAR file generated, expand the folder mta_archives, which is under your current project folder.

10. Right click on the MTAR file. Select Export.

11. Once the MTAR file is exported, deploy this application to the space where you are deploying the SAP Transportation Resource Planning 4.0 application.

12. To deploy the application, log in to the system with the command line interface as follows:

    > xs login -a <url> -u <user> -p <password>

13. Navigate to the space where you want to deploy the application as follows:

    > xs t -s <space>

14. Open `SAP_TRP_HARMONIZATION_CUSTOM.mtaext` that is available in the cloned github code and replace following:

    `<trp4_hdi_sd_db>` with service name corresponding to trp4_hdi_sd_db in mtaext of core

    `<sd_schema>` with schema name corresponding to trp4_hdi_sd_db in mtaext of core

    `<trp4_hdi_pr_db>` with service name corresponding to trp4_hdi_pr_db in mtaext of core

    `<pr_schema>` with schema name corresponding to trp4_hdi_pr_db in mtaext of core

    `<trp4_hdi_rv_db>` with service name corresponding to trp4_hdi_rv_db in mtaext of core

    `<rv_schema>` with schema name corresponding to trp4_hdi_rv_db in mtaext of core

15. Deploy the application as follows:

    > xs deploy <custom-trp-harmonization_1.0.0>.mtar -e SAP_TRP_HARMONIZATION_CUSTOM.mtaext

    Here `custom-trp-harmonization_1.0.0.mtar` is the MTAR file you exported in step 10, and `SAP_TRP_HDI_HARMONIZATION_CUSTOM.mtaext` is the deployment descriptor file provided in the github.
    You may update the service-name and schema in the deployment descriptor file as per your naming convention.

## Known Issues

None

## How to obtain support

This project is provided "as-is": there is no guarantee that raised issues will be answered or addressed in future releases.

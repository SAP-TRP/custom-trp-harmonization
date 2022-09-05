# SAP Transportation Resource Planning 4.0 & 5.0- Develop User-Defined MTA Application for SD/PR harmonization APIs

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

9. To view the MTAR file generated, expand the folder mta_archives, which is in the same level as your current project folder.

10. Open `SAP_TRP_HARMONIZATION_CUSTOM.mtaext` that is available in the cloned github code and replace following:

    `<trp4_hdi_sd_db>` with service name corresponding to trp4_hdi_sd_db in mtaext of core

    `<sd_schema>` with schema name corresponding to trp4_hdi_sd_db in mtaext of core

    `<trp4_hdi_pr_db>` with service name corresponding to trp4_hdi_pr_db in mtaext of core

    `<pr_schema>` with schema name corresponding to trp4_hdi_pr_db in mtaext of core

    `<trp4_hdi_rv_db>` with service name corresponding to trp4_hdi_rv_db in mtaext of core

    `<rv_schema>` with schema name corresponding to trp4_hdi_rv_db in mtaext of core

11. Right click on the MTAR file genereated and choose deploy option and select 'Deploy to XS Advanced'.
    In the pop-up windown, verify the organization, space name to which you want to deploy.
    Select the `SAP_TRP_HARMONIZATION_CUSTOM.mtaext` file in MTA extension Descriptor dropdown and click on the deploy button.


## Known Issues

None

## How to obtain support

This project is provided "as-is": there is no guarantee that raised issues will be answered or addressed in future releases.

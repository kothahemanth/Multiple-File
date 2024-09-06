sap.ui.require(
    [
        'sap/fe/test/JourneyRunner',
        'employee/test/integration/FirstJourney',
		'employee/test/integration/pages/EmployeeList',
		'employee/test/integration/pages/EmployeeObjectPage',
		'employee/test/integration/pages/FilesObjectPage'
    ],
    function(JourneyRunner, opaJourney, EmployeeList, EmployeeObjectPage, FilesObjectPage) {
        'use strict';
        var JourneyRunner = new JourneyRunner({
            // start index.html in web folder
            launchUrl: sap.ui.require.toUrl('employee') + '/index.html'
        });

       
        JourneyRunner.run(
            {
                pages: { 
					onTheEmployeeList: EmployeeList,
					onTheEmployeeObjectPage: EmployeeObjectPage,
					onTheFilesObjectPage: FilesObjectPage
                }
            },
            opaJourney.run
        );
    }
);
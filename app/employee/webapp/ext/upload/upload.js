sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/mvc/View"
], function (MessageToast, View) {
    'use strict';

    return {
        upload: function () {
            var oView = this.editFlow.getView();
            var oDialog = oView.byId("upload");
            if (!oDialog) {
                View.create({
                    viewName: "employee.view.Upload",
                    type: sap.ui.core.mvc.ViewType.XML
                }).then(function (oDialogView) {
                    oView.addDependent(oDialogView);
                    oDialog = oDialogView.byId("upload");
                    if (oDialog) {
                        oDialog.open();
                    }
                });
            } else {
                oDialog.open();
            }
        }
    };
});
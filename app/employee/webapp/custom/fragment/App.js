sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Item"
], function(MessageToast, JSONModel, Filter, FilterOperator) {
    'use strict';

    return {
        onInit: function(oEvent) {
            console.log("Performing Multiple Files Update");
        },

        onAfterItemAdded: function(oEvent) {
            var item = oEvent.getParameter("item");

            var path = this.editFlow.getView().getBindingContext().getPath();
            var employeeId = path.match(/ID=([^,]+)/)[1];
            console.log(employeeId);
            
            var _createEntity = function(item) {
                var data = {
                    mediaType: item.getMediaType(),
                    fileName: item.getFileName(),
                    size: item.getFileObject().size
                };

                var settings = {
                    url: `/odata/v4/satinfotech/Employee(ID=${employeeId},IsActiveEntity=false)/uploadFile`,
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    data: JSON.stringify(data)
                };

                return new Promise((resolve, reject) => {
                    $.ajax(settings)
                        .done((results) => {
                            resolve(results.ID);
                        })
                        .fail((err) => {
                            reject(err);
                        });
                });
            };

            _createEntity(item)
                .then((id) => {
                    var url = `/odata/v4/satinfotech/Employee(ID=${employeeId},IsActiveEntity=false)/uploadFile(ID=${id},IsActiveEntity=false)/content`;
                    item.setUploadUrl(url);

                    var oUploadSet = this.byId("uploadSet");
                    oUploadSet.setHttpRequestMethod("PUT");
                    oUploadSet.uploadItem(item);
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        onUploadCompleted: function(oEvent) {
            var oUploadSet = this.byId("uploadSet");
            oUploadSet.removeAllIncompleteItems();
            this._refreshUploadSet();
            MessageToast.show("File uploaded successfully.");
        },

        onRemovePressed: function(oEvent) {
            oEvent.preventDefault();
            var item = oEvent.getParameter("item");
            item.getBindingContext().delete();
            MessageToast.show("Selected file has been deleted.");
        },

        onOpenPressed: function(oEvent) {
            var item = oEvent.getSource();
            var fileName = item.getFileName();

            var _download = function(item) {
                var settings = {
                    url: item.getUrl(),
                    method: "GET",
                    headers: {
                        "Content-type": "application/octet-stream"
                    },
                    xhrFields: {
                        responseType: 'blob'
                    }
                };

                return new Promise((resolve, reject) => {
                    $.ajax(settings)
                        .done((result) => {
                            resolve(result);
                        })
                        .fail((err) => {
                            reject(err);
                        });
                });
            };

            _download(item)
                .then((blob) => {
                    var url = window.URL.createObjectURL(blob);
                    var link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', fileName);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })
                .catch((err) => {
                    console.log(err);
                });
        },

        formatThumbnailUrl: function(mediaType) {
            var iconUrl;
            switch (mediaType) {
                case "image/png":
                    iconUrl = "sap-icon://card";
                    break;
                case "text/plain":
                    iconUrl = "sap-icon://document-text";
                    break;
                case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                    iconUrl = "sap-icon://excel-attachment";
                    break;
                case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                    iconUrl = "sap-icon://doc-attachment";
                    break;
                case "application/pdf":
                    iconUrl = "sap-icon://pdf-attachment";
                    break;
                default:
                    iconUrl = "sap-icon://attachment";
            }
            return iconUrl;
        },

        _refreshUploadSet: function() {
            var path = this.editFlow.getView().getBindingContext().getPath();
            var employeeId = path.match(/ID=([^,]+)/)[1];

            var oUploadSet = this.byId("uploadSet");
            var oBinding = oUploadSet.getBinding("items");

            var oFilter = new Filter("EmployeeID", FilterOperator.EQ, employeeId);
            oBinding.filter([oFilter]);

            MessageToast.show("Upload Set refreshed for Employee ID " + employeeId);
        },

        onRefreshUploadSet: function() {
            this._refreshUploadSet();
        }
    };
});

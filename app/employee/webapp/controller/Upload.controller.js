sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Item",
    "sap/m/MessageToast"
],
    function (Controller, JSONModel, Item, MessageToast) {
        "use strict";

        return Controller.extend("employee.controller.Upload", {
            onInit: function () {
                var oModel = new JSONModel({
                    files: []
                });
                this.getView().setModel(oModel);
            },

            onAfterItemAdded: function (oEvent) {
                var item = oEvent.getParameter("item");
                console.log("Item added: ", item); 

                this._createEntity(item)
                    .then((id) => {
                        console.log("Created Entity ID: ", id); 
                        this._uploadContent(item, id);
                    })
                    .catch((err) => {
                        console.error("Error during entity creation: ", err);
                    });
            },

            onUploadCompleted: function (oEvent) {
                var oUploadSet = this.byId("uploadSet");
                oUploadSet.removeAllIncompleteItems();
                oUploadSet.getBinding("items").refresh();
                MessageToast.show("File upload completed successfully");
            },

            onRemovePressed: function (oEvent) {
                oEvent.preventDefault();
                oEvent.getParameter("item").getBindingContext().delete();    
                MessageToast.show("Selected file has been deleted");
            },

            onOpenPressed: function (oEvent) {
                oEvent.preventDefault();
                var item = oEvent.getSource();
                this._fileName = item.getFileName();
                var that = this;
                this._download(item)
                    .then((blob) => {
                        var url = window.URL.createObjectURL(blob);
                        var link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', that._fileName);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);                        
                    })
                    .catch((err) => {
                        console.log(err);
                    });                    
            },

            _download: function (item) {
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
            },

            _createEntity: function (item) {
                var data = {
                    mediaType: item.getMediaType(),
                    fileName: item.getFileName(),
                    size: item.getFileObject().size
                };
    
                var settings = {
                    url: "/odata/v4/satinfotech/Files",
                    method: "POST",
                    headers: {
                        "Content-type": "application/json"
                    },
                    data: JSON.stringify(data)
                };
    
                return new Promise((resolve, reject) => {
                    $.ajax(settings)
                    .done((results) => {
                        console.log("Entity Created: ", results);
                        resolve(results.ID); 
                    })
                    .fail((err) => {
                        console.error("Error creating entity: ", err);
                        reject(err);
                    });
                });
            },

            _uploadContent: function (item, id) {
                var url = `/odata/v4/satinfotech/Files(${id})/content`;
                item.setUploadUrl(url); 
                var oUploadSet = this.byId("uploadSet");
                oUploadSet.setHttpRequestMethod("PUT"); 
                oUploadSet.uploadItem(item); 
            },

            formatThumbnailUrl: function (mediaType) {
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

            onDialogFileChange: function (oEvent) {
                var oFileUploader = oEvent.getSource();
                var bValid = oFileUploader.getValue() !== "";
                this.byId("Upload").setEnabled(bValid);
            },

            onUploadDialogPress: function () {
                var oFileUploader = this.byId("fileUploader");
                if (!oFileUploader.getValue()) {
                    MessageToast.show("Please select a file first");
                } else {
                    MessageToast.show("File is being uploaded...");
                }
            },

            onDialogCancelPress: function () {
                this.byId("upload").close();
            }
        });
    });

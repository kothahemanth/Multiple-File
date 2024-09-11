using { com.hemanth.satinfotech as db } from '../db/schema';

service satinfotech {
    entity Employee as projection on db.Employee;
    entity Files as projection on db.Files;
    
}

annotate satinfotech.Employee with @odata.draft.enabled;

annotate satinfotech.Employee with {
    emp_img @assert.match: '^https?:\/\/.*\.(?:png|jpg|jpeg)$';
};

annotate satinfotech.Employee with {
@Common.Text : ' {Employee}'
@Core.IsURL: true
@Core.MediaType: 'image/jpg'
emp_img;
};

annotate satinfotech.Employee with @(
    UI.LineItem: [
        {
            $Type : 'UI.DataField',
            Label: 'EmployeeID',
            Value: emp_id
        },
        {
            $Type : 'UI.DataField',
            Value: emp_name
        },
        {
            $Type : 'UI.DataField',
            Value: emp_img
        },
        {
            $Type : 'UI.DataField',
            Value: salary
        },
        {
            $Type : 'UI.DataField',
            Value: age
        }
    ]
);

annotate satinfotech.Employee with @(       
    UI.FieldGroup #EmployeeInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value: emp_id
            },
            {
                $Type : 'UI.DataField',
                Value: emp_name
            },
            {
                $Type : 'UI.DataField',
                Value: emp_img
            },
            {
                $Type : 'UI.DataField',
                Value: salary
            },
            {
                $Type : 'UI.DataField',
                Value: age
            }
        ]
    },

    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'EmployeeInfoFacet',
            Label : 'Employee Information',
            Target : '@UI.FieldGroup#EmployeeInformation'
        },
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'FileInfoFacet',
            Label : 'File Information',
            Target : 'uploadFile/@UI.LineItem'
        }
    ]
);

annotate satinfotech.Files with @(
    UI.LineItem: [
        {
            $Type : 'UI.DataField',
            Label: 'CustomerID',
            Value: File_ID
        },
        {
            $Type : 'UI.DataField',
            Value: content
        },
        {
            $Type : 'UI.DataField',
            Value: mediaType
        },
        {
            $Type : 'UI.DataField',
            Value: fileName
        },
        {
            $Type : 'UI.DataField',
            Value: size
        },
        {
            $Type : 'UI.DataField',
            Value: url
        }
    ]
);

annotate satinfotech.Files with @(       
    UI.FieldGroup #FileInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value: File_ID
            },
            {
                $Type : 'UI.DataField',
                Value: content
            },
            {
                $Type : 'UI.DataField',
                Value: mediaType
            },
            {
                $Type : 'UI.DataField',
                Value: fileName
            },
            {
                $Type : 'UI.DataField',
                Value: size
            },
            {
                $Type : 'UI.DataField',
                Value: url
            }
        ]
    },

    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'FileInfoFacet',
            Label : 'File Information',
            Target : '@UI.FieldGroup#FileInformation'
        }
    ]
);
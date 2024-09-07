namespace com.hemanth.satinfotech;
using { managed, cuid } from '@sap/cds/common';

entity Files: cuid, managed {
    @Core.MediaType: mediaType 
    @Core.ContentDisposition.Filename: fileName 
    @Core.ContentDisposition.Type: 'inline'
    @title: 'Content'
    content: LargeBinary;
    @Core.IsMediaType: true
    @title: 'Media Type'
    mediaType: String;
    @title: 'File Name'
    fileName: String;
    @title: 'size'
    size: Integer;
    @title: 'Url'
    url: String;
}

entity Employee : cuid, managed {
    key ID: UUID;
    @title: 'Employee ID'
    emp_id: String(30);
    @title: 'Employee Name'
    emp_name: String(20);
    @title: 'Employee Image URL'
    emp_img: String default 'https://imgur.com/LpjNNKU.png';
    @title: 'Employee Salary'
    salary: Decimal(15, 2);
    @title: 'Employee Age'
    age: Decimal;
    
    @title: 'Employee Files'
    files: Association to Files;
}

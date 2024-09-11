namespace com.hemanth.satinfotech;
using { managed, cuid } from '@sap/cds/common';
entity Employee : cuid, managed {
    key ID            : UUID;
    @title: 'EmployeeID'
    emp_id: String(30);
    @title: 'Employee Name'
    emp_name: String(20) ;
    @title: 'Employee Image URL'
    emp_img: String default 'https://imgur.com/LpjNNKU.png'; 
    @title: 'Employee Salary'
    salary: Decimal(15, 2) ;
    @title: 'Employee Age'
    age: Decimal;

    uploadFile: Composition of many Files on uploadFile.File=$self
}

entity Files : cuid, managed {
    File: Association to one Employee;
    @Core.MediaType: mediaType
    content: LargeBinary;
    @Core.IsMediaType: true
    mediaType: String;
    fileName: String;
    size: Integer;
    url: String;
}
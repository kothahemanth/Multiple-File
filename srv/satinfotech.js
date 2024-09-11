const cds = require('@sap/cds');
const fs = require('fs');
const path = require('path');

module.exports = cds.service.impl(function () {
    const { Employee, Files } = this.entities;

    // Handle file creation
    this.on('CREATE', Files, async (req) => {
        const data = req.data;
        data.createdAt = new Date();
        data.createdBy = req.user.id; // Ensure user ID is available

        try {
            const file = await INSERT.into(Files).entries(data);
            return file;
        } catch (error) {
            req.error(500, `Error creating file: ${error.message}`);
        }
    });

    // Handle file update
    this.on('UPDATE', Files, async (req) => {
        const data = req.data;
        const id = req.params[0];

        try {
            await UPDATE(Files).set(data).where({ ID: id });
        } catch (error) {
            req.error(500, `Error updating file: ${error.message}`);
        }
    });

    // Handle file deletion
    this.on('DELETE', Files, async (req) => {
        const id = req.params[0];

        try {
            await DELETE.from(Files).where({ ID: id });
        } catch (error) {
            req.error(500, `Error deleting file: ${error.message}`);
        }
    });

    // Handle file content upload
    this.on('PUT', 'Files/:ID/content', async (req) => {
        const id = req.params[0];
        const file = req.data;

        try {
            const fileEntry = await SELECT.one.from(Files).where({ ID: id });
            if (!fileEntry) {
                return req.error(404, `File with ID ${id} not found`);
            }

            const filePath = path.join(__dirname, 'temp', fileEntry.fileName);
            fs.writeFileSync(filePath, file.content);

            await UPDATE(Files).set({ url: filePath }).where({ ID: id });
        } catch (error) {
            req.error(500, `Error uploading file content: ${error.message}`);
        }
    });

    // Handle file content retrieval
    this.on('GET', 'Files/:ID/content', async (req) => {
        const id = req.params[0];

        try {
            const fileEntry = await SELECT.one.from(Files).where({ ID: id });
            if (!fileEntry) {
                return req.error(404, `File with ID ${id} not found`);
            }

            const filePath = path.join(__dirname, 'temp', fileEntry.fileName);
            const content = fs.readFileSync(filePath);

            req.respond(content, { 'Content-Type': fileEntry.mediaType });
        } catch (error) {
            req.error(500, `Error retrieving file content: ${error.message}`);
        }
    });
});

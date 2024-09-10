module.exports = async function () {

    this.before('CREATE', 'Files', req => {
        console.log('CREATE called');
        console.log(JSON.stringify(req.data));
        req.data.url = `/odata/v4/satinfotech/Files(${req.data.ID})/content`;
    });

    this.on('CREATE', 'Files', async (req) => {
        const { ID, fileName, mediaType, size } = req.data;

        const filesTable = this.entities.Files;
        await INSERT.into(filesTable).entries({
            ID,
            fileName,
            mediaType,
            size,
            url: `/odata/v4/satinfotech/Files(${ID})/content`
        });

        return { ID };
    });

    this.on('PUT', 'Files', async (req) => {
        const fileContent = req.data;
        const fileId = req.params[0].ID;
        console.log(`File content received for ID: ${fileId}`);
    });

    this.before('READ', 'Files', req => {
        console.log('Read request content-type:', req.headers['content-type']);
    });
};

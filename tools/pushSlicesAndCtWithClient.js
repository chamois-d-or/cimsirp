const prismicCustomTypes =require("@prismicio/custom-types-client");
const fetch = require('node-fetch')
const fs = require('fs');
const glob = require("glob");

const pushSlicesAndCtWithClient = async (repositoryName,token) => {
    const slicesJsons = glob.sync('./slices/**/model.json')
    console.log({slicesJsons})

    const customTypesClient = prismicCustomTypes.createClient({
        repositoryName,
        token,
        fetch,
    });

    // Get all Custom Type models from the repository.
    const models = await customTypesClient.getAllCustomTypes();
    console.log({ models });

    // Get the "page" Custom Type model from the repository.
    const pageModel = await customTypesClient.getCustomTypeByID("page");
    console.log({ pageModel });

    // Update the "page" Custom Type model from the repository.
    // This example disables the model from new documents being created.
    // await customTypesClient.updateCustomType({
    //     ...pageModel,
    //     status: false,
    // });

    // Remove the "page" Custom Type model from the repository.
    //await customTypesClient.removeCustomType("page");

    // Re-add the "page" Custom Type model.
    //await customTypesClient.insertCustomType(pageModel);
}

pushSlicesAndCtWithClient("cimsirp","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoibWFjaGluZTJtYWNoaW5lIiwiZGJpZCI6ImNpbXNpcnAtNmQzOGQ2MmQtYWU5OC00MmNhLTlkYzItNzgyM2ZlYzZhYTRmXzQiLCJkYXRlIjoxNjUwOTc3NzQyLCJkb21haW4iOiJjaW1zaXJwIiwiaWF0IjoxNjUwOTc3NzQyfQ.xv0yZIzypJiOr78QYMAz_crIbpQpMiUQlF0CErQsJZk")
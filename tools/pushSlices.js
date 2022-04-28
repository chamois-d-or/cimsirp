const glob = require("glob");
const fetch = require('node-fetch')
var fs = require('fs');

pushSlices("cimsirp", process.env.CT_API_KEY)
pushCT("cimsirp", process.env.CT_API_KEY)

module.exports = {
  pushSlices : async function pushSlices(repositoryName, ctKey) {
    const slicesJsons = glob.sync('./slices/**/model.json')

    console.log("slices in the github code", slicesJsons)
    slicesJsons.forEach(function(slice,index){
        const slice_file_edited = fs.readFileSync(slicesJsons[index], 'utf8').replace(/"catalog": "cimsirp/g, '"catalog": "' + repositoryName)
        const sliceObject = JSON.parse(slice_file_edited);
        sliceObject.variations.forEach(function(variation,index2){
          if(fs.existsSync(slice.split('model.json')[0]+sliceObject.variations[index2].id+'/preview.png')){
            sliceObject.variations[index2].imageUrl = "https://raw.githubusercontent.com/chamois-d-or/cimsirp/staging/slices/"+slice.split("/")[2]+"/"+sliceObject.name+"/"+sliceObject.variations[index2].id+"/preview.png"
          }
          else{
            sliceObject.variations[index2].imageUrl = "https://raw.githubusercontent.com/chamois-d-or/cimsirp/staging/.slicemachine/assets/slices/"+slice.split("/")[2]+"/"+sliceObject.name+"/"+sliceObject.variations[index2].id+"/preview.png"
          }
        })
        const updateResponse = updateSlice(sliceObject, repositoryName, ctKey)
        updateResponse.then(updateResponse => {
          console.log(updateResponse)
          if(updateResponse === 422){
            insertSlice(sliceObject, repositoryName, ctKey)
          }
        })
    })
  },
  pushCT : async function pushCT(repositoryName, ctKey) {
    const CTJsons = glob.sync('./customtypes/**/index.json')
  
    console.log("CT in the github code", CTJsons)
    CTJsons.forEach(function(customType){
        const ct_file_edited = fs.readFileSync(customType, 'utf8').replace(/"catalog": "cimsirp/g, '"catalog": "' + repositoryName)
        const customTypeObject = JSON.parse(ct_file_edited);
        const updateResponse = updateCT(customTypeObject, repositoryName, ctKey)
        updateResponse.then(updateResponse => {
          if(updateResponse === 422){
            insertCT(customTypeObject, repositoryName, ctKey)
          }
        })
    })
  }
}

async function updateSlice(sliceObject, repositoryName, ctKey) {

  const URL = `https://customtypes.prismic.io/slices/update`

  const options = {
    endpoint: URL,
    method: "POST", //or POST
    headers: {
      "repository": repositoryName,
      "Authorization": ctKey,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sliceObject)
  }

  try {
    const data = await fetch(URL, options).then(response => {
      return response.status
    })

    console.log("updating slice in "+repositoryName+": " + sliceObject.id + " response: " + data)
    return data
  } catch (error) {
    throw new Error(error)
  }
}

async function insertSlice(sliceObject, repositoryName, ctKey) {

  const URL = `https://customtypes.prismic.io/slices/insert`

  const options = {
    endpoint: URL,
    method: "POST", //or POST
    headers: {
      "repository": repositoryName,
      "Authorization": ctKey,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sliceObject)
  }

  try {
    const data = await fetch(URL, options).then(response => {
      return response.status
    })

    console.log("adding slice "+repositoryName+": " + sliceObject.id + " response: " + data)
    return data
  } catch (error) {
    throw new Error(error)
  }
}

async function updateCT(customTypeObject, repositoryName, ctKey) {

  const URL = `https://customtypes.prismic.io/customtypes/update`

  const options = {
    endpoint: URL,
    method: "POST", //or POST
    headers: {
      "repository": repositoryName,
      "Authorization": ctKey,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customTypeObject)
  }

  try {
    const data = await fetch(URL, options).then(response => {
      return response.status
    })

    console.log("updating CT "+repositoryName+": " + customTypeObject.id + " response: " + data)
    return data
  } catch (error) {
    throw new Error(error)
  }
}

async function insertCT(customTypeObject, repositoryName, ctKey) {

  const URL = `https://customtypes.prismic.io/customtypes/insert`

  const options = {
    endpoint: URL,
    method: "POST", //or POST
    headers: {
      "repository": repositoryName,
      "Authorization": ctKey,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(customTypeObject)
  }

  try {
    const data = await fetch(URL, options).then(response => {
      return response.status
    })

    console.log("inserting CT "+repositoryName+": " + customTypeObject.id + " response: " + data)
    return data
  } catch (error) {
    throw new Error(error)
  }
}
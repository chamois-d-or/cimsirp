const glob = require("glob");
const fetch = require('node-fetch')
var fs = require('fs');

//const ctKey = process.env.CT_API_KEY
const ctKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoibWFjaGluZTJtYWNoaW5lIiwiZGJpZCI6ImNpbXNpcnAtNmQzOGQ2MmQtYWU5OC00MmNhLTlkYzItNzgyM2ZlYzZhYTRmXzQiLCJkYXRlIjoxNjUwOTc3NzQyLCJkb21haW4iOiJjaW1zaXJwIiwiaWF0IjoxNjUwOTc3NzQyfQ.xv0yZIzypJiOr78QYMAz_crIbpQpMiUQlF0CErQsJZk"

pushSlices()
pushCT()

async function pushSlices() {
    const slicesJsons = glob.sync('./slices/**/model.json')

    console.log("slices in the github code", slicesJsons)
    slicesJsons.forEach(function(slice,index){
        const sliceObject = JSON.parse(fs.readFileSync(slicesJsons[index], 'utf8'));
        sliceObject.variations.forEach(function(variation,index2){
          if(fs.existsSync(slice.split('model.json')[0]+sliceObject.variations[index2].id+'/preview.png')){
            sliceObject.variations[index2].imageUrl = "https://raw.githubusercontent.com/chamois-d-or/cimsirp/staging/slices/"+slice.split("/")[2]+"/"+sliceObject.name+"/"+sliceObject.variations[index2].id+"/preview.png"
          }
          else{
            sliceObject.variations[index2].imageUrl = "https://raw.githubusercontent.com/chamois-d-or/cimsirp/staging/.slicemachine/assets/slices/"+slice.split("/")[2]+"/"+sliceObject.name+"/"+sliceObject.variations[index2].id+"/preview.png"
          }
        })
        const updateResponse = updateSlice(sliceObject)
        if(updateResponse === "422"){
          insertSlice(sliceObject)
        }
    })
}

async function updateSlice(sliceObject) {

  const URL = `https://customtypes.prismic.io/slices/update`

  const options = {
    endpoint: URL,
    method: "POST", //or POST
    headers: {
      "repository": "cimsirp",
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

    console.log("updating slice in remote prismic repo: " + sliceObject.id + " response: " + data)
    return data
  } catch (error) {
    throw new Error(error)
  }
}

async function insertSlice(sliceObject) {

  const URL = `https://customtypes.prismic.io/slices/insert`

  const options = {
    endpoint: URL,
    method: "POST", //or POST
    headers: {
      "repository": "cimsirp",
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

    console.log("adding slice to remote prismic repo: " + sliceObject.id + " response: " + data)
    return data
  } catch (error) {
    throw new Error(error)
  }
}


async function pushCT() {
  const CTJsons = glob.sync('./customtypes/**/index.json')

  console.log("CT in the github code", CTJsons)
  CTJsons.forEach(function(customType){
      const customTypeObject = JSON.parse(fs.readFileSync(customType, 'utf8'));
      const updateResponse = updateCT(customTypeObject)
      if(updateResponse === "422"){
        insertCT(customTypeObject)
      }
  })
}

async function updateCT(customTypeObject) {

  const URL = `https://customtypes.prismic.io/customtypes/update`

  const options = {
    endpoint: URL,
    method: "POST", //or POST
    headers: {
      "repository": "cimsirp",
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

    console.log("updating CT in remote prismic repo: " + customTypeObject.id + " response: " + data)
    return data
  } catch (error) {
    throw new Error(error)
  }
}

async function insertCT(customTypeObject) {

  const URL = `https://customtypes.prismic.io/customtypes/insert`

  const options = {
    endpoint: URL,
    method: "POST", //or POST
    headers: {
      "repository": "cimsirp",
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

    console.log("inserting CT in remote prismic repo: " + customTypeObject.id + " response: " + data)
    return data
  } catch (error) {
    throw new Error(error)
  }
}
//Local imports
import sendCustomTypes from "./pushcustomtypes.mjs"
import sendSlices from "./pushslices.mjs"
import getAuth from "./login.mjs"
//SM imports
import * as Manifest from "@slicemachine/core/build/node-utils/manifest.js";
import { Client, ApplicationMode} from "@slicemachine/client";

const cwd = "./"

// Get repo from env var
const [REPOSITORY] = [process.env.REPOSITORY];

//getting the auth token
const authToken = await getAuth()

//retrieving manifest sm.json
const { exists, content : manifest } = Manifest.retrieveManifest(cwd)

//initializing the client with what we have for now.
const client = new Client(
  ApplicationMode.PROD,
  REPOSITORY,
  authToken
);

sendSlices(client, cwd, manifest).then(sendCustomTypes(client, cwd))
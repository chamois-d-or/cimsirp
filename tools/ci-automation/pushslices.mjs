import * as Libraries from "@slicemachine/core/build/libraries/index.js";
import { Models } from "@slicemachine/core";

//push slice to s3
async function updateSlicesWithScreenshots(client, acl, components) {
  return Promise.all(components.map(async (component) => {
    const { screenshots, model } = component;
    const variationsUpdated = await Promise.all(model.variations.map(async (variation) => updateVariationWithScreenshot(client, acl, screenshots, model.id, variation)));
    return {
      ...model,
      variations: variationsUpdated
    };
  }));
}

//push screenshot variation
async function updateVariationWithScreenshot(client, acl, screenshots, sliceId, variation) {
  const screenshot = screenshots[variation.id];
  if (!screenshot || !screenshot.path)
    return Promise.resolve(variation);
  return client.uploadScreenshot({
    acl,
    sliceId,
    variationId: variation.id,
    filePath: screenshot.path
  }).then((screenshotUrl) => {
    return {
      ...variation,
      imageUrl: screenshotUrl
    };
  }).catch((error) => {
    writeError$1(`Couldn't upload screenshot slice: ${sliceId} - variation: ${variation.id}`);
    writeError$1(error.message, "Full error:");
    return variation;
  });
}

//push local slices to remote prismic repo
export default async function sendSlices(client, cwd, manifest){
  if (!manifest.libraries) return Promise.resolve(false); // No libraries defined

  const libraries = Libraries.libraries(cwd, manifest.libraries);
  const components = libraries.reduce((acc, lib) => {
    return [...acc, ...lib.components];
  }, []);

  if (components.length === 0) return Promise.resolve(false); // No slices to send found in the libraries

  const remoteSlicesIds = await client
    .getSlices()
    .then((slices) => slices.map((slice) => slice.id));

  console.log("Remote Slices preExisting",remoteSlicesIds)

  const acl= await client
    .createAcl()
    .catch((error) => {
      writeError(
        "Uploading screenshots for your slices failed, please contact us."
      );
      writeError(error.message, "Full error:");
      return null;
    });

  // If the acl failed to be created, don't mind the screenshots.
  const models = acl
    ? await updateSlicesWithScreenshots(client, acl, components)
    : components.map((component) => component.model);

  await Promise.all(
    models.map(async (model) => {
      const slice = Models.Slices.fromSM(model);

      const promise = remoteSlicesIds.includes(slice.id)
        ? client.updateSlice(slice)
        : client.insertSlice(slice);

      return promise.catch((error) => {
        logs.writeError(`Sending slice ${model.id} - ${error.message}`);

        // throwing the error again to stop the Promise.all
        throw error;
      });
    })
  ).catch(() => {
    // the error about the slice that failed to be pushed should be in the terminal already.
    process.exit(1);
  });

  return Promise.resolve(true);
}

//sendSlices(client, cwd, manifest)
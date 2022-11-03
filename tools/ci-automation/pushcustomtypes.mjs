import { CustomTypesPaths } from "@slicemachine/core/build/node-utils/index.js";
import * as Files from "@slicemachine/core/build/node-utils/files.js"
import { CustomType } from "@prismicio/types-internal/lib/customtypes/CustomType.js";
import { isLeft } from "fp-ts/lib/Either.js";

function readLocalCustomTypes(cwd){
  const customTypePaths = CustomTypesPaths(cwd);
  const dir = customTypePaths.value();

  if (Files.default.default.isDirectory(dir) === false) return [];

  const fileNames = Files.default.default.readDirectory(dir);

  const files = fileNames.reduce((acc, fileName) => {
    const filePath = customTypePaths.customType(fileName).model();
    const json = Files.default.default.safeReadJson(filePath);

    if (!json) return acc;

    const file = CustomType.decode(json);

    if (file instanceof Error) {
      logs.writeError(`reading ${filePath}: ${file.message}`);
      return acc;
    }
    if (isLeft(file)) {
      logs.writeError(`validating ${filePath}: ${JSON.stringify(file.left)}`);
      return acc;
    }

    return [...acc, file.right];
  }, []);

  return files;
}

export default async function sendCustomTypes(client, cwd) {
  const localCustomTypes = readLocalCustomTypes(cwd);

  // nothing to push
  if (localCustomTypes.length === 0) return Promise.resolve(false);

  const remoteCustomTypeIds = await client
    .getCustomTypes()
    .then((customTypes) => customTypes.map((customType) => customType.id));

  console.log("Remote Custom Types preExisting",remoteCustomTypeIds)

  await Promise.all(
    localCustomTypes.map(async (customType) => {
      const promise = remoteCustomTypeIds.includes(customType.id)
        ? client.updateCustomType(customType)
        : client.insertCustomType(customType);

      return promise.catch((error) => {
        logs.writeError(
          `Sending custom type ${customType.id} - ${error.message}`
        );

        // throwing the error again to stop the Promise.all
        throw error;
      });
    })
  ).catch(() => {
    // the error about the custom type that failed to be pushed should be in the terminal already.
    process.exit(1);
  });

  return Promise.resolve(true);
}

//sendCustomTypes(client, cwd)
import type { Config } from "prismic-ts-codegen";

const config: Config = {
  repositoryName: "cimsirp",
  output: "./types.generated.ts",

  models: ["./customtypes/**/index.json", "./slices/**/model.json"],

	fields: {
		integrationFields: {
			catalogTypes: {
				"cimsirp--products" : 'import("./types").IntegrationFieldProducts',
				"cimsirp--external_videos" : 'import("./types").IntegrationFieldExternalVideos',
			},
		},
	},
};

export default config;
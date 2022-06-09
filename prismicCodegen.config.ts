import type { Config } from "prismic-ts-codegen";

const config: Config = {
  repositoryName: "cimsirp",
  output: "./types.generated.ts",

  models: ["./customtypes/**/index.json", "./slices/**/model.json"],

	fields: {
		integrationFields: {
			catalogTypes: {
				products: 'import("./types").IntegrationFieldProducts',
				external_videos: 'import("./types").IntegrationFieldProducts',
			},
		},
	},
};

export default config;
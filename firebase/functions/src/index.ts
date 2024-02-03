import ogpDev from "./ogpGenerator/entrypoint.dev"
import ogpProd from "./ogpGenerator/entrypoint.prod"
import eddbDev from "./editDbEndpoint/entrypoint.dev"
import eddbProd from "./editDbEndpoint/entrypoint.prod"

// import * as logger from "firebase-functions/logger";

export const dev_ogp_generator = ogpDev.ogpGenerator
export const ogp_generator = ogpProd.ogpGenerator

export const dev_editdb_endpoint = eddbDev.editDbEndpoint
export const editdb_endpoint = eddbProd.editDbEndpoint

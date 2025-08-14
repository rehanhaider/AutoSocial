import config from "../config.json";

////////////////////////////////////////////////////////////
// CONFIGURATION
////////////////////////////////////////////////////////////

const APP_NAME = config.PROJECT_NAME.trim().replace(/ /g, "");

const ARN_POWERTOOLS_LAYER = "arn:aws:lambda:us-east-1:017000801446:layer:AWSLambdaPowertoolsPythonV3-python312-x86_64:18";

const LOG_LEVEL = "DEBUG";

export const CONSTANTS = {
    APP_NAME,
    LOG_LEVEL,
    ARN_POWERTOOLS_LAYER,
};

export type ConstantsType = typeof CONSTANTS;

export const PARAMS = {
    TABLE_NAME: `/${APP_NAME}/common/table-name`,
    COMMON_LAYER_ARN: `/${APP_NAME}/common/common-layer-arn`,
    USER_POOL_ARN: `/${APP_NAME}/auth/user-pool-arn`,
};

export type ParamsType = typeof PARAMS;

import { App, Tags } from "aws-cdk-lib";
import { ApiStack } from "./src/Api";
import { CommonStack } from "./src/Common";

import { CONSTANTS, PARAMS } from "./constants";

////////////////////////////////////////////////////////////
// STACKS
////////////////////////////////////////////////////////////

const app = new App();
const APP_NAME = CONSTANTS.APP_NAME;

// Stack instantiation
const commonStack = new CommonStack(app, `${APP_NAME}-CommonStack`, {
    constants: CONSTANTS,
    params: PARAMS,
});

const apiStack = new ApiStack(app, `${APP_NAME}-ApiStack`, {
    constants: CONSTANTS,
    params: PARAMS,
});

// Stack dependencies
apiStack.addDependency(commonStack);

// Auto-tagging
Tags.of(app).add("Project", APP_NAME);

app.synth();

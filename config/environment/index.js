'use strict';

const path = require('path');
const _ = require('lodash');

const ip = require("ip");
const dotenv = require('dotenv');
dotenv.config();

const ROOT_PATH = path.resolve(process.cwd());
const LOCAL_HOST = `${ip.address().toString()}`;

const env = dotenv.config().parsed || {};
const { BASE_ENV, NODE_ENV, LOCAL_BACKEND, ...rest } = env;

const envKeys = {
    ...rest,
    BASE_ENV: process.env.BASE_ENV.toString() || BASE_ENV.toString(),
    NODE_ENV: process.env.NODE_ENV.toString() || NODE_ENV.toString(),
    CAPACITOR_ENV: process.env.CAPACITOR_ENV.toString() || CAPACITOR_ENV.toString(),
    LOCAL_BACKEND: LOCAL_BACKEND && LOCAL_BACKEND.toString() || 'localhost',
    BASE_API: LOCAL_BACKEND && LOCAL_BACKEND.toString() || LOCAL_HOST && LOCAL_HOST.toString() || 'localhost',
};

// Default configuration
// ============================================
let globEnv = {
    env: process.env.NODE_ENV,
    envBase: process.env.BASE_ENV,
    version: process.env.APP_VERSION,
    public: process.env.PUBLIC_URL || "/",
    // Root path of server
    root: ROOT_PATH,
    rootFolder: process.env.ROOT_APP_FOLDER || 'src',
    // Server port
    port: process.env.PORT || 3000,
    // Server IP
    ip: process.env.IP || LOCAL_HOST || '0.0.0.0',
};

// Extend and export the config base on NODE_ENV
// ==============================================
const constantFile = require(path.resolve(process.cwd(), 'config', 'environment', `constants.${process.env.BASE_ENV}.js`));
module.exports = _.merge(
    envKeys,
    globEnv,
    constantFile || {}
);

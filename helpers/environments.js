const environments = {};

environments.staging = {
  port: 3000,
  envName: 'staging',
  secretKey: 'hfidjfidjfidkjfidkjfkdjfiksd',
  maxChecks: 5,
};

environments.production = {
  port: 5000,
  envName: 'production',
  secretKey: 'dkfjdijfnudivnbuifheiolfjeijfeijfeij',
  maxChecks: 5,
};

// determine which environment was passed;

const currentEnvironment =
  typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// exports corresponding environment object

const environmentToExport =
  typeof environments[currentEnvironment] === 'object'
    ? environments[currentEnvironment]
    : environments.staging;

// export module

module.exports = environmentToExport;

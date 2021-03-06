const path = require('path');
const fsUtil = require('../util/fs');
const Process = require('../lib/process');
const Network = require('../lib/network');
const File = require('../lib/file');

const mapToActivity = obj => {
  if (obj.operationType === 'process') return new Process(obj.command)
  if (obj.operationType === 'network') return new Network(obj.url, obj.message);
  if (obj.operationType === 'file') {
    return new File(
      path.basename(obj.filename),
      obj.fileAction,
      obj.content,
      path.dirname(obj.filename) === '.' ? undefined : path.dirname(obj.filename),
      obj.ext
    );
  }
  return null;
};

const processConfig = async configPath => {
  const fileConfig = JSON.parse(await fsUtil.readFile(configPath));
  const activities = fileConfig.operations.map(mapToActivity);
  return activities;
};

module.exports = {
  processConfig,
};

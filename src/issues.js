/*
 * This script assumes permissions a GitHub access token available as an environment variable
 */
const https = require('https');
const path = require('path');
const fs = require('fs');
const host = 'api.github.com';
const isProduction = process.env.NODE_ENV === 'production';
const isCI = process.env.NODE_ENV === 'ci';
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const outputFile = 'issues.json';
const tmpDir = path.join(__dirname, '..', 'tmp');
const headers = {
  'Accept': 'application/vnd.github.v3+json',
  'Authorization': `token ${ACCESS_TOKEN}`,
  'User-Agent': 'Contributary.community' // https://developer.github.com/v3/#user-agent-required
};

// expose handler for Lambda
exports.run = run;

if (!isProduction) {
  const mockEvent = {
    queryStringParameters: {
      projectName: 'contributarycommunity',
      repoName: 'www.contributary.community',
      labelFilter: 'good+first+issue'
    }
  };

  run(mockEvent);
}

function writeToFilesystem(response) {
  const filePath = `${tmpDir}/${outputFile}`;

  fs.writeFileSync(`${filePath}`, JSON.stringify(response, null, 2), (err) => {
    if (err) {
      return console.error(err); // eslint-disable-line no-console
    }

    console.log(`File ${filePath} was saved!`); // eslint-disable-line no-console
  });
}

function handleIssuesResponse(response) {
  console.log('handleIssuesResponse.isProduction', isProduction); // eslint-disable-line no-console

  if (isProduction) {
    return {
      statusCode: 200,
      headers: {},
      body: JSON.stringify(response),
      isBase64Encoded: false
    };
  } else if (isCI) {
    return {};
  } else {
    writeToFilesystem(response);
  }
}

// https://developer.github.com/v3/issues/
// application/vnd.github.symmetra-preview+json
function getIssues(projectName, repositoryName, labelFilter) {
  const midFix = `${projectName}/${repositoryName}`;
  const labelFix = labelFilter ? `?labels=${labelFilter}` : '';
  const options = {
    host,
    path: `/repos/${midFix}/issues${labelFix}`,
    headers
  };

  console.log(`GET issues for ${midFix}`); // eslint-disable-line no-console
  console.log('GET options', options); // eslint-disable-line no-console

  return new Promise((resolve, reject) => {
    https.get(options, (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        resolve(JSON.parse(data));
      });

    }).on('error', (err) => {
      reject(err);
    });
  });
}

function run(event = {}) {
  const { projectName, repoName, labelFilter } = event.queryStringParameters;

  return getIssues(projectName, repoName, labelFilter)
    .then(handleIssuesResponse)
    .catch((error) => {
      console.error(error); // eslint-disable-line no-console
    });

}
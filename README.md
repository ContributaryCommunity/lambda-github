# lambda-github
[![GitHub release](https://img.shields.io/github/tag/ContributaryCommunity/lambda-topology.svg)](https://github.com/ContributaryCommunity/lambda-topology/tags)
![CircleCI branch](https://img.shields.io/circleci/project/github/ContributaryCommunity/lambda-topology/master.svg?style=plastic)
[![GitHub issues](https://img.shields.io/github/issues-raw/ContributaryCommunity/lambda-topology.svg)](https://github.com/ContributaryCommunity/lambda-topology/issues)
[![GitHub issues](https://img.shields.io/github/issues-pr-raw/ContributaryCommunity/lambda-topology.svg)](https://github.com/ContributaryCommunity/lambda-topology/issues)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/ContributaryCommunity/lambda-topology/master/LICENSE.md)

## Overview
Lambda for (reverse) proxying GitHub API requests from the frontend for getting live repositories and issues data.

## Workflow
Changes submitted to _src/*.js_ are uploaded manually to the AWS Lambda function console.  Currently there are two Lambdas used
- _issues_ - Fetches issues from the GitHub API for a given project name and repository name
- _repositories_ - Fetches repositories from the GitHub API for a given project name and repository type (_org_ or _user_)

## Development

For contributing to this project and testing the output locally, you will need
1. [NodeJS](https://nodejs.org/) 8.x
1. [Yarn](https://yarnpkg.com) 1.x
1. Create _tmp/_ directory in the root of the project
1. Set envrionment variable for devleopment: `export NODE_ENV=development`
1. Export a [GitHub personal access token](https://blog.github.com/2013-05-16-personal-api-tokens/): `export ACCESS_TOKEN=XXX`

- `yarn lint` - Validatse all JS and JSON passes linting
- `yarn function:issues` - Run _src/issues.js_ and by default output the file in _tmp/_
- `yarn function:repositories` - Run _src/repositories.js_ and by default output the file in _tmp/_

## Release Procedure
1. Merge all changes into master
1. Bump _package.json_, `git tag` and push everything to master
1. Upload the contents of _src/index.js_ to Lambda
1. Create [Release Notes](https://github.com/ContributaryCommunity/lambda-topology/releases) in GitHub
# Mill Dependency Submission

A GitHub action to submit your dependency graph from your
[Mill](https://com-lihaoyi.github.io/mill/mill/Intro_to_Mill.html) build to
GitHub via their [Dependency Submission
API](https://github.blog/2022-06-17-creating-comprehensive-dependency-graph-build-time-detection/).

The main benifits of doing this are:

1. Being able to see your dependency graph on GitHub in your [Insights
   tab](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/exploring-the-dependencies-of-a-repository#viewing-the-dependency-graph).
   For example you can see this
   [here](https://github.com/ckipp01/mill-github-dependency-graph/network/dependencies)
   for this plugin.
2. If enabled, Dependabot can send you
   [alerts](https://docs.github.com/en/code-security/dependabot/dependabot-alerts/viewing-and-updating-dependabot-alerts)
   about security vulnerabilities in your dependencies.

## Requirements

- Make sure in your repo settings the Dependency Graph feature is enabled as
    well as Dependabot Alerts if you'd like them. (Settings -> Code security and
    analysis) 

## Quick Start

Create a workflow with the following:

```yml
name: github-dependency-graph

# The API requires write permission on the repository to submit dependencies
permissions:
  contents: write

on:
  push:
    branches:
      - main

jobs:
  submit-dependency-graph:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: coursier/cache-action@v6
    - uses: actions/setup-java@v3
      with:
        distribution: 'temurin'
        java-version: '17'
    - uses: ckipp01/mill-dependency-submission@v1
```

You can also just run the following command from the root of your workspace
which will create the file for you:

```sh
curl -o .github/workflows/github-dependency-graph.yml --create-dirs https://raw.githubusercontent.com/ckipp01/mill-github-dependency-graph/main/.github/workflows/github-dependency-graph.yml
```

## Inputs

### - `working-directory` (optional)

The relative path of the working directory of your build (where your
.mill-version and build.sc are). This defaults to `.`.

### - `plugin-version` (optional)

Override the default version of
[ckipp01/mill-github-dependency-graph](https://github.com/ckipp01/mill-github-dependency-graph)
plugin that is used internally.

## Troubleshooting

### Unexpected Status: 404

This error happens when the `Dependency Graph` feature is disabled. You can
enable it in `Settings` > `Code Security and Analysis`.

## How this all works

You can see further explanation on the inner workings of the Mill plugin in
[ckipp01/mill-github-dependency-graph](https://github.com/ckipp01/mill-github-dependency-graph).

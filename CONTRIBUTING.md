# Contributing

Thanks for being willing to contribute!

Before getting started make sure the issue or feature you're trying to solve
belongs in this repo and not in
[mill-github-dependency-graph][mill-github-dependency-graph]. This repo is just
the action that wraps around that, but most of the functionality of the actual
plugin is handled there.

## Getting started

After cloning down the project you'll want to ensure you install everything:

```sh
npm install
```

You can run the tests with:

```sh
npm run test
```

## Packaging

Since this is a GitHub action we actually include the dist right in the repo.
This is also checked in CI so you'll want to ensure you do the following before
pushing:

```sh
npm run package
```

As a helper it's helpful to just run the following before pushing to ensure
everything is ready to go:

```sh
npm run all
```

## Releasing

We follow the action versioning outline [here][action-versioning], so when
you're reading to release you'll want to do a few different things:

1. `git tag -a v1.x.x -m "v1.x.x` which will allow users to always pin a
   specific version if they want.
2. `git push origin --tags`
3. Do the release on [GitHub][github-release-page] by updating the draft to the
   new release tag and ensuring it gets published in the
   [marketplace][marketplace].
4. `git tag -fa v1 -m "Update v1 tag to reference v1.x.x"` which updates the
   `v1` or whichever major version tag you're on. This allows users to always
   just specify `v1` in their actions and get the latest.
5. `git push origin v1 --force`

[mill-github-dependency-graph]: https://github.com/ckipp01/mill-github-dependency-graph
[action-versioning]: https://github.com/actions/toolkit/blob/master/docs/action-versioning.md
[github-release-page]: https://github.com/ckipp01/mill-dependency-submission/releases
[marketplace]: https://github.com/marketplace/actions/mill-dependency-submission

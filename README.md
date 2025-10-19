# wboyles.net

## Running Locally

```ps
jekyll serve
```

For most files, Jekyll will automatically detect changes and restart.
However, for changes to certain ignored files, like _config.yml, you'll need to stop and restart Jekyll.

## Deploying

The site should automatically deploy when changes are pushed to the `gh-pages` branch.
A GitHub Actions workflow should run, succeed, and create a green deployment.

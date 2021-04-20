# Information Manipulation Analyzer

This is the frontend of the "Information Manipulation Analyzer" project.

The main idea is to show the volumetry of a hashtag along with some other informations in order to have a better idea of whether or not a hashtag has been artificially improved.

The processor that will actually scrape all the data can be found [here](https://github.com/ambanum/information-manipulation-analyzer-processor)

## Technical stack

We are using now NextJs with a custom [Folder Structure](./decision-records/001-folder-structure.md)
Charts are displayed thanks to the amazing [highcharts](https://www.highcharts.com/)

## Development

**IMPORTANT** main branch is `main` but all PRs must be against `develop`, except for immediate patches

Create a `.env.local` file at the root of the project (You can copy it from `.env.local.example`)

```
NODE_PATH="src"
MONGODB_URI="mongodb://localhost:27017/information-manipulation-analyzer-preproduction?&compressors=zlib&retryWrites=true&w=majority"
```

launch a mongoDb Instance or connect to a distant one

Then launch

```
yarn
yarn dev
```

## Deployment

If you are part of `AmbNum`, you can use the deploy scripts in the `package.json`

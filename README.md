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

### Testing to your local IP address

When building responsive applications, it is very important to be able to test on mobile and other devices in real-time.

Get your local IP

```
ipconfig getifaddr en0
```

Run

```
yarn dev -H YOUR.LOCAL.IP.ADRESS
```

## Deployment

If you are part of `AmbNum`, you can use the deploy scripts in the `package.json`

### Automatic build and deploy from Github

Although the following docs will show you how to deploy from your local machine, a CI process will deploy a new version of the app everytime a tag is created.

So if you want to benefit from this, create a new tag on the `develop` or `main` branch with

```
npm version <patch|minor|major>
```

and it will be deployed either on preprod or prod

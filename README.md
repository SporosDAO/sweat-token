
# Sweat Token

Sweat token help startups create an early stage cap table for sweat equity.

In other words sweat token is the early stage governance token that is gradually and transparently issues based on merits.

# Repo Structure

```ml
 ├─ frontend - "ReactJs Progressive Web App"
 │─ backend - "Nesjs middleware API"
 │─ contracts - "smart contracts"
```

# Progressive Web App

SporosDAO Sweat Token is a Progressive Web App (source in `frontend`) hosted on Netlify.
It uses NestJS backend (`backend` dir) hosted on Heroku and Mongodb Atlas cloud database. Deployment URLs for the app below:

| Purpose | Branch | Live Deployment | Admin Console |
|---------|--------|-----------------|---------------|
| Production | `main` | [live](https://sporosdaoapp-main.netlify.app/) | [admin](https://app.netlify.com/sites/sporosdaoapp-main/overview) |
| Development staging | `dev` | [live](https://sporosdaoapp-dev.netlify.app/) | [admin](https://app.netlify.com/sites/sporosdaoapp-dev/overview) |


## Resources

- [Sweat Token wiki](https://github.com/SporosDAO/sweat-token/wiki)
- [Figma UX design](https://www.figma.com/file/4V3DBa9tF69vo1DWkR3jpB/SweatTokenV2?node-id=0%3A1)
- [Concepts document](https://docs.google.com/document/d/1NA3czMIlXwXscIGnxf-IwOGBfgX03HJEUQWb-YxOybc/edit#heading=h.eqtjaae3omvc)

## Development

The following steps will build and start docker containers and services for `mongodb`, `frontend`, `backend` and `contracts` mounting on the local directory.

1. Build the development environment with `docker-compose build`
1. Update package dependencies with `docker-compose -f docker-compose.yaml -f docker-compose.install.yaml --profile install up --no-deps`
1. Start the development environment with `docker-compose up -d`
1. Check the status of services with `docker-compose ps`. All should be in `running` state. If any service is in `restarting` or `exited` state then something went wrong with the setup.

You can obtain debug logs for each container while developing with
- frontend `docker-compose logs -f frontend`
- backend `docker-compose logs -f backend`
- contracts `docker-compose logs -f contracts`

### Gitpod

In [gitpod](https://gitpod.io/) environment, the same dev setup described above still applies.

For convenience Steps 1 & 2 are configured in [`.gitpod.yaml`](.gitpod.yml) and automatically run on workspace launch.


## Contributing

We welcome your contributions. To provide your code please fork the project and create a PR against the `dev` branch.
Request at least one review from the core team.
`dev` will be merged in `main` branch when we reach a relevant milestone that will be then deployed via the CI/CD pipelines.

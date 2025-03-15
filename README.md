# CloudFare Page Sign In Form For Next.js application using D1 and Prisma

Start with installing all dependencies with

```shell
	pnpm i
```

Create your CloudFare Page with:

`wrangler pages project create cloudfare-d1-nextauth-prisma`

Create your database in CloudFare:

`npx wrangler d1 create cloudfare-d1-nextauth-prisma`

Copy and paste the ID from the logs and update `wranger.json`:


```json
{
	"d1_databases": [
		{
			"binding": "DB",
			"database_name": "cloudfare-d1-nextauth-prisma",
			"database_id": "PASTE IT HERE"
		}
	]
}
```

Create table in your D1 local database with:

`npx wrangler d1 execute prisma-demo-db --file=prisma/schema.sql --local`

Create table in your D1 remote database with:

`npx wrangler d1 execute prisma-demo-db --file=prisma/schema.sql --remote`

And populate it with the demo user.

Locally:

```shell
npx wrangler d1 execute prisma-demo-db --command "INSERT INTO  \"User\" (\"email\", \"name\") VALUES
('jane@prisma.io', 'Jane Doe (Local)');" --local
```

Remote:

```shell
npx wrangler d1 execute prisma-demo-db --command "INSERT INTO  \"User\" (\"email\", \"name\") VALUES
('jane@prisma.io', 'Jane Doe (Local)');" --remote
```

Generate Prisma Client with:

`pnpm run generate`

## Configure your NextAuth

### Local setup

Add in your .dev.vars file in the root of the project

```.dotenv
NEXTJS_ENV=development
AUTH_TRUST_HOST=true
AUTH_SECRET=YOUR_SECRET_HERE
```

### CloudFare


```shell
npx wrangler secret put AUTH_TRUST_HOST
```
Type `true`

```shell
npx wrangler secret put AUTH_SECRET
```
Type your secret

First your can test it locally with:

`pnpm run dev` or `pnpm run preview`


And then on CloudFare Pages:

`pnpm run deploy`




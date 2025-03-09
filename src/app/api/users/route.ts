import { getRequestContext } from "@cloudflare/next-on-pages";
import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

export const runtime = "edge";

export async function GET() {
	const c = getRequestContext();

	const adapter = new PrismaD1(c.env.DB);
	const prisma = new PrismaClient({ adapter });

	const users = await prisma.user.findMany();
	const result = JSON.stringify(users);
	return new Response(result);
}

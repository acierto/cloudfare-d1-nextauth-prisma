import type { User } from "next-auth";
import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient } from "@prisma/client";
import { getRequestContext } from "@cloudflare/next-on-pages";

const authResult = async () => {
	return NextAuth({
		session: {
			strategy: "jwt",
		},

		pages: {
			signIn: "/login",
		},
		providers: [
			CredentialProvider({
				// ** The name to display on the sign in form (e.g. 'Sign in with...')
				// ** For more details on Credentials Provider, visit https://next-auth.js.org/providers/credentials
				name: "Credentials",
				type: "credentials",

				/*
				 * As we are using our own Sign-in page, we do not need to change
				 * username or password attributes manually in following credentials object.
				 */
				credentials: {},
				async authorize(credentials) {
					/*
					 * You need to provide your own logic here that takes the credentials submitted and returns either
					 * an object representing a user or value that is false/null if the credentials are invalid.
					 * For e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
					 * You can also use the `req` object to obtain additional parameters (i.e., the request IP address)
					 */
					const { email } = credentials as {
						email: string;
						password: string;
					};

					const c = getRequestContext();
					const adapter = new PrismaD1(c.env.DB);
					const prisma = new PrismaClient({ adapter });

					const user = await prisma.user.findUnique({
						where: {
							email,
						},
					});

					if (user) {
						return {
							id: String(user.id),
							email: user.email,
							name: user.name,
						} as User;
					}

					return null;
				},
			}),
		],
	});
};

export const { handlers, signIn, signOut, auth } = await authResult();

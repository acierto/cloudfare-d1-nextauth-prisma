import { auth, signIn, signOut } from "./auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { redirect } from "next/navigation";

export const runtime = "edge";

export default async function Home({
	searchParams,
}: {
	searchParams: { [_: string]: string | string[] | undefined };
}) {
	const session = await auth();

	return (
		<main className="flex items-center justify-center min-h-screen bg-background">
			<Card className="w-full max-w-md">
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl font-bold text-center">
						{session ? "User Profile" : "Login"}
					</CardTitle>
					<CardDescription className="text-center">
						{session ? "Manage your account" : "Welcome to the demo"}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{session ? (
						<div className="space-y-4">
							<div className="flex items-center space-x-4">
								<Avatar>
									<AvatarImage
										src={session.user?.image || ""}
										alt={session.user?.name || ""}
									/>
									<AvatarFallback>
										{session.user?.name?.[0] || "U"}
									</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-medium">
										{session.user?.name || "No name set"}
									</p>
									<p className="text-sm text-muted-foreground">
										{session.user?.email}
									</p>
								</div>
							</div>
						</div>
					) : (
						<form
							action={async (formData) => {
								"use server";
								let redirectPath: string = "/";

								try {
									await signIn("credentials", {
										email: formData.get("email") as string,
										redirect: false,
									});
									// eslint-disable-next-line @typescript-eslint/no-unused-vars
								} catch (_err) {
									redirectPath = "/?error=incorrect-login";
								} finally {
									redirect(redirectPath);
								}
							}}
							className="space-y-4"
						>
							<div className="space-y-2">
								<Input
									type="email"
									name="email"
									placeholder="Email"
									autoCapitalize="none"
									autoComplete="email"
									autoCorrect="off"
									required
								/>
							</div>
							{searchParams["error"] === "incorrect-login" && (
								<div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400">
									Incorrect credentials
								</div>
							)}
							<Button className="w-full cursor-pointer" type="submit">
								Sign in
							</Button>
						</form>
					)}
				</CardContent>
				{session && (
					<CardFooter>
						<form
							action={async () => {
								"use server";
								await signOut();
								Response.redirect("/");
							}}
						>
							<Button type="submit" variant="outline" className="w-full">
								Sign out
							</Button>
						</form>
					</CardFooter>
				)}
			</Card>
		</main>
	);
}

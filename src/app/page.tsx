import { auth, signIn, signOut } from "./auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cookies } from "next/headers";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const runtime = "edge";

export default async function Home() {
	const session = await auth();
	const cookieStore = await cookies();
	const error = cookieStore.get("error");

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
								try {
									await signIn("credentials", {
										email: formData.get("email") as string,
									});
								} catch (error) {
									if (error?.hasOwnProperty("digest")) {
										cookies().delete("error");
										throw error;
									}
									cookies().set("error", "Invalid Login");
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
							{error && (
								<div
									id="toast-danger"
									className="flex items-center w-full text-gray-500 bg-white rounded-lg shadow-sm dark:text-gray-400 dark:bg-gray-800"
									role="alert"
								>
									<div className="inline-flex items-center justify-center shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
										<svg
											className="w-5 h-5"
											aria-hidden="true"
											xmlns="http://www.w3.org/2000/svg"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
										</svg>
										<span className="sr-only">Error icon</span>
									</div>
									<div className="ms-3 text-sm font-normal">{error.value}</div>
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
							}}
						>
							<Button
								type="submit"
								variant="outline"
								className="w-full cursor-pointer"
							>
								Sign out
							</Button>
						</form>
					</CardFooter>
				)}
			</Card>
		</main>
	);
}

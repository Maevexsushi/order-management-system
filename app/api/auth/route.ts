import { promises as fs } from "fs";
import path from "path";

const usersFilePath = path.join(process.cwd(), "data", "users.json");

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return Response.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  const data = await fs.readFile(usersFilePath, "utf-8");
  const users = JSON.parse(data);

  const user = users.find(
    (u: { email: string; password: string }) =>
      u.email === email && u.password === password
  );

  if (!user) {
    return Response.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const { password: _, ...safeUser } = user;
  return Response.json(safeUser);
}

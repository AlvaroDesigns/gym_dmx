import { NextResponse, NextRequest } from "next/server";
import { hash } from "bcrypt";
import { prisma } from "@/lib/prisma";

// TODO: MOVERLO A UTILS
const filterBooleanValue = (array: any, key: string | number) => {
  return array
    .map((user: any) => user[key] === array[key as keyof object])
    .every((email: any) => email === true);
};

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const users = await prisma.user.findMany();

    const userFound = filterBooleanValue(users, "email");

    if (userFound) {
      return NextResponse.json(
        {
          message: "Email already exists",
        },
        {
          status: 400,
        }
      );
    }

    const usernameFound = filterBooleanValue(users, "name");

    if (usernameFound) {
      return NextResponse.json(
        {
          message: "Name already exists",
        },
        {
          status: 400,
        }
      );
    }

    const hashedPassword = await hash(data.password, 10);
    console.log("contransea", hashedPassword);
    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    const { password: _, ...user } = newUser;

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      {
        message: error?.message,
      },
      {
        status: 500,
      }
    );
  }
}

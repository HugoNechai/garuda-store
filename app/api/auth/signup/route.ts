import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // check existing user
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    // 👉 если пользователь уже есть — просто возвращаем его
    if (existing) {
      return NextResponse.json({
        success: true,
        userId: existing.id,
      });
    }

    // hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    return NextResponse.json({
      success: true,
      userId: user.id,
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("LeetCode API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch LeetCode data" },
      { status: 500 }
    );
  }
}

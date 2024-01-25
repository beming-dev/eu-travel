import fs from "fs";
import { NextRequest } from "next/server";
import path from "path";

export async function GET(request: NextRequest) {
  const country = request.nextUrl.searchParams.get("country");
  if (!country) return new Response("error");

  const imagesDir = path.join(process.cwd(), "public", country);
  const imageNames = fs.readdirSync(imagesDir);
  // 이미지 파일들의 절대 경로를 배열로 만듦
  const imagePaths = imageNames.map((imageName) =>
    path.join(country, imageName)
  );

  return Response.json({ imagePaths });
}

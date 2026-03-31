import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/gallery/readme
 * GitHub URL에서 README.md를 가져와 첫 번째 이미지 URL과 YouTube URL을 추출
 */
export async function POST(request: NextRequest) {
  const { githubUrl } = await request.json();

  if (!githubUrl?.trim()) {
    return NextResponse.json(
      { success: false, message: "GitHub URL이 필요합니다." },
      { status: 400 },
    );
  }

  const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) {
    return NextResponse.json(
      { success: false, message: "올바른 GitHub URL이 아닙니다." },
      { status: 400 },
    );
  }

  const owner = match[1];
  const repo = match[2].replace(/\.git$/, "");

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: "README를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const data = await res.json();
    const content = Buffer.from(data.content, "base64").toString("utf-8");
    const defaultBranch = data.url.includes("/main/") ? "main" : "main";

    // 첫 번째 이미지 URL 추출
    const imageUrl = extractFirstImage(content, owner, repo, defaultBranch);

    // 첫 번째 YouTube URL 추출
    const videoUrl = extractFirstYouTube(content);

    return NextResponse.json({
      success: true,
      imageUrl,
      videoUrl,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "GitHub API 요청에 실패했습니다." },
      { status: 500 },
    );
  }
}

function extractFirstImage(
  markdown: string,
  owner: string,
  repo: string,
  branch: string,
): string | null {
  // ![alt](url) 패턴
  const mdPattern = /!\[[^\]]*\]\(([^)]+)\)/;
  // <img src="url"> 패턴
  const htmlPattern = /<img[^>]+src=["']([^"']+)["']/;

  const mdMatch = markdown.match(mdPattern);
  const htmlMatch = markdown.match(htmlPattern);

  // 먼저 나오는 것을 선택
  let url: string | null = null;
  const mdIndex = mdMatch?.index ?? Infinity;
  const htmlIndex = htmlMatch?.index ?? Infinity;

  if (mdIndex < htmlIndex && mdMatch) {
    url = mdMatch[1];
  } else if (htmlMatch) {
    url = htmlMatch[1];
  }

  if (!url) return null;

  // 뱃지/쉴드 이미지 건너뛰기
  if (url.includes("shields.io") || url.includes("badge")) {
    // 뱃지 이후의 이미지를 다시 검색
    const remaining = markdown.slice(Math.min(mdIndex, htmlIndex) + 1);
    return extractFirstImage(remaining, owner, repo, branch);
  }

  // 상대 경로면 raw URL로 변환
  if (!url.startsWith("http")) {
    url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${url.replace(/^\.?\//, "")}`;
  }

  return url;
}

function extractFirstYouTube(markdown: string): string | null {
  const patterns = [
    // 일반 YouTube URL
    /https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    // 단축 URL
    /https?:\/\/youtu\.be\/([a-zA-Z0-9_-]{11})/,
    // 임베드 URL
    /https?:\/\/(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = markdown.match(pattern);
    if (match) {
      return `https://www.youtube.com/watch?v=${match[1]}`;
    }
  }

  return null;
}

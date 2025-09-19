// src/components/logo/LogoKRBadge.tsx
type Props = {
  size?: number;                 // 원 지름(px)
  fill?: string;                 // 원 색
  textColor?: string;            // 글자 색
  text?: string;                 // 표시 텍스트 (예: "K-beauty")
  fontFamily?: string;           // 폰트
  fontWeight?: number | string;  // 600~800 추천
  dy?: number;                   // 세로 미세 이동(px)
};

export default function LogoKRBadge({
  size = 36,
  fill = "#82DC28",
  textColor = "#111827",
  text = "K-beauty",
  fontFamily = `"Noto Sans KR", system-ui, -apple-system, sans-serif`,
  fontWeight = 700,
  dy = -2,
}: Props) {
  // 1) 기본 폰트 크기(원 지름 기반)
  const base = size * 0.44;

  // 2) 글자 폭 대략 추정해서 자동 축소 (라틴 0.6em, 한글 1.0em 근사)
  const hasKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(text);
  const perChar = hasKorean ? 1.0 : 0.6;                 // 문자당 폭(em) 근사
  const padding = 0.84;                                  // 원 안 여유율(0.84~0.88)
  const maxWidth = 100 * padding;                        // viewBox 기준
  const estWidthEm = text.length * perChar;
  const fitScale = Math.min(1, maxWidth / (estWidthEm * base));
  const fontSize = Math.round(base * fitScale);

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={text}>
      <circle cx="50" cy="50" r="50" fill={fill} />
      <text
        x="50"
        y={50 + dy}
        fill={textColor}
        fontSize={fontSize}
        fontWeight={fontWeight}
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontFamily, letterSpacing: hasKorean ? "-0.3px" : "0" }}
      >
        {text}
      </text>
    </svg>
  );
}

import { useI18n } from "../lib/i18n";

export default function LanguageSwitch() {
  const { lang, setLang } = useI18n();
  return (
    <select
      className="chip"
      value={lang}
      onChange={(e) => setLang(e.target.value as any)}
      title="Language"
    >
      <option value="ko">한국어</option>
      <option value="en">English</option>
      <option value="ja">日本語</option>
      <option value="zh">中文</option>
    </select>
  );
}

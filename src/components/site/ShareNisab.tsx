import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = { countryName: string; goldText: string; silverText: string; url: string };

export function ShareNisab({ countryName, goldText, silverText, url }: Props) {
  const [copied, setCopied] = useState(false);
  const date = new Date().toLocaleDateString("ar-EG", { day: "numeric", month: "long", year: "numeric" });
  const text = `نصاب الزكاة في ${countryName} اليوم (${date}):\n• الذهب ٨٥غ عيار ٢٤: ${goldText}\n• الفضة ٥٩٥غ: ${silverText}\nأرقام استرشادية وليست فتوى — نِصاب`;
  const enc = encodeURIComponent;
  const links = [
    { name: "واتساب", href: `https://wa.me/?text=${enc(`${text}\n${url}`)}` },
    { name: "X", href: `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}` },
    { name: "فيسبوك", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}&quote=${enc(text)}` },
    { name: "تيليجرام", href: `https://t.me/share/url?url=${enc(url)}&text=${enc(text)}` },
    { name: "لينكدإن", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
  ];

  const copy = async () => {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const native = async () => {
    if (navigator.share) await navigator.share({ title: `نصاب الزكاة في ${countryName}`, text, url }).catch(() => {});
    else await copy();
  };

  return (
    <section className="card-surface mt-4 p-4 sm:p-6" aria-labelledby="share-title">
      <h2 id="share-title" className="flex items-center gap-2 text-xl text-foreground">
        <Share2 aria-hidden="true" className="size-5 text-primary" /> شارك نصاب اليوم
      </h2>
      <p className="mt-2 whitespace-pre-line rounded-lg bg-muted p-3 text-sm text-muted-foreground">{text}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {links.map((l) => (
          <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer"
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground hover:bg-muted">
            {l.name}
          </a>
        ))}
        <Button variant="outline" size="sm" className="h-auto py-2" onClick={copy}>
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />} {copied ? "تم النسخ" : "نسخ النص"}
        </Button>
        <Button size="sm" className="h-auto py-2" onClick={native}>
          <Share2 className="size-4" /> مشاركة
        </Button>
      </div>
    </section>
  );
}

import Link from 'next/link'
import type { ReactNode } from 'react'

/**
 * Rendu du markdown produit par le CMS — porté de Carrosserie-pro.
 *
 * Le vocabulaire couvert est exactement celui que la génération produit :
 * intertitres, listes, tableaux, liens internes, gras. Les nœuds sont
 * construits en React, jamais par `dangerouslySetInnerHTML` : le contenu
 * vient d'un modèle de langage, il n'a pas à pouvoir injecter du HTML.
 */

function inline(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = []
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g
  let last = 0
  let match: RegExpExecArray | null
  let i = 0

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) out.push(text.slice(last, match.index))
    const [, anchor, href, bold] = match
    if (bold) {
      out.push(
        <strong key={`${keyPrefix}-b${i}`} className="font-semibold text-ink">
          {bold}
        </strong>,
      )
    } else if (href.startsWith('/')) {
      out.push(
        <Link
          key={`${keyPrefix}-l${i}`}
          href={href}
          className="font-medium text-primary-700 underline underline-offset-4 hover:text-ink"
        >
          {anchor}
        </Link>,
      )
    } else {
      out.push(
        <a
          key={`${keyPrefix}-a${i}`}
          href={href}
          rel="noopener noreferrer nofollow"
          target="_blank"
          className="font-medium text-primary-700 underline underline-offset-4"
        >
          {anchor}
        </a>,
      )
    }
    last = match.index + match[0].length
    i++
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

const isTableRow = (line: string) => line.startsWith('|') && line.endsWith('|')
const isTableRule = (line: string) => /^\|[\s:|-]+\|$/.test(line)
const cellsOf = (line: string) =>
  line
    .slice(1, -1)
    .split('|')
    .map((c) => c.trim())

export function Markdown({ content }: { content: string }) {
  // Chaque ligne de titre est isolée, où qu'elle se trouve dans le bloc.
  const blocks: string[] = []
  for (const brut of content.split(/\n{2,}/)) {
    let courant: string[] = []
    for (const ligne of brut.split('\n')) {
      if (/^[ \t]*#{2,6}[ \t]+/.test(ligne)) {
        if (courant.join('\n').trim()) blocks.push(courant.join('\n').trim())
        blocks.push(ligne.trim())
        courant = []
      } else {
        courant.push(ligne)
      }
    }
    if (courant.join('\n').trim()) blocks.push(courant.join('\n').trim())
  }

  return (
    <div className="mt-6 space-y-5 text-[1.05rem] leading-relaxed text-ink-soft">
      {blocks.map((block, bi) => {
        const lines = block
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean)
        const key = `b${bi}`

        const heading = block.match(/^(#{2,6})[ \t]+(.*)$/)
        if (heading && lines.length === 1) {
          return (
            <h3 key={key} className="pt-4 font-display text-xl text-ink">
              {inline(heading[2], key)}
            </h3>
          )
        }

        if (lines.length >= 2 && lines.every(isTableRow)) {
          const rows = lines.filter((l) => !isTableRule(l)).map(cellsOf)
          const [head, ...body] = rows
          return (
            <div key={key} className="-mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0">
              <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-ink/15">
                    {head.map((c, ci) => (
                      <th key={ci} className="py-3 pr-4 font-semibold text-ink">
                        {inline(c, `${key}-h${ci}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {body.map((row, ri) => (
                    <tr key={ri} className="border-b border-ink/10">
                      {row.map((c, ci) => (
                        <td key={ci} className="py-3 pr-4 align-top">
                          {inline(c, `${key}-${ri}-${ci}`)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }

        if (lines.every((l) => /^\d+[.)]\s+/.test(l))) {
          return (
            <ol key={key} className="ml-5 list-decimal space-y-2 marker:text-primary-700">
              {lines.map((l, li) => (
                <li key={li} className="pl-1">
                  {inline(l.replace(/^\d+[.)]\s+/, ''), `${key}-${li}`)}
                </li>
              ))}
            </ol>
          )
        }

        if (lines.every((l) => /^[-*+]\s+/.test(l))) {
          return (
            <ul key={key} className="ml-5 list-disc space-y-2 marker:text-primary-700">
              {lines.map((l, li) => (
                <li key={li} className="pl-1">
                  {inline(l.replace(/^[-*+]\s+/, ''), `${key}-${li}`)}
                </li>
              ))}
            </ul>
          )
        }

        return (
          <p key={key} className="whitespace-pre-line">
            {inline(block, key)}
          </p>
        )
      })}
    </div>
  )
}

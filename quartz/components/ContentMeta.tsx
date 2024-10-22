import { formatDate, getDate } from "./Date"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { JSX } from "preact"
import style from "./styles/contentMeta.scss"

// This file controls the metadata displayed at the top of each note.

interface ContentMetaOptions {
  /**
   * Whether to display reading time
   */
  showReadingTime: boolean
  showComma: boolean
}

const defaultOptions: ContentMetaOptions = {
  showReadingTime: false,
  showComma: true,
}

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: (string | JSX.Element)[] = []
      const subtitles: (string | JSX.Element)[] = []

      if (fileData.dates && fileData.slug !== "index") {
        // segments.push(formatDate(getDate(cfg, fileData)!, cfg.locale))
        segments.push("planted " + formatDate(fileData.dates.created))
        segments.push("last edited " + formatDate(fileData.dates.modified))
      }

      // Display reading time if enabled
      if (options.showReadingTime && fileData.slug !== "index") {
        const { minutes, words: _words } = readingTime(text)
        const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        })
        segments.push(displayedTime)
      }

      // Display subtitles
      if (fileData.frontmatter?.subtitle) {
        // const uppercaseSubtitle = fileData.frontmatter.subtitle.toUpperCase();
        subtitles.push(
          // `${uppercaseSubtitle}`
          `${fileData.frontmatter.subtitle}`
        )
      }

      const segmentsElements = segments.map((segment) => <span>{segment}</span>)

      return (
        <div class={classNames(displayClass, "content-meta")}>
        <p show-comma={options.showComma} class={classNames(displayClass, "content-meta")}>
          {segmentsElements}
        </p>
        {subtitles.length > 0 && (
          <p style={{ margin: '0', padding: '0', fontStyle:'italic' }}  class={classNames(displayClass, "content-meta")}>
            or, {subtitles}
          </p>
        )}
        </div>
      )
    } else {
      return null
    }
  }

  ContentMetadata.css = style

  return ContentMetadata
}) satisfies QuartzComponentConstructor

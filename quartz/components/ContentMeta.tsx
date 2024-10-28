import { format as formatDateFn, formatISO } from "date-fns"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import readingTime from "reading-time"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import { JSX } from "preact"
import style from "./styles/contentMeta.scss"

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

const TimeMeta = ({ value }: { value: Date }) => (
  <time dateTime={formatISO(value)} title={formatDateFn(value, "ccc w")}>
    {formatDateFn(value, "MMM. do yyyy")}
  </time>
)

export default ((opts?: Partial<ContentMetaOptions>) => {
  // Merge options with defaults
  const options: ContentMetaOptions = { ...defaultOptions, ...opts }

  function ContentMetadata({ cfg, fileData, displayClass }: QuartzComponentProps) {
    const text = fileData.text

    if (text) {
      const segments: JSX.Element[] = []
      const subtitles: (string | JSX.Element)[] = []

      if (fileData.dates && fileData.slug !== "index") { // don't show on index.md
        if (fileData.dates.created) {
          segments.push(
            <span>
              created <TimeMeta value={fileData.dates.created} />
            </span>,
          )
        }

        if (fileData.dates.modified) {
          segments.push(
            <span>
              last edited <TimeMeta value={fileData.dates.modified} />
            </span>,
          )
        }

        if (fileData.frontmatter?.subtitle) {
          // const uppercaseSubtitle = fileData.frontmatter.subtitle.toUpperCase();
          subtitles.push(
            // `${uppercaseSubtitle}`
            `${fileData.frontmatter.subtitle}`
          )
        }
      }

      // Display reading time if enabled
      if (options.showReadingTime) {
        const { minutes, words: _words } = readingTime(text)
        const displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
          minutes: Math.ceil(minutes),
        })
        segments.push(<span>⏲ {displayedTime}</span>)
      }

      // link to commit history
      // segments.push(
      //   <a
      //     href={`https://github.com/pupperpowell/quartz-website/commits/master/${fileData.filePath}`}
      //     target="_blank"
      //   >
      //     history
      //   </a>,
      // )

      return (
        <div  show-comma={options.showComma} class={classNames(displayClass, "content-meta")}>
          {segments}
          {subtitles.length > 0 && (
          <p style={{ margin: '0', padding: '0', fontStyle:'italic' }}  class={classNames(displayClass, "content-meta")}>
            Or, {subtitles}
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
import '../styles/globals.css'

import Link from 'next/link'
import { PrismicProvider } from '@prismicio/react'
import { PrismicPreview } from '@prismicio/next'
import { repositoryName } from '../prismicio'

const normalizeHref = (href = "", { anchor } = {}) => {
  if (/^https?:\/\/#/.test(href)) {
    if (anchor) {
      // The explicit anchor always takes priority.
      return `#${anchor}`;
    } else {
      return href.slice(href.indexOf("#"));
    }
  }

  if (anchor) {
    // Append the anchor to the given href.
    return `${href}#${anchor}`;
  }

  return href;
};

const NextLinkShim = ({ href, anchor, locale, children, ...props }) => {
  return (
    <Link href={normalizeHref(href, { anchor })} locale={locale}>
      <a {...props}>{children}</a>
    </Link>
  );
};

const AnchorShim = ({ href, anchor, children, ...props }) => {
  return (
    <a href={normalizeHref(href, { anchor })} {...props}>
      {children}
    </a>
  );
};

const richTextComponents = {
  list: ({ children, key }) => (
    <ul className="list-inside list-disc" key={key}>
      {children}
    </ul>
  ),
};

export default function App({ Component, pageProps }) {
  return (
    <PrismicProvider
      richTextComponents={richTextComponents}
      //linkResolver={linkResolver}
      internalLinkComponent={NextLinkShim}
      externalLinkComponent={AnchorShim}
    >
      <PrismicPreview repositoryName={repositoryName}>
        <Component {...pageProps} />
      </PrismicPreview>
    </PrismicProvider>
  )
}
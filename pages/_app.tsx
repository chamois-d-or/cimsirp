import '../styles/globals.css'

import { PrismicProvider, PrismicLink, JSXMapSerializer } from '@prismicio/react'
import { PrismicPreview } from '@prismicio/next'
import { repositoryName } from '../prismicio'
import { AppProps } from 'next/app';

const richTextComponents : JSXMapSerializer = {
  list: ({ children, key }) => (
    <ul className="list-inside list-disc" key={key}>
      {children}
    </ul>
  ),
  label: ({node, text, key}) => {
    if (node.data.label === "footnote") {
      return (
        <a href={"#"+text} key={key} className={node.data.label}>
          <sup>
            {text}
          </sup>
        </a>);
    }
  },
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PrismicProvider
      richTextComponents={richTextComponents}
      //linkResolver={linkResolver}
    >
      <PrismicPreview repositoryName={repositoryName}>
        <Component {...pageProps} />
      </PrismicPreview>
    </PrismicProvider>
  )
}
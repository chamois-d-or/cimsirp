import '../styles/globals.css'

import { PrismicProvider, PrismicLink } from '@prismicio/react'
import { PrismicPreview } from '@prismicio/next'
import { repositoryName } from '../prismicio'

const richTextComponents = {
  list: ({ children, key }) => (
    <ul className="list-inside list-disc" key={key}>
      {children}
    </ul>
  ),
  label: ({node, children, text, key}) => {
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

export default function App({ Component, pageProps }) {
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
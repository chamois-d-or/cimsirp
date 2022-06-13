import React from 'react'
import { PrismicRichText } from '@prismicio/react'
import { ContentSectionCenteredImageSlice } from '../../../types.generated'

const ContentSectionCenteredImage = ({ slice }:{slice:ContentSectionCenteredImageSlice}) => (
  <section>
    <div className="mt-6 prose prose-indigo prose-lg text-gray-500 mx-auto">
      <figure>
        <img
          className="w-full rounded-lg"
          src={slice.primary.image.url!}
          alt={slice.primary.image.alt!}
          width={1310}
          height={873}
        />
        <figcaption><PrismicRichText field={slice.primary.description} /></figcaption>
      </figure>
    </div>
  </section>
)

export default ContentSectionCenteredImage
import React from 'react'
import { PrismicRichText } from '@prismicio/react'
import { FaqSideBySideSlice } from '../../../types.generated'

const FaqSideBySide = ({ slice } : {slice : FaqSideBySideSlice}) => (
  <section className="relative mt-6 prose prose-indigo prose-lg text-gray-500 mx-auto">
    <div className="max-w-7xl mx-auto py-12 px-4 divide-y divide-gray-200 sm:px-6 lg:py-16 lg:px-8">
      <h2 className="text-3xl font-extrabold text-gray-900"><PrismicRichText field={slice.primary.title} /></h2>
      <div className="mt-8">
        <dl className="divide-y divide-gray-200">
          { slice?.items?.map((item, i) =>
            <div id={(i+1).toString()} key={i+1} className="pt-6 pb-8 md:grid md:grid-cols-12 md:gap-8">
              <dt className="text-base font-medium text-gray-900 md:col-span-5"><PrismicRichText field={item.question} /></dt>
              <dd className="mt-2 md:mt-0 md:col-span-7">
                <p className="text-base text-gray-500"><PrismicRichText field={item.answer} /></p>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  </section>
)

export default FaqSideBySide
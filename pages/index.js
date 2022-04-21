import { SliceZone } from "@prismicio/react"
import { createClient } from '../prismicio'

import { components as ecommerceComponents } from '../slices/ecommerce/index'
import { components as marketingComponents } from '../slices/marketing/index'
import { components as navigationComponents } from '../slices/navigation/index'

// Menu graphQuery
import { menuGraphQuery, productListGraphQuery } from '../tools/graphQueries'
import Layout from "../components/Layout"

const __allComponents = {  ...ecommerceComponents, ...marketingComponents, ...navigationComponents }

export default function Home({doc, menu, footer, locale, locales}) {
  return (
    <div>
      <Layout menu={menu} footer={footer} title={doc.data.meta_title} currentLocale={locale} locales={locales} alt_versions={doc.alternate_languages}>
        <SliceZone slices={doc.data.slices} components={__allComponents} />
      </Layout>
    </div>
  )
}

export async function getStaticProps({previewData, locale, locales}) {
  const client = createClient( previewData )

  //Querying page
  const document = (await client.getSingle('home-page', { lang: locale }).catch(e => {
    return null
  }));
  if (!document) {
    return {
      notFound: true,
    }
  }

  //Querying linked product data through GraphQuery
  const productListData = (await client.getSingle("home-page",  {lang: locale, 'graphQuery': productListGraphQuery }).catch(e => {
    return {}
  }));

  //Incorporating new slices with linked product data in existing slice array
  let index=0
  const docWithProductLists = {
    ...document,
    data : {
      ...document.data,
      slices: document?.data?.slices?.map(slice => {
        if(slice.slice_type === "product_list_with_cta"){
          index ++
          return {
            ...productListData?.data?.slices[index-1]
          }
        }
        return {
          ...slice
        }
      })
    }
  }

  //Querying the Menu here so that it can be previewed at the same time as the page (in a release)
  const menu = (await client.getSingle("menu",  {lang: locale, 'graphQuery': menuGraphQuery }).catch(e => {
    return {}
  }));

  //Querying the Footer here so that it can be previewed at the same time as the page (in a release)
  const footer = (await client.getSingle("footer",  {lang: locale }).catch(e => {
    return {}
  }));

  return {
    props:{
      doc: docWithProductLists,
      menu: menu,
      locale: locale,
      locales: locales,
      footer: footer,
    }, // will be passed to the page component as props
  }
}
//Import Prismic configuration
import { createClient } from '../../prismicio'

// Import Slicezone, Layout and Loader components
import { SliceZone } from "@prismicio/react"
import Layout from "../../components/Layout"
import ProductLayout from '../../components/ProductLayout'
import Loader from '../../components/Loader'

// Import Slices components
import { components as ecommerceComponents } from '../../slices/ecommerce/index'
import { components as marketingComponents } from '../../slices/marketing/index'
import { components as navigationComponents } from '../../slices/navigation/index'
const __allComponents = {  ...ecommerceComponents, ...marketingComponents, ...navigationComponents }

// Menu graphQuery
import { menuGraphQuery, productListProductPageGraphQuery } from '../../tools/graphQueries'

// Prismic Helpers
import * as prismicH from '@prismicio/helpers'

// NextJS router to manage fallback loader
import { useRouter } from 'next/router'

export default function ProductPage({doc, menu, footer, locale, locales}) {
  const router = useRouter()
  if (router.isFallback) {
    return <Loader />
  }
  return (
    <div>
      <Layout menu={menu} footer={footer} title={doc.data.meta_title} currentLocale={locale} locales={locales} alt_versions={doc.alternate_languages}>
        <ProductLayout productData={doc.data} />
        <SliceZone slices={doc.data.slices} components={__allComponents} />
      </Layout>
    </div>
  )
}

//Get page content including menu and footer
export async function getStaticProps({params, previewData, locale, locales}) {
  const client = createClient( previewData )

  //querying page
  const document = (await client.getByUID('product-page',params.uid ,{ lang: locale }).catch(e => {
    return null
  }));
  //returning a 404 if page does not exist
  if (!document) {
    return {
      notFound: true,
    }
  }

  //Querying linked product data through GraphQuery
  const productListData = (await client.getByUID("product-page",params.uid ,{lang: locale, 'graphQuery': productListProductPageGraphQuery }).catch(e => {
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

//Define Paths
export async function getStaticPaths() {
  const client = createClient()
  const documents = await client.getAllByType('product-page',{ lang: '*' })

  return {
    paths: documents.map((doc) => prismicH.asLink(doc)),
    fallback: true,
  }
}
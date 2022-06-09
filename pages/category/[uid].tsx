//Import Prismic configuration
import { createClient } from '../../prismicio'

// Import Slicezone, Layout and Loader components
import { SliceZone } from "@prismicio/react"
import Layout from "../../components/Layout"
import CategoryLayout from '../../components/CategoryLayout'
import Loader from '../../components/Loader'

// Import Slices components
import { components as ecommerceComponents } from '../../slices/ecommerce/index'
import { components as marketingComponents } from '../../slices/marketing/index'
import { components as navigationComponents } from '../../slices/navigation/index'
const __allComponents = {  ...ecommerceComponents, ...marketingComponents, ...navigationComponents }

// Menu graphQuery
import { menuGraphQuery, categoryPageGraphQuery } from '../../tools/graphQueries'

// Prismic Helpers
import * as prismicH from '@prismicio/helpers'

// NextJS router to manage fallback loader
import { useRouter } from 'next/router'
import { CategoryPageDocument, MenuDocument, FooterDocument, ProductPageDocument } from '../../types.generated'
import { GetStaticProps } from 'next'
import { MenuDocumentWithLinkedMenuTabs } from '..'

export type ContentRelationshipWithProductPageDocument = {
  product : ProductPageDocument
}

type CategoryPageDocumentWithLinkedProducts = CategoryPageDocument & {
  data:{
    products : ContentRelationshipWithProductPageDocument[]
  }
}

type Props = {
  doc: CategoryPageDocumentWithLinkedProducts,
  menu: MenuDocumentWithLinkedMenuTabs,
  locale: string | undefined,
  locales: string[] | undefined,
  footer: FooterDocument,
};


export default function CategoryPage({doc, menu, footer, locale, locales}:Props) {
  const router = useRouter()
  if (router.isFallback) {
    return <Loader />
  }
  return (
    <div>
      <Layout menu={menu} footer={footer} title={doc.data.meta_title} currentLocale={locale} locales={locales} alt_versions={doc.alternate_languages}>
        <CategoryLayout products={doc.data.products} title={doc.data.meta_title}/>
        <SliceZone slices={doc.data.slices} components={__allComponents} />
      </Layout>
    </div>
  )
}

//Get page content including menu and footer
export const getStaticProps : GetStaticProps = async({params, previewData, locale, locales}) => {
  const client = createClient( previewData )

  //checking uid is a string
  if (typeof params?.uid !== "string") {
    return {
      notFound: true,
    }
  }

  //querying page
  const document = (await client.getByUID<CategoryPageDocument>('category-page',params.uid ,{ lang: locale, 'graphQuery': categoryPageGraphQuery  }).catch(e => {
    return null
  }));
  //returning a 404 if page does not exist
  if (!document) {
    return {
      notFound: true,
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
      doc: document,
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
  const documents = await client.getAllByType('category-page',{ lang: '*' })

  return {
    paths: documents.map((doc) => prismicH.asLink(doc)),
    fallback: true,
  }
}
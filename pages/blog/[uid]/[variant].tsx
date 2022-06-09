//Import Prismic configuration
import { createClient } from '../../../prismicio'

// Import Slicezone, Layout and Loader components
import { SliceZone } from "@prismicio/react"
import Layout from "../../../components/Layout"
import BlogLayout from '../../../components/BlogLayout'
import Loader from '../../../components/Loader'

// Import Slices components
import { components as ecommerceComponents } from '../../../slices/ecommerce/index'
import { components as marketingComponents } from '../../../slices/marketing/index'
import { components as navigationComponents } from '../../../slices/navigation/index'
const __allComponents = {  ...ecommerceComponents, ...marketingComponents, ...navigationComponents }

// Menu graphQuery
import { menuGraphQuery, AbTestingBlogPageGraphQuery } from '../../../tools/graphQueries'

// Prismic Helpers
import * as prismicH from '@prismicio/helpers'

// NextJS router to manage fallback loader
import { useRouter } from 'next/router'
import { BlogPageDocument, BlogPageDocumentDataVariantsItem, FooterDocument } from '../../../types.generated'
import { MenuDocumentWithLinkedMenuTabs } from '../..'
import { GetStaticProps } from 'next'

type Props = {
  doc: BlogPageDocument,
  menu: MenuDocumentWithLinkedMenuTabs,
  locale: string | undefined,
  locales: string[] | undefined,
  footer: FooterDocument,
};

export default function BlogPage({doc, menu, footer, locale, locales} : Props) {
  const router = useRouter()
  if (router.isFallback) {
    return <Loader />
  }
  return (
    <div>
      <Layout menu={menu} footer={footer} title={doc.data?.meta_title} currentLocale={locale} locales={locales} alt_versions={doc.alternate_languages}>
        <BlogLayout data={doc.data}>
          <SliceZone slices={doc.data?.slices} components={__allComponents} />
        </BlogLayout>
      </Layout>
    </div>
  )
}

//Get page content including menu and footer
export const getStaticProps : GetStaticProps = async({params, previewData, locale, locales}) =>{
  const client = createClient( previewData )

  //checking uid is a string
  if (typeof params?.uid !== "string") {
    return {
      notFound: true,
    }
  }

  //querying page
  const document = (await client.getByUID<BlogPageDocument>('blog-page',params.uid ,{ lang: locale, 'graphQuery': AbTestingBlogPageGraphQuery }).catch(e => {
    return null
  }));
  //returning a 404 if page does not exist
  if (!document) {
    return {
      notFound: true,
    }
  }
  const variantDocument = document.data.variants.filter((item)=> item.bucket === params.variant)[0]?.variant

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
      doc: variantDocument? variantDocument : document,
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
  const documents = await client.getAllByType<BlogPageDocument>('blog-page',{ lang: '*' })
  const mainDocuments = documents.filter((doc)=> !doc.data.isVariant)
  const variantDocuments : Array<BlogPageDocument & BlogPageDocumentDataVariantsItem> = []
  mainDocuments.forEach((doc) =>{
    if(doc.data.variants.length >0){
        const variantsLinks = doc.data.variants.filter(variant => variant.variant)
        variantsLinks.forEach(variantLink => variantDocuments.push({...doc , ...variantLink}))
    }
  })

  return {
    paths: variantDocuments.map((variant) => prismicH.asLink(variant)+'/'+variant.bucket),
    fallback: true,
  }
}
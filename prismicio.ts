import * as prismic from '@prismicio/client'
import { LinkResolverFunction } from '@prismicio/helpers'
import { enableAutoPreviews } from '@prismicio/next'
import { FilledLinkToDocumentField } from '@prismicio/types'
import { NextApiRequest, PreviewData } from 'next/types'
import sm from './sm.json'

export const endpoint = process.env.API_ENDPOINT ? process.env.API_ENDPOINT : sm.apiEndpoint
export const repositoryName = prismic.getRepositoryName(endpoint)

//Update the Link Resolver to match your project's route structure
export const linkResolver :LinkResolverFunction = (doc: FilledLinkToDocumentField) => {
  switch (doc.type) {
    case 'home-page':
      return `/`
    case 'page':
      return `/${doc.uid}`
    case 'blog-page':
      return `/blog/${doc.uid}`
    case 'product-page':
      return `/product/${doc.uid}`
      case 'category-page':
        return `/category/${doc.uid}`
    default:
      return '/'
  }
}

type ConfigProps={
  previewData?: PreviewData,
  req?: NextApiRequest
}

// This factory function allows smooth preview setup
export function createClient(config : ConfigProps = {}) {
  const client = prismic.createClient(endpoint, {
    ...config,
    routes: routeResolver.routes
  })

  enableAutoPreviews({
    client,
    previewData: config.previewData,
    req: config.req,
  })

  return client
}

//Route resolver to match your project's route structure

export const routeResolver = {
  routes: [
    {
      "type":"page",
      "path":"/:lang/:uid"
    },
    {
      "type":"product-page",
      "path":"/:lang/product/:uid"
    },
    {
      "type":"category-page",
      "path":"/:lang/category/:uid"
    },
    {
      "type":"blog-page",
      "path":"/:lang/blog/:uid"
    },
    // {
    //   "type":"uniform-page",
    //   "path":"/uniform/:uid"
    // },
    {
      "type":"home-page",
      "path":"/:lang"
    },],
};
import { createClient } from '../../prismicio'
import { setPreviewData, redirectToPreviewURL } from '@prismicio/next'
import { NextApiRequest, NextApiResponse } from 'next/types'

export default async (req : NextApiRequest, res : NextApiResponse) => {
  const client = createClient({ req })
  await setPreviewData({ req, res })
  await redirectToPreviewURL({ req, res, client })
}
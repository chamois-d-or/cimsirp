import { createClient } from '../../prismicio'
import { setPreviewData, redirectToPreviewURL } from '@prismicio/next'
import { NextApiRequest, NextApiResponse } from 'next/types'

const previewManagement =  async (req : NextApiRequest, res : NextApiResponse) => {
  const client = createClient({ req })
  await setPreviewData({ req, res })
  await redirectToPreviewURL({ req, res, client })
}

export default previewManagement
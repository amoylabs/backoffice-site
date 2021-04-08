import { NextApiRequest, NextApiResponse } from 'next'

export default async (_req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader('Content-Type', 'application/xml')
    res.status(200).send("")
}

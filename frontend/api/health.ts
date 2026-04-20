export default function handler(_req: any, res: any): void {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(200).send({ status: 'healthy' });
}

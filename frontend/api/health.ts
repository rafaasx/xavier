const payload = { status: 'healthy' };

export default function handler(_req: any, res?: any): any {
  if (res) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.status(200).send(payload);
    return;
  }

  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

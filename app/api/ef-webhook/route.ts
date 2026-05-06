export const POST = async (request: Request) => {
  const body = await request.json();
  console.log(body);
  return new Response("OK");
};

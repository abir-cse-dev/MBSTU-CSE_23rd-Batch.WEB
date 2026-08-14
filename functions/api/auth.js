// functions/api/auth.js

export async function onRequestPost(context) {
  try {
    const { password } = await context.request.json();

    // Verify against Cloudflare environment variable
    if (password && password === context.env.ADMIN_PASSWORD) {
      return Response.json({ success: true });
    } else {
      return new Response(JSON.stringify({ error: "Invalid password" }), {
        status: 401,
      });
    }
  } catch (err) {
    return new Response(JSON.stringify({ error: "Bad request" }), {
      status: 400,
    });
  }
}

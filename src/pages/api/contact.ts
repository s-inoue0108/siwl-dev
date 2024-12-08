export const prerender = false;

import type { APIContext, APIRoute } from "astro";

export const POST: APIRoute = async ({ request }: APIContext) => {
  const { name, email, content, recaptchaToken } = await request.json();

  const recaptchaRequestBody = new URLSearchParams({
    secret: import.meta.env.GOOGLE_RECAPTCHA_SECRET_KEY,
    response: recaptchaToken
  });

  // recaptcha APIへのリクエスト
  const recaptchaResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: recaptchaRequestBody.toString()
  });

  const recaptchaResponseData = await recaptchaResponse.json();

  if (recaptchaResponseData.success) {
    // reCAPTCHA 検証成功
    const response = await fetch(import.meta.env.GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        content,
      }),
    });

    const responseData = await response.json();

    if (responseData.error) {
      return new Response(JSON.stringify(responseData), { status: 400 });
    }

    return new Response(JSON.stringify(responseData), {
      headers: {
        "Content-Type": "application/json"
      },
      status: 200
    });
  }

  // reCAPTCHA 検証失敗
  return new Response(null, { status: 400 });
}
const DEMO_SECRET_KEY = "1x0000000000000000000000000000000AA";

export interface TurnstileVerificationResult {
  success: boolean;
  error?: string;
}

export async function verifyTurnstileToken(
  token: string | null | undefined,
  remoteIp?: string,
): Promise<TurnstileVerificationResult> {
  // If token is missing, fail verification
  if (!token) {
    return {
      success: false,
      error: "Turnstile verification token is missing.",
    };
  }

  const secretKey =
    process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY ||
    process.env.TURNSTILE_SECRET_KEY ||
    DEMO_SECRET_KEY;

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secretKey);
    formData.append("response", token);
    if (remoteIp) {
      formData.append("remoteip", remoteIp);
    }

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    const data = await response.json();

    if (data.success) {
      return { success: true };
    }

    return {
      success: false,
      error:
        data["error-codes"]?.join(", ") ||
        "Turnstile verification failed. Please try again.",
    };
  } catch (err) {
    console.error("Error verifying Turnstile token:", err);
    return {
      success: false,
      error: "An unexpected error occurred during bot verification.",
    };
  }
}

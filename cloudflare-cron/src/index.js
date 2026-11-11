/**
 * SNOW BASE: Cloudflare Worker Hourly Cron Trigger
 * GitHub Actions の update_snow_data.yml を毎時15分に確実に起動させる高精度スケジューラー
 */

export default {
  // 定時実行 (Cron Trigger)
  async scheduled(event, env, ctx) {
    console.log(`[SNOW BASE CRON] Scheduled trigger fired at: ${new Date().toISOString()}`);
    await triggerGitHubWorkflow(env);
  },

  // HTTPリクエスト (手動テスト・死活監視用)
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/trigger") {
      const result = await triggerGitHubWorkflow(env);
      return new Response(JSON.stringify(result, null, 2), {
        status: result.success ? 200 : 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(
      "❄️ SNOW BASE Hourly Cron Worker is ACTIVE.\nEndpoint /trigger is available for manual test.",
      { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );
  }
};

async function triggerGitHubWorkflow(env) {
  const token = env.GITHUB_PAT;
  if (!token) {
    console.error("[SNOW BASE CRON] GITHUB_PAT secret is missing!");
    return { success: false, error: "GITHUB_PAT secret not configured" };
  }

  const endpoint = "https://api.github.com/repos/dmmiea/snow-base/actions/workflows/update_snow_data.yml/dispatches";
  
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Cloudflare-Worker-SnowBase-Cron"
      },
      body: JSON.stringify({ ref: "main" })
    });

    if (response.status === 204) {
      console.log("[SNOW BASE CRON] Successfully dispatched GitHub Actions workflow!");
      return { success: true, status: 204, message: "GitHub Actions workflow dispatched successfully" };
    } else {
      const errorText = await response.text();
      console.error(`[SNOW BASE CRON] GitHub API error: ${response.status} - ${errorText}`);
      return { success: false, status: response.status, error: errorText };
    }
  } catch (err) {
    console.error(`[SNOW BASE CRON] Network error: ${err.message}`);
    return { success: false, error: err.message };
  }
}

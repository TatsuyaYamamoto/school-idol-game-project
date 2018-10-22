import { APP_SERVER_BASE_URL, URL } from "../Constants";

export function goTo(href: string): void {
  window.location.href = href;
}

export function tweetGameResult(text: string): void {
  window.location.href = `${
    URL.TWITTER_TWEET_PAGE
  }?hashtags=やみどり+%23そこんところ工房&text=${text}&url=${URL.YAMIDORI}`;
}

export function postPlayLog(point: number): Promise<Response> {
  return fetch(`${APP_SERVER_BASE_URL}scores/yamidori/playlog/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ point })
  });
}

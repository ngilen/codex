import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, writeFileSync, rmSync, mkdirSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

/** Verify that OPENAI_COOKIE env var overrides config value */
describe("cookie env precedence", () => {
  const ORIGINAL_HOME = process.env["HOME"];
  const ORIGINAL_COOKIE = process.env["OPENAI_COOKIE"];

  let tempHome: string;

  beforeEach(() => {
    tempHome = mkdtempSync(join(tmpdir(), "codex-cookie-"));
    process.env["HOME"] = tempHome;
    delete process.env["OPENAI_COOKIE"];

    const cfgDir = join(tempHome, ".codex");
    mkdirSync(cfgDir);
    writeFileSync(
      join(cfgDir, "config.json"),
      JSON.stringify({
        providers: {
          openai: {
            name: "OpenAI",
            baseURL: "https://api.openai.com/v1",
            envKey: "OPENAI_API_KEY",
            cookie: "file-cookie",
          },
        },
      }),
    );
  });

  afterEach(() => {
    rmSync(tempHome, { recursive: true, force: true });
    if (ORIGINAL_HOME !== undefined) {
      process.env["HOME"] = ORIGINAL_HOME;
    } else {
      delete process.env["HOME"];
    }
    if (ORIGINAL_COOKIE !== undefined) {
      process.env["OPENAI_COOKIE"] = ORIGINAL_COOKIE;
    } else {
      delete process.env["OPENAI_COOKIE"];
    }
  });

  it("uses OPENAI_COOKIE env var when set", async () => {
    process.env["OPENAI_COOKIE"] = "env-cookie";
    const { getCookie } = await import("../src/utils/config.js");
    expect(getCookie("openai")).toBe("env-cookie");
  });
});

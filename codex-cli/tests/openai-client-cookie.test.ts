import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createOpenAIClient } from "../src/utils/openai-client.js";

const ORIGINAL_COOKIE = process.env["OPENAI_COOKIE"];

describe("openai client cookie header", () => {
  beforeEach(() => {
    process.env["OPENAI_COOKIE"] = "test-cookie";
    process.env["OPENAI_API_KEY"] = "sk-test";
  });

  afterEach(() => {
    if (ORIGINAL_COOKIE === undefined) {
      delete process.env["OPENAI_COOKIE"];
    } else {
      process.env["OPENAI_COOKIE"] = ORIGINAL_COOKIE;
    }
    delete process.env["OPENAI_API_KEY"];
  });

  it("includes Cookie header when cookie is set", () => {
    const client = createOpenAIClient({ provider: "openai" });
    const headers = (client as any)._options.defaultHeaders as Record<string, string>;
    expect(headers["Cookie"]).toBe("test-cookie");
  });
});

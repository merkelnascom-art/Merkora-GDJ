import { describe, expect, it } from "vitest";
import { validateMcpHttpRequest } from "./http-validation";

function headers(values: Record<string, string> = {}) {
  return new Headers({
    "content-type": "application/json",
    accept: "application/json, text/event-stream",
    ...values,
  });
}

describe("validateMcpHttpRequest", () => {
  it("accepts initialize without a protocol-version header", () => {
    expect(validateMcpHttpRequest(headers(), "initialize")).toEqual({ ok: true });
  });

  it("requires both supported response media types", () => {
    expect(validateMcpHttpRequest(headers({ accept: "application/json" }), "ping")).toMatchObject({ ok: false, status: 406 });
  });

  it("rejects non-JSON request bodies", () => {
    expect(validateMcpHttpRequest(headers({ "content-type": "text/plain" }), "initialize")).toMatchObject({ ok: false, status: 415 });
  });

  it("requires the negotiated protocol version after initialization", () => {
    expect(validateMcpHttpRequest(headers(), "tools/list")).toMatchObject({ ok: false, status: 400 });
    expect(validateMcpHttpRequest(headers({ "mcp-protocol-version": "2025-11-25" }), "tools/list")).toEqual({ ok: true });
  });
});

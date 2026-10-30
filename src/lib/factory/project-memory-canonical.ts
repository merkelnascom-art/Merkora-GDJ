/**
 * Produces stable JSON for project-memory payloads before they are hashed or
 * compared. Only JSON-safe data is accepted; ambiguous values fail closed.
 */
export function canonicalizeProjectMemoryPayload(value: unknown): string {
  const ancestors = new WeakSet<object>();

  function serialize(current: unknown): string {
    if (current === null) return "null";

    if (typeof current === "string" || typeof current === "boolean") {
      return JSON.stringify(current);
    }

    if (typeof current === "number") {
      if (!Number.isFinite(current)) {
        throw new TypeError("Project memory payload requires a finite number.");
      }
      return JSON.stringify(current);
    }

    if (typeof current !== "object") {
      throw new TypeError("Project memory payload contains an unsupported value.");
    }

    if (ancestors.has(current)) {
      throw new TypeError("Project memory payload contains a cyclic reference.");
    }

    ancestors.add(current);
    try {
      if (Array.isArray(current)) {
        const ownKeys = Reflect.ownKeys(current);
        if (ownKeys.some((key) => typeof key === "symbol"
          || (key !== "length" && !/^(0|[1-9]\\d*)$/.test(key)))) {
          throw new TypeError("Project memory arrays must not contain custom properties.");
        }

        const values: string[] = [];
        for (let index = 0; index < current.length; index += 1) {
          if (!Object.prototype.hasOwnProperty.call(current, index)) {
            throw new TypeError("Project memory arrays must not contain sparse entries.");
          }
          const descriptor = Object.getOwnPropertyDescriptor(current, String(index));
          if (!descriptor || !("value" in descriptor) || !descriptor.enumerable) {
            throw new TypeError("Project memory arrays must contain plain data values.");
          }
          values.push(serialize(descriptor.value));
        }
        return `[${values.join(",")}]`;
      }

      const prototype = Object.getPrototypeOf(current);
      if (prototype !== Object.prototype && prototype !== null) {
        throw new TypeError("Project memory payload objects must be plain objects.");
      }

      const ownKeys = Reflect.ownKeys(current);
      if (ownKeys.some((key) => typeof key === "symbol")) {
        throw new TypeError("Project memory payload objects must use string keys.");
      }

      const entries = (ownKeys as string[]).map((key) => {
        const descriptor = Object.getOwnPropertyDescriptor(current, key);
        if (!descriptor || !("value" in descriptor) || !descriptor.enumerable) {
          throw new TypeError("Project memory payload objects must contain enumerable data properties.");
        }
        return [key, descriptor.value] as const;
      }).sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0);

      return `{${entries.map(([key, entryValue]) =>
        `${JSON.stringify(key)}:${serialize(entryValue)}`,
      ).join(",")}}`;
    } finally {
      ancestors.delete(current);
    }
  }

  return serialize(value);
}

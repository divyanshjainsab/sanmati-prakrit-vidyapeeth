type PathSegment = string;

function clone<T>(value: T): T {
  if (Array.isArray(value)) return [...value] as unknown as T;
  if (value && typeof value === "object") return { ...value } as T;
  return value;
}

function isIndex(segment: PathSegment): boolean {
  return /^\d+$/.test(segment);
}

export function setIn<T>(obj: T, path: PathSegment[], value: unknown): T {
  if (path.length === 0) return value as T;

  const [head, ...rest] = path;
  const cloned = clone(obj) as Record<string, unknown>;
  const key = isIndex(head) ? head : head;

  cloned[key] = rest.length === 0 ? value : setIn(cloned[key], rest, value);
  return cloned as T;
}

export function pushIn<T>(obj: T, path: PathSegment[], item: unknown): T {
  const current = (path.length === 0 ? obj : getIn(obj, path)) as unknown[] | undefined;
  const nextArray = current ? [...current, item] : [item];
  return path.length === 0 ? (nextArray as unknown as T) : setIn(obj, path, nextArray);
}

export function removeIn<T>(obj: T, path: PathSegment[], index: number): T {
  const current = (path.length === 0 ? obj : getIn(obj, path)) as unknown[] | undefined;
  const nextArray = (current ?? []).filter((_, i) => i !== index);
  return path.length === 0 ? (nextArray as unknown as T) : setIn(obj, path, nextArray);
}

export function getIn(obj: unknown, path: PathSegment[]): unknown {
  return path.reduce<unknown>((acc, key) => {
    if (acc == null) return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

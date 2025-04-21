// Interface para o contexto do Cloudflare
export interface CloudflareContext {
  env: {
    DB: D1Database;
    LAUDOS_BUCKET: R2Bucket;
  };
}

// Interface para o banco de dados D1
interface D1Database {
  prepare: (query: string) => D1PreparedStatement;
  batch: (statements: D1PreparedStatement[]) => Promise<D1Result[]>;
  exec: (query: string) => Promise<D1Result>;
}

// Interface para statements preparados
interface D1PreparedStatement {
  bind: (...values: any[]) => D1PreparedStatement;
  first: <T = any>(column?: string) => Promise<T>;
  run: <T = any>() => Promise<D1Result<T>>;
  all: <T = any>() => Promise<D1Result<T>>;
}

// Interface para resultados do D1
interface D1Result<T = any> {
  results?: T[];
  success: boolean;
  meta?: any;
  error?: string;
}

// Interface para o bucket R2
interface R2Bucket {
  put: (key: string, value: ReadableStream | ArrayBuffer | Uint8Array | string) => Promise<R2Object>;
  get: (key: string) => Promise<R2Object | null>;
  delete: (key: string) => Promise<void>;
  list: (options?: { prefix?: string; limit?: number; cursor?: string }) => Promise<R2Objects>;
}

// Interface para objetos R2
interface R2Object {
  key: string;
  version: string;
  size: number;
  etag: string;
  httpEtag: string;
  uploaded: Date;
  body: ReadableStream;
  bodyUsed: boolean;
  arrayBuffer: () => Promise<ArrayBuffer>;
  text: () => Promise<string>;
  json: <T>() => Promise<T>;
}

// Interface para lista de objetos R2
interface R2Objects {
  objects: R2Object[];
  truncated: boolean;
  cursor?: string;
}

// Função para obter o contexto do Cloudflare
export function getCloudflareContext(): CloudflareContext {
  // Esta função seria normalmente preenchida pelo runtime do Cloudflare
  // Para desenvolvimento local, criamos um mock
  return {
    env: {
      DB: globalThis.DB as D1Database,
      LAUDOS_BUCKET: globalThis.LAUDOS_BUCKET as R2Bucket
    }
  };
}

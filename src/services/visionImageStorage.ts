import type { StoredVisionImage } from "../types";

const DATABASE_NAME = "Organized_Week-db";
const DATABASE_VERSION = 1;
const STORE_NAME = "vision-board-images";

function requestToPromise<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("Error de IndexedDB."));
  });
}

function transactionToPromise(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () =>
      reject(transaction.error ?? new Error("Error de transacción IndexedDB."));
    transaction.onabort = () =>
      reject(transaction.error ?? new Error("Transacción IndexedDB cancelada."));
  });
}

export function openVisionImageDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(request.error ?? new Error("No se pudo abrir IndexedDB."));
  });
}

export async function saveVisionImage(image: StoredVisionImage): Promise<void> {
  const database = await openVisionImageDatabase();
  try {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put(image);
    await transactionToPromise(transaction);
  } finally {
    database.close();
  }
}

export async function getVisionImage(
  id: string,
): Promise<StoredVisionImage | undefined> {
  const database = await openVisionImageDatabase();
  try {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const result = await requestToPromise(transaction.objectStore(STORE_NAME).get(id));
    await transactionToPromise(transaction);
    return result;
  } finally {
    database.close();
  }
}

export async function deleteVisionImage(id: string): Promise<void> {
  const database = await openVisionImageDatabase();
  try {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).delete(id);
    await transactionToPromise(transaction);
  } finally {
    database.close();
  }
}

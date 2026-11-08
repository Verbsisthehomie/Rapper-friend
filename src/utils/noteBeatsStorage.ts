/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * IndexedDB storage engine for user-uploaded beats attached to lyrical notes.
 * Keeps audio blobs out of localStorage to prevent QuotaExceededError.
 */

const DB_NAME = 'rapper_friend_note_beats_db';
const STORE_NAME = 'note_beats';
const DB_VERSION = 1;

export interface StoredNoteBeat {
  id: string;
  name: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  duration: number; // in seconds
  producer?: string;
  bpm?: number;
  audioBlob?: Blob;
  createdAt: number;
}

// In-memory cache for generated object URLs so audio doesn't re-instantiate repeatedly
const blobUrlCache = new Map<string, string>();

function openNoteBeatsDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Saves a user-uploaded beat attached to a note into IndexedDB.
 */
export async function saveNoteBeat(
  beatId: string,
  metadata: {
    name: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    duration: number;
    producer?: string;
    bpm?: number;
  },
  audioBlob: Blob
): Promise<void> {
  try {
    const db = await openNoteBeatsDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const record: StoredNoteBeat = {
        id: beatId,
        ...metadata,
        audioBlob,
        createdAt: Date.now(),
      };
      const req = store.put(record);
      req.onsuccess = () => {
        // Cache object URL immediately
        const existing = blobUrlCache.get(beatId);
        if (existing) {
          try { URL.revokeObjectURL(existing); } catch {}
        }
        blobUrlCache.set(beatId, URL.createObjectURL(audioBlob));
        resolve();
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to save note beat in IndexedDB:', err);
  }
}

/**
 * Retrieves a note beat record with its audio blob.
 */
export async function getNoteBeat(beatId: string): Promise<StoredNoteBeat | null> {
  // Built-in special case for Alph Tha Alien Intro track
  if (beatId === 'beat-alph-intro') {
    return {
      id: 'beat-alph-intro',
      name: 'Intro (Prod. Alph Tha Alien)',
      fileName: '10_Intro_9cb887a1.mp3',
      fileSize: 3460300,
      mimeType: 'audio/mpeg',
      duration: 191,
      producer: 'Alph Tha Alien',
      bpm: 92,
      createdAt: Date.now() - 3600000,
    };
  }

  try {
    const db = await openNoteBeatsDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(beatId);
      req.onsuccess = () => {
        resolve((req.result as StoredNoteBeat) || null);
      };
      req.onerror = () => resolve(null);
    });
  } catch (err) {
    console.warn('Failed to get note beat from IndexedDB:', err);
    return null;
  }
}

/**
 * Returns a playable audio URL (either direct asset path or cached Object URL).
 */
export async function getNoteBeatBlobUrl(beatId: string, fallbackUrl?: string): Promise<string | null> {
  if (fallbackUrl && (fallbackUrl.startsWith('http') || fallbackUrl.startsWith('/'))) {
    return fallbackUrl;
  }

  if (beatId === 'beat-alph-intro') {
    return '/assets/aistudio/10_Intro_9cb887a1.mp3';
  }

  if (blobUrlCache.has(beatId)) {
    return blobUrlCache.get(beatId)!;
  }

  const record = await getNoteBeat(beatId);
  if (record && record.audioBlob) {
    const url = URL.createObjectURL(record.audioBlob);
    blobUrlCache.set(beatId, url);
    return url;
  }

  return fallbackUrl || null;
}

/**
 * Deletes a note beat from IndexedDB.
 */
export async function deleteNoteBeat(beatId: string): Promise<void> {
  const cached = blobUrlCache.get(beatId);
  if (cached) {
    try { URL.revokeObjectURL(cached); } catch {}
    blobUrlCache.delete(beatId);
  }

  try {
    const db = await openNoteBeatsDatabase();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(beatId);
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    });
  } catch (err) {
    console.warn('Failed to delete note beat from IndexedDB:', err);
  }
}

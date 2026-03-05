/**
 * Vita Moda — Google Apps Script
 * 
 * Legge le foto dalla cartella Google Drive "Vita Moda Outfit"
 * e restituisce un JSON con gli URL delle immagini, ordinate
 * dalla più recente alla più vecchia.
 * 
 * SETUP:
 *   1. Crea una cartella su Google Drive (es. "Vita Moda Outfit")
 *   2. Copia l'ID della cartella dall'URL
 *   3. Incollalo qui sotto in FOLDER_ID
 *   4. Deploy → Nuova distribuzione → App web → Accesso: "Chiunque"
 *   5. Copia l'URL generato e incollalo in script.js del sito
 * 
 * USO PER VITA:
 *   - Apri Google Drive dal telefono
 *   - Trascina/carica le foto nella cartella
 *   - Il sito si aggiorna automaticamente!
 *   - Per rimuovere una foto, eliminala dalla cartella
 */

// ============================================================
// CONFIGURAZIONE — Sostituisci con l'ID della tua cartella Drive
// ============================================================
const FOLDER_ID = '12KsJZ-ef7kuHWOt7TzhC6aRu-OrtOzIT';

// ============================================================
// FUNZIONE PRINCIPALE
// ============================================================

/**
 * Gestisce le richieste GET alla Web App.
 * Restituisce un JSON con le foto ordinate per data (più recenti prima).
 */
function doGet(e) {
  try {
    const data = getOutfitPhotos();

    return ContentService
      .createTextOutput(JSON.stringify(data))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        error: error.message,
        photos: []
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Legge tutte le foto dalla cartella Drive.
 * Le ordina per data di creazione (più recenti prima).
 */
function getOutfitPhotos() {
  const folder = DriveApp.getFolderById(FOLDER_ID);
  const files = folder.getFiles();
  const photos = [];
  const imageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  while (files.hasNext()) {
    const file = files.next();
    const mimeType = file.getMimeType();

    // Processa solo file immagine
    if (!imageTypes.includes(mimeType)) continue;

    const fileId = file.getId();

    // Rendi il file accessibile tramite link
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (e) {
      Logger.log('Impossibile condividere: ' + file.getName() + ' - ' + e.message);
    }

    photos.push({
      url: 'https://drive.google.com/thumbnail?id=' + fileId + '&sz=w800',
      urlHigh: 'https://drive.google.com/thumbnail?id=' + fileId + '&sz=w1200',
      date: file.getDateCreated().toISOString(),
      fileId: fileId
    });
  }

  // Ordina per data di creazione (più recenti prima)
  photos.sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    lastUpdated: new Date().toISOString(),
    totalPhotos: photos.length,
    photos: photos
  };
}

// ============================================================
// FUNZIONI DI TEST
// ============================================================

/**
 * Esegui questa funzione dall'editor per testare.
 */
function testGetOutfitPhotos() {
  const data = getOutfitPhotos();
  Logger.log(JSON.stringify(data, null, 2));
  Logger.log('\n=== RIEPILOGO ===');
  Logger.log('Foto trovate: ' + data.totalPhotos);
  data.photos.forEach((p, i) => {
    Logger.log('  ' + (i + 1) + '. ' + p.url.substring(0, 60) + '...');
  });
}

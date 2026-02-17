import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';
import { Logo } from '../../assets/images';
import { Stop, Tour } from './db';

interface TourPDFProps {
  appName: string;
  appLogoBase64?: string;
  tour: Tour;
  stops: Stop[];
}

/**
 * Convierte un asset local (require) a base64 usando la API moderna de Expo
 */
async function getImageBase64(moduleAsset: any): Promise<string> {
  const asset = Asset.fromModule(moduleAsset);
  await asset.downloadAsync();

  if (!asset.localUri) {
    throw new Error('No se pudo obtener la URI del asset');
  }

  const file = new File(asset.localUri);
  const base64 = await file.base64();
  return base64;
}

/**
 * Genera el HTML del PDF
 */
function buildHTML({ appName, appLogoBase64, tour, stops }: TourPDFProps): string {
  const date = new Date().toLocaleDateString();

  const stopsHtml = stops
    .map(
      (stop, index) => `
      <div class="stop">
        ${
          stop.image_url
            ? `<img src="${stop.image_url}" class="stop-image" />`
            : ''
        }
        <div class="stop-content">
          <div class="stop-title">${index + 1}. ${stop.title}</div>
          <div class="stop-description">${stop.description || ''}</div>
        </div>
      </div>`
    )
    .join('');

  return `
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: Arial, sans-serif; margin:0; padding:0; color:#333; }
        .header { display:flex; justify-content:space-between; align-items:center; padding:20px 30px; border-bottom:2px solid #e5e5e5; }
        .app-info { display:flex; align-items:center; gap:12px; }
        .app-logo { width:50px; height:50px; }
        .app-name { font-size:20px; font-weight:bold; }
        .tour-cover { text-align:center; padding:40px 30px 20px 30px; }
        .tour-image { width:85%; max-height:260px; object-fit:cover; border-radius:10px; margin-bottom:20px; }
        .tour-title { font-size:28px; font-weight:bold; }
        .stops-section { padding:20px 30px 40px 30px; }
        .section-title { font-size:18px; font-weight:bold; margin-bottom:20px; border-bottom:1px solid #ddd; padding-bottom:6px; }
        .stop { display:flex; gap:15px; margin-bottom:25px; padding-bottom:15px; border-bottom:1px solid #f0f0f0; }
        .stop-image { width:80px; height:80px; object-fit:cover; border-radius:8px; }
        .stop-content { flex:1; }
        .stop-title { font-size:16px; font-weight:bold; margin-bottom:6px; }
        .stop-description { font-size:14px; color:#555; }
        .footer { text-align:center; font-size:12px; color:gray; padding:15px; border-top:1px solid #eee; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="app-info">
          ${
            appLogoBase64
              ? `<img src="data:image/png;base64,${appLogoBase64}" class="app-logo" />`
              : ''
          }
          <div class="app-name">${appName}</div>
        </div>
        <div>Informe de Tour</div>
      </div>
      <div class="tour-cover">
        ${
          tour.image_url
            ? `<img src="${tour.image_url}" class="tour-image" />`
            : ''
        }
        <div class="tour-title">${tour.name}</div>
      </div>
      <div class="stops-section">
        <div class="section-title">Paradas del recorrido (${stops.length})</div>
        ${stopsHtml}
      </div>
      <div class="footer">Generado el ${date}</div>
    </body>
  </html>
  `;
}

/**
 * Genera el PDF y permite compartirlo
 */
export async function generateTourPDF(tour: any, stops: any[]): Promise<string> {
  try {
    if (!tour) throw new Error('Tour undefined');

    const logoBase64 = await getImageBase64(Logo);
    const html = buildHTML({ appName: 'Your Seville Tour Guide', appLogoBase64: logoBase64, tour, stops });

    const { uri } = await Print.printToFileAsync({ html });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    }

    return uri;
  } catch (error) {
    console.error('Error generando PDF:', error);
    throw error;
  }
}

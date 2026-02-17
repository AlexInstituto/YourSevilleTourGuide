import * as ImagePicker from 'expo-image-picker';
import { encode as btoa } from 'base-64';

const GITHUB_OWNER = 'AlexInstituto';
const GITHUB_REPO = 'images-repo';
const GITHUB_TOKEN = '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';
const BRANCH = 'main';

export async function pickImage(): Promise<string | null> {
  const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!granted) {
    alert('Permiso denegado');
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'Images',
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.7,
  });

  if (result.canceled) return null;
  return result.assets[0].uri;
}

async function uriToBase64(uri: string): Promise<string> {
  const response = await fetch(uri);
  const buffer = await response.arrayBuffer();
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function uploadImage(uri: string, userId: string): Promise<string> {
  if (!uri) throw new Error('No se proporcionó URI');

  const fileName = `${Date.now()}.png`;
  const path = `profiles/${userId}/${fileName}`;
  const base64Content = await uriToBase64(uri);

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Add image ${fileName}`,
        content: base64Content,
        branch: BRANCH,
      }),
    }
  );

  const data = await res.json();
  if (res.status >= 400) {
    console.error('Error subiendo la imagen a GitHub:', data);
    throw new Error(data.message || 'Error subiendo la imagen');
  }

  return `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${BRANCH}/${path}`;
}

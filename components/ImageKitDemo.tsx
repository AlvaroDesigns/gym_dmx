'use client';
import { IKImage, IKUpload } from 'imagekitio-react';
import { useState } from 'react';

export default function ImageKitDemo() {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <IKImage
        path="/default-image.jpg"
        transformation={[
          {
            height: 300,
            width: 400,
          },
        ]}
        alt="Demo"
      />

      <IKUpload
        fileName="my-upload"
        onSuccess={(res: { url?: string }) => {
          if (res && typeof res.url === 'string') setUploadedUrl(res.url);
        }}
        onError={(err: unknown) => {
          console.error('Upload error', err);
        }}
      />

      {uploadedUrl && (
        <div className="mt-2">
          <p className="text-sm">Subida correcta:</p>
          <a
            className="text-blue-600 underline"
            href={uploadedUrl}
            target="_blank"
            rel="noreferrer"
          >
            {uploadedUrl}
          </a>
        </div>
      )}
    </div>
  );
}

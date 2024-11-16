import React, { memo, useMemo } from 'react';
import { TABS, TOOLS } from 'react-filerobot-image-editor';
import dynamic from 'next/dynamic';

type Props = {
  source: string;
  showEditor: boolean;
  setShowEditor: React.Dispatch<React.SetStateAction<boolean>>;
};

function ImageEditor({ source, setShowEditor, showEditor }: Props) {
  const FilerobotImageEditorComponent = useMemo(
    () =>
      dynamic(() => import('react-filerobot-image-editor'), {
        ssr: false,
      }),
    []
  );

  const closeImgEditor = () => {
    setShowEditor(false);
  };

  return (
    <div className='my-20 h-screen'>
      {showEditor && (
        <FilerobotImageEditorComponent
          previewPixelRatio={10}
          savingPixelRatio={10}
          source={source}
          onSave={(editedImageObject, designState) => {
            console.log('saved', editedImageObject, designState);
            const link = document.createElement('a');
            if (!editedImageObject.imageBase64) return;
            if (!editedImageObject.fullName) return;
            link.href = editedImageObject.imageBase64;
            link.download = editedImageObject.fullName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          onClose={closeImgEditor}
          annotationsCommon={{
            fill: '#ff0000',
          }}
          Text={{ text: 'rezyyyyy...' }}
          Rotate={{ angle: 90, componentType: 'slider' }}
          Crop={{
            presetsFolders: [
              {
                titleKey: 'socialMedia',
                groups: [
                  {
                    titleKey: 'Facebook',
                    items: [
                      {
                        titleKey: 'Profile',
                        width: 180,
                        height: 180,
                        // descriptionKey: 'fbProfileSize',
                      },
                      {
                        titleKey: 'Cover Photo',
                        width: 820,
                        height: 312,
                        // descriptionKey: 'fbCoverPhotoSize',
                      },
                    ],
                  },
                  {
                    titleKey: 'Need Instagram?',
                    items: [],
                  },
                ],
              },
            ],
          }}
          tabsIds={[TABS.ADJUST, TABS.ANNOTATE, TABS.RESIZE]}
          defaultTabId={TABS.ADJUST}
          defaultToolId={TOOLS.TEXT}
        />
      )}
    </div>
  );
}

export default memo(ImageEditor);

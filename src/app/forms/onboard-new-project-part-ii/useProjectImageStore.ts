import { create } from 'zustand';

export type ImageItem = {
  name: string;
  file: File;
  label?: {
    label: string;
    value: string;
    __isNew__?: boolean | undefined;
  };
};

export type ImageStoreState = {
  brochureFile: ImageItem[];
  masterPlanFile: ImageItem[];
  primaryImageFile: ImageItem[];
  otherImageFile: ImageItem[];
  otherDocs: ImageItem[];
};

type Store = {
  imagesStore: ImageStoreState;
  setImageFile: (_key: keyof Store['imagesStore'], _file: ImageItem) => void;
  setProjectImageLabel: (
    _key: keyof Store['imagesStore'],
    _fileName: string,
    _label: ImageItem['label']
  ) => void;
  removeImageFile: (
    _key: keyof Store['imagesStore'],
    _fileName: string
  ) => void;
  resetImageStore: () => void;
};

export const useProjectImageStore = create<Store>((set) => ({
  imagesStore: {
    brochureFile: [],
    masterPlanFile: [],
    primaryImageFile: [],
    otherImageFile: [],
    otherDocs: [],
  },
  setImageFile: (key, file) =>
    set((prev) => ({
      imagesStore: {
        ...prev.imagesStore,
        [key]: [...prev.imagesStore[key], file],
      },
    })),

  removeImageFile: (key, fileName) =>
    set((prev) => ({
      imagesStore: {
        ...prev.imagesStore,
        [key]: prev.imagesStore[key].filter((ele) => ele.name !== fileName),
      },
    })),
  resetImageStore: () =>
    set({
      imagesStore: {
        brochureFile: [],
        masterPlanFile: [],
        primaryImageFile: [],
        otherImageFile: [],
        otherDocs: [],
      },
    }),

  setProjectImageLabel: (key, fileName, label) =>
    set((prev) => ({
      imagesStore: {
        ...prev.imagesStore,
        [key]: prev.imagesStore[key].map((ele) => {
          if (ele.name === fileName) {
            ele.label = label;
          }
          return ele;
        }),
      },
    })),
}));

// const idx = prev.imagesStore.primaryImageFile.findIndex(
//   (ele) => ele.name === fileName
// );
// if (idx !== -1) {
//   prev.imagesStore.primaryImageFile[idx].label[label] = true;
// }

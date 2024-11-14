import { create } from 'zustand';

export type ImageStoreState = {
  brochureFile: { name: string; file: File }[];
  masterPlanFile: { name: string; file: File }[];
  primaryImageFile: { name: string; file: File }[];
  otherImageFile: { name: string; file: File }[];
  otherDocs: { name: string; file: File }[];
};

type Store = {
  imagesStore: ImageStoreState;
  setImageFile: (
    _key: keyof Store['imagesStore'],
    _file: { name: string; file: File }
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
}));

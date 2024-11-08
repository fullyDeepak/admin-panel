'use client';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import DMVSmap from './DMVSmap';
import axiosClient from '@/utils/AxiosClient';
import { useQuery } from '@tanstack/react-query';

/**
 * helper function to convert arra of features into a FeatureCollection
 * @param features array of features that can be converted to a FeatureCollection
 * @returns FeatureCollection
 */
function createFeatureCollection(
  features: {
    type: 'Feature';
    geometry: {
      type: 'Polygon' | 'MultiPolygon';
      coordinates: [number, number][][];
    };
    properties: {
      id: number;
      name: string;
    };
  }[]
) {
  const newFeature: {
    type: 'Feature';
    geometry: {
      type: 'Polygon' | 'MultiPolygon';
      coordinates: [number, number][][];
    };
    properties: {
      id: number;
      name: string;
    };
  }[] = features.filter((ele) => {
    if (ele.geometry.coordinates.length > 0) {
      return ele;
    }
  });
  return {
    type: 'FeatureCollection',
    features: newFeature,
  } as const;
}

export default function DMVS() {
  // Function to create a GeoJSON FeatureCollection

  const [geoJSONData, setGeoJSONData] = useState<{
    type: 'FeatureCollection';
    features: {
      type: 'Feature';
      geometry: object;
      properties: {
        id: number;
        name: string;
      };
    }[];
  } | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<{
    label: string;
    value: number;
  }>({ label: 'ALL', value: -1 });
  const [selectedMandal, setSelectedMandal] = useState<{
    label: string;
    value: number;
  } | null>({ value: -1, label: 'ALL' });
  const [selectedVillage, setSelectedVillage] = useState<{
    label: string;
    value: number;
  } | null>({ value: -1, label: 'ALL' });
  const [selectedSurvey, setSelectedSurvey] = useState<{
    label: string;
    value: number;
  } | null>({
    label: 'ALL',
    value: -1,
  });
  const [selectionType, setSelectionType] = useState<
    'DIST' | 'MNDL' | 'VILG' | 'SRVY'
  >('DIST');

  const setSelection = (value: number) => {
    console.log(selectionType, value);
    switch (selectionType) {
      case 'DIST': {
        const district = districtOptions?.dropdownOptions.filter(
          (ele) => ele.value === value
        )?.[0]!;
        setSelectionType('MNDL');
        setSelectedDistrict(district);
        break;
      }
      case 'MNDL': {
        const mandal = mandalOptions?.dropdownOptions.filter(
          (ele) => ele.value === value
        )?.[0]!;
        setSelectionType('VILG');
        setSelectedMandal(mandal);
        break;
      }
      case 'VILG': {
        const village = villageOptions?.dropdownOptions.filter(
          (ele) => ele.value === value
        )?.[0]!;
        setSelectionType('SRVY');
        setSelectedVillage(village);
        break;
      }
      case 'SRVY': {
        const survey = surveyOptions?.dropdownOptions.filter(
          (ele) => ele.value === value
        )?.[0]!;
        setSelectedSurvey(survey);
        break;
      }
      default:
        break;
    }
  };

  //#region district dropdown
  const { isPending: loadingDistricts, data: districtOptions } = useQuery({
    queryKey: ['district', selectedDistrict],
    queryFn: async ({ queryKey }) => {
      const featureArray: {
        type: 'Feature';
        geometry: {
          type: 'Polygon' | 'MultiPolygon';
          coordinates: [number, number][][];
        };
        properties: { id: any; name: any };
      }[] = [];
      console.log(queryKey);
      const dropdownOptions = [{ label: 'ALL', value: -1 }];
      const res = await axiosClient.get<{
        data: {
          id: number;
          name: string;
          geometry: { type: 'Polygon'; coordinates: [number, number][][] };
        }[];
      }>(`/map/districts`, {
        params: { state_id: 36 },
      });
      const options = res?.data?.data;
      options?.map((item) => {
        dropdownOptions?.push({ label: item.name, value: item.id });
        featureArray.push({
          type: 'Feature',
          geometry: item?.geometry,
          properties: {
            id: item.id,
            name: item.name,
          },
        });
      });
      const geojson = createFeatureCollection(featureArray);
      return { dropdownOptions, geojson };
    },
    staleTime: Infinity,
  });
  useEffect(() => {
    console.log('Changed District:', selectedDistrict);
    if (selectedDistrict?.value === -1) {
      console.log(
        'setting geojson to all districts:',
        districtOptions?.geojson
      );
      setGeoJSONData(districtOptions?.geojson!);
    }
  }, [selectedDistrict, districtOptions]);
  //#endregion district dropdown

  //#region mandal dropdown
  const { isPending: loadingMandals, data: mandalOptions } = useQuery({
    queryKey: ['mandals', selectedDistrict],
    queryFn: async ({ queryKey }) => {
      const featureArray: {
        type: 'Feature';
        geometry: {
          type: 'Polygon' | 'MultiPolygon';
          coordinates: [number, number][][];
        };
        properties: { id: number; name: string };
      }[] = [];
      console.log(queryKey);
      const dropdownOptions = [{ label: 'ALL', value: -1 }];
      const res = await axiosClient.get<{
        data: {
          id: number;
          name: string;
          geometry: { type: 'Polygon'; coordinates: [number, number][][] };
        }[];
      }>(`/map/mandals`, {
        params: { district_id: selectedDistrict.value },
      });
      const options = res?.data?.data;
      options?.map((item) => {
        dropdownOptions?.push({ label: item.name, value: item.id });
        featureArray.push({
          type: 'Feature',
          geometry: item?.geometry,
          properties: {
            id: item.id,
            name: item.name,
          },
        });
      });
      const geojson = createFeatureCollection(featureArray);
      return { dropdownOptions, geojson };
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    if (selectedDistrict?.value === -1) {
      return;
    }
    if (
      selectedMandal &&
      selectedMandal.value === -1 &&
      mandalOptions?.geojson
    ) {
      console.log(
        'Changed Mandal:',
        selectedMandal,
        'setting geojson to all mandals:',
        mandalOptions?.geojson
      );
      setGeoJSONData(mandalOptions?.geojson!);
    }
  }, [selectedMandal, mandalOptions]);

  useEffect(() => {
    console.log('loadingmandals', loadingMandals);
    setSelectedMandal({ value: -1, label: 'ALL' });
  }, [selectedDistrict]);
  //#endregion mandal dropdown

  // village dropdown
  const { isPending: loadingVillages, data: villageOptions } = useQuery({
    queryKey: ['village', selectedMandal],
    queryFn: async ({ queryKey }) => {
      const featureArray: {
        type: 'Feature';
        geometry: {
          type: 'Polygon' | 'MultiPolygon';
          coordinates: [number, number][][];
        };
        properties: { id: any; name: any };
      }[] = [];
      console.log(queryKey);

      if (!selectedMandal) throw new Error('Mandal needs to be selected');
      const dropdownOptions = [{ label: 'ALL', value: -1 }];
      const res = await axiosClient.get<{
        data: {
          id: number;
          name: string;
          geometry: { type: 'Polygon'; coordinates: [number, number][][] };
        }[];
      }>(`/map/villages`, {
        params: { mandal_id: selectedMandal.value },
      });
      const options = res?.data?.data;
      options?.map((item) => {
        dropdownOptions?.push({ label: item.name, value: item.id });
        featureArray.push({
          type: 'Feature',
          geometry: item?.geometry,
          properties: {
            id: item.id,
            name: item.name,
          },
        });
      });
      const geojson = createFeatureCollection(featureArray);
      return { dropdownOptions, geojson };
    },
    staleTime: Infinity,
  });
  useEffect(() => {
    if (selectedMandal?.value === -1) {
      return;
    }
    if (
      selectedVillage &&
      selectedVillage.value === -1 &&
      villageOptions?.geojson
    ) {
      console.log(
        'Changed Village:',
        selectedVillage,
        'setting geojson to all villages:',
        villageOptions?.geojson
      );
      setGeoJSONData(villageOptions?.geojson!);
    }
  }, [selectedVillage, villageOptions]);
  useEffect(() => {
    console.log('loadingVillages', loadingVillages);
    setSelectedVillage({ value: -1, label: 'ALL' });
  }, [selectedMandal]);
  // survey dropdown
  const { isPending: loadingSurveys, data: surveyOptions } = useQuery({
    queryKey: ['survey', selectedVillage],
    queryFn: async ({ queryKey }) => {
      const featureArray: {
        type: 'Feature';
        geometry: {
          type: 'Polygon' | 'MultiPolygon';
          coordinates: [number, number][][];
        };
        properties: { id: any; name: any };
      }[] = [];
      console.log(queryKey);
      if (!selectedVillage) throw new Error('Village needs to be selected.');
      const dropdownOptions = [{ label: 'ALL', value: -1 }];
      const res = await axiosClient.get<{
        data: {
          id: number;
          name: string;
          geometry: { type: 'Polygon'; coordinates: [number, number][][] };
        }[];
      }>(`/map/surveys`, {
        params: { village_id: selectedVillage.value },
      });
      const options = res?.data?.data;
      options?.map((item) => {
        dropdownOptions?.push({ label: item.name, value: item.id });
        featureArray.push({
          type: 'Feature',
          geometry: item?.geometry,
          properties: {
            id: item.id,
            name: item.name,
          },
        });
      });
      const geojson = createFeatureCollection(featureArray);
      return { dropdownOptions, geojson };
    },
    staleTime: Infinity,
  });
  useEffect(() => {
    if (selectedVillage?.value === -1) {
      return;
    }
    if (
      selectedSurvey &&
      selectedSurvey.value === -1 &&
      surveyOptions?.geojson
    ) {
      console.log(
        'Changed Survey:',
        selectedMandal,
        'setting geojson to all Surveys:',
        surveyOptions?.geojson
      );
      setGeoJSONData(surveyOptions?.geojson!);
      return;
    }
    console.log(
      selectedSurvey,
      surveyOptions?.geojson.features.filter(
        (ele) => ele.properties.id === selectedSurvey?.value
      )
    );
    const selectedSurveyGeoJson = surveyOptions?.geojson.features.filter(
      (ele) => ele.properties.id === selectedSurvey?.value
    );
    if (selectedSurveyGeoJson && selectedSurveyGeoJson.length > 0) {
      setGeoJSONData({
        type: 'FeatureCollection',
        features: [selectedSurveyGeoJson[0]],
      });
    }
  }, [selectedSurvey, surveyOptions]);
  useEffect(() => {
    console.log('loadingSurveys', loadingSurveys);
    setSelectedSurvey({ value: -1, label: 'ALL' });
  }, [selectedVillage]);
  return (
    <div className='mt-5'>
      <div className='mx-auto flex w-[90%] flex-col gap-5'>
        <div className='mx-auto flex w-full flex-row gap-5'>
          <span className='w-full'>
            <span>Select District</span>
            <Select
              options={districtOptions?.dropdownOptions}
              value={selectedDistrict}
              onChange={(e) => {
                console.log('On Change District');
                setSelectionType('DIST');
                if (e != null) setSelectedDistrict(e);
              }}
              isLoading={loadingDistricts}
            />
          </span>
          <span className='w-full'>
            <span>Select Mandal</span>
            <Select
              options={mandalOptions?.dropdownOptions}
              value={selectedMandal}
              isDisabled={selectedDistrict?.value === -1}
              onChange={(e) => {
                console.log('On Change Mandal');
                setSelectionType('MNDL');
                if (e != null) setSelectedMandal(e);
              }}
              isLoading={loadingMandals}
            />
          </span>
        </div>
        <div className='mx-auto flex w-full flex-row gap-5'>
          <span className='w-full'>
            <span>Select Village</span>
            <Select
              options={villageOptions?.dropdownOptions}
              value={selectedVillage}
              isDisabled={selectedMandal?.value === -1}
              onChange={(e) => {
                console.log('On Change Village');
                setSelectionType('VILG');
                if (e != null) setSelectedVillage(e);
              }}
              isLoading={loadingVillages}
            />
          </span>
          <span className='w-full'>
            <span>Select Survey No</span>
            <Select
              options={surveyOptions?.dropdownOptions}
              value={selectedSurvey}
              isDisabled={selectedVillage?.value === -1}
              onChange={(e) => {
                console.log('On Change Survey');
                setSelectionType('SRVY');
                if (e != null) setSelectedSurvey(e);
              }}
              isLoading={loadingSurveys}
            />
          </span>
        </div>
      </div>
      <div className='map'>
        {
          <DMVSmap
            mapGeoJson={geoJSONData}
            selectionType={selectionType}
            setSelection={setSelection}
          />
        }
      </div>
    </div>
  );
}

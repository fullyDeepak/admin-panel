import axiosClient from './AxiosClient';

export type DropdownOptions = { label: string; value: number };

/**
 * Fetches dropdown options for forms based on the specified administrative level.
 *
 * @param {string} type - The administrative level for which data should be fetched.
 * @param {string} [key] - The parent administrative level of `type`.
 * @param {number} [id] - The ID of the selected `key`.
 * @returns {Promise<DropdownOptions[]>} The dropdown options as an array of objects with 'label' and 'value' properties.
 * @throws {Error} If there's an error during the fetch operation.
 */

export async function fetchDropdownOption(
  type: 'states' | 'districts' | 'mandals' | 'villages',
  key?: 'state' | 'district' | 'mandal' | undefined,
  id?: number | undefined
): Promise<DropdownOptions[]> {
  if (key !== undefined && id !== undefined) {
    const res = await axiosClient.get<{
      data: { id: number; name: string }[];
      message: string;
      statusCode: number;
    }>(`/forms/${type}`, {
      params: { [`${key}_id`]: id },
    });
    const options = res?.data?.data;
    const dropdownOptions: DropdownOptions[] = options.map((item) => {
      return { value: item.id, label: item.name };
    });
    return dropdownOptions;
  } else {
    const res = await axiosClient.get<{
      data: { id: number; name: string }[];
      message: string;
      statusCode: number;
    }>(`/forms/${type}`);
    const options = res?.data?.data;
    const dropdownOptions: DropdownOptions[] = options.map((item) => {
      return { value: item.id, label: item.name };
    });
    return dropdownOptions;
  }
}

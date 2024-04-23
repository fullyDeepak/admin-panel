import { XMLParser } from 'fast-xml-parser';
import { ChangeEvent } from 'react';

function findValueByKey(
  obj: { [key: string]: any },
  targetKey: string
): string | undefined {
  for (const key in obj) {
    if (key === targetKey) {
      return obj[key];
    }
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      const result = findValueByKey(obj[key], targetKey);
      if (result !== undefined) {
        return result;
      }
    }
  }
  return undefined;
}

/**
 * Extracts the text content from a KML file uploaded via an input element.
 * @param {ChangeEvent<HTMLInputElement>} event - The change event triggered by selecting a file.
 * @returns {Promise<string | undefined>} A promise that resolves to the text content of the KML file,
 * or undefined if no file is selected or if an error occurs during reading.
 */
export async function extractKMLCoordinates(
  event: ChangeEvent<HTMLInputElement>
): Promise<string[] | undefined> {
  event.preventDefault();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    // Set up a load event handler to read the file content
    reader.onload = (e) => {
      if (e.target) {
        // Extract the text content from the loaded file
        const text = e.target.result as string;
        const parser = new XMLParser();
        const xmlObj = parser.parse(text);
        const cord: string | undefined = findValueByKey(xmlObj, 'coordinates');
        const newCoord = cord
          ?.split(',0 ')
          .map((ele) => ele.replace(',', ' ').replace(',0', ''));
        resolve(newCoord);
      } else {
        // If e.target is undefined, resolve with undefined
        resolve(undefined);
      }
    };

    // Set up an error event handler
    reader.onerror = (e) => {
      reject(new Error('Error reading file.'));
    };

    // Check if a file has been selected
    if (event.target && event.target.files && event.target.files[0]) {
      // Read the file as text
      reader.readAsText(event.target.files[0]);
    } else {
      // If no file is selected, resolve with undefined
      resolve(undefined);
    }
  });
}

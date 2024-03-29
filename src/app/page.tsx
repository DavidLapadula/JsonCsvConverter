'use client';
import React, { useRef, useState } from 'react';
import Dropdown from './components/Dropdown';
import { csvToJson, jsonToCsv } from './utils/converters';
import { copyData, downloadData, getFormattedDate, isJsonToCsv } from './utils/helpers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket, faCircleXmark, faCopy, faSave } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  const FILE_INPUT_TEXT = 'Click to select a file, drag and drop a file, or enter text.';
  const option = useRef('jsontocsv');
  const [inputData, setInputData] = useState('');
  const [outputData, setOutputData] = useState('');
  const [fileInputText, setFileInputText] = useState(FILE_INPUT_TEXT);

  const convertOptionHandler = (event: any) => {
    option.current = event.target.value;
    clearData();
  }

  const conversionHandler = () => {
    if (!inputData) {
      showErrorToast('Please ensure the left field is filled in.');
      return;
    }

    if (isJsonToCsv(option)) {
      const csvData = jsonToCsv(inputData);

      if (!csvData) {
        showErrorToast('Please enter a valid json string');
      }

      setOutputData(csvData);
    } else {
      const jsonData = csvToJson(inputData);

      if (!jsonData) {
        showErrorToast('Please enter valid csv.');
      }

      setOutputData(jsonData);
    }
  }

  const handleInputChange = (event: any) => {
    clearData();
    setInputData(event.target.value);
  }

  const handleFileUpload = (event: any) => {
    const { files, value } = event.target;
    const fileReader = new FileReader();

    clearData();

    // handle file name 
    if (value) {
      let fileName = value.split('\\').pop().split('/').pop();
      setFileInputText(fileName);
    }

    // handle file upload
    fileReader.readAsText(files[0], 'UTF-8');
    fileReader.onload = e => {
      const content: any = e.target.result;
      setInputData(content)
    };
  }

  const downloadOutputData = () => {
    if (!outputData) {
      showErrorToast('Nothing to download');
      return;
    }

    let filename = `output_${getFormattedDate()}`;
    let fileType;

    if (isJsonToCsv(option)) {
      filename += '.csv';
      fileType = 'text/csv';
    } else {
      filename += '.json';
      fileType = 'application/json';
    }
    downloadData(outputData, filename, fileType);
  }

  const copyOutputData = () => {
    if (!outputData) {
      showErrorToast('Nothing to copy');
      return;
    }

    copyData(outputData);
    showSuccessToast("Copied!");
  }

  const clearData = () => {
    setInputData('');
    setOutputData('');
    setFileInputText(FILE_INPUT_TEXT);
  }

  const showSuccessToast = (message: String) => {
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }

  const showErrorToast = (message: String) => {
    toast.error(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  }

  const handleDragOver = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    const files = Array.from(event.dataTransfer.files);

    if (!files || !files.length || files.length === 0) {
      showErrorToast('Error uploading file. Please try again.');
      return;
    }
 
    const normalizedFileReturn = {
      target : {
        files: files,
        value: files[0].name
      }
    }

    handleFileUpload(normalizedFileReturn); 
  };

  return (
    <main className='flex flex-col p-36'>
      <div>
        <h1 className='mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white text-center'>
          JSON CSV Converter
        </h1>

        {/* Succcess and error messages appear in this container */}
        <ToastContainer />

        <Dropdown
          onChangeHandler={convertOptionHandler}
        />

        <div className='grid sm:px-16 xl:px-48'>
          <div className='pl-4'>
            <div className='flex items-center justify-center w-full'
               onDragOver={handleDragOver}
               onDrop={handleDrop}
            >
              <label className='flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 p-1.5'>
                <div className='flex flex-col items-center justify-center'>
                  <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                    <span className='font-semibold'>{fileInputText}</span>
                  </p>
                </div>
                  <input
                    type='file'
                    className='hidden'
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onChange={handleFileUpload}
                  />
              </label>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-2 sm:px-16 xl:px-48 h-full'>
          <div className='p-1.5'>
            <textarea
              onChange={handleInputChange}
              value={inputData}
              className='block m-2 p-2.5 w-full h-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
            </textarea>
          </div>
          <div className='p-1.5'>
            <textarea
              disabled
              value={outputData}
              className='block m-2 p-2.5 w-full h-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
            </textarea>
          </div>
        </div>

        <div className='mt-2 grid grid-cols-2 sm:px-16 xl:px-48'>
          <div className='p-1.5 flex justify-center'>
            <button
              type='button'
              onClick={conversionHandler}
              className='m-2 focus:outline-none w-1/3 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'>
              <FontAwesomeIcon icon={faArrowRightToBracket}  className='mr-2'/>
              Convert
            </button>
            <button
              type='button'
              onClick={clearData}
              style={{ backgroundColor: 'white' }}
              className='m-2 text-black w-1/3 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'>
              <FontAwesomeIcon icon={faCircleXmark}  className='mr-2'/>
              Clear
            </button>
          </div>
          <div className='p-1.5 flex justify-center'>
            <button
              type='button'
              onClick={copyOutputData}
              className='m-2 text-gray-900 w-1/3 border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'>
              <FontAwesomeIcon icon={faCopy}  className='mr-2'/>
              Copy
            </button>
            <button
              type='button'
              onClick={downloadOutputData}
              className='m-2 text-gray-900 w-1/3 border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'>
              <FontAwesomeIcon icon={faSave}  className='mr-2'/>
              Download
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

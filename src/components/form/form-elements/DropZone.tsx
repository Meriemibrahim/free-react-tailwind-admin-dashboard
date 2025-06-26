import React, { useEffect, useRef, useState } from "react";
import ComponentCard from "../../common/ComponentCard";
import { useDropzone } from "react-dropzone";
import { OcrService } from "../../../services";
import { Client } from "@stomp/stompjs";
import SockJS from 'sockjs-client/dist/sockjs';
interface Props {
  onUploadSuccess?: () => void;
}


export default function DropzoneComponent({ onUploadSuccess }: Props) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileSteps, setFileSteps] = useState<Record<string, number>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);

  const progressByFileRef = useRef<Map<string, number>>(new Map());
 

  const onDrop = (acceptedFiles: File[]) => {
    setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
  };

  const handleRemoveFile = (fileName: string) => {
    setSelectedFiles((files) => files.filter((file) => file.name !== fileName));
  };

  const handleFileUpload = async (selectedFile: File) => {
    const formData = new FormData();
    formData.append("files", selectedFile);

    setIsUploading(true);
    try {
      const data = await OcrService.uploadCvs(formData);
      console.log("File uploaded and processed successfully", data);
            if (onUploadSuccess) onUploadSuccess(); // 🔁 notifier parent

    } catch (error) {
      console.error("Error uploading file", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setIsComplete(false);

    const initSteps: Record<string, number> = {};
    selectedFiles.forEach((file) => (initSteps[file.name] = 0));
    setFileSteps(initSteps);

    for (const file of selectedFiles) {
      await handleFileUpload(file);
    }
    const allDone = Array.from(progressByFileRef.current.values()).every(p => p === 100);
    if (allDone) {
      setIsAnalyzing(false);
      setIsComplete(true);
    }
  };

  useEffect(() => {
    if (!isAnalyzing) return;

    const socket = new SockJS('http://localhost:8089/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      onConnect: () => {
        stompClient.subscribe('/topic/progress', (message) => {
          const data = JSON.parse(message.body);
          if (data.fileName && typeof data.progress === 'number') {
            progressByFileRef.current.set(data.fileName, data.progress);

            const progressValues = Array.from(progressByFileRef.current.values());
            const totalFiles = progressValues.length;
            const computedOverall = progressValues.reduce((sum, p) => sum + p, 0) / totalFiles;

            setOverallProgress(Math.round(computedOverall));
          }
        });
      },
      onStompError: (error) => {
        console.error("STOMP Error:", error);
      }
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [isAnalyzing]);



  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "application/pdf": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [],
    },
  });

  return (
    <ComponentCard title="Dropzone">
      {!isAnalyzing && !isComplete && (
        <div className="border border-dashed border-gray-300 p-7 rounded-xl cursor-pointer">
          <form {...getRootProps()} className="text-center">
            <input {...getInputProps()} />
            <p className="text-gray-800 dark:text-white mb-3 font-semibold text-lg">
              {isDragActive ? "Drop files here..." : "Drag & Drop or Browse files"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supported: PNG, JPEG, PDF, DOCX
            </p>
          </form>
        </div>
      )}

      {selectedFiles.length > 0 && !isAnalyzing && !isComplete && (
        <div className="mt-4">
          <ul className="mb-4">
            {selectedFiles.map((file) => (
              <li key={file.name} className="flex justify-between items-center mb-2">
                <span>{file.name}</span>
                <button
                  onClick={() => handleRemoveFile(file.name)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={handleAnalyze}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Analyze"}
          </button>
        </div>
      )}

      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="relative w-32 h-32">
            <svg className="absolute top-0 left-0" viewBox="0 0 36 36">
              <path
                className="text-gray-300"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                className="text-blue-500"
                strokeDasharray={`${overallProgress}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xl font-bold">
              {overallProgress}%
            </span>
          </div>
          <p className="mt-4 text-gray-700 dark:text-white font-medium">
            Analyzing files...
          </p>
        </div>
      )}

      {isComplete && (
        <div className="flex flex-col items-center justify-center py-12">
          <h2 className="text-3xl font-bold text-green-600 mb-4">Complete!</h2>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={() => {
              setSelectedFiles([]);
              setFileSteps({});
              setIsComplete(false);
              setOverallProgress(0);
              progressByFileRef.current.clear();
            }}
          >
            Upload More Files
          </button>
        </div>
      )}
    </ComponentCard>
  );
};


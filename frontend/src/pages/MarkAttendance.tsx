import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Camera, Check, XCircle, RefreshCw, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

import kioskService from '@/services/kioskService';
import employeeSelfService from '@/services/employeeSelfService';

export default function MarkAttendance() {
  const webcamRef = useRef(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [employeeName, setEmployeeName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    async function fetchInfos() {
      try {
        const data = await kioskService.setupMarkAttendancePage();
        const newEmployees = data.employees.map((emp) => ({
            id: emp.id,
            employeeFirstName: emp.employeeFirstName,
            employeeLastName: emp.employeeLastName,
        }));
        setEmployees(newEmployees);
        setCompanyName(data.entrepriseName);
      
      } catch (error) {
        console.error("Error fetching info:", error);
        toast({
          title: "Error",
          description: "Failed to fetch employee info.",
          variant: "destructive",
        });
      }
    }

    fetchInfos();
  }, []);

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeName(`${employee.employeeFirstName} ${employee.employeeLastName}`);
    setEmployeeId(employee.id);
    
    // Reset any previous captures when changing employee
    if (capturedImage) {
      resetCapture();
    }
  };

  const captureImage = () => {
    if (loading || countdown !== null) return;
    setCountdown(3);
  };

  useEffect(() => {
    let timer;
    if (countdown !== null) {
      if (countdown > 0) {
        timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      } else {
        captureAndProcessImage();
      }
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const captureAndProcessImage = async () => {
    try {
      const canvas = document.createElement('canvas');
      const video = webcamRef.current.video;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);

      canvas.toBlob(async (blob) => {
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImage(imageUrl);

        const imageFile = new File([blob], `${employeeId}_face.jpg`, {
          type: 'image/jpeg',
        });

        await sendToBackend(imageFile);

        setLoading(false);
        setCountdown(null);
      }, 'image/jpeg', 0.92);
    } catch (err) {
      setError("Error capturing image");
      setLoading(false);
      setCountdown(null);
      console.error(err);
    }
  };

  const sendToBackend = async (imageFile) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("employeeId", employeeId);
      formData.append("file", imageFile);

      const response = await kioskService.markAttendanceFace(formData);

      if (response.success) {
        setRegistered(true);
        toast({
          title: "Success",
          description: "Attendance recorded successfully!",
          variant: "default",
        });
        navigate("/mark-attendance");
      } else {
        throw new Error(response.message || "Verifying failed");
      }
    } catch (err) {
        let errorMessage = "Error verifying face";

        try {
          // Try to parse JSON if err.message is a JSON string
          const parsed = JSON.parse(err.message);
          if (parsed.error) {
            errorMessage = parsed.error;
          }
        } catch {
          // If not JSON, fall back to raw message
          errorMessage = err.message || errorMessage;
        }

        console.log(errorMessage);
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        
    } finally {
      setLoading(false);
    }
  };

  const resetCapture = () => {
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }
    setCapturedImage(null);
    setRegistered(false);
    setError(null);
    setCountdown(null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <Camera className="mr-2" size={24} />
            {companyName} | Mark Attendance
          </h2>
        </div>

        <div className="p-6">
          {/* Employee Selection Dropdown */}
          <div className="mb-6">
            <label htmlFor="employee-select" className="block text-sm font-medium text-gray-700 mb-1">
              Select Employee
            </label>
            <div className="relative">
              <select
                id="employee-select"
                value={employeeId || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    const selectedEmp = employees.find(emp => emp.id === Number(value));
                    if (selectedEmp) {
                      handleEmployeeSelect(selectedEmp);
                    }
                  } else {
                    // Reset if empty selection
                    setSelectedEmployee(null);
                    setEmployeeName('');
                    setEmployeeId('');
                  }
                }}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                disabled={loading || countdown !== null}
              >
                <option value="">Select an employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.employeeFirstName} {emp.employeeLastName}
                  </option>
                ))}
              </select>
              
            </div>
            {employeeName && (
              <p className="mt-2 text-sm text-indigo-600">
                Current selection: {employeeName}
              </p>
            )}
          </div>

          {!employeeId ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <Camera className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No employee selected</h3>
              <p className="mt-1 text-sm text-gray-500">Please select an employee to continue with attendance marking.</p>
            </div>
          ) : !capturedImage ? (
            <div className="relative">
              <div className="border-4 border-gray-300 rounded-xl overflow-hidden transition-colors duration-300">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width="100%"
                  videoConstraints={{ facingMode: "user" }}
                  className="rounded-lg"
                />
              </div>

              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-xl">
                  <div className="text-6xl font-bold text-white">{countdown}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="border-4 border-indigo-400 rounded-xl overflow-hidden">
                  <img
                    src={capturedImage}
                    alt="Captured Face"
                    className="w-full h-auto max-w-md rounded-lg"
                  />
                </div>

                {registered && (
                  <div className="absolute bottom-3 right-3 bg-green-500 text-white p-2 rounded-full">
                    <Check size={24} />
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
                <div className="flex items-center">
                  <XCircle className="text-red-500 mr-2" size={20} />
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            )}

            {registered ? (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded">
                <div className="flex items-center">
                  <Check className="text-green-500 mr-2" size={20} />
                  <p className="text-green-700">Attendance recorded successfully!</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                {capturedImage ? (
                  <button
                    onClick={resetCapture}
                    className="bg-indigo-100 text-indigo-600 hover:bg-indigo-200 px-4 py-2 rounded-md font-medium flex items-center justify-center"
                    disabled={!employeeId}
                  >
                    <RefreshCw size={18} className="mr-2" />
                    Retake Photo
                  </button>
                ) : (
                  <button
                    onClick={captureImage}
                    disabled={loading || countdown !== null || !employeeId}
                    className={`${
                      loading || countdown !== null || !employeeId
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700'
                    } text-white px-4 py-3 rounded-md font-medium flex items-center justify-center`}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </>
                    ) : countdown !== null ? (
                      'Taking Photo...'
                    ) : (
                      <>
                        <Camera size={18} className="mr-2" />
                        Capture Photo
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>Please ensure your face is clearly visible and well-lit.</p>
            <p>Look directly at the camera.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
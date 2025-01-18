import { useEffect, useState } from "react";
import { Mic, Webcam } from "lucide-react";
import { useVoiceClientMediaDevices } from "realtime-ai-react";

import { Alert } from "../ui/alert";
import { Field } from "../ui/field";
import { Select } from "../ui/select";

import { AudioIndicatorBar } from "./AudioIndicator";

interface DeviceSelectProps {
  hideMeter: boolean;
}

export const DeviceSelect: React.FC<DeviceSelectProps> = ({
  hideMeter = false
}) => {
  const {
    availableMics,
    selectedMic,
    updateMic,
    availableCams,
    selectedCam,
    updateCam,
  } = useVoiceClientMediaDevices();
  const [error, setError] = useState<Boolean>(false)

  async function getAvailableWebcamsAndMicrophones() {
    try {
      // Check the permissions for camera and microphone
      const cameraPermission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      const microphonePermission = await navigator.permissions.query({ name: 'microphone' as PermissionName });


      // Request permissions if not granted or prompt if state is 'prompt'
      if (cameraPermission.state !== 'granted' || microphonePermission.state !== 'granted') {
        try {
          await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          setError(false)
        } catch (error) {
          console.error('Permissions denied for accessing camera and microphone:', error);
          localStorage.setItem('permission', 'false')
          setError(true);
        }
      } else {
        localStorage.setItem('permission', 'true')
      }
      const devices = await navigator.mediaDevices.enumerateDevices();
      const webcams = devices.filter(device => device.kind === 'videoinput');
      const microphones = devices.filter(device => device.kind === 'audioinput');
      updateCam(webcams[0].deviceId)
      updateMic(microphones[0].deviceId)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAvailableWebcamsAndMicrophones();
  }, [])

  useEffect(() => {
    updateMic(selectedMic?.deviceId);
    updateCam(selectedCam?.deviceId);
  }, [updateMic, selectedMic, updateCam, selectedCam]);

  return (
    <div className="flex flex-col flex-wrap gap-4">
      {error === true && <Alert title="Permissions denied for accessing camera and microphone" intent="danger" />}
      <Field label="Microphone" error={false}>
        <Select
          onChange={(e) => updateMic(e.currentTarget.value)}
          value={selectedMic?.deviceId}
          icon={<Mic size={24} />}
        >
          {
            availableMics.length === 0 ? (
              <option value="">Loading devices...</option>
            ) : (
              <>
                {
                  availableMics.map((mic) => (
                    <option key={mic.deviceId} value={mic.deviceId}>
                      {mic.label}
                    </option>
                  ))

                }
              </>
            )}
        </Select>
        {!hideMeter && <AudioIndicatorBar />}
      </Field>

      <Field label="Camera" error={false}>
        <Select
          onChange={(e) => updateCam(e.currentTarget.value)}
          value={selectedCam?.deviceId}
          icon={<Webcam size={24} />}
          defaultValue="Please Select Camera"
        >
          {availableCams.length === 0 ? (
            <option value="">Loading devices...</option>
          ) : (
            availableCams.map((cam) => (
              <>
                <option key={cam.deviceId} value={cam.deviceId}>
                  {cam.label}
                </option>
              </>
            ))
          )}
        </Select>
      </Field>
    </div>
  );
};

export default DeviceSelect;

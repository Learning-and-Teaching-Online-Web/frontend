import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { toast } from 'react-toastify';
import { classroomApi, type ClassroomAccessData } from '../services/classroomApi';
import authStorage from '../utils/authStorage';
import '../styles/ClassroomPage.css';

export interface ClassroomPageProps {
  scheduleId?: string;
  checkAccessFn?: (scheduleId: string) => Promise<any>;
  navigateFn?: (path: string, options?: any) => void;
  toastErrorFn?: (message: string) => void;
}

export const ClassroomPage: React.FC<ClassroomPageProps> = ({
  scheduleId: propScheduleId,
  checkAccessFn,
  navigateFn,
  toastErrorFn
}) => {
  const routeParams = useParams<{ scheduleId: string }>();
  const navigate = useNavigate();
  const effectiveNavigate = navigateFn || navigate;
  const effectiveToastError = toastErrorFn || toast.error;
  const effectiveScheduleId = propScheduleId || routeParams.scheduleId;

  const [loading, setLoading] = useState<boolean>(true);
  const [accessData, setAccessData] = useState<ClassroomAccessData | null>(null);

  useEffect(() => {
    let isSubscribed = true;

    const verifyAccess = async () => {
      if (!effectiveScheduleId) {
        const errorMsg = 'Mã buổi học không hợp lệ';
        effectiveToastError(errorMsg);
        effectiveNavigate('/courses', { replace: true });
        return;
      }

      try {
        setLoading(true);
        const fetcher = checkAccessFn || classroomApi.checkAccess;
        const res = await fetcher(effectiveScheduleId);

        if (!isSubscribed) return;

        if (res && res.success && res.data && res.data.room_id) {
          setAccessData(res.data);
          setLoading(false);
        } else {
          const errorMsg = res?.error || 'Bạn không có quyền truy cập vào phòng học này';
          effectiveToastError(errorMsg);
          effectiveNavigate('/courses', { replace: true });
        }
      } catch (err: any) {
        if (!isSubscribed) return;
        const errorMsg =
          err?.response?.data?.error ||
          err?.message ||
          'Bạn không có quyền truy cập vào phòng học này';
        effectiveToastError(errorMsg);
        effectiveNavigate('/courses', { replace: true });
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    verifyAccess();

    return () => {
      isSubscribed = false;
    };
  }, [effectiveScheduleId]);

  if (loading) {
    return (
      <div className="classroom-loading" data-testid="classroom-loading">
        <div className="classroom-spinner"></div>
        <p>Đang kiểm tra quyền truy cập phòng học...</p>
      </div>
    );
  }

  if (!accessData) {
    return null;
  }

  const displayName =
    authStorage.getUserName() ||
    (accessData.user_role === 'tutor' ? 'Giảng viên' : 'Học viên');

  return (
    <div className="classroom-page" data-testid="classroom-page">
      <div className="classroom-header">
        <div className="classroom-info">
          <h2>{accessData.course_title || 'Phòng học trực tuyến'}</h2>
          <span className="room-badge">Phòng: {accessData.room_id}</span>
        </div>
        <button
          className="btn-exit-classroom"
          onClick={() => effectiveNavigate('/courses')}
          data-testid="btn-exit-room"
        >
          Rời phòng học
        </button>
      </div>

      <div className="classroom-jitsi-wrapper" data-testid="jitsi-wrapper">
        <JitsiMeeting
          domain="meet.jit.si"
          roomName={accessData.room_id}
          configOverwrite={{
            startWithAudioMuted: false,
            disableModeratorIndicator: false,
            startScreenSharing: false,
            enableEmailInStats: false
          }}
          interfaceConfigOverwrite={{
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
          }}
          userInfo={{
            displayName,
            email: ''
          }}
          getIFrameRef={(iframeRef) => {
            if (iframeRef) {
              iframeRef.style.height = '100%';
              iframeRef.style.width = '100%';
              iframeRef.style.border = 'none';
            }
          }}
        />
      </div>
    </div>
  );
};

export default ClassroomPage;

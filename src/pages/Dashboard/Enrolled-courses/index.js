import React, { useEffect, useState, useCallback } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Import updateDoc
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "config/firebase";
import { Progress, Spin, Tag } from "antd"; // Import Tag from Ant Design
import { ClockCircleOutlined , CheckCircleOutlined } from "@ant-design/icons";
import "./styles.css"; // Import custom CSS
import Certificate from "./Certificate";

const EnrolledCourses = () => {
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(0); // State for progress
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null); // State to store user ID
  const [requestedExam, setRequestedExam] = useState(null); // Store current requested exam
  const [studentName, setStudentName] = useState("");
  const [examCompletionStatus, setExamCompletionStatus] = useState({
    first: false,
    second: false,
    third: false,
    fourth: false,
  }); // Track completion status of each exam

  const fetchEnrolledCourse = useCallback(async (userId) => {
    try {
      const userDocRef = doc(firestore, "users", userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const courseId = userData.enrolledCourse;
        setStudentName(userData.fullName);
        setRequestedExam(userData.requestedExam); // Store requested exam

        if (courseId) {
          setCourse(courseId);
          calculateProgress(userData); // Calculate progress based on user data
        } else {
          setError("No course enrolled");
        }
      } else {
        setError("User data not found");
      }
    } catch (error) {
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const calculateProgress = (userData) => {
    let totalProgress = 0;
    let updatedCompletionStatus = { ...examCompletionStatus };

    if (userData.firstExamMarks) {
      totalProgress += 25;
      updatedCompletionStatus.first = true;
    }
    if (userData.secondExamMarks) {
      totalProgress += 25;
      updatedCompletionStatus.second = true;
    }
    if (userData.thirdExamMarks) {
      totalProgress += 25;
      updatedCompletionStatus.third = true;
    }
    if (userData.fourthExamMarks) {
      totalProgress += 25;
      updatedCompletionStatus.fourth = true;
    }

    setProgress(totalProgress);
    setExamCompletionStatus(updatedCompletionStatus); // Update completion status
  };

  const handleScheduleClick = async (examNumber) => {
    if (!userId) return;

    const examKeyMap = ["first", "second", "third", "fourth"];
    const examKey = examKeyMap[examNumber - 1];

    if (requestedExam === examKey) {
      window.toastify(`You have already requested the ${examKey} exam.`);
      return;
    }

    try {
      const userDocRef = doc(firestore, "users", userId);
      await updateDoc(userDocRef, {
        requestedExam: examKey,
      });

      setRequestedExam(examKey); // Update state with new requested exam
      window.toastify(`Scheduled ${examKey} exam successfully!`, "success");
    } catch (error) {
      console.error("Error updating document:", error);
      alert("Failed to schedule exam. Please try again.");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUserId(currentUser.uid); // Store user ID
        fetchEnrolledCourse(currentUser.uid);
      } else {
        setCourse(null);
      }
    });

    return () => unsubscribe();
  }, [fetchEnrolledCourse]);

  if (loading)
    return (
      <div id="main">
        <Spin />
      </div>
    );
  if (error) return <div className="text-center">Error: {error}</div>;

  return (
    <div className="container my-4">
      <h3 className="course-title">Enrolled Course</h3>
      <div id="course-card">
        <h3 id="course-name">{course}</h3>
        <div id="progress-wrapper">
          <div id="progress-heading">Course Progress</div>
          <Progress
            percent={progress} // Set dynamically calculated progress
            strokeColor={{ "0%": "#ff7e5f", "100%": "#feb47b" }}
            trailColor="#d9d9d9"
            strokeWidth={20}
            showInfo={true}
          />
        </div>
      </div>
      <div id="assessments">
        {[1, 2, 3, 4].map((num) => {
          const examKeyMap = ["first", "second", "third", "fourth"];
          const examKey = examKeyMap[num - 1];
          const isDisabled = requestedExam === examKey || examCompletionStatus[examKey];

          return (
            <div
              className="assessment-card my-2 d-flex justify-content-between"
              key={num}
            >
              <h4>Assessment #{num}</h4>
              <div className="d-flex align-items-center">
                <button
                  onClick={() => handleScheduleClick(num)}
                  disabled={isDisabled}
                >{examCompletionStatus[examKey] && <Tag color="green" ><CheckCircleOutlined/></Tag>}
                  <ClockCircleOutlined /> {isDisabled ? "Scheduled" : "Schedule"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {progress === 100 && <Certificate courseName={course} studentName={studentName} />}
    </div>
  );
};

export default EnrolledCourses;

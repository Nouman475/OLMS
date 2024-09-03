import React, { useEffect, useState } from "react";
import { Line, Bar, Radar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Spin } from "antd";

ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const TrackProgress = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [quizScores, setQuizScores] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        getUserData(currentUser.uid);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  });

  const getUserData = async (id) => {
    try {
      const docRef = doc(firestore, "users", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
      const userData = docSnap.data();
      calculateProgressAndScores(userData);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateProgressAndScores = (userData) => {
    var totalProgress = 0;
    let scores = [];

    if (userData.firstExamMarks) {
      totalProgress += 25;
      scores.push(userData.firstExamMarks);
    }
    if (userData.secondExamMarks) {
      totalProgress += 25;
      scores.push(userData.secondExamMarks);
    }
    if (userData.thirdExamMarks) {
      totalProgress += 25;
      scores.push(userData.thirdExamMarks);
    }
    if (userData.fourthExamMarks) {
      totalProgress += 25;
      scores.push(userData.fourthExamMarks);
    }
    setProgress(totalProgress);
    setQuizScores(scores);
  };

  const overallProgressData = {
    labels: ["Progress"],
    datasets: [
      {
        label: "Course Completion",
        data: [progress], // Set dynamically based on exams
        backgroundColor: "rgba(0, 123, 255, 0.5)",
        borderColor: "rgba(0, 123, 255, 1)",
        borderWidth: 2,
        borderRadius: 5,
      },
    ],
  };

  const quizScoresData = {
    labels: quizScores.map((_, index) => `Exam ${index + 1}`),
    datasets: [
      {
        label: "Scores",
        data: quizScores, // Set dynamically based on exams
        backgroundColor: "rgba(40, 167, 69, 0.5)",
        borderColor: "rgba(40, 167, 69, 1)",
        borderWidth: 2,
        borderRadius: 5,
      },
    ],
  };

  const optionsDoughnut = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.label + ": " + tooltipItem.raw + "%";
          },
        },
      },
    },
  };


  const predictedProgressData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Predicted Progress",
        data: [20,40,15,80], // Example predictions
        backgroundColor: "rgba(108, 117, 125, 0.5)", // Gradient grey
        borderColor: "rgba(108, 117, 125, 1)", // Bright grey
        fill: true,
        borderWidth: 2,
        borderRadius: 5,
      },
    ],
  };

  const timeSpentData = {
    labels: ["Videos", "Practical", "Quizzes", "Assignments"],
    datasets: [
      {
        label: "Time Spent",
        data: [10,30,50,20], // Example time distribution
        backgroundColor: [
          "rgba(255, 193, 7, 0.5)", // Gradient yellow
          "rgba(255, 83, 73, 0.5)", // Gradient red
          "rgba(23, 162, 184, 0.5)", // Gradient teal
          "rgba(108, 117, 125, 0.5)", // Gradient grey
        ],
      },
    ],
  };
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Spin />
      </div>
    );
  }

  return (
    <div className="container my-4">
      <div className="row">
        {/* Overall Course Progress */}
        <div className="col-md-6 mb-4">
          <div className="track-progress-chart">
            <h5 className="text-center">Overall Course Progress</h5>
            <Bar
              data={overallProgressData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>

        {/* Quiz and Assignment Scores */}
        <div className="col-md-6 mb-4">
          <div className="track-progress-chart">
            <h5 className="text-center">Exam Scores</h5>
            <Radar
              data={quizScoresData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>

        {/* Other sections... */}
        {/* Time Spent on Learning */}
        <div className="col-md-6 mb-4">
          <div className="track-progress-chart">
            <h5 className="text-center">Daily reccomendation</h5>
            <Doughnut data={timeSpentData} options={optionsDoughnut} />
          </div>
        </div>

        {/* Predicted Progress */}
        <div className="col-md-6 mb-4">
          <div className="track-progress-chart">
            <h5 className="text-center">Predicted Progress</h5>
            <Line
              data={predictedProgressData}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default TrackProgress;


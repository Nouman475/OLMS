import React, { useState, useEffect } from "react";
import { Table, Input, Switch } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { firestore } from "config/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import "./style.css"; // For styling

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsCollection = collection(firestore, "users");
        const q = query(studentsCollection, where("role", "==", "student"));
        const querySnapshot = await getDocs(q);

        const studentsList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return { id: doc.id, ...data };
        });

        setStudents(studentsList);
        setFilteredStudents(studentsList);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();

    const filteredData = students.filter((student) => {
      const studentName = student.fullName?.toLowerCase() || "";
      const studentEmail = student.email?.toLowerCase() || "";

      return studentName.includes(value) || studentEmail.includes(value);
    });

    setFilteredStudents(filteredData);
  };

  const handleAttendanceChange = async (checked, student) => {
      try {
      const studentDoc = doc(firestore, "users", student.id);
      await updateDoc(studentDoc, { attendance: checked });

      setStudents(
        students.map((s) =>
          s.id === student.id ? { ...s, attendance: checked } : s
        )
      );
      setFilteredStudents(
        filteredStudents.map((s) =>
          s.id === student.id ? { ...s, attendance: checked } : s
        )
      );
    } catch (error) {
      console.error("Error updating attendance:", error);
      window.toastify("Something went wrong","error")
    } 
  };

  const attendanceColumns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => text || "N/A",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => text || "N/A",
    },
    {
      title: "Course Enrolled",
      dataIndex: "enrolledCourse",
      key: "course",
      render: (text) => text || "Not Enrolled",
    },
    {
      title: "Attendance",
      key: "attendance",
      render: (text, record) => (
        <Switch
          checked={record.attendance || false}
          onChange={(checked) => handleAttendanceChange(checked, record)}
          disabled={!record.enrolledCourse} // Disable switch if the student is not enrolled
        />
      ),
    },
  ];

  return (
    <div className="manage-student">
      <div className="header">
        <h2>Attendance</h2>
        <Input
          placeholder="Search by full name or email"
          prefix={<SearchOutlined />}
          className="search-input"
          onChange={handleSearch}
        />
      </div>
      <Table
        columns={attendanceColumns}
        loading={loading}
        dataSource={filteredStudents}
        rowKey="id"
        className="table-responsive"
      />
      <div
        className="alert alert-warning alert-dismissible fade show mt-2"
        role="alert"
      >
        <strong>*Note</strong> If the student is active now then he/she is considered present today.
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
        ></button>
      </div>
    </div>
  );
};

export default Attendance;

import React, { useState, useEffect } from "react";
import { Table, Input, Button, Modal, Form, Dropdown, Menu } from "antd";
import { SearchOutlined, MoreOutlined } from "@ant-design/icons";
import { firestore } from "config/firebase";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import "./style.css";
import Attendance from "./Attendance";

const ManageStudent = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [examType, setExamType] = useState("");
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

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

  const handleMenuClick = (e, student) => {
    if (student.enrolledCourse) {
        setSelectedStudent(student);
        setExamType(e.key);
        setIsModalVisible(true);
    }
};


  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const { marks } = values;

      const studentDoc = doc(firestore, "users", selectedStudent.id);
      await updateDoc(studentDoc, {
        [`${examType}Marks`]: marks,
      });

      setStudents(
        students.map((student) =>
          student.id === selectedStudent.id ? { ...student, [`${examType}Marks`]: marks } : student
        )
      );
      setFilteredStudents(
        filteredStudents.map((student) =>
          student.id === selectedStudent.id ? { ...student, [`${examType}Marks`]: marks } : student
        )
      );

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const menu = (student) => (
    <Menu onClick={(e) => handleMenuClick(e, student)}>
      {student.enrolledCourse ? (
        <>
          <Menu.Item key="firstExam">{student.firstExamMarks? "Edit first" : "Upload first"} Exam Marks</Menu.Item>
          <Menu.Item key="secondExam">{student.secondExamMarks? "Edit second" : "Upload second"} Exam Marks</Menu.Item>
          <Menu.Item key="thirdExam">{student.thirdExamMarks? "Edit third" : "Upload third"} Exam Marks</Menu.Item>
          <Menu.Item key="fourthExam">{student.fourthExamMarks? "Edit fourth" : "Upload fourth"} Exam Marks</Menu.Item>
        </>
      ) : (
        <Menu.Item key="notEnrolled" disabled>
          Not Enrolled - Marks can't be uploaded
        </Menu.Item>
      )}
    </Menu>
  );
  const isNewStudent = (dateCreated) => {
    const fifteenMinutesAgo = new Date();
    fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15);
    return dateCreated.toDate() > fifteenMinutesAgo;
  };
  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text, record) => (
        <div className="card-container">
          {isNewStudent(record.dateCreated) && (
            <span className="new-badge">New</span>
          )}
          {text || "N/A"}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => text || "N/A",
    },
    {
      title: "Course",
      dataIndex: "enrolledCourse",
      key: "course",
      render: (text) => text || "Not enrolled",
    },
    {
      title: "Exam requested",
      dataIndex: "requestedExam",
      key: "exam",
      render: (text) => text || "Not requested",
    },
    {
      title: "Upload marks",
      key: "actions",
      render: (text, record) => (
        <Dropdown overlay={menu(record)} trigger={['click']}>
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="manage-student">
      <div className="header">
        <h2>Manage Students</h2>
        <Input
          placeholder="Search by full name or email"
          prefix={<SearchOutlined />}
          className="search-input"
          onChange={handleSearch}
        />
      </div>
      <Table
        columns={columns}
        loading={loading}
        dataSource={filteredStudents}
        rowKey="id"
        className="table-responsive"
      />
      <Modal
        title={`Upload ${examType.replace(/([A-Z])/g, " $1")} Marks`}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="marks"
            label="Marks"
            rules={[{ required: true, message: "Please enter the marks" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
      <Attendance/>
    </div>
  );
};

export default ManageStudent;

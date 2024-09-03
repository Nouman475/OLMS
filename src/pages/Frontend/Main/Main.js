import React, { useCallback, useEffect, useState } from "react";
import { Layout, Menu, Input, Dropdown, Radio, Button } from "antd";
import {
  DownOutlined,
  MenuOutlined,
  LaptopOutlined,
  SketchOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import "./Main.css";
import courses from "./courses";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, firestore } from "config/firebase";
import { onAuthStateChanged } from "firebase/auth";

const { Header, Content } = Layout;
const { Search } = Input;

const Main = () => {
  const [isNavbarOpen, setNavbarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCourse, setSelectedCourse] = useState({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  // Categories with main categories and icons
  const categories = [
    { key: "1", label: "Development", icon: <LaptopOutlined /> },
    { key: "2", label: "Design", icon: <SketchOutlined /> },
    { key: "3", label: "Marketing", icon: <GlobalOutlined /> },
  ];

  // Payment methods
  const paymentMethods = [
    {
      value: "Easypaisa",
      imgSrc:
        "https://crushlogo.com/public/uploads/thumbnail/easypaisa-pay-logo-11685340011w1ndm8dzgj.png",
    },
    {
      value: "JazzCash",
      imgSrc:
        "https://seeklogo.com/images/N/new-jazz-logo-D69BD35771-seeklogo.com.png",
    },
    {
      value: "VISA",
      imgSrc:
        "https://purepng.com/public/uploads/large/purepng.com-visa-logologobrand-logoiconslogos-251519938794uqvcz.png",
    },
    {
      value: "HBL",
      imgSrc: "https://iconape.com/wp-content/files/tr/209435/svg/209435.svg",
    },
  ];

  const toggleNavbar = () => {
    setNavbarOpen(!isNavbarOpen);
  };

  // Filter courses based on search term and selected category
  const filteredCourses = courses.filter(
    (course) =>
      (selectedCategory ? course.category === selectedCategory : true) &&
      course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dropdown menu dynamically created from categories
  const createCategoryMenu = (categories, onCategorySelect) => (
    <Menu>
      {categories.map((category) => (
        <Menu.Item
          key={category.key}
          onClick={() => onCategorySelect(category.label)}
          icon={category.icon}
        >
          {category.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  // Course card component
  const CourseCard = ({ course }) => (
    <div className="course-card">
      <div className="course-card-image">
        <img src={course.image} alt={course.name} />
      </div>
      <div className="course-card-content">
        <h4>{course.name}</h4>
        <p>
          <strong>Duration:</strong> {course.duration}
        </p>
        <p>
          <strong>Fee:</strong> {course.fee}
        </p>
        <p>
          <strong>Certificate:</strong> {course.certificate}
        </p>
        <p>
          <strong>Instructor:</strong> {course.instructor}
        </p>
        <p>
          <strong>Exams:</strong> 4
        </p>
        <button
          data-bs-toggle="modal"
          data-bs-target="#staticBackdrop"
          className="btn btn-info"
          onClick={() => setSelectedCourse(course)}
        >
          Enroll
        </button>
      </div>
    </div>
  );

  // Check user data
  const getUserData = useCallback(async (id) => {
    try {
      const docRef = doc(firestore, "users", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUser(docSnap.data());
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        getUserData(currentUser.uid);
      } else {
        console.log("User not found");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [getUserData]);

  const handleEnroll = async (course) => {
    if (user.role === "instructor") {
      window.toastify("You are an Instructor cannot enroll", "error");
      return;
    }
    if (user.enrolledCourse) {
      window.toastify(`Already enrolled in ${user.enrolledCourse}`, "error");
      return;
    }
    if (!selectedPaymentMethod || selectedPaymentMethod === "") {
      window.toastify("Select a payment method", "error");
      return;
    }
    console.log(selectedCourse);
    try {
      setLoading(true);
      await setDoc(
        doc(firestore, "users", user.uid),
        {
          enrolledCourse: course.name,
          paymentMethod: selectedPaymentMethod,
        },
        { merge: true }
      );

      window.toastify("Enrollment successful, check your dashboard", "success");
    } catch (error) {
      window.toastify("Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="layout mt-0">
      <Header className="layout-header">
        <div className="container navbar-custom">
          <div
            className={`navbar-toggle ${isNavbarOpen ? "active" : ""}`}
            onClick={toggleNavbar}
          >
            <MenuOutlined />
          </div>
          <Dropdown
            overlay={createCategoryMenu(categories, setSelectedCategory)}
          >
            <span
              className={`ant-dropdown-link navbar-category ${
                isNavbarOpen ? "active" : ""
              }`}
              onClick={(e) => e.preventDefault()}
            >
              Categories <DownOutlined />
            </span>
          </Dropdown>
          <Search
            className={`navbar-search sm-mt-4 ${isNavbarOpen ? "active" : ""}`}
            placeholder="Search courses"
            onSearch={(value) => setSearchTerm(value)}
          />
        </div>
      </Header>
      <div className="container my-3">
        <div className="row">
          <div className="col">
            <div id="hero-section">
              <div id="hero-content">
                <h1 id="hero-title">Master MERN Stack</h1>
                <p id="hero-description">
                  Become a full-stack developer by mastering MongoDB,
                  Express.js, React, and Node.js. Start your journey today and
                  build scalable, high-performance web applications.
                </p>
              </div>
              <div id="hero-image">
                <img
                  src="https://rankwinner.com/img/MERN-img.png"
                  alt="MERN Stack Development"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Content className="container-custom container">
        <section>
          <h2 className="course-section-title">All Courses</h2>
          <div className="course-grid">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course, index) => (
                <CourseCard key={index} course={course} />
              ))
            ) : (
              <p>No courses found</p>
            )}
          </div>
        </section>
        <div
          className="modal fade"
          id="staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel">
                  Details
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="modal-body">
                  <p>Are you sure you want to enroll in this course?</p>
                  <p>
                    <strong>Course Name:</strong> {selectedCourse?.name}
                  </p>
                  <p>
                    <strong>Duration:</strong> {selectedCourse?.duration}
                  </p>
                  <p>
                    <strong>Fee:</strong> {selectedCourse?.fee}
                  </p>
                  {selectedPaymentMethod && (
                    <p>
                      <strong>Selected Payment Method:</strong>{" "}
                      {selectedPaymentMethod}
                    </p>
                  )}
                </div>
                <Radio.Group
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  value={selectedPaymentMethod}
                >
                  {paymentMethods.map((method) => (
                    <div className="payment-radio" key={method.value}>
                      <Radio
                        value={method.value}
                        className="payment-radio-input"
                      >
                        <img
                          src={method.imgSrc}
                          alt={method.label}
                          className="payment-radio-image"
                        />
                        <span>{method.label}</span>
                      </Radio>
                    </div>
                  ))}
                </Radio.Group>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <Button
                    loading={loading}
                    type="submit"
                    id="s-btn"
                    onClick={() => handleEnroll(selectedCourse)}
                    data-bs-dismiss="modal"
                  >
                    Confirm Enrollment
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Main;

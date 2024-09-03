import React from "react";
//import { Link } from "react-router-dom";

export default function HomePage() {

  return (
    <div className="main-content">
      {/* Hero Section */}
      <section className="hero bg-primary text-white text-center py-5 container mt-3">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="display-4">Welcome to Your LMS</h1>
              <p className="lead">The best platform to create and manage your online courses effortlessly.</p>
              <a href="#get-started" className="btn btn-light btn-lg my-3">Get Started</a>
            </div>
            <div className="col-md-6">
              <img src="https://assets-global.website-files.com/604a97c70aee09eed25ce991/61897a35583a9b51db018d3e_MartinPublicSeating-97560-Importance-School-Library-blogbanner1.jpg" alt="LMS Overview" className="img-fluid" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features py-5" id="features">
        <div className="container">
          <h2 className="text-center mb-4">Core Features</h2>
          <div className="row">
            <div className="col-md-4 text-center">
              <img src="https://www.logintc.com/wp-content/uploads/banner.png" alt="User Authentication" className="img-fluid mb-3" />
              <h3>User Authentication</h3>
              <p>Secure sign-in, roles, and permissions management.</p>
            </div>
            <div className="col-md-4 text-center">
              <img src="https://atlas-content-cdn.pixelsquid.com/stock-images/stack-of-books-book-xwVGJW9-600.jpg" alt="Course Management" className="img-fluid mb-3" />
              <h3>Course Management</h3>
              <p>Create, edit, and publish your courses with ease.</p>
            </div>
            <div className="col-md-4 text-center">
              <img src="https://static.vecteezy.com/system/resources/previews/020/954/779/non_2x/business-chart-with-arrow-free-png.png" alt="Progress Tracking" className="img-fluid mb-3" />
              <h3>Progress Tracking</h3>
              <p>Monitor student progress and performance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services bg-light py-5" id="services">
        <div className="container">
          <h2 className="text-center mb-4">Our Services</h2>
          <div className="row">
            <div className="col-md-4 text-center">
              <img src="https://cdn-icons-png.flaticon.com/512/4423/4423859.png" alt="Course Creation" className="img-fluid mb-3" />
              <h3>Course Creation</h3>
              <p>Easily create engaging courses with multimedia content.</p>
            </div>
            <div className="col-md-4 text-center">
              <img src="https://cdn-icons-png.flaticon.com/512/2620/2620163.png" alt="Enrollment Management" className="img-fluid mb-3" />
              <h3>Enrollment Management</h3>
              <p>Seamlessly manage student enrollments and course access.</p>
            </div>
            <div className="col-md-4 text-center">
              <img src="https://cdn-icons-png.flaticon.com/512/3407/3407038.png" alt="Quizzes and Assessments" className="img-fluid mb-3" />
              <h3>Quizzes and Assessments</h3>
              <p>Evaluate student performance with interactive quizzes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="advantages py-5">
        <div className="container">
          <h2 className="text-center mb-4">Why Choose Our LMS?</h2>
          <div className="row">
            <div className="col-md-3 text-center">
              <img src="https://cdn-icons-png.flaticon.com/512/61/61457.png" alt="Security" className="img-fluid mb-3" />
              <h4>Security</h4>
              <p>Top-notch security to protect your data and content.</p>
            </div>
            <div className="col-md-3 text-center">
              <img src="https://cdn-icons-png.flaticon.com/512/4660/4660672.png" alt="Accessibility" className="img-fluid mb-3" />
              <h4>Accessibility</h4>
              <p>Accessible on all devices, ensuring learning anywhere.</p>
            </div>
            <div className="col-md-3 text-center">
              <img src="https://cdn-icons-png.flaticon.com/512/6091/6091742.png" alt="Scalability" className="img-fluid mb-3" />
              <h4>Scalability</h4>
              <p>Grow your course offerings without limitations.</p>
            </div>
            <div className="col-md-3 text-center">
              <img src="https://cdn-icons-png.flaticon.com/512/1189/1189156.png" alt="Support" className="img-fluid mb-3" />
              <h4>Support</h4>
              <p>Reliable support to assist you every step of the way.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

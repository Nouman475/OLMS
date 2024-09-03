import React, { useState, useEffect } from "react";
import { useAuthContext } from "contexts/AuthContext";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Account from "../Account/index";
import ManageStudents from "../Manage-students/index";
import EnrolledCourses from "../Enrolled-courses/index";
import TrackProgress from "../Track-progress/index";
import { UserOutlined, TeamOutlined, ShoppingCartOutlined, BarChartOutlined, MenuOutlined } from "@ant-design/icons";
import { Layout, Menu, Drawer, Button } from "antd";

const { Content, Sider } = Layout;

function getItem(label, key, icon) {
  return { key, icon, label };
}

// Define role-based menu items without the removed items
const roleBasedItems = {
  admin: [
    getItem("Manage Students", "1", <TeamOutlined />),
    getItem("Your Account", "2", <UserOutlined />),
  ],
  instructor: [
    getItem("Manage Students", "1", <TeamOutlined />),
    getItem("Your Account", "2", <UserOutlined />),
  ],
  student: [
    getItem("Enrolled Course", "1", <ShoppingCartOutlined />),
    getItem("Track Progress", "2", <BarChartOutlined />),
    getItem("Your Account", "3", <UserOutlined />),
  ],
};

export default function Home() {
  const { user } = useAuthContext();
  const [role, setRole] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [activeMenu, setActiveMenu] = useState("1");

  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        const db = getFirestore();
        const userDoc = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          const userRole = docSnap.data().role;
          setRole(userRole);
          console.log("User role fetched:", userRole);
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchRole();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setCollapsed(false);
        setDrawerVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [user]);

  const handleMenuClick = (e) => {
    setActiveMenu(e.key);
    if (drawerVisible) {
      setDrawerVisible(false);
    }
  };

  const items = roleBasedItems[role] || [];

  return (
    <main>
      <Layout style={{ minHeight: "100vh" }}>
        {!isMobile && (
          <Sider
            style={{ backgroundColor: "#000" }}
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
          >
            <div className="demo-logo-vertical" />
            <Menu
              style={{ backgroundColor: "#000" }}
              theme="dark"
              selectedKeys={[activeMenu]}
              mode="inline"
              items={items}
              onClick={handleMenuClick}
            />
          </Sider>
        )}
        <Layout style={{ backgroundColor: "#fff" }}>
          <Content style={{ margin: "0 16px" }}>
            {isMobile && (
              <Button
                type="text"
                style={{
                  position: "fixed",
                  bottom: 30,
                  right: "0",
                  transform: "translateX(-50%)",
                  background: 'linear-gradient(to right, rgb(255, 126, 95) 0%, rgb(254, 180, 123) 100%)',
                  color: "#000",
                  borderRadius: "50%",
                  padding: "20px",
                  boxShadow: "inset 0 4px 8px rgba(255, 126, 95, 0.5)",
                  zIndex: 1000,
                }}
                icon={<MenuOutlined />}
                onClick={() => setDrawerVisible(true)}
              />
            )}
            <div style={{ minHeight: 36 }}>
              {activeMenu === "1" &&
                (role === "student" ? (
                  <EnrolledCourses />
                ) : role === "admin" || role === "instructor" ? (
                  <ManageStudents />
                ) : null)}
              {activeMenu === "2" &&
                (role === "student" ? (
                  <TrackProgress />
                ) : role === "admin" || role === "instructor" ? (
                  <Account />
                ) : null)}
              {activeMenu === "3" && role === "student" && <Account />}
            </div>
          </Content>
        </Layout>
      </Layout>

      {isMobile && (
        <Drawer
          title="Menu"
          placement="bottom"
          closable={false}
          onClose={() => setDrawerVisible(false)}
          visible={drawerVisible}
          height={Math.min(window.innerHeight * 0.8, 400)}
        >
          <Menu
            style={{ backgroundColor: "#000", color: "#fff", padding: "2rem" }}
            theme="dark"
            selectedKeys={[activeMenu]}
            mode="inline"
            items={items}
            onClick={handleMenuClick}
          />
        </Drawer>
      )}
    </main>
  );
}

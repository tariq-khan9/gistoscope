import { LoadingOutlined } from "@ant-design/icons";
import { Dropdown, Menu, message, Spin } from "antd";
import Modal from "antd/lib/modal/Modal";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { Link } from "react-router-dom";
import { EditSubjects } from "./EditSubjects";
import { MoveSubjects } from "./MoveSubjects";
import { useQuery } from "@apollo/client";
import { GET_ALL_SUBJECTS } from "../../services/graphql/queriesMutations";
import { buildTree } from "../../services/utils/buildSubjectsTree";

export const TreePage = (props) => {
  const {
    data: allSubjectsData,
    loading: subjectLoading,
    error,
  } = useQuery(GET_ALL_SUBJECTS);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [subjectId, setSubjectId] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [subjects, setSubjects] = useState([]);

  //   const getAllSubjects = async () => {
  //     await axios
  //       .get(`${process.env.REACT_APP_BASE_URL}/api/subject/get`)
  //       .then((res) => {
  //         if (res.status === 200 || 304) {
  //           setSubjects(res.data);
  //         } else {
  //           message.error({
  //             content: res.data.errorMessage,
  //             style: {
  //               marginTop: "20vh",
  //             },
  //           });
  //         }
  //       });
  //   };

  //   useEffect(() => {
  //     getAllSubjects();
  //     return () => {};
  //   }, [success]);

  //   useEffect(() => {
  //     if (window.location.href.includes("confirm-email")) {
  //       return true;
  //     } else if (isAuthenticated().verification == false) {
  //       props.history.push("/verify-email");
  //     } else {
  //       return true;
  //     }

  //     return () => {};
  //   }, []);

  useEffect(() => {
    setTimeout(function () {
      window.scroll(window.screen.width / 1.5, 0);
    }, 1000);

    return () => {};
  }, []);

  useEffect(() => {
    if (allSubjectsData) {
      setSubjects(buildTree(allSubjectsData?.subjects));
      console.log("the tree data", buildTree(allSubjectsData?.subjects)); // Assign data to state when query completes
    }
  }, [allSubjectsData]);

  const showModal = () => {
    // if (!isAuthenticated()) {
    //   message.error({
    //     content: "You must be logged in to post a new subject!",
    //     style: {
    //       marginTop: "20vh",
    //     },
    //   });
    // } else {
    setIsModalVisible(true);
    //}
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };
  if (!subjectLoading) {
    console.log(allSubjectsData.subjects);
  }

  /************************************************ Submit **********************************************/
  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    let data = new FormData();
    data.append("title", subject);
    if (subjectId != null) {
      data.append("parentId", subjectId);
    }
    console.log("in the handler funciton ", data);
  };

  const deleteHandler = async () => {
    await axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/subject/delete`,
        { subjectId },
        {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          setSuccess(true);
          message.success({
            content: res.data.successMessage,
            duration: 1,
            style: {
              marginTop: "10vh",
            },
          });
          setSuccess(false);
        } else {
          message.error({
            content: res.data.errorMessage,
            duration: 1,
            style: {
              marginTop: "10vh",
            },
          });
        }
      });
  };

  const updateComponent = (data) => {
    // getAllSubjects();
  };

  const antIcon = (
    <LoadingOutlined style={{ fontSize: 30, color: "##ff3e6c" }} spin />
  );

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <Link onClick={showModal}>Add a Subject</Link>
      </Menu.Item>
      <Menu.Item key="1">{/* <PostModal subjectId={subjectId} /> */}</Menu.Item>
      <Menu.Item key="2">
        <a
          onClick={() => {
            props.history.push("/subject/" + subjectId);
          }}
        >
          View Posts
        </a>
      </Menu.Item>
      {/* {isAuthenticated().role === 1 && ( */}
      <>
        <Menu.Item key="3">
          <EditSubjects
            subjectId={subjectId}
            subjects={subjects}
            refreshFunction={updateComponent}
          />
        </Menu.Item>
        <Menu.Item key="4">
          <MoveSubjects
            subjectId={subjectId}
            subjects={subjects}
            refreshFunction={updateComponent}
          />
        </Menu.Item>
        <Menu.Item key="5">
          <Link onClick={deleteHandler}>Delete</Link>
        </Menu.Item>
      </>
      {/* )} */}
    </Menu>
  );

  const everythingMenu = (
    <Menu>
      <Menu.Item key="0">
        <Link onClick={showModal}>Add a Subject</Link>
      </Menu.Item>
      <Menu.Item key="1">{/* <PostModal subjectId={subjectId} /> */}</Menu.Item>
      <Menu.Item key="2">
        <Link to="/">View Posts</Link>
      </Menu.Item>
    </Menu>
  );

  const Children = (props) => (
    <>
      <TreeNode
        className="px-4"
        label={
          <Dropdown menu={menu} trigger={["click"]}>
            <Link
              onMouseOver={() => setSubjectId(props.children._id)}
              className=" min-w-40 px-2 m-1 block ant-dropdown-link btn-sm"
            >
              <span>{props.children.name} </span>
            </Link>
          </Dropdown>
        }
      >
        {props.children.children && (
          <Tree lineBorderRadius="10px" lineColor="gray" lineWidth="2px">
            {renderChild(props.children.children)}
          </Tree>
        )}
      </TreeNode>
    </>
  );

  if (subjectLoading) return <h1>loading...</h1>;

  const renderChild = (item) => item.map((it) => <Children children={it} />);

  const TreeView = () => {
    return (
      <div className="Tree ">
        <Tree
          lineBorderRadius="10px"
          lineColor="green"
          lineHeight="20px"
          lineWidth="3px"
          label={
            <Dropdown menu={everythingMenu} trigger={["click"]}>
              <Link
                onMouseOver={() => setSubjectId(null)}
                role="button"
                type="button"
                className="btn btn-success ant-dropdown-link btn-sm px-1"
              >
                Everything
              </Link>
            </Dropdown>
          }
        >
          {renderChild(subjects)}
        </Tree>
        {loading ? (
          <div className="text-center fixed-top" style={{ marginTop: "50vh" }}>
            <Spin indicator={antIcon} />
          </div>
        ) : (
          <Modal
            footer={false}
            title="Create a New Subject"
            open={isModalVisible}
            onCancel={handleCancel}
          >
            <form onSubmit={submitHandler} className="text-center create-posts">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  placeholder="Enter Subject Name"
                  onChange={handleSubjectChange}
                />
              </div>
              <div style={{ marginTop: "15px" }}>
                <button
                  type="submit"
                  size="large"
                  className="btn btn-outline-dark w-25"
                >
                  Submit
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    );
  };

  return <div className="pt-5">{TreeView()}</div>;
};

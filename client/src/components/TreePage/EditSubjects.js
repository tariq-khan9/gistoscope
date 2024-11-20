import { message } from "antd";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "antd/lib/modal/Modal";

export const EditSubjects = (props) => {
  const postSubject = props.subjectId;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [subjectData, setSubjectData] = useState({
    name: "",
  });

  const { name } = subjectData;

  /*********************************************** onChange *******************************************/

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubjectName = (e) => {
    setSubjectData({
      ...subjectData,
      [e.target.name]: e.target.value,
    });
  };

  const getEditCatHandler = () => {
    axios
      .get(
        `${process.env.REACT_APP_BASE_URL}/api/subject/get/edit/${postSubject}`
      )
      .then((res) => {
        if (res.status === 200) {
          setSubjectData(res.data);
        } else {
          console.log("error");
        }
      });
  };

  //   useEffect(() => {
  //     getEditCatHandler();
  //       return () => {

  //       }
  //   }, [])

  /************************************************ Submit **********************************************/
  const editHandler = (e) => {
    e.preventDefault();
    let data = new FormData();
    data.append("subjectName", name);
    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}/api/subject/update/${postSubject}`,
        data,
        {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          message.success({
            content: res.data.successMessage,
            style: {
              marginTop: "20vh",
            },
          });
          props.refreshFunction(true);
          setIsModalVisible(false);
        } else {
          message.error({
            content: res.data.errorMessage,
            style: {
              marginTop: "20vh",
            },
          });
        }
      });
  };

  return (
    <>
      <a onClick={showModal}>Edit</a>
      <Modal
        width={800}
        footer={false}
        title="Edit Subjects"
        visible={isModalVisible}
        onCancel={handleCancel}
      >
        <form
          style={{
            display: "grid",
            placeItems: "center",
            overflow: "auto",
            paddingBottom: "32px",
          }}
          onSubmit={editHandler}
        >
          <h4 className="mb-5">Edit Your Subjects</h4>
          <div className="form-group" style={{ width: "460px" }}>
            <input
              type="text"
              className="form-control mb-2 border"
              id="name"
              value={name}
              name="name"
              onChange={handleSubjectName}
            />
          </div>
          <button
            type="submit"
            className="btn btn-dark mt-4"
            style={{ width: "200px" }}
          >
            Submit
          </button>
        </form>
      </Modal>
    </>
  );
};
